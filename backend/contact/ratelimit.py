
from functools import wraps

from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse


def get_client_ip(request) -> str:
    
    if getattr(settings, "RATELIMIT_TRUST_FORWARDED_FOR", False):
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
        if forwarded:
            return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "") or "unknown"


def _parse_rate(rate: str) -> tuple[int, int]:
    """'5/h' -> (5, 3600). Supports s, m, h, d suffixes."""
    count, _, period = rate.partition("/")
    seconds = {"s": 1, "m": 60, "h": 3600, "d": 86400}[period[-1:] or "h"]
    multiplier = int(period[:-1] or "1")
    return int(count), seconds * multiplier


def rate_limit(scope: str, rate: str):
    """Decorator. Returns HTTP 429 with a JSON body once the window is spent."""

    limit, window = _parse_rate(rate)

    def decorator(view):
        @wraps(view)
        def wrapped(request, *args, **kwargs):
            if getattr(settings, "RATELIMIT_ENABLED", True):
                ip = get_client_ip(request)
                key = f"ratelimit:{scope}:{ip}"
                try:
                    added = cache.add(key, 1, timeout=window)
                    hits = 1 if added else cache.incr(key)
                except ValueError:
                    # Key expired between add() and incr(); treat as first hit.
                    cache.set(key, 1, timeout=window)
                    hits = 1
                if hits > limit:
                    response = JsonResponse(
                        {
                            "ok": False,
                            "detail": "Too many requests. Please try again later.",
                        },
                        status=429,
                    )
                    response["Retry-After"] = str(window)
                    return response
            return view(request, *args, **kwargs)

        return wrapped

    return decorator

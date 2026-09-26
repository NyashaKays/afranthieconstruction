"""Minimal CORS handling for the decoupled dev setup.

In development the Vite dev server (http://localhost:5173) talks to Django on
:8000. This middleware answers CORS preflights and adds the response headers
for origins listed in settings.CORS_ALLOWED_ORIGINS. It is intentionally tiny;
swap in django-cors-headers if the needs grow.

In production the app is same-origin (Django serves the built SPA) so this is
a no-op unless you explicitly configure cross-origin callers.
"""

from django.conf import settings
from django.http import HttpResponse

ALLOWED_HEADERS = "Content-Type, X-CSRFToken, X-Requested-With"
ALLOWED_METHODS = "GET, POST, OPTIONS"


class CorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.allowed = set(getattr(settings, "CORS_ALLOWED_ORIGINS", []))

    def __call__(self, request):
        origin = request.META.get("HTTP_ORIGIN")
        allowed = origin in self.allowed

        if request.method == "OPTIONS" and origin is not None:
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        if allowed:
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Headers"] = ALLOWED_HEADERS
            response["Access-Control-Allow-Methods"] = ALLOWED_METHODS
            response["Access-Control-Max-Age"] = "86400"
            response["Vary"] = "Origin"
        return response

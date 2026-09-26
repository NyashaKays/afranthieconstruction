import json
import logging

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .emails import send_contact_notification
from .forms import ContactForm
from .models import ContactMessage
from .ratelimit import get_client_ip, rate_limit

logger = logging.getLogger("contact")

MAX_BODY_BYTES = 16 * 1024


@require_GET
@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"csrfToken": get_token(request)})


@require_POST
@rate_limit(scope="contact", rate="5/h")
def submit(request):
    if request.content_type and "application/json" not in request.content_type:
        return JsonResponse(
            {"ok": False, "detail": "Expected application/json."}, status=415
        )

    if len(request.body) > MAX_BODY_BYTES:
        return JsonResponse({"ok": False, "detail": "Payload too large."}, status=413)

    try:
        payload = json.loads(request.body or b"{}")
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({"ok": False, "detail": "Invalid JSON."}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"ok": False, "detail": "Invalid payload."}, status=400)

    form = ContactForm(payload)
    if not form.is_valid():
        # Honeypot trip: pretend everything is fine so bots get no signal.
        if "company" in form.errors:
            logger.info("Contact honeypot tripped from %s", get_client_ip(request))
            return JsonResponse({"ok": True})
        return JsonResponse(
            {"ok": False, "errors": form.errors.get_json_data()}, status=400
        )

    data = form.cleaned_data
    message = ContactMessage.objects.create(
        name=data["name"],
        phone=data["phone"],
        email=data["email"],
        service=data["service"],
        message=data["message"],
        ip_address=get_client_ip(request) or None,
        user_agent=request.META.get("HTTP_USER_AGENT", "")[:400],
    )

    try:
        message.email_sent = send_contact_notification(message)
        message.save(update_fields=["email_sent"])
    except Exception:  # pragma: no cover - depends on SMTP host
        logger.exception("Failed to send contact notification for #%s", message.pk)

    return JsonResponse({"ok": True})

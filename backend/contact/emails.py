from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import escape


def send_contact_notification(message) -> bool:
    """Email the office about a new enquiry.

    Returns True if Django's mail backend accepted the message. Reply-To is set
    to the submitter so staff can just hit reply.
    """

    recipients = list(settings.CONTACT_RECIPIENTS)
    if not recipients:
        return False

    subject = f"{settings.EMAIL_SUBJECT_PREFIX}Quote request — {message.service}"

    lines = [
        f"Name:    {message.name}",
        f"Phone:   {message.phone}",
        f"Email:   {message.email}",
        f"Service: {message.service}",
        f"Sent:    {message.created_at:%Y-%m-%d %H:%M %Z}",
        f"IP:      {message.ip_address or 'unknown'}",
        "",
        "Message",
        "-------",
        message.message,
    ]
    text_body = "\n".join(lines)
    html_body = render_to_string(
        "contact/notification_email.html",
        {"message": message, "body_html": escape(message.message).replace("\n", "<br>")},
    )

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipients,
        reply_to=[message.email],
    )
    email.attach_alternative(html_body, "text/html")
    sent = email.send(fail_silently=False)
    return bool(sent)

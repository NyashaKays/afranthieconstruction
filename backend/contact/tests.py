import json

from django.core import mail
from django.test import Client, TestCase, override_settings
from django.urls import reverse

from .models import ContactMessage

VALID = {
    "name": "Tino Moyo",
    "phone": "+263 774 963 984",
    "email": "tino@example.com",
    "service": "Construction of Houses",
    "message": "I need a quote for a three-bedroom house in Bluffhill.",
    "company": "",
}


@override_settings(
    RATELIMIT_ENABLED=False,
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    CONTACT_RECIPIENTS=["office@example.com"],
)
class ContactSubmitTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)

    def _csrf(self):
        resp = self.client.get(reverse("contact:csrf"))
        return resp.json()["csrfToken"]

    def _post(self, body, token=None):
        return self.client.post(
            reverse("contact:submit"),
            data=json.dumps(body),
            content_type="application/json",
            **({"HTTP_X_CSRFTOKEN": token} if token else {}),
        )

    def test_valid_submission_saves_and_emails(self):
        resp = self._post(VALID, token=self._csrf())
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), {"ok": True})
        self.assertEqual(ContactMessage.objects.count(), 1)
        msg = ContactMessage.objects.get()
        self.assertTrue(msg.email_sent)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].reply_to, ["tino@example.com"])
        self.assertIn("Construction of Houses", mail.outbox[0].subject)

    def test_csrf_required(self):
        resp = self._post(VALID)
        self.assertEqual(resp.status_code, 403)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_get_not_allowed(self):
        self.assertEqual(self.client.get(reverse("contact:submit")).status_code, 405)

    def test_server_side_validation(self):
        resp = self._post({**VALID, "email": "not-an-email", "message": "too short"}, token=self._csrf())
        self.assertEqual(resp.status_code, 400)
        errors = resp.json()["errors"]
        self.assertIn("email", errors)
        self.assertIn("message", errors)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_honeypot_looks_successful_but_saves_nothing(self):
        resp = self._post({**VALID, "company": "Acme Corp"}, token=self._csrf())
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), {"ok": True})
        self.assertEqual(ContactMessage.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_non_json_rejected(self):
        token = self._csrf()
        resp = self.client.post(
            reverse("contact:submit"),
            data="name=x",
            content_type="application/x-www-form-urlencoded",
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(resp.status_code, 415)


@override_settings(
    RATELIMIT_ENABLED=True,
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    CACHES={"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache", "LOCATION": "ratelimit-test"}},
)
class RateLimitTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        from django.core.cache import cache

        cache.clear()

    def test_sixth_request_in_window_is_throttled(self):
        token = self.client.get(reverse("contact:csrf")).json()["csrfToken"]
        for _ in range(5):
            resp = self.client.post(
                reverse("contact:submit"),
                data=json.dumps(VALID),
                content_type="application/json",
                HTTP_X_CSRFTOKEN=token,
            )
            self.assertEqual(resp.status_code, 200)
        resp = self.client.post(
            reverse("contact:submit"),
            data=json.dumps(VALID),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(resp.status_code, 429)
        self.assertIn("Retry-After", resp)

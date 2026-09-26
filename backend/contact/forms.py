import re

from django import forms

_PHONE_RE = re.compile(r"^[0-9+()\-.\s]{6,30}$")
_CONTROL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def _clean_text(value: str) -> str:
    return _CONTROL_RE.sub("", value).strip()


class ContactForm(forms.Form):
    """Server-side validation for the public quote-request form.

    Mirrors the client-side constraints in the React form but is the real
    gate — the client checks are only a convenience.
    """

    name = forms.CharField(min_length=2, max_length=100)
    phone = forms.CharField(min_length=6, max_length=30)
    email = forms.EmailField(max_length=254)
    service = forms.CharField(min_length=2, max_length=120)
    message = forms.CharField(min_length=10, max_length=4000)

    # Honeypot: a real user never sees or fills this. Bots that fill every
    # field trip it. Named innocuously so it is tempting to autofill.
    company = forms.CharField(required=False)

    def clean_name(self) -> str:
        return _clean_text(self.cleaned_data["name"])

    def clean_service(self) -> str:
        return _clean_text(self.cleaned_data["service"])

    def clean_message(self) -> str:
        value = _clean_text(self.cleaned_data["message"])
        if len(value) < 10:
            raise forms.ValidationError("Please add a little more detail.")
        return value

    def clean_phone(self) -> str:
        value = _clean_text(self.cleaned_data["phone"])
        if not _PHONE_RE.match(value):
            raise forms.ValidationError("Enter a valid phone number.")
        return value

    def clean_company(self) -> str:
        # Any value here means the submission is almost certainly a bot.
        if self.cleaned_data.get("company", "").strip():
            raise forms.ValidationError("Spam detected.")
        return ""

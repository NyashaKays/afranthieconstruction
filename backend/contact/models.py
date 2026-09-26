from django.db import models


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    service = models.CharField(max_length=120)
    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=400, blank=True)

    email_sent = models.BooleanField(default=False)
    handled = models.BooleanField(
        default=False,
        help_text="Tick once this enquiry has been followed up.",
    )

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "contact message"
        verbose_name_plural = "contact messages"

    def __str__(self) -> str:
        return f"{self.name} — {self.service} ({self.created_at:%Y-%m-%d})"

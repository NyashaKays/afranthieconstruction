from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "service", "email", "phone", "created_at", "email_sent", "handled")
    list_filter = ("handled", "email_sent", "service", "created_at")
    search_fields = ("name", "email", "phone", "message", "service")
    date_hierarchy = "created_at"
    list_editable = ("handled",)
    ordering = ("-created_at",)
    readonly_fields = (
        "name", "phone", "email", "service", "message",
        "created_at", "ip_address", "user_agent", "email_sent",
    )
    fieldsets = (
        (None, {"fields": ("name", "phone", "email", "service", "message")}),
        ("Follow-up", {"fields": ("handled",)}),
        ("Metadata", {"fields": ("created_at", "email_sent", "ip_address", "user_agent")}),
    )

    def has_add_permission(self, request):
        return False

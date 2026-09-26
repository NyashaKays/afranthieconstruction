"""URL configuration for Afranthie_Backend."""

from django.contrib import admin
from django.urls import include, path, re_path

from .spa import spa

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("contact.urls")),
    # Everything else is the React SPA (and its built assets).
    re_path(r"^(?P<path>.*)$", spa, name="spa"),
]

from django.urls import path

from . import views

app_name = "contact"

urlpatterns = [
    path("csrf/", views.csrf, name="csrf"),
    path("contact/", views.submit, name="submit"),
]

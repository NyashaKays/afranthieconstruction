from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = BASE_DIR.parent

load_dotenv(BASE_DIR / ".env")


def env(key, default=None, *, required=False):
    # An empty value in .env (e.g. `DJANGO_EMAIL_BACKEND=`) means "unset" — fall
    # back to the default rather than handing settings a literal "".
    value = os.environ.get(key, "")
    if value == "":
        value = default
    if required and value in (None, ""):
        raise ImproperlyConfigured(f"Missing required environment variable: {key}")
    return value


def env_bool(key, default=False):
    return env(key, str(default)).strip().lower() in ("1", "true", "yes", "on")


def env_list(key, default=""):
    return [item.strip() for item in env(key, default).split(",") if item.strip()]


# --- Core ---------------------------------------------------------------------

DEBUG = env_bool("DJANGO_DEBUG", False)

SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    "django-insecure-dev-only-key-change-me" if DEBUG else "",
    required=not DEBUG,
)

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "contact",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "Afranthie_Backend.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if not DEBUG:
    # Serves the Django admin's static files in production (the SPA catch-all in
    # urls.py would otherwise swallow /static/). Only needed when whitenoise is
    # actually installed, so kept out of the dev middleware stack entirely.
    MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

ROOT_URLCONF = "Afranthie_Backend.urls"

# Where `npm run build` in ../frontend drops the compiled SPA.
FRONTEND_DIST = REPO_ROOT / "frontend" / "dist"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [FRONTEND_DIST],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "Afranthie_Backend.wsgi.application"
ASGI_APPLICATION = "Afranthie_Backend.asgi.application"


# --- Database ----------------------------------------------------------------

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": env("DJANGO_DB_PATH", str(BASE_DIR / "db.sqlite3")),
    }
}


# --- Cache (backs the rate limiter) -----------------------------------------

CACHES = {
    "default": {
        # LocMemCache is per-process. For multi-worker deployments set
        # DJANGO_CACHE_URL to a shared Redis/Memcached so limits are global.
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "afranthie-local",
    }
}


# --- Passwords / i18n ------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = env("DJANGO_TIME_ZONE", "Africa/Harare")
USE_I18N = True
USE_TZ = True


# --- Static files ----------------------------------------------------------

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# In production, let WhiteNoise hash + compress collected static files. Kept off
# in DEBUG so runserver doesn't need `collectstatic` first.
if not DEBUG:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# --- CORS / CSRF ----------------------------------------------------------

# Origins allowed to call the API cross-origin (dev SPA). Same-origin prod
# needs nothing here.
CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)

CSRF_TRUSTED_ORIGINS = env_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8000",
)

# The SPA reads the token from the JSON body, but the cookie must round-trip.
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SAMESITE = "Lax"


# --- Rate limiting -------------------------------------------------------

RATELIMIT_ENABLED = env_bool("DJANGO_RATELIMIT_ENABLED", True)
# Trust X-Forwarded-For only behind a proxy you control.
RATELIMIT_TRUST_FORWARDED_FOR = env_bool("DJANGO_TRUST_FORWARDED_FOR", False)


# --- Email --------------------------------------------------------------

EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND",
    "django.core.mail.backends.console.EmailBackend"
    if DEBUG
    else "django.core.mail.backends.smtp.EmailBackend",
)
EMAIL_HOST = env("DJANGO_EMAIL_HOST", "")
EMAIL_PORT = int(env("DJANGO_EMAIL_PORT", "587"))
EMAIL_HOST_USER = env("DJANGO_EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env("DJANGO_EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env_bool("DJANGO_EMAIL_USE_TLS", True)
EMAIL_USE_SSL = env_bool("DJANGO_EMAIL_USE_SSL", False)
EMAIL_TIMEOUT = 10

DEFAULT_FROM_EMAIL = env("DJANGO_DEFAULT_FROM_EMAIL", "Afranthie Website <no-reply@afranthieconstruction.co.zw>")
EMAIL_SUBJECT_PREFIX = env("DJANGO_EMAIL_SUBJECT_PREFIX", "[Afranthie] ")

# Where contact-form notifications are delivered.
CONTACT_RECIPIENTS = env_list("DJANGO_CONTACT_RECIPIENTS", "afranthie@gmail.com")


# --- Production hardening ----------------------------------------------

if not DEBUG:
    SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", True)
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = int(env("DJANGO_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"


# --- Logging ----------------------------------------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {"format": "{levelname} {asctime} {name} {message}", "style": "{"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "simple"},
    },
    "root": {"handlers": ["console"], "level": "INFO"},
    "loggers": {
        "contact": {"handlers": ["console"], "level": "INFO", "propagate": False},
        "django.request": {"handlers": ["console"], "level": "WARNING", "propagate": False},
    },
}

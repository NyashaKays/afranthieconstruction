import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv


# ---------------------------------------------------------------------------
# Paths and environment
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = BASE_DIR.parent

# Loads local development settings without overriding Vercel environment variables.
load_dotenv(BASE_DIR / ".env", override=False)


def env(key, default=None, *, required=False):
    value = os.environ.get(key, "")

    if value == "":
        value = default

    if required and value in (None, ""):
        raise ImproperlyConfigured(
            f"Missing required environment variable: {key}"
        )

    return value


def env_bool(key, default=False):
    return str(env(key, str(default))).strip().lower() in (
        "1",
        "true",
        "yes",
        "on",
    )


def env_list(key, default=""):
    return [
        item.strip()
        for item in env(key, default).split(",")
        if item.strip()
    ]


# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

DEBUG = env_bool("DJANGO_DEBUG", False)

SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    "django-insecure-dev-only-key-change-me" if DEBUG else "",
    required=not DEBUG,
)

ALLOWED_HOSTS = env_list(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1",
)

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
    "config.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if not DEBUG:
    # Requires whitenoise in requirements.txt.
    MIDDLEWARE.insert(
        1,
        "whitenoise.middleware.WhiteNoiseMiddleware",
    )

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

# Used when Django serves the built frontend.
# Separate Vercel frontend/backend services require appropriate routing;
# this path alone does not bundle the frontend into the backend.
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


# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

# Preserves your current SQLite configuration.
# For Vercel production, replace this with an external database configuration
# before relying on persistent users, sessions, or contact submissions.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": env(
            "DJANGO_DB_PATH",
            str(BASE_DIR / "db.sqlite3"),
        ),
    },
}


# ---------------------------------------------------------------------------
# Cache and rate limiting
# ---------------------------------------------------------------------------

# This cache is isolated to each process and is not a global rate limiter.
# A shared cache requires an explicit Redis/Memcached backend configuration.
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "afranthie-local",
    },
}

RATELIMIT_ENABLED = env_bool(
    "DJANGO_RATELIMIT_ENABLED",
    True,
)

# Enable only when your rate-limiter code safely handles trusted proxy headers.
RATELIMIT_TRUST_FORWARDED_FOR = env_bool(
    "DJANGO_TRUST_FORWARDED_FOR",
    False,
)


# ---------------------------------------------------------------------------
# Password validation
# ---------------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# ---------------------------------------------------------------------------
# Language and timezone
# ---------------------------------------------------------------------------

LANGUAGE_CODE = "en-us"

TIME_ZONE = env(
    "DJANGO_TIME_ZONE",
    "Africa/Harare",
)

USE_I18N = True
USE_TZ = True


# ---------------------------------------------------------------------------
# Static files
# ---------------------------------------------------------------------------

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": (
            "django.contrib.staticfiles.storage.StaticFilesStorage"
            if DEBUG
            else "whitenoise.storage.CompressedManifestStaticFilesStorage"
        ),
    },
}


# ---------------------------------------------------------------------------
# CORS and CSRF
# ---------------------------------------------------------------------------

# These CORS settings are consumed by your custom config.middleware module.
CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    (
        "http://localhost:5173,http://127.0.0.1:5173"
        if DEBUG
        else ""
    ),
)

CSRF_TRUSTED_ORIGINS = env_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    (
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "http://localhost:8000"
        if DEBUG
        else ""
    ),
)

CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SAMESITE = "Lax"


# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------

EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND",
    (
        "django.core.mail.backends.console.EmailBackend"
        if DEBUG
        else "django.core.mail.backends.smtp.EmailBackend"
    ),
)

EMAIL_HOST = env("DJANGO_EMAIL_HOST", "")
EMAIL_PORT = int(env("DJANGO_EMAIL_PORT", "587"))

EMAIL_HOST_USER = env("DJANGO_EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env("DJANGO_EMAIL_HOST_PASSWORD", "")

EMAIL_USE_TLS = env_bool("DJANGO_EMAIL_USE_TLS", True)
EMAIL_USE_SSL = env_bool("DJANGO_EMAIL_USE_SSL", False)

if EMAIL_USE_TLS and EMAIL_USE_SSL:
    raise ImproperlyConfigured(
        "Enable either DJANGO_EMAIL_USE_TLS or DJANGO_EMAIL_USE_SSL, "
        "not both."
    )

EMAIL_TIMEOUT = 10

DEFAULT_FROM_EMAIL = env(
    "DJANGO_DEFAULT_FROM_EMAIL",
    "Afranthie Website <no-reply@afranthieconstruction.co.zw>",
)

EMAIL_SUBJECT_PREFIX = env(
    "DJANGO_EMAIL_SUBJECT_PREFIX",
    "[Afranthie] ",
)

CONTACT_RECIPIENTS = env_list(
    "DJANGO_CONTACT_RECIPIENTS",
    "afranthie@gmail.com",
)


# ---------------------------------------------------------------------------
# Production security
# ---------------------------------------------------------------------------

if not DEBUG:
    SECURE_SSL_REDIRECT = env_bool(
        "DJANGO_SECURE_SSL_REDIRECT",
        True,
    )

    # Assumes the hosting proxy overwrites this header with the actual protocol.
    SECURE_PROXY_SSL_HEADER = (
        "HTTP_X_FORWARDED_PROTO",
        "https",
    )

    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # Enable HSTS after verifying HTTPS and your domain configuration.
    SECURE_HSTS_SECONDS = int(
        env("DJANGO_HSTS_SECONDS", "0")
    )
    SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool(
        "DJANGO_HSTS_INCLUDE_SUBDOMAINS",
        False,
    )
    SECURE_HSTS_PRELOAD = env_bool(
        "DJANGO_HSTS_PRELOAD",
        False,
    )

    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {
            "format": "{levelname} {asctime} {name} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "contact": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
    },
}
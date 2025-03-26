from .base import *  # noqa
from .base import env

# GENERAL
# ------------------------------------------------------------------------------
DEBUG = True
SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="Igoe6g4hVm5xFyGyA3LyVsuCmk3pWtUAd5S4JGsLdBCMJlD0devIRmCOnj9LSNKb",
)
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.102' , '192.168.1.102']  # Allow all hosts for development
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://192.168.1.102:8081",  # Frontend IP address
    "http://192.168.1.103:8081",  # Frontend IP address
]

# CACHES
# ------------------------------------------------------------------------------
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    }
}

# EMAIL
# ------------------------------------------------------------------------------
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER", None)
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD", None)
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

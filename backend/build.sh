#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

export DJANGO_SUPERUSER_USERNAME=greencore
export DJANGO_SUPERUSER_EMAIL=admin@greencore.com
export DJANGO_SUPERUSER_PASSWORD=greencore2026

python manage.py createsuperuser --noinput || true
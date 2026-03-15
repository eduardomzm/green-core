#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.filter(username='greencore').first()
if user:
    user.set_password('Admin12345')
    user.role = 'ADMIN'
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(' Contraseña y rol de Admin actualizados con éxito.')
else:
    print(' No se encontró el usuario admin.')
"
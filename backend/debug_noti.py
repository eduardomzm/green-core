import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User, Notificacion

try:
    tutor = User.objects.filter(role='TUTOR').first()
    Notificacion.objects.create(
        usuario=tutor,
        titulo="Test",
        mensaje="Prueba",
        tipo='WARNING',
        enlace='/dashboard/mi-grupo'
    )
    print("Notification created successfully")
except Exception as e:
    import traceback
    traceback.print_exc()

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import NivelConfig

niveles = [
    {'nivel': 1, 'nombre': 'Navegante', 'piezas_requeridas': 0, 'color': '#2D6A4F'},
    {'nivel': 2, 'nombre': 'Reciclador', 'piezas_requeridas': 51, 'color': '#00B4D8'},
    {'nivel': 3, 'nombre': 'Eco-Guerrero', 'piezas_requeridas': 151, 'color': '#FF9F1C'},
    {'nivel': 4, 'nombre': 'Maestro Verde', 'piezas_requeridas': 401, 'color': '#7209B7'},
]

for n in niveles:
    obj, created = NivelConfig.objects.update_or_create(
        nivel=n['nivel'],
        defaults=n
    )
    if created:
        print(f"Creado nivel {n['nivel']}: {n['nombre']}")
    else:
        print(f"Actualizado nivel {n['nivel']}: {n['nombre']}")

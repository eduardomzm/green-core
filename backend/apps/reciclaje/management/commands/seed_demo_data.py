import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.reciclaje.models import Deposito, Material

User = get_user_model()

class Command(BaseCommand):
    help = 'Semilla de datos históricos para demostración (Enero a la fecha)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clean',
            action='store_true',
            help='Limpia los datos de actividad existentes antes de sembrar (Depósitos, Notificaciones, Medallas)',
        )

    def handle(self, *args, **options):
        clean = options.get('clean')
        
        if clean:
            self.stdout.write(self.style.WARNING('Limpiando datos de actividad previos...'))
            Deposito.objects.all().delete()
            # Limpiar notificaciones y medallas también
            from apps.users.models import Notificacion, ConexionUsuario
            from apps.reciclaje.models import MedallaAlumno
            Notificacion.objects.all().delete()
            MedallaAlumno.objects.all().delete()
            ConexionUsuario.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Limpieza completada.'))

        self.stdout.write(self.style.SUCCESS('Iniciando generación de datos de demostración...'))
        
        alumnos = User.objects.filter(role='ALUMNO')
        operadores = User.objects.filter(role__in=['OPERADOR', 'ADMIN'])
        materiales = Material.objects.filter(activo=True)
        
        if not alumnos.exists() or not operadores.exists() or not materiales.exists():
            self.stdout.write(self.style.ERROR('Error: Asegúrate de tener alumnos, operadores/admins y materiales creados.'))
            return

        # Rango de fechas: Desde el 1 de Enero de 2026 hasta hoy
        # Ajustamos al año actual según el contexto del sistema
        ahora = timezone.now()
        fecha_inicio = ahora.replace(month=1, day=1, hour=10, minute=0)
        
        count = 0

        for alumno in alumnos:
            self.stdout.write(f'Generando datos para: {alumno.username}...')
            
            # Para cada alumno, generamos depósitos aleatorios semanalmente
            # para asegurar que se activen las rachas (al menos una vez por semana)
            fecha_actual = fecha_inicio
            while fecha_actual < ahora:
                # Probabilidad alta de reciclaje para que la demo se vea llena
                if random.random() < 0.9:
                    num_depositos = random.randint(1, 3)
                    for _ in range(num_depositos):
                        material = random.choice(materiales)
                        # Variar el día dentro de la semana (0 a 6 días después del inicio de la semana)
                        dias_offset = random.randint(0, 6)
                        horas_offset = random.randint(0, 8)
                        fecha_deposito = fecha_actual + timedelta(days=dias_offset, hours=horas_offset)
                        
                        if fecha_deposito > ahora:
                            continue

                        # Crear el depósito con la fecha forzada
                        dep = Deposito(
                            alumno=alumno,
                            operador=random.choice(operadores),
                            material=material,
                            cantidad=random.randint(10, 60)
                        )
                        dep.save()
                        # Forzamos la fecha creada ya que auto_now_add podría interferir si estuviera presente
                        # (aunque en nuestro modelo usamos default=timezone.now)
                        Deposito.objects.filter(id=dep.id).update(fecha=fecha_deposito)
                        
                        count += 1
                
                # Avanzar a la siguiente semana
                fecha_actual += timedelta(days=7)

        self.stdout.write(self.style.SUCCESS(f'¡Éxito! Se crearon {count} depósitos históricos desde Enero para {alumnos.count()} alumnos.'))
        self.stdout.write(self.style.SUCCESS('Ahora los rankings, rachas y reportes deberían mostrar información real.'))

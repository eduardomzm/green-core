import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.reciclaje.models import Deposito, Material

User = get_user_model()

class Command(BaseCommand):
    help = 'Genera actividad histórica realista (depósitos) para los alumnos registrados en la UI.'

    def handle(self, *args, **options):
        # 1. Validaciones de pre-requisitos
        alumnos = User.objects.filter(role='ALUMNO')
        operadores = User.objects.filter(role__in=['OPERADOR', 'ADMIN'])
        materiales = Material.objects.filter(activo=True)

        if not alumnos.exists():
            self.stdout.write(self.style.ERROR('Error: No hay alumnos registrados. Regístrate en la UI primero.'))
            return
        
        if not materiales.exists():
            self.stdout.write(self.style.ERROR('Error: No hay materiales registrados. Regístralos en la UI primero.'))
            return
            
        if not operadores.exists():
            self.stdout.write(self.style.ERROR('Error: No hay operadores para firmar los registros. Registra uno primero.'))
            return

        self.stdout.write(self.style.SUCCESS(f'Iniciando generación de datos históricos para {alumnos.count()} alumnos...'))
        
        ahora = timezone.now()
        # Fecha de inicio: 1 de Enero del año actual
        fecha_inicio = ahora.replace(month=1, day=1, hour=9, minute=0, second=0, microsecond=0)
        
        count = 0
        total_pzs = 0

        for alumno in alumnos:
            self.stdout.write(f'--- Sembrando historial para: {alumno.username} ---')
            
            # Recorremos semana a semana desde enero hasta hoy
            fecha_semanal = fecha_inicio
            while fecha_semanal < ahora:
                # 85% de probabilidad de que el alumno haya reciclado esa semana (para asegurar rachas largas)
                if random.random() < 0.85:
                    # Entre 1 y 3 depósitos por semana
                    for _ in range(random.randint(1, 3)):
                        # Día aleatorio dentro de la semana (0 a 6 días de diferencia)
                        dias_extra = random.randint(0, 6)
                        horas_extra = random.randint(0, 8)
                        fecha_final = fecha_semanal + timedelta(days=dias_extra, hours=horas_extra)
                        
                        if fecha_final > ahora:
                            continue
                            
                        material = random.choice(materiales)
                        cantidad = random.randint(10, 60) # Cantidades que ayuden a subir de nivel
                        
                        dep = Deposito(
                            alumno=alumno,
                            operador=random.choice(operadores),
                            material=material,
                            cantidad=cantidad,
                            fecha=fecha_final
                        )
                        dep.save() # Dispara signals de niveles/rachas
                        
                        count += 1
                        total_pzs += cantidad
                
                # Siguiente semana
                fecha_semanal += timedelta(days=7)

        self.stdout.write(self.style.SUCCESS(f'\n¡Éxito! Proceso completado.'))
        self.stdout.write(self.style.SUCCESS(f'Se crearon {count} depósitos con un total de {total_pzs} piezas recicladas.'))
        self.stdout.write(self.style.SUCCESS('Los rankings, medallas y niveles deberían estar actualizados ahora.'))

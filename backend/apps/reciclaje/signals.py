from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Deposito
from apps.users.models import AlumnoPerfil, NivelConfig, Notificacion
from django.db.models import Sum
import datetime

@receiver(post_save, sender=Deposito)
def actualizar_racha_y_nivel(sender, instance, created, **kwargs):
    if not created:
        return

    alumno = instance.alumno
    try:
        perfil = AlumnoPerfil.objects.get(usuario=alumno)
    except AlumnoPerfil.DoesNotExist:
        return

    # --- Lógica de Rachas ---
    hoy = timezone.now().date()
    iso_hoy = hoy.isocalendar() # (year, week, weekday)
    
    ultima_fecha = perfil.ultima_fecha_racha
    
    if not ultima_fecha:
        # Primera vez
        perfil.racha_actual = 1
        perfil.ultima_fecha_racha = hoy
    else:
        iso_ultima = ultima_fecha.isocalendar()
        
        # Diferencia de semanas
        # Simplificación: Si es el mismo año y semana + 1, o cambio de año y semana 1
        if iso_hoy[0] == iso_ultima[0]:
            if iso_hoy[1] == iso_ultima[1] + 1:
                perfil.racha_actual += 1
            elif iso_hoy[1] > iso_ultima[1] + 1:
                perfil.racha_actual = 1
            # Si es la misma semana, no hacemos nada a la racha
        else:
            # Cambio de año
            # Si la ultima fue la última semana del año y hoy es la primera del siguiente
            if iso_hoy[1] == 1 and iso_ultima[1] >= 52:
                perfil.racha_actual += 1
            else:
                perfil.racha_actual = 1
        
        perfil.ultima_fecha_racha = hoy

    if perfil.racha_actual > perfil.max_racha:
        perfil.max_racha = perfil.racha_actual

    # --- Lógica de Niveles (Opcional, pero bueno tenerlo centralizado) ---
    total_piezas = Deposito.objects.filter(alumno=alumno).aggregate(Sum('cantidad'))['cantidad__sum'] or 0
    
    # Buscar el mayor nivel que el alumno ha alcanzado
    nivel_alcanzado = NivelConfig.objects.filter(piezas_requeridas__lte=total_piezas).order_by('-nivel').first()
    
    if nivel_alcanzado and nivel_alcanzado.nivel > perfil.nivel:
        perfil.nivel = nivel_alcanzado.nivel
        # Crear notificación de nivel up
        Notificacion.objects.create(
            usuario=alumno,
            titulo="¡Subiste de Nivel! ",
            mensaje=f"Felicidades, ahora eres nivel {nivel_alcanzado.nivel}: {nivel_alcanzado.nombre}",
            tipo='ACHIEVEMENT'
        )

    perfil.save()

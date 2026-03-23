from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Deposito, MetaSistema, MetaAlumno
from .utils import calculate_streak
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

    # --- Lógica de Rachas (Utilizando la utilidad robuzta) ---
    racha = calculate_streak(alumno)
    perfil.racha_actual = racha
    
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

    # --- Lógica de Metas ---
    # Meta Sistema
    meta_sistema = MetaSistema.objects.filter(activa=True, cumplida=False).first()
    if meta_sistema:
        if meta_sistema.material:
            total_sistema = Deposito.objects.filter(material=meta_sistema.material).aggregate(Sum('cantidad'))['cantidad__sum'] or 0
        else:
            total_sistema = Deposito.objects.aggregate(Sum('cantidad'))['cantidad__sum'] or 0
        
        if total_sistema >= meta_sistema.cantidad_meta:
            meta_sistema.cumplida = True
            meta_sistema.fecha_cumplimiento = timezone.now()
            meta_sistema.save()
            
    # Meta Alumno
    metas_alumno = MetaAlumno.objects.filter(alumno=alumno, cumplida=False)
    for meta in metas_alumno:
        total_alumno = Deposito.objects.filter(alumno=alumno, material=meta.material).aggregate(Sum('cantidad'))['cantidad__sum'] or 0
        if total_alumno >= meta.cantidad_meta:
            meta.cumplida = True
            meta.fecha_cumplimiento = timezone.now()
            meta.save()
            # Notificar al alumno
            Notificacion.objects.create(
                usuario=alumno,
                titulo="¡Meta Cumplida! 🎯",
                mensaje=f"Felicidades, has alcanzado tu meta de {meta.cantidad_meta} {meta.material.nombre}.",
                tipo='SUCCESS'
            )

    perfil.save()

from datetime import datetime, date
import calendar
from django.utils import timezone
from django.db.models import Sum
from .models import Deposito, Medalla, MedallaAlumno, Material
from apps.users.models import User

def asignar_medallas_mes(year, month):
    """
    Calcula los Top 3 alumnos de manera global y por materiales 
    en el mes dado, y les asigna la medalla correspondiente a la 
    temática de ese mes.
    """
    # 1. Definir el periodo del mes
    start_date = date(year, month, 1)
    last_day = calendar.monthrange(year, month)[1]
    end_date = date(year, month, last_day)
    
    # Asegurar que el filtro cubra todo el último día sumando 1 día 
    # y comparando con < para el datetime
    mes_str = f"{year}-{month:02d}"

    # 2. Filtrar depósitos del mes
    depositos_mes = Deposito.objects.filter(
        fecha__date__gte=start_date,
        fecha__date__lte=end_date
    ).select_related('alumno')

    if not depositos_mes.exists():
        return 0  # No hay datos este mes

    medallas_asignadas = 0

    # ----- RANKING GLOBAL -----
    top_global = (
        depositos_mes
        .values('alumno_id')
        .annotate(total_piezas=Sum('cantidad'))
        .order_by('-total_piezas')[:3]
    )
    
    medallas_asignadas += _asignar_top_3(top_global, month, mes_str, categoria="Global")

    # ----- RANKING POR MATERIAL -----
    # Obtenemos todos los materiales que tuvieron depósitos este mes
    materiales_ids = depositos_mes.values_list('material_id', flat=True).distinct()
    
    for mat_id in materiales_ids:
        material = Material.objects.get(id=mat_id)
        top_material = (
            depositos_mes.filter(material_id=mat_id)
            .values('alumno_id')
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:3]
        )
        
        medallas_asignadas += _asignar_top_3(
            top_material, month, mes_str, categoria=f"Material: {material.nombre}"
        )

    return medallas_asignadas

def _asignar_top_3(top_qs, mes_int, mes_str, categoria):
    asignadas = 0
    # Posiciones: index 0 -> 1er lugar, index 1 -> 2do lugar, etc.
    for index, data in enumerate(top_qs):
        posicion = index + 1
        alumno_id = data['alumno_id']
        alumno = User.objects.get(id=alumno_id)
        
        # Buscar la medalla predefinida para este lugar y mes
        medalla = Medalla.objects.filter(
            tipo='RANKING',
            mes=mes_int,
            posicion=posicion
        ).first()
        
        if medalla:
            # Comprobar si no se ha asignado antes (Evitar duplicados)
            asignacion, creada = MedallaAlumno.objects.get_or_create(
                alumno=alumno,
                medalla=medalla,
                categoria=categoria,
                mes_obtenida=mes_str
            )
            if creada:
                asignadas += 1

    return asignadas

def comprobar_asignaciones_pendientes():
    """
    Comprueba si el mes pasado ya fue evaluado para asignar medallas.
    Si no, lo evalúa y registra.
    """
    from .models import AsignacionMedallaMes
    from django.utils import timezone
    from django.db import IntegrityError

    now = timezone.now()
    if now.month == 1:
        mes_evaluar = 12
        año_evaluar = now.year - 1
    else:
        mes_evaluar = now.month - 1
        año_evaluar = now.year
        
    if not AsignacionMedallaMes.objects.filter(año=año_evaluar, mes=mes_evaluar).exists():
        try:
            # Registrar primero para evitar condiciones de carrera (ej. React StrictMode lanza 2 peticiones a la vez)
            AsignacionMedallaMes.objects.create(año=año_evaluar, mes=mes_evaluar)
            # Ejecutar asignación de medallas para el mes de evaluación
            asignar_medallas_mes(año_evaluar, mes_evaluar)
        except IntegrityError:
            # Si alguien más ya lo insertó (otra petición simultánea), no hacemos nada
            pass


from datetime import date, timedelta
from django.utils import timezone
from .models import Deposito

def calculate_streak(user):
    """
    Calcula la racha actual de depósitos por semana ISO de un alumno.
    """
    depositos = Deposito.objects.filter(alumno=user).order_by('-fecha')
    
    # Obtener semanas únicas (año, semana ISO)
    semanas_unicas = sorted(list(set(d.fecha.isocalendar()[:2] for d in depositos)), reverse=True)
    
    if not semanas_unicas:
        return 0
        
    ahora = timezone.now().date()
    semana_actual = ahora.isocalendar()[:2]
    
    def son_consecutivas(w1, w2):
        # w1 es la más reciente (ya sea semana_actual o la primera de semanas_unicas)
        if w1[0] == w2[0]:
            return w1[1] == w2[1] + 1
        if w1[0] == w2[0] + 1:
            # Cambio de año
            if w1[1] == 1:
                ultima_semana_prev = date(w2[0], 12, 31).isocalendar()[1]
                return w2[1] == ultima_semana_prev
        return False

    mas_reciente = semanas_unicas[0]
    
    # La racha sigue viva si el último depósito fue esta semana o la anterior
    if mas_reciente == semana_actual or son_consecutivas(semana_actual, mas_reciente):
        racha = 1
        for i in range(len(semanas_unicas) - 1):
            if son_consecutivas(semanas_unicas[i], semanas_unicas[i+1]):
                racha += 1
            else:
                break
        return racha
    else:
        # Si el último depósito es más viejo que la semana pasada, la racha murió
        return 0

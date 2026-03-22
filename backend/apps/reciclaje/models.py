from django.conf import settings
from django.db import models
import random
import string

User = settings.AUTH_USER_MODEL


class Grupo(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True)

    carrera = models.ForeignKey(
        'users.Carrera',
        on_delete=models.PROTECT
    )

    tutor = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'TUTOR'}
    )

    activo = models.BooleanField(default=True)

    codigo_invitacion = models.CharField(max_length=6, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.codigo_invitacion:
            
            self.codigo_invitacion = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre} - {self.carrera.nombre}"


class Material(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    unidad = models.CharField(max_length=20, default='pieza')
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class Deposito(models.Model):
    alumno = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='depositos',
        limit_choices_to={'role': 'ALUMNO'}
    )

    operador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='depositos_registrados',
        limit_choices_to={'role__in': ['OPERADOR', 'ADMIN']}
    )

    material = models.ForeignKey(
        Material,
        on_delete=models.PROTECT
    )

    cantidad = models.PositiveIntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.alumno} - {self.material} ({self.cantidad})"


class MetaSistema(models.Model):
    nombre = models.CharField(max_length=100)
    cantidad_meta = models.PositiveIntegerField()
    activa = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} - {self.cantidad_meta}"


class MetaAlumno(models.Model):
    alumno = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='metas',
        limit_choices_to={'role': 'ALUMNO'}
    )
    material = models.ForeignKey(Material, on_delete=models.PROTECT)
    cantidad_meta = models.PositiveIntegerField()
    asignada_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='metas_asignadas',
        limit_choices_to={'role': 'TUTOR'}
    )
    creada_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Meta de {self.alumno} - {self.material} ({self.cantidad_meta})"


class Medalla(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    icono_lucide = models.CharField(max_length=50, default='Award', help_text="Nombre del icono de Lucide (ej: Award, Star, Crown)")

    def __str__(self):
        return self.nombre


class MedallaAlumno(models.Model):
    alumno = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='medallas',
        limit_choices_to={'role': 'ALUMNO'}
    )
    medalla = models.ForeignKey(Medalla, on_delete=models.CASCADE)
    mes_obtenida = models.CharField(max_length=20, help_text="Formato YYYY-MM o Nombre del Mes")
    fecha_otorgada = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.alumno} - {self.medalla.nombre} ({self.mes_obtenida})"

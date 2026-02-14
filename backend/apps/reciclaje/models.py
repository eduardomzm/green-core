from django.conf import settings
from django.db import models

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

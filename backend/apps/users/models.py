from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador'
        TUTOR = 'TUTOR', 'Tutor'
        OPERADOR = 'OPERADOR', 'Operador'
        ALUMNO = 'ALUMNO', 'Alumno'

    last_name = None  # Eliminamos el last_name por defecto

    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50, blank=True)

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.ALUMNO
    )

    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Carrera(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class AlumnoPerfil(models.Model):
    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'ALUMNO'}
    )
    matricula = models.CharField(max_length=30, unique=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.matricula


class AlumnoGrupo(models.Model):
    alumno = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'ALUMNO'}
    )

    grupo = models.ForeignKey(
        'reciclaje.Grupo',
        on_delete=models.PROTECT
    )

    def __str__(self):
        return f"{self.alumno.username} → {self.grupo.nombre}"

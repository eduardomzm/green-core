import os
import logging

logger = logging.getLogger(__name__)

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail  


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
    avatar = models.CharField(max_length=50, default='default')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Carrera(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    abreviatura = models.CharField(max_length=10, unique=True, null=True, blank=True)
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

    # Campos de perfil público / gamificación
    biografia = models.TextField(blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    twitter = models.CharField(max_length=100, blank=True)
    facebook = models.URLField(blank=True)
    nivel = models.IntegerField(default=1)

    def __str__(self):
        return self.matricula


class AlumnoGrupo(models.Model):
    class Estados(models.TextChoices):
        PENDIENTE_INGRESO = "PENDIENTE_INGRESO", "Pendiente de ingreso"
        ACTIVO = "ACTIVO", "Activo"
        PENDIENTE_SALIDA = "PENDIENTE_SALIDA", "Pendiente de salida"

    alumno = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'ALUMNO'}
    )

    grupo = models.ForeignKey(
        'reciclaje.Grupo',
        on_delete=models.PROTECT
    )

    estado = models.CharField(
        max_length=30,
        choices=Estados.choices,
        default=Estados.PENDIENTE_INGRESO,
    )

    def __str__(self):
        return f"{self.alumno.username} → {self.grupo.nombre}"



@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Esta función se dispara automáticamente cuando un usuario pide recuperar su contraseña.
    """

    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    
    if frontend_url.endswith('/'):
        frontend_url = frontend_url[:-1]
        
    reset_password_url = f"https://www.greencore.com.mx/restablecer-contrasena?token={reset_password_token.key}"

    # Construimos el correo
    email_subject = "Recuperación de Contraseña - Green Core"
    email_body = f"Hola {reset_password_token.user.first_name},\n\n" \
                 f"Has solicitado restablecer tu contraseña en Green Core.\n" \
                 f"Haz clic en el siguiente enlace para crear una nueva contraseña:\n\n" \
                 f"{reset_password_url}\n\n" \
                 f"Si no solicitaste este cambio, ignora este correo.\n\n" \
                 f"Equipo Green Core"

    
    try:
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email=None, 
            recipient_list=[reset_password_token.user.email],
            fail_silently=False
        )
        logger.info(f"Correo de recuperación enviado exitosamente a {reset_password_token.user.email}")
    except Exception as e:
        logger.error(f"Error al enviar correo de recuperación a {reset_password_token.user.email}: {str(e)}")
        # Re-lanzamos el error para que sepamos qué falló, o podemos manejarlo
        raise e

class Notificacion(models.Model):
    TIPO_CHOICES = [
        ('INFO', 'Información'),
        ('WARNING', 'Advertencia'),
        ('SUCCESS', 'Éxito'),
        ('SYSTEM', 'Sistema'),
        ('ACHIEVEMENT', 'Logro/Trofeo'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notificaciones')
    titulo = models.CharField(max_length=255)
    mensaje = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='INFO')
    leida = models.BooleanField(default=False)
    enlace = models.CharField(max_length=255, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notificacion'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Notificación: {self.titulo} - {self.usuario.username}"

class ConexionUsuario(models.Model):
    seguidor = models.ForeignKey(User, related_name='siguiendo', on_delete=models.CASCADE)
    seguido = models.ForeignKey(User, related_name='seguidores', on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'conexion_usuario'
        unique_together = ('seguidor', 'seguido')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.seguidor.username} sigue a {self.seguido.username}"
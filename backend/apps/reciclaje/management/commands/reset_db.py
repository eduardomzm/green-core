from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import Carrera, AlumnoPerfil, AlumnoGrupo, NivelConfig, Notificacion, ConexionUsuario
from apps.reciclaje.models import Grupo, Material, Deposito, MetaSistema, MetaAlumno, Medalla, MedallaAlumno, AsignacionMedallaMes

User = get_user_model()

class Command(BaseCommand):
    help = 'Limpia COMPLETAMENTE la base de datos y crea un Administrador inicial.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('--- ATENCIÓN: BORRADO TOTAL ---'))
        self.stdout.write('Este comando eliminará TODOS los registros de usuarios, depósitos, materiales, etc.')
        
        # No usamos input() directamente para evitar bloqueos en ejecuciones no interactivas si fuera el caso,
        # pero aquí en local es seguro.
        confirm = input('¿Estás SEGURO de que deseas vaciar la base de datos? (escribe "borrar" para confirmar): ')
        if confirm != 'borrar':
            self.stdout.write(self.style.ERROR('Operación cancelada.'))
            return

        self.stdout.write('Iniciando limpieza de tablas...')
        
        # El orden es importante por las relaciones de integridad
        Deposito.objects.all().delete()
        MetaAlumno.objects.all().delete()
        MetaSistema.objects.all().delete()
        MedallaAlumno.objects.all().delete()
        Medalla.objects.all().delete()
        AsignacionMedallaMes.objects.all().delete()
        
        # Eliminar relaciones de alumnos y grupos
        AlumnoGrupo.objects.all().delete()
        AlumnoPerfil.objects.all().delete()
        Grupo.objects.all().delete()
        Carrera.objects.all().delete()
        Material.objects.all().delete()
        
        # Misceláneos
        Notificacion.objects.all().delete()
        ConexionUsuario.objects.all().delete()
        NivelConfig.objects.all().delete()
        
        # Finalmente eliminamos usuarios (esto disparará CASCADE en perfiles si quedara alguno)
        User.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Base de datos vaciada con éxito.'))
        
        # Crear Superusuario por defecto
        self.stdout.write('Creando usuario Administrador inicial...')
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@greencore.com.mx',
            password='admin', 
            first_name='Administrador',
            primer_apellido='Principal',
            role='ADMIN'
        )
        self.stdout.write(self.style.SUCCESS(f'¡Listo! Usuario "{admin.username}" creado con contraseña "admin".'))
        self.stdout.write(self.style.WARNING('IMPORTANTE: Cambia la contraseña inmediatamente tras iniciar sesión.'))
        self.stdout.write('Ahora puedes proceder a registrar Materiales, Carreras y Grupos desde la interfaz.')

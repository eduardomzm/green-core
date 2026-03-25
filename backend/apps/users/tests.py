from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.users.serializers import RegistroAlumnoSerializer
from apps.users.models import AlumnoPerfil, AlumnoGrupo, Carrera
from apps.reciclaje.models import Grupo

User = get_user_model()

class UserModuleTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_creation_roles(self):
        """Prueba que el usuario se cree con el rol correcto."""
        user = User.objects.create_user(
            username='teststudent',
            email='test@example.com',
            password='password123',
            role=User.Roles.ALUMNO
        )
        self.assertEqual(user.role, 'ALUMNO')
        self.assertTrue(user.is_active)

    def test_matricula_validation(self):
        """Prueba la validación del formato de matrícula."""
        # Formato correcto: 4-5 números, 4 letras, 3 números
        data_ok = {
            'username': 'u1', 
            'first_name': 'N', 
            'primer_apellido': 'A', 
            'email': 'e1@t.com', 
            'password': 'p', 
            'matricula': '12345ABCD123'
        }
        serializer = RegistroAlumnoSerializer(data=data_ok)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Formato incorrecto
        data_bad = data_ok.copy()
        data_bad['matricula'] = '123INVALID'
        serializer = RegistroAlumnoSerializer(data=data_bad)
        self.assertFalse(serializer.is_valid())
        self.assertIn('matricula', serializer.errors)

    def test_me_view_student_status(self):
        """Prueba que MeView devuelva el grupo_estado correcto."""
        user = User.objects.create_user(
            username='student1',
            email='s1@t.com',
            password='p',
            role=User.Roles.ALUMNO
        )
        # Crear perfil de alumno (obligatorio para MeView)
        AlumnoPerfil.objects.create(usuario=user, matricula="12345ABCD123")
        
        # Simular autenticación
        self.client.force_authenticate(user=user)
        
        # Caso 1: No tiene grupo
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.data['grupo_estado'])
        
        # Caso 2: Tiene grupo pendiente
        carrera = Carrera.objects.create(nombre="Test Carrera")
        tutor = User.objects.create_user(username='tutor1', role=User.Roles.TUTOR)
        grupo = Grupo.objects.create(nombre="G1", carrera=carrera, tutor=tutor, codigo_invitacion="TESTCD")
        
        AlumnoGrupo.objects.create(alumno=user, grupo=grupo, estado='PENDIENTE_INGRESO')
        
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.data['grupo_estado'], 'PENDIENTE_INGRESO')

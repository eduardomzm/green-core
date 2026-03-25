from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.users.models import Carrera, AlumnoPerfil, AlumnoGrupo
from apps.reciclaje.models import Grupo, Material, Deposito
from django.utils import timezone

User = get_user_model()

class ReciclajeModuleTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.carrera = Carrera.objects.create(nombre="Ingeniería de Software", abreviatura="ISC")
        self.tutor = User.objects.create_user(username='tutor_r', password='p', role=User.Roles.TUTOR)
        self.grupo = Grupo.objects.create(nombre="ISC-G1", carrera=self.carrera, tutor=self.tutor, codigo_invitacion="SW1")
        
        self.student = User.objects.create_user(username='student_r', password='p', role=User.Roles.ALUMNO)
        self.perfil = AlumnoPerfil.objects.create(usuario=self.student, matricula="54321SWFT123")
        AlumnoGrupo.objects.create(alumno=self.student, grupo=self.grupo, estado='ACTIVO')
        
        self.material = Material.objects.create(nombre="PET", puntos_por_unidad=10)
        self.client.force_authenticate(user=self.student)

    def test_rankings_with_group_info(self):
        """Prueba que el ranking incluya info de carrera (abreviatura) y grupo."""
        # Crear un depósito
        Deposito.objects.create(
            alumno=self.student, 
            material=self.material, 
            cantidad=5, 
            operador=self.tutor # Usando tutor como operador para el test
        )
        
        response = self.client.get('/api/reciclaje/rankings/')
        self.assertEqual(response.status_code, 200)
        
        # Verificar que el primer resultado en top_alumnos tenga los campos esperados
        top_alumnos = response.data['top_alumnos']
        self.assertTrue(len(top_alumnos) > 0)
        
        first_student = top_alumnos[0]
        self.assertEqual(first_student['alumno__username'], 'student_r')
        self.assertEqual(first_student['alumno__alumnogrupo__grupo__nombre'], 'ISC-G1')
        self.assertEqual(first_student['alumno__alumnogrupo__grupo__carrera__abreviatura'], 'ISC')
        self.assertEqual(first_student['total_piezas'], 5)

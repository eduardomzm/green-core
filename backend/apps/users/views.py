from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .models import User, Carrera, AlumnoPerfil, AlumnoGrupo
from .serializers import (
    UserSerializer,
    CarreraSerializer,
    AlumnoPerfilSerializer,
    AlumnoGrupoSerializer,
    RegistroAlumnoSerializer,
    AdminUserManagementSerializer)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import action
from .permissions import IsAdminUserRole

class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        if 'page' not in request.query_params:
            return None
        return super().paginate_queryset(queryset, request, view)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        matricula = None
        if user.role == 'ALUMNO':
            try:
                matricula = user.alumnoperfil.matricula
            except Exception:
                pass

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "primer_apellido": user.primer_apellido,
            "segundo_apellido": user.segundo_apellido,
            "role": user.role,
            "matricula": matricula,
        })

    def patch(self, request):
        user = request.user
        data = request.data

        # Actualizar username
        if 'username' in data:
            new_username = data['username'].strip()
            if User.objects.exclude(pk=user.pk).filter(username=new_username).exists():
                return Response({"username": ["Este nombre de usuario ya está en uso."]}, status=400)
            user.username = new_username

        # Actualizar email
        if 'email' in data:
            new_email = data['email'].strip()
            if User.objects.exclude(pk=user.pk).filter(email=new_email).exists():
                return Response({"email": ["Este correo ya está en uso."]}, status=400)
            user.email = new_email

        # Cambiar contraseña
        if 'nueva_contrasena' in data:
            current = data.get('contrasena_actual', '')
            nueva = data.get('nueva_contrasena', '')
            repetir = data.get('repetir_contrasena', '')

            if not user.check_password(current):
                return Response({"contrasena_actual": ["La contraseña actual es incorrecta."]}, status=400)
            if nueva != repetir:
                return Response({"repetir_contrasena": ["Las contraseñas no coinciden."]}, status=400)
            if len(nueva) < 6:
                return Response({"nueva_contrasena": ["La contraseña debe tener al menos 6 caracteres."]}, status=400)
            user.set_password(nueva)

        user.save()

        matricula = None
        if user.role == 'ALUMNO':
            try:
                matricula = user.alumnoperfil.matricula
            except Exception:
                pass

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "primer_apellido": user.primer_apellido,
            "segundo_apellido": user.segundo_apellido,
            "role": user.role,
            "matricula": matricula,
        })


class CarreraViewSet(viewsets.ModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer


class AlumnoPerfilViewSet(viewsets.ModelViewSet):
    queryset = AlumnoPerfil.objects.all()
    serializer_class = AlumnoPerfilSerializer


class AlumnoGrupoViewSet(viewsets.ModelViewSet):
    queryset = AlumnoGrupo.objects.all()
    serializer_class = AlumnoGrupoSerializer


class RegistroAlumnoView(APIView):

    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = RegistroAlumnoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"mensaje": "Alumno registrado exitosamente. Ya puedes iniciar sesión."}, 
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar usuarios por parte del Administrador.
    Incluye soporte para paginación, búsqueda y filtros.
    """
    queryset = User.objects.all()
    pagination_class = UserPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'username', 
        'email', 
        'first_name', 
        'primer_apellido', 
        'segundo_apellido', 
        'alumnoperfil__matricula'
    ]
    ordering_fields = ['id', 'username', 'email']
    ordering = ['-id']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros manuales por parámetros de consulta
        role = self.request.query_params.get('role')
        carrera_id = self.request.query_params.get('carrera')
        grupo_id = self.request.query_params.get('grupo')

        if role:
            queryset = queryset.filter(role=role)
        
        if carrera_id:
            # Usuarios que tienen un perfil de alumno y pertenecen a un grupo de esa carrera
            queryset = queryset.filter(alumnogrupo__grupo__carrera_id=carrera_id)
            
        if grupo_id:
            queryset = queryset.filter(alumnogrupo__grupo_id=grupo_id)

        return queryset

    def get_permissions(self):
        """
        Permisos: 'me' requiere estar autenticado. Todo lo demás requiere rol ADMIN.
        """
        if self.action == 'me':
            return [IsAuthenticated()]
        return [IsAdminUserRole()]

    def get_serializer_class(self):
        """
        Usa AdminUserManagementSerializer para crear/editar usuarios.
        Usa UserSerializer para ver la lista/detalle.
        """
        if self.action in ['create', 'update', 'partial_update']:
            return AdminUserManagementSerializer
        return UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Devuelve los datos del propio usuario.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
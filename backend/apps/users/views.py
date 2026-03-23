from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Sum, Count
from apps.reciclaje.models import Deposito
from .models import User, Carrera, AlumnoPerfil, AlumnoGrupo, Notificacion, ConexionUsuario, NivelConfig
from .serializers import (
    UserSerializer,
    CarreraSerializer,
    AlumnoPerfilSerializer,
    AlumnoGrupoSerializer,
    RegistroAlumnoSerializer,
    AdminUserManagementSerializer,
    NotificacionSerializer,
    NivelConfigSerializer)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .permissions import IsAdminUserRole
from apps.reciclaje.models import MedallaAlumno
from apps.reciclaje.serializers import MedallaAlumnoSerializer

class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        if 'page' not in request.query_params:
            return None
        return super().paginate_queryset(queryset, request, view)

def get_user_level_data(user):
    """
    Calcula el nivel actual, nombre del nivel, color y progreso
    basado en las piezas totales y la configuración de niveles.
    """
    total_piezas = Deposito.objects.filter(alumno=user).aggregate(Sum('cantidad'))['cantidad__sum'] or 0
    configs = NivelConfig.objects.all().order_by('nivel')
    
    current_nivel = 1
    current_nombre = "Navegante"
    color = "#2D6A4F"
    
    # Encontrar el nivel más alto alcanzado
    for config in configs:
        if total_piezas >= config.piezas_requeridas:
            current_nivel = config.nivel
            current_nombre = config.nombre
            color = config.color
        else:
            break
            
    # Calcular porcentaje al próximo nivel
    next_config = configs.filter(nivel__gt=current_nivel).first()
    previous_config = configs.filter(nivel=current_nivel).first()
    
    base_piezas = previous_config.piezas_requeridas if previous_config else 0
    
    if next_config:
        piezas_proximo = next_config.piezas_requeridas
        dif_total = piezas_proximo - base_piezas
        dif_actual = total_piezas - base_piezas
        # Evitar división por cero si la config está mal
        if dif_total > 0:
            porcentaje = min(100, max(0, int((dif_actual / dif_total) * 100)))
        else:
            porcentaje = 0
    else:
        # Nivel máximo alcanzado
        piezas_proximo = total_piezas
        porcentaje = 100

    return {
        "nivel": current_nivel,
        "nivel_nombre": current_nombre,
        "nivel_color": color,
        "piezas_proximo_nivel": piezas_proximo,
        "porcentaje_nivel": porcentaje,
        "total_piezas": total_piezas
    }

class NivelConfigViewSet(viewsets.ModelViewSet):
    queryset = NivelConfig.objects.all()
    serializer_class = NivelConfigSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUserRole()]
        return [IsAuthenticated()]

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        matricula = None
        nivel = 1
        medallas = []

        if user.role == 'ALUMNO':
            try:
                perfil = user.alumnoperfil
                matricula = perfil.matricula
                nivel = perfil.nivel
                
                user_medallas = MedallaAlumno.objects.filter(alumno=user).select_related('medalla').order_by('-fecha_otorgada')
                medallas = MedallaAlumnoSerializer(user_medallas, many=True).data
            except Exception:
                pass

        nivel_data = get_user_level_data(user)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "primer_apellido": user.primer_apellido,
            "segundo_apellido": user.segundo_apellido,
            "role": user.role,
            "matricula": matricula,
            "avatar": user.avatar,
            "biografia": user.biografia,
            "instagram": user.instagram,
            "twitter": user.twitter,
            "facebook": user.facebook,
            "nivel": nivel_data['nivel'],
            "nivel_nombre": nivel_data['nivel_nombre'],
            "nivel_color": nivel_data['nivel_color'],
            "piezas_proximo_nivel": nivel_data['piezas_proximo_nivel'],
            "porcentaje_nivel": nivel_data['porcentaje_nivel'],
            "total_piezas_historico": nivel_data['total_piezas'],
            "medallas": medallas,
        })

    def patch(self, request):
        user = request.user
        data = request.data

        # Actualizar avatar
        if 'avatar' in data:
            user.avatar = data['avatar']

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

        # Actualizar campos sociales (ahora en User directamente)
        if 'biografia' in data:
            user.biografia = data['biografia']
        if 'instagram' in data:
            user.instagram = data['instagram']
        if 'twitter' in data:
            user.twitter = data['twitter']
        if 'facebook' in data:
            user.facebook = data['facebook']

        user.save()

        matricula = None
        nivel = 1
        medallas = []

        seguidores_count = 0
        siguiendo_count = 0
        total_depositos = 0
        total_piezas = 0

        if user.role == 'ALUMNO':
            try:
                seguidores_count = user.seguidores.count()
                siguiendo_count = user.siguiendo.count()

                agregado = Deposito.objects.filter(alumno=user).aggregate(
                    total_depositos=Count('id'),
                    total_piezas=Sum('cantidad')
                )
                total_depositos = agregado['total_depositos'] or 0
                total_piezas = agregado['total_piezas'] or 0

                perfil = user.alumnoperfil
                matricula = perfil.matricula
                nivel = perfil.nivel
                
                user_medallas = MedallaAlumno.objects.filter(alumno=user).select_related('medalla').order_by('-fecha_otorgada')
                medallas = MedallaAlumnoSerializer(user_medallas, many=True).data
            except Exception:
                pass

        nivel_data = get_user_level_data(user)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "primer_apellido": user.primer_apellido,
            "segundo_apellido": user.segundo_apellido,
            "role": user.role,
            "matricula": matricula,
            "avatar": user.avatar,
            "biografia": user.biografia,
            "instagram": user.instagram,
            "twitter": user.twitter,
            "facebook": user.facebook,
            "nivel": nivel_data['nivel'],
            "nivel_nombre": nivel_data['nivel_nombre'],
            "nivel_color": nivel_data['nivel_color'],
            "piezas_proximo_nivel": nivel_data['piezas_proximo_nivel'],
            "porcentaje_nivel": nivel_data['porcentaje_nivel'],
            "total_piezas_historico": nivel_data['total_piezas'],
            "medallas": medallas,
            "seguidores_count": seguidores_count,
            "siguiendo_count": siguiendo_count,
            "total_depositos": total_depositos,
            "total_piezas": total_piezas,
        })


class MisSeguidoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ALUMNO':
            return Response({"detail": "Solo los alumnos tienen seguidores."}, status=403)
        
        relaciones = ConexionUsuario.objects.filter(seguido=request.user).select_related('seguidor', 'seguidor__alumnoperfil')
        data = []
        for rel in relaciones:
            seguidor = rel.seguidor
            carrera = ""
            if hasattr(seguidor, 'alumnoperfil') and seguidor.alumnoperfil.carrera:
                carrera = seguidor.alumnoperfil.carrera.nombre
                
            data.append({
                "username": seguidor.username,
                "first_name": seguidor.first_name,
                "primer_apellido": seguidor.primer_apellido,
                "avatar": seguidor.avatar,
                "carrera": carrera,
                "timestamp": rel.timestamp
            })
            
        return Response(data)

class MisSiguiendoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ALUMNO':
            return Response({"detail": "Solo los alumnos siguen a otros."}, status=403)
            
        relaciones = ConexionUsuario.objects.filter(seguidor=request.user).select_related('seguido', 'seguido__alumnoperfil')
        data = []
        for rel in relaciones:
            seguido = rel.seguido
            carrera = ""
            if hasattr(seguido, 'alumnoperfil') and seguido.alumnoperfil.carrera:
                carrera = seguido.alumnoperfil.carrera.nombre
                
            data.append({
                "username": seguido.username,
                "first_name": seguido.first_name,
                "primer_apellido": seguido.primer_apellido,
                "avatar": seguido.avatar,
                "carrera": carrera,
                "timestamp": rel.timestamp
            })
            
        return Response(data)

class PublicProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        
        nivel = 1
        medallas = []
        total_depositos = 0
        total_piezas = 0

        if user.role == 'ALUMNO':
            try:
                agregado = Deposito.objects.filter(alumno=user).aggregate(
                    total_depositos=Count('id'),
                    total_piezas=Sum('cantidad')
                )
                total_depositos = agregado['total_depositos'] or 0
                total_piezas = agregado['total_piezas'] or 0
            
                perfil = getattr(user, 'alumnoperfil', None)
                if perfil:
                    nivel = perfil.nivel
                
                user_medallas = MedallaAlumno.objects.filter(alumno=user).select_related('medalla').order_by('-fecha_otorgada')
                medallas = MedallaAlumnoSerializer(user_medallas, many=True).data
            except Exception:
                pass

        # Seguidores
        seguidores_count = user.seguidores.count()
        siguiendo_count = user.siguiendo.count()
        lo_sigo = False
        if request.user.is_authenticated and request.user.role == 'ALUMNO':
            lo_sigo = ConexionUsuario.objects.filter(seguidor=request.user, seguido=user).exists()

        nivel_data = get_user_level_data(user)

        return Response({
            "username": user.username,
            "first_name": user.first_name,
            "primer_apellido": user.primer_apellido,
            "segundo_apellido": user.segundo_apellido,
            "role": user.role,
            "avatar": user.avatar,
            "biografia": user.biografia,
            "instagram": user.instagram,
            "twitter": user.twitter,
            "facebook": user.facebook,
            "nivel": nivel_data['nivel'],
            "nivel_nombre": nivel_data['nivel_nombre'],
            "nivel_color": nivel_data['nivel_color'],
            "piezas_proximo_nivel": nivel_data['piezas_proximo_nivel'],
            "porcentaje_nivel": nivel_data['porcentaje_nivel'],
            "total_piezas_historico": nivel_data['total_piezas'],
            "medallas": medallas,
            "total_depositos": total_depositos,
            "total_piezas": nivel_data['total_piezas'], # Use total_piezas from nivel_data
            "seguidores_count": seguidores_count,
            "siguiendo_count": siguiendo_count,
            "lo_sigo": lo_sigo,
        })

class BuscarAlumnosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response([])

        # Solo buscar alumnos
        busqueda = Q(role='ALUMNO') & (
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(primer_apellido__icontains=query)
        )
        # Excluir al propio usuario
        alumnos = User.objects.filter(busqueda).exclude(id=request.user.id)[:10]
        
        resultados = []
        for al in alumnos:
            carrera_nombre = ""
            try:
                if hasattr(al, 'alumnogrupo') and al.alumnogrupo is not None:
                    carrera_nombre = al.alumnogrupo.grupo.carrera.nombre
            except Exception:
                pass

            resultados.append({
                "username": al.username,
                "first_name": al.first_name,
                "primer_apellido": al.primer_apellido,
                "avatar": al.avatar,
                "carrera": carrera_nombre
            })
            
        return Response(resultados)

class ToggleSeguirView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        if request.user.role != 'ALUMNO':
            return Response({"error": "Solo alumnos pueden seguir."}, status=403)
            
        seguido = get_object_or_404(User, username=username, role='ALUMNO')
        if request.user == seguido:
            return Response({"error": "No puedes seguirte a ti mismo."}, status=400)
            
        perfil, created = ConexionUsuario.objects.get_or_create(seguidor=request.user, seguido=seguido)
        
        if not created:
            perfil.delete() # Dejar de seguir
            return Response({"status": "unfollowed"})
        else:
            # Enviar notificación de que tiene un nuevo seguidor
            Notificacion.objects.create(
                usuario=seguido,
                titulo="¡Nuevo seguidor!",
                mensaje=f"A {request.user.first_name} ({request.user.username}) le ha interesado tu perfil y ahora te sigue.",
                tipo="INFO",
                enlace=f"/dashboard/perfil/{request.user.username}"
            )
            return Response({"status": "followed"})


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
        Permisos: 'me' requiere estar autenticado. Todo lo demás requiere rol ADMIN, excepto
        'list' que también lo puede hacer el OPERADOR para buscar alumnos.
        """
        if self.action == 'me':
            return [IsAuthenticated()]
        if self.action == 'list' and self.request.user.role == 'OPERADOR':
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

class NotificacionViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notificaciones.all()

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=['patch'])
    def marcar_leida(self, request, pk=None):
        notificacion = self.get_object()
        notificacion.leida = True
        notificacion.save()
        return Response({"status": "Notificación marcada como leída"})

    @action(detail=False, methods=['post'])
    def marcar_todas_leidas(self, request):
        notificaciones = self.get_queryset().filter(leida=False)
        notificaciones.update(leida=True)
        return Response({"status": "Todas las notificaciones marcadas como leídas"})
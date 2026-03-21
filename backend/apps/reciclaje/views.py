from datetime import timedelta
from urllib import request

from apps.users.models import AlumnoGrupo

from django.db.models import Sum
from django.utils import timezone

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import filters
from apps.users.views import UserPagination

from .models import Deposito, Grupo, Material, MetaSistema, MetaAlumno
from .permissions import CanCreateDeposito, IsAdmin
from .serializers import (
                DepositoSerializer,
                GrupoSerializer,
                MaterialSerializer,
                MetaSistemaSerializer,
                MetaAlumnoSerializer,
)


class DepositoViewSet(viewsets.ModelViewSet):
    queryset = Deposito.objects.all()
    serializer_class = DepositoSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = UserPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['fecha', 'cantidad']
    ordering = ['-fecha']

    def perform_create(self, serializer):
        serializer.save(operador=self.request.user)


    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), CanCreateDeposito()]

        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]

        return [IsAuthenticated()]




    def get_queryset(self):
        user = self.request.user
        queryset = Deposito.objects.none()

        if user.role == 'ADMIN':
            queryset = Deposito.objects.all()
        elif user.role == 'OPERADOR':
            queryset = Deposito.objects.filter(operador=user)
        elif user.role == 'ALUMNO':
            queryset = Deposito.objects.filter(alumno=user)
        elif user.role == 'TUTOR':
            queryset = Deposito.objects.filter(
                alumno__alumnogrupo__grupo__tutor=user
            )

        # Filtros adicionales para ADMIN (y otros roles si se desea)
        if user.role == 'ADMIN':
            fecha = self.request.query_params.get('fecha')
            alumno_id = self.request.query_params.get('alumno')
            grupo_id = self.request.query_params.get('grupo')
            carrera_id = self.request.query_params.get('carrera')
            material_id = self.request.query_params.get('material')

            if fecha:
                queryset = queryset.filter(fecha__date=fecha)
            if alumno_id:
                queryset = queryset.filter(alumno_id=alumno_id)
            if grupo_id:
                queryset = queryset.filter(alumno__alumnogrupo__grupo_id=grupo_id)
            if carrera_id:
                queryset = queryset.filter(alumno__alumnogrupo__grupo__carrera_id=carrera_id)
            if material_id:
                queryset = queryset.filter(material_id=material_id)

        return queryset


class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    serializer_class = GrupoSerializer
    permission_classes = [IsAuthenticated]


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    
    def get_permissions(self):
        
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
    
        return [IsAuthenticated()]
    

class MetaSistemaViewSet(viewsets.ModelViewSet):
    queryset = MetaSistema.objects.all()
    serializer_class = MetaSistemaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    def perform_create(self, serializer):
        if serializer.validated_data.get('activa', True):
            MetaSistema.objects.update(activa=False)
        serializer.save()

    def perform_update(self, serializer):
        if serializer.validated_data.get('activa', True):
            MetaSistema.objects.update(activa=False)
        serializer.save()    


class EstadisticasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'ADMIN':
            depositos = Deposito.objects.all()

        elif user.role == 'OPERADOR':
            depositos = Deposito.objects.filter(operador=user)

        elif user.role == 'ALUMNO':
            depositos = Deposito.objects.filter(alumno=user)

        elif user.role == 'TUTOR':
            depositos = Deposito.objects.filter(
                alumno__alumnogrupo__grupo__tutor=user
            )

        else:
            depositos = Deposito.objects.none()

        total_piezas = depositos.aggregate(
            total=Sum('cantidad')
        )['total'] or 0

        total_depositos = depositos.count()

        return Response({
            "total_piezas": total_piezas,
            "total_depositos": total_depositos
        })


class EstadisticasMaterialView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == 'ADMIN':
            depositos = Deposito.objects.all()

        elif user.role == 'OPERADOR':
            depositos = Deposito.objects.filter(operador=user)

        elif user.role == 'ALUMNO':
            depositos = Deposito.objects.filter(alumno=user)

        elif user.role == 'TUTOR':
            depositos = Deposito.objects.filter(
                alumno__alumnogrupo__grupo__tutor=user
            )

        else:
            depositos = Deposito.objects.none()

        estadisticas = (
            depositos
            .values('material__nombre')
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')
        )

        data = [
            {
                "material": item['material__nombre'],
                "total_piezas": item['total_piezas']
            }
            for item in estadisticas
        ]

        return Response(data)


class ProgresoView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        user = request.user

        meta_obj = MetaSistema.objects.filter(activa=True).first()
        meta = meta_obj.cantidad_meta if meta_obj else 100

        if user.role == 'ADMIN':
            depositos = Deposito.objects.all()

        elif user.role == 'OPERADOR':
            depositos = Deposito.objects.filter(operador=user)

        elif user.role == 'ALUMNO':
            depositos = Deposito.objects.filter(alumno=user)

        elif user.role == 'TUTOR':
            depositos = Deposito.objects.filter(
                alumno__alumnogrupo__grupo__tutor=user
            )

        else:
            depositos = Deposito.objects.none()

        total_piezas = depositos.aggregate(
            total=Sum('cantidad')
        )['total'] or 0

        porcentaje = min(
            round((total_piezas / meta) * 100, 2),
            100
        )

        return Response({
            "meta": meta,
            "actual": total_piezas,
            "porcentaje": porcentaje
        })


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        user = request.user

        meta_obj = MetaSistema.objects.filter(activa=True).first()
        meta_actual = meta_obj.cantidad_meta if meta_obj else 100

        if user.role == 'ADMIN':
            depositos = Deposito.objects.all()
        elif user.role == 'OPERADOR':
            depositos = Deposito.objects.filter(operador=user)
        elif user.role == 'ALUMNO':
            depositos = Deposito.objects.filter(alumno=user)
        elif user.role == 'TUTOR':
            depositos = Deposito.objects.filter(
                alumno__alumnogrupo__grupo__tutor=user
            )
        else:
            depositos = Deposito.objects.none()

        total_piezas = depositos.aggregate(
            total=Sum('cantidad')
        )['total'] or 0

        total_depositos = depositos.count()

        porcentaje = min(
            round((total_piezas / meta_actual) * 100, 2),
            100
        )

        estadisticas_material = (
            depositos
            .values('material__nombre')
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')
        )

        por_material = [
            {
                "material": item['material__nombre'],
                "total_piezas": item['total_piezas']
            }
            for item in estadisticas_material
        ]

        depositos_recientes = depositos.select_related('material', 'operador', 'alumno').order_by('-fecha')[:5]
        
        ultimos_depositos = [
            {
                "id": dep.id,
                "fecha": dep.fecha.isoformat(), 
                "cantidad": dep.cantidad,
                "material": dep.material.nombre,
                "operador": dep.operador.username,
                "alumno": dep.alumno.username
            }
            for dep in depositos_recientes
        ]

        # Solo para ADMIN agrupamos los últimos usuarios
        ultimos_usuarios = []
        if user.role == 'ADMIN':
            from apps.users.models import User
            usuarios_recientes = User.objects.order_by('-date_joined')[:5]
            ultimos_usuarios = [
                {
                    "id": u.id,
                    "username": u.username,
                    "first_name": u.first_name,
                    "primer_apellido": u.primer_apellido,
                    "role": u.role,
                    "date_joined": u.date_joined.isoformat()
                }
                for u in usuarios_recientes
            ]

        return Response({
            "estadisticas": {
                "total_piezas": total_piezas,
                "total_depositos": total_depositos
            },
            "progreso": {
                "meta": meta_actual,  
                "actual": total_piezas,
                "porcentaje": porcentaje
            },
            "por_material": por_material,
            "ultimos_depositos": ultimos_depositos,
            "ultimos_usuarios": ultimos_usuarios,
            "meta_alumno": self._get_meta_alumno(user)
        })

    def _get_meta_alumno(self, user):
        if user.role != 'ALUMNO':
            return None
        meta = MetaAlumno.objects.filter(alumno=user).select_related('material').order_by('-creada_en').first()
        if not meta:
            return None
        depositos_material = Deposito.objects.filter(alumno=user, material=meta.material).aggregate(total=Sum('cantidad'))['total'] or 0
        porcentaje = min(round((depositos_material / meta.cantidad_meta) * 100, 2), 100)
        return {
            "id": meta.id,
            "material": meta.material.nombre,
            "material_unidad": meta.material.unidad,
            "cantidad_meta": meta.cantidad_meta,
            "actual": depositos_material,
            "porcentaje": porcentaje,
        }


class RankingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        generar_ranking_mensual()
        
        timeframe = request.query_params.get('timeframe', 'actual')
        
        depositos = Deposito.objects.select_related(
            "alumno", "material"
        ).prefetch_related(
            "alumno__alumnogrupo"
        )

        if timeframe == 'actual':
            now = timezone.now()
            fecha_inicio = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            depositos = depositos.filter(fecha__gte=fecha_inicio)
            
        elif timeframe == 'mensual':
            now = timezone.now()
            month_param = request.query_params.get('month')
            
            if month_param:
                try:
                    year, month = map(int, month_param.split('-'))
                    fecha_inicio = now.replace(year=year, month=month, day=1, hour=0, minute=0, second=0, microsecond=0)
                except ValueError:
                    fecha_inicio = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            else:
                if now.month == 1:
                    fecha_inicio = now.replace(year=now.year - 1, month=12, day=1, hour=0, minute=0, second=0, microsecond=0)
                else:
                    fecha_inicio = now.replace(month=now.month - 1, day=1, hour=0, minute=0, second=0, microsecond=0)

            if fecha_inicio.month == 12:
                fecha_fin = fecha_inicio.replace(year=fecha_inicio.year + 1, month=1)
            else:
                fecha_fin = fecha_inicio.replace(month=fecha_inicio.month + 1)
                
            depositos = depositos.filter(fecha__gte=fecha_inicio, fecha__lt=fecha_fin)

        top_alumnos = (
            depositos
            .values(
                'alumno__id',
                'alumno__username',
                'alumno__first_name',
                'alumno__primer_apellido'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:20]
        )

        top_grupos = (
            depositos
            .filter(alumno__alumnogrupo__isnull=False)
            .values(
                'alumno__alumnogrupo__grupo__id',
                'alumno__alumnogrupo__grupo__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:20]
        )

        top_carreras = (
            depositos
            .filter(alumno__alumnogrupo__isnull=False)
            .values(
                'alumno__alumnogrupo__grupo__carrera__id',
                'alumno__alumnogrupo__grupo__carrera__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:20]
        )

        top_materiales = (
            depositos
            .values(
                'material__id',
                'material__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:20]
        )

        return Response({
            "timeframe": timeframe,
            "top_alumnos": list(top_alumnos),
            "top_grupos": list(top_grupos),
            "top_carreras": list(top_carreras),
            "top_materiales": list(top_materiales),
        })

class MisDepositosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'ALUMNO':
            return Response(
                {"detail": "Solo los alumnos pueden acceder a esta información."},
                status=403
            )

        depositos = (
            Deposito.objects
            .filter(alumno=user)
            .select_related('operador')
            .order_by('-fecha')
        )

        data = [
            {
                "fecha": deposito.fecha,
                "cantidad": deposito.cantidad,
                "operador": deposito.operador.username
            }
            for deposito in depositos
        ]

        return Response(data)
    

class MiGrupoTutorView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'TUTOR':
            return Response({"error": "Solo tutores pueden ver esto."}, status=403)
        
        grupo = Grupo.objects.filter(tutor=user).first()
        
        if not grupo:
            return Response({"error": "Aún no tienes un grupo asignado."}, status=404)
            
        if not grupo.codigo_invitacion:
            grupo.save()
            
        alumnos_grupo = AlumnoGrupo.objects.filter(grupo=grupo).select_related('alumno')

        def alumno_to_data(ag):
            try:
                
                matricula = getattr(ag.alumno, 'matricula', None)
                if not matricula and hasattr(ag.alumno, 'alumnoperfil'):
                    matricula = ag.alumno.alumnoperfil.matricula
                
               
                nombre = getattr(ag.alumno, 'first_name', '')
                apellido = getattr(ag.alumno, 'last_name', getattr(ag.alumno, 'primer_apellido', ''))
                nombre_completo = f"{nombre} {apellido}".strip()
                
                return {
                    "id": ag.alumno.id,
                    "nombre": nombre_completo if nombre_completo else ag.alumno.username,
                    "matricula": matricula or 'Sin matrícula',
                    "username": ag.alumno.username,
                }
            except Exception as e:
                return {
                    "id": ag.alumno.id,
                    "nombre": ag.alumno.username,
                    "matricula": "Sin matrícula",
                    "username": ag.alumno.username,
                }

        alumnos_activos = []
        solicitudes_ingreso = []
        solicitudes_salida = []

        for ag in alumnos_grupo:
            data = alumno_to_data(ag)
            if ag.estado == "ACTIVO":
                alumnos_activos.append(data)
            elif ag.estado == "PENDIENTE_INGRESO":
                solicitudes_ingreso.append(data)
            elif ag.estado == "PENDIENTE_SALIDA":
                solicitudes_salida.append(data)

        return Response({
            "id": grupo.id,
            "nombre": grupo.nombre,
            "codigo_invitacion": grupo.codigo_invitacion,
            "carrera": getattr(grupo.carrera, 'nombre', "Sin carrera") if grupo.carrera else "Sin carrera",
            "alumnos_activos": alumnos_activos,
            "solicitudes_ingreso": solicitudes_ingreso,
            "solicitudes_salida": solicitudes_salida,
        })
class UnirseGrupoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != 'ALUMNO':
            return Response({"error": "Solo alumnos pueden unirse a un grupo."}, status=403)
        
        codigo = request.data.get('codigo')
        grupo = Grupo.objects.filter(codigo_invitacion=codigo).first()
        
        if not grupo:
            return Response({"error": "Código inválido o grupo inexistente."}, status=404)

        # Si el alumno ya tiene una solicitud/afiliación pendiente, reemplazamos el grupo.
        # Si está ACTIVO en otro grupo, el tutor deberá resolver (por ahora permitimos sobrescritura).
        AlumnoGrupo.objects.update_or_create(
            alumno=user,
            defaults={
                'grupo': grupo,
                'estado': 'PENDIENTE_INGRESO'
            }
        )
        
        return Response({"mensaje": f"Solicitud enviada para unirte a {grupo.nombre}."})


class SolicitarSalidaGrupoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != 'ALUMNO':
            return Response({"error": "Solo alumnos pueden solicitar salida."}, status=403)

        ag = AlumnoGrupo.objects.filter(alumno=user).first()
        if not ag:
            return Response({"error": "No tienes grupo para solicitar salida."}, status=404)

        if ag.estado != "ACTIVO":
            return Response(
                {"error": "No puedes solicitar salida en este momento."},
                status=400,
            )

        ag.estado = "PENDIENTE_SALIDA"
        ag.save(update_fields=["estado"])
        return Response({"mensaje": "Tu solicitud de salida fue enviada al tutor."})


class AutorizarIngresoGrupoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "TUTOR":
            return Response({"error": "Solo tutores pueden autorizar ingreso."}, status=403)

        alumno_id = request.data.get("alumno_id")
        if not alumno_id:
            return Response({"error": "alumno_id es requerido."}, status=400)

        grupo = Grupo.objects.filter(tutor=user).first()
        if not grupo:
            return Response({"error": "No tienes un grupo asignado."}, status=404)

        ag = AlumnoGrupo.objects.filter(alumno_id=alumno_id, grupo=grupo).first()
        if not ag:
            return Response({"error": "Solicitud no encontrada."}, status=404)

        if ag.estado != "PENDIENTE_INGRESO":
            return Response({"error": "La solicitud no está pendiente de ingreso."}, status=400)

        ag.estado = "ACTIVO"
        ag.save(update_fields=["estado"])
        return Response({"mensaje": "Ingreso autorizado."})


class AutorizarSalidaGrupoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "TUTOR":
            return Response({"error": "Solo tutores pueden autorizar salida."}, status=403)

        alumno_id = request.data.get("alumno_id")
        if not alumno_id:
            return Response({"error": "alumno_id es requerido."}, status=400)

        grupo = Grupo.objects.filter(tutor=user).first()
        if not grupo:
            return Response({"error": "No tienes un grupo asignado."}, status=404)

        ag = AlumnoGrupo.objects.filter(alumno_id=alumno_id, grupo=grupo).first()
        if not ag:
            return Response({"error": "Solicitud no encontrada."}, status=404)

        if ag.estado != "PENDIENTE_SALIDA":
            return Response({"error": "La solicitud no está pendiente de salida."}, status=400)

        ag.delete()
        return Response({"mensaje": "Salida autorizada. El alumno ya no pertenece al grupo."})


class MiGrupoAlumnoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "ALUMNO":
            return Response({"error": "Solo alumnos pueden ver esto."}, status=403)

        ag = AlumnoGrupo.objects.filter(alumno=user).select_related("grupo", "grupo__carrera").first()
        if not ag:
            return Response({"grupo": None, "estado": None})

        grupo = ag.grupo
        return Response({
            "grupo": {
                "id": grupo.id,
                "nombre": grupo.nombre,
                "codigo_invitacion": grupo.codigo_invitacion,
                "carrera": getattr(grupo.carrera, "nombre", "Sin carrera") if grupo.carrera else "Sin carrera",
                "tutor": grupo.tutor_id,
            },
            "estado": ag.estado,
        })


class AsignarMetaAlumnoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != 'TUTOR':
            return Response({'error': 'Solo los tutores pueden asignar metas.'}, status=403)

        alumno_id = request.data.get('alumno_id')
        material_id = request.data.get('material_id')
        cantidad_meta = request.data.get('cantidad_meta')

        if not alumno_id or not material_id or not cantidad_meta:
            return Response({'error': 'Faltan campos requeridos.'}, status=400)

        try:
            cantidad_meta = int(cantidad_meta)
            if cantidad_meta <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response({'error': 'La cantidad debe ser un número entero positivo.'}, status=400)

        meta = MetaAlumno.objects.create(
            alumno_id=alumno_id,
            material_id=material_id,
            cantidad_meta=cantidad_meta,
            asignada_por=user
        )
        serializer = MetaAlumnoSerializer(meta)
        return Response(serializer.data, status=201)
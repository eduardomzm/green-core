from datetime import timedelta, datetime
import calendar
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
from .utils import calculate_streak
from .permissions import CanCreateDeposito, IsAdmin
from .serializers import (
                DepositoSerializer,
                GrupoSerializer,
                MaterialSerializer,
                MetaSistemaSerializer,
                MetaAlumnoSerializer,
)
from apps.users.models import User, Notificacion
from .permissions import IsAdmin


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
        material = serializer.validated_data.get('material', None)
        if serializer.validated_data.get('activa', True):
            if material:
                MetaSistema.objects.filter(material=material).update(activa=False)
            else:
                MetaSistema.objects.filter(material__isnull=True).update(activa=False)
        serializer.save()

    def perform_update(self, serializer):
        material = serializer.validated_data.get('material', None)
        if serializer.validated_data.get('activa', True):
            if material:
                MetaSistema.objects.filter(material=material).update(activa=False)
            else:
                MetaSistema.objects.filter(material__isnull=True).update(activa=False)
        serializer.save()    


class MetaAlumnoViewSet(viewsets.ModelViewSet):
    queryset = MetaAlumno.objects.all()
    serializer_class = MetaAlumnoSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return MetaAlumno.objects.select_related('alumno', 'material').order_by('-creada_en')


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

        meta_obj = MetaSistema.objects.filter(activa=True, cumplida=False).first()
        # Si no hay una activa sin cumplir, buscamos la última cumplida para mostrar el 100%
        if not meta_obj:
            meta_obj = MetaSistema.objects.filter(activa=True, cumplida=True).order_by('-fecha_cumplimiento').first()
        
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
        from .services import comprobar_asignaciones_pendientes
        comprobar_asignaciones_pendientes()


    def get(self, request):
        user = request.user

        meta_obj = MetaSistema.objects.filter(activa=True, cumplida=False).first()
        if not meta_obj:
            meta_obj = MetaSistema.objects.filter(activa=True, cumplida=True).order_by('-fecha_cumplimiento').first()
            
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

        # Métricas adicionales para el administrador
        total_alumnos = User.objects.filter(role='ALUMNO').count() if user.role == 'ADMIN' else 0
        alumnos_participantes = depositos.values('alumno').distinct().count() if user.role == 'ADMIN' else 0
        material_top = por_material[0]['material'] if por_material else "N/A"

        return Response({
            "estadisticas": {
                "total_piezas": total_piezas,
                "total_depositos": total_depositos,
                "total_alumnos": total_alumnos,
                "alumnos_participantes": alumnos_participantes,
                "material_top": material_top
            },
            "progreso": {
                "meta": meta_actual,  
                "actual": total_piezas,
                "porcentaje": porcentaje
            },
            "por_material": por_material,
            "ultimos_depositos": ultimos_depositos,
            "ultimos_usuarios": ultimos_usuarios,
            "meta_alumno": self._get_meta_alumno(user),
            "semanas_racha": self._get_semanas_racha(user),
            "racha_actual": self._sync_racha(user) if user.role == 'ALUMNO' else 0
        })

    def _sync_racha(self, user):
        from apps.users.models import AlumnoPerfil
        perfil = AlumnoPerfil.objects.filter(usuario=user).first()
        if not perfil:
            return 0
        nueva_racha = calculate_streak(user)
        if perfil.racha_actual != nueva_racha:
            perfil.racha_actual = nueva_racha
            if nueva_racha > perfil.max_racha:
                perfil.max_racha = nueva_racha
            perfil.save(update_fields=['racha_actual', 'max_racha'])
        return perfil.racha_actual

    def _get_meta_alumno(self, user):
        if user.role != 'ALUMNO':
            return None
        # Primero buscamos una meta activa sin cumplir
        meta = MetaAlumno.objects.filter(alumno=user, cumplida=False).select_related('material').order_by('creada_en').first()
        
        # Si no hay, buscamos la última cumplida (opcional, para visualización de éxito)
        if not meta:
            meta = MetaAlumno.objects.filter(alumno=user, cumplida=True).select_related('material').order_by('-fecha_cumplimiento').first()
            
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

    def _get_semanas_racha(self, user):
        if user.role != 'ALUMNO':
            return []
        
        from datetime import date, timedelta
        now = timezone.now().date()
        
        # Determinar el mes objetivo basado en el jueves de la semana actual (lógica ISO)
        # 1=Lunes, 7=Domingo
        dia_semana_hoy = now.isoweekday()
        jueves_actual = now + timedelta(days=(4 - dia_semana_hoy))
        target_year = jueves_actual.year
        target_month = jueves_actual.month
        
        # Primer jueves del mes objetivo para encontrar la primera semana ISO
        primer_dia_mes = date(target_year, target_month, 1)
        # weekday(): 0=Mon, ..., 6=Sun
        primer_jueves = primer_dia_mes + timedelta(days=(3 - primer_dia_mes.weekday() + 7) % 7)
        
        # Lunes de esa primera semana ISO
        lunes_inicio = primer_jueves - timedelta(days=3)
        
        weeks_data = []
        for i in range(4):
            inicio = lunes_inicio + timedelta(weeks=i)
            fin = inicio + timedelta(days=6)
            
            tiene_deposito = Deposito.objects.filter(
                alumno=user,
                fecha__date__range=[inicio, fin]
            ).exists()
            
            es_actual = inicio <= now <= fin
            
            weeks_data.append({
                "n_semana": i + 1,
                "inicio": inicio.isoformat(),
                "fin": fin.isoformat(),
                "activa": tiene_deposito,
                "es_actual": es_actual
            })
        return weeks_data


class RankingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        
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

        # Restricción para Tutores: solo ven datos de su grupo
        if request.user.role == 'TUTOR':
            depositos = depositos.filter(alumno__alumnogrupo__grupo__tutor=request.user)

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

from rest_framework.pagination import PageNumberPagination

class MisDepositosPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

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
            .select_related('operador', 'material')
            .order_by('-fecha')
        )

        material_id = request.query_params.get('material')
        if material_id:
            depositos = depositos.filter(material_id=material_id)
        
        fecha = request.query_params.get('fecha')
        if fecha:
            depositos = depositos.filter(fecha__date=fecha)

        paginator = MisDepositosPagination()
        paginated_depositos = paginator.paginate_queryset(depositos, request)

        data = [
            {
                "id": deposito.id,
                "fecha": deposito.fecha,
                "cantidad": deposito.cantidad,
                "operador": deposito.operador.username,
                "material_nombre": deposito.material.nombre
            }
            for deposito in paginated_depositos
        ]

        return paginator.get_paginated_response(data)


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
                apellido = getattr(ag.alumno, 'primer_apellido', '')
                if not apellido or apellido == 'None':
                    apellido = ''
                nombre_completo = f"{nombre} {apellido}".strip()
                
                # Obtener metas activas del alumno
                metas_qs = MetaAlumno.objects.filter(alumno=ag.alumno).select_related('material')
                metas_data = []
                for meta in metas_qs:
                    metas_data.append({
                        "id": meta.id,
                        "material_id": meta.material.id,
                        "material_nombre": meta.material.nombre,
                        "cantidad_meta": meta.cantidad_meta,
                        "creada_en": meta.creada_en,
                    })

                return {
                    "id": ag.alumno.id,
                    "nombre": nombre_completo if nombre_completo else ag.alumno.username,
                    "matricula": matricula or 'Sin matrícula',
                    "username": ag.alumno.username,
                    "avatar": ag.alumno.avatar,
                    "metas": metas_data,
                }
            except Exception as e:
                return {
                    "id": ag.alumno.id,
                    "nombre": ag.alumno.username,
                    "matricula": "Sin matrícula",
                    "username": ag.alumno.username,
                    "avatar": "default",
                    "metas": []
                }

        alumnos_activos = []
        solicitudes_ingreso = []
        solicitudes_salida = []

        alumnos_ids_activos = []

        for ag in alumnos_grupo:
            data = alumno_to_data(ag)
            if ag.estado == "ACTIVO":
                alumnos_activos.append(data)
                alumnos_ids_activos.append(ag.alumno.id)
            elif ag.estado == "PENDIENTE_INGRESO":
                solicitudes_ingreso.append(data)
            elif ag.estado == "PENDIENTE_SALIDA":
                solicitudes_salida.append(data)

        actividad_data = []
        depositos_recientes = Deposito.objects.filter(alumno_id__in=alumnos_ids_activos).select_related('alumno', 'material').order_by('-fecha')[:30]
        for dep in depositos_recientes:
            actividad_data.append({
                "id": dep.id,
                "alumno_username": dep.alumno.username,
                "alumno_nombre": dep.alumno.first_name,
                "alumno_avatar": dep.alumno.avatar,
                "material_nombre": dep.material.nombre,
                "cantidad": dep.cantidad,
                "fecha": dep.fecha
            })

        return Response({
            "id": grupo.id,
            "nombre": grupo.nombre,
            "codigo_invitacion": grupo.codigo_invitacion,
            "carrera": getattr(grupo.carrera, 'nombre', "Sin carrera") if grupo.carrera else "Sin carrera",
            "alumnos_activos": alumnos_activos,
            "solicitudes_ingreso": solicitudes_ingreso,
            "solicitudes_salida": solicitudes_salida,
            "actividad_reciente": actividad_data,
        })

class CancelarMetaAlumnoView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, meta_id):
        user = request.user
        if user.role != 'TUTOR':
            return Response({'error': 'Solo los tutores pueden cancelar metas.'}, status=403)
            
        meta = MetaAlumno.objects.filter(id=meta_id).first()
        if not meta:
            return Response({'error': 'Meta no encontrada.'}, status=404)
            
        # Optional: verify if the meta belongs to an alumno of this tutor's group
        grupo = Grupo.objects.filter(tutor=user).first()
        if not grupo:
            return Response({'error': 'No tienes un grupo asignado.'}, status=404)
            
        is_in_group = AlumnoGrupo.objects.filter(alumno=meta.alumno, grupo=grupo, estado="ACTIVO").exists()
        if not is_in_group:
            return Response({'error': 'El alumno no pertenece a tu grupo o no está activo.'}, status=403)
            
        meta.delete()
        return Response({'mensaje': 'Meta cancelada exitosamente.'})
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
        
        Notificacion.objects.create(
            usuario=grupo.tutor,
            titulo="Nueva Solicitud de Ingreso",
            mensaje=f"El alumno {user.first_name} {user.primer_apellido} (@{user.username}) quiere unirse a tu grupo.",
            tipo='INFO',
            enlace='/dashboard/mi-grupo'
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

        Notificacion.objects.create(
            usuario=ag.grupo.tutor,
            titulo="Solicitud de Abandono",
            mensaje=f"El alumno {user.first_name} {user.primer_apellido} (@{user.username}) ha solicitado salir de tu grupo.",
            tipo='WARNING',
            enlace='/dashboard/mi-grupo'
        )

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

        Notificacion.objects.create(
            usuario=ag.alumno,
            titulo="¡Bienvenido al grupo!",
            mensaje=f"El tutor {user.first_name} ha aprobado tu ingreso al grupo {grupo.nombre}.",
            tipo='SUCCESS',
            enlace='/dashboard/mi-grupo'
        )

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

        
        alumno_notificado = ag.alumno
        grupo_nombre = grupo.nombre
        ag.delete()

        Notificacion.objects.create(
            usuario=alumno_notificado,
            titulo="Salida de Grupo Aprobada",
            mensaje=f"El tutor {user.first_name} ha aprobado tu salida del grupo {grupo_nombre}.",
            tipo='INFO',
            enlace='/dashboard/mi-grupo/unirse'
        )

        return Response({"mensaje": "Salida autorizada. El alumno ya no pertenece al grupo."})


class RechazarIngresoGrupoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "TUTOR":
            return Response({"error": "Solo tutores pueden rechazar ingreso."}, status=403)

        alumno_id = request.data.get("alumno_id")
        if not alumno_id:
            return Response({"error": "alumno_id es requerido."}, status=400)

        grupo = Grupo.objects.filter(tutor=user).first()
        if not grupo:
            return Response({"error": "No tienes un grupo asignado."}, status=404)

        ag = AlumnoGrupo.objects.filter(alumno_id=alumno_id, grupo=grupo).first()
        if not ag or ag.estado != "PENDIENTE_INGRESO":
            return Response({"error": "Solicitud no encontrada o no está pendiente de ingreso."}, status=400)

        alumno_notificado = ag.alumno
        grupo_nombre = grupo.nombre
        ag.delete()

        Notificacion.objects.create(
            usuario=alumno_notificado,
            titulo="Solicitud de Ingreso Rechazada",
            mensaje=f"El tutor {user.first_name} ha denegado tu ingreso al grupo {grupo_nombre}.",
            tipo='WARNING',
            enlace='/dashboard/mi-grupo/unirse'
        )

        return Response({"mensaje": "Ingreso rechazado. La solicitud ha sido eliminada."})


class RechazarSalidaGrupoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "TUTOR":
            return Response({"error": "Solo tutores pueden rechazar salida."}, status=403)

        alumno_id = request.data.get("alumno_id")
        if not alumno_id:
            return Response({"error": "alumno_id es requerido."}, status=400)

        grupo = Grupo.objects.filter(tutor=user).first()
        if not grupo:
            return Response({"error": "No tienes un grupo asignado."}, status=404)

        ag = AlumnoGrupo.objects.filter(alumno_id=alumno_id, grupo=grupo).first()
        if not ag or ag.estado != "PENDIENTE_SALIDA":
            return Response({"error": "Solicitud no encontrada o no está pendiente de salida."}, status=400)

        ag.estado = "ACTIVO"
        ag.save(update_fields=["estado"])

        Notificacion.objects.create(
            usuario=ag.alumno,
            titulo="Solicitud de Abandono Denegada",
            mensaje=f"El tutor {user.first_name} ha rechazado tu petición de salida del grupo {grupo.nombre}.",
            tipo='WARNING',
            enlace='/dashboard/mi-grupo'
        )

        return Response({"mensaje": "Salida rechazada. El alumno vuelve a estar activo en el grupo."})


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
        
        tutor_data = None
        companeros_data = []
        actividad_data = []

        if ag.estado == "ACTIVO":
            tutor = grupo.tutor
            tutor_data = {
                "id": tutor.id,
                "nombre": tutor.first_name,
                "apellidos": tutor.primer_apellido,
                "avatar": tutor.avatar,
                "email": tutor.email
            }
            
            companeros = AlumnoGrupo.objects.filter(grupo=grupo, estado="ACTIVO").exclude(alumno=user).select_related('alumno')
            for comp in companeros:
                nivel = 1
                if hasattr(comp.alumno, 'alumnoperfil'):
                    nivel = comp.alumno.alumnoperfil.nivel
                companeros_data.append({
                    "id": comp.alumno.id,
                    "username": comp.alumno.username,
                    "nombre": comp.alumno.first_name,
                    "apellidos": comp.alumno.primer_apellido,
                    "avatar": comp.alumno.avatar,
                    "nivel": nivel
                })
                
            alumnos_ids = AlumnoGrupo.objects.filter(grupo=grupo, estado="ACTIVO").values_list('alumno_id', flat=True)
            depositos_recientes = Deposito.objects.filter(alumno_id__in=alumnos_ids).select_related('alumno', 'material').order_by('-fecha')[:30]
            for dep in depositos_recientes:
                actividad_data.append({
                    "id": dep.id,
                    "alumno_username": dep.alumno.username,
                    "alumno_nombre": dep.alumno.first_name,
                    "alumno_avatar": dep.alumno.avatar,
                    "material_nombre": dep.material.nombre,
                    "cantidad": dep.cantidad,
                    "fecha": dep.fecha
                })

        return Response({
            "grupo": {
                "id": grupo.id,
                "nombre": grupo.nombre,
                "codigo_invitacion": grupo.codigo_invitacion,
                "carrera": getattr(grupo.carrera, "nombre", "Sin carrera") if grupo.carrera else "Sin carrera",
                "tutor": grupo.tutor_id,
                "tutor_info": tutor_data
            },
            "estado": ag.estado,
            "companeros": companeros_data,
            "actividad_reciente": actividad_data
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


class CorteMensualView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        user = request.user
        medalla_id = request.data.get('medalla_id')
        mes = request.data.get('mes')  # e.g., '2026-03' o 'Marzo 2026'

        if not medalla_id or not mes:
            return Response({'error': 'medalla_id y mes son requeridos.'}, status=400)

        from .models import Medalla, MedallaAlumno
        try:
            medalla = Medalla.objects.get(id=medalla_id)
        except Medalla.DoesNotExist:
            return Response({'error': 'Medalla no encontrada.'}, status=404)

        # Determinar inicio y fin del mes actual (o el provisto)
        now = timezone.now()
        fecha_inicio = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if fecha_inicio.month == 12:
            fecha_fin = fecha_inicio.replace(year=fecha_inicio.year + 1, month=1)
        else:
            fecha_fin = fecha_inicio.replace(month=fecha_inicio.month + 1)

        # Obtener los top 3 alumnos del mes
        top_alumnos = (
            Deposito.objects
            .filter(fecha__gte=fecha_inicio, fecha__lt=fecha_fin)
            .values('alumno_id')
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:3]
        )

        premiados = []
        for index, item in enumerate(top_alumnos):
            alumno_id = item['alumno_id']
            # Asignar medalla si no la tiene para ese mes
            if not MedallaAlumno.objects.filter(alumno_id=alumno_id, medalla=medalla, mes_obtenida=mes).exists():
                MedallaAlumno.objects.create(
                    alumno_id=alumno_id,
                    medalla=medalla,
                    mes_obtenida=mes
                )
                premiados.append(alumno_id)

        # Devolver respuesta con éxito
        alumnos_premiados = User.objects.filter(id__in=premiados).values('id', 'username', 'first_name', 'primer_apellido')
        
        return Response({
            'mensaje': 'Corte mensual exitoso. Medallas entregadas.',
            'top_3_encontrados': len(top_alumnos),
            'medallas_entregadas': len(premiados),
            'premiados': list(alumnos_premiados)
        }, status=200)

class MedallasDisponiblesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from .models import Medalla
        from .serializers import MedallaSerializer
        medallas = Medalla.objects.all()
        return Response(MedallaSerializer(medallas, many=True).data)

class MisMedallasView(APIView):
    """
    Retorna la lista de medallas que el usuario autenticado (ALUMNO) ha obtenido.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'ALUMNO':
            return Response({"error": "Solo los alumnos tienen medallas."}, status=403)
        
        from .models import MedallaAlumno
        from .serializers import MedallaAlumnoSerializer
        
        medallas = MedallaAlumno.objects.filter(alumno=user).order_by('-fecha_otorgada')
        serializer = MedallaAlumnoSerializer(medallas, many=True)
        return Response(serializer.data, status=200)

class AsignarMedallasMensualesView(APIView):
    """
    Endpoint para uso de un Administrador u Operador para disparar
    el cálculo automático de medallas temáticas de un mes.
    Requiere `mes` (int 1-12) y `año` (int) en el body.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        year = request.data.get('año')
        month = request.data.get('mes')

        if not year or not month:
            return Response({'error': 'año y mes son parámetros requeridos.'}, status=400)
        
        try:
            year = int(year)
            month = int(month)
        except ValueError:
            return Response({'error': 'año y mes deben ser numéricos.'}, status=400)
            
        from .services import asignar_medallas_mes
        try:
            cantidad_asignada = asignar_medallas_mes(year, month)
            return Response({'mensaje': f'Asignación completada. Se entregaron {cantidad_asignada} medallas.'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

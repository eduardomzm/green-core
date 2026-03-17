from datetime import timedelta
from urllib import request

from apps.users.models import AlumnoGrupo
from .utils import generar_ranking_mensual
from django.db.models import Sum
from django.utils import timezone

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Deposito, Grupo, Material, MetaSistema, RankingMensual
from .permissions import CanCreateDeposito, IsAdmin
from .serializers import (
                DepositoSerializer,
                GrupoSerializer,
                MaterialSerializer,
                MetaSistemaSerializer,
)


class DepositoViewSet(viewsets.ModelViewSet):
    queryset = Deposito.objects.all()
    serializer_class = DepositoSerializer
    permission_classes = [IsAuthenticated]

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

        if user.role == 'ADMIN':
            return Deposito.objects.all()

        if user.role == 'OPERADOR':
            return Deposito.objects.filter(operador=user)

        if user.role == 'ALUMNO':
            return Deposito.objects.filter(alumno=user)

        if user.role == 'TUTOR':
            return Deposito.objects.filter(
                alumno__alumnogrupo__grupo__tutor=user
            )

        return Deposito.objects.none()


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

        depositos_recientes = depositos.select_related('material', 'operador').order_by('-fecha')[:50]
        
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
            "ultimos_depositos": ultimos_depositos 
        })

class RankingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        generar_ranking_mensual()

        timeframe = request.query_params.get("timeframe", "general")

        depositos = Deposito.objects.select_related(
            "alumno", "material"
        ).prefetch_related(
            "alumno__alumnogrupo"
        )

        if timeframe == "mensual":
            now = timezone.now()
            inicio = now.replace(
                day=1,
                hour=0,
                minute=0,
                second=0,
                microsecond=0
            )
            depositos = depositos.filter(fecha__gte=inicio)

        # 🔹 ALUMNOS
        top_alumnos = list(
            depositos
            .values(
                'alumno__first_name',
                'alumno__username'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:10]
        )

        # 🔹 GRUPOS
        top_grupos = list(
            depositos
            .values(
                'alumno__alumnogrupo__grupo__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:10]
        )

        # 🔹 CARRERAS
        top_carreras = list(
            depositos
            .values(
                'alumno__alumnogrupo__grupo__carrera__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:10]
        )

        # 🔹 MATERIALES
        top_materiales = list(
            depositos
            .values(
                'material__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:10]
        )

        return Response({
            "timeframe": timeframe,
            "top_alumnos": top_alumnos,
            "top_grupos": top_grupos,
            "top_carreras": top_carreras,
            "top_materiales": top_materiales
        })


class HistorialRankingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        mes = request.query_params.get("mes")
        anio = request.query_params.get("anio")

        if not mes or not anio:
            return Response(
                {"error": "Debes enviar mes y anio"},
                status=400
            )

        ranking = RankingMensual.objects.filter(
            mes=mes,
            anio=anio
        ).first()

        if not ranking:
            return Response(
                {
                    "timeframe": "historial",
                    "top_alumnos": [],
                    "top_grupos": [],
                    "top_carreras": [],
                    "top_materiales": []
                }
            )

        return Response({
            "timeframe": "historial",
            "top_alumnos": ranking.datos.get("top_alumnos", []),
            "top_grupos": ranking.datos.get("top_grupos", []),
            "top_carreras": ranking.datos.get("top_carreras", []),
            "top_materiales": ranking.datos.get("top_materiales", [])
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
        
        alumnos_grupo = AlumnoGrupo.objects.filter(grupo=grupo).select_related('alumno')
        alumnos_data = [{
            "id": ag.alumno.id,
            "nombre": f"{ag.alumno.first_name} {ag.alumno.primer_apellido}",
            "matricula": ag.alumno.matricula,
            "username": ag.alumno.username
        } for ag in alumnos_grupo]

        return Response({
            "id": grupo.id,
            "nombre": grupo.nombre,
            "codigo_invitacion": grupo.codigo_invitacion,
            "carrera": grupo.carrera.nombre if grupo.carrera else "Sin carrera",
            "alumnos": alumnos_data
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
        
        AlumnoGrupo.objects.update_or_create(
            alumno=user,
            defaults={'grupo': grupo}
        )
        
        return Response({"mensaje": f"¡Te has unido a {grupo.nombre} exitosamente!"})
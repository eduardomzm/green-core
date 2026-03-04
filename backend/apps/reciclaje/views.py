from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Deposito, Grupo, Material, MetaSistema
from .serializers import GrupoSerializer, MaterialSerializer, DepositoSerializer, MetaSistemaSerializer
from .permissions import IsAdmin, CanCreateDeposito
from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response



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
            "por_material": por_material
        })
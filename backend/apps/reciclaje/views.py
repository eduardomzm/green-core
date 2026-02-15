from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Deposito, Grupo, Material
from .serializers import GrupoSerializer, MaterialSerializer, DepositoSerializer
from .permissions import IsAdmin, CanCreateDeposito


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
    permission_classes = [IsAuthenticated]

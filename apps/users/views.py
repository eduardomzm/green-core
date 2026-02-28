from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User, Carrera, AlumnoPerfil, AlumnoGrupo
from .serializers import (
    UserSerializer,
    CarreraSerializer,
    AlumnoPerfilSerializer,
    AlumnoGrupoSerializer,)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class CarreraViewSet(viewsets.ModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer


class AlumnoPerfilViewSet(viewsets.ModelViewSet):
    queryset = AlumnoPerfil.objects.all()
    serializer_class = AlumnoPerfilSerializer


class AlumnoGrupoViewSet(viewsets.ModelViewSet):
    queryset = AlumnoGrupo.objects.all()
    serializer_class = AlumnoGrupoSerializer

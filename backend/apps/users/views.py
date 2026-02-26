from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User, Carrera, AlumnoPerfil, AlumnoGrupo
from .serializers import (
    UserSerializer,
    CarreraSerializer,
    AlumnoPerfilSerializer,
    AlumnoGrupoSerializer,
    RegistroAlumnoSerializer)

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "role": user.role,
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
   
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
   
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Devuelve los datos del usuario que tiene la sesión iniciada (el dueño del token).
        """
    
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
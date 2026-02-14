from rest_framework import serializers
from .models import User, Carrera, AlumnoPerfil, AlumnoGrupo


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'primer_apellido',
            'segundo_apellido',
            'role',
            'activo',
        )
        read_only_fields = ('id',)


class CarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrera
        fields = '__all__'


class AlumnoPerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumnoPerfil
        fields = '__all__'


class AlumnoGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumnoGrupo
        fields = '__all__'

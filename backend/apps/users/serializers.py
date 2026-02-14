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

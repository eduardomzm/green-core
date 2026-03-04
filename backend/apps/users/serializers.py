from rest_framework import serializers
from .models import User, Carrera, AlumnoPerfil, AlumnoGrupo
from django.db import transaction

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


class UserSimpleSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'nombre_completo']

    def get_nombre_completo(self, obj):
        return f"{obj.first_name} {obj.primer_apellido} {obj.segundo_apellido}".strip()


class RegistroAlumnoSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    first_name = serializers.CharField(max_length=150)
    primer_apellido = serializers.CharField(max_length=50)
    segundo_apellido = serializers.CharField(max_length=50, required=False, allow_blank=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    matricula = serializers.CharField(max_length=30)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está en uso.")
        return value

    def validate_matricula(self, value):
        if AlumnoPerfil.objects.filter(matricula=value).exists():
            raise serializers.ValidationError("Esta matrícula ya está registrada.")
        return value

    def create(self, validated_data):
        
        with transaction.atomic():
        
            user = User.objects.create_user(
                username=validated_data['username'], 
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data['first_name'],
                primer_apellido=validated_data['primer_apellido'],
                segundo_apellido=validated_data.get('segundo_apellido', ''),
                role=User.Roles.ALUMNO
            )
            
    
            AlumnoPerfil.objects.create(
                usuario=user,
                matricula=validated_data['matricula']
            )
            
        return user
    
class AdminUserManagementSerializer(serializers.ModelSerializer):
    """
    Serializador exclusivo para que el Administrador cree/edite usuarios de cualquier rol.
    """
    matricula = serializers.CharField(max_length=30, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'first_name',
            'primer_apellido', 'segundo_apellido', 'role', 'activo', 'matricula'
        )

    def validate(self, data):
        if data.get('role') == User.Roles.ALUMNO and not data.get('matricula'):
            raise serializers.ValidationError({"matricula": "La matrícula es obligatoria al crear una cuenta de Alumno."})
        return data

    def create(self, validated_data):
        matricula = validated_data.pop('matricula', None)
        password = validated_data.pop('password')

        with transaction.atomic():
           
            user = User(**validated_data)
            user.set_password(password) 
            user.save()

            if user.role == User.Roles.ALUMNO and matricula:
                AlumnoPerfil.objects.create(usuario=user, matricula=matricula)

        return user
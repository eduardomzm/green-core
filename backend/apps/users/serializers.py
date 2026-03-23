from rest_framework import serializers
from .models import User, Carrera, AlumnoPerfil, AlumnoGrupo, Notificacion
from django.db import transaction
import re
from django.core.validators import RegexValidator

class UserSerializer(serializers.ModelSerializer):
    # Declaramos la matrícula como un campo calculado
    matricula = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'primer_apellido',
            'segundo_apellido',
            'role',
            'activo',
            'matricula',
            'avatar',
            'biografia',
            'instagram',
            'twitter',
            'facebook'
        )
        read_only_fields = ('id',)

    def get_matricula(self, obj):
        if obj.role == 'ALUMNO':
            try:
                return obj.alumnoperfil.matricula
            except AlumnoPerfil.DoesNotExist:
                return None
        return None


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
        # Validador de formato: 4 o 5 números, 4 letras mayúsculas, 3 números
        matricula_regex = r'^\d{4,5}[A-Z]{4}\d{3}$'
        if not re.match(matricula_regex, value):
            raise serializers.ValidationError(
                "Formato de matrícula inválido."
            )
        
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
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'first_name',
            'primer_apellido', 'segundo_apellido', 'role', 'activo', 'matricula'
        )

    def validate(self, data):
        role = data.get('role')
        if not role and self.instance:
            role = self.instance.role

        if role == User.Roles.ALUMNO:
            matricula = data.get('matricula')
            if not matricula:
                if not self.instance or not hasattr(self.instance, 'alumnoperfil'):
                    raise serializers.ValidationError({"matricula": "La matrícula es obligatoria para cuentas de Alumno."})
            else:
                matricula_regex = r'^\d{4,5}[A-Z]{4}\d{3}$'
                if not re.match(matricula_regex, matricula):
                    raise serializers.ValidationError({
                        "matricula": "Formato de matrícula inválido."
                    })

        return data

    def create(self, validated_data):
        matricula = validated_data.pop('matricula', None)
        password = validated_data.pop('password', None)

        with transaction.atomic():
            user = User(**validated_data)
            if password:
                user.set_password(password)
            user.save()

            if user.role == User.Roles.ALUMNO and matricula:
                AlumnoPerfil.objects.create(usuario=user, matricula=matricula)

        return user

    def update(self, instance, validated_data):
        matricula = validated_data.pop('matricula', None)
        password = validated_data.pop('password', None)
        # El Administrador no puede cambiar el rol de un usuario existente para evitar inconsistencias
        validated_data.pop('role', None) 

        with transaction.atomic():
            # Actualizar campos del User
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            
            if password:
                instance.set_password(password)
            
            instance.save()

            # Manejo de AlumnoPerfil (matrícula)
            if instance.role == User.Roles.ALUMNO:
                if matricula:
                    AlumnoPerfil.objects.update_or_create(
                        usuario=instance,
                        defaults={'matricula': matricula}
                    )
            else:
                # Si el rol ya no es ALUMNO, opcionalmente borrar el perfil
                AlumnoPerfil.objects.filter(usuario=instance).delete()
        return instance

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'
        read_only_fields = ['usuario', 'fecha_creacion']

from rest_framework import serializers
from .models import Grupo, Material, Deposito, MetaSistema, MetaAlumno, Medalla, MedallaAlumno
from apps.users.serializers import UserSimpleSerializer


class GrupoSerializer(serializers.ModelSerializer):
    carrera_nombre = serializers.CharField(source='carrera.nombre', read_only=True)
    tutor_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Grupo
        fields = ['id', 'nombre', 'descripcion', 'carrera', 'carrera_nombre', 'tutor', 'tutor_nombre', 'activo', 'codigo_invitacion']

    def get_tutor_nombre(self, obj):
        if obj.tutor:
            return f"{obj.tutor.first_name} {obj.tutor.primer_apellido}"
        return "Sin tutor"


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


class DepositoSerializer(serializers.ModelSerializer):
    alumno_info = UserSimpleSerializer(source='alumno', read_only=True)
    operador_info = UserSimpleSerializer(source='operador', read_only=True)
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)

    class Meta:
        model = Deposito
        fields = [
            'id',
            'alumno',
            'alumno_info',
            'operador',
            'operador_info',
            'material',
            'material_nombre',
            'cantidad',
            'fecha'
        ]
        read_only_fields = ['operador']
    
    def validate_cantidad(self, value):
        if value > 200:
            raise serializers.ValidationError("La cantidad de un solo depósito no puede exceder las 200 piezas.")
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0.")
        return value

class MetaSistemaSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)
    actual = serializers.SerializerMethodField()
    porcentaje = serializers.SerializerMethodField()

    class Meta:
        model = MetaSistema
        fields = ['id', 'nombre', 'material', 'material_nombre', 'cantidad_meta', 'activa', 'cumplida', 'fecha_inicio', 'fecha_cumplimiento', 'actual', 'porcentaje']

    def get_actual(self, obj):
        from .models import Deposito
        from django.db.models import Sum
        if obj.material:
            total = Deposito.objects.filter(material=obj.material).aggregate(Sum('cantidad'))['cantidad__sum'] or 0
        else:
            total = Deposito.objects.all().aggregate(Sum('cantidad'))['cantidad__sum'] or 0
        return total

    def get_porcentaje(self, obj):
        actual = self.get_actual(obj)
        if obj.cantidad_meta > 0:
            return min(round((actual / obj.cantidad_meta) * 100, 2), 100)
        return 0

    def validate(self, data):
        material = data.get('material')
        # Si se está creando o actualizando a 'activa=True' y 'cumplida=False'
        # Pero el requerimiento es: "no te permita crear una nueva meta si ya existe una actualmente de ese material"
        # Entendemos "actualmente" como una meta que no ha sido cumplida aún.
        
        # Filtramos por material y que no esté cumplida
        existing_active = MetaSistema.objects.filter(material=material, cumplida=False).exists()
        
        if self.instance:
            # Si estamos editando, excluimos la meta actual de la búsqueda
            existing_active = MetaSistema.objects.filter(material=material, cumplida=False).exclude(id=self.instance.id).exists()

        if existing_active:
            nombre_mat = material.nombre if material else "general"
            raise serializers.ValidationError(
                f"Ya existe una meta activa para el material '{nombre_mat}'. "
                "Debe cumplirse o eliminarse la anterior antes de crear una nueva."
            )
        return data


class MetaAlumnoSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)
    alumno_username = serializers.CharField(source='alumno.username', read_only=True)

    class Meta:
        model = MetaAlumno
        fields = ['id', 'alumno', 'alumno_username', 'material', 'material_nombre', 'cantidad_meta', 'asignada_por', 'cumplida', 'fecha_cumplimiento', 'creada_en']
        read_only_fields = ['asignada_por', 'cumplida', 'fecha_cumplimiento', 'creada_en']

class MedallaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medalla
        fields = '__all__'

class MedallaAlumnoSerializer(serializers.ModelSerializer):
    medalla = MedallaSerializer(read_only=True)
    
    class Meta:
        model = MedallaAlumno
        fields = ['id', 'alumno', 'medalla', 'categoria', 'mes_obtenida', 'fecha_otorgada']
        read_only_fields = ['alumno', 'medalla', 'categoria', 'mes_obtenida', 'fecha_otorgada']
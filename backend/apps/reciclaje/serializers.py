from rest_framework import serializers
from .models import Grupo, Material, Deposito, MetaSistema, MetaAlumno, Medalla, MedallaAlumno
from apps.users.serializers import UserSimpleSerializer


class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = '__all__'


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

class MetaSistemaSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)
    actual = serializers.SerializerMethodField()
    porcentaje = serializers.SerializerMethodField()

    class Meta:
        model = MetaSistema
        fields = ['id', 'nombre', 'material', 'material_nombre', 'cantidad_meta', 'activa', 'actual', 'porcentaje']

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


class MetaAlumnoSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)

    class Meta:
        model = MetaAlumno
        fields = ['id', 'alumno', 'material', 'material_nombre', 'cantidad_meta', 'asignada_por', 'creada_en']
        read_only_fields = ['asignada_por', 'creada_en']

class MedallaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medalla
        fields = '__all__'

class MedallaAlumnoSerializer(serializers.ModelSerializer):
    medalla = MedallaSerializer(read_only=True)
    
    class Meta:
        model = MedallaAlumno
        fields = ['id', 'alumno', 'medalla', 'mes_obtenida', 'fecha_otorgada']
        read_only_fields = ['alumno', 'medalla', 'mes_obtenida', 'fecha_otorgada']
from rest_framework import serializers
from .models import Grupo, Material, Deposito, MetaSistema, MetaAlumno
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
    class Meta:
        model = MetaSistema
        fields = '__all__'


class MetaAlumnoSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)

    class Meta:
        model = MetaAlumno
        fields = ['id', 'alumno', 'material', 'material_nombre', 'cantidad_meta', 'asignada_por', 'creada_en']
        read_only_fields = ['asignada_por', 'creada_en']
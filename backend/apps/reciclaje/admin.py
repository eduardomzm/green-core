from django.contrib import admin
from .models import Grupo, Material, Deposito, MetaSistema, Medalla, MedallaAlumno, AsignacionMedallaMes

@admin.register(Grupo)
class GrupoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'carrera', 'tutor', 'activo')
    list_filter = ('activo', 'carrera')


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'unidad', 'activo')


@admin.register(Deposito)
class DepositoAdmin(admin.ModelAdmin):
    list_display = ('alumno', 'material', 'cantidad', 'fecha')
    list_filter = ('material', 'fecha')

admin.site.register(MetaSistema)

@admin.register(Medalla)
class MedallaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo', 'mes', 'posicion', 'icono_lucide')
    list_filter = ('tipo', 'mes', 'posicion')
    search_fields = ('nombre',)

@admin.register(MedallaAlumno)
class MedallaAlumnoAdmin(admin.ModelAdmin):
    list_display = ('alumno', 'medalla', 'mes_obtenida', 'categoria', 'fecha_otorgada')
    list_filter = ('medalla__mes', 'categoria')
    search_fields = ('alumno__username', 'alumno__first_name', 'medalla__nombre')

@admin.register(AsignacionMedallaMes)
class AsignacionMedallaMesAdmin(admin.ModelAdmin):
    list_display = ('año', 'mes', 'fecha_ejecucion')
    list_filter = ('año', 'mes')
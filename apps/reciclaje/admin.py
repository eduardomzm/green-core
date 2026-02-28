from django.contrib import admin
from .models import Grupo, Material, Deposito, MetaSistema

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
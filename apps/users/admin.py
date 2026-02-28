from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm
from django import forms

from .models import User, Carrera, AlumnoPerfil, AlumnoGrupo


# =========================
# Custom Form para creación de usuario
# =========================

class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'primer_apellido',
            'segundo_apellido',
            'role',
        )


# =========================
# Custom User Admin
# =========================

@admin.register(User)
class UserAdmin(BaseUserAdmin):

    add_form = CustomUserCreationForm
    model = User

    list_display = ('username', 'email', 'role', 'activo')
    list_filter = ('role', 'activo')

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {
            'fields': (
                'first_name',
                'primer_apellido',
                'segundo_apellido',
                'email',
                'role',
                'activo'
            )
        }),
        ('Permisos', {
            'fields': (
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            )
        }),
        ('Fechas importantes', {
            'fields': ('last_login', 'date_joined'),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'email',
                'primer_apellido',
                'segundo_apellido',
                'role',
                'password1',
                'password2',
            ),
        }),
    )


# =========================
# Otros modelos del dominio académico
# =========================

@admin.register(Carrera)
class CarreraAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo')
    list_filter = ('activo',)


@admin.register(AlumnoPerfil)
class AlumnoPerfilAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'matricula', 'activo')
    list_filter = ('activo',)


@admin.register(AlumnoGrupo)
class AlumnoGrupoAdmin(admin.ModelAdmin):
    list_display = ('alumno', 'grupo')

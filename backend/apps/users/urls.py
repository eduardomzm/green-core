from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    CarreraViewSet,
    AlumnoPerfilViewSet,
    AlumnoGrupoViewSet,
    RegistroAlumnoView 
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'carreras', CarreraViewSet, basename='carrera')
router.register(r'alumno-perfiles', AlumnoPerfilViewSet, basename='alumno-perfil')
router.register(r'alumno-grupos', AlumnoGrupoViewSet)

urlpatterns = [
    path('users/registro/alumno/', RegistroAlumnoView.as_view(), name='registro_alumno'),
    path('', include(router.urls)),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    CarreraViewSet,
    AlumnoPerfilViewSet,
    AlumnoGrupoViewSet,
    RegistroAlumnoView,
    MeView,
    PublicProfileView,
    NotificacionViewSet,
    BuscarAlumnosView,
    ToggleSeguirView,
    MisSeguidoresView,
    MisSiguiendoView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'carreras', CarreraViewSet, basename='carrera')
router.register(r'alumno-perfiles', AlumnoPerfilViewSet, basename='alumno-perfil')
router.register(r'alumno-grupos', AlumnoGrupoViewSet)
router.register(r'notificaciones', NotificacionViewSet, basename='notificacion')

urlpatterns = [
    path('users/registro/alumno/', RegistroAlumnoView.as_view(), name='registro_alumno'),
    path('users/me/', MeView.as_view(), name='me'),
    path('users/me/seguidores/', MisSeguidoresView.as_view(), name='mis_seguidores'),
    path('users/me/siguiendo/', MisSiguiendoView.as_view(), name='mis_siguiendo'),
    path('users/buscar/', BuscarAlumnosView.as_view(), name='buscar_alumnos'),
    path('users/perfil/<str:username>/', PublicProfileView.as_view(), name='perfil_publico'),
    path('users/perfil/<str:username>/seguir/', ToggleSeguirView.as_view(), name='toggle_seguir'),
    path('', include(router.urls)),
]
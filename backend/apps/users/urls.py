
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    CarreraViewSet,
    AlumnoPerfilViewSet,
    AlumnoGrupoViewSet
)
from django.urls import path
from .views import MeView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'carreras', CarreraViewSet)
router.register(r'alumno-perfiles', AlumnoPerfilViewSet)
router.register(r'alumno-grupos', AlumnoGrupoViewSet)

urlpatterns = router.urls

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
]
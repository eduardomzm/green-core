from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    CarreraViewSet,
    AlumnoPerfilViewSet,
    AlumnoGrupoViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'carreras', CarreraViewSet)
router.register(r'alumno-perfiles', AlumnoPerfilViewSet)
router.register(r'alumno-grupos', AlumnoGrupoViewSet)

urlpatterns = router.urls

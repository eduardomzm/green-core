from rest_framework.routers import DefaultRouter
from .views import DepositoViewSet, GrupoViewSet, MaterialViewSet

router = DefaultRouter()
router.register(r'depositos', DepositoViewSet, basename='deposito')
router.register(r'grupos', GrupoViewSet, basename='grupo')
router.register(r'materiales', MaterialViewSet, basename='material')

urlpatterns = router.urls

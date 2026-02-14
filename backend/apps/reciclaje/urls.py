from rest_framework.routers import DefaultRouter
from .views import GrupoViewSet, MaterialViewSet, DepositoViewSet

router = DefaultRouter()
router.register(r'grupos', GrupoViewSet)
router.register(r'materiales', MaterialViewSet)
router.register(r'depositos', DepositoViewSet)

urlpatterns = router.urls

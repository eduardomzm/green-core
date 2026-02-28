from rest_framework.routers import DefaultRouter
from .views import DepositoViewSet,GrupoViewSet,MaterialViewSet,EstadisticasView, EstadisticasMaterialView, ProgresoView, DashboardView
from django.urls import path


router = DefaultRouter()
router.register(r'depositos', DepositoViewSet, basename='deposito')
router.register(r'grupos', GrupoViewSet, basename='grupo')
router.register(r'materiales', MaterialViewSet, basename='material')

urlpatterns = router.urls + [
    path('mis-estadisticas/', EstadisticasView.as_view()),
    path('estadisticas-material/', EstadisticasMaterialView.as_view()),
    path('progreso/', ProgresoView.as_view()),
    path('dashboard/', DashboardView.as_view()),



]

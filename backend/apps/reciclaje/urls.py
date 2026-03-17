from rest_framework.routers import DefaultRouter
from .views import DepositoViewSet,GrupoViewSet,MaterialViewSet,EstadisticasView, EstadisticasMaterialView, ProgresoView, DashboardView, MetaSistemaViewSet, RankingsView, HistorialRankingsView,MisDepositosView, UnirseGrupoView, MiGrupoTutorView
    
from django.urls import path


router = DefaultRouter()
router.register(r'depositos', DepositoViewSet, basename='deposito')
router.register(r'grupos', GrupoViewSet, basename='grupo')
router.register(r'materiales', MaterialViewSet, basename='material')
router.register(r'metas', MetaSistemaViewSet, basename='meta')

urlpatterns = router.urls + [
    path('mis-estadisticas/', EstadisticasView.as_view()),
    path('estadisticas-material/', EstadisticasMaterialView.as_view()),
    path('progreso/', ProgresoView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('rankings/', RankingsView.as_view(), name='rankings'),
    path('mis-depositos/', MisDepositosView.as_view(), name='mis-depositos'),
    path('mi-grupo/', MiGrupoTutorView.as_view(), name='mi-grupo-tutor'),
    path('unirse-grupo/', UnirseGrupoView.as_view(), name='unirse-grupo'),
    path('rankings/historial/', HistorialRankingsView.as_view()),

]

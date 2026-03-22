from rest_framework.routers import DefaultRouter
from .views import (
    DepositoViewSet,
    GrupoViewSet,
    MaterialViewSet,
    EstadisticasView,
    EstadisticasMaterialView,
    ProgresoView,
    DashboardView,
    MetaSistemaViewSet,
    RankingsView,
    MisDepositosView,
    UnirseGrupoView,
    MiGrupoTutorView,
    SolicitarSalidaGrupoView,
    AutorizarIngresoGrupoView,
    AutorizarSalidaGrupoView,
    MiGrupoAlumnoView,
    AsignarMetaAlumnoView,
    CorteMensualView,
    MedallasDisponiblesView,
)
    
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
    path('solicitar-salida-grupo/', SolicitarSalidaGrupoView.as_view(), name='solicitar-salida-grupo'),
    path('autorizar-ingreso-grupo/', AutorizarIngresoGrupoView.as_view(), name='autorizar-ingreso-grupo'),
    path('autorizar-salida-grupo/', AutorizarSalidaGrupoView.as_view(), name='autorizar-salida-grupo'),
    path('mi-grupo-alumno/', MiGrupoAlumnoView.as_view(), name='mi-grupo-alumno'),
    path('asignar-meta-alumno/', AsignarMetaAlumnoView.as_view(), name='asignar-meta-alumno'),
    path('corte-mensual/', CorteMensualView.as_view(), name='corte-mensual'),
    path('medallas-disponibles/', MedallasDisponiblesView.as_view(), name='medallas-disponibles'),

]

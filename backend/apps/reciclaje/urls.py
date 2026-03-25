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
    MetaAlumnoViewSet,
    RankingsView,
    MisDepositosView,
    UnirseGrupoView,
    MiGrupoTutorView,
    SolicitarSalidaGrupoView,
    AutorizarIngresoGrupoView,
    AutorizarSalidaGrupoView,
    RechazarIngresoGrupoView,
    RechazarSalidaGrupoView,
    MiGrupoAlumnoView,
    AsignarMetaAlumnoView,
    CancelarMetaAlumnoView,
    CorteMensualView,
    MedallasDisponiblesView,
    MisMedallasView,
    AsignarMedallasMensualesView,
)
    
from django.urls import path


router = DefaultRouter()
router.register(r'depositos', DepositoViewSet, basename='deposito')
router.register(r'grupos', GrupoViewSet, basename='grupo')
router.register(r'materiales', MaterialViewSet, basename='material')
router.register(r'metas-sistema', MetaSistemaViewSet, basename='meta-sistema')
router.register(r'metas-alumnos', MetaAlumnoViewSet, basename='meta-alumno')

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
    path('rechazar-ingreso-grupo/', RechazarIngresoGrupoView.as_view(), name='rechazar-ingreso-grupo'),
    path('autorizar-salida-grupo/', AutorizarSalidaGrupoView.as_view(), name='autorizar-salida-grupo'),
    path('rechazar-salida-grupo/', RechazarSalidaGrupoView.as_view(), name='rechazar-salida-grupo'),
    path('mi-grupo-alumno/', MiGrupoAlumnoView.as_view(), name='mi-grupo-alumno'),
    path('asignar-meta-alumno/', AsignarMetaAlumnoView.as_view(), name='asignar-meta-alumno'),
    path('cancelar-meta-alumno/<int:meta_id>/', CancelarMetaAlumnoView.as_view(), name='cancelar-meta-alumno'),
    path('corte-mensual/', CorteMensualView.as_view(), name='corte-mensual'),
    path('medallas-disponibles/', MedallasDisponiblesView.as_view(), name='medallas-disponibles'),
    path('mis-medallas/', MisMedallasView.as_view(), name='mis-medallas'),
    path('asignar-medallas/', AsignarMedallasMensualesView.as_view(), name='asignar-medallas'),
]

from django.core.management.base import BaseCommand
from django.db.models import Sum
from django.utils import timezone

from apps.reciclaje.models import Deposito, RankingMensual


class Command(BaseCommand):
    help = "Genera y guarda el ranking mensual"

    def handle(self, *args, **kwargs):

        now = timezone.now()

        anio = now.year
        mes = now.month

        fecha_inicio = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        depositos = Deposito.objects.filter(fecha__gte=fecha_inicio)

        top_alumnos = list(
            depositos
            .values(
                'alumno__id',
                'alumno__username',
                'alumno__first_name',
                'alumno__primer_apellido'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:20]
        )

        top_grupos = list(
            depositos
            .filter(alumno__alumnogrupo__isnull=False)
            .values(
                'alumno__alumnogrupo__grupo__id',
                'alumno__alumnogrupo__grupo__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:20]
        )

        top_carreras = list(
            depositos
            .filter(alumno__alumnogrupo__isnull=False)
            .values(
                'alumno__alumnogrupo__grupo__carrera__id',
                'alumno__alumnogrupo__grupo__carrera__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:20]
        )

        top_materiales = list(
            depositos
            .values(
                'material__id',
                'material__nombre'
            )
            .annotate(total_piezas=Sum('cantidad'))
            .order_by('-total_piezas')[:20]
        )

        total_piezas = depositos.aggregate(
            total=Sum('cantidad')
        )['total'] or 0

        material_top = top_materiales[0]['material__nombre'] if top_materiales else "N/A"

        RankingMensual.objects.update_or_create(

            anio=anio,
            mes=mes,

            defaults={

                "total_piezas": total_piezas,
                "total_alumnos": len(top_alumnos),
                "total_grupos": len(top_grupos),
                "material_top": material_top,

                "datos": {
                    "top_alumnos": top_alumnos,
                    "top_grupos": top_grupos,
                    "top_carreras": top_carreras,
                    "top_materiales": top_materiales
                }

            }

        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Ranking generado correctamente para {mes}-{anio}"
            )
        )
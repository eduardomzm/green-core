import { useState, useEffect } from "react";
import { getRankings, type RankingsResponse } from "../services/reciclajeService";

import RankingsHeader from "../pages/rankings/RankingsHeader";
import RankingsFilters from "../pages/rankings/RankingsFilter";
import RankingsChart from "../pages/rankings/RankingsChart";
import TimeframeSelector from "../pages/rankings/TimeframeSelector";
import StatsCards from "../pages/rankings/StatsCards";
import TopRecicladores from "../pages/rankings/TopRecicladores";
import ImpactoAmbiental from "../pages/rankings/ImpactoAmbientalP";
import RankingTable from "../pages/rankings/RankingTable";

type TimeframeType = "actual" | "mensual";

export default function Rankings() {

  const [data, setData] = useState<RankingsResponse | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>("actual");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  });
  const [activeFilter, setActiveFilter] = useState("alumnos");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {

    const fetchData = async () => {
      try {
        let result;

        result = await getRankings(timeframe, timeframe === 'mensual' ? selectedMonth : undefined);
        setData(result);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error obteniendo rankings", error);
      }
    };

    // primera carga
    fetchData();

    // actualización cada 10s
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);

  }, [timeframe, selectedMonth]);


  /*CALCULAR DATOS PARA TARJETAS*/

  const totalPiezas =
    data?.top_alumnos?.reduce(
      (acc, item) => acc + item.total_piezas,
      0
    ) || 0;

  const totalAlumnos = data?.top_alumnos?.length || 0;

  const totalGrupos = data?.top_grupos?.length || 0;

  const materialTop =
    data?.top_materiales?.[0]?.material__nombre || "N/A";

  /* DATOS PARA LA GRÁFICA */

  const chartData = (() => {

    if (!data) return [];

    switch (activeFilter) {

      case "alumnos":
        return data.top_alumnos.map((item) => ({
          name: item.alumno__first_name || item.alumno__username,
          value: item.total_piezas
        }));

      case "grupos":
        return data.top_grupos.map((item) => ({
          name: item.alumno__alumnogrupo__grupo__nombre,
          value: item.total_piezas
        }));

      case "carreras":
        return data.top_carreras.map((item) => ({
          name: item.alumno__alumnogrupo__grupo__carrera__nombre,
          value: item.total_piezas
        }));

      case "materiales":
        return data.top_materiales.map((item) => ({
          name: item.material__nombre,
          value: item.total_piezas
        }));

      default:
        return [];
    }

  })();


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      <div className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-start gap-4 sm:gap-0 w-full">

        <RankingsHeader lastUpdated={lastUpdated} />

        <TimeframeSelector
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />

      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <StatsCards
        totalPiezas={totalPiezas}
        totalAlumnos={totalAlumnos}
        totalGrupos={totalGrupos}
        materialTop={materialTop}
      />

      {/* TOP 3 RECICLADORES */}
      <TopRecicladores alumnos={(data?.top_alumnos || []).slice(0, 3)} />

      <RankingTable alumnos={(data?.top_alumnos || []).slice(3, 10)} />

      {/* SECCIÓN DEL RANKING */}
      <div className="bg-white p-6 rounded-xl shadow-sm">

        <RankingsFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div className="mt-8">
          <RankingsChart chartData={chartData.slice(0, 3)} />
        </div>

      </div>

      {/* IMPACTO AMBIENTAL */}
      <ImpactoAmbiental totalPiezas={totalPiezas} />

    </div>
  );
}

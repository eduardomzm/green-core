import { useState, useEffect } from "react";
import { getRankings, type RankingsResponse, getMedallasDisponibles, hacerCorteMensual } from "../services/reciclajeService";
import { useAuth } from "../hooks/useAuth";
import { Award, Loader2, X } from "lucide-react";

import RankingsHeader from "../pages/rankings/RankingsHeader";
import RankingsFilters from "../pages/rankings/RankingsFilter";
import TimeframeSelector from "../pages/rankings/TimeframeSelector";
import StatsCards from "../pages/rankings/StatsCards";
import ImpactoAmbiental from "../pages/rankings/ImpactoAmbientalP";

import TopPodium from "../pages/rankings/TopPodium";
import RankingList from "../pages/rankings/RankingList";

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

  const { user } = useAuth();
  const [showCorteModal, setShowCorteModal] = useState(false);
  const [medallas, setMedallas] = useState<any[]>([]);
  const [selectedMedalla, setSelectedMedalla] = useState("");
  const [loadingCorte, setLoadingCorte] = useState(false);
  const [corteMsg, setCorteMsg] = useState("");

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

  const handleOpenCorte = async () => {
    setShowCorteModal(true);
    setCorteMsg("");
    try {
        const meds = await getMedallasDisponibles();
        setMedallas(meds);
        if (meds.length > 0) setSelectedMedalla(meds[0].id.toString());
    } catch (e) {
        console.error("Error loading medals", e);
    }
  };

  const handleRealizarCorte = async () => {
    if (!selectedMedalla) return;
    setLoadingCorte(true);
    setCorteMsg("");
    try {
        const res = await hacerCorteMensual(parseInt(selectedMedalla), selectedMonth);
        setCorteMsg(`Éxito: ${res.mensaje}. Medallas entregadas: ${res.medallas_entregadas}`);
    } catch (e: any) {
        setCorteMsg("Error al realizar el corte: " + (e.response?.data?.error || "Desconocido"));
    } finally {
        setLoadingCorte(false);
    }
  };


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
          name: item.alumno__first_name ? `${item.alumno__first_name} ${item.alumno__primer_apellido || ''}`.trim() : item.alumno__username,
          username: item.alumno__username,
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
        <div className="flex items-center gap-4">
            <RankingsHeader lastUpdated={lastUpdated} />
            {user?.role === 'ADMIN' && timeframe === 'mensual' && (
                <button
                    onClick={handleOpenCorte}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                >
                    <Award className="w-4 h-4" />
                    Generar Corte y Medallas
                </button>
            )}
        </div>

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

      {/* SECCIÓN UNIFICADA DEL RANKING */}
      <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        
        <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-black text-gray-800 mb-6">Tabla de Posiciones</h2>
            <RankingsFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            />
        </div>

        {/* TOP 3 RECICLADORES (PODIO DINÁMICO) */}
        <TopPodium data={chartData.slice(0, 3)} />

        {/* LISTA DEL 4 AL 10 */}
        <RankingList data={chartData.slice(3, 10)} startIndex={4} />

      </div>

      {/* IMPACTO AMBIENTAL */}
      <ImpactoAmbiental totalPiezas={totalPiezas} />

      {/* MODAL CORTE MENSUAL */}
      {showCorteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowCorteModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-500" />
              Corte Mensual
            </h2>
            <p className="text-sm text-gray-500 mb-6">Entrega medallas al Top 3 del mes de <strong>{selectedMonth}</strong>.</p>
            
            <div className="space-y-4 mb-8">
                <label className="block text-sm font-bold text-gray-700">Selecciona la medalla a repartir:</label>
                <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    value={selectedMedalla}
                    onChange={(e) => setSelectedMedalla(e.target.value)}
                >
                    {medallas.map(m => (
                        <option key={m.id} value={m.id}>{m.nombre} - {m.descripcion}</option>
                    ))}
                </select>
                {medallas.length === 0 && <p className="text-xs text-red-500">No hay medallas disponibles creadas en la BD.</p>}
            </div>

            {corteMsg && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${corteMsg.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                    {corteMsg}
                </div>
            )}

            <div className="flex gap-4">
                <button 
                  onClick={() => setShowCorteModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >Cancelar</button>
                <button
                  onClick={handleRealizarCorte}
                  disabled={loadingCorte || medallas.length === 0}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {loadingCorte ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar"}
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

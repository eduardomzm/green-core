import { useState, useEffect } from "react";
import { 
  FileText, Download, Calendar, Loader2, Trophy, Users, 
  FileSpreadsheet, Search, User as UserIcon, 
  History 
} from "lucide-react";
import { 
  type RankingsResponse, 
  getRankingHistorial
} from "../services/reciclajeService";
import { useAuth } from "../hooks/useAuth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { 
  buscarAlumnos, 
  getCarreras, 
  getGrupos, 
  type Carrera, 
  type Grupo 
} from "../services/userService";

type ReportType = "mensual" | "alumno" | "grupo" | "historial";

export default function Estadisticas() {
  const { user } = useAuth();
  const [data, setData] = useState<RankingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("mensual");

  // Filtros Mensual
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Filtros Alumno
  const [matriculaSearch, setMatriculaSearch] = useState("");
  const [selectedAlumno, setSelectedAlumno] = useState<any>(null);
  const [searchingAlumno, setSearchingAlumno] = useState(false);

  // Filtros Grupo
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState<string>("");
  const [selectedGrupo, setSelectedGrupo] = useState<string>("");
  const [searchError, setSearchError] = useState<string | null>(null);


  useEffect(() => {
    if (reportType === "mensual") {
      fetchMonthlyData();
    }
  }, [selectedMonth, reportType]);

  useEffect(() => {
    if (reportType === "grupo") {
      getCarreras().then(setCarreras);
    }
  }, [reportType]);

  useEffect(() => {
    if (selectedCarrera) {
      getGrupos().then(allGrupos => {
        setGrupos(allGrupos.filter(g => g.carrera === parseInt(selectedCarrera)));
      });
    }
  }, [selectedCarrera]);

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const [year, month] = selectedMonth.split('-').map(Number);
      const res = await getRankingHistorial(month, year);
      setData(res);
    } catch (error) {
      console.error("Error cargando estadísticas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAlumno = async () => {
    if (!matriculaSearch.trim()) return;
    setSearchingAlumno(true);
    setSearchError(null);
    try {
      const results = await buscarAlumnos(matriculaSearch);
      if (results && results.length > 0) {
        setSelectedAlumno(results[0]);
      } else {
        setSearchError("No se encontró ningún alumno con esa matrícula o nombre.");
        setSelectedAlumno(null);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setSearchingAlumno(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      let reportTitle = "Reporte de Reciclaje";
      let subtitle = "";
      let reportData = data;

      // Logic to fetch specialized data if not "mensual"
      if (reportType === "alumno" && selectedAlumno) {
        reportTitle = `Reporte Individual: ${selectedAlumno.first_name} ${selectedAlumno.primer_apellido}`;
        subtitle = `Matrícula: ${matriculaSearch}`;
        const resFiltered = await (await import("../services/api")).default.get('rankings/', { 
          params: { timeframe: 'historial', alumno: selectedAlumno.id } 
        });
        reportData = resFiltered.data;
      } else if (reportType === "grupo" && selectedGrupo) {
        const grupo = grupos.find(g => g.id === parseInt(selectedGrupo));
        reportTitle = `Reporte de Grupo: ${grupo?.nombre}`;
        subtitle = `Carrera: ${carreras.find(c => c.id === parseInt(selectedCarrera))?.nombre}`;
        const resFiltered = await (await import("../services/api")).default.get('rankings/', { 
          params: { timeframe: 'historial', grupo: selectedGrupo } 
        });
        reportData = resFiltered.data;
      } else if (reportType === "historial") {
          reportTitle = "Historial Completo de Depósitos";
          const res = await getRankingHistorial(0, 0); 
          reportData = res;
      }

      if (!reportData) return;

      // -- MINIMALIST HEADER --
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Green Core", 20, 25);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(reportTitle, 20, 32);
      if (subtitle) doc.text(subtitle, 20, 38);
      
      doc.setFontSize(9);
      doc.text(`Generado: ${new Date().toLocaleDateString()}`, pageWidth - 20, 25, { align: "right" });

      doc.setDrawColor(243, 244, 246);
      doc.setLineWidth(0.5);
      doc.line(20, 42, pageWidth - 20, 42);

      // -- SUMMARY DASHBOARD --
      let currentY = 52;
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(20, currentY, 54, 28, 4, 4, 'F');
      doc.roundedRect(78, currentY, 54, 28, 4, 4, 'F');
      doc.roundedRect(136, currentY, 54, 28, 4, 4, 'F');

      const totalPiezas = reportData.top_alumnos.reduce((acc, item) => acc + item.total_piezas, 0);
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(75, 85, 99);
      doc.text("TOTAL PIEZAS", 26, currentY + 10);
      doc.setFontSize(16);
      doc.setTextColor(34, 197, 94);
      doc.text(totalPiezas.toLocaleString(), 26, currentY + 20);

      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text("ALUMNOS IMPACTADOS", 84, currentY + 10);
      doc.setFontSize(16);
      doc.setTextColor(17, 24, 39);
      doc.text((reportData.top_alumnos?.length || 0).toString(), 84, currentY + 20);

      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text("FECHA REPORTE", 142, currentY + 10);
      doc.setFontSize(14);
      doc.setTextColor(17, 24, 39);
      doc.text(new Date().toLocaleDateString(), 142, currentY + 20);

      currentY += 45;

      // RANKING TABLE
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Desglose de Participación", 20, currentY);
      currentY += 6;

      const rows = (reportData.top_alumnos || []).map((a, index) => [
        `#${index + 1}`,
        a.alumno__alumnoperfil__matricula || "N/A",
        a.alumno__first_name || a.alumno__username,
        a.alumno__primer_apellido || "",
        `${a.total_piezas.toLocaleString()} pzs`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Pos.', 'Matrícula', 'Nombre', 'Apellido', 'Total']],
        body: rows,
        theme: 'plain',
        headStyles: { fillColor: [249, 250, 251], textColor: [75, 85, 99], fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4, textColor: [55, 65, 81] },
        alternateRowStyles: { fillColor: [252, 253, 253] },
        margin: { left: 20, right: 20 }
      });

      // MATERIAL TABLE
      currentY = (doc as any).lastAutoTable.finalY + 15;
      if (currentY > 230) { doc.addPage(); currentY = 20; }

      doc.text("Desglose por Material", 20, currentY);
      currentY += 6;

      const mRows = (reportData.top_materiales || []).map(m => [m.material__nombre, `${m.total_piezas.toLocaleString()} pzs`]);
      autoTable(doc, {
        startY: currentY,
        head: [['Material', 'Total']],
        body: mRows,
        theme: 'plain',
        headStyles: { fillColor: [249, 250, 251], textColor: [75, 85, 99], fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4, textColor: [55, 65, 81] },
        margin: { left: 20, right: 20 }
      });

      doc.save(`Reporte_GreenCore_${reportType}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const generateExcel = async () => {
    setGenerating(true);
    try {
      const workbook = XLSX.utils.book_new();
      
      // Similar logic to PDF for data fetching
      let reportData = data;
      if (reportType === "alumno" && selectedAlumno) {
          const resFiltered = await (await import("../services/api")).default.get('rankings/', { 
            params: { timeframe: 'historial', alumno: selectedAlumno.id } 
          });
          reportData = resFiltered.data;
      } else if (reportType === "grupo" && selectedGrupo) {
          const resFiltered = await (await import("../services/api")).default.get('rankings/', { 
            params: { timeframe: 'historial', grupo: selectedGrupo } 
          });
          reportData = resFiltered.data;
      } else if (reportType === "historial") {
          const res = await getRankingHistorial(0, 0);
          reportData = res;
      }

      if (!reportData) return;

      const alumnosData = (reportData.top_alumnos || []).map((a, index) => ({
        Posicion: index + 1,
        Matricula: a.alumno__alumnoperfil__matricula || "N/A",
        Nombre: a.alumno__first_name || a.alumno__username,
        Apellido: a.alumno__primer_apellido || "",
        Total_Piezas: a.total_piezas
      }));
      const alumnosWS = XLSX.utils.json_to_sheet(alumnosData);
      XLSX.utils.book_append_sheet(workbook, alumnosWS, "Ranking");

      const materialesData = (reportData.top_materiales || []).map((m) => ({
        Material: m.material__nombre || "N/A",
        Total_Piezas: m.total_piezas
      }));
      const materialesWS = XLSX.utils.json_to_sheet(materialesData);
      XLSX.utils.book_append_sheet(workbook, materialesWS, "Materiales");

      XLSX.writeFile(workbook, `Reporte_GreenCore_${reportType}.xlsx`);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black text-gray-900 flex items-center justify-center sm:justify-start gap-3">
          <FileText className="w-10 h-10 text-primary" />
          Generación de Reportes
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Selecciona un filtro para generar informes personalizados en PDF o Excel.
        </p>
      </div>

      {/* TABS DE FILTRO */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
        {[
          { id: "mensual", label: "Mensual", icon: Calendar },
          { id: "alumno", label: "Por Alumno", icon: UserIcon },
          { id: "grupo", label: "Por Grupo", icon: Users, adminOnly: true },
          { id: "historial", label: "Todo el Historial", icon: History, adminOnly: true }
        ]
        .filter(tab => !tab.adminOnly || user?.role === 'ADMIN')
        .map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as ReportType)}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all
              ${reportType === tab.id 
                ? "bg-white text-primary shadow-sm ring-1 ring-gray-200" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL DE CONFIGURACIÓN DE FILTROS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Configurar Reporte
            </h3>

            <div className="space-y-6">
              {reportType === "mensual" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">Seleccionar Mes</label>
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
                    <Calendar className="w-5 h-5 text-primary" />
                    <input 
                      type="month" 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 w-full cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {reportType === "alumno" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Matrícula del Alumno</label>
                    <div className="flex gap-2">
                      <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 flex-1">
                        <Search className="w-5 h-5 text-primary" />
                        <input 
                          type="text" 
                          placeholder="Matrícula"
                          value={matriculaSearch}
                          onChange={(e) => setMatriculaSearch(e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 w-full"
                        />
                      </div>
                      <button 
                        onClick={handleSearchAlumno}
                        disabled={searchingAlumno}
                        className="bg-primary text-white p-4 rounded-2xl hover:bg-black transition-all disabled:opacity-50"
                      >
                        {searchingAlumno ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {searchError && (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-xs font-bold text-red-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                        {searchError}
                      </p>
                    </div>
                  )}

                  {selectedAlumno && (

                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{selectedAlumno.first_name} {selectedAlumno.primer_apellido}</p>
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                          {selectedAlumno.matricula ? `${selectedAlumno.matricula} • ` : ''}
                          {selectedAlumno.carrera || 'Alumno Encontrado'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {reportType === "grupo" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Carrera</label>
                    <select
                      value={selectedCarrera}
                      onChange={(e) => setSelectedCarrera(e.target.value)}
                      className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="">Selecciona Carrera</option>
                      {carreras.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Grupo</label>
                    <select
                      value={selectedGrupo}
                      onChange={(e) => setSelectedGrupo(e.target.value)}
                      disabled={!selectedCarrera}
                      className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
                    >
                      <option value="">Selecciona Grupo</option>
                      {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {reportType === "historial" && (
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-700 leading-relaxed">
                    Este reporte generará un desglose completo de toda la actividad histórica registrada en la plataforma hasta la fecha.
                  </p>
                </div>
              )}

              <div className="pt-4 space-y-3">
                 <button 
                  onClick={generatePDF}
                  disabled={generating || loading || (reportType === "alumno" && !selectedAlumno) || (reportType === "grupo" && !selectedGrupo)}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><FileText className="w-5 h-5" /> Descargar PDF</>}
                </button>
                <button 
                   onClick={generateExcel}
                   disabled={generating || loading || (reportType === "alumno" && !selectedAlumno) || (reportType === "grupo" && !selectedGrupo)}
                   className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><FileSpreadsheet className="w-5 h-5" /> Descargar Excel</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DE VISTA PREVIA / STATS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Participantes</p>
                <h4 className="text-2xl font-black text-gray-900">{data?.top_alumnos?.length || 0}</h4>
              </div>
            </div>
            <div className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <History className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Piezas Totales</p>
                <h4 className="text-2xl font-black text-gray-900">
                  {data?.top_alumnos?.reduce((acc, i) => acc + i.total_piezas, 0).toLocaleString() || 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-gray-800">Vista Previa de Datos</h3>
               {loading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
            </div>

            {reportType === "mensual" && data ? (
              <div className="space-y-4">
                {data.top_alumnos.slice(0, 5).map((al, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-300 w-5">#{idx + 1}</span>
                      <span className="font-bold text-gray-700">{al.alumno__first_name} {al.alumno__primer_apellido}</span>
                    </div>
                    <span className="font-black text-primary">{al.total_piezas} pzs</span>
                  </div>
                ))}
                {data.top_alumnos.length === 0 && (
                  <div className="text-center py-20 text-gray-400 font-medium">No hay datos para este mes</div>
                )}
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
                    <Download className="w-16 h-16 mb-4 opacity-20" />
                    <p className="max-w-xs font-medium">Configura los filtros a la izquierda y presiona descargar para obtener el reporte completo.</p>
                </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
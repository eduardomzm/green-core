import { useState, useEffect } from "react";
import { FileText, Download, Calendar, Loader2, Trophy, Users, GraduationCap, FileSpreadsheet } from "lucide-react";
import { getRankings, type RankingsResponse } from "../services/reciclajeService";
import { useAuth } from "../hooks/useAuth";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';

const Estadisticas = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    // Valor inicial: Mes pasado
    now.setMonth(now.getMonth() - 1);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  });

  const [data, setData] = useState<RankingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingExcel, setGeneratingExcel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getRankings('mensual', selectedMonth);
        setData(result);
      } catch (error) {
        console.error("Error al cargar rankings para reporte", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth]);

  const generatePDF = () => {
    if (!data) return;
    setGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const title = user?.role === 'TUTOR' ? "Reporte Mensual de Grupo" : "Reporte Mensual Global";
      
      // -- HEADER --
      // Logo o Rectángulo de acento
      doc.setFillColor(34, 197, 94); // Verde primary
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(`Green Core - ${title}`, 20, 25);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Periodo: ${selectedMonth}`, 20, 33);

      let currentY = 50;

      // -- SECCIÓN 1: TOP ALUMNOS --
      doc.setTextColor(31, 41, 55); // Gray-800
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("1. Ranking de Alumnos", 20, currentY);
      currentY += 8;

      const alumnosRows = (data.top_alumnos || []).slice(0, 20).map((a, index) => [
        `#${index + 1}`,
        a.alumno__alumnoperfil__matricula || "N/A",
        a.alumno__first_name || a.alumno__username,
        a.alumno__primer_apellido || "",
        `${a.total_piezas} piezas`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Pos.', 'Matrícula', 'Nombre', 'Apellido', 'Total']],
        body: alumnosRows,
        theme: 'striped',
        headStyles: { fillColor: [34, 197, 94] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;

      // -- SECCIÓN 2: TOP GRUPOS (Solo si es Admin o hay datos) --
      if (user?.role === 'ADMIN' || (data.top_grupos && data.top_grupos.length > 1)) {
        doc.setFontSize(16);
        doc.text("2. Ranking de Grupos", 20, currentY);
        currentY += 8;

        const gruposRows = (data.top_grupos || []).slice(0, 10).map((g, index) => [
          `#${index + 1}`,
          g.alumno__alumnogrupo__grupo__nombre || "N/A",
          `${g.total_piezas} piezas`
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Pos.', 'Nombre de Grupo', 'Total']],
          body: gruposRows,
          theme: 'striped',
          headStyles: { fillColor: [37, 99, 235] }, // Blue secondary
          styles: { fontSize: 10 },
          margin: { left: 20, right: 20 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 15;
      }

      // -- SECCIÓN 3: MATERIALES --
      doc.setFontSize(16);
      doc.text(user?.role === 'TUTOR' ? "2. Desglose por Material" : "3. Desglose por Material", 20, currentY);
      currentY += 8;

      const materialRows = (data.top_materiales || []).map((m) => [
        m.material__nombre || "N/A",
        `${m.total_piezas} piezas`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Material', 'Total Recolectado']],
        body: materialRows,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }, // Indigo
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });

      // -- FOOTER --
      const totalPiezas = data.top_alumnos.reduce((acc, item) => acc + item.total_piezas, 0);
      currentY = (doc as any).lastAutoTable.finalY + 20;
      
      doc.line(20, currentY, pageWidth - 20, currentY);
      currentY += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Total de piezas recolectadas en este periodo: ${totalPiezas}`, 20, currentY);
      doc.text(`Generado el: ${new Date().toLocaleString()}`, pageWidth - 20, currentY, { align: "right" });

      doc.save(`Reporte_GreenCore_${selectedMonth}.pdf`);
    } catch (error) {
      console.error("Error generando PDF", error);
    } finally {
      setGenerating(false);
    }
  };

  const generateExcel = () => {
    if (!data) return;
    setGeneratingExcel(true);

    try {
      const workbook = XLSX.utils.book_new();

      // Hoja de Alumnos
      const alumnosData = (data.top_alumnos || []).map((a, index) => ({
        Posicion: index + 1,
        Matricula: a.alumno__alumnoperfil__matricula || "N/A",
        Nombre: a.alumno__first_name || a.alumno__username,
        Apellido: a.alumno__primer_apellido || "",
        Total_Piezas: a.total_piezas
      }));
      const alumnosWS = XLSX.utils.json_to_sheet(alumnosData);
      XLSX.utils.book_append_sheet(workbook, alumnosWS, "Ranking Alumnos");

      // Hoja de Grupos (Solo si es Admin)
      if (user?.role === 'ADMIN') {
        const gruposData = (data.top_grupos || []).map((g, index) => ({
          Posicion: index + 1,
          Grupo: g.alumno__alumnogrupo__grupo__nombre || "N/A",
          Total_Piezas: g.total_piezas
        }));
        const gruposWS = XLSX.utils.json_to_sheet(gruposData);
        XLSX.utils.book_append_sheet(workbook, gruposWS, "Ranking Grupos");
      }

      // Hoja de Materiales
      const materialesData = (data.top_materiales || []).map((m) => ({
        Material: m.material__nombre || "N/A",
        Total_Piezas: m.total_piezas
      }));
      const materialesWS = XLSX.utils.json_to_sheet(materialesData);
      XLSX.utils.book_append_sheet(workbook, materialesWS, "Resumen Materiales");

      XLSX.writeFile(workbook, `Reporte_GreenCore_${selectedMonth}.xlsx`);
    } catch (error) {
      console.error("Error generando Excel", error);
    } finally {
      setGeneratingExcel(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <FileText className="w-10 h-10 text-primary" />
            {user?.role === 'TUTOR' ? "Reporte de Mi Grupo" : "Reportes Mensuales"}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {user?.role === 'TUTOR' 
              ? "Genera los cortes de reciclaje específicos de tus alumnos." 
              : "Genera los cortes mensuales de reciclaje globales en formato PDF y Excel."
            }
          </p>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400 ml-2" />
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border-none focus:ring-0 text-sm font-bold text-gray-700 p-2 cursor-pointer bg-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 rounded-2xl text-green-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alumnos</p>
            <h3 className="text-2xl font-black text-gray-900">{data?.top_alumnos?.length || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Grupos</p>
            <h3 className="text-2xl font-black text-gray-900">{data?.top_grupos?.length || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Carreras</p>
            <h3 className="text-2xl font-black text-gray-900">{data?.top_carreras?.length || 0}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-primary/10"></div>
        
        <div className="relative z-10 text-center py-10">
          <div className="mb-6 inline-flex p-5 bg-primary/10 rounded-full text-primary">
            <Download className="w-12 h-12 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Preparar Informe de {selectedMonth}</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Este reporte incluirá el top 10 de recicladores por categoría, permitiendo llevar un control oficial de los cortes mensuales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              disabled={loading || generating || !data}
              onClick={generatePDF}
              className={`
                px-8 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all flex items-center gap-3
                ${loading || generating || !data 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-black hover:scale-105 active:scale-95 shadow-primary/30'
                }
              `}
            >
              {loading ? (
                <> <Loader2 className="w-6 h-6 animate-spin" /> ...</>
              ) : generating ? (
                <> <Loader2 className="w-6 h-6 animate-spin" /> ...</>
              ) : (
                <> <Download className="w-6 h-6" /> Descargar PDF</>
              )}
            </button>

            <button 
              disabled={loading || generatingExcel || !data}
              onClick={generateExcel}
              className={`
                px-8 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all flex items-center gap-3
                ${loading || generatingExcel || !data 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-black hover:scale-105 active:scale-95 shadow-blue-600/30'
                }
              `}
            >
              {loading ? (
                <> <Loader2 className="w-6 h-6 animate-spin" /> ...</>
              ) : generatingExcel ? (
                <> <Loader2 className="w-6 h-6 animate-spin" /> ...</>
              ) : (
                <> <FileSpreadsheet className="w-6 h-6" /> Descargar Excel</>
              )}
            </button>
          </div>
        </div>
      </div>

      {!loading && data && data.top_alumnos.length === 0 && (
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800 text-center font-bold">
          No se encontraron datos de reciclaje para el mes seleccionado.
        </div>
      )}

    </div>
  );
};

export default Estadisticas;
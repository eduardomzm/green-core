import { useState, useMemo } from "react";
import { Search, Filter, Calendar, Recycle, User, Target, Key, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import type { DashboardResponse, DepositoHistorial } from "../../types/dashboard.types";
import { unirseGrupo } from "../../services/reciclajeService";

interface Props {
  data: DashboardResponse;
}

const MOCK_DEPOSITOS: DepositoHistorial[] = [
  { id: 1, fecha: "2024-10-25", cantidad: 15, material: "PET", operador: "operador_juan" },
  { id: 2, fecha: "2024-10-24", cantidad: 5, material: "Cartón", operador: "operador_maria" },
];

const AlumnoDashboard = ({ data }: Props) => {
  const [filtroMaterial, setFiltroMaterial] = useState<string>("");
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  
 
  const [codigo, setCodigo] = useState("");
  const [joinMsg, setJoinMsg] = useState({ text: "", type: "" });
  const [loadingJoin, setLoadingJoin] = useState(false);

  const depositos = data.ultimos_depositos || MOCK_DEPOSITOS;

  const depositosFiltrados = useMemo(() => {
    return depositos.filter((deposito) => {
      const coincideMaterial = filtroMaterial ? deposito.material === filtroMaterial : true;
      const coincideFecha = filtroFecha ? deposito.fecha.startsWith(filtroFecha) : true;
      return coincideMaterial && coincideFecha;
    });
  }, [depositos, filtroMaterial, filtroFecha]);

  const materialesUnicos = Array.from(new Set(depositos.map(d => d.material)));

  
  const handleUnirseGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    
    setLoadingJoin(true);
    setJoinMsg({ text: "Verificando...", type: "loading" });
    
    try {
      
      const res = await unirseGrupo(codigo.trim().toUpperCase());
      setJoinMsg({ text: res.mensaje || "¡Te has unido exitosamente!", type: "success" });
      setCodigo("");
      
      
      setTimeout(() => setJoinMsg({ text: "", type: "" }), 4000);
    } catch (error: any) {
 
      const errorText = error.response?.data?.error || "Código inválido o grupo no encontrado.";
      setJoinMsg({ text: errorText, type: "error" });
    } finally {
      setLoadingJoin(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="bg-gradient-to-r from-primary to-green-600 p-6 md:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-10 -top-10 text-white opacity-10">
          <Key className="w-48 h-48 transform rotate-45" />
        </div>
        
        <div className="relative z-10 w-full md:w-1/2">
          <span className="bg-white/20 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
            
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">¿Tienes un código de invitación?</h2>
          <p className="text-green-100 text-sm md:text-base opacity-90">
            Ingresa el código que te dio tu tutor para unirte a tu grupo y comenzar a sumar juntos.
          </p>
        </div>

        <div className="relative z-10 w-full md:w-auto flex-1 max-w-md bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-inner">
          <form onSubmit={handleUnirseGrupo} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder=""
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                maxLength={6}
                className="w-full pl-4 pr-4 py-3 bg-white text-gray-900 rounded-xl outline-none font-bold tracking-widest uppercase placeholder:text-gray-400 focus:ring-4 focus:ring-green-400/50 transition-all text-center text-lg"
              />
            </div>
            <button 
              type="submit"
              disabled={loadingJoin || codigo.length < 4}
              className="w-full bg-accent hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingJoin ? "Conectando..." : "Vincular a mi Grupo"}
              {!loadingJoin && <ArrowRight className="w-4 h-4" />}
            </button>
            
            {joinMsg.text && joinMsg.type !== 'loading' && (
              <div className={`mt-2 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${
                joinMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {joinMsg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                {joinMsg.text}
              </div>
            )}
          </form>
        </div>
      </div>

     
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 p-5 bg-green-50 rounded-2xl">
          <Target className="w-10 h-10 text-primary" strokeWidth={2} />
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold text-textMain mb-2">Tu Progreso de Reciclaje</h2>
          <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
            <span>{data.progreso.actual} piezas aportadas</span>
            <span>Meta: {data.progreso.meta}</span>
          </div>
          <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-gray-100">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(data.progreso.porcentaje, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-right text-xs font-bold text-primary mt-2">{data.progreso.porcentaje}% Completado</p>
        </div>
      </div>

  
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-gray-50 bg-white space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
              <Recycle className="w-5 h-5 text-secondary" strokeWidth={2} />
              Mis Depósitos Recientes
            </h3>
            <p className="text-sm text-gray-500 mt-1">Historial de tus aportaciones validadas.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm text-textMain focus:ring-primary focus:border-primary bg-background/50 hover:bg-white transition-colors outline-none"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={filtroMaterial}
                onChange={(e) => setFiltroMaterial(e.target.value)}
                className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-textMain focus:ring-primary focus:border-primary bg-background/50 hover:bg-white transition-colors appearance-none outline-none"
              >
                <option value="">Todos los materiales</option>
                {materialesUnicos.map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4 text-right">Cantidad</th>
                <th className="px-6 py-4 text-right">Validado Por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {depositosFiltrados.length > 0 ? (
                depositosFiltrados.map((deposito) => (
                  <tr key={deposito.id} className="hover:bg-background/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(deposito.fecha).toLocaleDateString('es-MX', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-green-50 text-primary border border-green-100">
                        {deposito.material}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-textMain font-black text-right">
                      {deposito.cantidad} <span className="text-gray-400 text-xs font-semibold">pzs</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium flex items-center justify-end gap-2">
                      <User className="w-4 h-4" strokeWidth={2} />
                      {deposito.operador}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p className="text-sm font-medium text-gray-500">No se encontraron depósitos</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AlumnoDashboard;
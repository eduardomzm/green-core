import { useState, useEffect } from "react";
import { CheckCircle, Package, Clock } from "lucide-react";
import type { DashboardResponse } from "../../types/dashboard.types";

// Importamos los servicios necesarios (Asegúrate de que las rutas sean correctas)
import { getUsers, type User } from "../../services/userService";
import { getMateriales, createDeposito, type Material } from "../../services/reciclajeService";

interface Props {
  data: DashboardResponse;
}

const OperadorDashboard = ({ data }: Props) => {
  // Estados para cargar alumnos y materiales desde el backend
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [alumnos, setAlumnos] = useState<User[]>([]);
  const [loadingDatos, setLoadingDatos] = useState(true);

  // Estados idénticos a los de tu vista de Depósitos.tsx
  const [matriculaBusqueda, setMatriculaBusqueda] = useState("");
  const [alumnoEncontrado, setAlumnoEncontrado] = useState<User | null>(null);
  const [errorAlumno, setErrorAlumno] = useState("");
  const [depositoForm, setDepositoForm] = useState({ material_id: "", cantidad: "" });
  const [depositoMsg, setDepositoMsg] = useState({ text: "", type: "" }); 

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDatos(true);
        const [materialesData, usuariosData] = await Promise.all([
          getMateriales(),
          getUsers()
        ]);
        
        setMateriales(materialesData);
        setAlumnos(usuariosData.filter(u => u.role === "ALUMNO"));
      } catch (error) {
        console.error("Error al cargar datos iniciales", error);
      } finally {
        setLoadingDatos(false);
      }
    };
    fetchData();
  }, []);

  // Lógica de búsqueda idéntica a Depositos.tsx
  const buscarAlumno = () => {
    setErrorAlumno("");
    setAlumnoEncontrado(null);
    setDepositoMsg({ text: "", type: "" });
    
    if (!matriculaBusqueda.trim()) return;

    const match = alumnos.find(a => a.matricula === matriculaBusqueda.trim());
    
    if (match) {
      setAlumnoEncontrado(match);
    } else {
      setErrorAlumno("No se encontró ningún alumno con esta matrícula.");
    }
  };

  // Lógica de envío idéntica a Depositos.tsx
  const handleDepositoSubmit = async () => {
    if (!alumnoEncontrado || !depositoForm.material_id || !depositoForm.cantidad) return;
    setDepositoMsg({ text: "Registrando...", type: "loading" });

    try {
      await createDeposito({
        alumno: alumnoEncontrado.id,
        material: parseInt(depositoForm.material_id),
        cantidad: parseInt(depositoForm.cantidad) 
      });
      
      setDepositoMsg({ text: "¡Depósito registrado con éxito! ", type: "success" });
      setDepositoForm({ material_id: "", cantidad: "" });
      setMatriculaBusqueda("");
      setAlumnoEncontrado(null);
      
      setTimeout(() => {
        setDepositoMsg({ text: "", type: "" });
        // Opcional: Aquí podrías forzar una recarga de la página para actualizar las estadísticas
        // window.location.reload(); 
      }, 3000);
    } catch (error: any) {
      setDepositoMsg({ text: "Error al registrar el depósito.", type: "error" });
    }
  };

  if (loadingDatos) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <p className="text-gray-500 font-bold animate-pulse text-lg">Preparando estación de trabajo...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* TARJETAS DE ESTADÍSTICAS DEL OPERADOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 rounded-full text-primary">
            <CheckCircle className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Depósitos Registrados</p>
            <h3 className="text-3xl font-black text-textMain">{data.estadisticas.total_depositos}</h3>
            <p className="text-xs text-gray-400 mt-1">Por ti en esta jornada</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-full text-secondary">
            <Package className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Piezas Recibidas</p>
            <h3 className="text-3xl font-black text-textMain">{data.estadisticas.total_piezas}</h3>
            <p className="text-xs text-gray-400 mt-1">Total de artículos procesados</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* COLUMNA IZQUIERDA: EL DISEÑO EXACTO DE DEPOSITOS.TSX */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-primary relative">
            <div className="absolute -top-10 -right-10 text-9xl opacity-5"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl text-primary text-2xl"></div>
                <h3 className="text-2xl font-bold text-textMain">Nuevo Depósito</h3>
              </div>
              {depositoMsg.text && (
                <span className={`text-sm font-bold px-4 py-2 rounded-xl ${depositoMsg.type === 'success' ? 'bg-green-100 text-green-700' : depositoMsg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                  {depositoMsg.text}
                </span>
              )}
            </div>
            
            <form className="space-y-6 relative z-10">
              
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Buscar Alumno por Matrícula</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder=""
                    value={matriculaBusqueda}
                    onChange={(e) => setMatriculaBusqueda(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), buscarAlumno())}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-white" 
                  />
                  <button 
                    type="button" 
                    onClick={buscarAlumno}
                    className="bg-primary hover:bg-primary text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    Buscar
                  </button>
                </div>
                
                {alumnoEncontrado && (
                  <div className="mt-3 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in-up">
                    <span></span> Alumno seleccionado: {alumnoEncontrado.first_name} {alumnoEncontrado.primer_apellido} ({alumnoEncontrado.matricula})
                  </div>
                )}
                {errorAlumno && (
                  <div className="mt-3 px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold animate-fade-in-up">
                    {errorAlumno}
                  </div>
                )}
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 transition-opacity duration-300 ${!alumnoEncontrado ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">2. Material a depositar</label>
                  <select 
                    value={depositoForm.material_id}
                    onChange={(e) => setDepositoForm({...depositoForm, material_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50"
                  >
                    <option value="">Selecciona el material...</option>
                    {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.unidad})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">3. Cantidad (En enteros)</label>
                  <input 
                    type="number" min="1" placeholder=""
                    value={depositoForm.cantidad}
                    onChange={(e) => setDepositoForm({...depositoForm, cantidad: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50" 
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleDepositoSubmit}
                disabled={!alumnoEncontrado || !depositoForm.material_id || !depositoForm.cantidad || depositoMsg.type === 'loading'}
                className="w-full bg-primary hover:bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 mt-4"
              >
                Confirmar y Registrar Depósito
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL RECIENTE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" strokeWidth={2} />
                  Últimos registros
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.ultimos_depositos && data.ultimos_depositos.length > 0 ? (
                    data.ultimos_depositos.slice(0, 8).map((deposito) => (
                      <tr key={deposito.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4 text-xs text-textMain font-medium whitespace-nowrap">
                          {new Date(deposito.fecha).toLocaleDateString('es-MX', { 
                            month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-secondary border border-blue-100">
                              {deposito.material}
                            </span>
                            <span className="text-sm font-bold text-textMain">{deposito.cantidad}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500 font-medium">
                        Aún no has registrado depósitos hoy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OperadorDashboard;
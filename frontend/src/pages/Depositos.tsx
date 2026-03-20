import { useState, useEffect } from "react";
import { getUsers, type User } from "../services/userService";
import { getMateriales, createDeposito, type Material } from "../services/reciclajeService";

const Depositos = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [alumnos, setAlumnos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [matriculaBusqueda, setMatriculaBusqueda] = useState("");
  const [alumnoEncontrado, setAlumnoEncontrado] = useState<User | null>(null);
  const [errorAlumno, setErrorAlumno] = useState("");
  const [depositoForm, setDepositoForm] = useState({ material_id: "", cantidad: "" });
  const [depositoMsg, setDepositoMsg] = useState({ text: "", type: "" }); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [materialesData, usuariosData] = await Promise.all([
          getMateriales(),
          getUsers()
        ]);
        
        setMateriales(materialesData);
        setAlumnos(usuariosData.filter((u: User) => u.role === "ALUMNO"));
      } catch (error) {
        console.error("Error al cargar datos iniciales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      
      setTimeout(() => setDepositoMsg({ text: "", type: "" }), 3000);
    } catch (error: any) {
      setDepositoMsg({ text: "Error al registrar el depósito.", type: "error" });
    }
  };



  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 font-bold animate-pulse text-lg">Cargando módulos...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-primary relative">
          <div className="absolute -top-10 -right-10 text-9xl opacity-5"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl text-primary text-2xl"></div>
              <h3 className="text-2xl font-bold text-textMain">Nuevo Depósito</h3>
            </div>
            {depositoMsg.text && (
              <span className={`text-sm font-bold px-4 py-2 rounded-xl animate-fade-in ${depositoMsg.type === 'success' ? 'bg-green-100 text-green-700' : depositoMsg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                {depositoMsg.text}
              </span>
            )}
          </div>
          
          <form className="space-y-8 relative z-10">
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">1. Buscar Alumno por Matrícula</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Ingresa la matrícula del alumno..."
                  value={matriculaBusqueda}
                  onChange={(e) => setMatriculaBusqueda(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), buscarAlumno())}
                  className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-white shadow-sm transition-all" 
                />
                <button 
                  type="button" 
                  onClick={buscarAlumno}
                  className="bg-primary hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Buscar
                </button>
              </div>
              
              {alumnoEncontrado && (
                <div className="mt-4 px-5 py-4 bg-green-50 text-green-700 border border-green-100 rounded-xl text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Alumno seleccionado: {alumnoEncontrado.first_name} {alumnoEncontrado.primer_apellido} ({alumnoEncontrado.matricula})
                </div>
              )}
              {errorAlumno && (
                <div className="mt-4 px-5 py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold animate-in slide-in-from-top-2 duration-300">
                  {errorAlumno}
                </div>
              )}
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ${!alumnoEncontrado ? 'opacity-30 blur-[1px] pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">2. Material a depositar</label>
                <select 
                  value={depositoForm.material_id}
                  onChange={(e) => setDepositoForm({...depositoForm, material_id: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50 hover:bg-white transition-colors appearance-none"
                >
                  <option value="">Selecciona el material...</option>
                  {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.unidad})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">3. Cantidad (En piezas/unidades)</label>
                <input 
                  type="number" min="1" placeholder="0"
                  value={depositoForm.cantidad}
                  onChange={(e) => setDepositoForm({...depositoForm, cantidad: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50 hover:bg-white transition-colors" 
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleDepositoSubmit}
              disabled={!alumnoEncontrado || !depositoForm.material_id || !depositoForm.cantidad || depositoMsg.type === 'loading'}
              className="w-full bg-primary hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-extrabold py-5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-6 text-lg"
            >
              {depositoMsg.type === 'loading' ? 'Registrando...' : 'Confirmar y Registrar Depósito'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
    
  );
};

export default Depositos;
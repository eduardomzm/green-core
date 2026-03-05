import { useState, useEffect } from "react";
import { getUsers, type User } from "../services/userService";
import { getMateriales, createMaterial, createDeposito, createMeta, type Material } from "../services/reciclajeService";

const Depositos = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [alumnos, setAlumnos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [matriculaBusqueda, setMatriculaBusqueda] = useState("");
  const [alumnoEncontrado, setAlumnoEncontrado] = useState<User | null>(null);
  const [errorAlumno, setErrorAlumno] = useState("");
  const [depositoForm, setDepositoForm] = useState({ material_id: "", cantidad: "" });
  const [depositoMsg, setDepositoMsg] = useState({ text: "", type: "" }); 

  const [materialForm, setMaterialForm] = useState({ nombre: "", unidad: "pieza" });
  const [materialMsg, setMaterialMsg] = useState({ text: "", type: "" });

  const [metaForm, setMetaForm] = useState({ nombre: "", cantidad_meta: "" });
  const [metaMsg, setMetaMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [materialesData, usuariosData] = await Promise.all([
          getMateriales(),
          getUsers()
        ]);
        
        setMateriales(materialesData);
        setAlumnos(usuariosData.filter(u => u.role === "ALUMNO"));
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

  const handleMaterialSubmit = async () => {
    if (!materialForm.nombre) return;
    setMaterialMsg({ text: "Guardando...", type: "loading" });

    try {
      const nuevoMaterial = await createMaterial(materialForm);
      setMateriales([...materiales, nuevoMaterial]);
      setMaterialMsg({ text: "¡Material guardado!", type: "success" });
      setMaterialForm({ nombre: "", unidad: "pieza" });
      
      setTimeout(() => setMaterialMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setMaterialMsg({ text: "Error al crear material.", type: "error" });
    }
  };

  const handleMetaSubmit = async () => {
    if (!metaForm.nombre || !metaForm.cantidad_meta) return;
    setMetaMsg({ text: "Configurando...", type: "loading" });

    try {
      await createMeta({
        nombre: metaForm.nombre,
        cantidad_meta: parseInt(metaForm.cantidad_meta),
        activa: true
      });
      setMetaMsg({ text: "¡Meta global actualizada! ", type: "success" });
      setMetaForm({ nombre: "", cantidad_meta: "" });
      
      setTimeout(() => setMetaMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setMetaMsg({ text: "Error al actualizar la meta.", type: "error" });
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
        <h2 className="text-3xl font-extrabold text-textMain">Depósitos y Configuración</h2>
        <p className="text-gray-500 mt-1">Registra transacciones, administra materiales y define las metas globales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
        <div className="lg:col-span-2 space-y-6">
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

      
        <div className="space-y-8">
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-secondary relative">
            <h3 className="text-lg font-bold text-textMain mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><span></span> Añadir Material</span>
              {materialMsg.text && <span className={`text-xs px-2 py-1 rounded-md ${materialMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{materialMsg.text}</span>}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre</label>
                <input type="text" placeholder=""
                  value={materialForm.nombre} onChange={(e) => setMaterialForm({...materialForm, nombre: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Unidad de medida</label>
                <select 
                  value={materialForm.unidad} onChange={(e) => setMaterialForm({...materialForm, unidad: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50"
                >
                  <option value="pieza">Por Pieza</option>
                  <option value="kg">Por Kilogramo</option>
                </select>
              </div>

              <button type="button" onClick={handleMaterialSubmit} disabled={!materialForm.nombre || materialMsg.type === 'loading'}
                className="w-full bg-secondary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm mt-2">
                Guardar Material
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-accent relative">
            <h3 className="text-lg font-bold text-textMain mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><span></span> Configurar Meta Global</span>
              {metaMsg.text && <span className={`text-xs px-2 py-1 rounded-md ${metaMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{metaMsg.text}</span>}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre de la Campaña</label>
                <input type="text" placeholder=""
                  value={metaForm.nombre} onChange={(e) => setMetaForm({...metaForm, nombre: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-background/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Cantidad a lograr</label>
                <input type="number" min="1" placeholder=""
                  value={metaForm.cantidad_meta} onChange={(e) => setMetaForm({...metaForm, cantidad_meta: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-background/50" />
              </div>
              <button type="button" onClick={handleMetaSubmit} disabled={!metaForm.nombre || !metaForm.cantidad_meta || metaMsg.type === 'loading'}
                className="w-full bg-accent hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm mt-2">
                Activar Nueva Meta
              </button>
              
            </form>
          </div>

        </div>
      </div>
    </div>
    
  );
};

export default Depositos;
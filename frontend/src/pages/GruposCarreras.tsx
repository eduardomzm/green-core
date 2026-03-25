import { useState, useEffect } from "react";
import { GraduationCap, Users, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { getUsers, getCarreras, type User, type Carrera } from "../services/userService";
import { getGrupos, createGrupo, type Grupo } from "../services/reciclajeService";

export default function GruposCarreras() {
  // Datos
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [tutores, setTutores] = useState<User[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  // Formularios y Mensajes

  const [grupoForm, setGrupoForm] = useState({ nombre: "", carrera_id: "", tutor_id: "" });
  const [grupoMsg, setGrupoMsg] = useState({ text: "", type: "" });

  // Cargar información al abrir la pantalla
  const fetchData = async () => {
    try {
      setLoading(true);
      const [carrerasData, usuariosData, gruposData] = await Promise.all([
        getCarreras(),
        getUsers(),
        getGrupos()
      ]);
      setCarreras(carrerasData);
      setTutores(usuariosData.filter((u: User) => u.role === "TUTOR"));
      setGrupos(gruposData);
    } catch (error) {
      console.error("Error cargando datos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Función para crear Grupo
  const handleGrupoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grupoForm.nombre || !grupoForm.carrera_id || !grupoForm.tutor_id) return;
    setGrupoMsg({ text: "Creando grupo...", type: "loading" });

    try {
      await createGrupo({
        nombre: grupoForm.nombre,
        carrera: parseInt(grupoForm.carrera_id),
        tutor: parseInt(grupoForm.tutor_id),
        activo: true
      });
      setGrupoMsg({ text: "¡Grupo creado! El código se generó automáticamente.", type: "success" });
      setGrupoForm({ nombre: "", carrera_id: "", tutor_id: "" });
      fetchData(); // Recargar la lista
      setTimeout(() => setGrupoMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setGrupoMsg({ text: "Error. Verifica que el tutor no tenga ya un grupo asignado.", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <p className="text-gray-500 font-bold animate-pulse text-lg">Cargando módulos de administración...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-extrabold text-textMain">Grupos y Carreras</h2>
        <p className="text-gray-500 mt-1">Estructura la escuela, crea nuevas disciplinas y asigna tutores a sus grupos.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        

        {/* PANEL: CREAR GRUPO Y ASIGNAR TUTOR */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-secondary opacity-5">
            <Users className="w-40 h-40" />
          </div>

          <div className="relative z-10 flex items-center gap-3 mb-6">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
              <GraduationCap className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-textMain">Nuevo Grupo y Tutor</h3>
          </div>

          <form onSubmit={handleGrupoSubmit} className="relative z-10 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre del Grupo</label>
              <input 
                type="text" 
                required
                value={grupoForm.nombre}
                onChange={(e) => setGrupoForm({...grupoForm, nombre: e.target.value})}
                placeholder=""
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-gray-50/50 transition-all" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Carrera a la que pertenece</label>
                <select 
                  required
                  value={grupoForm.carrera_id}
                  onChange={(e) => setGrupoForm({...grupoForm, carrera_id: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-gray-50/50 appearance-none"
                >
                  <option value="">Seleccionar...</option>
                  {carreras.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tutor a cargo</label>
                <select 
                  required
                  value={grupoForm.tutor_id}
                  onChange={(e) => setGrupoForm({...grupoForm, tutor_id: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-gray-50/50 appearance-none"
                >
                  <option value="">Seleccionar Tutor...</option>
                  {tutores.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.primer_apellido}</option>)}
                </select>
              </div>
            </div>

            {grupoMsg.text && (
              <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${grupoMsg.type === 'success' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                {grupoMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {grupoMsg.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={!grupoForm.nombre || !grupoForm.carrera_id || !grupoForm.tutor_id || grupoMsg.type === 'loading'}
              className="w-full bg-secondary hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <Plus className="w-5 h-5" />
              Crear Grupo y Asignar
            </button>
          </form>

        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Grupos Actuales ({grupos.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grupos.map(g => (
                <div key={g.id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-secondary">
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-black text-textMain group-hover:text-secondary transition-colors">
                      {g.nombre}
                    </p>
                    <div className="space-y-1 mt-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                        <GraduationCap className="w-3 h-3 text-secondary" />
                        {g.carrera_nombre || 'Sin Carrera'}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-primary" />
                        Tutor: <span className="text-textMain">{g.tutor_nombre || 'Sin asignar'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

      </div>
      
    </div>
  );
}
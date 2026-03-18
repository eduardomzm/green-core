import { useState, useEffect } from "react";
import { Users, Copy, CheckCircle, Target } from "lucide-react";
import { getMiGrupoTutor } from "../services/reciclajeService";

export default function MiGrupo() {
  const [grupoData, setGrupoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const data = await getMiGrupoTutor();
        setGrupoData(data);
      } catch (error) {
        console.error("Error al cargar grupo", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrupo();
  }, []);

  // Esta es la función que Vercel estaba buscando
  const copiarCodigo = () => {
    if (grupoData?.codigo_invitacion) {
      navigator.clipboard.writeText(grupoData.codigo_invitacion);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500 animate-pulse font-medium">Cargando información de tu grupo...</div>;
  }

  if (!grupoData) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
        <h3 className="text-xl font-bold text-gray-800">No tienes grupo asignado</h3>
        <p className="text-gray-500 mt-2">Contacta a un administrador para que te asigne como tutor de un grupo.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      
      <div>
        <h2 className="text-3xl font-extrabold text-textMain">{grupoData.nombre}</h2>
        <p className="text-gray-500 mt-1">{grupoData.carrera}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TARJETA DEL CÓDIGO DE INVITACIÓN */}
        <div className="lg:col-span-1">
          <div className="bg-primary p-8 rounded-3xl shadow-lg text-white text-center relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 bg-white opacity-10 w-40 h-40 rounded-full transform group-hover:scale-110 transition-transform duration-500"></div>
            
            <p className="text-primary-100 font-bold uppercase tracking-widest text-sm mb-4">Código de Invitación</p>
            
            <div 
              className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl flex items-center justify-center gap-4 cursor-pointer hover:bg-white/30 transition-colors" 
              onClick={copiarCodigo}
            >
              <span className="text-4xl font-black tracking-widest">{grupoData.codigo_invitacion}</span>
              {copiado ? <CheckCircle className="w-6 h-6 text-green-300" /> : <Copy className="w-6 h-6 text-white" />}
            </div>
            
            <p className="text-sm text-primary-100 mt-4 font-medium">
              {copiado ? "¡Copiado al portapapeles!" : "Haz clic para copiar y compartir"}
            </p>
          </div>
        </div>

        {/* LISTA DE ALUMNOS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Tus Alumnos ({grupoData.alumnos?.length || 0})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
              {grupoData.alumnos && grupoData.alumnos.length > 0 ? (
                grupoData.alumnos.map((alumno: any) => (
                  <div key={alumno.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-textMain">{alumno.nombre}</h4>
                      <p className="text-sm text-gray-500">Matrícula: {alumno.matricula}</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-accent hover:text-orange-600 bg-orange-50 px-4 py-2 rounded-xl transition-colors">
                      <Target className="w-4 h-4" />
                      Asignar Meta
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 font-medium">Aún no hay alumnos en tu grupo.</p>
                  <p className="text-sm mt-2">Comparte el código de invitación para que comiencen a unirse.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Users, Copy, CheckCircle, Target, UserX, UserCheck, X } from "lucide-react";
import { autorizarIngresoGrupo, autorizarSalidaGrupo, getMiGrupoTutor, getMateriales, asignarMetaAlumno, type Material } from "../services/reciclajeService";

export default function MiGrupo() {
  const [grupoData, setGrupoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);
  const [materiales, setMateriales] = useState<Material[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<{ id: number; nombre: string } | null>(null);
  const [metaForm, setMetaForm] = useState({ material_id: "", cantidad_meta: "" });
  const [metaMsg, setMetaMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const init = async () => {
      try {
        const [grupoRes, materialesRes] = await Promise.all([
          getMiGrupoTutor(),
          getMateriales()
        ]);
        setGrupoData(grupoRes);
        setMateriales(materialesRes.filter(m => m.activo));
      } catch (error) {
        console.error("Error al cargar datos", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const autorizarIngreso = async (alumno_id: number) => {
    try {
      await autorizarIngresoGrupo(alumno_id);
      const data = await getMiGrupoTutor();
      setGrupoData(data);
    } catch (error) {
      console.error("Error al autorizar ingreso", error);
    }
  };

  const autorizarSalida = async (alumno_id: number) => {
    try {
      await autorizarSalidaGrupo(alumno_id);
      const data = await getMiGrupoTutor();
      setGrupoData(data);
    } catch (error) {
      console.error("Error al autorizar salida", error);
    }
  };

  const copiarCodigo = () => {
    if (grupoData?.codigo_invitacion) {
      navigator.clipboard.writeText(grupoData.codigo_invitacion);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const openModal = (alumno: { id: number; nombre: string }) => {
    setSelectedAlumno(alumno);
    setMetaForm({ material_id: "", cantidad_meta: "" });
    setMetaMsg({ text: "", type: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAlumno(null);
  };

  const handleAsignarMeta = async () => {
    if (!metaForm.material_id || !metaForm.cantidad_meta || !selectedAlumno) return;
    setMetaMsg({ text: "Guardando...", type: "loading" });

    try {
      await asignarMetaAlumno({
        alumno_id: selectedAlumno.id,
        material_id: parseInt(metaForm.material_id),
        cantidad_meta: parseInt(metaForm.cantidad_meta),
      });
      setMetaMsg({ text: "¡Meta asignada con éxito!", type: "success" });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setMetaMsg({ text: "Error al asignar la meta.", type: "error" });
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

        {/* SOLICITUDES Y LISTA DE ALUMNOS */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* SOLICITUDES PENDIENTES */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-secondary" />
                  Solicitudes Pendientes ({(grupoData.solicitudes_ingreso?.length || 0) + (grupoData.solicitudes_salida?.length || 0)})
                </h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                {[
                  ...(grupoData.solicitudes_ingreso || []).map((s: any) => ({ ...s, tipo: 'INGRESO' })),
                  ...(grupoData.solicitudes_salida || []).map((s: any) => ({ ...s, tipo: 'SALIDA' }))
                ].length > 0 ? (
                  [
                    ...(grupoData.solicitudes_ingreso || []).map((s: any) => ({ ...s, tipo: 'INGRESO' })),
                    ...(grupoData.solicitudes_salida || []).map((s: any) => ({ ...s, tipo: 'SALIDA' }))
                  ].map((alumno: any) => (
                    <div key={`${alumno.tipo}-${alumno.id}`} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-bold text-textMain">{alumno.nombre}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500">Matrícula: {alumno.matricula}</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${alumno.tipo === 'INGRESO'
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                              }`}>
                              {alumno.tipo === 'INGRESO' ? 'Solicitud Ingreso' : 'Solicitud Salida'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {alumno.tipo === 'INGRESO' ? (
                          <button
                            onClick={() => autorizarIngreso(alumno.id)}
                            className="flex items-center gap-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            <UserCheck className="w-4 h-4" />
                            Autorizar
                          </button>
                        ) : (
                          <button
                            onClick={() => autorizarSalida(alumno.id)}
                            className="flex items-center gap-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            <UserX className="w-4 h-4" />
                            Autorizar salida
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 font-medium">No hay solicitudes pendientes.</p>
                  </div>
                )}
              </div>
            </div>

            {/* LISTA DE ALUMNOS ACTIVOS */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  Tus Alumnos ({grupoData.alumnos_activos?.length || 0})
                </h3>
              </div>

              <div className="divide-y divide-gray-50 max-h-[260px] overflow-y-auto">
                {grupoData.alumnos_activos && grupoData.alumnos_activos.length > 0 ? (
                  grupoData.alumnos_activos.map((alumno: any) => (
                    <div key={alumno.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <h4 className="font-bold text-textMain">{alumno.nombre}</h4>
                        <p className="text-sm text-gray-500">Matrícula: {alumno.matricula}</p>
                      </div>
                      <button
                        onClick={() => openModal({ id: alumno.id, nombre: alumno.nombre })}
                        className="flex items-center gap-2 text-sm font-bold text-accent hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors"
                      >
                        <Target className="w-4 h-4" />
                        Asignar Meta
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 font-medium">Aún no hay alumnos activos en tu grupo.</p>
                    <p className="text-sm mt-2">Comparte el código de invitación para que comiencen a unirse.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: ASIGNAR META */}
      {modalOpen && selectedAlumno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">

            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Encabezado */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-textMain">Asignar Meta</h3>
                <p className="text-sm text-gray-500 font-medium">{selectedAlumno.nombre}</p>
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Material</label>
                <select
                  value={metaForm.material_id}
                  onChange={(e) => setMetaForm({ ...metaForm, material_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-gray-50 appearance-none"
                >
                  <option value="">Seleccionar material...</option>
                  {materiales.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre} ({m.unidad})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cantidad a lograr</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder=""
                  value={metaForm.cantidad_meta}
                  onChange={(e) => setMetaForm({ ...metaForm, cantidad_meta: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-gray-50"
                />
              </div>

              {metaMsg.text && (
                <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${metaMsg.type === 'success' ? 'bg-green-50 text-green-700' : metaMsg.type === 'loading' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                  }`}>
                  {metaMsg.text}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAsignarMeta}
                  disabled={!metaForm.material_id || !metaForm.cantidad_meta || metaMsg.type === 'loading' || metaMsg.type === 'success'}
                  className="flex-1 py-3 rounded-xl bg-accent hover:bg-orange-600 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  <Target className="w-4 h-4" />
                  Asignar Meta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { Users, Copy, CheckCircle, Target, UserX, UserCheck, X, Activity, ChevronRight, ExternalLink, Trash2 } from "lucide-react";
import UserAvatar from "../components/common/UserAvatar";
import { Link } from "react-router-dom";
import { autorizarIngresoGrupo, autorizarSalidaGrupo, rechazarIngresoGrupo, rechazarSalidaGrupo, getMiGrupoTutor, getMateriales, asignarMetaAlumno, cancelarMetaAlumno, type Material } from "../services/reciclajeService";


export default function MiGrupo() {
  const [grupoData, setGrupoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);
  const [materiales, setMateriales] = useState<Material[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<any>(null);
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [metaForm, setMetaForm] = useState({ material_id: "", cantidad_meta: "" });
  const [metaMsg, setMetaMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const init = async () => {
      try {
        const [grupoRes, materialesRes]: [any, Material[]] = await Promise.all([
          getMiGrupoTutor(),
          getMateriales()
        ]);
        setGrupoData(grupoRes);
        setMateriales(materialesRes.filter((m: Material) => m.activo));
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

  const rechazarIngreso = async (alumno_id: number) => {
    try {
      if (!window.confirm("¿Seguro que deseas rechazar esta solicitud de ingreso?")) return;
      await rechazarIngresoGrupo(alumno_id);
      const data = await getMiGrupoTutor();
      setGrupoData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const rechazarSalida = async (alumno_id: number) => {
    try {
      if (!window.confirm("¿Seguro que deseas rechazar esta solicitud de salida?")) return;
      await rechazarSalidaGrupo(alumno_id);
      const data = await getMiGrupoTutor();
      setGrupoData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (alumno: any) => {
    setSelectedAlumno(alumno);
    setMetaForm({ material_id: "", cantidad_meta: "" });
    setShowMetaForm(false);
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
      
      const data = await getMiGrupoTutor();
      setGrupoData(data);
      const updatedAlumno = data.alumnos_activos?.find((a: any) => a.id === selectedAlumno.id);
      if (updatedAlumno) setSelectedAlumno(updatedAlumno);

      setTimeout(() => {
        setShowMetaForm(false);
        setMetaMsg({ text: "", type: "" });
      }, 1500);
    } catch (error) {
      setMetaMsg({ text: "Error al asignar la meta.", type: "error" });
    }
  };

  const handleCancelarMeta = async (meta_id: number) => {
    if(!window.confirm("¿Seguro que deseas cancelar esta meta?")) return;
    try {
      await cancelarMetaAlumno(meta_id);
      const data = await getMiGrupoTutor();
      setGrupoData(data);
      const updatedAlumno = data.alumnos_activos?.find((a: any) => a.id === selectedAlumno.id);
      if (updatedAlumno) setSelectedAlumno(updatedAlumno);
    } catch (error) {
      console.error("Error al cancelar meta", error);
      alert("Error al cancelar la meta.");
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SOLICITUDES Y LISTA DE ALUMNOS (COLUMNA 1) */}
        <div className="space-y-6">
            {/* SOLICITUDES PENDIENTES */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
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
                      <div className="flex items-center gap-2">
                        {alumno.tipo === 'INGRESO' ? (
                          <>
                            <button
                              onClick={() => rechazarIngreso(alumno.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              title="Rechazar Ingreso"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => autorizarIngreso(alumno.id)}
                              className="flex items-center gap-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
                            >
                              <UserCheck className="w-4 h-4" />
                              Autorizar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => rechazarSalida(alumno.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              title="Rechazar Salida"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => autorizarSalida(alumno.id)}
                              className="flex items-center gap-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors shadow-sm"
                            >
                              <UserX className="w-4 h-4" />
                              Autorizar salida
                            </button>
                          </>
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
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 md:p-8 flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Users className="w-5 h-5" /></div>
                    Tus Alumnos
                  </h3>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {grupoData.alumnos_activos?.length || 0}
                  </span>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {(!grupoData.alumnos_activos || grupoData.alumnos_activos.length === 0) ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 font-medium">Aún no hay alumnos activos.</p>
                      <p className="text-sm mt-2 text-gray-400">Comparte el código de invitación para que comiencen a unirse.</p>
                    </div>
                  ) : (
                    grupoData.alumnos_activos.map((alumno: any) => (
                      <div 
                        key={alumno.id} 
                        onClick={() => openModal(alumno)}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50/50 transition-colors group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 group-hover:border-blue-300 flex-shrink-0">
                          <UserAvatar avatar={alumno.avatar} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                            {alumno.nombre}
                          </h4>
                          <p className="text-xs font-medium text-gray-500">Matrícula: {alumno.matricula}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
        </div>

        {/* ACTIVIDAD RECIENTE Y CÓDIGO (COLUMNA 2) */}
        <div className="space-y-6">
          {/* TARJETA DEL CÓDIGO DE INVITACIÓN */}
          <div className="bg-primary p-6 md:p-8 rounded-[2.5rem] shadow-lg text-white text-center relative overflow-hidden group">
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
              {copiado ? "¡Copiado al portapapeles!" : "Haz clic para copiar el código e invitar a tus alumnos"}
            </p>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 md:p-8 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-500 rounded-xl"><Activity className="w-5 h-5" /></div>
                  Actividad Reciente
                </h3>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {(!grupoData.actividad_reciente || grupoData.actividad_reciente.length === 0) ? (
                  <div className="text-center py-8">
                    <p className="text-sm font-medium text-gray-400">Sin actividad reciente del grupo.</p>
                  </div>
                ) : (
                  grupoData.actividad_reciente.map((act: any) => (
                    <Link 
                      key={act.id} 
                      to={`/dashboard/perfil/${act.alumno_username}`}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-green-50/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 group-hover:border-green-300 flex-shrink-0">
                        <UserAvatar avatar={act.alumno_avatar} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">
                          <span className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{act.alumno_nombre}</span>
                          {' '}recicló <span className="font-bold text-gray-900">{act.cantidad}</span> {act.material_nombre}
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          {new Date(act.fecha).toLocaleDateString('es-MX', {day: 'numeric', month: 'short'})}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: INFO ESTUDIANTE Y METAS */}
      {modalOpen && selectedAlumno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-6 md:p-8 relative animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            {/* Encabezado: Info Estudiante */}
            <div className="flex flex-col items-center text-center mb-8 pt-4">
              <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl bg-gray-50 mb-4 flex-shrink-0">
                <UserAvatar avatar={selectedAlumno.avatar} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">{selectedAlumno.nombre}</h3>
              <p className="text-sm text-gray-500 font-medium mb-1">@{selectedAlumno.username} • Matrícula: {selectedAlumno.matricula}</p>
              
              <Link 
                to={`/dashboard/perfil/${selectedAlumno.username}`}
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Perfil
              </Link>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* Sección de Metas */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Metas asignadas
                </h4>
                {(!showMetaForm && (selectedAlumno.metas?.length || 0) > 0) && (
                  <button 
                    onClick={() => setShowMetaForm(true)}
                    className="text-sm font-bold text-accent hover:text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Nueva Meta
                  </button>
                )}
              </div>

              {/* Lista de Metas Constantes */}
              {selectedAlumno.metas && selectedAlumno.metas.length > 0 ? (
                <div className="space-y-3">
                  {selectedAlumno.metas.map((meta: any) => (
                    <div key={meta.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Recolectar <span className="text-accent">{meta.cantidad_meta}</span> de {meta.material_nombre}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Asignada el {new Date(meta.creada_en).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleCancelarMeta(meta.id)}
                        className="flex items-center justify-center gap-2 text-xs font-bold text-red-600 bg-white hover:bg-red-50 border border-red-200 px-3 py-2 rounded-xl transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                !showMetaForm && (
                  <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm mb-3">Este alumno no tiene ninguna meta asignada.</p>
                    <button 
                      onClick={() => setShowMetaForm(true)}
                      className="text-sm font-bold text-white bg-accent hover:bg-orange-600 px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      Asignar primera meta
                    </button>
                  </div>
                )
              )}

              {/* Formulario Nueva Meta */}
              {showMetaForm && (
                <div className="bg-white border text-left border-gray-200 p-5 rounded-2xl shadow-sm mt-4 animate-in slide-in-from-top-2">
                  <h5 className="font-bold text-sm text-gray-900 mb-4">Configurar nueva meta</h5>
                  <div className="space-y-4">
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
                        placeholder="Ej. 100"
                        value={metaForm.cantidad_meta}
                        onChange={(e) => setMetaForm({ ...metaForm, cantidad_meta: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-gray-50"
                      />
                    </div>

                    {metaMsg.text && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${metaMsg.type === 'success' ? 'bg-green-50 text-green-700' : metaMsg.type === 'loading' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {metaMsg.text}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMetaForm(false);
                          setMetaMsg({text:"", type:""});
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleAsignarMeta}
                        disabled={!metaForm.material_id || !metaForm.cantidad_meta || metaMsg.type === 'loading' || metaMsg.type === 'success'}
                        className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-orange-600 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Target className="w-4 h-4" />
                        Asignar Meta
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle, Key, Users, Activity, LogOut, ChevronRight, X, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getMiGrupoAlumno,
  solicitarSalidaGrupo,
  unirseGrupo,
} from "../services/reciclajeService";

const AVATARS = [
  { id: 'default', url: '/src/assets/img/logo.jpeg' },
  { id: 'leaf', url: '/avatars/avatar_leaf.png' },
  { id: 'earth', url: '/avatars/avatar_earth.png' },
  { id: 'sprout', url: '/avatars/avatar_sprout.png' },
  { id: 'water', url: '/avatars/avatar_water.png' },
];

export default function UnirseMiGrupo() {
  const [miGrupoAlumno, setMiGrupoAlumno] = useState<any | null>(null);
  const [loadingAlumno, setLoadingAlumno] = useState(true);

  const [codigo, setCodigo] = useState("");
  const [joinMsg, setJoinMsg] = useState<{ text: string; type: string }>({
    text: "",
    type: "",
  });
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(true);

  // Modals para compañeros y actividad
  const [showCompanerosModal, setShowCompanerosModal] = useState(false);
  const [showActividadModal, setShowActividadModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const fetchMiGrupoAlumno = async () => {
    try {
      const data = await getMiGrupoAlumno();
      const hasGrupo = !!data?.grupo;
      setMiGrupoAlumno(hasGrupo ? data : null);

      if (hasGrupo && data?.estado === "PENDIENTE_INGRESO") {
        setShowJoinForm(false);
      } else if (!hasGrupo) {
        setShowJoinForm(true);
      }
    } catch (error) {
      console.error("Error al cargar mi grupo", error);
      setMiGrupoAlumno(null);
    } finally {
      setLoadingAlumno(false);
    }
  };

  useEffect(() => {
    fetchMiGrupoAlumno();
  }, []);

  const handleUnirseGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    if (miGrupoAlumno?.estado === "ACTIVO") return;
    if (miGrupoAlumno?.estado === "PENDIENTE_SALIDA") return;

    setLoadingJoin(true);
    setJoinMsg({ text: "Verificando...", type: "loading" });

    try {
      const code = codigo.trim().toUpperCase();
      const res = await unirseGrupo(code);
      setJoinMsg({
        text: res.mensaje || "¡Solicitud enviada!",
        type: "success",
      });
      setCodigo("");
      setShowJoinForm(false);
      await fetchMiGrupoAlumno();

      setTimeout(() => setJoinMsg({ text: "", type: "" }), 4000);
    } catch (error: any) {
      const errorText =
        error.response?.data?.error ||
        "Código inválido o grupo no encontrado.";
      setJoinMsg({ text: errorText, type: "error" });
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleIngresarOtroCodigo = () => {
    setShowJoinForm(true);
    setCodigo("");
    setJoinMsg({ text: "", type: "" });
  };

  const handleSolicitarSalida = async () => {
    setLoadingJoin(true);
    setJoinMsg({ text: "Enviando solicitud...", type: "loading" });
    try {
      await solicitarSalidaGrupo();
      await fetchMiGrupoAlumno();
      setJoinMsg({ text: "Solicitud de salida enviada correctamente.", type: "success" });
      setTimeout(() => setJoinMsg({ text: "", type: "" }), 4000);
    } catch (error: any) {
      console.error("Error al solicitar salida", error);
      const errorText = error.response?.data?.error || "Error al enviar la solicitud.";
      setJoinMsg({ text: errorText, type: "error" });
    } finally {
      setLoadingJoin(false);
    }
  };

  const estado = miGrupoAlumno?.estado as string | undefined;
  const codigoInvitacion = miGrupoAlumno?.grupo?.codigo_invitacion as
    | string
    | undefined;

  if (loadingAlumno) {
    return (
      <div className="p-8 text-gray-500 animate-pulse font-medium">
        Cargando información de tu grupo...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {miGrupoAlumno && estado === "ACTIVO" ? (
        <div className="space-y-8">
          
          {/* HEADER: INFO DEL TUTOR */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
            
            <div className="flex-shrink-0 relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex items-center justify-center">
                {miGrupoAlumno.grupo?.tutor_info?.avatar ? (
                  <img 
                    src={AVATARS.find(a => a.id === miGrupoAlumno.grupo.tutor_info.avatar)?.url || AVATARS[0].url} 
                    alt="Tutor avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white transform rotate-3">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="text-center md:text-left pt-2 relative z-10">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tu Tutor Asignado</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
                {miGrupoAlumno.grupo?.tutor_info ? `${miGrupoAlumno.grupo.tutor_info.nombre} ${miGrupoAlumno.grupo.tutor_info.apellidos}` : 'Tutor no asignado'}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-lg border border-green-100">
                  {miGrupoAlumno.grupo?.nombre}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100">
                  {miGrupoAlumno.grupo?.carrera}
                </span>
              </div>
            </div>
          </div>

          {/* COLUMNAS: COMPAÑEROS Y ACTIVIDAD */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Lista de Compañeros */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 md:p-8 flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Users className="w-5 h-5" /></div>
                    Compañeros
                  </h3>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {miGrupoAlumno.companeros?.length || 0}
                  </span>
                </div>

                <div className="space-y-2">
                  {(!miGrupoAlumno.companeros || miGrupoAlumno.companeros.length === 0) ? (
                    <div className="text-center py-8">
                      <p className="text-sm font-medium text-gray-400">Aún no hay compañeros en tu grupo.</p>
                    </div>
                  ) : (
                    miGrupoAlumno.companeros.slice(0, 5).map((comp: any) => (
                      <Link 
                        key={comp.id} 
                        to={`/dashboard/perfil/${comp.username}`}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50/50 transition-colors group"
                      >
                        <img 
                          src={AVATARS.find(a => a.id === comp.avatar)?.url || AVATARS[0].url} 
                          alt={comp.username} 
                          className="w-12 h-12 rounded-full border border-gray-200 group-hover:border-blue-300 object-cover" 
                        />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                            {comp.nombre} {comp.apellidos}
                          </p>
                          <p className="text-xs font-medium text-gray-500">@{comp.username}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </Link>
                    ))
                  )}
                </div>
              </div>
              
              {miGrupoAlumno.companeros && miGrupoAlumno.companeros.length > 5 && (
                <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                  <button 
                    onClick={() => setShowCompanerosModal(true)}
                    className="w-full py-3 text-sm font-bold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    Ver todos los integrantes ({miGrupoAlumno.companeros.length})
                  </button>
                </div>
              )}
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

                <div className="space-y-2">
                  {(!miGrupoAlumno.actividad_reciente || miGrupoAlumno.actividad_reciente.length === 0) ? (
                    <div className="text-center py-8">
                      <p className="text-sm font-medium text-gray-400">Sin actividad reciente de tu grupo.</p>
                    </div>
                  ) : (
                    miGrupoAlumno.actividad_reciente.slice(0, 5).map((act: any) => (
                      <Link 
                        key={act.id} 
                        to={`/dashboard/perfil/${act.alumno_username}`}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-green-50/50 transition-colors group"
                      >
                        <img 
                          src={AVATARS.find(a => a.id === act.alumno_avatar)?.url || AVATARS[0].url} 
                          alt={act.alumno_username} 
                          className="w-10 h-10 rounded-xl border border-gray-200 group-hover:border-green-300 object-cover" 
                        />
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
              
              {miGrupoAlumno.actividad_reciente && miGrupoAlumno.actividad_reciente.length > 5 && (
                <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                  <button 
                    onClick={() => setShowActividadModal(true)}
                    className="w-full py-3 text-sm font-bold text-green-600 hover:text-green-700 bg-white hover:bg-green-50 rounded-xl border border-gray-200 hover:border-green-200 transition-colors flex items-center justify-center gap-2"
                  >
                    Ver toda la actividad
                  </button>
                </div>
              )}
            </div>
            
          </div>

          {/* BOTÓN SALIR DEL GRUPO (Abajo) */}
          <div className="flex justify-center pt-8 border-t border-gray-100/50">
            <div className="flex flex-col items-center gap-3">
              <button
                disabled={loadingJoin}
                onClick={() => setShowExitConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 font-bold py-3 px-6 rounded-2xl transition-all border border-red-100 hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                {loadingJoin ? "Enviando solicitud..." : "Solicitar abandonar el grupo"}
              </button>

              {joinMsg.text && (estado === "ACTIVO") && (
                <div className={`text-sm font-bold flex items-center gap-2 ${joinMsg.type === "success" ? "text-green-600" : "text-red-600"
                  }`}>
                  {joinMsg.text}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : miGrupoAlumno && estado === "PENDIENTE_SALIDA" ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-textMain">
                  Solicitud de salida enviada
                </h2>
                <p className="text-gray-500 mt-1">
                  Tu solicitud de salida está pendiente. Espera a que el tutor la apruebe.
                </p>
              </div>
            </div>

            <div className="text-sm font-bold text-gray-500">
              Estado: Pendiente de aprobación
            </div>
          </div>
        </div>
      ) : miGrupoAlumno && estado === "PENDIENTE_INGRESO" && !showJoinForm ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-8 md:p-12 flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-primary/10 border-4 border-white">
              <Key className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
              ¡Casi listo! Solicitud enviada
            </h2>
            
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              Ya registraste el código <span className="text-primary font-black bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">{codigoInvitacion}</span>. 
              <br className="hidden md:block" />
              Para proteger la privacidad de la comunidad, el acceso al dashboard y rankings se habilitará tan pronto como tu tutor apruebe tu ingreso.
            </p>

            <div className="w-full bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-blue-900 uppercase tracking-wide">Paso Siguiente</p>
                <p className="text-xs font-bold text-blue-700/70">Tu tutor recibirá una notificación para confirmarte en el grupo.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleIngresarOtroCodigo}
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 font-bold rounded-xl transition-all border border-gray-100 text-sm"
              >
                Ingresar otro código
              </button>
              <Link
                to="/dashboard/mi-perfil"
                className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl transition-all hover:bg-black shadow-lg shadow-gray-900/20 text-sm"
              >
                Completar mi Perfil
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary to-green-600 p-6 md:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -top-10 text-white opacity-10">
            <Key className="w-48 h-48 transform rotate-45" />
          </div>

          <div className="relative z-10 w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
              ¿Tienes un código de invitación?
            </h2>
            <p className="text-green-100 text-sm md:text-base opacity-90">
              Ingresa el código que te dio tu tutor para unirte a tu grupo y
              comenzar a sumar juntos.
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto flex-1 max-w-md bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-inner">
            <form onSubmit={handleUnirseGrupo} className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
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

              {joinMsg.text && joinMsg.type !== "loading" && (
                <div
                  className={`mt-2 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${joinMsg.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {joinMsg.type === "success" ? (
                    <CheckCircle className="w-5 h-5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0" />
                  )}
                  {joinMsg.text}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL COMPAÑEROS */}
      {showCompanerosModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between text-blue-600 bg-blue-50/30">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Todos tus Compañeros
              </h3>
              <button onClick={() => setShowCompanerosModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1 space-y-2">
              {miGrupoAlumno?.companeros?.map((comp: any) => (
                <Link 
                  key={comp.id} 
                  to={`/dashboard/perfil/${comp.username}`}
                  onClick={() => setShowCompanerosModal(false)}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <img 
                    src={AVATARS.find(a => a.id === comp.avatar)?.url || AVATARS[0].url} 
                    alt={comp.username} 
                    className="w-12 h-12 rounded-full border border-gray-200 group-hover:border-blue-300 object-cover" 
                  />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                      {comp.nombre} {comp.apellidos}
                    </p>
                    <p className="text-xs font-medium text-gray-500">@{comp.username}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ACTIVIDAD */}
      {showActividadModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between text-green-600 bg-green-50/30">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Historia de la Comunidad
              </h3>
              <button onClick={() => setShowActividadModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1 space-y-2">
              {miGrupoAlumno?.actividad_reciente?.map((act: any) => (
                <Link 
                  key={act.id} 
                  to={`/dashboard/perfil/${act.alumno_username}`}
                  onClick={() => setShowActividadModal(false)}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <img 
                    src={AVATARS.find(a => a.id === act.alumno_avatar)?.url || AVATARS[0].url} 
                    alt={act.alumno_username} 
                    className="w-12 h-12 rounded-xl border border-gray-200 group-hover:border-green-300 object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{act.alumno_nombre}</span>
                      {' '}recicló <span className="font-bold text-gray-900">{act.cantidad}</span> piezas de {act.material_nombre}
                    </p>
                    <p className="text-xs font-medium text-gray-400 mt-0.5">
                      {new Date(act.fecha).toLocaleDateString('es-MX', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR SALIDA */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-300 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 border-4 border-white shadow-lg">
              <LogOut className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              ¿Abandonar grupo?
            </h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">
              El tutor tendrá que aprobar tu solicitud de salida antes de que puedas unirte a otro grupo diferente.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setShowExitConfirm(false);
                  handleSolicitarSalida();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Sí, solicitar
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}


import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Save, AlertCircle, CheckCircle, Settings, UserRound, GraduationCap, Pencil } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../services/userService";
import AvatarGenerator from "../components/layout/AvatarGenerator";
import UserAvatar from "../components/common/UserAvatar";

interface FormState {
  username: string;
  email: string;
  contrasena_actual: string;
  nueva_contrasena: string;
  repetir_contrasena: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TUTOR: "Tutor",
  ALUMNO: "Alumno",
  OPERADOR: "Operador",
};


export default function Perfil() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    contrasena_actual: "",
    nueva_contrasena: "",
    repetir_contrasena: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'default');
  const [isAvatarGeneratorOpen, setIsAvatarGeneratorOpen] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        contrasena_actual: "",
        nueva_contrasena: "",
        repetir_contrasena: "",
      });
      setSelectedAvatar(user.avatar || 'default');
    }
  }, [user]);


  const handleSubmit = async () => {
    setSaving(true);
    setErrors({});
    setMsg({ text: "", type: "" });

    const payload: any = {};

    if (form.username !== user?.username) payload.username = form.username;
    if (form.email !== user?.email) payload.email = form.email;
    if (selectedAvatar !== user?.avatar) payload.avatar = selectedAvatar;

    if (form.nueva_contrasena) {
      payload.contrasena_actual = form.contrasena_actual;
      payload.nueva_contrasena = form.nueva_contrasena;
      payload.repetir_contrasena = form.repetir_contrasena;
    }



    if (Object.keys(payload).length === 0) {
      setMsg({ text: "No hay cambios para guardar.", type: "error" });
      setSaving(false);
      return;
    }

    try {
      await updateMe(payload);
      await refreshUser();
      setMsg({ text: "¡Cambios guardados correctamente!", type: "success" });
      setForm(f => ({ ...f, contrasena_actual: "", nueva_contrasena: "", repetir_contrasena: "" }));

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        const mapped: Record<string, string> = {};
        for (const [key, val] of Object.entries(data)) {
          mapped[key] = Array.isArray(val) ? (val as string[])[0] : String(val);
        }
        setErrors(mapped);
        setMsg({ text: "Corrige los errores indicados.", type: "error" });
      } else {
        setMsg({ text: "Error al guardar los cambios.", type: "error" });
      }
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-textMain flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configuración de Perfil
          </h2>
          <p className="text-gray-500 mt-1">Gestiona tu información personal y seguridad de la cuenta.</p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/20 flex-shrink-0">
            <UserAvatar avatar={selectedAvatar} />
          </div>
          <div>
            <p className="text-sm font-bold text-textMain leading-tight">{user?.username}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {ROLE_LABELS[user?.role || ""] || user?.role}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna Izquierda: Datos Personales */}
        <div className="lg:col-span-1 space-y-8 h-fit">
          {/* Datos personales (solo lectura) */}
          {user?.role !== 'ADMIN' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative mb-8">
              <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
                <UserRound className="w-5 h-5 text-primary" />
                Información Personal
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nombre Completo</p>
                  <p className="text-sm font-bold text-textMain first-letter:uppercase">
                    {user?.first_name} {user?.primer_apellido} {user?.segundo_apellido}
                  </p>
                </div>

                {user?.role === 'ALUMNO' && user?.matricula && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-3 h-3 text-primary" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matrícula</p>
                    </div>
                    <p className="text-sm font-bold text-textMain uppercase">{user?.matricula}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 px-2 py-1">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <p className="text-[11px] font-medium text-gray-500 italic">
                    Solo un administrador puede modificar esta información.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sección de Foto de Perfil (Para todos los roles) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative">
            <h3 className="text-lg font-bold text-textMain mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-secondary" />
              Foto de Perfil
            </h3>
            <p className="text-xs text-gray-400 mb-6">Personaliza tu avatar para identificarte en el sistema.</p>

            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex-shrink-0">
                  <UserAvatar avatar={selectedAvatar} />
                </div>
                <button
                  onClick={() => setIsAvatarGeneratorOpen(true)}
                  className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform border-4 border-white"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Avatar Actual</p>
            </div>
          </div>
        </div>


        {/* Columna Derecha: Configuración y Seguridad */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
            <div className="flex flex-col md:flex-row gap-12">

              {/* Sección: Datos de Cuenta */}
              <div className="flex-1 space-y-6">
                <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                  <Mail className="w-5 h-5 text-secondary" />
                  Datos de Acceso
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre de Usuario</label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-background/30 ${errors.username ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                    />
                    {errors.username && <p className="text-xs text-red-500 font-medium">{errors.username}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-background/30 ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Divisor Vertical en Desktop */}
              <div className="hidden md:block w-px bg-gray-100 py-4" />

              {/* Sección: Seguridad */}
              <div className="flex-1 space-y-6">
                <h3 className="text-lg font-bold text-textMain flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent" />
                  Seguridad
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Contraseña Actual</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={form.contrasena_actual}
                        onChange={e => setForm({ ...form, contrasena_actual: e.target.value })}
                        placeholder="••••••••"
                        className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-background/30 ${errors.contrasena_actual ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.contrasena_actual && <p className="text-xs text-red-500 font-medium">{errors.contrasena_actual}</p>}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nueva Contraseña</label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          value={form.nueva_contrasena}
                          onChange={e => setForm({ ...form, nueva_contrasena: e.target.value })}
                          placeholder="Mín. 6 caracteres"
                          className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-background/30 ${errors.nueva_contrasena ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.nueva_contrasena && <p className="text-xs text-red-500 font-medium">{errors.nueva_contrasena}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Repetir Nueva Contraseña</label>
                      <div className="relative">
                        <input
                          type={showRepeat ? "text" : "password"}
                          value={form.repetir_contrasena}
                          onChange={e => setForm({ ...form, repetir_contrasena: e.target.value })}
                          placeholder="Confirma tu nueva contraseña"
                          className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-background/30 ${errors.repetir_contrasena ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                        />
                        <button type="button" onClick={() => setShowRepeat(!showRepeat)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.repetir_contrasena && <p className="text-xs text-red-500 font-medium">{errors.repetir_contrasena}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones del Formulario */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
              <div className="flex-1">
                {msg.text && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-bold animate-in zoom-in duration-300 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {msg.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    {msg.text}
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-primary hover:bg-green-600 text-white font-black text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Actualizar Información
                  </>
                )}
              </button>
            </div>
          </div>


        </div>
      </div>
      {isAvatarGeneratorOpen && (
        <AvatarGenerator
          initialAvatar={selectedAvatar}
          onClose={() => setIsAvatarGeneratorOpen(false)}
          onSave={async (url) => {
            setIsAvatarGeneratorOpen(false);
            setSelectedAvatar(url);
            try {
              setSaving(true);
              await updateMe({ avatar: url });
              await refreshUser();
              setMsg({ text: "¡Avatar actualizado correctamente!", type: "success" });
              setTimeout(() => setMsg({ text: "", type: "" }), 3000);
            } catch (err) {
              setMsg({ text: "Error al guardar el avatar.", type: "error" });
            } finally {
              setSaving(false);
            }
          }}
        />
      )}
    </div>
  );
}

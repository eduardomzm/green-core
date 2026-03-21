import { useState, useEffect } from "react";
import { X, User, Mail, Lock, Eye, EyeOff, Save, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { updateMe } from "../../services/userService";

interface Props {
  open: boolean;
  onClose: () => void;
}

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

export default function AccountSettings({ open, onClose }: Props) {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    contrasena_actual: "",
    nueva_contrasena: "",
    repetir_contrasena: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && open) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        contrasena_actual: "",
        nueva_contrasena: "",
        repetir_contrasena: "",
      });
      setMsg({ text: "", type: "" });
      setErrors({});
    }
  }, [user, open]);

  const handleSubmit = async () => {
    setSaving(true);
    setErrors({});
    setMsg({ text: "", type: "" });

    const payload: any = {};

    if (form.username !== user?.username) payload.username = form.username;
    if (form.email !== user?.email) payload.email = form.email;

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

  if (!open) return null;

  const ReadOnlyField = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="space-y-1.5 group relative">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          disabled
          value={value || "—"}
          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed"
          readOnly
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Info className="w-4 h-4 text-gray-300" />
        </div>
      </div>
      <div className="hidden group-hover:block absolute z-10 left-0 top-full mt-1.5 bg-gray-800 text-white text-xs rounded-xl px-3 py-2 shadow-lg max-w-xs w-max pointer-events-none">
        Si necesitas cambiar este dato contacta a tu administrador
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg font-black text-gray-700 uppercase">
              {user?.username?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-textMain">Mi Cuenta</h2>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {ROLE_LABELS[user?.role || ""] || user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Datos personales (solo lectura) */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Datos Personales
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ReadOnlyField label="Nombre" value={user?.first_name} />
                <ReadOnlyField label="Primer Apellido" value={user?.primer_apellido} />
              </div>
              <ReadOnlyField label="Segundo Apellido" value={user?.segundo_apellido} />
              {user?.role === "ALUMNO" && (
                <ReadOnlyField label="Matrícula" value={user?.matricula} />
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Datos de cuenta (editables) */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              Datos de Cuenta
            </h3>
            <div className="space-y-4">

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre de Usuario</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.username ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.username && <p className="text-xs text-red-500 font-medium">{errors.username}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                />
                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
              </div>

            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Cambio de contraseña */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Cambiar Contraseña
            </h3>
            <p className="text-xs text-gray-400 mb-4">Deja en blanco si no deseas cambiar tu contraseña.</p>
            <div className="space-y-4">

              {/* Contraseña actual */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Contraseña Actual</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={form.contrasena_actual}
                    onChange={e => setForm({ ...form, contrasena_actual: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.contrasena_actual ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.contrasena_actual && <p className="text-xs text-red-500 font-medium">{errors.contrasena_actual}</p>}
              </div>

              {/* Nueva contraseña */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={form.nueva_contrasena}
                    onChange={e => setForm({ ...form, nueva_contrasena: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.nueva_contrasena ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.nueva_contrasena && <p className="text-xs text-red-500 font-medium">{errors.nueva_contrasena}</p>}
              </div>

              {/* Repetir contraseña */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Repetir Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showRepeat ? "text" : "password"}
                    value={form.repetir_contrasena}
                    onChange={e => setForm({ ...form, repetir_contrasena: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${errors.repetir_contrasena ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                  />
                  <button type="button" onClick={() => setShowRepeat(!showRepeat)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.repetir_contrasena && <p className="text-xs text-red-500 font-medium">{errors.repetir_contrasena}</p>}
              </div>

            </div>
          </div>

          {/* Message */}
          {msg.text && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {msg.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {msg.text}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-green-600 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { User as UserIcon, Save, AlertCircle, CheckCircle, Pencil, Share2, Instagram, Twitter, Facebook, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../services/userService";

interface FormState {
  biografia: string;
  instagram: string;
  twitter: string;
  facebook: string;
}

const AVATARS = [
  { id: 'default', url: '/src/assets/img/logo.jpeg', label: 'Bote' },
  { id: 'leaf', url: '/avatars/avatar_leaf.png', label: 'Hoja' },
  { id: 'earth', url: '/avatars/avatar_earth.png', label: 'Tierra' },
  { id: 'sprout', url: '/avatars/avatar_sprout.png', label: 'Brote' },
  { id: 'water', url: '/avatars/avatar_water.png', label: 'Gota' },
];

export default function MiPerfil() {
  const { user, refreshUser } = useAuth();
  
  const [form, setForm] = useState<FormState>({
    biografia: "",
    instagram: "",
    twitter: "",
    facebook: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'default');
  const [tempAvatar, setTempAvatar] = useState(user?.avatar || 'default');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        biografia: user.biografia || "",
        instagram: user.instagram || "",
        twitter: user.twitter || "",
        facebook: user.facebook || "",
      });
      setSelectedAvatar(user.avatar || 'default');
      setTempAvatar(user.avatar || 'default');
    }
  }, [user]);

  const handleSubmit = async () => {
    setSaving(true);
    setMsg({ text: "", type: "" });

    const payload: any = {};
    if (selectedAvatar !== user?.avatar) payload.avatar = selectedAvatar;
    if (form.biografia !== user?.biografia) payload.biografia = form.biografia;
    if (form.instagram !== user?.instagram) payload.instagram = form.instagram;
    if (form.twitter !== user?.twitter) payload.twitter = form.twitter;
    if (form.facebook !== user?.facebook) payload.facebook = form.facebook;

    if (Object.keys(payload).length === 0) {
      setMsg({ text: "No hay cambios para guardar.", type: "error" });
      setSaving(false);
      return;
    }

    try {
      await updateMe(payload);
      await refreshUser();
      setMsg({ text: "¡Tu perfil ha sido actualizado correctamente!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 4000);
    } catch (err: any) {
      setMsg({ text: "Error al guardar los cambios.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenModal = () => {
    setTempAvatar(selectedAvatar);
    setIsModalOpen(true);
  };

  const handleSaveAvatar = () => {
    setSelectedAvatar(tempAvatar);
    setIsModalOpen(false);
  };

  const avatarUrl = AVATARS.find(a => a.id === selectedAvatar)?.url || AVATARS[0].url;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 pb-20">

      {/* Hero Header with Avatar */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col items-center">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>

        <h2 className="text-2xl font-black text-textMain relative z-10 mb-8 w-full text-center">
          Configuración Principal
        </h2>

        {/* Avatar Interactive Element */}
        <div className="relative group cursor-pointer z-10" onClick={handleOpenModal}>
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex-shrink-0 relative">
            <img 
              src={avatarUrl} 
              alt="Avatar seleccionado" 
              className="w-full h-full object-cover group-hover:blur-[2px] transition-all duration-300 transform group-hover:scale-105" 
            />
            {/* Overlay and Pencil Icon on Hover */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white p-3 rounded-full shadow-lg transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Pencil className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center relative z-10">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.first_name} {user?.primer_apellido}
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            @{user?.username}
          </p>
        </div>
      </div>

      {/* Public Profile Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative z-10">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Share2 className="w-5 h-5" />
          </div>
          Información Social
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Sobre Ti</label>
            <textarea
              value={form.biografia}
              onChange={e => setForm({ ...form, biografia: e.target.value })}
              placeholder="Cuéntanos quién eres, qué te apasiona..."
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm outline-none transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary bg-gray-50 hover:bg-white resize-none min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </label>
              <input
                type="text"
                value={form.instagram}
                onChange={e => setForm({ ...form, instagram: e.target.value })}
                placeholder="@usuario"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm outline-none transition-all focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 bg-gray-50 hover:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Twitter className="w-4 h-4 text-sky-500" />
                Twitter
              </label>
              <input
                type="text"
                value={form.twitter}
                onChange={e => setForm({ ...form, twitter: e.target.value })}
                placeholder="@usuario"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm outline-none transition-all focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 bg-gray-50 hover:bg-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Facebook className="w-4 h-4 text-indigo-600" />
                Facebook URL
              </label>
              <input
                type="url"
                value={form.facebook}
                onChange={e => setForm({ ...form, facebook: e.target.value })}
                placeholder="https://facebook.com/usuario"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:flex-1">
          {msg.text && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold shadow-sm animate-in zoom-in duration-300 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {msg.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              {msg.text}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full md:w-auto px-10 py-4 rounded-2xl bg-primary hover:bg-green-600 text-white font-black text-sm md:text-base transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
              Guardando Cambios...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Mi Perfil
            </>
          )}
        </button>
      </div>

      {/* MODAL DE SELECCIÓN DE AVATARES */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-800 bg-gray-100/50 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                  <UserIcon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Elige tu Avatar</h3>
                <p className="text-gray-500 mt-2 text-sm font-medium">Selecciona el icono que mejor represente tu ciclo con el planeta.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setTempAvatar(avatar.id)}
                    className={`relative aspect-square rounded-[1.5rem] overflow-hidden border-4 transition-all duration-300 group ${tempAvatar === avatar.id
                      ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'border-transparent hover:border-gray-200 bg-gray-50'
                      }`}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.label}
                      className={`w-full h-full object-cover transition-transform duration-500 ${tempAvatar === avatar.id ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                    />
                    {tempAvatar === avatar.id && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary text-white p-1.5 rounded-full shadow-lg">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-2 text-[10px] font-black text-white uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {avatar.label}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveAvatar}
                  className="px-8 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black shadow-md shadow-gray-900/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirmar Selección
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

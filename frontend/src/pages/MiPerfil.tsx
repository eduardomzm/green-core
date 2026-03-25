import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Save, AlertCircle, CheckCircle, Pencil, Share2, Instagram, Twitter, Facebook, X, Users, Award, Trophy, PartyPopper, Flame } from "lucide-react";
import { triggerConfettiBurst, triggerConfettiFirecrackers } from "../utils/confetti";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { updateMe, getMisSeguidores, getMisSiguiendo, toggleSeguir } from "../services/userService";
import { getMisMedallas, type MedallaObtenida } from "../services/reciclajeService";
import AvatarGenerator from "../components/layout/AvatarGenerator";


interface FormState {
  biografia: string;
  instagram: string;
  twitter: string;
  facebook: string;
}

// Helper to dynamically render a Lucide icon by name
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <Award className={className} />;
  return <IconComponent className={className} />;
};

const AVATARS = [
  { id: 'default', url: '/avatars/avatar_bin.png', label: 'Bote' },
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

  const [isAvatarGeneratorOpen, setIsAvatarGeneratorOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'default');
  const [tempAvatar, setTempAvatar] = useState(user?.avatar || 'default');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para Seguidores / Seguiendo
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);

  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });
  const [saving, setSaving] = useState(false);

  const [misMedallas, setMisMedallas] = useState<MedallaObtenida[]>([]);

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
      
      if (user.role === 'ALUMNO') {
        getMisMedallas().then(data => setMisMedallas(data)).catch(console.error);
      }
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



  const handleSaveAvatar = async () => {
    setSelectedAvatar(tempAvatar);
    setIsModalOpen(false);
    
    // Save immediately to backend for better UX
    try {
      setSaving(true);
      await updateMe({ avatar: tempAvatar });
      await refreshUser();
      setMsg({ text: "¡Avatar actualizado correctamente!", type: "success" });
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (err) {
      setMsg({ text: "Error al guardar el avatar.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const loadFollowers = async () => {
    try {
      const data = await getMisSeguidores();
      setFollowersList(data);
      setShowFollowers(true);
    } catch (error) {
      console.error(error);
    }
  };

  const loadFollowing = async () => {
    try {
      const data = await getMisSiguiendo();
      setFollowingList(data);
      setShowFollowing(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async (username: string) => {
    try {
      await toggleSeguir(username);
      setFollowingList(prev => prev.filter(u => u.username !== username));
      await refreshUser(); // Update siguiendo_count
    } catch (error) {
      console.error(error);
    }
  };

const avatarUrl = selectedAvatar?.startsWith("http")
  ? selectedAvatar
  : AVATARS.find(a => a.id === selectedAvatar)?.url || AVATARS[0].url;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 pb-20"
    >

      {/* Hero Header with Avatar */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col items-center">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>

        <h2 className="text-2xl font-black text-textMain relative z-10 mb-8 w-full text-center">
          Configuración Principal
        </h2>

        {/* Avatar Interactive Element */}
        <div className="relative group cursor-pointer z-10" onClick={() => setIsAvatarGeneratorOpen(true)}>
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
          
          {/* Badge de Nivel */}
          {user?.role === 'ALUMNO' && (
            <motion.div 
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -6 }}
              whileHover={{ scale: 1.1, rotate: 0 }}
              className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-lg z-20 shadow-xl"
              style={{ backgroundColor: user.nivel_color || '#2D6A4F' }}
            >
              L{user.nivel || 1}
            </motion.div>
          )}
        </div>

        <div className="mt-5 text-center relative z-10">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.first_name} {user?.primer_apellido}
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            @{user?.username}
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6">
            <div 
              className="flex flex-col items-center cursor-pointer group"
              onClick={loadFollowers}
            >
              <span className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">
                {user?.seguidores_count || 0}
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Seguidores</span>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div 
              className="flex flex-col items-center cursor-pointer group"
              onClick={loadFollowing}
            >
              <span className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">
                {user?.siguiendo_count || 0}
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Seguidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-green-300 transition-colors overflow-hidden relative">
          <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-4xl font-black text-green-600 mb-2 drop-shadow-sm relative z-10 group-hover:scale-110 transition-transform">
            {user?.total_piezas || 0}
          </span>
          <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest relative z-10">Piezas Recicladas</span>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-blue-300 transition-colors overflow-hidden relative">
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-4xl font-black text-blue-600 mb-2 drop-shadow-sm relative z-10 group-hover:scale-110 transition-transform">
            {user?.total_depositos || 0}
          </span>
          <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest relative z-10">Depósitos Realizados</span>
        </div>

        {/* Rachas */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-orange-300 transition-colors overflow-hidden relative">
          <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-2 mb-2">
            <Flame className="w-8 h-8 text-orange-500 fill-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-4xl font-black text-orange-600 drop-shadow-sm">
              {user?.racha_actual || 0}
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest relative z-10">Racha Actual (Semanas)</span>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-yellow-300 transition-colors overflow-hidden relative">
          <div className="absolute inset-0 bg-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-4xl font-black text-yellow-600 mb-2 drop-shadow-sm relative z-10 group-hover:scale-110 transition-transform">
            {user?.max_racha || 0}
          </span>
          <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest relative z-10">Mejor Racha</span>
        </div>
      </div>

      {/* Barra de Progreso de Nivel (Solo Alumnos) */}
      {user?.role === 'ALUMNO' && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative z-10 overflow-hidden">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Rango Actual</span>
              <h4 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Trophy className="w-6 h-6" style={{ color: user.nivel_color }} />
                {user.nivel_nombre || 'Navegante'}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-gray-900">{user.porcentaje_nivel || 0}%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Progreso</span>
            </div>
          </div>
          
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${user.porcentaje_nivel || 0}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              style={{ 
                backgroundColor: user.nivel_color || '#2D6A4F'
              }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">Piezas: {user.total_piezas_historico || 0}</span>
            {(user.porcentaje_nivel || 0) < 100 && user.piezas_proximo_nivel ? (
              <span className="text-primary">Faltan {(user.piezas_proximo_nivel || 0) - (user.total_piezas_historico || 0)} para el siguiente nivel</span>
            ) : (
              <button 
                onClick={() => triggerConfettiFirecrackers()}
                className="text-primary hover:scale-110 transition-transform flex items-center gap-1"
              >
                <PartyPopper className="w-3 h-3" />
                ¡Nivel Máximo Alcanzado!
              </button>
            )}
          </div>
        </div>
      )}

      {/* Seccion Medallas / Vitrina de Trofeos */}
      {user?.role === 'ALUMNO' && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative z-10 overflow-hidden">
          {/* Decorative background for the section */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-yellow-400/10 text-yellow-600 rounded-2xl rotate-3">
              <Award className="w-5 h-5" />
            </div>
            Vitrina de Trofeos
          </h3>

          {!misMedallas || misMedallas.length === 0 ? (
            <div className="text-center py-12 px-6 bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed relative z-10">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Award className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="text-lg font-bold text-gray-500 mb-1">Aún no hay medallas</h4>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                Participa en las dinámicas de reciclaje para ganar medallas mensuales y destacar en la comunidad.
              </p>
            </div>
          ) : (
            <motion.div 
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 relative z-10"
            >
              {misMedallas.map((m: MedallaObtenida) => {
                let bgGradient = "from-yellow-50/30 to-white";
                let iconGradient = "from-yellow-400 to-orange-500";
                let shadowColor = "shadow-orange-500/20";
                let borderColor = "border-yellow-100/50";
                let hoverBorder = "hover:border-yellow-300";
                let hoverShadow = "hover:shadow-yellow-500/10";
                let placeLabel = "Medalla Especial";

                if (m.medalla.posicion === 1) {
                   bgGradient = "from-amber-50/50 to-white";
                   iconGradient = "from-amber-400 to-yellow-500";
                   shadowColor = "shadow-amber-500/20";
                   borderColor = "border-amber-200/50";
                   hoverBorder = "hover:border-amber-400";
                   hoverShadow = "hover:shadow-amber-500/20";
                   placeLabel = "1er Lugar";
                } else if (m.medalla.posicion === 2) {
                   bgGradient = "from-slate-50/50 to-white";
                   iconGradient = "from-slate-300 to-gray-400";
                   shadowColor = "shadow-slate-500/20";
                   borderColor = "border-slate-200/50";
                   hoverBorder = "hover:border-slate-400";
                   hoverShadow = "hover:shadow-slate-500/20";
                   placeLabel = "2do Lugar";
                } else if (m.medalla.posicion === 3) {
                   bgGradient = "from-orange-50/50 to-white";
                   iconGradient = "from-orange-700 to-amber-700";
                   shadowColor = "shadow-orange-800/20";
                   borderColor = "border-orange-200/50";
                   hoverBorder = "hover:border-orange-800";
                   hoverShadow = "hover:shadow-orange-800/20";
                   placeLabel = "3er Lugar";
                }

                return (
                <motion.div 
                  key={m.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    show: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: -1,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => triggerConfettiBurst()}
                  className={`group relative flex flex-col items-center p-6 bg-gradient-to-b ${bgGradient} rounded-[2rem] border ${borderColor} ${hoverBorder} hover:shadow-xl ${hoverShadow} transition-all duration-300 cursor-pointer`}
                  title={`${placeLabel} - ${m.categoria || 'Dinámica'} (${m.mes_obtenida})`}
                >
                  {/* Tooltip visible en hover nativamente por title o con un pequeño div */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-50 pointer-events-none">
                     {placeLabel} | {m.categoria || 'Logro'}
                  </div>

                  <div className={`w-16 h-16 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center text-white shadow-lg ${shadowColor} mb-4 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    <DynamicIcon name={m.medalla.icono_lucide} className="w-8 h-8 drop-shadow-md" />
                  </div>
                  <p className="font-extrabold text-sm text-gray-900 text-center leading-tight mb-1">{m.medalla.nombre}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">{m.mes_obtenida}</p>
                </motion.div>
              )})}
            </motion.div>
          )}
        </div>
      )}

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
              <div className="relative flex items-center">
                <span className="absolute left-5 text-gray-400 font-bold text-sm pointer-events-none">@</span>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={e => setForm({ ...form, instagram: e.target.value.replace(/@/g, '') })}
                  placeholder="usuario"
                  className="w-full pl-10 pr-5 py-3.5 rounded-2xl border border-gray-200 text-sm outline-none transition-all focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Twitter className="w-4 h-4 text-sky-500" />
                Twitter
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-gray-400 font-bold text-sm pointer-events-none">@</span>
                <input
                  type="text"
                  value={form.twitter}
                  onChange={e => setForm({ ...form, twitter: e.target.value.replace(/@/g, '') })}
                  placeholder="usuario"
                  className="w-full pl-10 pr-5 py-3.5 rounded-2xl border border-gray-200 text-sm outline-none transition-all focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 bg-gray-50 hover:bg-white"
                />
              </div>
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

      {/* MODAL DE SEGUIDORES */}
      {showFollowers && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Seguidores
              </h3>
              <button onClick={() => setShowFollowers(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {followersList.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-medium">Aún no tienes seguidores.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {followersList.map((u) => (
                    <div key={u.username} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <Link to={`/dashboard/perfil/${u.username}`} className="flex items-center gap-3 group flex-1" onClick={() => setShowFollowers(false)}>
                        <img src={AVATARS.find(a => a.id === u.avatar)?.url || AVATARS[0].url} alt="avatar" className="w-12 h-12 rounded-full border border-gray-200 group-hover:border-primary transition-colors object-cover" />
                        <div>
                          <p className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors leading-tight">
                            {u.first_name || u.username} {u.primer_apellido || ""}
                          </p>
                          <p className="text-xs text-gray-500">@{u.username}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SIGUIENDO */}
      {showFollowing && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Siguiendo
              </h3>
              <button onClick={() => setShowFollowing(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {followingList.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-medium">No sigues a nadie aún.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {followingList.map((u) => (
                    <div key={u.username} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <Link to={`/dashboard/perfil/${u.username}`} className="flex items-center gap-3 group flex-1" onClick={() => setShowFollowing(false)}>
                        <img src={AVATARS.find(a => a.id === u.avatar)?.url || AVATARS[0].url} alt="avatar" className="w-12 h-12 rounded-full border border-gray-200 group-hover:border-primary transition-colors object-cover" />
                        <div>
                          <p className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors leading-tight">
                            {u.first_name || u.username} {u.primer_apellido || ""}
                          </p>
                          <p className="text-xs text-gray-500">@{u.username}</p>
                        </div>
                      </Link>
                      <button 
                        onClick={() => handleUnfollow(u.username)}
                        className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold text-xs rounded-xl transition-colors border border-transparent hover:border-red-100"
                      >
                        Dejar de seguir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAvatarGeneratorOpen && (
  <AvatarGenerator
    onClose={() => setIsAvatarGeneratorOpen(false)}
    onSave={async (url) => {
      setIsAvatarGeneratorOpen(false);

      try {
        setSaving(true);

        await updateMe({ avatar: url });

        await refreshUser();

        setSelectedAvatar(url);

        setMsg({
          text: "¡Avatar actualizado correctamente!",
          type: "success"
        });

      } catch (err) {
        setMsg({
          text: "Error al guardar el avatar",
          type: "error"
        });
      } finally {
        setSaving(false);
      }
    }}
  />
)}


    </motion.div>
  );
}

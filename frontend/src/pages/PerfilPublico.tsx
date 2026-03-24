import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { getPublicProfile, toggleSeguir } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import { User as UserIcon, Award, Instagram, Twitter, Facebook, ChevronLeft, ShieldCheck } from "lucide-react";
import * as LucideIcons from "lucide-react";
import UserAvatar from "../components/common/UserAvatar";

// Helper to dynamically render a Lucide icon by name
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <Award className={className} />;
  return <IconComponent className={className} />;
};


export default function PerfilPublico() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null); // Use any to bypass strict User type for new fields
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!username) return;
        setLoading(true);
        const data = await getPublicProfile(username);
        setProfile(data);
      } catch (err) {
        setError("Usuario no encontrado o perfil privado.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleToggleSeguir = async () => {
    if (!profile || !username) return;
    try {
      const res = await toggleSeguir(username);
      setProfile((prev: any) => {
        if (!prev) return prev;
        const isFollowingNow = res.status === 'followed';
        return {
          ...prev,
          lo_sigo: isFollowingNow,
          seguidores_count: prev.seguidores_count + (isFollowingNow ? 1 : -1)
        };
      });
    } catch (e) {
      console.error("Error al seguir/dejar de seguir", e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2 shadow-sm">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Perfil no encontrado</h2>
        <p className="text-gray-500">{error}</p>
        <Link to="/" className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"> Volver al inicio </Link>
      </div>
    );
  }

  const isAlumno = profile.role === 'ALUMNO';
  const roleKey = profile.role as 'ADMIN' | 'TUTOR' | 'ALUMNO' | 'OPERADOR';
  const roleLabel = { ADMIN: "Administrador", TUTOR: "Tutor", ALUMNO: "Estudiante", OPERADOR: "Operador" }[roleKey] || profile.role;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6 pb-20"
    >

      {/* Header Info */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl mix-blend-multiply"></div>

        <Link to={-1 as any} className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors mb-6 group relative z-10">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-gray-50 flex-shrink-0">
              <UserAvatar avatar={profile.avatar} />
            </div>
            {isAlumno && profile.nivel && (
              <motion.div 
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: -6 }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className="absolute -bottom-3 -right-3 bg-gradient-to-br from-primary to-green-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg border-4 border-white z-10"
              >
                L{profile.nivel}
              </motion.div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {profile.first_name} {profile.primer_apellido}
                </h1>
                {profile.role === 'ADMIN' && <ShieldCheck className="w-6 h-6 text-blue-500" />}
              </div>
              <p className="text-lg font-medium text-gray-500">@{profile.username}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold tracking-wider uppercase">
                {roleLabel}
              </span>

              {isAlumno && (
                <>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold tracking-wider">
                    {profile.seguidores_count || 0} Seguidores
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold tracking-wider">
                    {profile.siguiendo_count || 0} Seguidos
                  </span>
                </>
              )}
            </div>

            {isAlumno && currentUser?.username !== profile.username && currentUser?.role === 'ALUMNO' && (
              <div className="flex justify-center md:justify-start pt-2">
                <button
                  onClick={handleToggleSeguir}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${profile.lo_sigo
                    ? 'bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600'
                    : 'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 hover:shadow-primary/40'
                    }`}
                >
                  {profile.lo_sigo ? 'Dejar de seguir' : 'Seguir'}
                </button>
              </div>
            )}

            {isAlumno && profile.biografia && (
              <p className="text-gray-600 text-sm leading-relaxed max-w-2xl bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                "{profile.biografia}"
              </p>
            )}

            {/* Social Links */}
            {isAlumno && (profile.instagram || profile.twitter || profile.facebook) && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {profile.instagram && (
                  <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl text-sm font-bold transition-colors">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                )}
                {profile.twitter && (
                  <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-xl text-sm font-bold transition-colors">
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                )}
                {profile.facebook && (
                  <a href={profile.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-sm font-bold transition-colors">
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gamification Section (Only for Alumnos) */}
      {isAlumno && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-500" />
              Vitrina de Medallas
            </h3>

            {(!profile.medallas || profile.medallas.length === 0) ? (
              <div className="text-center py-12 px-4 bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Award className="w-8 h-8 text-gray-300" />
                </div>
                <h4 className="text-lg font-bold text-gray-500 mb-1">Aún no hay medallas</h4>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">Este usuario no cuenta con medallas.</p>
              </div>
            ) : (
              <motion.div 
                variants={{
                  show: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {profile.medallas.map((m: any) => (
                  <motion.div 
                    key={m.id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      show: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      transition: { duration: 0.2 }
                    }}
                    className="group flex flex-col items-center p-6 bg-gradient-to-b from-yellow-50/50 to-white rounded-[2rem] border border-yellow-100 hover:border-yellow-300 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 cursor-default relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mb-4 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                      <DynamicIcon name={m.medalla.icono_lucide} className="w-8 h-8 drop-shadow-md" />
                    </div>
                    <p className="font-extrabold text-sm text-gray-900 text-center leading-tight mb-1">{m.medalla.nombre}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-orange-500/80">{m.mes_obtenida}</p>

                    {/* Tooltip */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute pointer-events-none z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl transition-opacity"
                    >
                      {m.medalla.descripcion}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Stats Section (Alumnos) */}
      {isAlumno && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-green-300 transition-colors overflow-hidden relative">
            <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-4xl font-black text-green-600 mb-2 drop-shadow-sm relative z-10 group-hover:scale-110 transition-transform">
              {profile.total_piezas || 0}
            </span>
            <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest relative z-10">Piezas Recicladas</span>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-blue-300 transition-colors overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-4xl font-black text-blue-600 mb-2 drop-shadow-sm relative z-10 group-hover:scale-110 transition-transform">
              {profile.total_depositos || 0}
            </span>
            <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest relative z-10">Depósitos Realizados</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

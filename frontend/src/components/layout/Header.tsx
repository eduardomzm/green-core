import { useState, useEffect, useRef } from "react";
import { LogOut, Bell, Menu, Info, AlertTriangle, CheckCircle, Settings, Award, Search, X, User as UserIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getNotificaciones, marcarComoLeida, marcarTodasComoLeidas } from "../../services/notificationService";
import type { Notificacion } from "../../services/notificationService";
import { Link, useNavigate } from "react-router-dom";
import { buscarAlumnos } from "../../services/userService";
import UserAvatar from "../common/UserAvatar";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notificaciones.filter(n => !n.leida).length;

  const fetchNotificaciones = async () => {
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
    } catch (e) {
      console.error("Error fetching notifications", e);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  // Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await buscarAlumnos(searchQuery);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarcarLeida = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await marcarComoLeida(id);
      setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    } catch (e) {
      console.error("Error marking as read", e);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await marcarTodasComoLeidas();
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      setShowDropdown(false);
    } catch (e) {
      console.error("Error marking all as read", e);
    }
  };

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'SYSTEM': return <Settings className="w-5 h-5 text-gray-500" />;
      case 'ACHIEVEMENT': return <Award className="w-5 h-5 text-orange-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleResultClick = (username: string) => {
    navigate(`/dashboard/perfil/${username}`);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 relative z-50">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-50"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
        <h2 className="hidden sm:block text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">
          Panel de Control
        </h2>
      </div>

      {/* Search Bar - Center/Left Desktop */}
      {user?.role !== "OPERADOR" && (
        <div className="flex-1 max-w-md mx-4 hidden md:block relative px-4" ref={searchRef}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 transition-colors ${searchQuery ? 'text-primary' : 'text-gray-400 group-focus-within:text-primary'}`} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Buscar alumnos por nombre o usuario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center gap-3 text-gray-500 text-sm italic">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Buscando...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Alumnos encontrados</span>
                  </div>
                  {searchResults.map((al) => (
                    <button
                      key={al.username}
                      onClick={() => handleResultClick(al.username)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white group-hover:scale-110 transition-transform">
                        <UserAvatar avatar={al.avatar} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {al.first_name} {al.primer_apellido}
                        </p>
                        <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                          @{al.username} 
                          {al.carrera && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
                              <span className="text-primary/70 font-medium">{al.carrera}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserIcon className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No se encontraron alumnos</p>
                  <p className="text-xs text-gray-400 mt-1">Intenta con otro nombre o usuario</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        
        {/* Notification Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative p-2 transition-colors rounded-full ${showDropdown ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
          >
            <Bell className="w-5 h-5" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarcarTodasLeidas} className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    Marcar todas leídas
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notificaciones.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No tienes notificaciones
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notificaciones.map(n => {
                      const Content = (
                        <div 
                          onClick={(e) => !n.leida && handleMarcarLeida(e, n.id)}
                          className={`p-4 transition-colors hover:bg-gray-50 flex items-start gap-3 relative group cursor-pointer ${!n.leida ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className={`mt-0.5 flex-shrink-0 ${!n.leida ? 'animate-bounce-slow' : ''}`}>
                            {getIconForType(n.tipo)}
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <p className={`text-sm ${!n.leida ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                              {n.titulo}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {n.mensaje}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-2 font-medium">
                              {new Date(n.fecha_creacion).toLocaleDateString()} {new Date(n.fecha_creacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!n.leida && (
                            <div className="absolute top-6 right-5 w-1.5 h-1.5 bg-primary rounded-full group-hover:hidden"></div>
                          )}
                        </div>
                      );

                      if (n.enlace) {
                        return (
                          <Link to={n.enlace} key={n.id} onClick={() => setShowDropdown(false)}>
                            {Content}
                          </Link>
                        );
                      }

                      return <div key={n.id}>{Content}</div>;
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-200"></div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:stroke-red-600" strokeWidth={2} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}

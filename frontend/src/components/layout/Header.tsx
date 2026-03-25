import { useState, useEffect, useRef } from "react";
import { LogOut, Bell, Menu, Info, AlertTriangle, CheckCircle, Settings, Award } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getNotificaciones, marcarComoLeida, marcarTodasComoLeidas } from "../../services/notificationService";
import type { Notificacion } from "../../services/notificationService";
import { Link } from "react-router-dom";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout } = useAuth();
  
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    // Optional: Add polling
    const interval = setInterval(fetchNotificaciones, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
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

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8">
      
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
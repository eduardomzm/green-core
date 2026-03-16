import { LogOut, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      
      <div>
        <h2 className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">
          Panel de Control
        </h2>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50">
          <Bell className="w-4 h-4" strokeWidth={2} />
        </button>
        
        <div className="w-px h-4 bg-secondary"></div> 
        
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:stroke-red-600" strokeWidth={2} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}
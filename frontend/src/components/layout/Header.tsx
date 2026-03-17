import { LogOut, Bell, Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout } = useAuth();

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
        <button className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50">
          <Bell className="w-4 h-4" strokeWidth={2} />
        </button>
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
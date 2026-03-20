import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAVIGATION } from '../../config/navigation';
import { Leaf, X, Settings } from 'lucide-react';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = NAVIGATION.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-2xl lg:shadow-none">
      
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-50">
        <div className="flex items-center">
          <Leaf className="w-5 h-5 text-black mr-3" strokeWidth={2} />
          <span className="font-bold text-lg tracking-tight text-gray-900">Green Core</span>
        </div>
    
        <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-black rounded-md">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive ? "bg-gray-50 text-black" : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-900"
              }`}
            >
              <Icon 
                className={`w-4 h-4 transition-colors ${isActive ? "text-black" : "text-gray-400 group-hover:text-gray-700"}`} 
                strokeWidth={isActive ? 2 : 1.5}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Perfil del usuario → navega a la página de perfil */}
      <div className="p-4 border-t border-gray-50">
        <Link
          to="/dashboard/perfil"
          onClick={onClose}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group cursor-pointer ${
            location.pathname === '/dashboard/perfil' ? 'bg-primary/5 shadow-sm ring-1 ring-primary/10' : 'hover:bg-gray-50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black uppercase flex-shrink-0 transition-colors ${
            location.pathname === '/dashboard/perfil' ? 'bg-primary text-white border-primary' : 'bg-primary/10 text-primary border-primary/20'
          }`}>
            {user?.username?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`text-sm font-semibold truncate transition-colors ${
              location.pathname === '/dashboard/perfil' ? 'text-primary' : 'text-gray-900'
            }`}>
              {user?.username}
            </span>
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{user?.role}</span>
          </div>
          <Settings className={`w-4 h-4 transition-colors ${
            location.pathname === '/dashboard/perfil' ? 'text-primary' : 'text-gray-300 group-hover:text-gray-500'
          }`} />
        </Link>
      </div>
    </aside>
  );
}
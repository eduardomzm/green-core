import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAVIGATION } from '../../config/navigation';


export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = NAVIGATION.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen transition-all duration-300">
      
<div className='w-7 h-6'></div>

      <div className="h-16 flex items-center px-6 border-b border-gray-50 justify-center">
        <img 
              src="/src/assets/img/logo.jpeg" 
              alt="Green Core Logo"
              className="w-25 h-25 mr-5 object-contain"
            />
            
          </div>
      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? "bg-secondary/25 text-textMain " 
                  : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-900"
              }`}
            >
              <Icon 
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-accent" : "text-primary group-hover:text-secondary"
                }`} 
                strokeWidth={isActive ? 2 : 1.5}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Perfil de Usuario en el pie del menú */}
      <div className="p-4 border-t border-gray-50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 uppercase">
            {user?.username?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">
              { user?.username}
            </span>
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}
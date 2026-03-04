import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { navigationByRole } from "../../config/navigation";

const Sidebar = () => {
  const { user, logout } = useAuth(); 
  const location = useLocation();

  if (!user) return null;

  const navItems = navigationByRole[user.role] || [];

  return (
    <aside className="w-64 bg-primary text-white min-h-screen shadow-2xl flex flex-col fixed left-0 top-0">
      <div className="p-6 text-center border-b border-white/10">
        <div className="text-4xl mb-2"></div>
        <h2 className="text-2xl font-extrabold tracking-tight">Green Core</h2>
        <p className="text-xs font-medium text-secondary mt-1 uppercase tracking-widest">
          Panel de {user.role}
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive
                  ? "bg-secondary text-white shadow-md transform translate-x-1"
                  : "text-gray-200 hover:bg-white/10 hover:text-white hover:translate-x-1"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={logout}
          className="w-full py-2.5 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors font-bold text-sm shadow-sm"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
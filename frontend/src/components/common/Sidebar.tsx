import { NavLink } from "react-router-dom"; // Importamos NavLink para la navegación
import { LayoutDashboard, History, Package, LogOut } from "lucide-react";

const Sidebar = () => {
  // Definimos la lógica de cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)]">
      <nav className="flex-1 p-4 space-y-2">
        {/* Enlace al Perfil */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive ? "bg-green-50 text-green-700 font-bold" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-sm">Perfil</span>
        </NavLink>

        {/* Enlace al Historial */}
        <NavLink 
          to="/historial" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive ? "bg-green-50 text-green-700 font-bold" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <History size={20} />
          <span className="text-sm">Historial de Depósitos</span>
        </NavLink>

        {/* Enlace a Registrar (Aquí usamos Package para quitar el error) */}
        <NavLink 
          to="/registrar" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive ? "bg-green-50 text-green-700 font-bold" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Package size={20} />
          <span className="text-sm">Registrar Depósito</span>
        </NavLink>
      </nav>

      {/* Sección de Cerrar Sesión */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

// ESTO CORRIGE EL ERROR DE "FAST REFRESH":
export default Sidebar;
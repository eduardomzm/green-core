import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { navigationByRole } from "../../config/navigation";
import type { MeResponse } from "../../types/user.types";
import { useEffect, useState } from "react";
import { getMe } from "../../services/userService";

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getMe().then(setUser);
    }
  }, [isAuthenticated]);

  if (!user) return null;

const navItems = navigationByRole[user.role as keyof typeof navigationByRole] || [];


  return (
    <aside className="w-60 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-lg font-bold mb-4">Menú</h2>

      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="block p-2 hover:bg-gray-700 rounded"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};


export default Sidebar;
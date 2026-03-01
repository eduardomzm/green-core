import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { navigationByRole } from "../../config/navigation";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = navigationByRole[user.role];

  return (
    <aside>
      <ul>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
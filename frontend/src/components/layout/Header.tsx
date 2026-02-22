import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-green-600 text-white p-4 flex justify-between">
      <h1 className="font-bold">Green Core</h1>
      <button
        onClick={logout}
        className="bg-white text-green-600 px-3 py-1 rounded"
      >
        Cerrar sesión
      </button>
    </header>
  );
};

export default Header;
import { useEffect, useState } from "react";
// Importamos la función y la interfaz que acabamos de crear
import { getUsers, type User } from "../services/userService";

const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Este useEffect se ejecuta una sola vez al cargar la pantalla
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("No se pudo cargar la lista de usuarios. Verifica tu conexión.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      {/* Encabezado y Botón de Acción */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-textMain">Gestión de Usuarios</h2>
          <p className="text-gray-500 mt-1">Administra cuentas, roles y accesos al sistema.</p>
        </div>
        <button className="bg-accent hover:bg-orange-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
          + Nuevo Usuario
        </button>
      </div>

      {/* Manejo de Estados (Cargando y Error) */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 font-bold animate-pulse">Cargando usuarios desde la base de datos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl font-bold border border-red-200">
          {error}
        </div>
      ) : (
        /* Tabla de Usuarios (Solo se muestra si ya cargó y no hay error) */
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">Usuario</th>
                <th className="p-4 font-bold">Correo</th>
                <th className="p-4 font-bold">Rol</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                    No hay usuarios registrados en el sistema.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-textMain">{u.username}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      {/* Insignias de colores para cada rol */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'OPERADOR' ? 'bg-secondary/20 text-secondary' :
                        u.role === 'TUTOR' ? 'bg-blue-100 text-blue-700' :
                        'bg-primary/20 text-primary'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {/* Indicador visual de estado Activo/Inactivo */}
                      <span className={`flex items-center gap-1.5 font-medium ${u.activo ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${u.activo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-secondary font-medium transition-colors mr-3">Editar</button>
                      <button className="text-gray-400 hover:text-red-500 font-medium transition-colors">Borrar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
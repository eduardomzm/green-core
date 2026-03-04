import { useEffect, useState } from "react";
import { getUsers, createUser, type User } from "../services/userService";

const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    primer_apellido: "",
    segundo_apellido: "",
    role: "ALUMNO",
    matricula: "",
    activo: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    try {
      const newUser = await createUser(formData);
      setUsers([...users, newUser]); 
    
      setIsModalOpen(false);
      setFormData({
        username: "", email: "", password: "", first_name: "",
        primer_apellido: "", segundo_apellido: "", role: "ALUMNO", matricula: "", activo: true,
      });
    } catch (err: any) {
      setModalError(err.message);
    }
  };

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-textMain">Gestión de Usuarios</h2>
          <p className="text-gray-500 mt-1">Administra cuentas, roles y accesos al sistema.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-orange-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          + Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 font-bold animate-pulse">Cargando usuarios...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl font-bold border border-red-200">{error}</div>
      ) : (
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
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-semibold text-textMain">{u.username}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'OPERADOR' ? 'bg-secondary/20 text-secondary' :
                      u.role === 'TUTOR' ? 'bg-blue-100 text-blue-700' : 'bg-primary/20 text-primary'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
            
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Crear Nuevo Usuario</h3>
                <p className="text-sm text-primary-100 opacity-80">Asigna credenciales y rol al nuevo integrante</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white text-2xl font-bold transition-colors">
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {modalError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold border border-red-200 break-words">
                  {modalError}
                </div>
              )}

              <form id="createUserForm" onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usuario</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre(s)</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">1er Apellido</label>
                    <input type="text" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">2do Apellido</label>
                    <input type="text" name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none transition-all text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rol</label>
                    <select name="role" value={formData.role} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none transition-all text-sm bg-white font-bold text-primary cursor-pointer">
                      <option value="ALUMNO">Alumno</option>
                      <option value="OPERADOR">Operador</option>
                      <option value="TUTOR">Tutor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                  
                  {formData.role === "ALUMNO" && (
                    <div className="animate-fade-in-up">
                      <label className="block text-xs font-bold text-accent uppercase mb-1">Matrícula (Obligatoria)</label>
                      <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-200 focus:ring-2 focus:ring-accent outline-none transition-all text-sm bg-orange-50/30" />
                    </div>
                  )}

                  <div className={formData.role !== "ALUMNO" ? "col-span-2" : ""}>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contraseña Temporal</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none transition-all text-sm" />
                  </div>
                </div>

              
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="activo" name="activo" checked={formData.activo} onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer" />
                  <label htmlFor="activo" className="text-sm font-bold text-gray-600 cursor-pointer">
                    Cuenta Activa (Puede iniciar sesión)
                  </label>
                </div>
              </form>
            </div>

           
            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors text-sm">
                Cancelar
              </button>
              <button form="createUserForm" type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary hover:bg-secondary text-white shadow-md transition-colors text-sm">
                Guardar Usuario
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Usuarios;
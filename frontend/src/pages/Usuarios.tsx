import { useEffect, useState, useCallback } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  getCarreras,
  getGrupos,
  type User,
  type Carrera,
  type Grupo
} from "../services/userService";

const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Paginación y Filtros
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [carreraFilter, setCarreraFilter] = useState("");
  const [grupoFilter, setGrupoFilter] = useState("");

  // Opciones de filtros
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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

  const fetchFilters = async () => {
    try {
      const [cData, gData] = await Promise.all([getCarreras(), getGrupos()]);
      setCarreras(cData);
      setGrupos(gData);
    } catch (err) {
      console.error("Error cargando filtros:", err);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        search: search || undefined,
        role: roleFilter || undefined,
        carrera: carreraFilter || undefined,
        grupo: grupoFilter || undefined,
      };
      const data = await getUsers(params);
      setUsers(data.results);
      setTotalCount(data.count);
    } catch (err) {
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, carreraFilter, grupoFilter]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      first_name: user.first_name || "",
      primer_apellido: user.primer_apellido || "",
      segundo_apellido: user.segundo_apellido || "",
      role: user.role,
      matricula: user.matricula || "",
      activo: user.activo,
    });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      username: "", email: "", password: "", first_name: "",
      primer_apellido: "", segundo_apellido: "", role: "ALUMNO", matricula: "", activo: true,
    });
    setModalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (formData.role === "ALUMNO") {
      const matriculaRegex = /^\d{5}[A-Z]{4}\d{3}$/;
      if (!matriculaRegex.test(formData.matricula)) {
        setModalError("Formato de matrícula inválido.");
        return;
      }
    }

    try {
      if (editingUser) {
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) {
          delete (dataToUpdate as any).password;
        }
        await updateUser(editingUser.id, dataToUpdate);
        fetchUsers(); // Recargar para ver cambios
      } else {
        await createUser(formData);
        fetchUsers();
      }

      handleCloseModal();
    } catch (err: any) {
      setModalError(err.message);
    }
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="p-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-textMain">Gestión de Usuarios</h2>
          <p className="text-gray-500 mt-1">Administra cuentas, roles y accesos al sistema.</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="bg-accent hover:bg-orange-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, usuario o matrícula..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary outline-none transition-all text-sm font-bold text-primary"
          >
            <option value="">Todos los Roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="TUTOR">Tutor</option>
            <option value="OPERADOR">Operador</option>
            <option value="ALUMNO">Alumno</option>
          </select>

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={carreraFilter}
              onChange={(e) => { setCarreraFilter(e.target.value); setPage(1); }}
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary outline-none transition-all text-sm font-bold text-primary"
            >
              <option value="">Todas las Carreras</option>
              {carreras.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <select
              value={grupoFilter}
              onChange={(e) => { setGrupoFilter(e.target.value); setPage(1); }}
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary outline-none transition-all text-sm font-bold text-primary"
            >
              <option value="">Todos los Grupos</option>
              {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 font-bold animate-pulse">Cargando usuarios...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl font-bold border border-red-200">{error}</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm overflow-x-auto border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                  <th className="p-5 font-bold">Usuario</th>
                  <th className="p-5 font-bold">Información</th>
                  <th className="p-5 font-bold">Rol</th>
                  <th className="p-5 font-bold">Estado</th>
                  <th className="p-5 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {u.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-textMain">{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-semibold text-textMain capitalize">
                        {u.first_name} {u.primer_apellido} {u.segundo_apellido}
                      </p>
                      <p className="text-xs text-secondary font-medium mt-0.5">{u.email}</p>
                      {u.matricula && (
                        <p className="text-[10px] text-accent font-bold mt-1 uppercase tracking-tight">Matrícula: {u.matricula}</p>
                      )}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'OPERADOR' ? 'bg-secondary/10 text-secondary' :
                          u.role === 'TUTOR' ? 'bg-blue-100 text-blue-700' : 'bg-primary/10 text-primary'
                        }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${u.activo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${u.activo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleEdit(u)}
                        className="md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-secondary text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md hover:shadow-lg"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="p-12 text-center text-gray-500 font-medium">
                No se encontraron usuarios con los filtros aplicados.
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-500 font-medium ml-2">
                Página <span className="text-textMain font-bold">{page}</span> de <span className="text-textMain font-bold">{totalPages}</span>
                <span className="hidden sm:inline"> — {totalCount} usuarios en total</span>
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl font-bold border border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-sm"
                >
                  Anterior
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl font-bold bg-primary text-white shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary transition-all text-sm"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">

            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
                <p className="text-sm text-primary-100 opacity-80">
                  {editingUser ? `Modificando cuenta de ${editingUser.username}` : 'Asigna credenciales y rol al nuevo integrante'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-white/70 hover:text-white text-2xl font-bold transition-colors">
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {modalError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold border border-red-200 break-words">
                  {modalError}
                </div>
              )}

              <form id="userForm" onSubmit={handleSubmit} className="space-y-4">

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
                    <select name="role" value={formData.role} onChange={handleChange} disabled={!!editingUser}
                      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none transition-all text-sm bg-white font-bold text-primary ${editingUser ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                      <option value="ALUMNO">Alumno</option>
                      <option value="OPERADOR">Operador</option>
                      <option value="TUTOR">Tutor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>

                  {formData.role === "ALUMNO" && (
                    <div className="animate-fade-in-up">
                      <label className="block text-xs font-bold text-accent uppercase mb-1">Matrícula (Ej: 12345ABCD123)</label>
                      <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required
                        placeholder="11111AAAA111"
                        className="w-full px-4 py-2.5 rounded-xl border border-orange-200 focus:ring-2 focus:ring-accent outline-none transition-all text-sm bg-orange-50/30" />
                    </div>
                  )}

                  <div className={formData.role !== "ALUMNO" ? "col-span-2" : ""}>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      {editingUser ? 'Contraseña (Vacio para mantener)' : 'Contraseña Temporal'}
                    </label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingUser}
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
              <button onClick={handleCloseModal} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors text-sm">
                Cancelar
              </button>
              <button form="userForm" type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary hover:bg-secondary text-white shadow-md transition-colors text-sm">
                {editingUser ? 'Actualizar Usuario' : 'Guardar Usuario'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Usuarios;
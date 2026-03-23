import { useState, useEffect } from "react";
import { getMateriales, createMaterial, createMeta, getMetasSistema, type Material, type MetaSistema } from "../services/reciclajeService";
import { getCarreras, createCarrera, type Carrera, getNiveles, updateNivel, type NivelConfig } from "../services/userService";
import { Settings, Plus, Target, BookOpen, Trophy } from "lucide-react";

const Administracion = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const [materialForm, setMaterialForm] = useState({ nombre: "", unidad: "pieza" });
  const [materialMsg, setMaterialMsg] = useState({ text: "", type: "" });

  const [metaForm, setMetaForm] = useState({ nombre: "", material: "", cantidad_meta: "" });
  const [metaMsg, setMetaMsg] = useState({ text: "", type: "" });
  const [metasSistema, setMetasSistema] = useState<MetaSistema[]>([]);

  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carreraForm, setCarreraForm] = useState({ nombre: "", abreviatura: "" });
  const [carreraMsg, setCarreraMsg] = useState({ text: "", type: "" });

  const [niveles, setNiveles] = useState<NivelConfig[]>([]);
  const [nivelMsg, setNivelMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [materialesData, carrerasData, metasData, nivelesData] = await Promise.all([
          getMateriales(),
          getCarreras(),
          getMetasSistema(),
          getNiveles()
        ]);
        setMateriales(materialesData);
        setCarreras(carrerasData);
        setMetasSistema(metasData.filter((m: MetaSistema) => m.activa));
        setNiveles(nivelesData);
      } catch (error) {
        console.error("Error al cargar datos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNivelUpdate = async (id: number, nombre: string, piezas: number) => {
    setNivelMsg({ text: "Actualizando...", type: "loading" });
    try {
      const updated = await updateNivel(id, { nombre, piezas_requeridas: piezas });
      setNiveles(niveles.map(n => n.id === id ? updated : n));
      setNivelMsg({ text: "¡Nivel actualizado!", type: "success" });
      setTimeout(() => setNivelMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setNivelMsg({ text: "Error al actualizar nivel.", type: "error" });
    }
  };

  const handleMaterialSubmit = async () => {
    if (!materialForm.nombre) return;
    setMaterialMsg({ text: "Guardando...", type: "loading" });

    try {
      const nuevoMaterial = await createMaterial(materialForm);
      setMateriales([...materiales, nuevoMaterial]);
      setMaterialMsg({ text: "¡Material guardado!", type: "success" });
      setMaterialForm({ nombre: "", unidad: "pieza" });

      setTimeout(() => setMaterialMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setMaterialMsg({ text: "Error al crear material.", type: "error" });
    }
  };

  const handleMetaSubmit = async () => {
    if (!metaForm.nombre || !metaForm.cantidad_meta || !metaForm.material) return;
    setMetaMsg({ text: "Configurando...", type: "loading" });

    try {
      await createMeta({
        nombre: metaForm.nombre,
        material: parseInt(metaForm.material),
        cantidad_meta: parseInt(metaForm.cantidad_meta),
        activa: true
      });
      setMetaMsg({ text: "¡Meta global actualizada! ", type: "success" });
      setMetaForm({ nombre: "", material: "", cantidad_meta: "" });

      const metasData = await getMetasSistema();
      setMetasSistema(metasData.filter((m: MetaSistema) => m.activa));

      setTimeout(() => setMetaMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setMetaMsg({ text: "Error al actualizar la meta.", type: "error" });
    }
  };

  const handleCarreraSubmit = async () => {
    if (!carreraForm.nombre || !carreraForm.abreviatura) return;
    setCarreraMsg({ text: "Guardando...", type: "loading" });

    try {
      const nuevaCarrera = await createCarrera({
        nombre: carreraForm.nombre,
        abreviatura: carreraForm.abreviatura
      });
      setCarreras([...carreras, nuevaCarrera]);
      setCarreraMsg({ text: "¡Carrera creada con éxito!", type: "success" });
      setCarreraForm({ nombre: "", abreviatura: "" });

      setTimeout(() => setCarreraMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setCarreraMsg({ text: "Error al crear la carrera.", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 font-bold animate-pulse text-lg">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-textMain flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Administración del Sistema
        </h2>
        <p className="text-gray-500 mt-1">Configura los materiales disponibles y las metas globales de reciclaje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Añadir Material */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-secondary relative h-fit">
          <h3 className="text-lg font-bold text-textMain mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-secondary" />
              Añadir Material
            </span>
            {materialMsg.text && (
              <span className={`text-xs px-2 py-1 rounded-md ${materialMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {materialMsg.text}
              </span>
            )}
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre del Material</label>
              <input
                type="text"
                placeholder=""
                value={materialForm.nombre}
                onChange={(e) => setMaterialForm({ ...materialForm, nombre: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Unidad de medida</label>
              <select
                value={materialForm.unidad}
                onChange={(e) => setMaterialForm({ ...materialForm, unidad: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50 appearance-none"
              >
                <option value="pieza">Por Pieza</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleMaterialSubmit}
              disabled={!materialForm.nombre || materialMsg.type === 'loading'}
              className="w-full bg-secondary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm mt-2"
            >
              Guardar Material
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Materiales Registrados</h4>
            <div className="flex flex-wrap gap-2">
              {materiales.map((m: Material) => (
                <span key={m.id} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100 uppercase">
                  {m.nombre} ({m.unidad})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Configurar Meta Global */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-accent relative h-fit lg:col-span-1">
          <h3 className="text-lg font-bold text-textMain mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Configurar Meta Global
            </span>
            {metaMsg.text && (
              <span className={`text-xs px-2 py-1 rounded-md ${metaMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {metaMsg.text}
              </span>
            )}
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre de la Campaña</label>
              <input
                type="text"
                placeholder=""
                value={metaForm.nombre}
                onChange={(e) => setMetaForm({ ...metaForm, nombre: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-background/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Material</label>
              <select
                value={metaForm.material}
                onChange={(e) => setMetaForm({ ...metaForm, material: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-background/50 appearance-none"
              >
                <option value="">Seleccione un material...</option>
                {materiales.map((m: Material) => (
                  <option key={m.id} value={m.id}>{m.nombre} ({m.unidad})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Cantidad a lograr (piezas)</label>
              <input
                type="number"
                min="1"
                placeholder="0"
                value={metaForm.cantidad_meta}
                onChange={(e) => setMetaForm({ ...metaForm, cantidad_meta: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-background/50"
              />
            </div>
            <button
              type="button"
              onClick={handleMetaSubmit}
              disabled={!metaForm.nombre || !metaForm.cantidad_meta || !metaForm.material || metaMsg.type === 'loading'}
              className="w-full bg-accent hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm mt-2"
            >
              Activar Nueva Meta
            </button>
            <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic">
              * Al activar una nueva meta para un material, si existiera una anterior, esta se desactivará automáticamente.
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Metas Activas por Material</h4>
            <div className="flex flex-col gap-2">
              {metasSistema.length > 0 ? metasSistema.map((m: MetaSistema) => (
                <div key={m.id} className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-orange-600 uppercase block">{m.material_nombre}</span>
                    <span className="text-sm font-bold text-gray-800">{m.nombre}</span>
                  </div>
                  <span className="text-sm font-black text-accent bg-orange-100 px-3 py-1 rounded-lg">
                    {m.cantidad_meta.toLocaleString()} pzs
                  </span>
                </div>
              )) : (
                <p className="text-xs font-medium text-gray-400 italic">No hay metas activas configuradas.</p>
              )}
            </div>
          </div>
        </div>

        {/* Configuración de Niveles */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-primary relative h-fit lg:col-span-2 md:col-span-2">
          <h3 className="text-lg font-bold text-textMain mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Configuración de Niveles
            </span>
            {nivelMsg.text && (
              <span className={`text-xs px-2 py-1 rounded-md ${nivelMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {nivelMsg.text}
              </span>
            )}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {niveles.map((n: NivelConfig) => (
              <div key={n.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${n.color}20`, color: n.color }}>
                    Nivel {n.nivel}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    defaultValue={n.nombre}
                    onBlur={(e) => {
                      if (e.target.value !== n.nombre) {
                        handleNivelUpdate(n.id, e.target.value, n.piezas_requeridas);
                      }
                    }}
                    className="w-full bg-transparent border-b border-transparent focus:border-primary outline-none text-sm font-bold text-textMain"
                  />
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">Piezas req.</label>
                    <input
                      type="number"
                      defaultValue={n.piezas_requeridas}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (val !== n.piezas_requeridas) {
                          handleNivelUpdate(n.id, n.nombre, val);
                        }
                      }}
                      className="w-full bg-transparent border-b border-transparent focus:border-primary outline-none text-xs text-gray-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-4 italic">
            * Los cambios se guardan automáticamente al perder el foco del campo. El nivel 1 siempre debe requerir 0 piezas.
          </p>
        </div>

        {/* Nueva Carrera */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-primary relative h-fit lg:col-span-2 md:col-span-2">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-textMain mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Nueva Carrera
                </span>
                {carreraMsg.text && (
                  <span className={`text-xs px-2 py-1 rounded-md ${carreraMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {carreraMsg.text}
                  </span>
                )}
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre de la Carrera</label>
                    <input
                      type="text"
                      placeholder=""
                      value={carreraForm.nombre}
                      onChange={(e) => setCarreraForm({ ...carreraForm, nombre: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-background/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Abreviatura</label>
                    <input
                      type="text"
                      placeholder=""
                      value={carreraForm.abreviatura}
                      onChange={(e) => setCarreraForm({ ...carreraForm, abreviatura: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-background/50"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCarreraSubmit}
                  disabled={!carreraForm.nombre || !carreraForm.abreviatura || carreraMsg.type === 'loading'}
                  className="w-full bg-primary hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm mt-2"
                >
                  Guardar Carrera
                </button>
              </form>
            </div>

            <div className="flex-1 md:border-l md:pl-8 border-gray-50">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Carreras Actuales ({carreras.length})</h4>
              <div className="flex flex-wrap gap-2">
                {carreras.map((c: Carrera) => (
                  <span key={c.id} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                    {c.nombre} {c.abreviatura && <span className="text-primary font-black ml-1">({c.abreviatura})</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Administracion;

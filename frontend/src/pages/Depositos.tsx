import { useState, useEffect } from "react";


const Depositos = () => {

  const [depositoForm, setDepositoForm] = useState({ alumno_id: "", material_id: "", cantidad: "" });
  const [materialForm, setMaterialForm] = useState({ nombre: "", unidad: "pieza" });
  const [metaForm, setMetaForm] = useState({ nombre: "", cantidad_meta: "" });

  const [materiales, setMateriales] = useState([{ id: 1, nombre: "Botella PET" }, { id: 2, nombre: "Cartón" }]);
  const [alumnos, setAlumnos] = useState([{ id: 1, username: "juan.perez" }, { id: 2, username: "ana.gomez" }]);

  return (
    <div className="p-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-textMain">Depósitos y Configuración</h2>
        <p className="text-gray-500 mt-1">Registra transacciones, administra materiales y define las metas globales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary text-2xl">♻️</div>
              <h3 className="text-xl font-bold text-textMain">Registrar Nuevo Depósito</h3>
            </div>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Alumno</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50">
                    <option value="">Selecciona un alumno...</option>
                    {alumnos.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Material</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50">
                    <option value="">Selecciona el material...</option>
                    {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Cantidad (Piezas)</label>
                <input type="number" min="1" placeholder="Ej. 15"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50" />
              </div>

              <button type="button" className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 mt-2">
                Confirmar Depósito
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-secondary">
            <h3 className="text-lg font-bold text-textMain mb-4">Añadir Material</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre del Material</label>
                <input type="text" placeholder="Ej. Tapas de plástico"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary outline-none text-sm bg-background/50" />
              </div>
              <button type="button" className="w-full bg-secondary hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl shadow-sm transition-colors text-sm">
                Guardar Material
              </button>
            </form>
          </div>


          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-accent">
            <h3 className="text-lg font-bold text-textMain mb-4">Configurar Meta Global</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre de la Campaña</label>
                <input type="text" placeholder="Ej. Meta Semestre 2026-1"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-background/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Cantidad a lograr (Piezas)</label>
                <input type="number" min="1" placeholder="Ej. 5000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none text-sm bg-background/50" />
              </div>
              <button type="button" className="w-full bg-accent hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl shadow-sm transition-colors text-sm">
                Activar Nueva Meta
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Depositos;
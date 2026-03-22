import { useState } from "react";
import { TreePine, Zap, Earth } from "lucide-react";

export default function Simulador() {

const [botellas, setBotellas] = useState(0);

const arboles = (botellas * 0.02).toFixed(1);
const energia = (botellas * 0.5).toFixed(1);
const co2 = (botellas * 0.03).toFixed(1);

    return (

        <section id="simulador" className="py-28 px-8 bg-green-50">

        <div className="max-w-6xl mx-auto text-center">

            <h3 className="text-4xl font-bold text-primary mb-6">
            Simula tu impacto ambiental
            </h3>

            <p className="text-lg opacity-70 mb-12 max-w-3xl mx-auto">
            Descubre cómo pequeñas acciones pueden generar un gran impacto
            en el medio ambiente.
            </p>

            {/* Input */}
            <div className="mb-16">

            <label className="block text-lg font-semibold mb-4">
                ¿Cuántas botellas reciclaste?
            </label>

            <input
                type="number"
                value={botellas}
                onChange={(e) => setBotellas(Number(e.target.value))}
                className="w-40 text-center text-2xl p-3 border rounded-lg shadow-sm"
            />

            </div>

            {/* Resultados */}
            <div className="grid md:grid-cols-3 gap-10">

            {/* Árboles */}
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
            transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary transition-all duration-500 group-hover:h-2"></div>

                <div className="w-20 h-20 mx-auto bg-green-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform duration-500 group-hover:rotate-6">
                    <TreePine className="w-10 h-10" strokeWidth={1.5} />
                </div>

                <h4 className="text-3xl font-bold text-primary mb-2">
                {arboles}
                </h4>

                <p className="text-gray-500 text-base leading-relaxed">
                árboles equivalentes salvados
                </p>

            </div>

            {/* Energía */}
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
            transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary transition-all duration-500 group-hover:h-2"></div>

                <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-secondary mb-6 transition-transform duration-500 group-hover:scale-110">
                    <Zap className="w-10 h-10" strokeWidth={1.5} />
                </div>

                <h4 className="text-3xl font-bold text-secondary mb-2">
                {energia}%
                </h4>

                <p className="text-gray-500 text-base leading-relaxed">
                energía ahorrada
                </p>

            </div>

            {/* CO2 */}
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
            transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-accent transition-all duration-500 group-hover:h-2"></div>

                <div className="w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center text-accent mb-6 transition-transform duration-500 group-hover:-rotate-6">
                    <Earth className="w-10 h-10" strokeWidth={1.5} />
                </div>

                <h4 className="text-3xl font-bold text-accent mb-2">
                {co2} kg
                </h4>

                <p className="text-gray-500 text-base leading-relaxed">
                CO₂ evitado
                </p>

            </div>

            </div>

        </div>

    </section>

    );
};
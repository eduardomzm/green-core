import { useState } from "react";

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
            <div className="bg-white p-10 rounded-2xl shadow-md hover:scale-105 transition">

                <div className="text-5xl mb-4">
                🌳
                </div>

                <h4 className="text-3xl font-bold text-primary mb-2">
                {arboles}
                </h4>

                <p className="opacity-70">
                árboles equivalentes salvados
                </p>

            </div>

            {/* Energía */}
            <div className="bg-white p-10 rounded-2xl shadow-md hover:scale-105 transition">

                <div className="text-5xl mb-4">
                ⚡
                </div>

                <h4 className="text-3xl font-bold text-secondary mb-2">
                {energia}%
                </h4>

                <p className="opacity-70">
                energía ahorrada
                </p>

            </div>

            {/* CO2 */}
            <div className="bg-white p-10 rounded-2xl shadow-md hover:scale-105 transition">

                <div className="text-5xl mb-4">
                🌍
                </div>

                <h4 className="text-3xl font-bold text-accent mb-2">
                {co2} kg
                </h4>

                <p className="opacity-70">
                CO₂ evitado
                </p>

            </div>
            </div>

        </div>

    </section>

    );
};
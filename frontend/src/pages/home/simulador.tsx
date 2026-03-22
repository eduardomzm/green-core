import { useState } from "react";
import { TreePine, Zap, Earth, Leaf, Cloud } from "lucide-react";
import { motion } from "framer-motion";

export default function Simulador() {

const [botellas, setBotellas] = useState<number | "">("");

const numericBotellas = Number(botellas) || 0;
const arboles = (numericBotellas * 0.02).toFixed(1);
const energia = (numericBotellas * 0.5).toFixed(1);
const co2 = (numericBotellas * 0.03).toFixed(1);

// Variantes de partículas para el efecto hover
const getParticleVariants = () => ({
  hidden: { opacity: 0, y: 0, x: 0, scale: 0 },
  hover: () => ({
    opacity: [0, 1, 0],
    y: -60 - Math.random() * 60,
    x: (Math.random() - 0.5) * 100,
    scale: [0, 1.2 + Math.random(), 0],
    rotate: (Math.random() - 0.5) * 180,
    transition: {
      duration: 1.5 + Math.random(),
      repeat: Infinity,
      delay: Math.random() * 0.5,
      ease: "easeOut" as const
    }
  })
});

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
                min="0"
                placeholder="0"
                value={botellas}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                        setBotellas("");
                    } else {
                        const num = parseInt(value, 10);
                        if (!isNaN(num) && num >= 0) {
                            setBotellas(num);
                        }
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === ".") {
                        e.preventDefault();
                    }
                }}
                className="w-40 text-center text-2xl p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            />

            </div>

            {/* Resultados */}
            <div className="grid md:grid-cols-3 gap-10">

            {/* Árboles */}
            <motion.div 
              initial="hidden" 
              whileHover="hover"
              className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
              transform transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary transition-all duration-500 group-hover:h-2 z-10"></div>

                {/* Partículas interactuando en hover */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  {[...Array(6)].map((_, i) => (
                    <motion.div key={i} custom={i} variants={getParticleVariants()} className="absolute text-primary/60">
                      <Leaf className="w-6 h-6" />
                    </motion.div>
                  ))}
                </div>

                <div className="w-20 h-20 mx-auto bg-green-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform duration-500 group-hover:rotate-6 relative z-10">
                    <TreePine className="w-10 h-10" strokeWidth={1.5} />
                </div>

                <h4 className="text-3xl font-bold text-primary mb-2 relative z-10">
                {arboles}
                </h4>

                <p className="text-gray-500 text-base leading-relaxed relative z-10">
                árboles equivalentes salvados
                </p>

            </motion.div>

            {/* Energía */}
            <motion.div 
              initial="hidden" 
              whileHover="hover"
              className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
              transform transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary transition-all duration-500 group-hover:h-2 z-10"></div>

                {/* Partículas Rayos */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  {[...Array(6)].map((_, i) => (
                    <motion.div key={i} custom={i} variants={getParticleVariants()} className="absolute text-secondary/60">
                      <Zap className="w-6 h-6 fill-secondary/50" />
                    </motion.div>
                  ))}
                </div>

                <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-secondary mb-6 transition-transform duration-500 group-hover:scale-110 relative z-10">
                    <Zap className="w-10 h-10" strokeWidth={1.5} />
                </div>

                <h4 className="text-3xl font-bold text-secondary mb-2 relative z-10">
                {energia}%
                </h4>

                <p className="text-gray-500 text-base leading-relaxed relative z-10">
                energía ahorrada
                </p>

            </motion.div>

            {/* CO2 */}
            <motion.div 
              initial="hidden" 
              whileHover="hover"
              className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
              transform transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-accent transition-all duration-500 group-hover:h-2 z-10"></div>

                {/* Partículas Nubes */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  {[...Array(6)].map((_, i) => (
                    <motion.div key={i} custom={i} variants={getParticleVariants()} className="absolute text-accent/60">
                      <Cloud className="w-6 h-6 fill-accent/30" />
                    </motion.div>
                  ))}
                </div>

                <div className="w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center text-accent mb-6 transition-transform duration-500 group-hover:-rotate-6 relative z-10">
                    <Earth className="w-10 h-10" strokeWidth={1.5} />
                </div>

                <h4 className="text-3xl font-bold text-accent mb-2 relative z-10">
                {co2} kg
                </h4>

                <p className="text-gray-500 text-base leading-relaxed relative z-10">
                CO₂ evitado
                </p>

            </motion.div>

            </div>

        </div>

    </section>

    );
};
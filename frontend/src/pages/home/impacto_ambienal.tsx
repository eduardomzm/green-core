import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ImpactoAmbiental() {

/*Scroll graficas*/
const [plastic, setPlastic] = useState(0);
const [recycle, setRecycle] = useState(0);
const [years, setYears] = useState(0);

const [visible, setVisible] = useState(false);
const sectionRef = useRef<HTMLDivElement>(null);

useEffect(() => {

        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
            setVisible(true);
            }
        },
        { threshold: 0.1 }
        );

        if (sectionRef.current) {
        observer.observe(sectionRef.current);
        }

    }, []);

    useEffect(() => {

        if (!visible) return;

        let p = 0;
        let r = 0;
        let y = 0;

        const interval = setInterval(() => {

        if (p < 7000000) {
            p += 60000;
            setPlastic(p);
        }

        if (r < 44) {
            r += 1;
            setRecycle(r);
        }

        if (y < 450) {
            y += 5;
            setYears(y);
        }

    }, 25);

    return () => clearInterval(interval);

    }, [visible]);

    return (

    /* --- IMPACTO AMBIENTAL --- */
    <section
        id="impacto"
        ref={sectionRef}
        className="py-16 md:py-28 px-4 md:px-8 bg-gradient-to-b from-white via-green-50 to-white"
    >

        <div className="max-w-7xl mx-auto">

        {/* TITULO */}
        <div className="text-center mb-20">

            <h3 className="text-5xl font-bold text-primary mb-6">
            El impacto ambiental en México
            </h3>

            <p className="text-lg opacity-70 max-w-3xl mx-auto">
            Cada residuo que reciclamos reduce la contaminación y ayuda a preservar
            los recursos naturales. Estos números muestran por qué es tan importante actuar.
            </p>

        </div>

        {/* CONTADORES */}
        <div className="grid md:grid-cols-3 gap-10 mb-24">

            {/* PLÁSTICO */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
              transform transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group"
            >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary transition-all duration-500 group-hover:h-2"></div>

            <h4 className="text-5xl font-extrabold text-secondary mb-4 group-hover:scale-110 transition-transform duration-500">
                {plastic.toLocaleString()}
            </h4>

            <p className="opacity-70 text-lg">
                toneladas de plástico generadas al año en México
            </p>

            </motion.div>

            {/* RECICLAJE */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
              transform transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group"
            >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary transition-all duration-500 group-hover:h-2"></div>

            <h4 className="text-5xl font-extrabold text-primary mb-4 group-hover:scale-110 transition-transform duration-500">
                {recycle}%
            </h4>

            <p className="opacity-70 text-lg">
                de residuos reciclables realmente se reciclan
            </p>

            </motion.div>

            {/* AÑOS */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
              transform transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group"
            >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-accent transition-all duration-500 group-hover:h-2"></div>

            <h4 className="text-5xl font-extrabold text-accent mb-4 group-hover:scale-110 transition-transform duration-500">
                {years}
            </h4>

            <p className="opacity-70 text-lg">
                años tarda una botella en degradarse
            </p>

            </motion.div>
        </div>

        {/* GRAFICAS */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
        {/* GRAFICA CIRCULAR */}
        <div className="flex flex-col items-center">
        <div className="relative w-60 h-60">
        <svg className="transform -rotate-90 w-full h-full">
        <circle
        cx="120"
        cy="120"
        r="100"
        stroke="#e5e7eb"
        strokeWidth="20"
        fill="none"
        />
        <circle
        cx="120"
        cy="120"
        r="100"
        stroke="#22c55e"
        strokeWidth="20"
        fill="none"
        strokeDasharray="628"
        strokeDashoffset={628 - (628 * recycle) / 100}
        className="transition-all duration-1000"
        />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-primary">
        {recycle}%
        </span>
        </div>
        </div>
        <p className="mt-6 text-center opacity-70">
        Porcentaje de residuos reciclados
        </p>
        </div>
        {/* BARRAS */}
        <div className="space-y-10">
        <h4 className="text-2xl font-bold text-primary">
        Materiales reciclados más comunes
        </h4>
        {/* PET */}
        <div>
        <div className="flex justify-between font-semibold mb-2">
        <span>Botellas PET</span>
        <span>55%</span>
        </div>
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div className="bg-secondary h-4 rounded-full w-[55%] animate-bar"></div>
        </div>
        </div>
        {/* CARTON */}
        <div>
        <div className="flex justify-between font-semibold mb-2">
        <span>Cartón</span>
        <span>30%</span>
        </div>
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div className="bg-green-500 h-4 rounded-full w-[30%] animate-bar"></div>
        </div>
        </div>
        {/* ALUMINIO */}
        <div>
        <div className="flex justify-between font-semibold mb-2">
        <span>Aluminio</span>
        <span>15%</span>
        </div>
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-4 rounded-full w-[15%] animate-bar"></div>
        </div>
        </div>
        </div>
        </motion.div>
        {/* MENSAJE FINAL */}
        <div className="mt-24 text-center">
        <h4 className="text-3xl font-bold text-primary mb-6">
        Pequeñas acciones, gran impacto
        </h4>
        <p className="max-w-3xl mx-auto opacity-70 text-lg">
        Green Core busca generar conciencia dentro de la comunidad universitaria.
        Cada botella, cada lata y cada pieza reciclada contribuye a construir un
        campus más limpio, sostenible y responsable con el planeta.
        </p>
        </div>
        </div>
        </section>
    );
};
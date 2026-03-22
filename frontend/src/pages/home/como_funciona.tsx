import { Recycle, FileText, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function ComoFunciona() {

    return (

    <section id="funciona" className="py-24 px-8 max-w-7xl mx-auto">

        <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-primary">
            ¿Cómo funciona Green Core?
            </h3>

            <p className="opacity-70 mt-4 text-lg">
            Tres simples pasos para generar un gran impacto.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Tarjeta 1 */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
            transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary transition-all duration-500 group-hover:h-2"></div>

            <div className="w-20 h-20 mx-auto bg-green-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform duration-500 group-hover:rotate-6 relative z-10">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl scale-0 group-hover:animate-ping opacity-50 z-0"></div>
                <Recycle className="w-10 h-10 relative z-10" strokeWidth={1.5} />
            </div>

            <h4 className="text-2xl font-bold mb-3 text-textMain relative z-10">
                1. Lleva tus piezas
            </h4>

            <p className="text-gray-500 text-base leading-relaxed">
                Recolecta botellas PET, latas o cartón y llévalos a los puntos de acopio de la universidad.
            </p>

            </div>
            </motion.div>

            {/* Tarjeta 2 */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
            transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary transition-all duration-500 group-hover:h-2"></div>

            <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-secondary mb-6 transition-transform duration-500 group-hover:scale-110 relative z-10">
                <div className="absolute inset-0 bg-secondary/20 rounded-2xl scale-0 group-hover:animate-ping opacity-50 z-0"></div>
                <FileText className="w-10 h-10 relative z-10" strokeWidth={1.5} />
            </div>

            <h4 className="text-2xl font-bold mb-3 text-textMain relative z-10">
                2. Registra tu aporte
            </h4>

            <p className="text-gray-500 text-base leading-relaxed">
                Acércate a un Operador Green Core. Él registrará la cantidad exacta de piezas a tu nombre en el sistema.
            </p>

            </div>
            </motion.div>

            {/* Tarjeta 3 */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
            <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center
            transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-accent transition-all duration-500 group-hover:h-2"></div>

            <div className="w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center text-accent mb-6 transition-transform duration-500 group-hover:-rotate-6 relative z-10">
                <div className="absolute inset-0 bg-accent/20 rounded-2xl scale-0 group-hover:animate-ping opacity-50 z-0"></div>
                <Trophy className="w-10 h-10 relative z-10" strokeWidth={1.5} />
            </div>

            <h4 className="text-2xl font-bold mb-3 text-textMain relative z-10">
                3. Sube en el Ranking
            </h4>

            <p className="opacity-80 text-lg">
                Tus piezas se suman a tu historial personal, al de tu grupo y al de tu carrera para definir a los ganadores.
            </p>

            </div>
            </motion.div>

        </div>

    </section>

    );

}
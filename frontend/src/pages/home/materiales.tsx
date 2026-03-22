import botella from "../../assets/img/botella_animada.jpg";
import carton from "../../assets/img/carton_animada.jpg";
import lata from "../../assets/img/lata_animada.jpg";
import { motion } from "framer-motion";
import { Sparkles, Leaf, Droplet } from "lucide-react";

export default function Materiales() {

    const renderParticles = (Icon: any, colorClass: String) => {
        return (
            <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ 
                            y: [50, -100 - Math.random() * 50],
                            x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
                            opacity: [0, 1, 0],
                            rotate: [0, 360],
                            scale: [0.5, Math.random() * 1.5 + 0.5, 0.5]
                        }}
                        transition={{ 
                            duration: 2 + Math.random() * 3, 
                            repeat: Infinity, 
                            delay: Math.random() * 2,
                            ease: "easeOut"
                        }}
                        className={`absolute ${colorClass}`}
                        style={{ left: `${Math.random() * 80 + 10}%`, top: `${80 + Math.random() * 20}%` }}
                    >
                        <Icon className="w-5 h-5" />
                    </motion.div>
                ))}
            </div>
        );
    };

    return (

    <section id="materiales" className="py-20 px-8 max-w-6xl mx-auto">

        <div className="text-center mb-16">

            <h3 className="text-3xl font-bold text-primary">
            ¿Qué materiales aceptamos?
            </h3>

            <p className="opacity-70 mt-4">
            En Green Core puedes reciclar distintos materiales que ayudan a reducir el impacto ambiental.
            </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Tarjeta Botella */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative group overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(249,115,22,0.3)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >

            <img
                src={botella}
                alt="Botellas reciclables"
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-8 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-orange-50/90 to-transparent z-10">

                {renderParticles(Droplet, "text-orange-400")}

                <h3 className="text-3xl font-extrabold mb-2 text-accent relative z-10">
                Botellas
                </h3>

                <p className="font-medium text-gray-800">
                Las botellas PET pueden reciclarse y convertirse en nuevos envases o fibras textiles.
                </p>

            </div>

            </motion.div>

            {/* Tarjeta Cartón */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative group overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(34,197,94,0.3)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >

            <img
                src={carton}
                alt="Cartón reciclable"
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-8 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-green-50/90 to-transparent z-10">

                {renderParticles(Leaf, "text-green-500")}

                <h3 className="text-3xl font-extrabold mb-2 text-primary relative z-10">
                Cartón
                </h3>

                <p className="font-medium text-gray-800">
                El cartón puede reutilizarse para crear nuevos empaques y reducir la tala de árboles.
                </p>

            </div>

            </motion.div>

            {/* Tarjeta Lata */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative group overflow-hidden rounded-3xl cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(59,130,246,0.3)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >

            <img
                src={lata}
                alt="Latas reciclables"
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-8 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-blue-50/90 to-transparent z-10">

                {renderParticles(Sparkles, "text-secondary")}

                <h3 className="text-3xl font-extrabold mb-2 text-secondary relative z-10">
                Latas
                </h3>

                <p className="font-medium text-gray-800">
                El aluminio puede reciclarse infinitamente sin perder sus propiedades.
                </p>

            </div>

            </motion.div>

        </div>

    </section>

    );
};
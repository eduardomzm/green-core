import { Recycle, Truck, Factory, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function TimelineReciclaje() {

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const lineVariants = {
    hidden: { width: "0%" },
    show: { width: "100%", transition: { duration: 1.5, ease: "easeInOut" as const } }
  };

    return (

    /* --- TIMELINE DEL RECICLAJE --- */
    <section id="timeline" className="py-28 px-8 bg-yellow-400 overflow-hidden">

        <div className="max-w-7xl mx-auto">

            {/* Titulo */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={itemVariants}
              className="text-center mb-20"
            >

            <h3 className="text-4xl font-bold text-black mb-6">
                El viaje del reciclaje
            </h3>

            <p className="text-lg opacity-70 max-w-3xl mx-auto text-black">
                Cada material reciclado pasa por un proceso antes de convertirse
                en un nuevo producto útil para la sociedad.
            </p>

            </motion.div>

            {/* Timeline Container */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid md:grid-cols-4 gap-10 relative"
            >

            {/* Línea del timeline animada con framer motion */}
            <motion.div
                variants={lineVariants}
                className="hidden md:block absolute top-12 left-0 h-1 bg-green-600 origin-left z-0"
            />

            {/* Paso 1 */}
            <motion.div
                variants={itemVariants}
                className="text-center group"
            >

                <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center text-primary mb-6
                transition-transform duration-500 group-hover:scale-110 shadow-sm border-4 border-white relative z-10">
                    <div className="absolute inset-0 bg-green-200 rounded-full scale-0 group-hover:animate-ping opacity-50 transition-all duration-300"></div>
                    <Recycle className="w-10 h-10 relative z-20" strokeWidth={1.5} />
                </div>

                <h4 className="text-xl font-bold mb-3 text-black">
                Depositas
                </h4>

                <p className="opacity-80 text-black">
                Llevas tus botellas, latas o cartón a los puntos
                de reciclaje dentro de la universidad.
                </p>

            </motion.div>

            {/* Paso 2 */}
            <motion.div
                variants={itemVariants}
                className="text-center group"
            >

                <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-secondary mb-6
                transition-transform duration-500 group-hover:scale-110 shadow-sm border-4 border-white relative z-10">
                    <div className="absolute inset-0 bg-blue-200 rounded-full scale-0 group-hover:animate-ping opacity-50 transition-all duration-300"></div>
                    <Truck className="w-10 h-10 relative z-20" strokeWidth={1.5} />
                </div>

                <h4 className="text-xl font-bold mb-3 text-black">
                Recolección
                </h4>

                <p className="opacity-80 text-black">
                Los materiales son transportados a centros de
                reciclaje especializados.
                </p>

            </motion.div>

            {/* Paso 3 */}
            <motion.div
                variants={itemVariants}
                className="text-center group"
            >

                <div className="w-24 h-24 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-accent mb-6
                transition-transform duration-500 group-hover:scale-110 shadow-sm border-4 border-white relative z-10">
                    <div className="absolute inset-0 bg-orange-200 rounded-full scale-0 group-hover:animate-ping opacity-50 transition-all duration-300"></div>
                    <Factory className="w-10 h-10 relative z-20" strokeWidth={1.5} />
                </div>

                <h4 className="text-xl font-bold mb-3 text-black">
                Procesamiento
                </h4>

                <p className="opacity-80 text-black">
                Los materiales se limpian, clasifican y se
                transforman en materia prima reutilizable.
                </p>

            </motion.div>

            {/* Paso 4 */}
            <motion.div
                variants={itemVariants}
                className="text-center group"
            >

                <div className="w-24 h-24 mx-auto rounded-full bg-green-200 flex items-center justify-center text-green-800 mb-6
                transition-transform duration-500 group-hover:scale-110 shadow-sm border-4 border-white relative z-10">
                    <div className="absolute inset-0 bg-green-300 rounded-full scale-0 group-hover:animate-ping opacity-50 transition-all duration-300"></div>
                    <Globe className="w-10 h-10 relative z-20" strokeWidth={1.5} />
                </div>

                <h4 className="text-xl font-bold mb-3 text-black">
                Nuevo producto
                </h4>

                <p className="opacity-80 text-black">
                Se crean nuevos productos como envases,
                ropa, empaques o materiales reutilizables.
                </p>

            </motion.div>

            </motion.div>

        </div>

    </section>

    );

}
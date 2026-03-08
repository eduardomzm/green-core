import { useEffect, useState, useRef } from "react";

export default function TimelineReciclaje() {

/* Timeline */
const timelineRef = useRef<HTMLDivElement>(null);
const [timelineVisible, setTimelineVisible] = useState(false);

useEffect(() => {

    const observer = new IntersectionObserver(
        ([entry]) => {
        if (entry.isIntersecting) {
            setTimelineVisible(true);
        }
        },
        { threshold: 0.3 }
    );

    if (timelineRef.current) {
        observer.observe(timelineRef.current);
    }

    }, []);

    return (

    /* --- TIMELINE DEL RECICLAJE --- */
    <section id="timeline" className="py-28 px-8 bg-yellow-400">

        <div ref={timelineRef} className="max-w-7xl mx-auto">

            {/* Titulo */}
            <div className="text-center mb-20">

            <h3 className="text-4xl font-bold text-black mb-6">
                El viaje del reciclaje
            </h3>

            <p className="text-lg opacity-70 max-w-3xl mx-auto">
                Cada material reciclado pasa por un proceso antes de convertirse
                en un nuevo producto útil para la sociedad.
            </p>

            </div>

            {/* Timeline */}
            <div className="grid md:grid-cols-4 gap-10 relative">

            {/* Línea del timeline */}
            <div
                className={`hidden md:block absolute top-10 left-0 h-1 bg-green-600 transition-all duration-1000
                ${timelineVisible ? "w-full" : "w-0"}`}
            ></div>

            {/* Paso 1 */}
            <div
                className={`text-center group transition-all duration-700
                ${timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >

                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl mb-6
                transition-transform duration-300 group-hover:scale-110">
                ♻
                </div>

                <h4 className="text-xl font-bold mb-3">
                Depositas
                </h4>

                <p className="opacity-70">
                Llevas tus botellas, latas o cartón a los puntos
                de reciclaje dentro de la universidad.
                </p>

            </div>

            {/* Paso 2 */}
            <div
                className={`text-center group transition-all duration-700
                ${timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >

                <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-4xl mb-6
                transition-transform duration-300 group-hover:scale-110">
                🚚
                </div>

                <h4 className="text-xl font-bold mb-3">
                Recolección
                </h4>

                <p className="opacity-70">
                Los materiales son transportados a centros de
                reciclaje especializados.
                </p>

            </div>

            {/* Paso 3 */}
            <div
                className={`text-center group transition-all duration-700
                ${timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >

                <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-4xl mb-6
                transition-transform duration-300 group-hover:scale-110">
                🏭
                </div>

                <h4 className="text-xl font-bold mb-3">
                Procesamiento
                </h4>

                <p className="opacity-70">
                Los materiales se limpian, clasifican y se
                transforman en materia prima reutilizable.
                </p>

            </div>

            {/* Paso 4 */}
            <div
                className={`text-center group transition-all duration-700
                ${timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >

                <div className="w-20 h-20 mx-auto rounded-full bg-green-200 flex items-center justify-center text-4xl mb-6
                transition-transform duration-300 group-hover:scale-110">
                🌎
                </div>

                <h4 className="text-xl font-bold mb-3">
                Nuevo producto
                </h4>

                <p className="opacity-70">
                Se crean nuevos productos como envases,
                ropa, empaques o materiales reutilizables.
                </p>

            </div>

            </div>

        </div>

    </section>

    );

}


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
            <div className="bg-white p-10 rounded-2xl shadow-md border-t-4 border-primary text-center
            transform transition-all duration-300
            hover:scale-110 hover:-translate-y-3
            hover:shadow-[0_20px_40px_rgba(34,197,94,0.55)]">

            <div className="text-6xl mb-6">♻</div>

            <h4 className="text-2xl font-bold mb-3">
                1. Lleva tus piezas
            </h4>

            <p className="opacity-80 text-lg">
                Recolecta botellas PET, latas o cartón y llévalos a los puntos de acopio de la universidad.
            </p>

            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white p-10 rounded-2xl shadow-md border-t-4 border-secondary text-center
            transform transition-all duration-300
            hover:scale-110 hover:-translate-y-3
            hover:shadow-[0_20px_40px_rgba(59,130,246,0.55)]">

            <div className="text-6xl mb-6">📝</div>

            <h4 className="text-2xl font-bold mb-3">
                2. Registra tu aporte
            </h4>

            <p className="opacity-80 text-lg">
                Acércate a un Operador Green Core. Él registrará la cantidad exacta de piezas a tu nombre en el sistema.
            </p>

            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white p-10 rounded-2xl shadow-md border-t-4 border-accent text-center
            transform transition-all duration-300
            hover:scale-110 hover:-translate-y-3
            hover:shadow-[0_20px_40px_rgba(249,115,22,0.55)]">

            <div className="text-6xl mb-6">🏆</div>

            <h4 className="text-2xl font-bold mb-3">
                3. Sube en el Ranking
            </h4>

            <p className="opacity-80 text-lg">
                Tus piezas se suman a tu historial personal, al de tu grupo y al de tu carrera para definir a los ganadores.
            </p>

            </div>

        </div>

    </section>

    );

}
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    
    <div className="min-h-screen bg-background font-sans text-textMain">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">Green Core</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login">
            <button className="px-5 py-2 text-primary font-bold hover:text-secondary transition-colors">
              Iniciar Sesión
            </button>
          </Link>
          <Link to="/registro">
            <button className="px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary hover:text-white shadow-md transition-all">
              Registrarse
            </button>
          </Link>
        </div>
      </nav>

      <main className="pt-24">
        <section className="bg-background py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-extrabold text-textMain mb-6 tracking-tight">
              Recicla, compite y haz tu <span className="text-primary">Universidad más verde</span>
            </h2>
            <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto">
              Green Core es el Sistema de Reciclaje Universitario. Registra tus aportes, revisa tus estadísticas y ayuda a tu carrera a liderar el ranking semanal.
            </p>
          </div>
        </section>

        {/* --- FEATURES (Tarjetas) --- */}
        <section className="py-20 px-8 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-primary">¿Cómo funciona Green Core?</h3>
            <p className="opacity-70 mt-4">Tres simples pasos para generar un gran impacto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Tarjeta 1 - Detalle verde */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-primary hover:shadow-md transition-shadow text-center">
              <div className="text-5xl mb-4"></div>
              <h4 className="text-xl font-bold mb-2">1. Lleva tus piezas</h4>
              <p className="opacity-80">
                Recolecta botellas PET, latas o cartón y llévalos a los puntos de acopio de la universidad.
              </p>
            </div>

            {/* Tarjeta 2 - Detalle azul */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-secondary hover:shadow-md transition-shadow text-center">
              <div className="text-5xl mb-4"></div>
              <h4 className="text-xl font-bold mb-2">2. Registra tu aporte</h4>
              <p className="opacity-80">
                Acércate a un Operador Green Core. Él registrará la cantidad exacta de piezas a tu nombre en el sistema.
              </p>
            </div>

            {/* Tarjeta 3 - Detalle naranja */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-accent hover:shadow-md transition-shadow text-center">
              <div className="text-5xl mb-4"></div>
              <h4 className="text-xl font-bold mb-2">3. Sube en el Ranking</h4>
              <p className="opacity-80">
                Tus piezas se suman a tu historial personal, al de tu grupo y al de tu carrera para definir a los ganadores.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-8 border-t border-gray-200 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="opacity-70 font-medium text-sm">
            © 2026 Proyecto Universitario - Green Core
          </p>
          <div className="mt-4 md:mt-0 space-x-6 text-sm">
            <a href="#" className="opacity-60 hover:text-primary transition-colors font-medium">Acerca de</a>
            <a href="#" className="opacity-60 hover:text-primary transition-colors font-medium">Privacidad</a>
            <a href="#" className="opacity-60 hover:text-primary transition-colors font-medium">Contacto</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
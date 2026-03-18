import ImpactoAmbiental from "./home/impacto_ambienal";
import TimelineReciclaje from "./home/timeline_reciclaje";
import Materiales from "./home/materiales";
import ComoFunciona from "./home/como_funciona";
import Simulador from "./home/simulador";
import Navbar from "../components/layout/Navbar";

export const Landing = () => {

  return (

    <div className="min-h-screen bg-background font-sans text-textMain">

      <Navbar />

      {/* --- VIDEO HERO --- */}
      <div className="w-full mt-28 overflow-hidden">
        <video
          src="/assets/img/VIDEOBANNER-GREENCORE.mp4"
          className="w-full h-auto object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <main className="pt-24">

        {/* --- BANNER AMARILLO --- */}
        <section className="bg-yellow-500 py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">

            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Recicla, compite y haz tu <span className="text-white">Universidad más verde</span>
            </h2>

            <p className="text-xl text-white opacity-80 mb-10 max-w-2xl mx-auto">
              Green Core es el Sistema de Reciclaje Universitario. Registra tus aportes,
              revisa tus estadísticas y ayuda a tu carrera a liderar el ranking semanal.
              Conoce el impacto ambiental en la tierra de estos residuos y ayuda a crear conciencia
              sobre la importancia del reciclaje.
            </p>

          </div>
        </section>

        {/* --- SECCIONES --- */}
        <ImpactoAmbiental />

        <TimelineReciclaje />

        <Materiales />

        <ComoFunciona />

        <Simulador />

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white py-16 px-8">

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Green Core
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Plataforma enfocada en fomentar el reciclaje dentro de la
              comunidad universitaria mediante tecnología, conciencia
              ambiental y participación colectiva.
            </p>
          </div>

          <div className="flex items-center gap-6 space-y-5" >
            <ul>
            <a href="/terminos" className="text-sm text-gray-500 hover:text-primary transition-colors font-medium">
              <li>Términos y Condiciones</li>
            </a>
            <a href="/privacidad" className="text-sm text-gray-500 hover:text-primary transition-colors font-medium">
              <li>Política de Privacidad</li>
            </a>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">
              Contacto
            </h4>

            <ul className="space-y-3 text-gray-400">
              <li>📍 Universidad / Campus</li>
              <li>📧 greencore@email.com</li>
              <li>🌎 Proyecto ambiental universitario</li>
            </ul>

          </div>

        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-sm opacity-70 font-medium">
            © 2026 Proyecto Universitario - Green Core
          </p>
        </div>

      </footer>

    </div>

  );
};
import { motion } from "framer-motion";
import ImpactoAmbiental from "./home/impacto_ambienal";
import TimelineReciclaje from "./home/timeline_reciclaje";
import Materiales from "./home/materiales";
import ComoFunciona from "./home/como_funciona";
import Simulador from "./home/simulador";
import Navbar from "../components/layout/Navbar";
import logo from "../assets/img/logo.jpeg";

export const Landing = () => {

  return (

    <div className="min-h-screen bg-background font-sans text-textMain">

      <Navbar />

      {/* --- HERO ANIMADO CON FRAMER MOTION --- */}
      <div className="w-full pt-32 pb-20 min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden bg-background">
        
        {/* Blobs de Fondo Brillantes (Framer Motion) */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 md:left-1/3 w-64 h-64 md:w-96 md:h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 pointer-events-none"
        />
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -50, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-1/4 md:right-1/3 w-64 h-64 md:w-96 md:h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 pointer-events-none"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-1/2 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 pointer-events-none"
        />

        {/* Contenedor del Logo Levitando (Sin Recortes, con Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="p-4 md:p-6 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(45,106,79,0.25)] rounded-3xl group"
          >
            <img 
              src={logo} 
              alt="Green Core Logo" 
              className="w-72 md:w-[32rem] h-auto object-contain rounded-2xl transform transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>
        </motion.div>

        {/* Texto Decorativo Animado */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-16 text-center z-10"
        >
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent font-extrabold tracking-widest uppercase text-xl md:text-3xl mb-4 drop-shadow-sm">
            Súmate a la Revolución Verde
          </p>
          <motion.div 
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full"
            style={{ width: "100px" }}
          />
        </motion.div>

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

          <div className="flex items-center gap-6 space-y-5 text-2x1" >
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
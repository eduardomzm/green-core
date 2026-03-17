import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  
  const [scrolled, setScrolled] = useState(false);
 
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`flex justify-between items-center py-4 px-6 md:py-6 md:px-10 bg-white/70 backdrop-blur-md fixed w-full top-0 z-50 transition-all ${scrolled ? 'shadow-md' : ''}`}>

  
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-primary">
          Green Core
        </h1>
      </div>

      
      <div className="lg:hidden flex items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-primary hover:text-secondary focus:outline-none p-2 transition-colors"
        >
          {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>

    
      <div className="hidden lg:flex gap-8 items-center font-semibold">
        <a href="#impacto" className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors">
          Impacto Ambiental
        </a>
        <a href="#timeline" className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors">
          Proceso
        </a>
        <a href="#materiales" className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors">
          Materiales
        </a>
        <a href="#funciona" className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors">
          Cómo funciona
        </a>
        <a href="#simulador" className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors">
          Simulador
        </a>

      
        <Link to="/login">
          <button className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors">
            Iniciar sesión
          </button>
        </Link>

       
        <Link to="/registro">
          <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-all">
            Registrarse
          </button>
        </Link>
      </div>


      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 lg:hidden flex flex-col items-center py-6 gap-2 animate-in slide-in-from-top-2">
          
          <a href="#impacto" onClick={() => setIsOpen(false)} className="w-full text-center py-3 text-primary font-bold hover:bg-green-50 transition-colors">
            Impacto Ambiental
          </a>
          <a href="#timeline" onClick={() => setIsOpen(false)} className="w-full text-center py-3 text-primary font-bold hover:bg-green-50 transition-colors">
            Proceso
          </a>
          <a href="#materiales" onClick={() => setIsOpen(false)} className="w-full text-center py-3 text-primary font-bold hover:bg-green-50 transition-colors">
            Materiales
          </a>
          <a href="#funciona" onClick={() => setIsOpen(false)} className="w-full text-center py-3 text-primary font-bold hover:bg-green-50 transition-colors">
            Cómo funciona
          </a>
          <a href="#simulador" onClick={() => setIsOpen(false)} className="w-full text-center py-3 text-primary font-bold hover:bg-green-50 transition-colors">
            Simulador
          </a>

          <div className="w-3/4 h-px bg-gray-200 my-4"></div>

          {/* Botones móviles */}
          <Link to="/login" onClick={() => setIsOpen(false)} className="w-3/4 mb-3">
            <button className="w-full py-3 text-primary font-bold border-2 border-primary/20 rounded-lg hover:bg-green-50 transition-colors">
              Iniciar sesión
            </button>
          </Link>
          <Link to="/registro" onClick={() => setIsOpen(false)} className="w-3/4">
            <button className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-all shadow-md">
              Registrarse
            </button>
          </Link>

        </div>
      )}

    </nav>
  );
}
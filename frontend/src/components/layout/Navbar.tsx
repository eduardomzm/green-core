import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    /*Scroll navbar*/
const [scrolled, setScrolled] = useState(false);

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
    <nav className="flex justify-between items-center py-6 px-10 bg-white/70 backdrop-blur-md fixed w-full top-0 z-50">

      {/* Logo */}
        <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-primary">
            Green Core
            </h1>
        </div>

        {/* Opciones */}
        <div className="flex gap-8 items-center font-semibold">

            <a
            href="#impacto"
            className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors"
            >
            Impacto Ambiental
            </a>

            <a
            href="#timeline"
            className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors"
            >
            Proceso
            </a>

            <a
            href="#materiales"
            className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors"
            >
            Materiales
            </a>

            <a
            href="#funciona"
            className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors"
            >
            Cómo funciona
            </a>

            <a
            href="#simulador"
            className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors"
            >
            Simulador
            </a>

            {/* Login */}
            <Link to="/login">
            <button className="px-6 py-3 text-primary font-bold hover:text-secondary transition-colors">
                Iniciar sesión
            </button>
            </Link>

            {/* Registro */}
            <Link to="/registro">
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-all">
                Registrarse
            </button>
            </Link>

        </div>

    </nav>
    );
}
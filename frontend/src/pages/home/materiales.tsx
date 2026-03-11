import botella from "../../assets/img/botella_animada.jpg";
import carton from "../../assets/img/carton_animada.jpg";
import lata from "../../assets/img/lata_animada.jpg";

export default function Materiales() {

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
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(249,115,22,0.5)]">

            <img
                src={botella}
                alt="Botellas reciclables"
                className="w-full h-64 object-cover transition-opacity duration-500 group-hover:opacity-30"
            />

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-6">

                <h3 className="text-2xl font-bold mb-2">
                Botellas
                </h3>

                <p>
                Las botellas PET pueden reciclarse y convertirse en nuevos envases o fibras textiles.
                </p>

            </div>

            </div>

            {/* Tarjeta Cartón */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(34,197,94,0.5)]">

            <img
                src={carton}
                alt="Cartón reciclable"
                className="w-full h-64 object-cover transition-opacity duration-500 group-hover:opacity-30"
            />

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-6">

                <h3 className="text-2xl font-bold mb-2">
                Cartón
                </h3>

                <p>
                El cartón puede reutilizarse para crear nuevos empaques y reducir la tala de árboles.
                </p>

            </div>

            </div>

            {/* Tarjeta Lata */}
            <div className="relative group overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(59,130,246,0.5)]">

            <img
                src={lata}
                alt="Latas reciclables"
                className="w-full h-64 object-cover transition-opacity duration-500 group-hover:opacity-30"
            />

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-6">

                <h3 className="text-2xl font-bold mb-2">
                Latas
                </h3>

                <p>
                El aluminio puede reciclarse infinitamente sin perder sus propiedades.
                </p>

            </div>

            </div>

        </div>

    </section>

    );
};
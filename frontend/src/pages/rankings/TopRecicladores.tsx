import { Trophy } from "lucide-react";

type Alumno = {
    alumno__first_name: string;
    alumno__username: string;
    total_piezas: number;
};

type Props = {
    alumnos: Alumno[];
};

export default function TopRecicladores({ alumnos }: Props) {

    const top3 = alumnos.slice(0, 3);

    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div className="grid md:grid-cols-3 gap-6">

            {top3.map((alumno, index) => {

                const name =
                    alumno.alumno__first_name || alumno.alumno__username;

                const isFirst = index === 0;

                return (

                    <div
                        key={index}
                        className={`
                            bg-white/70
                            backdrop-blur-lg
                            rounded-3xl
                            p-6
                            shadow-md
                            text-center
                            transition
                            hover:shadow-xl
                            ${isFirst ? "scale-105" : ""}
                        `}
                    >

                        {/* MEDALLA */}
                        <div className="text-3xl mb-3">
                            {medals[index]}
                        </div>

                        {/* ICONO */}
                        <div
                            className={`
                                mx-auto
                                w-14 h-14
                                flex items-center justify-center
                                rounded-full
                                mb-3
                                ${isFirst
                                    ? "bg-yellow-100 text-yellow-500"
                                    : "bg-gray-100 text-gray-500"}
                            `}
                        >
                            <Trophy size={26} />
                        </div>

                        {/* NOMBRE */}
                        <h3 className="font-semibold text-gray-800">
                            {name}
                        </h3>

                        {/* PIEZAS */}
                        <p className="text-sm text-gray-500 mt-1">
                            {alumno.total_piezas} piezas
                        </p>

                    </div>

                );

            })}

        </div>
    );
}
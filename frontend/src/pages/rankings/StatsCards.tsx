import { Box, Users, Building2, Recycle } from "lucide-react";

type Props = {
    totalPiezas: number;
    totalAlumnos: number;
    totalGrupos: number;
    materialTop: string;
};

export default function StatsCards({
    totalPiezas,
    totalAlumnos,
    totalGrupos,
    materialTop
}: Props) {

    const cards = [
        {
            title: "Piezas recicladas",
            value: totalPiezas,
            icon: <Recycle size={22} />,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Alumnos participantes",
            value: totalAlumnos,
            icon: <Users size={22} />,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Grupos activos",
            value: totalGrupos,
            icon: <Building2 size={22} />,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Material más reciclado",
            value: materialTop,
            icon: <Box size={22} />,
            color: "bg-orange-100 text-orange-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {cards.map((card, index) => (

                <div
                    key={index}
                    className="
          bg-white/70
          backdrop-blur-lg
          rounded-2xl
          p-5
          shadow-md
          hover:shadow-lg
          transition
          "
                >

                    <div className="flex items-center justify-between mb-3">

                        <div
                            className={`p-3 rounded-full ${card.color}`}
                        >
                            {card.icon}
                        </div>

                    </div>

                    <p className="text-sm text-gray-500 mb-1">
                        {card.title}
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">
                        {card.value}
                    </h2>

                </div>

            ))}

        </div>
    );
}
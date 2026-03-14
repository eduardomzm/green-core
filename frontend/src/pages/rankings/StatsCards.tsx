import { Recycle, Users, Building2, Box } from "lucide-react";

type Props = {
    totalPiezas: number
    totalAlumnos: number
    totalGrupos: number
    materialTop: string
}

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
            icon: <Recycle className="text-green-500 w-6 h-6" />
        },
        {
            title: "Alumnos participantes",
            value: totalAlumnos,
            icon: <Users className="text-blue-500 w-6 h-6" />
        },
        {
            title: "Grupos activos",
            value: totalGrupos,
            icon: <Building2 className="text-purple-500 w-6 h-6" />
        },
        {
            title: "Material más reciclado",
            value: materialTop,
            icon: <Box className="text-orange-500 w-6 h-6" />
        }
    ]

    return (
        <div className="grid md:grid-cols-4 gap-6 mb-8">

            {cards.map((card, index) => (

                <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                >

                    <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-500 text-sm">{card.title}</p>
                        {card.icon}
                    </div>

                    <h3 className="text-3xl font-bold text-gray-800">
                        {card.value}
                    </h3>

                </div>

            ))}

        </div>
    )
}

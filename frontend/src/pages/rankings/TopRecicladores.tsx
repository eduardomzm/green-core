type Alumno = {
    alumno__first_name: string
    total_piezas: number
}

type Props = {
    alumnos: Alumno[]
}

export default function TopRecicladores({ alumnos }: Props) {

    const top3 = alumnos.slice(0, 3)

    const medals = ["🥇", "🥈", "🥉"]

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm ">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
                Top 3 Recicladores
            </h2>

            <div className="space-y-4">

                {top3.map((alumno, index) => (

                    <div
                        key={index}
                        className="flex items-center justify-between bg-green-100 p-4 rounded-lg"
                    >

                        <div className="flex items-center gap-3">

                            <span className="text-2xl">
                                {medals[index]}
                            </span>

                            <span className="font-medium text-gray-700">
                                {alumno.alumno__first_name}
                            </span>

                        </div>

                        <span className="font-bold text-green-600">
                            {alumno.total_piezas} piezas
                        </span>

                    </div>

                ))}

            </div>

        </div>
    )
}

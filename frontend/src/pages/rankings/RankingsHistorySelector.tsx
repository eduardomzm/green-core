type Props = {
    mes: number
    setMes: (mes: number | null) => void
}

const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
]

export default function RankingHistorySelector({ mes, setMes }: Props) {

    return (

        <div className="bg-white p-4 rounded-xl shadow-sm">

            <p className="text-sm text-gray-500 mb-3">
                Historial mensual
            </p>

            <div className="flex gap-2 overflow-x-auto">

                {meses.map((nombre, index) => {

                    const numeroMes = index + 1
                    const activo = mes === numeroMes

                    return (

                        <button
                            key={numeroMes}
                            onClick={() => setMes(numeroMes)}
                            className={`px-4 py-2 rounded-lg text-sm transition-all
              
              ${activo
                                    ? "bg-green-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
              
              `}
                        >

                            {nombre}

                        </button>

                    )

                })}

                {/* botón para volver al ranking actual */}

                <button
                    onClick={() => setMes(null)}
                    className="px-4 py-2 rounded-lg text-sm bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                    Actual
                </button>

            </div>

        </div>

    )

}
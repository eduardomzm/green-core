type Props = {
    timeframe: "general" | "mensual"
    setTimeframe: (value: "general" | "mensual") => void
}

export default function TimeframeSelector({ timeframe, setTimeframe }: Props) {

    return (
        <div className="flex bg-gray-100 p-1 rounded-lg">

            <button
                onClick={() => setTimeframe("general")}
                className={`px-6 py-2 rounded-md ${timeframe === "general"
                        ? "bg-white text-green-600 shadow-sm"
                        : "text-gray-600"
                    }`}
            >
                General
            </button>

            <button
                onClick={() => setTimeframe("mensual")}
                className={`px-6 py-2 rounded-md ${timeframe === "mensual"
                        ? "bg-white text-green-600 shadow-sm"
                        : "text-gray-600"
                    }`}
            >
                Mensual
            </button>

        </div>
    );
}

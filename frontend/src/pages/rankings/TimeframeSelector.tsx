type Props = {
    timeframe: "general" | "semanal"
    setTimeframe: (value: "general" | "semanal") => void
}

export default function TimeframeSelector({ timeframe, setTimeframe }: Props) {

    return (
        <div className="flex bg-gray-100 p-1 rounded-lg">

            <button
                onClick={() => setTimeframe("general")}
                className={`px-6 py-2 rounded-md text-sm font-medium ${timeframe === "general"
                        ? "bg-white shadow-sm text-green-600"
                        : "text-gray-600"
                    }`}
            >
                General
            </button>

            <button
                onClick={() => setTimeframe("semanal")}
                className={`px-6 py-2 rounded-md text-sm font-medium ${timeframe === "semanal"
                        ? "bg-white shadow-sm text-green-600"
                        : "text-gray-600"
                    }`}
            >
                Semanal
            </button>

        </div>
    );
}

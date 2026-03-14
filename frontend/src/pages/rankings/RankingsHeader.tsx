import { Trophy, RefreshCw } from "lucide-react";

type Props = {
    lastUpdated: Date
}

export default function RankingsHeader({ lastUpdated }: Props) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Rankings de Reciclaje
            </h1>

            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <RefreshCw className="w-4 h-4" />
                Actualizado: {lastUpdated.toLocaleTimeString()}
            </p>
        </div>
    );
}

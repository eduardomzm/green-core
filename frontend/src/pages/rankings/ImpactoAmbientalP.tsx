import { TreePine, Droplets, Zap } from "lucide-react";

type Props = {
    totalPiezas: number
}

export default function ImpactoAmbiental({ totalPiezas }: Props) {

    const arboles = Math.floor(totalPiezas / 100)
    const agua = totalPiezas * 3
    const energia = totalPiezas * 2

    return (

        <div className="bg-white p-6 rounded-xl shadow-sm">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
                Impacto Ambiental
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="text-center">

                    <TreePine className="w-8 h-8 text-green-500 mx-auto mb-2" />

                    <p className="text-3xl font-bold text-green-600">
                        {arboles}
                    </p>

                    <p className="text-gray-500">
                        Árboles salvados
                    </p>

                </div>

                <div className="text-center">

                    <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />

                    <p className="text-3xl font-bold text-blue-600">
                        {agua}
                    </p>

                    <p className="text-gray-500">
                        Litros de agua ahorrados
                    </p>

                </div>

                <div className="text-center">

                    <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />

                    <p className="text-3xl font-bold text-yellow-600">
                        {energia}
                    </p>

                    <p className="text-gray-500">
                        kWh de energía ahorrados
                    </p>

                </div>

            </div>

        </div>

    )
}

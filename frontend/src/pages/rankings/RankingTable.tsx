import React from 'react';

type Alumno = {
    alumno__id?: number;
    alumno__username?: string;
    alumno__first_name?: string;
    alumno__primer_apellido?: string;
    total_piezas: number;
};

type Props = {
    alumnos: Alumno[];
};

export default function RankingTable({ alumnos }: Props) {
    if (!alumnos || alumnos.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-5 px-2 tracking-tight">
                Siguientes en el Ranking
            </h3>

            <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-green-100">
                <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-gray-100">
                        {alumnos.map((item, index) => {
                            const position = index + 4;
                            const name = item.alumno__first_name
                                ? `${item.alumno__first_name} ${item.alumno__primer_apellido || ''}`.trim()
                                : (item.alumno__username || 'Sin Nombre');

                            return (
                                <tr key={item.alumno__id || index} className="hover:bg-green-100 transition-colors group">
                                    <td className="py-5 px-4 sm:px-6 w-16 sm:w-20">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold text-lg mx-auto group-hover:bg-green-100 group-hover:text-green-700 transition-colors shadow-inner">
                                            {position}
                                        </div>
                                    </td>
                                    <td className="py-5 px-2 sm:px-4">
                                        <span className="text-gray-900 font-semibold text-lg">{name}</span>
                                    </td>
                                    <td className="py-5 px-4 sm:px-6 text-right">
                                        <span className="inline-block px-4 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-full font-bold text-base shadow-sm">
                                            {item.total_piezas} <span className="text-xs font-semibold uppercase opacity-70 ml-1">pz</span>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

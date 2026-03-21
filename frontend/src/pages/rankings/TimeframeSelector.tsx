import type { ChangeEvent } from "react";

type Props = {
    timeframe: "actual" | "mensual"
    setTimeframe: (value: "actual" | "mensual") => void
    selectedMonth?: string;
    setSelectedMonth?: (value: string) => void;
}

export default function TimeframeSelector({ timeframe, setTimeframe, selectedMonth, setSelectedMonth }: Props) {

    const now = new Date();
    // Maximum selectable month is the previous month
    now.setMonth(now.getMonth() - 1);
    const maxMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val > maxMonth) {
            alert("Solo puedes seleccionar meses que ya hayan transcurrido. Para ver el mes en curso, usa la opción 'Actual'.");
            return;
        }
        if (setSelectedMonth) setSelectedMonth(val);
    };

    return (
        <div className="flex flex-col items-stretch sm:items-end z-10 relative w-full sm:w-auto">
            {/* iOS Segmented Control */}
            <div className="flex w-full sm:w-auto bg-[#eef0f2] p-1 rounded-[10px] shadow-inner mb-2">
                <button
                    onClick={() => setTimeframe("actual")}
                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-1.5 rounded-[8px] text-[14px] font-semibold transition-all duration-200 ${timeframe === "actual"
                            ? "bg-green-600 text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Actual
                </button>
                <button
                    onClick={() => setTimeframe("mensual")}
                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-1.5 rounded-[8px] text-[14px] font-semibold transition-all duration-200 ${timeframe === "mensual"
                            ? "bg-green-600 text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Mensual
                </button>
            </div>

            {/* iOS Style Month Picker Card (Smooth Slide Down) */}
            <div
                className={`overflow-hidden w-full sm:w-auto transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] origin-top ${timeframe === "mensual" && selectedMonth !== undefined
                        ? "max-h-[100px] opacity-100 transform translate-y-0"
                        : "max-h-0 opacity-0 transform -translate-y-2 pointer-events-none"
                    }`}
            >
                <div className="flex items-center gap-3 bg-white w-full sm:w-auto rounded-[16px] p-2 pr-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100/80 transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] mt-1 mb-2 relative">
                    <div className="bg-[#e8f5e9] p-2.5 rounded-[12px] text-[#2e7d32] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] shrink-0">
                        <svg className="w-5 drop-shadow-sm h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            <rect x="8" y="11" width="3" height="3" className="fill-current stroke-none" />
                            <rect x="13" y="11" width="3" height="3" className="fill-current stroke-none" />
                        </svg>
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <span className="text-[10px] font-bold text-[#b0bec5] uppercase tracking-widest mb-[2px] truncate">
                            PERIODO ANTERIOR
                        </span>
                        <div className="relative">
                            <input
                                type="month"
                                value={selectedMonth || ""}
                                max={maxMonth}
                                onChange={handleMonthChange}
                                className="block w-full min-w-[150px] appearance-none bg-transparent text-gray-800 font-extrabold tracking-tight text-[16px] outline-none cursor-pointer p-0 m-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

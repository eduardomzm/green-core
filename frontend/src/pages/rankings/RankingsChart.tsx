import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

type Props = {
    chartData: { name: string; value: number }[];
};

export default function RankingsChart({ chartData }: Props) {

    return (
        <div className="h-[260px] w-full">

            <ResponsiveContainer width="100%" height="100%">

                <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
                >

                    {/* Gradientes estilo iOS */}
                    <defs>

                        <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>

                        <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>

                        <linearGradient id="bar3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>

                        <linearGradient id="bar4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb7185" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>

                    </defs>

                    {/* Grid muy suave */}
                    <CartesianGrid
                        stroke="#f3f4f6"
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    {/* Eje X estilo limpio */}
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        angle={-35}
                        textAnchor="end"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                    />

                    {/* Eje Y estilo limpio */}
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                    />

                    {/* Tooltip tipo tarjeta iOS */}
                    <Tooltip
                        formatter={(value) => [`${value} piezas`, "Total"]}
                        contentStyle={{
                            borderRadius: "14px",
                            border: "none",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(6px)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                        }}
                    />

                    <Bar
                        dataKey="value"
                        radius={[12, 12, 0, 0]}
                        barSize={80}
                        animationDuration={900}
                    >

                        {chartData.map((_, index) => {

                            const gradients = ["url(#bar1)", "url(#bar2)", "url(#bar3)", "url(#bar4)"];

                            return (
                                <Cell
                                    key={index}
                                    fill={gradients[index % gradients.length]}
                                />
                            );
                        })}

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}
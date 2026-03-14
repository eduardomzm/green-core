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

const COLORS = [
    "#0cbc4dff",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316"
];

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

                    {/* EFECTO NEÓN */}
                    <defs>
                        <filter id="neonGlow" height="200%" width="200%" x="-50%" y="-50%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* GRID SUAVE */}
                    <CartesianGrid
                        stroke="#e5e7eb"
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    {/* EJE X SIN BORDES */}
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        angle={-35}
                        textAnchor="end"
                        tick={{ fill: "#2a2a2aff", fontSize: 12 }}
                    />

                    {/* EJE Y SIN BORDES */}
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#2a2a2aff", fontSize: 12 }}
                    />

                    <Tooltip
                        formatter={(value) => [`${value} piezas`, "Total"]}
                        contentStyle={{
                            borderRadius: "10px",
                            border: "none",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
                        }}
                    />

                    <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                        barSize={120}
                        animationDuration={900}
                    >

                        {chartData.map((entry, index) => {
                            const isTop = index === 0;

                            return (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                    filter={isTop ? "url(#neonGlow)" : ""}
                                />
                            );
                        })}

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}

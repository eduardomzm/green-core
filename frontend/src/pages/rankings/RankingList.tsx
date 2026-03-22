import { Link } from "react-router-dom";

type RankingItem = {
    name: string;
    username?: string;
    value: number;
};

type Props = {
    data: RankingItem[];
    startIndex?: number;
};

export default function RankingList({ data, startIndex = 4 }: Props) {
    if (!data || data.length === 0) return null;

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-3 px-2 sm:px-0">
            {data.map((item, index) => {
                const position = startIndex + index;
                
                const innerContent = (
                    <>
                        <div className="flex items-center gap-3 sm:gap-6">
                            <span className="w-8 sm:w-12 text-center text-lg sm:text-xl font-black text-gray-400">
                                #{position}
                            </span>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase text-xs sm:text-sm">
                                {item.name.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-800 text-sm sm:text-lg">
                                {item.name}
                            </span>
                        </div>
                        <div className="font-black text-primary text-sm sm:text-lg bg-green-50 px-3 sm:px-4 py-1 sm:py-2 rounded-xl">
                            {item.value.toLocaleString()} <span className="text-[10px] sm:text-xs font-bold text-green-600/70 lowercase">pts</span>
                        </div>
                    </>
                );

                const baseClasses = "flex items-center justify-between p-3 sm:p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-in slide-in-from-bottom-4 fade-in duration-500";

                if (item.username) {
                    return (
                        <Link key={index} to={`/dashboard/perfil/${item.username}`} className={baseClasses}>
                            {innerContent}
                        </Link>
                    );
                }

                return (
                    <div key={index} className={baseClasses}>
                        {innerContent}
                    </div>
                );
            })}
        </div>
    );
}

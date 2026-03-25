import { Medal, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import UserAvatar from "../../components/common/UserAvatar";

type PodiumItem = {
    name: string;
    username?: string;
    avatar?: string;
    value: number;
};

type Props = {
    data: PodiumItem[];
};

export default function TopPodium({ data }: Props) {
    if (!data || data.length === 0) return null;

    // data array is [1st, 2nd, 3rd]
    const first = data[0];
    const second = data[1];
    const third = data[2];

    const renderPodiumPillar = (item: PodiumItem | undefined, position: number) => {
        if (!item) return <div className="flex-1"></div>;

        const isFirst = position === 1;
        const isSecond = position === 2;
        const isThird = position === 3;

        let heightClass = "h-48";
        let bgClass = "bg-yellow-100 border-yellow-300";
        let iconColor = "text-yellow-500";
        let MedalIcon = Crown;
        let shadowClass = "shadow-yellow-500/20";
        let animationDelay = "delay-200";

        if (isFirst) {
            heightClass = "h-64 z-10 -mt-8";
            bgClass = "bg-gradient-to-t from-yellow-200 to-yellow-50 border-yellow-400";
            iconColor = "text-yellow-500";
            MedalIcon = Crown;
            shadowClass = "shadow-yellow-500/40 shadow-2xl scale-105";
            animationDelay = "delay-100";
        } else if (isSecond) {
            heightClass = "h-52";
            bgClass = "bg-gradient-to-t from-gray-200 to-gray-50 border-gray-300";
            iconColor = "text-gray-500";
            MedalIcon = Medal;
            shadowClass = "shadow-gray-500/20 shadow-xl";
            animationDelay = "delay-300";
        } else if (isThird) {
            heightClass = "h-44";
            bgClass = "bg-gradient-to-t from-orange-200 to-orange-50 border-orange-300";
            iconColor = "text-orange-600";
            MedalIcon = Medal;
            shadowClass = "shadow-orange-500/20 shadow-lg";
            animationDelay = "delay-500";
        }

        const innerContent = (
            <div className="flex flex-col items-center justify-center p-2 sm:p-4 h-full w-full">
                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg mb-2 sm:mb-4 overflow-hidden bg-gray-50 flex-shrink-0`}>
                    <UserAvatar avatar={item.avatar} />
                    <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm ${iconColor}`}>
                        <MedalIcon className="w-4 h-4 sm:w-5 h-5" />
                    </div>
                </div>
                <h3 className="font-extrabold text-gray-800 text-center line-clamp-2 text-xs sm:text-base leading-tight max-w-[90%]">
                    {item.name}
                </h3>
                <p className={`mt-2 font-black text-sm sm:text-xl ${iconColor}`}>
                    {item.value.toLocaleString()} <span className="text-[10px] sm:text-xs font-bold text-gray-500 lowercase">pzs</span>
                </p>
                <div className={`mt-auto mb-2 text-4xl sm:text-6xl font-black ${iconColor} opacity-20 absolute bottom-0 sm:bottom-2`}>
                    {position}
                </div>
            </div>
        );

        return (
            <div className={`flex-1 flex flex-col justify-end animate-in Math.slide-in-from-bottom-8 fade-in duration-700 ${animationDelay}`}>
                <div className={`
                    relative w-full rounded-t-2xl sm:rounded-t-3xl border-t-4 border-l border-r flex justify-center pb-6 sm:pb-8 pt-2 sm:pt-4
                    ${heightClass} ${bgClass} ${shadowClass}
                    transition-transform hover:-translate-y-2 cursor-default
                `}>
                    {item.username ? (
                        <Link to={`/dashboard/perfil/${item.username}`} className="w-full h-full absolute inset-0 flex flex-col items-center">
                            {innerContent}
                        </Link>
                    ) : (
                        <div className="w-full h-full absolute inset-0 flex flex-col items-center">
                            {innerContent}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex items-end justify-center max-w-4xl mx-auto gap-2 sm:gap-6 px-2 mt-16 mb-12">
            {renderPodiumPillar(second, 2)}
            {renderPodiumPillar(first, 1)}
            {renderPodiumPillar(third, 3)}
        </div>
    );
}

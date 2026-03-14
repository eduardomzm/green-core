import React from "react";

type Props = {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    label: string
}

export default function FilterButton({ active, onClick, icon, label }: Props) {

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${active
                    ? "bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-2"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

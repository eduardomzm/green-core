interface HistoryCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
}

export const HistoryCard = ({ label, value, subtext, icon }: HistoryCardProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400">{icon}</div>
    </div>
    <p className="text-3xl font-black text-gray-900">{value}</p>
    <p className="mt-1 text-xs text-gray-400">{subtext}</p>
  </div>
);
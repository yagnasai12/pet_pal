import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';

interface StatBarProps {
  label: string;
  value: number;
  iconName: 'Apple' | 'Heart' | 'Zap';
  colorClass: string; // Tailind background color
  bgClass: string;
  iconColor: string;
}

export default function StatBar({ label, value, iconName, colorClass, bgClass, iconColor }: StatBarProps) {
  // Select matching Lucide icon
  const Icon = Lucide[iconName];

  // Map value to a friendly mood message
  const getStatusText = () => {
    if (value <= 20) return 'Needs attention! 🥺';
    if (value <= 50) return 'Okay...';
    if (value <= 80) return 'Good! ✨';
    return 'Super! 🥰';
  };

  return (
    <div className="flex flex-col w-full p-4 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm transition-all hover:scale-[1.01]" id={`stat-bar-${label.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl bg-white shadow-xs`}>
            <Icon size={16} className={iconColor} />
          </div>
          <span className="font-bold text-gray-600 text-xs tracking-tight uppercase">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 font-semibold">{getStatusText()}</span>
          <span className="font-black text-gray-800 text-xs font-mono">{Math.round(value)}%</span>
        </div>
      </div>

      {/* Main progress gutter bar */}
      <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden" id={`stat-gutter-${label.toLowerCase()}`}>
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          id={`stat-fill-${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}

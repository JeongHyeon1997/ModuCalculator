import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: LucideIcon;
    label: string;
}

export const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl font-bold transition-all duration-300 relative whitespace-nowrap ${
            active
                ? 'bg-white text-indigo-900 shadow-lg scale-105 z-10'
                : 'bg-white/5 text-indigo-200 hover:bg-white/10 hover:text-white'
        }`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
);

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
    title: string;
    icon: LucideIcon;
    subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, icon: Icon, subtitle }) => (
    <div className="mb-6">
        <div className="flex items-center space-x-2 text-white mb-1">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Icon size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>
        {subtitle && <p className="text-indigo-100 text-sm ml-1">{subtitle}</p>}
    </div>
);

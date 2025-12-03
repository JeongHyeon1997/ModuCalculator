import React from 'react';

interface ResultRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
    subValue?: string;
    isDeduction?: boolean;
}

export const ResultRow: React.FC<ResultRowProps> = ({
    label,
    value,
    isTotal = false,
    subValue,
    isDeduction = false
}) => (
    <div className={`flex justify-between items-end py-3 ${isTotal ? 'border-t border-white/20 mt-4 pt-4' : 'border-b border-white/5'}`}>
        <span className={`text-sm ${isTotal ? 'font-bold text-white' : 'text-indigo-100'}`}>{label}</span>
        <div className="text-right">
      <span className={`block ${
          isTotal
              ? 'text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-200'
              : isDeduction
                  ? 'text-lg font-medium text-pink-300'
                  : 'text-lg font-medium text-white'
      }`}>
        {isDeduction && value !== '0' ? '-' : ''} {value}
      </span>
            {subValue && <span className="text-xs text-indigo-300 block mt-1">{subValue}</span>}
        </div>
    </div>
);

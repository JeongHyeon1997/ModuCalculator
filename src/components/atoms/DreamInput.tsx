import React from 'react';
import { formatNumber, parseNumber } from '../../utils/formatters';

interface DreamInputProps {
    label: string;
    value: number | string;
    onChange: (value: number | string) => void;
    type?: 'text' | 'number_format';
    suffix?: string;
    placeholder?: string;
    readOnly?: boolean;
}

export const DreamInput: React.FC<DreamInputProps> = ({
    label,
    value,
    onChange,
    type = "text",
    suffix,
    placeholder,
    readOnly = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        if (type === 'number_format') {
            const num = parseNumber(rawValue);
            if (isNaN(num)) return;
            onChange(num);
        } else {
            onChange(rawValue);
        }
    };

    const displayValue = type === 'number_format' ? formatNumber(value as number) : value;

    return (
        <div className="mb-5 group">
            <label className="block text-sm font-medium text-indigo-100 mb-2 group-focus-within:text-white transition-colors">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className={`block w-full px-5 py-4 bg-black/20 border border-white/10 text-white rounded-2xl
            focus:ring-2 focus:ring-pink-400/50 focus:border-pink-300 focus:bg-black/30
            transition-all outline-none font-bold text-lg placeholder-white/30 text-right pr-12
            ${readOnly ? 'cursor-not-allowed opacity-70' : ''}`}
                    placeholder={placeholder}
                />
                {suffix && (
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                        <span className="text-indigo-200 text-sm font-medium">{suffix}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

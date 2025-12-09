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
}) => {
    // 숫자 길이에 따라 비율로 폰트 크기 계산
    const getValueFontSize = () => {
        const length = value.length;
        const baseSize = isTotal ? 28 : 16; // 기본 폰트 크기 (px)
        const threshold = 10; // 줄어들기 시작하는 기준 자릿수

        if (length <= threshold) {
            return `${baseSize}px`;
        }

        // 10자를 초과하면 비율로 줄어듦
        // 공식: baseSize * (threshold / length)
        const scaledSize = baseSize * (threshold / length);
        const minSize = isTotal ? 12 : 10; // 최소 폰트 크기

        return `${Math.max(scaledSize, minSize)}px`;
    };

    return (
        <div className={`flex justify-between items-end py-3 gap-2 ${isTotal ? 'border-t border-white/20 mt-4 pt-4' : 'border-b border-white/5'}`}>
            <span className={`text-sm flex-shrink-0 ${isTotal ? 'font-bold text-white' : 'text-indigo-100'}`}>{label}</span>
            <div className="text-right flex-shrink min-w-0 max-w-[65%] overflow-hidden">
                <span
                    className={`block break-words leading-tight ${
                        isTotal
                            ? 'font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-200'
                            : isDeduction
                                ? 'font-medium text-pink-300'
                                : 'font-medium text-white'
                    }`}
                    style={{ fontSize: getValueFontSize() }}
                >
                    {isDeduction && value !== '0' ? '-' : ''} {value}
                </span>
                {subValue && <span className="text-xs text-indigo-300 block mt-1">{subValue}</span>}
            </div>
        </div>
    );
};

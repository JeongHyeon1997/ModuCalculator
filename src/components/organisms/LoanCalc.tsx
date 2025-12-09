import React, { useState, useRef } from 'react';
import { Building2, Download, TrendingUp } from 'lucide-react';
import { GlassCard } from '../atoms/GlassCard';
import { DreamInput } from '../atoms/DreamInput';
import { SectionTitle } from '../molecules/SectionTitle';
import { ResultRow } from '../molecules/ResultRow';
import { formatNumber } from '../../utils/formatters';
import { downloadAsImage } from '../../utils/fileDownload';

export const LoanCalc: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [amount, setAmount] = useState(50000000);
    const [rate, setRate] = useState(5.5);
    const [period, setPeriod] = useState(24);

    const calculate = () => {
        const r = (rate / 100) / 12;
        let monthlyPayment = 0;
        if (r === 0) monthlyPayment = amount / period;
        else monthlyPayment = (amount * r * Math.pow(1 + r, period)) / (Math.pow(1 + r, period) - 1);

        const totalPayment = monthlyPayment * period;
        const totalInterest = totalPayment - amount;
        return { monthlyPayment, totalPayment, totalInterest };
    };

    const { monthlyPayment, totalPayment, totalInterest } = calculate();

    // 숫자 길이에 따라 비율로 폰트 크기 계산
    const getMonthlyPaymentFontSize = () => {
        const text = `${formatNumber(monthlyPayment)}원`;
        const length = text.length;
        const baseSize = 36; // 기본 폰트 크기
        const threshold = 10; // 줄어들기 시작하는 기준 자릿수

        if (length <= threshold) {
            return `${baseSize}px`;
        }

        // 10자를 초과하면 비율로 줄어듦
        const scaledSize = baseSize * (threshold / length);
        const minSize = 14; // 최소 폰트 크기

        return `${Math.max(scaledSize, minSize)}px`;
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        await downloadAsImage(cardRef.current, '대출계산_결과.png');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <SectionTitle title="든든한 지원금 계산" icon={Building2} subtitle="현명한 대출 관리가 부자의 첫걸음입니다." />
                <DreamInput label="필요한 자금" value={amount} onChange={setAmount as (value: number | string) => void} type="number_format" suffix="원" />
                <div className="flex gap-4">
                    <div className="flex-1">
                        <DreamInput label="연 이자율" value={rate} onChange={setRate as (value: number | string) => void} type="number_format" suffix="%" />
                    </div>
                    <div className="flex-1">
                        <DreamInput label="상환 기간" value={period} onChange={setPeriod as (value: number | string) => void} type="number_format" suffix="개월" />
                    </div>
                </div>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm rounded-2xl flex items-start">
                    <TrendingUp size={16} className="mr-2 mt-1 flex-shrink-0" />
                    <span>매달 원금과 이자를 똑같이 나누어 내는 <strong>원리금균등상환</strong> 방식입니다.</span>
                </div>
            </div>

            <div className="flex flex-col h-full">
                <GlassCard ref={cardRef} className="p-8 flex-1 flex flex-col justify-center bg-white/5">
                    <div className="text-center mb-8">
                        <span className="text-indigo-200 text-sm font-medium mb-2 block">매월 준비해야 할 금액</span>
                        <div
                            className="font-black text-white drop-shadow-lg"
                            style={{ fontSize: getMonthlyPaymentFontSize() }}
                        >
                            {formatNumber(monthlyPayment)}원
                        </div>
                    </div>

                    <div className="space-y-2 pt-6 border-t border-white/10">
                        <ResultRow label="빌린 원금" value={`${formatNumber(amount)}원`} />
                        <ResultRow label="총 이자 비용" value={`+ ${formatNumber(totalInterest)}원`} />
                        <ResultRow label="총 상환할 금액" value={`${formatNumber(totalPayment)}원`} isTotal />
                    </div>

                    <button
                        onClick={handleDownload}
                        className="mt-8 w-full py-4 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center"
                    >
                        <Download size={20} className="mr-2" />
                        상환 계획 저장
                    </button>
                </GlassCard>
            </div>
        </div>
    );
};

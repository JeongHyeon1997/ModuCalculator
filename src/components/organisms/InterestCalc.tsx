import React, { useState } from 'react';
import { PiggyBank, Download } from 'lucide-react';
import { GlassCard } from '../atoms/GlassCard';
import { DreamInput } from '../atoms/DreamInput';
import { SectionTitle } from '../molecules/SectionTitle';
import { formatNumber } from '../../utils/formatters';
import { downloadFile } from '../../utils/fileDownload';

export const InterestCalc: React.FC = () => {
    const [principal, setPrincipal] = useState(10000000);
    const [rate, setRate] = useState(3.5);
    const [months, setMonths] = useState(12);
    const [type, setType] = useState<'simple' | 'compound'>('simple');

    const calculate = () => {
        let interest = 0;
        const r = rate / 100;
        const t = months / 12;

        if (type === 'simple') interest = principal * r * t;
        else interest = principal * Math.pow((1 + r/12), months) - principal;

        const tax = interest * 0.154;
        const total = principal + (interest - tax);
        return { interest, tax, total };
    };

    const { interest, tax, total } = calculate();

    // 숫자 길이에 따라 비율로 폰트 크기 계산
    const getTotalFontSize = () => {
        const text = `${formatNumber(total)}원`;
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

    const handleDownload = () => {
        const content = `[꿈의 저축 - 이자 계산]\n\n목표 금액: ${formatNumber(principal)}원\n기간: ${months}개월 (${type === 'simple' ? '단리' : '월복리'}, ${rate}%)\n\n★ 만기 수령액: ${formatNumber(total)}원`;
        downloadFile(content, 'dream_savings.txt');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <SectionTitle title="미래 자산 설계" icon={PiggyBank} subtitle="꾸준한 저축이 만드는 마법같은 변화" />
                <DreamInput label="목표 예치금" value={principal} onChange={setPrincipal as (value: number | string) => void} type="number_format" suffix="원" />
                <div className="flex gap-4">
                    <div className="flex-1">
                        <DreamInput label="연 이자율" value={rate} onChange={setRate as (value: number | string) => void} type="number_format" suffix="%" />
                    </div>
                    <div className="flex-1">
                        <DreamInput label="기간" value={months} onChange={setMonths as (value: number | string) => void} type="number_format" suffix="개월" />
                    </div>
                </div>
                <div className="mt-4 p-1 bg-black/20 rounded-2xl flex border border-white/10">
                    {['simple', 'compound'].map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t as 'simple' | 'compound')}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                                type === t
                                    ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg'
                                    : 'text-indigo-200 hover:text-white'
                            }`}
                        >
                            {t === 'simple' ? '단리 (기본)' : '월복리 (마법)'}
                        </button>
                    ))}
                </div>
            </div>

            <GlassCard className="p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm z-0"></div>
                <div className="relative z-10">
                    <h4 className="text-indigo-100 font-medium mb-2">만기 시 나의 자산</h4>
                    <div
                        className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200 mb-8"
                        style={{ fontSize: getTotalFontSize() }}
                    >
                        {formatNumber(total)}원
                    </div>

                    <div className="space-y-4 bg-black/20 rounded-2xl p-6 border border-white/5">
                        <div className="flex justify-between text-sm">
                            <span className="text-indigo-200">내가 넣은 돈</span>
                            <span className="font-bold text-white">{formatNumber(principal)}원</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-indigo-200">불어난 이자 (세후)</span>
                            <span className="font-bold text-pink-300">+{formatNumber(interest - tax)}원</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className="mt-8 relative z-10 w-full py-4 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center"
                >
                    <Download size={20} className="mr-2" />
                    저축 계획 저장
                </button>
            </GlassCard>
        </div>
    );
};

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRightLeft, Download } from 'lucide-react';
import { GlassCard } from '../atoms/GlassCard';
import { DreamInput } from '../atoms/DreamInput';
import { SectionTitle } from '../molecules/SectionTitle';
import { formatNumber } from '../../utils/formatters';
import { downloadAsImage } from '../../utils/fileDownload';

interface RateInfo {
    rate: number;
    symbol: string;
    name: string;
}

interface Rates {
    [key: string]: RateInfo;
}

export const ExchangeRateCalc: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [baseAmount, setBaseAmount] = useState(1000);
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [rates, setRates] = useState<Rates | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState('');

    // 숫자 길이에 따라 비율로 폰트 크기 계산
    const getResultFontSize = (value: number) => {
        const formattedLength = formatNumber(value).length;
        const baseSize = 40; // 기본 폰트 크기 (px)
        const threshold = 10; // 줄어들기 시작하는 기준 자릿수

        if (formattedLength <= threshold) {
            return `${baseSize}px`;
        }

        // 10자를 초과하면 비율로 줄어듦
        const scaledSize = baseSize * (threshold / formattedLength);
        const minSize = 16; // 최소 폰트 크기

        return `${Math.max(scaledSize, minSize)}px`;
    };

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/KRW');
                const data = await response.json();
                const filteredRates: Rates = {
                    USD: { rate: 1 / data.rates.USD, symbol: '$', name: '미국 달러' },
                    JPY: { rate: (1 / data.rates.JPY) * 100, symbol: '¥', name: '일본 엔 (100엔)' },
                    EUR: { rate: 1 / data.rates.EUR, symbol: '€', name: '유럽 연합 유로' },
                    CNY: { rate: 1 / data.rates.CNY, symbol: '¥', name: '중국 위안' },
                };
                setRates(filteredRates);
                setLastUpdated(new Date(data.time_last_update_utc).toLocaleDateString());
                setLoading(false);
            } catch (error) {
                setRates({
                    USD: { rate: 1405.50, symbol: '$', name: '미국 달러 (오프라인)' },
                    JPY: { rate: 935.20, symbol: '¥', name: '일본 엔 (100엔)' },
                    EUR: { rate: 1490.10, symbol: '€', name: '유로' },
                    CNY: { rate: 192.30, symbol: '¥', name: '위안' },
                });
                setLoading(false);
            }
        };
        fetchRates();
    }, []);

    const calculate = () => {
        if (!rates) return 0;
        const rateInfo = rates[targetCurrency];
        if (targetCurrency === 'JPY') return (baseAmount / rateInfo.rate) * 100;
        return baseAmount / rateInfo.rate;
    };

    const result = calculate();

    const handleDownload = async () => {
        if (!cardRef.current) return;
        await downloadAsImage(cardRef.current, '환율계산_결과.png');
    };

    if (loading) return <div className="text-white text-center py-20 animate-pulse">꿈의 환율을 불러오는 중...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <SectionTitle title="여행 자금 계산" icon={Sparkles} subtitle="세계로 뻗어갈 당신의 꿈을 응원합니다." />
                <DreamInput
                    label="환전할 금액 (KRW)"
                    value={baseAmount}
                    onChange={setBaseAmount as (value: number | string) => void}
                    type="number_format"
                    suffix="원"
                    placeholder="예: 1,000,000"
                />
                <div className="mb-6">
                    <label className="block text-sm font-medium text-indigo-100 mb-3">어디로 떠나시나요?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {rates && Object.entries(rates).map(([key, info]) => (
                            <button
                                key={key}
                                onClick={() => setTargetCurrency(key)}
                                className={`px-3 py-4 rounded-2xl border backdrop-blur-md transition-all duration-300 relative overflow-hidden group ${
                                    targetCurrency === key
                                        ? 'bg-gradient-to-tr from-pink-500 to-indigo-500 border-transparent text-white shadow-lg scale-105'
                                        : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10 hover:border-white/30'
                                }`}
                            >
                                <div className="text-xs opacity-70 mb-1">{key}</div>
                                <div className="text-xl font-bold">{info.symbol}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <GlassCard ref={cardRef} className="p-8 flex flex-col justify-between bg-gradient-to-b from-white/10 to-transparent">
                <div>
                    <h4 className="text-indigo-200 font-medium mb-4 flex items-center justify-between">
                        <span className="flex items-center"><ArrowRightLeft size={16} className="mr-2" /> 예상 환전 금액</span>
                        <span className="text-xs px-2 py-1 bg-black/20 rounded-full">{lastUpdated} 기준</span>
                    </h4>
                    <div className="font-black text-white mb-2 tracking-tighter flex items-baseline flex-wrap break-words">
                        <span className="opacity-50 mr-2" style={{ fontSize: `${parseInt(getResultFontSize(result)) * 0.5}px` }}>
                            {rates && rates[targetCurrency].symbol}
                        </span>
                        <span style={{ fontSize: getResultFontSize(result) }}>
                            {formatNumber(result)}
                        </span>
                    </div>
                    <p className="text-indigo-200 text-sm mt-4 bg-black/20 inline-block px-3 py-1 rounded-lg">
                        적용 환율: {rates && formatNumber(rates[targetCurrency].rate)}원 = {targetCurrency === 'JPY' ? '100' : '1'} {rates && rates[targetCurrency].symbol}
                    </p>
                </div>
                <button
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 shadow-lg shadow-black/20 transition-all flex items-center justify-center group"
                >
                    <Download size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                    계산 결과 담아가기
                </button>
            </GlassCard>
        </div>
    );
};

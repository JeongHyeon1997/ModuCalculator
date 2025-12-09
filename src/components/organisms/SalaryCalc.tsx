import React, { useState, useRef } from 'react';
import { Wallet, Download, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '../atoms/GlassCard';
import { DreamInput } from '../atoms/DreamInput';
import { SectionTitle } from '../molecules/SectionTitle';
import { ResultRow } from '../molecules/ResultRow';
import { formatNumber } from '../../utils/formatters';
import { downloadAsImage } from '../../utils/fileDownload';

export const SalaryCalc: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<'hourly' | 'salary'>('hourly');

    // 알바 모드 State
    const [hourlyWage, setHourlyWage] = useState(10030);
    const [hoursPerDay, setHoursPerDay] = useState(8);
    const [daysPerWeek, setDaysPerWeek] = useState(5);
    const [hasHolidayPay, setHasHolidayPay] = useState(true);
    const [albaTaxRate, setAlbaTaxRate] = useState(3.3);

    // 직장인 모드 State
    const [salaryType, setSalaryType] = useState<'year' | 'month'>('year');
    const [salaryAmount, setSalaryAmount] = useState(40000000);
    const [nonTaxable, setNonTaxable] = useState({
        meal: 200000,
        car: 0,
        childcare: 0,
        research: 0
    });
    const [dependents, setDependents] = useState(1);
    const [children, setChildren] = useState(0);
    const [showNonTaxable, setShowNonTaxable] = useState(false);

    // 알바 계산 로직
    const calculateAlba = () => {
        const WEEKS_PER_MONTH = 4.345;
        const weeklyHours = hoursPerDay * daysPerWeek;
        let holidayPayPerWeek = 0;

        if (hasHolidayPay && weeklyHours >= 15) {
            const holidayHours = weeklyHours >= 40 ? 8 : (weeklyHours / 40) * 8;
            holidayPayPerWeek = holidayHours * hourlyWage;
        }

        const weeklyBasePay = weeklyHours * hourlyWage;
        const monthlyBasePay = weeklyBasePay * WEEKS_PER_MONTH;
        const monthlyHolidayPay = holidayPayPerWeek * WEEKS_PER_MONTH;

        const totalGross = monthlyBasePay + monthlyHolidayPay;
        const taxAmount = totalGross * (albaTaxRate / 100);
        const totalNet = totalGross - taxAmount;

        return { totalGross, totalNet, taxAmount, monthlyHolidayPay };
    };

    // 직장인 4대보험 및 소득세 계산 로직 (약식)
    const calculateSalary = () => {
        let monthlyGross = salaryType === 'year' ? salaryAmount / 12 : salaryAmount;
        const totalNonTaxable = nonTaxable.meal + nonTaxable.car + nonTaxable.childcare + nonTaxable.research;
        const taxableIncome = Math.max(0, monthlyGross - totalNonTaxable);

        const pension = Math.floor(Math.min(taxableIncome, 5900000) * 0.045 / 10) * 10;
        const health = Math.floor(taxableIncome * 0.03545 / 10) * 10;
        const care = Math.floor(health * 0.1295 / 10) * 10;
        const employment = Math.floor(taxableIncome * 0.009 / 10) * 10;

        const deductionFactor = (dependents - 1 + children) * 150000;
        const incomeBase = Math.max(0, taxableIncome - 1000000 - deductionFactor);

        let incomeTax = 0;
        if (incomeBase <= 1160000) incomeTax = incomeBase * 0.06;
        else if (incomeBase <= 3800000) incomeTax = 70000 + (incomeBase - 1160000) * 0.15;
        else if (incomeBase <= 7300000) incomeTax = 470000 + (incomeBase - 3800000) * 0.24;
        else incomeTax = 1300000 + (incomeBase - 7300000) * 0.35;

        incomeTax = Math.max(0, Math.floor(incomeTax / 10) * 10);
        const localTax = Math.floor(incomeTax * 0.1 / 10) * 10;

        const totalDeductions = pension + health + care + employment + incomeTax + localTax;
        const netPay = monthlyGross - totalDeductions;

        return {
            monthlyGross,
            totalNonTaxable,
            taxableIncome,
            pension,
            health,
            care,
            employment,
            incomeTax,
            localTax,
            totalDeductions,
            netPay
        };
    };

    const albaResult = calculateAlba();
    const salaryResult = calculateSalary();

    const handleDownload = async () => {
        if (!cardRef.current) return;
        const fileName = mode === 'hourly' ? '알바급여_결과.png' : '급여명세서_결과.png';
        await downloadAsImage(cardRef.current, fileName);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <SectionTitle title="급여 계산기" icon={Wallet} subtitle="2025년 기준 세법 및 요율 적용" />

                <div className="flex bg-black/20 p-1 rounded-2xl mb-6">
                    <button
                        onClick={() => setMode('hourly')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'hourly' ? 'bg-white text-indigo-900 shadow-md' : 'text-indigo-200'}`}
                    >
                        알바 (시급)
                    </button>
                    <button
                        onClick={() => setMode('salary')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'salary' ? 'bg-white text-indigo-900 shadow-md' : 'text-indigo-200'}`}
                    >
                        직장인 (급여)
                    </button>
                </div>

                {mode === 'hourly' ? (
                    <>
                        <DreamInput label="시급" value={hourlyWage} onChange={setHourlyWage as (value: number | string) => void} type="number_format" suffix="원" />
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <DreamInput label="일 근무시간" value={hoursPerDay} onChange={setHoursPerDay as (value: number | string) => void} type="number_format" suffix="시간" />
                            </div>
                            <div className="flex-1">
                                <DreamInput label="주 근무일수" value={daysPerWeek} onChange={setDaysPerWeek as (value: number | string) => void} type="number_format" suffix="일" />
                            </div>
                        </div>
                        <div className="space-y-4 mt-2">
                            <label className="flex items-center space-x-3 cursor-pointer p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${hasHolidayPay ? 'bg-pink-500 border-pink-500' : 'border-indigo-300'}`}>
                                    {hasHolidayPay && <Sparkles size={14} className="text-white" />}
                                </div>
                                <input type="checkbox" checked={hasHolidayPay} onChange={(e) => setHasHolidayPay(e.target.checked)} className="hidden" />
                                <span className="text-indigo-100 font-medium">주휴수당 포함 (주 15시간 이상)</span>
                            </label>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <label className="block text-sm font-medium text-indigo-100 mb-3">세금 적용</label>
                                <div className="flex gap-2">
                                    {[0, 3.3, 9.4].map((rate) => (
                                        <button
                                            key={rate}
                                            onClick={() => setAlbaTaxRate(rate)}
                                            className={`flex-1 py-2 text-sm rounded-xl font-medium transition-all ${albaTaxRate === rate ? 'bg-pink-500 text-white' : 'bg-black/20 text-indigo-200'}`}
                                        >
                                            {rate === 0 ? '미적용' : `${rate}%`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-2 mb-4">
                            <button onClick={() => setSalaryType('year')} className={`px-4 py-2 rounded-xl text-sm font-bold ${salaryType === 'year' ? 'bg-pink-500 text-white' : 'bg-white/10 text-indigo-200'}`}>연봉</button>
                            <button onClick={() => setSalaryType('month')} className={`px-4 py-2 rounded-xl text-sm font-bold ${salaryType === 'month' ? 'bg-pink-500 text-white' : 'bg-white/10 text-indigo-200'}`}>월급</button>
                        </div>
                        <DreamInput
                            label={salaryType === 'year' ? '연봉 금액' : '월급 금액'}
                            value={salaryAmount}
                            onChange={setSalaryAmount as (value: number | string) => void}
                            type="number_format"
                            suffix="원"
                        />

                        <div className="mb-4 border border-white/10 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => setShowNonTaxable(!showNonTaxable)}
                                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors text-indigo-100 font-medium"
                            >
                                <span>비과세 소득 설정 (식대 등)</span>
                                {showNonTaxable ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {showNonTaxable && (
                                <div className="p-4 bg-black/10 space-y-3">
                                    <DreamInput label="식대 (월 20만원 한도)" value={nonTaxable.meal} onChange={(v) => setNonTaxable({...nonTaxable, meal: v as number})} type="number_format" suffix="원" />
                                    <DreamInput label="자가운전보조금 (월 20만원)" value={nonTaxable.car} onChange={(v) => setNonTaxable({...nonTaxable, car: v as number})} type="number_format" suffix="원" />
                                    <DreamInput label="출산보육수당 (월 20만원)" value={nonTaxable.childcare} onChange={(v) => setNonTaxable({...nonTaxable, childcare: v as number})} type="number_format" suffix="원" />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <DreamInput label="본인포함 부양가족" value={dependents} onChange={setDependents as (value: number | string) => void} type="number_format" suffix="명" />
                            </div>
                            <div className="flex-1">
                                <DreamInput label="20세이하 자녀수" value={children} onChange={setChildren as (value: number | string) => void} type="number_format" suffix="명" />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col h-full">
                <GlassCard ref={cardRef} className="p-8 flex-1 flex flex-col relative overflow-hidden group">
                    {mode === 'hourly' ? (
                        <>
                            <h4 className="text-lg font-bold text-white mb-6">알바비 예상 수령액</h4>
                            <div className="flex-1 space-y-2">
                                <ResultRow label="기본 급여" value={`${formatNumber(albaResult.totalGross - albaResult.monthlyHolidayPay)}원`} />
                                <ResultRow label="주휴 수당" value={`+ ${formatNumber(albaResult.monthlyHolidayPay)}원`} />
                                <ResultRow label="세금 공제" value={`- ${formatNumber(albaResult.taxAmount)}원`} isDeduction />
                                <ResultRow label="최종 수령액" value={`${formatNumber(albaResult.totalNet)}원`} isTotal />
                            </div>
                        </>
                    ) : (
                        <>
                            <h4 className="text-lg font-bold text-white mb-4">급여 상세 명세서</h4>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                                <div className="pb-4 border-b border-white/10 mb-4">
                                    <ResultRow label="월 예상 세전 실수령액" value={`${formatNumber(salaryResult.monthlyGross)}원`} />
                                    <ResultRow label="비과세 소득 합계" value={`${formatNumber(salaryResult.totalNonTaxable)}원`} subValue="식대, 차량유지비 등" />
                                </div>

                                <h5 className="text-sm text-indigo-300 mb-2 font-bold">4대보험 상세</h5>
                                <ResultRow label="국민연금 (4.5%)" value={`${formatNumber(salaryResult.pension)}원`} isDeduction />
                                <ResultRow label="건강보험 (3.545%)" value={`${formatNumber(salaryResult.health)}원`} isDeduction />
                                <ResultRow label="장기요양 (건보료의 12.95%)" value={`${formatNumber(salaryResult.care)}원`} isDeduction />
                                <ResultRow label="고용보험 (0.9%)" value={`${formatNumber(salaryResult.employment)}원`} isDeduction />

                                <h5 className="text-sm text-indigo-300 mt-4 mb-2 font-bold">세금 (간이세액표 적용)</h5>
                                <ResultRow label="소득세 (부양가족 반영)" value={`${formatNumber(salaryResult.incomeTax)}원`} isDeduction />
                                <ResultRow label="지방소득세 (소득세의 10%)" value={`${formatNumber(salaryResult.localTax)}원`} isDeduction />

                                <ResultRow label="월 예상 실수령액" value={`${formatNumber(salaryResult.netPay)}원`} isTotal />
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleDownload}
                        className="mt-6 w-full py-4 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 shadow-lg transition-all flex items-center justify-center z-10"
                    >
                        <Download size={20} className="mr-2" />
                        상세 명세서 저장
                    </button>
                </GlassCard>
            </div>
        </div>
    );
};

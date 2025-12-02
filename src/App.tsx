import React, { useState, useEffect } from 'react';
import {
    Calculator,
    Coins,
    Clock,
    PiggyBank,
    Building2,
    Download,
    RefreshCcw,
    Sparkles,
    ArrowRightLeft,
    TrendingUp,
    CreditCard,
    Wallet,
    Users,
    Briefcase,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

/**
 * 유틸리티: 숫자 포맷팅 (콤마 추가)
 */
const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat('ko-KR').format(Math.floor(num));
};

/**
 * 유틸리티: 콤마 제거 후 숫자로 변환
 */
const parseNumber = (str) => {
    if (!str) return 0;
    return Number(str.toString().replace(/,/g, ''));
};

/**
 * 디자인 컴포넌트: Glassmorphism 스타일
 */
const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl overflow-hidden ${className}`}>
        {children}
    </div>
);

const SectionTitle = ({ title, icon: Icon, subtitle }) => (
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

const DreamInput = ({ label, value, onChange, type = "text", suffix, placeholder, readOnly = false }) => {
    const handleChange = (e) => {
        const rawValue = e.target.value;
        if (type === 'number_format') {
            const num = parseNumber(rawValue);
            if (isNaN(num)) return;
            onChange(num);
        } else {
            onChange(rawValue);
        }
    };

    const displayValue = type === 'number_format' ? formatNumber(value) : value;

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

const ResultRow = ({ label, value, isTotal = false, subValue, isDeduction = false }) => (
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

/**
 * 1. 환율 계산기
 */
const ExchangeRateCalc = () => {
    const [baseAmount, setBaseAmount] = useState(1000);
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/KRW');
                const data = await response.json();
                const filteredRates = {
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

    const handleDownload = () => {
        if (!rates) return;
        const content = `[꿈을 위한 여행 자금 - 환율 계산]\n\n날짜: ${new Date().toLocaleDateString()}\n원화 금액: ${formatNumber(baseAmount)}원\n대상 통화: ${targetCurrency} (${rates[targetCurrency].name})\n적용 환율: ${formatNumber(rates[targetCurrency].rate)}원\n\n★ 환전 예상 금액: ${rates[targetCurrency].symbol} ${formatNumber(result)}`;
        downloadFile(content, 'dream_trip_exchange.txt');
    };

    if (loading) return <div className="text-white text-center py-20 animate-pulse">꿈의 환율을 불러오는 중...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <SectionTitle title="여행 자금 계산" icon={Sparkles} subtitle="세계로 뻗어갈 당신의 꿈을 응원합니다." />
                <DreamInput
                    label="환전할 금액 (KRW)"
                    value={baseAmount}
                    onChange={setBaseAmount}
                    type="number_format"
                    suffix="원"
                    placeholder="예: 1,000,000"
                />
                <div className="mb-6">
                    <label className="block text-sm font-medium text-indigo-100 mb-3">어디로 떠나시나요?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(rates).map(([key, info]) => (
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

            <GlassCard className="p-8 flex flex-col justify-between bg-gradient-to-b from-white/10 to-transparent">
                <div>
                    <h4 className="text-indigo-200 font-medium mb-4 flex items-center justify-between">
                        <span className="flex items-center"><ArrowRightLeft size={16} className="mr-2" /> 예상 환전 금액</span>
                        <span className="text-xs px-2 py-1 bg-black/20 rounded-full">{lastUpdated} 기준</span>
                    </h4>
                    <div className="text-5xl sm:text-6xl font-black text-white mb-2 tracking-tighter">
                        <span className="text-3xl opacity-50 mr-2">{rates[targetCurrency].symbol}</span>
                        {formatNumber(result)}
                    </div>
                    <p className="text-indigo-200 text-sm mt-4 bg-black/20 inline-block px-3 py-1 rounded-lg">
                        적용 환율: {formatNumber(rates[targetCurrency].rate)}원 = {targetCurrency === 'JPY' ? '100' : '1'} {rates[targetCurrency].symbol}
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

/**
 * 2. 알바/급여 계산기 (고도화)
 */
const SalaryCalc = () => {
    const [mode, setMode] = useState('hourly'); // 'hourly' | 'salary'

    // 알바 모드 State
    const [hourlyWage, setHourlyWage] = useState(10030);
    const [hoursPerDay, setHoursPerDay] = useState(8);
    const [daysPerWeek, setDaysPerWeek] = useState(5);
    const [hasHolidayPay, setHasHolidayPay] = useState(true);
    const [albaTaxRate, setAlbaTaxRate] = useState(3.3);

    // 직장인 모드 State
    const [salaryType, setSalaryType] = useState('year'); // 'year' | 'month'
    const [salaryAmount, setSalaryAmount] = useState(40000000);
    const [nonTaxable, setNonTaxable] = useState({
        meal: 200000,
        car: 0,
        childcare: 0,
        research: 0
    });
    const [dependents, setDependents] = useState(1); // 본인 포함
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
        // 1. 월 급여 환산
        let monthlyGross = salaryType === 'year' ? salaryAmount / 12 : salaryAmount;

        // 2. 비과세 합계
        const totalNonTaxable = nonTaxable.meal + nonTaxable.car + nonTaxable.childcare + nonTaxable.research;

        // 3. 과세 대상 금액 (월)
        const taxableIncome = Math.max(0, monthlyGross - totalNonTaxable);

        // 4. 4대 보험 (2024~2025 기준 요율 근사치)
        // 국민연금: 4.5% (상한액 존재하지만 단순화)
        const pension = Math.floor(Math.min(taxableIncome, 5900000) * 0.045 / 10) * 10;

        // 건강보험: 3.545%
        const health = Math.floor(taxableIncome * 0.03545 / 10) * 10;

        // 장기요양: 건강보험료의 12.95%
        const care = Math.floor(health * 0.1295 / 10) * 10;

        // 고용보험: 0.9%
        const employment = Math.floor(taxableIncome * 0.009 / 10) * 10;

        // 5. 소득세 (간이세액표 약식 로직 - 실제표는 매우 복잡하므로 추정치 사용)
        // 공제 대상 가족 수에 따른 기본 공제 효과 반영
        const deductionFactor = (dependents - 1 + children) * 150000; // 가상의 공제액
        const incomeBase = Math.max(0, taxableIncome - 1000000 - deductionFactor);

        let incomeTax = 0;
        // 단순화된 누진세율 적용 (추정치)
        if (incomeBase <= 1160000) incomeTax = incomeBase * 0.06;
        else if (incomeBase <= 3800000) incomeTax = 70000 + (incomeBase - 1160000) * 0.15;
        else if (incomeBase <= 7300000) incomeTax = 470000 + (incomeBase - 3800000) * 0.24;
        else incomeTax = 1300000 + (incomeBase - 7300000) * 0.35;

        // 자녀 세액공제 효과 등 단순 반영하여 세금 조정
        incomeTax = Math.max(0, Math.floor(incomeTax / 10) * 10);

        // 지방소득세: 소득세의 10%
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

    const handleDownload = () => {
        let content = "";
        if (mode === 'hourly') {
            content = `[알바 급여 계산]\n시급: ${formatNumber(hourlyWage)}원\n근무: 일 ${hoursPerDay}시간, 주 ${daysPerWeek}일\n주휴수당 포함: ${hasHolidayPay ? '예' : '아니오'}\n\n예상 월 급여: ${formatNumber(albaResult.totalNet)}원`;
        } else {
            content = `[직장인 급여 명세]\n${salaryType === 'year' ? '연봉' : '월급'}: ${formatNumber(salaryAmount)}원\n비과세액: ${formatNumber(salaryResult.totalNonTaxable)}원\n\n[공제 내역]\n국민연금: ${formatNumber(salaryResult.pension)}원\n건강보험: ${formatNumber(salaryResult.health)}원\n장기요양: ${formatNumber(salaryResult.care)}원\n고용보험: ${formatNumber(salaryResult.employment)}원\n소득세(지방세포함): ${formatNumber(salaryResult.incomeTax + salaryResult.localTax)}원\n\n★ 실 수령액: ${formatNumber(salaryResult.netPay)}원`;
        }
        downloadFile(content, 'salary_slip.txt');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <SectionTitle title="급여 계산기" icon={Wallet} subtitle="2025년 기준 세법 및 요율 적용" />

                {/* 모드 선택 탭 */}
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
                        <DreamInput label="시급" value={hourlyWage} onChange={setHourlyWage} type="number_format" suffix="원" />
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <DreamInput label="일 근무시간" value={hoursPerDay} onChange={setHoursPerDay} type="number_format" suffix="시간" />
                            </div>
                            <div className="flex-1">
                                <DreamInput label="주 근무일수" value={daysPerWeek} onChange={setDaysPerWeek} type="number_format" suffix="일" />
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
                            onChange={setSalaryAmount}
                            type="number_format"
                            suffix="원"
                        />

                        {/* 비과세 설정 아코디언 */}
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
                                    <DreamInput label="식대 (월 20만원 한도)" value={nonTaxable.meal} onChange={(v) => setNonTaxable({...nonTaxable, meal: v})} type="number_format" suffix="원" />
                                    <DreamInput label="자가운전보조금 (월 20만원)" value={nonTaxable.car} onChange={(v) => setNonTaxable({...nonTaxable, car: v})} type="number_format" suffix="원" />
                                    <DreamInput label="출산보육수당 (월 20만원)" value={nonTaxable.childcare} onChange={(v) => setNonTaxable({...nonTaxable, childcare: v})} type="number_format" suffix="원" />
                                </div>
                            )}
                        </div>

                        {/* 부양가족 설정 */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <DreamInput label="본인포함 부양가족" value={dependents} onChange={setDependents} type="number_format" suffix="명" />
                            </div>
                            <div className="flex-1">
                                <DreamInput label="20세이하 자녀수" value={children} onChange={setChildren} type="number_format" suffix="명" />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col h-full">
                <GlassCard className="p-8 flex-1 flex flex-col relative overflow-hidden group">
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

/**
 * 3. 예적금(이자) 계산기
 */
const InterestCalc = () => {
    const [principal, setPrincipal] = useState(10000000);
    const [rate, setRate] = useState(3.5);
    const [months, setMonths] = useState(12);
    const [type, setType] = useState('simple');

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

    const handleDownload = () => {
        const content = `[꿈의 저축 - 이자 계산]\n\n목표 금액: ${formatNumber(principal)}원\n기간: ${months}개월 (${type === 'simple' ? '단리' : '월복리'}, ${rate}%)\n\n★ 만기 수령액: ${formatNumber(total)}원`;
        downloadFile(content, 'dream_savings.txt');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <SectionTitle title="미래 자산 설계" icon={PiggyBank} subtitle="꾸준한 저축이 만드는 마법같은 변화" />
                <DreamInput label="목표 예치금" value={principal} onChange={setPrincipal} type="number_format" suffix="원" />
                <div className="flex gap-4">
                    <div className="flex-1">
                        <DreamInput label="연 이자율" value={rate} onChange={setRate} type="number_format" suffix="%" />
                    </div>
                    <div className="flex-1">
                        <DreamInput label="기간" value={months} onChange={setMonths} type="number_format" suffix="개월" />
                    </div>
                </div>
                <div className="mt-4 p-1 bg-black/20 rounded-2xl flex border border-white/10">
                    {['simple', 'compound'].map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
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
                    <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200 mb-8">
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

/**
 * 4. 대출 계산기
 */
const LoanCalc = () => {
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

    const handleDownload = () => {
        const content = `[내 집 마련/창업 - 대출 계획]\n\n대출금: ${formatNumber(amount)}원\n금리: ${rate}%\n기간: ${period}개월\n\n★ 월 납입금: ${formatNumber(monthlyPayment)}원`;
        downloadFile(content, 'dream_loan_plan.txt');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <SectionTitle title="든든한 지원금 계산" icon={Building2} subtitle="현명한 대출 관리가 부자의 첫걸음입니다." />
                <DreamInput label="필요한 자금" value={amount} onChange={setAmount} type="number_format" suffix="원" />
                <div className="flex gap-4">
                    <div className="flex-1">
                        <DreamInput label="연 이자율" value={rate} onChange={setRate} type="number_format" suffix="%" />
                    </div>
                    <div className="flex-1">
                        <DreamInput label="상환 기간" value={period} onChange={setPeriod} type="number_format" suffix="개월" />
                    </div>
                </div>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm rounded-2xl flex items-start">
                    <TrendingUp size={16} className="mr-2 mt-1 flex-shrink-0" />
                    <span>매달 원금과 이자를 똑같이 나누어 내는 <strong>원리금균등상환</strong> 방식입니다.</span>
                </div>
            </div>

            <div className="flex flex-col h-full">
                <GlassCard className="p-8 flex-1 flex flex-col justify-center bg-white/5">
                    <div className="text-center mb-8">
                        <span className="text-indigo-200 text-sm font-medium mb-2 block">매월 준비해야 할 금액</span>
                        <div className="text-5xl font-black text-white drop-shadow-lg">
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

// 헬퍼: 파일 다운로드
const downloadFile = (content, fileName) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
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

const App = () => {
    const [activeTab, setActiveTab] = useState('exchange');

    const renderContent = () => {
        switch(activeTab) {
            case 'exchange': return <ExchangeRateCalc />;
            case 'salary': return <SalaryCalc />;
            case 'savings': return <InterestCalc />;
            case 'loan': return <LoanCalc />;
            default: return <ExchangeRateCalc />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans selection:bg-pink-500 selection:text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16">
                {/* Header */}
                <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-indigo-200 mb-2 tracking-tight">
                            모두의 계산기
                        </h1>
                        <p className="text-indigo-200 font-medium text-lg flex items-center justify-center md:justify-start">
                            <Sparkles size={16} className="mr-2 text-pink-400" />
                            당신의 꿈을 현실로 만드는 금융 계산기
                        </p>
                    </div>
                </header>

                {/* Main Container */}
                <div className="flex flex-col gap-6">
                    {/* Navigation */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                        <TabButton
                            active={activeTab === 'exchange'}
                            onClick={() => setActiveTab('exchange')}
                            icon={RefreshCcw}
                            label="여행 환율"
                        />
                        <TabButton
                            active={activeTab === 'salary'}
                            onClick={() => setActiveTab('salary')}
                            icon={Wallet}
                            label="알바/급여"
                        />
                        <TabButton
                            active={activeTab === 'savings'}
                            onClick={() => setActiveTab('savings')}
                            icon={PiggyBank}
                            label="목돈 모으기"
                        />
                        <TabButton
                            active={activeTab === 'loan'}
                            onClick={() => setActiveTab('loan')}
                            icon={CreditCard}
                            label="자금 마련"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl min-h-[600px] transition-all duration-500">
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            {renderContent()}
                        </div>
                    </div>
                </div>

                <footer className="mt-12 text-center text-indigo-300/40 text-sm">
                    <p>2025 모두의 계산기</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
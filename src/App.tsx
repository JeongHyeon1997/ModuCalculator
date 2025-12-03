import React, { useState } from 'react';
import {
    RefreshCcw,
    Sparkles,
    PiggyBank,
    Wallet,
    CreditCard,
} from 'lucide-react';
import { TabButton } from './components/molecules';
import {
    ExchangeRateCalc,
    SalaryCalc,
    InterestCalc,
    LoanCalc
} from './components/organisms';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'exchange' | 'salary' | 'savings' | 'loan'>('exchange');

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

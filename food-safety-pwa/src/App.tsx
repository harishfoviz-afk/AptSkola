import { useState } from 'react'
import { Camera, ClipboardList, Settings, Home, Activity, ShieldCheck, Zap } from 'lucide-react'
import VisionModule from './components/VisionModule'
import NutritionLedger from './components/NutritionLedger'
import ScanResult from './components/ScanResult'
import RemediationTimer from './components/RemediationTimer'
import { calculateSafetyScore } from './data/pesticide-data'
import { useLocation } from './hooks/useLocation'

type AppState = 'home' | 'scan' | 'result' | 'remediation' | 'ledger' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<AppState>('home');
  const [scanResult, setScanResult] = useState<{ score: number; produce: string } | null>(null);
  const location = useLocation();

  const handleScanComplete = (baseScore: number, produce: string) => {
    const finalScore = calculateSafetyScore(baseScore / 100, location.state, produce);
    setScanResult({ score: finalScore, produce });
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      {activeTab !== 'scan' && (
        <header className="px-6 pt-10 pb-6 flex justify-between items-center sticky top-0 z-50 bg-[#020617]/40 backdrop-blur-3xl border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transform rotate-3">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">SaferPlate</h1>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">Optic Proxy v1.2</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-emerald-200 tracking-wider uppercase">{location.state}</span>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 relative z-10 ${activeTab !== 'scan' ? 'pb-32' : ''}`}>
        {activeTab === 'home' && (
          <div className="px-6 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Hero Section */}
            <section className="relative group p-1 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
                <div className="relative z-20">
                  <div className="flex items-center gap-2 mb-4 bg-black/20 w-fit px-3 py-1 rounded-full border border-white/10">
                    <Zap size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-100">Live Prediction</span>
                  </div>
                  <h2 className="text-4xl font-black mb-3 leading-[0.9] tracking-tighter uppercase italic">Pure <br />Insight.</h2>
                  <p className="text-emerald-50/70 text-[11px] font-medium max-w-[170px] leading-relaxed mb-8">
                    Deep spectral analysis proxy for residential food safety awareness.
                  </p>
                  <button 
                    onClick={() => setActiveTab('scan')}
                    className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black text-xs shadow-2xl active:scale-95 transition-all uppercase tracking-[0.2em] hover:bg-emerald-50"
                  >
                    Engage Optics
                  </button>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-float" />
                <div className="absolute right-4 top-4 opacity-10">
                  <Activity size={120} strokeWidth={1} />
                </div>
              </div>
            </section>
            
            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => setActiveTab('scan')}
                className="group relative h-48 rounded-[2.5rem] overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800/80 to-slate-900/90 z-0 border border-white/5" />
                <div className="relative z-10 p-6 h-full flex flex-col justify-between items-start">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                    <Camera size={28} />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs font-black text-emerald-400 uppercase tracking-widest">Vision</span>
                    <span className="block font-bold text-slate-100 text-lg leading-tight tracking-tight">Spectral <br />Scanner</span>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('ledger')}
                className="group relative h-48 rounded-[2.5rem] overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800/80 to-slate-900/90 z-0 border border-white/5" />
                <div className="relative z-10 p-6 h-full flex flex-col justify-between items-start">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                    <ClipboardList size={28} />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs font-black text-blue-400 uppercase tracking-widest">History</span>
                    <span className="block font-bold text-slate-100 text-lg leading-tight tracking-tight">Health <br />Ledger</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Insight Card */}
            <section className="space-y-5">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Regional Pulse</h3>
                <span className="text-[10px] text-teal-400 font-bold border-b border-teal-400/30 pb-0.5">Live Data</span>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-lg rounded-[2rem] border border-white/5 p-6 flex items-center gap-5 shadow-2xl">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
                  <Activity size={24} className="animate-float" />
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                  Currently peak harvest for <span className="text-emerald-400 font-black italic">Mustard Greens</span>. Low pesticide footprint monitored in northern belts.
                </p>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'scan' && (
          <VisionModule 
            onScanComplete={handleScanComplete}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'result' && scanResult && (
          <ScanResult 
            produce={scanResult.produce}
            score={scanResult.score}
            onStartRemediation={() => setActiveTab('remediation')}
            onClose={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'remediation' && scanResult && (
          <div className="p-6">
            <RemediationTimer 
              produce={scanResult.produce}
              onComplete={() => setActiveTab('home')}
            />
          </div>
        )}

        {activeTab === 'ledger' && (
          <NutritionLedger />
        )}
      </main>

      {/* Navigation Bar */}
      {activeTab !== 'scan' && (
        <nav className="fixed bottom-8 inset-x-6 z-50">
          <div className="glass-card rounded-[2.5rem] flex justify-around p-3 px-6 shadow-2xl ring-1 ring-white/10">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'scan', icon: Camera, label: 'Scan' },
              { id: 'ledger', icon: ClipboardList, label: 'Ledger' },
              { id: 'settings', icon: Settings, label: 'Stats' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AppState)}
                className={`flex flex-col items-center gap-1.5 transition-all duration-500 p-2 relative ${
                  activeTab === tab.id ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-emerald-400/10 rounded-2xl blur-md animate-pulse" />
                )}
                <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} className="relative z-10" />
                <span className={`text-[8px] font-black uppercase tracking-widest relative z-10 ${activeTab === tab.id ? 'opacity-100' : 'opacity-40'}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default App

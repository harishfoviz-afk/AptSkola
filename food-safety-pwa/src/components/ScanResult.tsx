import React from 'react';
import { AlertCircle, ShieldCheck, ShoppingCart, Info } from 'lucide-react';
import { INDIAN_RDA_PRODUCE } from '../data/rda-data';

interface ScanResultProps {
  produce: string;
  score: number;
  onStartRemediation: () => void;
  onClose: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ produce, score, onStartRemediation, onClose }) => {
  const nutInfo = INDIAN_RDA_PRODUCE[produce] || { benefits: "Health-focused nutrition source." };
  
  const isHighRisk = score < 60;
  const isSafe = score >= 80;

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-bottom-8 duration-500">
      {/* Result Card */}
      <div className={`p-6 rounded-[2rem] border shadow-2xl ${
        isSafe ? 'bg-emerald-950/20 border-emerald-800/50 shadow-emerald-900/10' : 
        isHighRisk ? 'bg-red-950/20 border-red-800/50 shadow-red-900/10' : 
        'bg-amber-950/20 border-amber-800/50 shadow-amber-900/10'
      }`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Result for</span>
            <h2 className="text-3xl font-black">{produce}</h2>
          </div>
          <div className={`p-3 rounded-2xl ${isSafe ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            {isSafe ? <ShieldCheck size={28} /> : <AlertCircle size={28} />}
          </div>
        </div>

        <div className="flex items-end gap-2 mb-8">
          <span className={`text-6xl font-mono font-black ${isSafe ? 'text-emerald-400' : 'text-amber-400'}`}>{score}</span>
          <span className="text-sm font-bold text-neutral-500 mb-2">/100 SAFETY SCORE</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-black/30 p-3 rounded-2xl border border-white/5">
            <Info size={16} className="text-blue-400 flex-shrink-0" />
            <p className="text-[11px] text-neutral-400 leading-relaxed">{nutInfo.benefits}</p>
          </div>
          
          {!isSafe && (
            <button 
              onClick={onStartRemediation}
              className="w-full bg-amber-500 text-amber-950 py-4 rounded-2xl font-black text-sm shadow-lg shadow-amber-900/20 active:scale-95 transition-transform"
            >
              Start Remediation Soak
            </button>
          )}

          <button 
            onClick={onClose}
            className="w-full bg-neutral-800 text-neutral-200 py-4 rounded-2xl font-bold text-sm border border-neutral-700/50"
          >
            Save to Ledger
          </button>
        </div>
      </div>

      {/* Market Recommendation */}
      <section className="bg-neutral-800/30 p-5 rounded-3xl border border-neutral-700/30 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neutral-400">
           <ShoppingCart size={20} />
        </div>
        <div>
           <h4 className="text-xs font-bold text-neutral-300">Market Insight</h4>
           <p className="text-[10px] text-neutral-500">Pesticide usage is currently <span className="text-amber-500 underline uppercase font-black">HIGH</span> in Telangana for seasonal {produce}.</p>
        </div>
      </section>
    </div>
  );
};

export default ScanResult;

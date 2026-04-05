import { TrendingUp, Calendar, ArrowRight } from 'lucide-react';

interface LedgerItem {
  id: string;
  date: string;
  produce: string;
  score: number;
}

const NutritionLedger: React.FC = () => {
  // Mock data for demo
  const history: LedgerItem[] = [
    { id: '1', date: '2026-04-03', produce: 'Tomato', score: 82 },
    { id: '2', date: '2026-04-02', produce: 'Spinach', score: 65 },
    { id: '3', date: '2026-04-01', produce: 'Apple', score: 91 },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold">Nutrition Ledger</h2>
        <p className="text-neutral-500 text-sm">Tracking your food safety and health.</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 p-4 rounded-3xl border border-emerald-800/30">
          <div className="flex justify-between items-center mb-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Avg Score</span>
          </div>
          <span className="text-2xl font-bold">79.3</span>
        </div>
        <div className="bg-blue-950/20 p-4 rounded-3xl border border-blue-800/30">
          <div className="flex justify-between items-center mb-2">
            <Calendar size={16} className="text-blue-400" />
            <span className="text-[10px] text-blue-400 font-bold uppercase">Scans</span>
          </div>
          <span className="text-2xl font-bold">12</span>
        </div>
      </div>

      {/* Weekly Balance Guide */}
      <section className="bg-neutral-800/50 p-5 rounded-3xl border border-neutral-700/50 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <TrendingUp size={16} className="text-teal-400" /> Weekly Balance Guide
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Based on your last 7 days of consumption, you are low on <span className="text-amber-400 font-bold">Vitamin C</span>.
        </p>
        <div className="bg-neutral-900/50 p-3 rounded-2xl flex items-center justify-between border border-neutral-800">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 text-xs font-bold">C</div>
            <span className="text-[13px] font-medium">Buy Amla next week</span>
          </div>
          <ArrowRight size={14} className="text-neutral-600" />
        </div>
      </section>

      {/* History List */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-neutral-300">Detailed History</h3>
        <div className="space-y-3">
          {history.map(item => (
            <div key={item.id} className="bg-neutral-800/30 p-4 rounded-2xl border border-neutral-700/30 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-8 rounded-full ${item.score > 80 ? 'bg-emerald-500' : item.score > 60 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <div>
                  <h4 className="font-bold text-sm">{item.produce}</h4>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-mono font-bold ${item.score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{item.score}</span>
                <p className="text-[9px] text-neutral-600 uppercase font-bold">Safety</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NutritionLedger;

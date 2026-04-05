import React, { useState, useEffect } from 'react';
import { Wind, CheckCircle2 } from 'lucide-react';
import { GET_REMEDIATION_PLAN } from '../utils/remediation-logic';

interface RemediationTimerProps {
  produce: string;
  onComplete: () => void;
}

const RemediationTimer: React.FC<RemediationTimerProps> = ({ produce, onComplete }) => {
  const plan = GET_REMEDIATION_PLAN(produce);
  const [timeLeft, setTimeLeft] = useState(plan.duration * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((plan.duration * 60 - timeLeft) / (plan.duration * 60)) * 100;

  return (
    <div className="bg-neutral-800 p-6 rounded-3xl border border-neutral-700 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-emerald-400">Remediation Active</h3>
          <p className="text-neutral-400 text-xs">Neutralizing residues for {produce}</p>
        </div>
        <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
          <Wind size={20} />
        </div>
      </div>

      {/* Circle Timer */}
      <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-neutral-700"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * progress) / 100}
            strokeLinecap="round"
            className="text-emerald-500 transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-mono font-bold tracking-tighter">{formatTime(timeLeft)}</span>
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Remaining</span>
        </div>
      </div>

      <div className="bg-neutral-900/50 p-6 rounded-[2rem] border border-white/5 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">How to Clean</span>
          <span className="text-emerald-400 font-black text-xs">{plan.agentDisplay}</span>
        </div>
        
        <div className="space-y-5">
          {plan.steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 group">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-[10px] font-black mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                {idx + 1}
              </div>
              <p className="text-[12px] text-slate-300 leading-relaxed font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
          <p className="text-[10px] text-amber-200/70 leading-relaxed italic">
            <span className="font-bold text-amber-400">Safety Tip:</span> Always rinse thoroughly under running water after the soak period to ensure all neutralized residues are physically removed.
          </p>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        {!isActive && timeLeft > 0 ? (
          <button 
            onClick={() => setIsActive(true)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 py-4 rounded-2xl font-black text-xs text-white shadow-xl shadow-emerald-500/10 active:scale-95 transition-all uppercase tracking-widest"
          >
            Start Timer
          </button>
        ) : timeLeft === 0 ? (
          <button 
            onClick={onComplete}
            className="flex-1 bg-emerald-500 py-4 rounded-2xl font-black text-xs text-white flex items-center justify-center gap-2 animate-bounce uppercase tracking-widest"
          >
            <CheckCircle2 size={16} /> Cleanup Complete
          </button>
        ) : (
          <button 
            onClick={() => setIsActive(false)}
            className="flex-1 bg-white/5 py-4 rounded-2xl font-black text-xs text-slate-400 border border-white/5 active:scale-95 transition-all uppercase tracking-widest"
          >
            Pause
          </button>
        )}
      </div>
    </div>
  );
};

export default RemediationTimer;

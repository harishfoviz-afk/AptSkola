// Comprehensive Hero Component Overhaul - Functional & UI & Momentum
const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion || window.FramerMotion || {};

const Hero = () => {
  const words = ["Worrying", "Doubting", "Guessing", "Knowing"];
  const [index, setIndex] = useState(0);
  const [buttonText, setButtonText] = useState("Initiate Forensic Sync Scan");
  const [showToast, setShowToast] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Narrative Build State: Always 2 (Main Hero Visible Immediately)
  const [introState, setIntroState] = useState(2);

  // Scroll Listener for Sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyCTA(true);
      } else {
        setShowStickyCTA(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotation Timer (Active immediately)
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 2000);
    return () => clearInterval(timer);
  }, []);

  // Narrative Build Timeline REMOVED - Instant Load

  // Momentum Feature 2: Progressive Slide-In (Nudge)
  useEffect(() => {
    // const timer = setTimeout(() => setShowToast(true), 5000); // HIDDEN BY USER REQUEST
    // return () => clearTimeout(timer);
  }, []);

  const triggerStart = (startAtIndex = 0) => {
    if (typeof window.initializeQuizShell === 'function') {
      window.initializeQuizShell(startAtIndex);
    } else {
      setTimeout(() => {
        if (typeof window.initializeQuizShell === 'function') {
          window.initializeQuizShell(startAtIndex);
        }
      }, 200);
    }
  };

  const handlePhase0OptionClick = (optionIndex) => {
    window.answers = window.answers || {};
    window.answers["p0_q1"] = optionIndex;
    triggerStart(1); // Launch at index 1 since 0 is answered
  };

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target;
      if (!target) return;
      const isCtaClick = target.closest('.unstoppable-cta');
      if (isCtaClick) {
        console.log("Global Unstoppable Catch: Targeted CTA Clicked");
        triggerStart(0);
      }
    };
    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);

  const getPrefix = () => words[index] === "Knowing" ? "START" : "STOP";
  const getPrefixColor = () => words[index] === "Knowing" ? "text-green-500" : "text-red-500";
  const getWordColor = () => words[index] === "Knowing" ? "text-[#FF6B35]" : "text-white";

  return (
    <>
      <section className="relative pt-16 pb-20 px-4 overflow-hidden bg-[#0F172A] min-h-[95vh] flex flex-col items-center">

        {/* 1. New Top Left Brand Logo (Always Visible, No Animation) */}
        <div className="absolute top-6 left-6 z-[100]">
          <div className="flex flex-col items-start leading-none opacity-90 hover:opacity-100 transition-opacity">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
              Apt <span className="text-[#FF6B35]">Skola</span>
            </h1>
            <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-1">
              A Foviz Venture
            </span>
          </div>
        </div>

        {/* Narrative Build - Persistent Header (Horizontal Layout) */}
        <div className="mt-8 w-full flex flex-col items-center justify-center z-40 min-h-[120px]">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">

            {/* Part 1: "Best" Question (Static) */}
            <div className="text-center md:text-right">
              <p className="text-2xl md:text-5xl font-bold text-slate-500">
                What is the <span className="font-black text-white relative">Best</span> Board?
              </p>
            </div>

            {/* Part 2: "Vs" Bounce (Animated) */}
            {/* Part 2: "Vs" Bounce (Static Container, Animated Inner) */}
            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,107,53,0.6)] animate-bounce">
                <span className="text-white font-black text-lg md:text-xl italic">Vs</span>
              </div>
            </div>

            {/* Part 3: "Suits" Answer (Static) */}
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-5xl font-bold text-slate-200">
                What <span className="font-black text-[#FF6B35] font-['Montserrat'] tracking-wide">Suits</span> <br className="md:hidden" />your child?
              </p>
            </div>
          </div>
        </div>

        {/* Main Hero Content - Visible Immediately */}
        <div className="flex flex-col items-center w-full">

          {/* 3. The Animated Transformation Headline */}
          <div className="flex flex-col items-center justify-center gap-4 min-h-[160px] mt-8">
            <div className="flex items-center gap-4 md:gap-8">
              <span className={`text-5xl md:text-8xl font-black transition-colors duration-500 ${getPrefixColor()}`}>
                {getPrefix()}
              </span>
              <div className="overflow-hidden h-20 md:h-32 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[index]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-5xl md:text-8xl font-black ${getWordColor()}`}
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <p className="text-[#FF6B35] font-black text-xl md:text-3xl mt-4 tracking-normal text-center drop-shadow-lg leading-tight">
              School Board Selection is a 15 Year Financial & Academic Commitment.
            </p>
          </div>

          <p className="text-white text-lg md:text-2xl text-center max-w-3xl mx-auto mt-12 leading-relaxed font-medium">
            Is your child's Age, Grade, and Learning Style in perfect <span className="text-[#FF6B35] font-bold">Sync</span>?
          </p>

          {/* 4. Social Proof Avatar Row */}
          <div className="mt-12 flex flex-col items-center gap-4">
            {/* 4.5 Feature Block (White Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center relative max-w-6xl mx-auto mt-12 mb-8 px-4">
              {/* Connector Line (Darkened for contrast on white? No, its behind. Keep as is or remove if white cards cover it) */}

              {/* 1. Clinical Input */}
              <div className="p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300">
                <h4 className="text-[#FF6B35] font-bold text-xs uppercase tracking-[2px] font-['Montserrat'] mb-2">THE INPUT (WHY?)</h4>
                <div className="mb-4 flex justify-center">
                  <div className="text-5xl filter drop-shadow-md animate-pulse-slow">🧠</div>
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">Clinical Input</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  15 psychometric parameters to map your child's naturally dominant learning DNA.
                </p>
              </div>

              {/* 2. Neural Calibration */}
              <div className="p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300">
                <h4 className="text-[#FF6B35] font-bold text-xs uppercase tracking-[2px] font-['Montserrat'] mb-2">THE PROCESS (HOW?)</h4>
                <div className="mb-4 flex justify-center">
                  <svg className="w-14 h-14 text-slate-800 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">Neural Calibration</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Forensic analysis of your child's traits vs. rigid NEP, CBSE, ICSE, and IB frameworks.
                </p>
              </div>

              {/* 3. Actionable Roadmap */}
              <div className="p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300">
                <h4 className="text-[#FF6B35] font-bold text-xs uppercase tracking-[2px] font-['Montserrat'] mb-2">THE OUTPUT (WHAT?)</h4>
                <div className="mb-4 flex justify-center">
                  <svg className="w-14 h-14 text-[#F59E0B] animate-folder-float" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">Actionable Roadmap</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  A Forensic Audit & Alignment Report delivered instantly to your inbox.
                </p>
              </div>
            </div>

            {/* 5. Social Proof Banner (Full Width) */}
            <div className="w-[calc(100%+2rem)] -mx-4 bg-slate-900 border-y border-slate-800 py-4 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-8">
              <p className="text-white text-sm md:text-base font-medium text-center md:text-left">
                <span className="text-[#FF6B35] font-bold">2,400+ Families</span> across India’s Top Tier Cities have synced their child’s future.
              </p>
              <div className="flex items-center gap-6 text-slate-500 font-bold text-sm tracking-widest uppercase">
                <span>CBSE</span>
                <span>ICSE</span>
                <span>IB</span>
                <span>IGCSE</span>
              </div>
            </div>

            {/* 5. The "Unstoppable" CTA Button */}
            <div className="relative mt-16 group z-[40]">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B35] via-orange-500 to-yellow-500 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <button
                onClick={() => triggerStart(0)}
                className="unstoppable-cta cta-button-pulse relative bg-[#FF6B35] text-white px-8 md:px-12 py-4 md:py-6 rounded-full font-black text-xl md:text-2xl shadow-[0_20px_50px_rgba(255,107,53,0.5)] hover:scale-105 active:scale-95 transition-all border-b-[6px] border-orange-800 flex items-center gap-4"
                style={{ pointerEvents: 'auto', animationDelay: '3s' }}
              >
                {buttonText} <span className="animate-pulse inline-block text-3xl md:text-4xl">→</span>
              </button>
              <div className="text-center mt-6">
                {/* Text removed as per request */}
              </div>
            </div>

            {/* Roadmap Roadmap Text */}
            <p className="text-slate-400 text-center mt-12 mb-4 max-w-md mx-auto px-4 font-medium animate-pulse">
              Your personalized roadmap begins here. Please answer calibration questions to align your child’s profile.
            </p>

            {/* Momentum Feature 1: First Question Embed */}
            <div className="mt-24 w-full max-w-4xl bg-slate-900/50 p-8 md:p-12 rounded-[40px] backdrop-blur-xl shadow-2xl">
              <div className="text-center">
                {/* Verification Text Removed */}
                <h2 className="text-white text-2xl md:text-4xl font-extrabold mt-4 md:whitespace-nowrap">How does your child process complex new data?</h2>
              </div>

              {/* Separator Line */}
              <div className="w-full h-px bg-slate-700/50 my-8"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePhase0OptionClick(i)}
                    className="p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-white font-bold text-xl hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all transform hover:-translate-y-2"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* New Button Location (After Phase 0) */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8 w-full max-w-4xl px-4 animate-fade-in-up">
              {/* 1. Calculator */}
              <button
                onClick={() => window.handleCostCalculatorClick && window.handleCostCalculatorClick()}
                className="group px-6 py-3 rounded-xl font-bold text-slate-100 border border-slate-500 bg-slate-800/60 hover:border-[#FF6B35] hover:text-white hover:bg-slate-800/80 transition-all text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm"
              >
                <span className="text-lg transition-all">🧮</span> Calculate 'School Switch'
              </button>
              {/* 2. Sync Check */}
              <button
                onClick={() => window.openSyncMatchGate && window.openSyncMatchGate()}
                className="group px-6 py-3 rounded-xl font-bold text-slate-100 border border-slate-500 bg-slate-800/60 hover:border-[#FF6B35] hover:text-white hover:bg-slate-800/80 transition-all text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm"
              >
                <span className="text-lg transition-all">🔐</span> Unlock Parent & Child Sync Check
              </button>
              {/* 3. Forensic Report */}
              <a
                href="https://xray.aptskola.com"
                target="_blank"
                className="group px-6 py-3 rounded-xl font-bold text-slate-100 border border-slate-500 bg-slate-800/60 hover:border-[#FF6B35] hover:text-white hover:bg-slate-800/80 transition-all text-sm flex items-center gap-2 text-center no-underline shadow-lg backdrop-blur-sm"
              >
                <span className="text-lg transition-all">🔎</span> School/College Forensic Report
              </a>
            </div>

          </div>

          {/* Background Atmosphere */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none" />
        </div>

      </section>

      {/* Momentum Feature 2: Progressive Slide-In Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed bottom-8 right-8 z-[10000] bg-white p-6 rounded-3xl shadow-2xl border-l-[8px] border-[#FF6B35] max-w-xs"
          >
            <button onClick={() => setShowToast(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
            <p className="text-slate-900 font-bold leading-tight mb-4">Ready to see which board fits your child's personality? (Takes 2 mins)</p>
            <button
              onClick={() => { triggerStart(0); setShowToast(false); }}
              className="w-full bg-[#FF6B35] text-white py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
            >
              Start Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY CTA (New Feature) */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full z-[99999] bg-slate-50 border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] px-4 py-3 md:py-4 md:px-8 flex items-center justify-between"
          >
            <div>
              <span className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Don't Guess</span>
              <h3 className="text-slate-900 font-black text-sm md:text-xl leading-none">Sync your child's future</h3>
            </div>
            <button
              onClick={() => triggerStart(0)}
              className="bg-[#FF6B35] text-white px-5 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              Initiate Scan <span className="hidden md:inline">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Render the component on window load
window.addEventListener('load', () => {
  const container = document.getElementById('react-hero-root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<Hero />);
  }
});

// Comprehensive Hero Component Overhaul - Functional & UI & Momentum
const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion || window.FramerMotion || {};

const Hero = () => {
  const slides = [
    { prefix: "STOP", word: "Worrying", pColor: "text-red-500", wColor: "text-white" },
    { prefix: "STOP", word: "Doubting", pColor: "text-red-500", wColor: "text-white" },
    { prefix: "STOP", word: "Guessing", pColor: "text-red-500", wColor: "text-white" },
    { prefix: "START", word: "Knowing", pColor: "text-green-500", wColor: "text-[#FF6B35]" }
  ];

  // --- BOARD DATA CONSTANTS ---
  const BOARD_DATA = {
    'CBSE': {
      name: 'CBSE',
      tagline: 'The "National Standard"',
      methodology: 'Focused on academic depth, standardized testing, and memory retention. Designed for the Indian competitive landscape (JEE/NEET).',
      forensicReality: 'High volume of content. Strong in Math and Science, but often lower on critical inquiry and soft-skill development.',
      risks: [
        { title: 'Rote-Learning Trap', text: 'High risk of "Study for the Exam" burnout.' },
        { title: 'Global Pivot Difficulty', text: 'Transitioning to Liberal Arts or International Universities may require additional bridging.' }
      ],
      stat: '42% of CBSE parents report "High Academic Stress" by Grade 6.'
    },
    'IB': {
      name: 'IB - International Baccalaureate',
      tagline: 'The "Global DNA"',
      methodology: 'Inquiry-based learning. It doesn\'t teach "What" to think, but "How" to think. Focus on research and holistic development.',
      forensicReality: 'Extremely high university acceptance abroad. Very demanding for both students and parents (it\'s a lifestyle, not just a board).',
      risks: [
        { title: 'Financial Escalation', text: 'Highest 15-year cost projection (fees + international exposure).' },
        { title: 'Local Rigor Gap', text: 'May feel "light" compared to Indian competitive entrance exams (JEE).' }
      ],
      stat: 'IB graduates show 30% higher readiness for Ivy League research frameworks.'
    },
    'IGCSE': {
      name: 'Cambridge - IGCSE',
      tagline: 'The "Concept Specialist"',
      methodology: 'Practical application of concepts. It focuses on understanding and solving real-world problems. Very flexible subject choices.',
      forensicReality: 'Excellent balance for students who want a global standard without the extreme "Inquiry" pressure of IB.',
      risks: [
        { title: 'Consistency Risk', text: 'Requires a school with highly trained faculty to be effective.' },
        { title: 'Board Transition', text: 'Moving back to a national board in Grade 11 can be a difficult structural jump.' }
      ],
      stat: 'Preferred by 65% of students pursuing Specialized Creative or Technical careers.'
    },
    'ICSE': {
      name: 'ICSE',
      tagline: 'The "Literary Rigor"',
      methodology: 'Vast syllabus with a heavy focus on English language, literature, and detailed social sciences.',
      forensicReality: 'Produces excellent communicators and analytical thinkers. More "diverse" subjects than CBSE.',
      risks: [
        { title: 'Analytical Fatigue', text: 'The sheer volume of the syllabus can overwhelm students in early middle school.' },
        { title: 'Standardization Drift', text: 'Moving away from ICSE after Grade 10 is common, causing a "System Shock".' }
      ],
      stat: 'ICSE students score 18% higher on standardized English proficiency tests globally.'
    }
  };

  const [index, setIndex] = useState(0);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Scroll Listener
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

  // Rotation Timer
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 2000);
    return () => clearInterval(timer);
  }, []);

  // Momentum Feature 2: Progressive Slide-In (Nudge)
  useEffect(() => {
    // const timer = setTimeout(() => setShowToast(true), 5000); // HIDDEN BY USER REQUEST
    // return () => clearTimeout(timer);
  }, []);

  const triggerStart = (startAtIndex = 0) => {
    console.log("[Hero] Trigger Start Clicked. Index:", startAtIndex);
    if (window.triggerTrack) window.triggerTrack('Scan_Initiated');
    if (typeof window.initializeQuizShell === 'function') {
      window.initializeQuizShell(startAtIndex);
    } else {
      setTimeout(() => {
        if (typeof window.initializeQuizShell === 'function') {
          window.initializeQuizShell(startAtIndex);
        } else {
          console.error("[Hero] initializeQuizShell Failed to Load.");
        }
      }, 500);
    }
  };

  const handlePhase0OptionClick = (optionIndex) => {
    window.answers = window.answers || {};
    window.answers["p0_q1"] = optionIndex;
    triggerStart(1); // Launch at index 1 since 0 is answered
  };

  // Universal Click Fix
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

  return (
    <>
      <section className="relative pt-14 pb-12 px-4 overflow-hidden bg-[#0F172A] min-h-[95vh] flex flex-col items-center">

        {/* 1. Top Left Logo */}
        <div className="absolute top-6 left-6 z-[100]">
          <div
            className="flex flex-col items-start leading-none opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
              Apt <span className="text-[#FF6B35]">Skola</span>
            </h1>
            <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-1">
              A Foviz Venture
            </span>
          </div>
        </div>

        {/* 1.5 Top Right Social Proof */}
        <div className="absolute top-6 right-6 z-[100] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse shadow-[0_0_8px_#FF6B35]"></div>
          <p className="text-[10px] font-bold text-white uppercase tracking-wider leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="micro-mobile-only text-[#FF6B35]">2.4K+ Families</span>
            <span className="micro-mobile-hidden">2,400+ Families Audited</span>
          </p>
        </div>

        {/* Narrative Intro Header */}
        <div className="mt-2 w-full flex flex-col items-center justify-center z-40 min-h-[80px]">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="text-center md:text-right">
              <p className="text-2xl md:text-4xl font-bold text-slate-500">
                What is the <span className="font-black text-white relative">Best</span> Board?
              </p>
            </div>
            <div className="relative cursor-pointer" onClick={() => triggerStart(0)}>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,107,53,0.6)] animate-bounce hover:scale-110 transition-transform">
                <span className="text-white font-black text-lg md:text-xl italic">Vs</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-xl md:text-4xl font-bold text-slate-200 whitespace-nowrap">
                What <span className="font-black text-[#FF6B35] tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>Suits</span> your child?
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          {/* 3. Headline */}
          <div className="flex flex-col items-center justify-center gap-2 min-h-[60px] text-center px-4 max-w-5xl mx-auto mt-1">
            <div style={{ marginBottom: '0.25rem', fontSize: 'clamp(18px, 5vw, 28px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center', width: '100%' }}>
              <span className="text-slate-400">From Enquiring </span>
              <span className="arrow-pulse text-[#FF6B35] font-black text-2xl md:text-3xl relative top-[2px]" style={{ display: 'inline-block' }}>→</span>
              <span className="text-[#FF6B35] font-extrabold"> Knowing</span>
            </div>
          </div>

          {/* Board Grid (New) */}
          <div className="mb-4 mt-4 text-center w-full max-w-lg mx-auto px-4">
            <p className="text-white font-bold mb-3 uppercase text-center" style={{ fontSize: '11px', letterSpacing: '1.5px', textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
              Select a board to view its Methodology & Risk Profile
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(BOARD_DATA).map(boardKey => (
                <button
                  key={boardKey}
                  onClick={() => setSelectedBoard(boardKey)}
                  className="py-3 px-2 rounded-xl text-[10px] md:text-sm font-bold transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94A3B8'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF6B35';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 107, 53, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#94A3B8';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {boardKey}
                </button>
              ))}
            </div>
          </div>

          {/* 4.5 Feature Block */}
          <div className="grid grid-cols-3 gap-2 md:gap-8 text-center relative max-w-6xl mx-auto mt-0 md:mt-4 mb-4 px-2">

            {/* 1. Clinical Input */}
            <div
              className="p-2 md:p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
              onClick={() => window.showDeepDive && window.showDeepDive('input')}
            >
              <h4 className="text-[#FF6B35] font-bold text-[10px] uppercase tracking-[2px] font-['Montserrat'] mb-2 flex items-center justify-center gap-1">
                THE INPUT
              </h4>
              <div className="mb-4 flex justify-center">
                <div className="text-5xl filter drop-shadow-md animate-pulse-slow">🧠</div>
              </div>
              <h3 className="text-xs md:text-xl font-black text-slate-900 mb-1 md:mb-2">Clinical Input</h3>
              <p className="hidden md:block text-slate-600 text-xs md:text-sm leading-relaxed">
                15 psychometric parameters to map your child's naturally dominant learning DNA.
              </p>
            </div>

            {/* 2. Neural Calibration */}
            <div
              className="p-2 md:p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
              onClick={() => window.showDeepDive && window.showDeepDive('process')}
            >
              <h4 className="text-[#FF6B35] font-bold text-[10px] uppercase tracking-[2px] font-['Montserrat'] mb-2 flex items-center justify-center gap-1">
                PROCESS
              </h4>
              <div className="mb-4 flex justify-center">
                <svg className="w-14 h-14 text-slate-800 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h3 className="text-xs md:text-xl font-black text-slate-900 mb-1 md:mb-2">Neural Link</h3>
              <p className="hidden md:block text-slate-600 text-xs md:text-sm leading-relaxed">
                Forensic analysis of your child's traits vs. rigid NEP, CBSE, ICSE, and IB frameworks.
              </p>
            </div>

            {/* 3. Actionable Roadmap */}
            <div
              className="p-2 md:p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
              onClick={() => window.showDeepDive && window.showDeepDive('output')}
            >
              <h4 className="text-[#FF6B35] font-bold text-[10px] uppercase tracking-[2px] font-['Montserrat'] mb-2 flex items-center justify-center gap-1">
                THE OUTPUT
              </h4>
              <div className="mb-4 flex justify-center">
                <svg className="w-14 h-14 text-[#F59E0B] animate-folder-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xs md:text-xl font-black text-slate-900 mb-1 md:mb-2">Roadmap</h3>
              <p className="hidden md:block text-slate-600 text-xs md:text-sm leading-relaxed">
                A Forensic Audit & Alignment Report delivered instantly to your inbox.
              </p>
            </div>
          </div>

          {/* 6. CTA Button */}
          <div className="relative mt-4 z-[40] flex flex-col gap-4 items-center w-full max-w-2xl px-4">
            <div className="relative group w-full md:w-auto">
              <button
                onClick={() => triggerStart(0)}
                className="unstoppable-cta neural-pulse w-full relative bg-[#FF6B35] text-white px-8 py-5 rounded-full font-black text-xl md:text-2xl shadow-none haptic-shadow overflow-hidden transition-all duration-300 ease-out border-b-[4px] border-orange-800 flex items-center justify-center gap-2"
                style={{ pointerEvents: 'auto' }}
              >
                <div className="radar-beam"></div>
                Initiate Forensic Sync Scan <span className="animate-pulse">→</span>
              </button>
            </div>
          </div>

          {/* 7. Roadmap Text */}
          <p className="text-[#FF6B35] font-black text-xl md:text-3xl mb-4 mt-4 tracking-normal text-center drop-shadow-lg leading-tight">
            School Board Selection is a 15 Year Financial & Academic Commitment.
          </p>
          <p className="text-slate-400 text-center mt-2 mb-2 w-full max-w-5xl mx-auto px-2 font-medium animate-pulse text-xs md:text-lg md:whitespace-nowrap leading-tight">
            Your personalized roadmap begins here. Please answer calibration questions to align your child’s profile.
          </p>

          {/* 8. Question Embed */}
          <div className="mt-4 w-full max-w-4xl bg-slate-900/50 p-8 md:p-12 rounded-[40px] backdrop-blur-xl shadow-2xl">
            <div className="text-center">
              <h2 className="text-white text-2xl md:text-4xl font-extrabold mt-4 md:whitespace-nowrap">How does your child process complex new data?</h2>
            </div>
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

          {/* 5. Social Proof Banner */}
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

          {/* New Buttons After Phase 0 */}
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none"></div>
      </section>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed bottom-8 right-8 z-[10000] bg-white p-6 rounded-3xl shadow-2xl border-l-[8px] border-[#FF6B35] max-w-xs"
          >
            <button onClick={() => setShowToast(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
            <p className="text-slate-900 font-bold leading-tight mb-4">Ready to see which board fits your child's personality? (Takes 5 mins)</p>
            <button
              onClick={() => { triggerStart(0); setShowToast(false); }}
              className="w-full bg-[#FF6B35] text-white py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
            >
              Start Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky CTA */}
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

      {/* Board Modal (Glassmorphism) */}
      <AnimatePresence>
        {selectedBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/80 border border-[#FF6B35] rounded-3xl p-6 md:p-10 shadow-2xl custom-scrollbar"
              style={{ backdropFilter: "blur(12px)" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBoard(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              {/* Header */}
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1">{BOARD_DATA[selectedBoard].name}</h2>
              <p className="text-[#FF6B35] font-bold uppercase tracking-widest text-sm mb-6">{BOARD_DATA[selectedBoard].tagline}</p>

              {/* Content Grid */}
              <div className="space-y-6 text-left">
                {/* Methodology */}
                <div>
                  <h4 className="text-slate-300 font-bold uppercase text-xs mb-1">The Methodology</h4>
                  <p className="text-slate-100 text-sm leading-relaxed">{BOARD_DATA[selectedBoard].methodology}</p>
                </div>
                {/* Forensic Reality */}
                <div>
                  <h4 className="text-slate-300 font-bold uppercase text-xs mb-1">The Forensic Reality</h4>
                  <p className="text-slate-100 text-sm leading-relaxed">{BOARD_DATA[selectedBoard].forensicReality}</p>
                </div>
                {/* Risk Profile */}
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                  <h4 className="text-red-400 font-bold uppercase text-xs mb-3">Forensic Risk Profile</h4>
                  {BOARD_DATA[selectedBoard].risks.map((risk, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <strong className="text-white text-sm">⚠️ {risk.title}: </strong>
                      <span className="text-slate-300 text-sm">{risk.text}</span>
                    </div>
                  ))}
                </div>
                {/* Stat */}
                <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/30 p-3 rounded-lg flex items-start gap-3">
                  <span className="text-xl">📊</span>
                  <p className="text-slate-200 text-xs font-medium italic">
                    <strong className="text-[#FF6B35]">Apt Skola Stat: </strong>
                    {BOARD_DATA[selectedBoard].stat}
                  </p>
                </div>
              </div>

              {/* Footer Buttons - REPLACED WITH ONE BUTTON */}
              <div className="mt-8 pt-6 border-t border-slate-700 w-full">
                <button
                  onClick={() => { setSelectedBoard(null); triggerStart(0); }}
                  className="w-full py-4 px-6 rounded-xl bg-[#FF6B35] text-white font-black text-sm md:text-lg hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(255,107,53,0.4)] flex items-center justify-center gap-2"
                >
                  See how my child's Learning Style fits into the {BOARD_DATA[selectedBoard].name}
                  <span className="animate-pulse">→</span>
                </button>
              </div>
            </motion.div>
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

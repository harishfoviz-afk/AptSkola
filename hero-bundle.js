// Comprehensive Hero Component Overhaul - Functional & UI & Momentum
// Transpiled manually to remove Babel dependency
(function () {
    const { useState, useEffect, useRef } = React;
    const { motion, AnimatePresence } = window.Motion || window.FramerMotion || {};
    const h = React.createElement;
    const Fragment = React.Fragment;

    const Hero = () => {
        const words = ["Worrying", "Doubting", "Guessing", "Knowing"];
        const [index, setIndex] = useState(0);
        const [buttonText, setButtonText] = useState("Access Public Audit: Initiate Forensic Momentum Scan");
        const [showToast, setShowToast] = useState(false);

        useEffect(() => {
            const timer = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 2000);
            return () => clearInterval(timer);
        }, []);

        // Momentum Feature 2: Progressive Slide-In (Nudge)
        useEffect(() => {
            const timer = setTimeout(() => setShowToast(true), 5000);
            return () => clearTimeout(timer);
        }, []);

        const triggerStart = (startAtIndex = 0) => {
            if (typeof window.initializeQuizShell === 'function') {
                window.initializeQuizShell(startAtIndex);
            } else {
                // Retry once after 200ms if script isn't ready
                setTimeout(() => {
                    if (typeof window.initializeQuizShell === 'function') {
                        window.initializeQuizShell(startAtIndex);
                    }
                }, 200);
            }
        };

        // Momentum Feature 1: Phase 0 Preview Logic
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

        const getPrefix = () => words[index] === "Knowing" ? "START" : "STOP";
        const getPrefixColor = () => words[index] === "Knowing" ? "text-green-500" : "text-red-500";
        const getWordColor = () => words[index] === "Knowing" ? "text-[#FF6B35]" : "text-white";

        // --- RENDER HELPERS ---

        // 1. Top Buttons
        const renderTopButtons = () => {
            return h('div', { className: "absolute top-6 right-6 flex flex-col md:flex-row gap-4 z-[1000]" },
                h('button', {
                    onClick: () => window.openSyncMatchGate && window.openSyncMatchGate(),
                    className: "text-xs font-bold text-slate-400 border border-slate-700/50 px-5 py-2 rounded-full hover:bg-slate-800 transition backdrop-blur-sm shadow-xl",
                    style: { background: 'rgba(30, 41, 59, 0.4)', cursor: 'pointer' }
                }, "Unlock Parent & Child Sync Check"),
                h('a', {
                    href: "https://xray.aptskola.com",
                    target: "_blank",
                    className: "text-xs font-bold text-slate-400 border border-slate-700/50 px-5 py-2 rounded-full hover:bg-slate-800 transition backdrop-blur-sm shadow-xl text-center",
                    style: { background: 'rgba(30, 41, 59, 0.4)' }
                }, "🔎 School/College Forensic Report")
            );
        };

        // 2. Branding
        const renderBranding = () => {
            return h('div', { className: "mt-4 mb-12 text-center animate-fade-in-up" },
                h('h1', { className: "text-5xl md:text-6xl font-black text-white tracking-tighter" },
                    "Apt ", h('span', { className: "text-[#FF6B35]" }, "Skola")
                ),
                h('div', { className: "flex items-center justify-center gap-3 mt-4 opacity-70" },
                    h('div', { className: "h-px w-8 bg-slate-600" }),
                    h('span', { className: "text-sm font-bold text-slate-400 uppercase tracking-[0.2em]" }, "A Foviz Venture"),
                    h('div', { className: "h-px w-8 bg-slate-600" })
                )
            );
        };

        // 3. Headline
        const renderHeadline = () => {
            return h('div', { className: "flex flex-col items-center justify-center gap-4 min-h-[160px]" },
                h('div', { className: "flex items-center gap-4 md:gap-8" },
                    h('span', { className: `text-5xl md:text-8xl font-black transition-colors duration-500 ${getPrefixColor()}` }, getPrefix()),
                    h('div', { className: "overflow-hidden h-20 md:h-32 flex items-center" },
                        h(AnimatePresence, { mode: "wait" },
                            h(motion.span, {
                                key: words[index],
                                initial: { y: 50, opacity: 0 },
                                animate: { y: 0, opacity: 1 },
                                exit: { y: -50, opacity: 0 },
                                transition: { duration: 0.5, ease: "backOut" },
                                className: `text-5xl md:text-8xl font-black ${getWordColor()}`
                            }, words[index])
                        )
                    )
                ),
                h('p', { className: "text-[#FF6B35] font-black text-xl md:text-3xl mt-4 uppercase tracking-[0.25em] text-center drop-shadow-lg" },
                    "Forensic Audit: Academic Trajectory & Board Alignment"
                )
            );
        };

        // 4. Subtext
        const renderSubtext = () => {
            return h('p', { className: "text-slate-400 text-lg md:text-2xl text-center max-w-3xl mx-auto mt-12 leading-relaxed font-medium" },
                "Get a scientific, personalized board recommendation based on your child's unique psychology in ",
                h('span', { className: "text-white underline underline-offset-4 decoration-[#FF6B35]/50 whitespace-nowrap" },
                    h('span', { className: "inline-block mr-2" }, "⏱️"),
                    "6.5s Neural Calibration"
                ),
                "."
            );
        };

        // 5. Social Proof
        const renderSocialProof = () => {
            return h('div', { className: "mt-12 flex flex-col items-center gap-4" },
                h('div', { className: "flex -space-x-4" },
                    [1, 2, 3, 4, 5].map(i =>
                        h('div', { key: i, className: "w-12 h-12 rounded-full border-4 border-[#0F172A] bg-slate-700 flex items-center justify-center text-white font-bold text-xs overflow-hidden" },
                            h('img', { src: `https://i.pravatar.cc/100?img=${i + 10}`, className: "w-full h-full object-cover", alt: "Parent Avatar" })
                        )
                    ),
                    h('div', { className: "w-12 h-12 rounded-full border-4 border-[#0F172A] bg-[#FF6B35] flex items-center justify-center text-white font-black text-xs" }, "1K+")
                ),
                h('p', { className: "text-slate-500 text-sm font-bold uppercase tracking-widest" }, "Joined by 1,000+ parents this week")
            );
        };

        // 6. CTA Button
        const renderCTA = () => {
            return h('div', { className: "relative mt-16 group z-[40]" },
                h('div', { className: "absolute -inset-4 bg-gradient-to-r from-[#FF6B35] via-orange-500 to-yellow-500 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" }),
                h('button', {
                    onClick: () => triggerStart(0),
                    className: "unstoppable-cta cta-button-pulse relative bg-[#FF6B35] text-white px-8 md:px-12 py-4 md:py-6 rounded-full font-black text-xl md:text-2xl shadow-[0_20px_50px_rgba(255,107,53,0.5)] hover:scale-105 active:scale-95 transition-all border-b-[6px] border-orange-800 flex items-center gap-4",
                    style: { pointerEvents: 'auto', animationDelay: '3s' }
                }, buttonText, h('span', { className: "animate-pulse inline-block text-3xl md:text-4xl" }, "→"))
            );
        };

        // 7. Roadmap Text
        const renderRoadmapText = () => {
            return h('p', { className: "text-slate-400 text-center mt-8 mb-2 w-full max-w-5xl mx-auto px-2 font-medium animate-pulse text-xs md:text-lg md:whitespace-nowrap leading-tight" },
                "Your personalized roadmap begins here. Please answer calibration questions to align your child’s profile."
            );
        };

        // 8. Question Embed
        const renderQuestionEmbed = () => {
            return h('div', { className: "mt-4 w-full max-w-4xl bg-slate-900/50 border border-slate-700/50 p-8 md:p-12 rounded-[40px] backdrop-blur-xl" },
                h('div', { className: "text-center mb-10" },
                    h('span', { className: "text-[#FF6B35] font-black uppercase tracking-[0.3em] text-sm" }, "Verification Step 1: Baseline Momentum Audit (Subsidized Access)"),
                    h('h2', { className: "text-white text-2xl md:text-4xl font-extrabold mt-4" }, "How does your child process complex new data?")
                ),
                h('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
                    ["Visual/Charts", "Auditory/Discussion", "Kinesthetic/Build"].map((opt, i) =>
                        h('button', {
                            key: i,
                            onClick: () => handlePhase0OptionClick(i),
                            className: "p-6 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-white font-bold text-xl hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all transform hover:-translate-y-2"
                        }, opt)
                    )
                )
            );
        };

        // 9. Toast
        const renderToast = () => {
            return h(AnimatePresence, {},
                showToast && h(motion.div, {
                    initial: { x: 400, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                    exit: { x: 400, opacity: 0 },
                    className: "fixed bottom-8 right-8 z-[10000] bg-white p-6 rounded-3xl shadow-2xl border-l-[8px] border-[#FF6B35] max-w-xs"
                },
                    h('button', { onClick: () => setShowToast(false), className: "absolute top-4 right-4 text-slate-400 hover:text-slate-600" }, "✕"),
                    h('p', { className: "text-slate-900 font-bold leading-tight mb-4" }, "Ready to see which board fits your child's personality? (Takes 2 mins)"),
                    h('button', {
                        onClick: () => { triggerStart(0); setShowToast(false); },
                        className: "w-full bg-[#FF6B35] text-white py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    }, "Start Now")
                )
            );
        };

        return h(Fragment, {},
            h('section', { className: "relative pt-32 pb-20 px-4 overflow-hidden bg-[#0F172A] min-h-[95vh] flex flex-col items-center" },
                renderTopButtons(),
                renderBranding(),
                renderHeadline(),
                renderSubtext(),
                renderSocialProof(),
                renderCTA(),
                renderRoadmapText(),
                renderQuestionEmbed(),
                h('div', { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" }),
                h('div', { className: "absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none" })
            ),
            renderToast()
        );
    };

    window.Hero = Hero; // Expose to window

    // Initialize
    window.addEventListener('load', () => {
        const container = document.getElementById('react-hero-root');
        if (container) {
            const root = ReactDOM.createRoot(container);
            root.render(h(Hero));
        }
    });

})();

// Comprehensive Hero Component Overhaul - Functional & UI & Momentum
// Transpiled manually to remove Babel dependency
(function () {
    const { useState, useEffect, useRef } = React;
    // Safe Fallback for Framer Motion
    const MotionLib = window.Motion || window.FramerMotion || {};
    const motion = MotionLib.motion || new Proxy({}, {
        get: (target, prop) => prop // Fallback: motion.div -> 'div'
    });
    const AnimatePresence = MotionLib.AnimatePresence || (({ children }) => children);
    const h = React.createElement;
    const Fragment = React.Fragment;

    const Hero = () => {
        const slides = [
            { prefix: "STOP", word: "Worrying", pColor: "text-red-500", wColor: "text-white" },
            { prefix: "STOP", word: "Doubting", pColor: "text-red-500", wColor: "text-white" },
            { prefix: "STOP", word: "Guessing", pColor: "text-red-500", wColor: "text-white" },
            { prefix: "START", word: "Knowing", pColor: "text-green-500", wColor: "text-[#FF6B35]" }
        ];
        const [index, setIndex] = useState(0);
        const currentYear = new Date().getFullYear();
        const targetYear = new Date() < new Date(`${currentYear}-03-31`) ? currentYear : currentYear + 1;
        const [buttonText, setButtonText] = useState(`Start ${targetYear} Grade 1 Admission Decoder Scan`);
        const [showToast, setShowToast] = useState(false);
        const [showStickyCTA, setShowStickyCTA] = useState(false);

        // Narrative Build State: Always 2 (Main Hero Visible Immediately)
        const [introState, setIntroState] = useState(2);

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

        // Rotation Timer (Active immediately)
        useEffect(() => {
            const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 2000);
            return () => clearInterval(timer);
        }, []);

        // Narrative Build Timeline REMOVED - Instant Load


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
                console.warn("[Hero] initializeQuizShell missing. Retrying...");
                // Retry once after 200ms
                setTimeout(() => {
                    if (typeof window.initializeQuizShell === 'function') {
                        window.initializeQuizShell(startAtIndex);
                    } else {
                        console.error("[Hero] initializeQuizShell Failed to Load.");
                        alert("System is still loading. Please wait 2 seconds and try again.");
                    }
                }, 500); // Increased timeout to 500ms
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

        // --- RENDER HELPERS ---

        // 1. Top Left Logo (New)
        const renderTopLeftLogo = () => {
            return h('div', { className: "absolute top-6 left-6 z-[100]" },
                h('div', {
                    className: "flex flex-col items-start leading-none opacity-90 hover:opacity-100 transition-opacity cursor-pointer",
                    onClick: () => window.location.reload()
                },
                    h('h1', { className: "text-2xl md:text-3xl font-black text-white tracking-tighter" },
                        "Apt ", h('span', { className: "text-[#FF6B35]" }, "Skola")
                    ),
                    h('span', { className: "text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-1" },
                        "A Foviz Venture"
                    )
                )
            );
        };

        // 1.5 Top Right Social Proof (New)
        const renderTopRightSocialProof = () => {
            return h('div', { className: "absolute top-6 right-6 z-[100] flex items-center gap-2" },
                h('div', { className: "w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse shadow-[0_0_8px_#FF6B35]" }),
                h('p', { className: "text-[10px] font-bold text-white uppercase tracking-wider leading-none", style: { fontFamily: "'Inter', sans-serif" } },
                    h('span', { className: "micro-mobile-only text-[#FF6B35]" }, "2.4K+ Families"),
                    h('span', { className: "micro-mobile-hidden" }, "2,400+ Families Audited")
                )
            );
        };

        // Narrative Intro Header (Persistent Horizontal)
        // Narrative Intro Header (Persistent Horizontal)
        const renderNarrativeHeader = () => {
            return h('div', { className: "mt-8 w-full flex flex-col items-center justify-center z-40 min-h-[80px]" },
                h('div', { className: "flex flex-col md:flex-row items-center gap-4 md:gap-8" },

                    // Part 1: "Best" Question (Static)
                    h('div', {
                        className: "text-center md:text-right"
                    },
                        h('p', { className: "text-2xl md:text-5xl font-bold text-slate-500" },
                            "What is the ",
                            h('span', { className: "font-black text-white relative" }, "Best"),
                            " Board?"
                        )
                    ),

                    // Part 2: "Vs" Bounce (Static Container, Animated Inner)
                    h('div', {
                        className: "relative cursor-pointer",
                        onClick: () => triggerStart(0)
                    },
                        h('div', { className: "w-12 h-12 md:w-16 md:h-16 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,107,53,0.6)] animate-bounce hover:scale-110 transition-transform" },
                            h('span', { className: "text-white font-black text-lg md:text-xl italic" }, "Vs")
                        )
                    ),


                    // Part 3: "Suits" Answer (Static)
                    h('div', {
                        className: "text-center md:text-left"
                    },
                        h('p', { className: "text-xl md:text-5xl font-bold text-slate-200 whitespace-nowrap" },
                            "What ",
                            h('span', { className: "font-black text-[#FF6B35] tracking-wide", style: { fontFamily: "'Montserrat', sans-serif" } }, "Suits"),
                            " your child?"
                        )
                    )
                )
            );
        };


        // 2. Branding Spacer (Removed as Narrative Header assumes position)
        // const renderBrandingSpacer = () => {
        //     return h('div', { className: "h-24 md:h-32" });
        // };


        // 3. Headline
        const renderHeadline = () => {
            const currentSlide = slides[index];
            return h('div', { className: "flex flex-col items-center justify-center gap-2 min-h-[60px] mt-1" },
                // New Headline (Replaces STOP/Worrying)
                h('div', { style: { marginBottom: '0.25rem', fontSize: 'clamp(18px, 5vw, 28px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center', width: '100%' } },
                    h('span', { style: { color: '#94A3B8' } }, "From Enquiring"),
                    h('span', { style: { color: '#94A3B8', fontStyle: 'italic' } }, " to"),
                    h('span', { style: { color: '#FF6B35', fontWeight: 800 } }, " Knowing")
                ),
                h('div', { className: "text-center px-4 max-w-5xl mx-auto mt-6" },
                    /* Subtext Moved */
                    /* Subtext Removed */
                )
            );
        };

        // ... match context ...




        // 4. Subtext (Value Proposition) - REMOVED (Moved to below CTA)
        const renderSubtext = () => {
            return null;
        };

        // 4.5 Feature Block
        const renderFeatures = () => {
            return h('div', { className: "grid grid-cols-3 gap-2 md:gap-8 text-center relative max-w-6xl mx-auto mt-0 md:mt-12 mb-8 px-2" },

                // 1. Clinical Input
                h('div', {
                    className: "p-2 md:p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer",
                    onClick: () => window.showDeepDive && window.showDeepDive('input')
                },
                    h('h4', { className: "text-[#FF6B35] font-bold text-[10px] uppercase tracking-[2px] font-['Montserrat'] mb-2 flex items-center justify-center gap-1" },
                        "THE INPUT ", h('span', { className: "text-[8px] opacity-60" }, "ⓘ")
                    ),
                    h('div', { className: "mb-4 flex justify-center" },
                        h('div', { className: "text-5xl filter drop-shadow-md animate-pulse-slow" }, "🧠")
                    ),
                    h('h3', { className: "text-xs md:text-xl font-black text-slate-900 mb-1 md:mb-2" }, "Clinical Input"),
                    h('p', { className: "hidden md:block text-slate-600 text-xs md:text-sm leading-relaxed" }, "15 psychometric parameters to map your child's naturally dominant learning DNA.")
                ),

                // 2. Neural Calibration
                h('div', {
                    className: "p-2 md:p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer",
                    onClick: () => window.showDeepDive && window.showDeepDive('process')
                },
                    h('h4', { className: "text-[#FF6B35] font-bold text-[10px] uppercase tracking-[2px] font-['Montserrat'] mb-2 flex items-center justify-center gap-1" },
                        "THE PROCESS ", h('span', { className: "text-[8px] opacity-60" }, "ⓘ")
                    ),
                    h('div', { className: "mb-4 flex justify-center" },
                        h('svg', { className: "w-14 h-14 text-slate-800 animate-spin-slow", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" },
                            h('circle', { cx: "12", cy: "12", r: "3" }),
                            h('path', { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
                        )
                    ),
                    h('h3', { className: "text-xs md:text-xl font-black text-slate-900 mb-1 md:mb-2" }, "Neural Link"),
                    h('p', { className: "hidden md:block text-slate-600 text-xs md:text-sm leading-relaxed" }, "Forensic analysis of your child's traits vs. rigid NEP, CBSE, ICSE, and IB frameworks.")
                ),

                // 3. Actionable Roadmap
                h('div', {
                    className: "p-2 md:p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer",
                    onClick: () => window.showDeepDive && window.showDeepDive('output')
                },
                    h('h4', { className: "text-[#FF6B35] font-bold text-[10px] uppercase tracking-[2px] font-['Montserrat'] mb-2 flex items-center justify-center gap-1" },
                        "THE OUTPUT ", h('span', { className: "text-[8px] opacity-60" }, "ⓘ")
                    ),
                    h('div', { className: "mb-4 flex justify-center" },
                        h('svg', { className: "w-14 h-14 text-[#F59E0B] animate-folder-float", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                            h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" })
                        )
                    ),
                    h('h3', { className: "text-xs md:text-xl font-black text-slate-900 mb-1 md:mb-2" }, "Roadmap"),
                    h('p', { className: "hidden md:block text-slate-600 text-xs md:text-sm leading-relaxed" }, "A Forensic Audit & Alignment Report delivered instantly to your inbox.")
                )
            );
        };

        // 5. Social Proof Banner (Full Width)
        const renderSocialProof = () => {
            return h('div', { className: "w-[calc(100%+2rem)] -mx-4 bg-slate-900 border-y border-slate-800 py-4 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-8" },
                h('p', { className: "text-white text-sm md:text-base font-medium text-center md:text-left" },
                    h('span', { className: "text-[#FF6B35] font-bold" }, "2,400+ Families"),
                    " across India’s Top Tier Cities have synced their child’s future."
                ),
                h('div', { className: "flex items-center gap-6 text-slate-500 font-bold text-sm tracking-widest uppercase" },
                    h('span', {}, "CBSE"),
                    h('span', {}, "ICSE"),
                    h('span', {}, "IB"),
                    h('span', {}, "IGCSE")
                )
            );
        };

        // 6. CTA Button (Split Action)
        const renderCTA = () => {
            return h('div', { className: "relative mt-4 z-[40] flex flex-col gap-4 items-center w-full max-w-2xl px-4" },
                // Primary Button
                h('div', { className: "relative group w-full md:w-auto" },
                    h('div', { className: "absolute -inset-1 bg-gradient-to-r from-[#FF6B35] to-yellow-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000" }),
                    h('button', {
                        onClick: () => triggerStart(0),
                        className: "unstoppable-cta neural-pulse w-full relative bg-[#FF6B35] text-white px-8 py-5 rounded-full font-black text-xl md:text-2xl shadow-none haptic-shadow overflow-hidden transition-all duration-300 ease-out border-b-[4px] border-orange-800 flex items-center justify-center gap-2",
                        style: { pointerEvents: 'auto' }
                    },
                        // Radar Sweep Light
                        h('div', { className: "radar-beam" }),
                        "Initiate Forensic Sync Scan",
                        h('span', { className: "animate-pulse" }, "→"))
                ),
            );
        };

        // 7. Roadmap Text
        const renderRoadmapText = () => {
            return h(Fragment, {},
                h('p', { className: "text-[#FF6B35] font-black text-xl md:text-3xl mb-4 mt-12 tracking-normal text-center drop-shadow-lg leading-tight" },
                    "School Board Selection is a 15 Year Financial & Academic Commitment."
                ),
                h('p', { className: "text-slate-400 text-center mt-2 mb-2 w-full max-w-5xl mx-auto px-2 font-medium animate-pulse text-xs md:text-lg md:whitespace-nowrap leading-tight" },
                    "Your personalized roadmap begins here. Please answer calibration questions to align your child’s profile."
                )
            );
        };

        // 8. Question Embed
        const renderQuestionEmbed = () => {
            return h('div', { className: "mt-4 w-full max-w-4xl bg-slate-900/50 p-8 md:p-12 rounded-[40px] backdrop-blur-xl shadow-2xl" },
                h('div', { className: "text-center" },
                    h('h2', { className: "text-white text-2xl md:text-4xl font-extrabold mt-4 md:whitespace-nowrap" }, "How does your child process complex new data?")
                ),
                h('div', { className: "w-full h-px bg-slate-700/50 my-8" }), // Separator
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
                    h('p', { className: "text-slate-900 font-bold leading-tight mb-4" }, "Ready to see which board fits your child's personality? (Takes 5 mins)"),
                    h('button', {
                        onClick: () => { triggerStart(0); setShowToast(false); },
                        className: "w-full bg-[#FF6B35] text-white py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    }, "Start Now")
                )
            );
        };

        // 10. Sticky CTA (New)
        const renderStickyCTA = () => {
            return h(AnimatePresence, {},
                showStickyCTA && h(motion.div, {
                    initial: { y: 100, opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                    exit: { y: 100, opacity: 0 },
                    className: "fixed bottom-0 left-0 w-full z-[99999] bg-slate-50 border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] px-4 py-3 md:py-4 md:px-8 flex items-center justify-between"
                },
                    h('div', {},
                        h('span', { className: "block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5" }, "Don't Guess"),
                        h('h3', { className: "text-slate-900 font-black text-sm md:text-xl leading-none" }, "Sync your child's future")
                    ),
                    h('button', {
                        onClick: () => triggerStart(0),
                        className: "bg-[#FF6B35] text-white px-5 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                    },
                        "Initiate Scan ",
                        h('span', { className: "hidden md:inline" }, "→")
                    )
                )
            );
        };

        return h(Fragment, {},
            h('section', { className: "relative pt-12 pb-20 px-4 overflow-hidden bg-[#0F172A] min-h-[95vh] flex flex-col items-center" },
                renderTopLeftLogo(),
                renderTopRightSocialProof(),
                renderNarrativeHeader(),
                h('div', {
                    className: `flex flex-col items-center w-full`
                },
                    // Spacer removed as Narrative Header takes that space now
                    renderHeadline(),
                    renderSubtext(),
                    renderFeatures(),
                    renderCTA(),
                    renderRoadmapText(),
                    renderQuestionEmbed(),
                    renderSocialProof(),

                    // New Buttons After Phase 0
                    h('div', { className: "flex flex-col md:flex-row gap-4 justify-center items-center mt-8 w-full max-w-4xl px-4 animate-fade-in-up" },
                        // 1. Calculator
                        h('button', {
                            onClick: () => window.handleCostCalculatorClick && window.handleCostCalculatorClick(),
                            className: "group px-6 py-3 rounded-xl font-bold text-slate-100 border border-slate-500 bg-slate-800/60 hover:border-[#FF6B35] hover:text-white hover:bg-slate-800/80 transition-all text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm"
                        },
                            h('span', { className: "text-lg transition-all" }, "🧮"),
                            " Calculate 'School Switch'"
                        ),
                        // 2. Sync Check
                        h('button', {
                            onClick: () => window.openSyncMatchGate && window.openSyncMatchGate(),
                            className: "group px-6 py-3 rounded-xl font-bold text-slate-100 border border-slate-500 bg-slate-800/60 hover:border-[#FF6B35] hover:text-white hover:bg-slate-800/80 transition-all text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm"
                        },
                            h('span', { className: "text-lg transition-all" }, "🔐"),
                            " Unlock Parent & Child Sync Check"
                        ),
                        // 3. Forensic Report
                        h('a', {
                            href: "https://xray.aptskola.com",
                            target: "_blank",
                            className: "group px-6 py-3 rounded-xl font-bold text-slate-100 border border-slate-500 bg-slate-800/60 hover:border-[#FF6B35] hover:text-white hover:bg-slate-800/80 transition-all text-sm flex items-center gap-2 no-underline text-center shadow-lg backdrop-blur-sm"
                        },
                            h('span', { className: "text-lg transition-all" }, "🔎"),
                            " School/College Forensic Report"
                        )
                    )
                ),
                h('div', { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" }),
                h('div', { className: "absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none" })
            ),
            renderToast(),
            renderStickyCTA()
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

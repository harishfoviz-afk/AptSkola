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

        // --- BOARD DATA CONSTANTS ---
        const BOARD_DATA = {
            'CBSE': {
                name: 'CBSE',
                tagline: 'The "National Standard"',
                cognitiveAlignment: 72,
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
                cognitiveAlignment: 88,
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
                cognitiveAlignment: 81,
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
                cognitiveAlignment: 76,
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
        const [selectedBoard, setSelectedBoard] = useState(null); // New State for Modal
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
                        h('p', { className: "text-2xl md:text-4xl font-bold text-slate-500" },
                            "What is the ",
                            h('span', { className: "font-black text-white line-through relative decoration-4 decoration-red-500" }, "BEST"),
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


                    h('div', {
                        className: "text-center md:text-left"
                    },
                        h('p', { className: "text-xl md:text-4xl font-bold text-slate-200 whitespace-nowrap" },
                            "What ",
                            h('span', { className: "font-black text-[#10B981] tracking-wide", style: { fontFamily: "'Montserrat', sans-serif" } }, "SUITS"),
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
            return h('div', { className: "flex flex-col items-center justify-center gap-2 min-h-[60px] text-center px-4 max-w-5xl mx-auto mt-1" },
                // New Headline (Replaces STOP/Worrying)
                h('div', { style: { marginBottom: '0.25rem', fontSize: 'clamp(18px, 5vw, 28px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center', width: '100%' } },
                    h('span', { className: "text-slate-400" }, "From Enquiring "),
                    // Animated Arrow (Replaces "to")
                    h('span', {
                        className: "arrow-pulse text-[#FF6B35] font-black text-2xl md:text-3xl relative top-[2px]",
                        style: { display: 'inline-block' }
                    }, "→"),
                    h('span', { className: "text-[#FF6B35] font-extrabold" }, " Knowing")
                ),
                h('div', { className: "text-center px-4 max-w-5xl mx-auto mt-6" },
                    /* SEARCHING FIRST */
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
            return h('div', { className: "grid grid-cols-3 gap-2 md:gap-8 text-center relative max-w-6xl mx-auto mt-0 md:mt-4 mb-4 px-2" },

                // 1. Clinical Input
                h('div', {
                    className: "p-2 md:p-6 rounded-2xl bg-white shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer",
                    onClick: () => window.showDeepDive && window.showDeepDive('input')
                },
                    h('h4', { className: "text-[#FF6B35] font-bold text-[10px] uppercase tracking-[2px] font-['Montserrat'] mb-2 flex items-center justify-center gap-1" },
                        "THE INPUT"
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
                        "PROCESS"
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
                        "THE OUTPUT"
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
                    " across India's Top Tier Cities have synced their child's future."
                ),
                h('div', { className: "flex items-center gap-6 text-white font-bold text-sm tracking-widest uppercase" },
                    h('span', { onClick: () => setSelectedBoard('CBSE'), className: "cursor-pointer hover:text-[#FF6B35] transition-colors underline" }, "CBSE"),
                    h('span', { onClick: () => setSelectedBoard('ICSE'), className: "cursor-pointer hover:text-[#FF6B35] transition-colors underline" }, "ICSE"),
                    h('span', { onClick: () => setSelectedBoard('IB'), className: "cursor-pointer hover:text-[#FF6B35] transition-colors underline" }, "IB"),
                    h('span', { onClick: () => setSelectedBoard('IGCSE'), className: "cursor-pointer hover:text-[#FF6B35] transition-colors underline" }, "IGCSE")
                )
            );
        };

        // 6. CTA Button (Personalized Teaser)
        const renderCTA = () => {
            return h('div', { className: "relative mt-4 z-[40] flex flex-col gap-4 items-center w-full max-w-2xl px-4" },
                h('div', { className: "relative group w-full md:w-auto" },
                    h('div', { className: "inline-flex flex-col md:flex-row items-center justify-center bg-[#FF6B35] border-2 border-orange-600 rounded-full px-6 py-4 shadow-xl hover:shadow-2xl transition-all gap-3 md:gap-0 w-full" },
                        h('span', { className: "text-white font-black text-lg whitespace-nowrap" }, "Begin"),

                        h('div', { className: "relative mx-2 w-full md:w-auto" },
                            h('input', {
                                type: "text",
                                id: "heroChildNameMain",
                                placeholder: "Child's Name",
                                className: "bg-transparent border-dots-pulse-white text-white font-black text-center w-32 md:w-40 py-1 focus:outline-none placeholder-white/60 transition-colors",
                                onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        const val = e.target.value;
                                        if (window.startQuizWithName) window.startQuizWithName(val);
                                        else triggerStart(0);
                                    }
                                }
                            })
                        ),

                        h('span', { className: "text-white font-black text-lg whitespace-nowrap" }, "'s Learning DNA Calibration"),

                        h('button', {
                            onClick: () => {
                                const val = document.getElementById('heroChildNameMain').value;
                                if (window.startQuizWithName) window.startQuizWithName(val);
                                else triggerStart(0);
                            },
                            className: "mt-3 md:mt-0 md:ml-4 bg-white text-[#FF6B35] rounded-full p-3 hover:scale-110 active:scale-90 transition-transform shadow-lg"
                        },
                            h('svg', { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M14 5l7 7m0 0l-7 7m7-7H3" })
                            )
                        )
                    )
                )
            );
        };

        // 7. Roadmap Text
        const renderRoadmapText = () => {
            return h(Fragment, {},
                h('p', { className: "text-[#FF6B35] font-black text-xl md:text-3xl mb-4 mt-4 tracking-normal text-center drop-shadow-lg leading-tight" },
                    "School Board Selection is a 15 Year Financial & Academic Commitment."
                ),
                h('p', { className: "text-slate-400 text-center mt-2 mb-2 w-full max-w-5xl mx-auto px-2 font-medium animate-pulse text-xs md:text-lg md:whitespace-nowrap leading-tight" },
                    "Your personalized roadmap begins here. Please answer calibration questions to align your child’s profile."
                )
            );
        };

        // 8. Forensic Teaser Card (New Hybrid)
        const renderQuestionEmbed = () => {
            return h('div', { className: "mt-8 w-full max-w-4xl bg-slate-900/80 border border-[#FF6B35] rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_20px_rgba(255,107,53,0.3)] transform transition-all hover:scale-[1.01]" },

                // 1. Icons Split
                h('div', { className: "flex justify-center gap-8 md:gap-16 mb-6" },
                    // Fractal Icon (Big Picture)
                    h('div', { className: "text-center group cursor-pointer" },
                        h('div', { className: "w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 text-[#FF6B35] shadow-[0_0_15px_#FF6B35] rounded-full flex items-center justify-center bg-slate-800 group-hover:bg-[#FF6B35] group-hover:text-white transition-all duration-300" },
                            h('svg', { className: "w-6 h-6 md:w-8 md:h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" })
                            )
                        ),
                        h('p', { className: "text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider group-hover:text-white transition-colors" }, "Big Picture")
                    ),

                    // Ladder Icon (Fine Print)
                    h('div', { className: "text-center group cursor-pointer" },
                        h('div', { className: "w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 text-[#3B82F6] shadow-[0_0_15px_#3B82F6] rounded-full flex items-center justify-center bg-slate-800 group-hover:bg-[#3B82F6] group-hover:text-white transition-all duration-300" },
                            h('svg', { className: "w-6 h-6 md:w-8 md:h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" })
                            )
                        ),
                        h('p', { className: "text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider group-hover:text-white transition-colors" }, "Fine Print")
                    )
                ),

                // 2. Headline & Subtext
                h('div', { className: "text-center mb-6" },
                    h('h3', { className: "text-white font-bold text-xl md:text-2xl mb-3 leading-tight" },
                        "Is your child’s brain wired for ",
                        h('br', { className: "hidden md:block" }),
                        " The Big Picture or The Fine Print?"
                    ),
                    h('p', { className: "text-slate-300 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-medium" },
                        "Methodologies like IB demand ",
                        h('span', { className: "text-[#FF6B35]" }, "Pattern-Seeking (The Big Picture)"),
                        ", while CBSE rewards ",
                        h('span', { className: "text-[#3B82F6]" }, "Sequential-Logic (The Fine Print)"),
                        ". Choosing the wrong board creates a 'Cognitive Friction' that no amount of tutoring can fix."
                    )
                ),

                // 3. Micro-CTA (Name Input)
                h('div', { className: "text-center" },
                    h('div', { className: "inline-flex flex-col md:flex-row items-center justify-center bg-slate-800 border border-slate-600 rounded-2xl md:rounded-full px-6 py-4 shadow-lg hover:border-[#FF6B35] transition-all gap-3 md:gap-0" },
                        h('span', { className: "text-white font-bold text-sm whitespace-nowrap" }, "Start"),

                        h('div', { className: "relative mx-2 w-full md:w-auto" },
                            h('input', {
                                type: "text",
                                id: "heroChildName2", // Unique ID
                                placeholder: "Child's Name",
                                className: "bg-transparent border-dots-pulse text-[#FF6B35] font-bold text-center w-32 md:w-40 py-1 focus:outline-none placeholder-slate-600 transition-colors",
                                onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        const val = e.target.value;
                                        if (window.startQuizWithName) window.startQuizWithName(val);
                                        else triggerStart(0);
                                    }
                                }
                            })
                        ),

                        h('span', { className: "text-white font-bold text-sm whitespace-nowrap" }, "’s learning Mapping for FREE"),

                        h('button', {
                            onClick: () => {
                                const val = document.getElementById('heroChildName2').value;
                                if (window.startQuizWithName) window.startQuizWithName(val);
                                else triggerStart(0);
                            },
                            className: "mt-3 md:mt-0 md:ml-4 bg-[#FF6B35] text-white rounded-full p-2 hover:scale-110 active:scale-90 transition-transform shadow-lg"
                        },
                            h('svg', { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M14 5l7 7m0 0l-7 7m7-7H3" })
                            )
                        )
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

        // 11. Board Modal (Glassmorphism)
        const renderBoardModal = () => {
            return h(AnimatePresence, {},
                selectedBoard && h(motion.div, {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: "fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                },
                    h(motion.div, {
                        initial: { scale: 0.9, opacity: 0 },
                        animate: { scale: 1, opacity: 1 },
                        exit: { scale: 0.9, opacity: 0 },
                        className: "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/80 border border-[#FF6B35] rounded-3xl p-6 md:p-10 shadow-2xl custom-scrollbar",
                        style: { backdropFilter: "blur(12px)" }
                    },
                        // Close Button
                        h('button', {
                            onClick: () => setSelectedBoard(null),
                            className: "absolute top-4 right-4 text-slate-400 hover:text-white"
                        }, "✕"),

                        // Header
                        h('h2', { className: "text-2xl md:text-3xl font-black text-white mb-1" }, BOARD_DATA[selectedBoard].name),
                        h('p', { className: "text-[#FF6B35] font-bold uppercase tracking-widest text-sm mb-6" }, BOARD_DATA[selectedBoard].tagline),

                        // Content Grid
                        h('div', { className: "space-y-6 text-left" },
                            // Cognitive Alignment Badge
                            h('div', { className: "bg-[#FF6B35]/20 border border-[#FF6B35] rounded-xl p-4 text-center" },
                                h('p', { className: "text-white font-black text-lg" },

                                    h('span', { className: "text-[#FF6B35]" }, BOARD_DATA[selectedBoard].cognitiveAlignment + "% Cognitive Alignment"),
                                    " required."
                                ),
                                h('p', { className: "text-emerald-400 font-bold text-sm mt-2 animate-pulse" }, "⚡ Check your child's fitment below")
                            ),
                            // Methodology
                            h('div', {},
                                h('h4', { className: "text-slate-300 font-bold uppercase text-xs mb-1" }, "The Methodology"),
                                h('p', { className: "text-slate-100 text-sm leading-relaxed" }, BOARD_DATA[selectedBoard].methodology)
                            ),
                            // Forensic Reality
                            h('div', {},
                                h('h4', { className: "text-slate-300 font-bold uppercase text-xs mb-1" }, "The Forensic Reality"),
                                h('p', { className: "text-slate-100 text-sm leading-relaxed" }, BOARD_DATA[selectedBoard].forensicReality)
                            ),
                            // Risk Profile
                            h('div', { className: "bg-red-500/10 border border-red-500/30 p-4 rounded-xl" },
                                h('h4', { className: "text-red-400 font-bold uppercase text-xs mb-3" }, "Forensic Risk Profile"),
                                BOARD_DATA[selectedBoard].risks.map((risk, i) =>
                                    h('div', { key: i, className: "mb-3 last:mb-0" },
                                        h('strong', { className: "text-white text-sm" }, "⚠️ " + risk.title + ": "),
                                        h('span', { className: "text-slate-300 text-sm" }, risk.text)
                                    )
                                )
                            ),
                            // Stat
                            h('div', { className: "bg-[#FF6B35]/10 border border-[#FF6B35]/30 p-3 rounded-lg flex items-start gap-3" },
                                h('span', { className: "text-xl" }, "📊"),
                                h('p', { className: "text-slate-200 text-xs font-medium italic" },
                                    h('strong', { className: "text-[#FF6B35]" }, "Apt Skola Stat: "),
                                    BOARD_DATA[selectedBoard].stat
                                )
                            )
                        ),

                        // Footer Buttons - REPLACED WITH ONE BUTTON
                        h('div', { className: "mt-8 pt-6 border-t border-slate-700 w-full flex flex-col gap-3" },
                            h('button', {
                                onClick: () => window.showDeepDive && window.showDeepDive('output'),
                                className: "w-full py-3 px-6 rounded-xl border-2 border-[#FF6B35] text-[#FF6B35] font-bold text-sm md:text-lg hover:bg-[#FF6B35] hover:text-white transition-all flex items-center justify-center gap-2"
                            },
                                h('span', { className: "text-xl" }, "📄"),
                                " View Sample Report"
                            ),
                            h('button', {
                                onClick: () => { setSelectedBoard(null); triggerStart(0); },
                                className: "w-full py-4 px-6 rounded-xl bg-[#FF6B35] text-white font-black text-sm md:text-lg hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(255,107,53,0.4)] flex items-center justify-center gap-2"
                            },
                                "See how my child's Learning Style fits into the " + BOARD_DATA[selectedBoard].name,
                                h('span', { className: "animate-pulse" }, "→")
                            )
                        )
                    )
                )
            );
        };

        // 12. Render Board Grid (Refactored)
        const renderBoardGrid = () => {
            return h('div', { className: "mb-4 mt-4 text-center w-full max-w-lg mx-auto px-4 relative" },
                // ADMISSION SPECIAL STICKER
                h('div', {
                    className: "absolute -right-6 -top-10 md:-right-16 md:-top-12 z-20 transform rotate-12 hover:rotate-0 transition-transform duration-300 cursor-pointer group",
                    onClick: () => triggerStart(0)
                },
                    h('div', { className: "relative w-24 h-24 md:w-28 md:h-28 bg-[#0F172A] rounded-full border-2 border-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center overflow-hidden" },
                        // Rotating Text Ring
                        h('div', { className: "absolute inset-0 animate-spin-slow-linear w-full h-full" },
                            h('svg', { viewBox: "0 0 100 100", className: "w-full h-full" },
                                h('defs', {},
                                    h('path', { id: "circlePath", d: "M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" })
                                ),
                                h('text', { fill: "#F59E0B", fontSize: "8.5", fontWeight: "bold", letterSpacing: "1.2" },
                                    h('textPath', { href: "#circlePath" },
                                        "• ADMISSION SPECIAL • PURE SCIENCE"
                                    )
                                )
                            )
                        ),
                        // Inner Content
                        h('div', { className: "relative z-10 flex flex-col items-center justify-center leading-none mt-1" },
                            h('span', { className: "text-[10px] md:text-xs text-slate-400 line-through decoration-red-500 decoration-2 font-bold opacity-80" }, "₹499"),
                            h('span', { className: "text-xl md:text-2xl font-black text-white drop-shadow-md" }, "₹19")
                        )
                    )
                ),

                // Status Indicator Tag
                h('div', { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4" },
                    h('div', { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
                    h('span', { className: "text-emerald-400 font-bold text-[10px] uppercase tracking-widest" }, "Real-Time Board Volatility Index: Active")
                ),

                // Section Label
                h('p', {
                    className: "text-white font-bold mb-3 uppercase text-center",
                    style: { fontSize: '11px', letterSpacing: '1.5px', textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }
                }, "Select a board to view its Methodology & Risk Profile"),

                // Board Button Grid
                h('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-3" },
                    Object.keys(BOARD_DATA).map(boardKey =>
                        h('button', {
                            key: boardKey,
                            onClick: () => setSelectedBoard(boardKey),
                            className: "py-3 px-2 rounded-xl text-[10px] md:text-sm font-bold transition-all duration-300",
                            style: {
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid #FFFFFF',
                                color: '#94A3B8'
                            },
                            onMouseEnter: (e) => {
                                e.currentTarget.style.borderColor = '#FF6B35';
                                e.currentTarget.style.color = '#FFFFFF';
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 107, 53, 0.2)';
                            },
                            onMouseLeave: (e) => {
                                e.currentTarget.style.borderColor = '#FFFFFF';
                                e.currentTarget.style.color = '#94A3B8';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }, boardKey)
                    )
                )
            );
        };

        return h(Fragment, {},
            h('section', { className: "relative pt-14 pb-12 px-4 overflow-hidden bg-[#0F172A] min-h-[95dvh] flex flex-col items-center" },
                renderTopLeftLogo(),
                renderTopRightSocialProof(),
                renderNarrativeHeader(),
                h('div', {
                    className: `flex flex-col items-center w-full`
                },
                    // Spacer removed as Narrative Header takes that space now
                    renderHeadline(),
                    renderBoardGrid(), // Moved Here
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
                            " School Switch Cost"
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
            renderStickyCTA(),
            renderBoardModal()
        );
    };

    window.Hero = Hero; // Expose to window

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('react-hero-root');
        if (container) {
            // OPTIMIZATION: Use hydrateRoot for LCP preservation
            // If hydration matches static HTML, this eliminates the white flash
            const root = ReactDOM.hydrateRoot(container, h(Hero));
            // root.render is not needed with hydrateRoot, it returns the root for updates if needed
            // But for initial hydration: ReactDOM.hydrateRoot(domNode, reactNode)
        }
    });

})();

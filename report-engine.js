// js/report-engine.js
// Handles complex report generation and visualization logic
// Loaded separately to reduce initial main-thread blocking time.

(function (global) {
    console.log("Report Engine Loaded");

    // --- HELPER: Calculate Learning Style (Phase 1) ---
    // --- HELPER: Calculate Learning Style (Phase 1) ---
    global.calculateLearningStylePhase1 = function (answers) {
        let scores = { 'Visual': 0, 'Auditory': 0, 'Kinesthetic': 0, 'Reading/Writing': 0 };

        // Check if ANY relevant answers exist
        const hasData = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12'].some(k => answers && answers[k]);

        if (!hasData) {
            // Return a realistic "Default/Sample" profile instead of flat 25%
            return {
                scores: { 'Visual': 35, 'Auditory': 25, 'Kinesthetic': 20, 'Reading/Writing': 20 },
                primary: 'Visual'
            };
        }

        const getAns = (key) => answers && answers[key] ? parseInt(answers[key]) : 1; // Default to 1 (neutral) if missing to avoid 0s

        // Visual Schema
        scores['Visual'] = getAns('q1') + getAns('q2') + getAns('q3');

        // Auditory Schema
        scores['Auditory'] = getAns('q4') + getAns('q5') + getAns('q6');

        // Kinesthetic Schema
        scores['Kinesthetic'] = getAns('q7') + getAns('q8') + getAns('q9');

        // Read/Write Schema
        scores['Reading/Writing'] = getAns('q10') + getAns('q11') + getAns('q12');

        // Calculate Total
        const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;

        // Convert to Percentage
        Object.keys(scores).forEach(k => {
            scores[k] = Math.round((scores[k] / total) * 100);
        });

        // Ensure sum is 100 (handle rounding errors) - simplified for now

        return { scores, primary: Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b) };
    };

    // --- HELPER: Calculate Learning Style (Phase 2) ---
    global.calculateLearningStylePhase2 = function (answers) {
        // Check if ANY relevant Phase 2 answers exist
        const hasData = ['q_p2_1', 'q_p2_2', 'q_p2_3', 'q_p2_4', 'q_p2_5', 'q_p2_6', 'q_p2_7', 'q_p2_8'].some(k => answers && answers[k]);

        if (!hasData) {
            return { 'Visual': 40, 'Auditory': 30, 'Kinesthetic': 15, 'Reading/Writing': 15 };
        }

        let scores = { 'Visual': 0, 'Auditory': 0, 'Kinesthetic': 0, 'Reading/Writing': 0 };
        const getAns = (key) => answers && answers[key] ? parseInt(answers[key]) : 1; // Default to 1

        scores['Visual'] = getAns('q_p2_1') + getAns('q_p2_5');
        scores['Auditory'] = getAns('q_p2_2') + getAns('q_p2_6');
        scores['Kinesthetic'] = getAns('q_p2_3') + getAns('q_p2_7');
        scores['Reading/Writing'] = getAns('q_p2_4') + getAns('q_p2_8');

        // Calculate Total
        const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;

        // Convert to Percentage
        Object.keys(scores).forEach(k => {
            scores[k] = Math.round((scores[k] / total) * 100);
        });

        return scores;
    };

    // --- FORENSIC BLOCK HELPER ---
    global.generateForensicBlock = function (type) {
        const cardClass = "report-card !p-0 overflow-hidden";
        const headerClass = "report-header-bg";
        const headerStyle = "margin: 0;";
        const contentClass = "p-6 space-y-6";

        // --- RENDER BLOCK HELPER for Learning Styles ---
        const renderLearningStyleBlock = (title, scores) => {
            // Find Max for Styling
            let maxVal = -1;
            let winner = '';
            Object.entries(scores).forEach(([key, val]) => {
                if (val > maxVal) { maxVal = val; winner = key; }
            });

            // Helper to get logic for a row
            const getRow = (name, pct) => {
                const isWinner = (name === winner);
                // Winner: Brand Orange. Loser: Slate/Neutral.
                const labelColor = isWinner ? 'text-[#FF6B35]' : 'text-slate-500';
                const barBg = isWinner ? 'bg-[#FF6B35]' : 'bg-slate-300';
                const pctColor = isWinner ? 'text-[#FF6B35]' : 'text-slate-400';
                const weight = isWinner ? 'font-black' : 'font-medium';

                return `
                    <div>
                        <div class="flex justify-between text-xs uppercase tracking-wider mb-1 ${weight}">
                            <span class="${labelColor}">${name}</span>
                            <span class="${pctColor}">${pct}%</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-2">
                            <div class="${barBg} h-2 rounded-full transition-all duration-1000" style="width: ${pct}%"></div>
                        </div>
                    </div>
                `;
            };

            return `
            <div class="${cardClass}" style="margin-bottom: 25px;">
                <div class="${headerClass}" style="${headerStyle}">
                    ${title}
                </div>
                <div class="${contentClass}">
                    <div class="space-y-4">
                        ${getRow('Visual', scores['Visual'])}
                        ${getRow('Auditory', scores['Auditory'])}
                        ${getRow('Kinesthetic', scores['Kinesthetic'])}
                        ${getRow('Reading/Writing', scores['Reading/Writing'])}
                    </div>
                </div>
            </div>`;
        };

        // --- 1. LEARNING STYLE BLOCK (PHASE 1) ---
        if (type === 'baseline') {
            const { scores } = global.calculateLearningStylePhase1(window.answers || {});
            return renderLearningStyleBlock('🧠 LEARNING STYLE (Baseline)', scores);
        }

        // --- 1B. LEARNING STYLE BLOCK (PHASE 2) ---
        if (type === 'baseline_phase2') {
            const scores = global.calculateLearningStylePhase2(window.answers || {});
            return renderLearningStyleBlock('🧠 LEARNING STYLE (Phase 2 Analysis)', scores);
        }

        // --- 2. RADAR CHARTS (6-Axis Spider Web) ---
        if (type === 'radar_phase1' || type === 'radar_phase2') {
            const cx = 150, cy = 150, rMax = 100;

            // Axis Calculation Helper
            const getPt = (deg, val) => {
                const rad = (deg - 90) * Math.PI / 180;
                // Ensure val is clamped 0.3 to 1.0 for visibility
                const adjVal = Math.max(0.2, Math.min(1.0, val));
                return `${cx + (adjVal * rMax) * Math.cos(rad)},${cy + (adjVal * rMax) * Math.sin(rad)}`;
            };

            // Data Logic
            let s = { "Analytical": 0.5, "Verbal": 0.5, "Spatial": 0.5, "Creative": 0.5, "Numerical": 0.5, "Memory": 0.5 };

            // Use global answers or data
            const answers = window.answers || {};
            const customerData = window.customerData || {};

            if (Object.keys(answers).length > 0) {
                const getScore = (q) => answers[q] !== undefined ? (parseInt(answers[q]) + 1) / 4 : 0.5; // Norm 0-1

                // Phase 1 Mapping (Parent Vision)
                // 1. Calculate STUDENT SCORES (Blue Layer)
                let studentScores = { "Analytical": 0, "Verbal": 0, "Spatial": 0, "Creative": 0, "Numerical": 0, "Memory": 0 };
                if (answers['q1']) {
                    studentScores["Analytical"] = (getScore('q13') + getScore('q14')) / 2;
                    studentScores["Verbal"] = (getScore('q1') + getScore('q7')) / 2;
                    studentScores["Spatial"] = (getScore('q3') + getScore('q8')) / 2;
                    studentScores["Creative"] = (getScore('q6') + getScore('q9')) / 2;
                    studentScores["Numerical"] = (getScore('q2') + getScore('q4')) / 2;
                    studentScores["Memory"] = (getScore('q5') + getScore('q12')) / 2;
                }

                // 2. Calculate BENCHMARK SCORES (Orange Layer - Board Ideal)
                let board = (customerData.manualBoard || customerData.recommendedBoard || "cbse").toLowerCase();
                let benchmarkScores = { "Analytical": 0.7, "Verbal": 0.6, "Spatial": 0.5, "Creative": 0.5, "Numerical": 0.8, "Memory": 0.8 }; // Default CBSE
                if (board.includes('icse')) {
                    benchmarkScores = { "Analytical": 0.8, "Verbal": 0.9, "Spatial": 0.5, "Creative": 0.6, "Numerical": 0.7, "Memory": 0.7 };
                } else if (board.includes('ib')) {
                    benchmarkScores = { "Analytical": 0.9, "Verbal": 0.8, "Spatial": 0.6, "Creative": 0.9, "Numerical": 0.6, "Memory": 0.6 };
                } else if (board.includes('igcse')) {
                    benchmarkScores = { "Analytical": 0.85, "Verbal": 0.7, "Spatial": 0.8, "Creative": 0.8, "Numerical": 0.7, "Memory": 0.6 };
                }

                // Helper to generate points string
                const getPointsString = (scores) => {
                    return [
                        getPt(0, scores["Analytical"]),
                        getPt(60, scores["Verbal"]),
                        getPt(120, scores["Spatial"]),
                        getPt(180, scores["Creative"]),
                        getPt(240, scores["Numerical"]),
                        getPt(300, scores["Memory"])
                    ].join(" ");
                };

                const ptsStudent = getPointsString(studentScores);
                const ptsBenchmark = getPointsString(benchmarkScores);

                return `
                <div class="${cardClass}">
                    <div class="${headerClass}" style="${headerStyle}">
                        🕸️ COGNITIVE RADAR
                    </div>
                    <div class="${contentClass}" style="text-align: center;">
                        <div style="position: relative; width: 300px; height: 300px; margin: 0 auto;">
                            <svg viewBox="0 0 300 300" style="width: 100%; height: 100%;">
                                <!-- 5 Concentric Hexagon Grid -->
                                <polygon points="150,50 236.6,100 236.6,200 150,250 63.4,200 63.4,100" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
                                <polygon points="150,70 219.3,110 219.3,190 150,230 80.7,190 80.7,110" fill="none" stroke="#E2E8F0" stroke-width="1" /> <!-- 80% -->
                                <polygon points="150,90 202,120 202,180 150,210 98,180 98,120" fill="none" stroke="#E2E8F0" stroke-width="1" /> <!-- 60% -->
                                <polygon points="150,110 184.6,130 184.6,170 150,190 115.4,170 115.4,130" fill="none" stroke="#E2E8F0" stroke-width="1" /> <!-- 40% -->
                                <polygon points="150,130 167.3,140 167.3,160 150,170 132.7,160 132.7,140" fill="none" stroke="#E2E8F0" stroke-width="1" /> <!-- 20% -->
                                
                                <!-- Axis Lines -->
                                <line x1="150" y1="50" x2="150" y2="250" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
                                <line x1="63.4" y1="100" x2="236.6" y2="200" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
                                <line x1="63.4" y1="200" x2="236.6" y2="100" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
                                
                                <!-- BENCHMARK POLYGON (Orange Dashed) -->
                                <polygon points="${ptsBenchmark}" style="fill: rgba(255, 107, 53, 0.05); stroke: #FF6B35; stroke-width: 2.5; stroke-dasharray: 6,4;"></polygon>

                                <!-- STUDENT POLYGON (Blue Solid) -->
                                <polygon points="${ptsStudent}" style="fill: rgba(59, 130, 246, 0.35); stroke: #3B82F6; stroke-width: 3;"></polygon>
                                
                                <!-- Labels (Pushed Outside) -->
                                <text x="150" y="35" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Analytical</text>
                                <text x="265" y="90" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Verbal</text>
                                <text x="265" y="220" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Spatial</text>
                                <text x="150" y="270" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Creative</text>
                                <text x="35" y="220" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Numerical</text>
                                <text x="35" y="90" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Memory</text>
                            </svg>
                        </div>
                        <div style="margin-top: 15px; font-size: 0.75rem; color: #64748B; background: #F8FAFC; padding: 8px; border-radius: 6px; display: inline-block;">
                            <span style="color: #FF6B35;">🟧 ${board.toUpperCase()} Benchmark</span> &nbsp;|&nbsp; <span style="color: #3B82F6; font-weight: 700;">🔵 Your Child</span>
                        </div>
                    </div>
                </div>`;
            }

            return '';
        }; // End renderLearningStyleBlock

        // --- 1. LEARNING STYLE BLOCK (PHASE 1) ---
        if (type === 'baseline') {
            const { scores } = global.calculateLearningStylePhase1(window.answers || {});
            return renderLearningStyleBlock('🧠 LEARNING STYLE (Baseline)', scores);
        }

        // --- 1B. LEARNING STYLE BLOCK (PHASE 2) ---
        if (type === 'baseline_phase2') {
            const scores = global.calculateLearningStylePhase2(window.answers || {});
            return renderLearningStyleBlock('🧠 LEARNING STYLE (Phase 2 Analysis)', scores);
        }

        // --- 2. RADAR CHARTS (6-Axis Spider Web) ---
        if (type === 'radar_phase1' || type === 'radar_phase2') {
            const cx = 150, cy = 150, rMax = 100;

            // Axis Calculation Helper
            const getPt = (deg, val) => {
                const rad = (deg - 90) * Math.PI / 180;
                // Ensure val is clamped 0.3 to 1.0 for visibility
                const adjVal = Math.max(0.2, Math.min(1.0, val));
                return `${cx + (adjVal * rMax) * Math.cos(rad)},${cy + (adjVal * rMax) * Math.sin(rad)}`;
            };

            // Data Logic
            let s = { "Analytical": 0.5, "Verbal": 0.5, "Spatial": 0.5, "Creative": 0.5, "Numerical": 0.5, "Memory": 0.5 };

            // Use global answers or data
            const answers = window.answers || {};
            const customerData = window.customerData || {};

            if (Object.keys(answers).length > 0) {
                const getScore = (q) => answers[q] !== undefined ? (parseInt(answers[q]) + 1) / 4 : 0.5; // Norm 0-1

                // 1. Calculate STUDENT SCORES (Blue Layer)
                let studentScores = { "Analytical": 0, "Verbal": 0, "Spatial": 0, "Creative": 0, "Numerical": 0, "Memory": 0 };
                if (answers['q1']) {
                    studentScores["Analytical"] = (getScore('q13') + getScore('q14')) / 2;
                    studentScores["Verbal"] = (getScore('q1') + getScore('q7')) / 2;
                    studentScores["Spatial"] = (getScore('q3') + getScore('q8')) / 2;
                    studentScores["Creative"] = (getScore('q6') + getScore('q9')) / 2;
                    studentScores["Numerical"] = (getScore('q2') + getScore('q4')) / 2;
                    studentScores["Memory"] = (getScore('q5') + getScore('q12')) / 2;
                }

                // 2. Calculate BENCHMARK SCORES (Orange Layer - Board Ideal)
                let board = (customerData.manualBoard || customerData.recommendedBoard || "cbse").toLowerCase();
                let benchmarkScores = { "Analytical": 0.7, "Verbal": 0.6, "Spatial": 0.5, "Creative": 0.5, "Numerical": 0.8, "Memory": 0.8 }; // Default CBSE
                if (board.includes('icse')) {
                    benchmarkScores = { "Analytical": 0.8, "Verbal": 0.9, "Spatial": 0.5, "Creative": 0.6, "Numerical": 0.7, "Memory": 0.7 };
                } else if (board.includes('ib')) {
                    benchmarkScores = { "Analytical": 0.9, "Verbal": 0.8, "Spatial": 0.6, "Creative": 0.9, "Numerical": 0.6, "Memory": 0.6 };
                } else if (board.includes('igcse')) {
                    benchmarkScores = { "Analytical": 0.85, "Verbal": 0.7, "Spatial": 0.8, "Creative": 0.8, "Numerical": 0.7, "Memory": 0.6 };
                }

                // Helper to generate points string
                const getPointsString = (scores) => {
                    return [
                        getPt(0, scores["Analytical"]),
                        getPt(60, scores["Verbal"]),
                        getPt(120, scores["Spatial"]),
                        getPt(180, scores["Creative"]),
                        getPt(240, scores["Numerical"]),
                        getPt(300, scores["Memory"])
                    ].join(" ");
                };

                const ptsStudent = getPointsString(studentScores);
                const ptsBenchmark = getPointsString(benchmarkScores);

                return `
                <div class="${cardClass}">
                    <div class="${headerClass}" style="${headerStyle}">
                        🕸️ COGNITIVE RADAR
                    </div>
                    <div class="${contentClass}" style="text-align: center;">
                        <div style="position: relative; width: 300px; height: 300px; margin: 0 auto;">
                            <svg viewBox="0 0 300 300" style="width: 100%; height: 100%;">
                                <!-- 5 Concentric Hexagon Grid -->
                                <polygon points="150,50 236.6,100 236.6,200 150,250 63.4,200 63.4,100" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
                                <polygon points="150,70 219.3,110 219.3,190 150,230 80.7,190 80.7,110" fill="none" stroke="#E2E8F0" stroke-width="1" /> <!-- 80% -->
                                <polygon points="150,90 202,120 202,180 150,210 98,180 98,120" fill="none" stroke="#E2E8F0" stroke-width="1" /> <!-- 60% -->
                                <polygon points="150,110 184.6,130 184.6,170 150,190 115.4,170 115.4,130" fill="none" stroke="#E2E8F0" stroke-width="1" /> <!-- 40% -->
                                <polygon points="150,130 167.3,140 167.3,160 150,170 132.7,160 132.7,140" fill="none" stroke="#E2E8F0" stroke-width="1" /> <!-- 20% -->
                                
                                <!-- Axis Lines -->
                                <line x1="150" y1="50" x2="150" y2="250" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
                                <line x1="63.4" y1="100" x2="236.6" y2="200" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
                                <line x1="63.4" y1="200" x2="236.6" y2="100" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
                                
                                <!-- BENCHMARK POLYGON (Orange Dashed) -->
                                <polygon points="${ptsBenchmark}" style="fill: rgba(255, 107, 53, 0.05); stroke: #FF6B35; stroke-width: 2.5; stroke-dasharray: 6,4;"></polygon>

                                <!-- STUDENT POLYGON (Blue Solid) -->
                                <polygon points="${ptsStudent}" style="fill: rgba(59, 130, 246, 0.35); stroke: #3B82F6; stroke-width: 3;"></polygon>
                                
                                <!-- Labels (Pushed Outside) -->
                                <text x="150" y="35" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Analytical</text>
                                <text x="265" y="90" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Verbal</text>
                                <text x="265" y="220" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Spatial</text>
                                <text x="150" y="270" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Creative</text>
                                <text x="35" y="220" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Numerical</text>
                                <text x="35" y="90" text-anchor="middle" font-size="11" font-weight="bold" fill="#334155">Memory</text>
                            </svg>
                        </div>
                        <div style="margin-top: 15px; font-size: 0.75rem; color: #64748B; background: #F8FAFC; padding: 8px; border-radius: 6px; display: inline-block;">
                            <span style="color: #FF6B35;">🟧 ${board.toUpperCase()} Benchmark</span> &nbsp;|&nbsp; <span style="color: #3B82F6; font-weight: 700;">🔵 Your Child</span>
                        </div>
                    </div>
                </div>`;
            }
        }

    }; // End generateForensicBlock

})(window);

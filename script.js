// --- CONFIG ---
const RAZORPAY_KEY_ID = "rzp_live_RxHmfgMlTRV3Su";
const GMAPS_API_KEY = "AIzaSyCS0hE4xa32DpKoNs5Na3KDX3HrazBvwiU"; 
const EMAILJS_PUBLIC_KEY = "GJEWFtAL7s231EDrk"; // REPLACE WITH YOUR KEY
const EMAILJS_SERVICE_ID = "0KkpEGHACdzjKCK1wicJj"; // REPLACE WITH YOUR SERVICE ID
const EMAILJS_TEMPLATE_ID = "template_qze00kx"; // REPLACE WITH YOUR TEMPLATE ID

// Prices in PAISE (1 Rupee = 100 Paise)
const PACKAGE_PRICES = { 'Essential': 59900, 'Premium': 99900, 'The Smart Parent Pro': 149900 };

// External Payment Links (Replace these with your actual Razorpay Payment Links)
const PAYMENT_LINKS = {
    599: "https://rzp.io/rzp/fQ0kiUb",
    999: "https://rzp.io/rzp/JSA3F7g",
    1499: "https://rzp.io/rzp/1L9W83a",
    299: "https://rzp.io/rzp/fQ0kiUb"
};


// --- INITIALIZATION ---
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// --- STATE MANAGEMENT ---
let currentQuestion = 0;
let selectedPackage = 'Essential';
let selectedPrice = 599;
let answers = {};
let customerData = {
    orderId: 'N/A',
    childAge: '5-10',
    residentialArea: '',
    pincode: '',
    partnerId: ''
};

let hasSeenDowngradeModal = false;
let isSyncMatchMode = false;
let isManualSync = false;
let syncTimerInterval = null;
let mapsScriptLoaded = false;
let mapsLoadedPromise = null;

// --- UI COMPONENTS (HTML Strings) ---
const xrayCardHtml = `
    <div class="xray-card">
        <h3>Apt Skola Exclusive: AI Forensic School X-ray</h3>
        <div class="price">₹99 <span style="font-size: 0.9rem; color: #64748B; text-decoration: line-through;">₹399</span></div>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 15px;">Spot hidden red flags, library authenticity, and teacher turnover using our proprietary AI vision tool.</p>
        <a href="https://aptskola.com/X-ray" target="_blank" class="btn-xray">Get X-ray (75% OFF)</a>
    </div>
`;

const fovizBannerHtml = `
    <div class="foviz-banner">
        <h3><a href="https://foviz.in" target="_blank" style="color: inherit; text-decoration: none; hover: underline;">Plan the "Next Phase" with 5D Analysis</a></h3>
        <p>Your board choice is Step 1. Foviz Career GPS maps your path to 2040.</p>
    </div>
`;

const ambassadorButtonHtml = `
    <button onclick="openCollaborationModal('Ambassador')" class="btn-ambassador">
        <span>✨</span> Thank you and Be our Ambassadors and earn cash rewards from 300 to 3000 <span>🤝</span><span>✨</span>
    </button>
`;

const manualSyncUI = `
    <div id="manualSyncBlock" style="margin-top: 25px; padding: 20px; border: 2px dashed #CBD5E1; border-radius: 12px; background: #F8FAFC;">
        <h3 style="color: #0F172A; font-size: 1.1rem; font-weight: 700; margin-bottom: 10px;">🔄 Manual Sync Recovery</h3>
        <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 15px;">We couldn't find your session on this device. Please check your Phase 1 PDF report.</p>
        <div class="form-group">
            <label style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Your Recommended Board (from PDF)</label>
            <select id="manualBoardSelect" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <option value="">-- Choose Board --</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="IB">IB</option>
                <option value="Cambridge">Cambridge (IGCSE)</option>
                <option value="State Board">State Board</option>
            </select>
        </div>
        <button onclick="confirmManualSync()" class="custom-cta-button" style="margin-top: 10px; padding: 12px; font-size: 0.95rem;">Sync Manually & Start →</button>
    </div>
`;

// --- DATA MASTERS ---
const MASTER_DATA = { 
    cbse: {
        name: "CBSE",
        title: "The Standardized Strategist",
        persona: "Convergent Thinker",
        profile: "This profile is characterized by strong retention memory, the ability to handle high-volume data processing, and a high comfort level with objective assessment metrics.",
        rejectionReason: "Why not IB? Your child prefers structured outcomes. The ambiguity of the IB 'Constructivist' approach may cause unnecessary anxiety.",
        careerPath: "The Competitive Exam Track (JEE/NEET/UPSC). Grade 9-10 Focus: Foundation building using NCERT. Grade 11-12 Focus: Integrated Coaching or Dummy Schools.",
        philosophy: 'The National Standard for Competitive Success.',
        teachingMethod: 'Structured and textbook-focused (NCERT). Emphasis on retaining facts for entrance exams (JEE/NEET).',
        parentalRole: 'Moderate. Syllabuses are defined. Tutoring is easily outsourced to coaching centers.'
    },
    icse: {
        name: "ICSE",
        title: "The Holistic Communicator",
        persona: "Verbal Analyst",
        profile: "Students with this archetype display high verbal intelligence, strong analytical skills in humanities, and the ability to synthesize disparate pieces of information into a coherent whole.",
        rejectionReason: "Why not CBSE? Your child thrives on narrative and context. The rote-heavy, objective nature of CBSE might stifle their desire for depth.",
        careerPath: "The Creative & Liberal Arts Track (Law/Design/Journalism). Grade 9-10: Strong emphasis on Literature/Arts. Grade 11-12: Portfolio development and wide reading.",
        philosophy: 'The Comprehensive Foundation for Professionals.',
        teachingMethod: 'Volume-heavy and detailed. Focuses on strong English language command and deep theoretical understanding.',
        parentalRole: 'High. The volume of projects and detailed syllabus often requires active parental supervision in younger grades.'
    },
    ib: {
        name: "IB",
        title: "The Global Inquirer",
        persona: "Independent Innovator",
        profile: "This cognitive style thrives on openness to experience, exhibits a high tolerance for ambiguity, and possesses the strong self-regulation skills needed for inquiry-based learning.",
        rejectionReason: "Why not CBSE? Your child requires autonomy. The rigid, defined syllabus of CBSE would likely lead to boredom and disengagement.",
        careerPath: "The Global Ivy League/Oxbridge Track. Grade 9-10 (MYP): Critical writing. Grade 11-12 (DP): Building the 'Profile' via CAS and Extended Essay.",
        philosophy: 'Creating Global Citizens and Inquirers.',
        teachingMethod: 'No fixed textbooks. Students must ask questions, research answers, and write essays.',
        parentalRole: 'High (Strategic). You cannot just "teach them the chapter." You must help them find resources and manage complex timelines.'
    },
    'Cambridge (IGCSE)': {
        name: "Cambridge (IGCSE)",
        title: "The International Achiever",
        persona: "Flexible Specialist",
        profile: "This profile values subject depth and assessment flexibility, allowing students to tailor their studies for international university application.",
        rejectionReason: "Why not CBSE? Requires much higher English proficiency and is not directly aligned with Indian competitive exams.",
        careerPath: "International University Admissions and Specialized Career Paths (Finance, Design).",
        philosophy: 'Subject depth and international curriculum portability.',
        teachingMethod: 'Application-based learning. Requires external resources and focuses on critical thinking over rote memorization.',
        parentalRole: 'Moderate to High. You must manage complex curriculum choices and ensure external support for topics like Math/Science.'
    },
    'State Board': {
        name: "State Board",
        title: "The Regional Contender",
        persona: "Contextual Learner",
        profile: "This profile thrives on learning rooted in regional culture and language, with a focus on local government standards and employment readiness.",
        rejectionReason: "Why not IB? Highly constrained by local mandates; international portability is severely limited.",
        careerPath: "State Government Jobs, Local Commerce, and Regional Universities.",
        philosophy: 'Focus on regional language proficiency and local employment mandates.',
        teachingMethod: 'Rote-learning heavy, textbook-driven, and often heavily emphasizes regional languages.',
        parentalRole: 'Low to Moderate. Lower fee structure and simplified objectives make it less demanding.',
    },
    financial: {
        inflationRate: "10-12%",
        projectionTable: [
            { grade: "Grade 1 (2025)", fee: "₹ 2,00,000", total: "₹ 2,00,000" },
            { grade: "Grade 2 (2026)", fee: "₹ 2,20,000", total: "₹ 4,20,000" },
            { grade: "Grade 3 (2027)", fee: "₹ 2,42,000", total: "₹ 6,62,000" },
            { grade: "Grade 4 (2028)", fee: "₹ 2,66,200", total: "₹ 9,28,200" },
            { grade: "Grade 5 (2029)", fee: "₹ 2,92,820", total: "₹ 12,21,020" },
            { grade: "Grade 6 (2030)", fee: "₹ 3,22,102", total: "₹ 15,43,122" },
            { grade: "Grade 7 (2031)", fee: "₹ 3,54,312", total: "₹ 18,97,434" },
            { grade: "Grade 8 (2032)", fee: "₹ 3,89,743", total: "₹ 22,87,177" },
            { grade: "Grade 9 (2033)", fee: "₹ 4,28,718", total: "₹ 27,15,895" },
            { grade: "Grade 10 (2034)", fee: "₹ 4,71,589", total: "₹ 31,87,484" },
            { grade: "Grade 11 (2035)", fee: "₹ 5,18,748", total: "₹ 37,06,232" },
            { grade: "Grade 12 (2036)", fee: "₹ 5,70,623", total: "₹ 42,76,855" }
        ],
        hiddenCosts: [
            "Transport: ₹40,000 - ₹80,000/year",
            "Technology Fees: ₹1-2 Lakhs (Laptops/Tablets for IB)",
            "Field Trips: ₹1-2 Lakhs per trip",
            "Shadow Coaching (CBSE): ₹2-4 Lakhs/year"
        ]
    },
    vetting: {
        questions: [
            { q: "What is your annual teacher turnover rate?", flag: "Red Flag Answer: 'We constantly refresh our faculty...' (Code for: We fire expensive teachers.)" },
            { q: "Specific protocol for bullying incidents?", flag: "Red Flag Answer: 'We don't really have bullying here.' (Denial is a safety risk.)" },
            { q: "Instruction for child falling behind?", flag: "Look for specific remedial programs, not generic 'extra classes'." },
            { q: "How do you handle special needs students?", flag: "Check if they have actual special educators on payroll." },
            { q: "Are parents allowed on campus during the day?", flag: "Complete lockouts are a communication red flag." }
        ],
        redFlags: [
            "The 'Tired Teacher' Test: Do teachers look exhausted?",
            "The 'Glossy Brochure' Disconnect: Fancy reception vs. broken furniture.",
            "Restroom Hygiene: The truest test of dignity.",
            "Principal Turn-over: Has the principal changed twice in 3 years?",
            "Library Dust: Are books actually being read?"
        ]
    },
    concierge: {
        negotiation: [
            { title: "The 'Lump Sum' Leverage", scenario: "Use when you have liquidity.", script: "If I clear the entire annual tuition in a single transaction this week, what is the best concession structure you can offer on the Admission Fee?" },
            { title: "The 'Sibling Pipeline' Pitch", scenario: "Use if enrolling a younger child later.", script: "With my younger child entering Grade 1 next year, we are looking at a 15+ year LTV. Can we discuss a waiver on the security deposit?" },
            { title: "The 'Corporate Tie-up' Query", scenario: "Check if your company is on their list.", script: "Does the school have a corporate partnership with [Company Name]? I'd like to check if my employee status qualifies us for a waiver." }
        ]
    },
    interviewMastery: {
        part1: [ 
            { q: "What is your name?", strategy: "Confidence. Eye contact is the gold standard." },
            { q: "Who did you come with?", strategy: "Recognize family. 'Mommy and Daddy' is perfect." },
            { q: "Favorite color/toy?", strategy: "Enthusiasm. Watch them light up." },
            { q: "Pick up the Red block.", strategy: "Listening Skills. Follows instruction once." },
            { q: "Do you have a pet?", strategy: "Narrative skills. Strings 2-3 sentences." },
            { q: "What did you eat for breakfast?", strategy: "Memory recall." },
            { q: "Recite a rhyme.", strategy: "Confidence. Don't force it." },
            { q: "Biggest object here?", strategy: "Concept check: Big vs Small." },
            { q: "Who is your best friend?", strategy: "Socialization check." },
            { q: "What happens if you fall?", strategy: "Resilience. 'I get up' is brave." },
            { q: "Stack these blocks.", strategy: "Fine motor skills." },
            { q: "Do you share toys?", strategy: "Honesty. 'No' is often the honest answer." },
            { q: "What does a dog say?", strategy: "Sound-object association." },
            { q: "Identify this shape.", strategy: "Academic baseline." },
            { q: "Tell a story about this picture.", strategy: "Imagination vs Listing items." }
        ],
        part2: [ 
            { q: "Why this school?", strategy: "Align values, don't just say 'It's close'." },
            { q: "Describe child in 3 words.", strategy: "Be real. 'Energetic' > 'Perfect'." },
            { q: "Nuclear or Joint family?", strategy: "Context check for support system." },
            { q: "View on homework?", strategy: "Balance. Value play at this age." },
            { q: "Handling tantrums?", strategy: "Distraction/Calm corner. Never 'We hit'." },
            { q: "Who looks after child?", strategy: "Safety logistics check." },
            { q: "Aspirations?", strategy: "Good human > Doctor/Engineer." },
            { q: "Screen time?", strategy: "Limited to 30 mins educational." },
            { q: "If child hits another?", strategy: "Accountability & apology." },
            { q: "Meals together?", strategy: "Family culture indicator." },
            { q: "Role in education?", strategy: "Co-learners, not bystanders." },
            { q: "Child's weakness?", strategy: "Vulnerability. Show you know them." },
            { q: "Other schools applied?", strategy: "Diplomacy. 'You are first choice'." },
            { q: "Weekends?", strategy: "Engagement/Stability check." },
            { q: "Toilet trained?", strategy: "Honesty regarding hygiene." }
        ],
        part3: [ 
            { q: "Child complains about teacher?", strategy: "Listen, but verify context first." },
            { q: "Definition of Success?", strategy: "Happiness & problem solving." },
            { q: "Writing at age 5?", strategy: "Trust the motor skill process." },
            { q: "Child is too quiet?", strategy: "He is an observer, will warm up." },
            { q: "Parenting style?", strategy: "Authoritative (Boundaries + Warmth)." }
        ],
        scoop: [ 
            { title: "Red Flag", text: "Answering FOR the child loses 10 points instantly." },
            { title: "Red Flag", text: "Bribing with chocolate in the waiting room." },
            { title: "Pro Tip", text: "If child freezes, say: 'He is overwhelmed, usually chatty.' Then let it go." }
        ]
    }
};

const questions = [
    { id: "q1", text: "How does your child learn best?", options: ["By seeing images, videos, and diagrams (Visual)", "By listening to stories and discussions (Auditory)", "By doing experiments and building things (Kinesthetic)", "A mix of everything / Adaptable"] },
    { id: "q2", text: "What subject does your child naturally enjoy?", options: ["Maths, Logic, and Puzzles", "English, Stories, and Art", "Science, Nature, and asking 'Why?'", "A bit of everything / Balanced"] },
    { id: "q3", text: "What is the big future goal?", options: ["Crack Indian Exams (IIT-JEE / NEET / UPSC)", "Study Abroad (University in US/UK/Canada)", "Entrepreneurship or Creative Arts", "Not sure yet / Keep options open"] },
    { id: "q4", text: "What is your comfortable annual budget for school fees?", options: ["Below ₹1 Lakh", "₹1 Lakh - ₹3 Lakhs", "₹3 Lakhs - ₹6 Lakhs", "Above ₹6 Lakhs"] },
    { id: "q5", text: "Will you be moving cities in the next few years?", options: ["No, we are settled here.", "Yes, likely to move within India.", "Yes, likely to move to another Country.", "Unsure"] },
    { id: "q6", text: "What teaching style do you prefer?", options: ["Structured: Textbooks and clear syllabus", "Inquiry: Research and self-exploration", "Flexible: Student-led (like Montessori)", "Balanced approach"] },
    { id: "q7", text: "How much study load can your child handle?", options: ["High Volume (Can memorize lots of details)", "Concept Focus (Understands logic, less memory)", "Practical Focus (Prefers doing over reading)"] },
    { id: "q8", text: "Is 'Global Recognition' important to you?", options: ["Yes, it's critical.", "It's important.", "Nice to have.", "Not important."] },
    { id: "q9", text: "Should the school focus heavily on Regional Languages?", options: ["Yes, they must be fluent in the local language.", "Basic functional knowledge is enough.", "No, English is the main focus."] },
    { id: "q10", text: "How does your child react to exams?", options: ["They are competitive and handle pressure well.", "They prefer projects and assignments.", "They get very anxious about tests."] },
    { id: "q11", text: "How important are Sports & Arts?", options: ["Very High - Equal to academics.", "Moderate - Good for hobbies.", "Low - Academics come first."] },
    { id: "q12", text: "What grade is your child entering?", options: ["Preschool / Kindergarten", "Primary (Grades 1-5)", "Middle (Grades 6-8)", "High School (Grades 9+)"] },
    { id: "q13", text: "What class size do you prefer?", options: ["Small (Less than 25 kids)", "Standard (25-40 kids)", "Large (40+ kids)"] },
    { id: "q14", text: "How involved do you want to be in homework?", options: ["High (I will help daily)", "Moderate (Weekly check-ins)", "Low (School should manage it)"] },
    { id: "q15", text: "Where are you looking for schools?", options: ["Metro City (Delhi, Mumbai, Hyd, etc.)", "Tier-2 City (Jaipur, Vizag, etc.)", "Small Town / Rural Area"] },

    {
        id: "q16",
        isObservation: true,
        text_variants: {
            "5-10": "Tell your child: 'We're doing lunch before play today.' How do they react?",
            "10-15": "Hand them a new app or gadget. Tell them: 'Figure out how to change the background.' What is their first move?",
            "15+": "Ask them: 'What was the last activity where you completely lost track of time and your phone?'"
        },
        options_variants: {
            "5-10": ["They look stressed and ask for the old plan", "They ask why but adapt quickly", "They don't mind either way", "They get upset or resistant"],
            "10-15": ["They ask for a guide or instructions", "They start clicking and exploring randomly", "They ask what the goal of changing it is", "They wait for you to show them"],
            "15+": ["A hobby, sport, or physical activity", "A deep research project or creative work", "Studying for a specific goal", "Browsing social media or entertainment"]
        }
    },
    {
        id: "q17",
        isObservation: true,
        text_variants: {
            "5-10": "Give this command: 'Touch the door, then touch your nose, then bring me a spoon.' Do they do it in that exact order?",
            "10-15": "Ask: 'Would you rather take a 20-question quiz or write a 2-page essay on your favorite movie?'",
            "15+": "Does being ranked #1 in class matter more to them than doing a unique project?"
        },
        options_variants: {
            "5-10": ["Follows the exact sequence", "Gets the items but in the wrong order", "Creates a game out of the request", "Completes it but seems disinterested"],
            "10-15": ["The 20-question quiz", "Writing the 2-page essay", "Neither, they prefer a practical task", "They don't have a preference"],
            "15+": ["Rank #1 matters most", "The unique project matters most", "A balance of both", "Neither matters much"]
        }
    },
    {
        id: "q18",
        isObservation: true,
        text_variants: {
            "5-10": "Stop a story halfway and ask: 'What happens next?' How do they respond?",
            "10-15": "Do they remember the 'Dates' of history or the 'Reasons' why a historical event happened?",
            "15+": "Are they better at defending an opinion in a debate or solving a complex math formula?"
        },
        options_variants: {
            "5-10": ["They give a logical, predictable ending", "They invent a wild, creative ending", "They tell a story based on their own day", "They ask you to just finish the story"],
            "10-15": ["They remember specific dates and facts", "They remember the reasons and context", "They remember the stories of the people", "They struggle to remember either"],
            "15+": ["Solving the math formula", "Defending an opinion or debating", "Both equally", "Neither is a strength"]
        }
    },
    {
        id: "q19",
        isObservation: true,
        text_variants: {
            "5-10": "Watch them sort toys. Do they group them by color/size or by a narrative/story?",
            "10-15": "Do they keep a mental or physical track of their weekly classes and schedule?",
            "15+": "Can they study for 3 hours straight without any parental supervision?"
        },
        options_variants: {
            "5-10": ["By size, color, or clear categories", "By a story or how the toys 'feel'", "By how they use them in real life", "They don't sort, they just play"],
            "10-15": ["Yes, they are very aware of their schedule", "No, they need constant reminders", "They only remember things they enjoy", "They rely entirely on a calendar/app"],
            "15+": ["Yes, they are very disciplined", "No, they need occasional check-ins", "They only study when there is an exam", "They prefer group study"]
        }
    },
    {
        id: "q20",
        isObservation: true,
        text_variants: {
            "5-10": "Ask: 'What if dogs could talk?' Is their answer literal or abstract?",
            "10-15": "When they argue, is it based on 'Fairness and Rules' or 'Emotions and Impact'?",
            "15+": "If given ₹5000, would they save it for security or spend/invest it on a hobby?"
        },
        options_variants: {
            "5-10": ["Literal: 'They would ask for food'", "Abstract: 'They would tell us about their dreams'", "Narrative: 'They would help me with homework'", "Simple: 'That's not possible'"],
            "10-15": ["Rules and what is 'fair'", "How it makes people feel or the impact", "A mix of logic and emotion", "They avoid arguments entirely"],
            "15+": ["Save it for the future", "Spend it on a passion or investment", "Give it to others or share it", "Spend it on immediate needs"]
        }
    },
    {
        id: "q21",
        isObservation: true,
        text_variants: {
            "5-10": "Do they draw a standard house/tree or something unique like a tree-house or rocket?",
            "10-15": "Do they look up things on YouTube or Wikipedia on their own without being told?",
            "15+": "Do they follow global news and events or mostly focus on school/local updates?"
        },
        options_variants: {
            "5-10": ["Standard house or tree", "Unique or imaginary objects", "Very detailed real-life items", "They prefer coloring over drawing"],
            "10-15": ["Yes, frequently", "Only for school assignments", "Rarely, they prefer entertainment", "They ask you instead of searching"],
            "15+": ["Follow global news regularly", "Mostly local or school news", "Only news related to their hobbies", "Not interested in news"]
        }
    },
    {
        id: "q22",
        isObservation: true,
        text_variants: {
            "5-10": "If a drawing goes wrong, do they erase it to fix it or turn it into something else?",
            "10-15": "Ask them: 'How do planes stay in the air?' Observe their first move.",
            "15+": "Are their notes sequential (bullet points) or associative (mind-maps/scribbles)?"
        },
        options_variants: {
            "5-10": ["Erase and fix it perfectly", "Incorporate the mistake into a new idea", "Get frustrated and start over", "Ignore the mistake and continue"],
            "10-15": ["They try to explain it themselves", "They go to search for the answer online", "They ask you to explain it", "They say they don't know"],
            "15+": ["Sequential and organized bullet points", "Creative mind-maps and diagrams", "Random scribbles and highlights", "They don't take notes"]
        }
    },
    {
        id: "q23",
        isObservation: true,
        text_variants: {
            "5-10": "Do they ask 'What is this?' or 'How does this work?' more often?",
            "10-15": "When they hear a rumor, do they verify it or share it immediately?",
            "15+": "Do they respect a teacher because of their 'Title/Authority' or their 'Knowledge'?"
        },
        options_variants: {
            "5-10": ["'What is this?' (Names/Facts)", "'How does it work?' (Logic/Systems)", "'Why is it like this?' (Inquiry)", "They don't ask many questions"],
            "10-15": ["They try to verify if it's true", "They share it with friends", "They ignore it", "They ask an adult for the truth"],
            "15+": ["Respect the authority and title", "Respect the depth of knowledge", "Respect how the teacher treats them", "They are generally skeptical of authority"]
        }
    },
    {
        id: "q24",
        isObservation: true,
        text_variants: {
            "5-10": "In a game, do they get upset if someone 'cheats' or changes the rules?",
            "10-15": "In a group project, are they the 'Manager' (Organizing) or the 'Ideator' (Big Ideas)?",
            "15+": "Do they read for 'Information' (Facts/News) or for 'Perspective' (Stories/Opinions)?"
        },
        options_variants: {
            "5-10": ["Upset about rules/cheating", "Okay with changes if it's fun", "They change the rules themselves", "They lose interest in the game"],
            "10-15": ["The Manager/Organizer", "The Ideator/Creative", "The worker who does the tasks", "The mediator who keeps peace"],
            "15+": ["Reading for information and facts", "Reading for perspective and depth", "Both equally", "They don't enjoy reading"]
        }
    },
    {
        id: "q25",
        isObservation: true,
        text_variants: {
            "5-10": "Can they work on a single activity (like Legos) for 45 minutes straight?",
            "10-15": "What scares them more: A surprise test or a vague, open-ended project?",
            "15+": "In a team conflict, do they prioritize 'Results' or 'Group Harmony'?"
        },
        options_variants: {
            "5-10": ["Yes, they are very persistent", "No, they switch activities quickly", "Only if you are helping them", "Only if it involves a screen"],
            "10-15": ["The surprise test", "The vague project", "Neither bothers them", "Both cause significant stress"],
            "15+": ["Getting the results done", "Keeping the group happy", "Finding a mistake", "They avoid team roles"]
        }
    },
    {
        id: "q26",
        isObservation: true,
        text_variants: {
            "5-10": "Do they observe a group of kids before joining, or jump right in?",
            "10-15": "Do they use the internet to 'Consume' (Watch) or 'Create' (Code/Edit/Write)?",
            "15+": "Are they systemic planners (calendars) or adaptive finishers (last-minute)?"
        },
        options_variants: {
            "5-10": ["Observe quietly first", "Jump right in immediately", "Wait for someone to invite them", "Prefer to play alone"],
            "10-15": ["Mostly consuming content", "Mostly creating or learning skills", "A balanced mix of both", "They don't use the internet much"],
            "15+": ["Systemic planners", "Adaptive/Last-minute", "They don't plan at all", "They follow someone else's plan"]
        }
    },
    {
        id: "q27",
        isObservation: true,
        text_variants: {
            "5-10": "When picking a toy, do they choose instantly or ask many questions first?",
            "10-15": "Do they stick to one hobby for years or sample many different things?",
            "15+": "Would they rather have one big exam at the end, or small projects all year?"
        },
        options_variants: {
            "5-10": ["Choose instantly", "Ask for context and details", "Can't decide and get overwhelmed", "Choose whatever is closest"],
            "10-15": ["Stick to one for a long time", "Sample and switch often", "Have a few steady hobbies", "No particular hobbies"],
            "15+": ["One big final exam", "Continuous small projects", "A mix of both", "They dislike both"]
        }
    },
    {
        id: "q28",
        isObservation: true,
        text_variants: {
            "5-10": "Do they remember 'Names and Numbers' or 'Stories and Feelings' better?",
            "10-15": "Do they like a 'Strict and Clear' teacher or an 'Interactive' one?",
            "15+": "When interested in a topic, do they stay efficient or go down a 'Rabbit Hole'?"
        },
        options_variants: {
            "5-10": ["Names and Numbers", "Stories and Feelings", "Both equally", "Struggle with both"],
            "10-15": ["Strict and Clear", "Interactive and Flexible", "Kind and supportive", "They don't mind the style"],
            "15+": ["Stay efficient and goal-oriented", "Go down a deep rabbit hole", "Ask others for the summary", "Lose interest quickly"]
        }
    },
    {
        id: "q29",
        isObservation: true,
        text_variants: {
            "5-10": "Do they care more about the 'Sticker/Grade' or the 'Praise for Effort'?",
            "10-15": "When they fail, do they ask for a 'Solution' or a 'Diagnostic' (Why it happened)?",
            "15+": "Do they prefer a predictable schedule or one that changes based on the day's needs?"
        },
        options_variants: {
            "5-10": ["The Sticker or Grade", "The Praise for Effort", "Both are equally important", "They don't seem to care about either"],
            "10-15": ["Just give them the solution", "Understand the diagnostic 'Why'", "They get too upset to ask", "They try to hide the failure"],
            "15+": ["Predictable and fixed schedule", "Adaptive and flexible schedule", "No schedule at all", "They follow their mood"]
        }
    },
    {
        id: "q30",
        isObservation: true,
        isVeto: true,
        text_variants: {
            "5-10": "Ask them: 'Do you want a school where the teacher tells you every step, or one where you make your own games?'",
            "10-15": "Ask them: 'Do you want a school that gives you the answers to study, or one that helps you find them?'",
            "15+": "Ask them: 'Do you want a board that guarantees a Rank or one that builds a Global Profile?'"
        },
        options_variants: {
            "5-10": ["Tell me every step", "Make my own games", "A mix of both", "I don't know"],
            "10-15": ["Give me the answers", "Help me find them", "Either is fine", "I don mind"],
            "15+": ["Guarantees a Rank", "Builds a Global Profile", "Needs both", "Not sure"]
        }
    }
];

// --- STATIC SITE POST-PAYMENT DETECTION (UPDATED) ---
function checkPaymentStatus() {
    const params = new URLSearchParams(window.location.search);
    const razorpayId = params.get('razorpay_payment_id');

    if (razorpayId) {
        console.log("Payment detected via URL sniffing. Restoring session...");
        
        // Find session in localStorage
        let sessionKey = null;
        const orderIdParam = params.get('order_id');
        
        if (orderIdParam) {
            sessionKey = `aptskola_session_${orderIdParam}`;
        } else {
            // Fallback: search for any existing aptskola session
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('aptskola_session_')) {
                    sessionKey = key;
                    break;
                }
            }
        }

        // --- Update this specific block in your checkPaymentStatus() ---
		const savedSession = localStorage.getItem(sessionKey);
		if (savedSession) {
			const data = JSON.parse(savedSession);
			answers = data.answers;
			customerData = data.customerData;
			selectedPrice = customerData.amount;
			selectedPackage = customerData.package;

			document.getElementById('landingPage').classList.add('hidden');

			renderReportToBrowser().then(() => {
			triggerAutomatedEmail();
			showInstantSuccessPage();
    });
} else {
    // THIS IS THE MISSING SAFETY GEAR
    console.error("Payment received, but no local session data found.");
    alert("Payment successful! However, we couldn't find your assessment data on this device. Please check your email for the report or contact support with your Order ID.");
}
    }
}

// --- STRICT VALIDATION HELPERS ---
function validateInputs(email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    
    let isValid = true;
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');

    if(emailEl) emailEl.classList.remove('input-error');
    if(phoneEl) phoneEl.classList.remove('input-error');

    if (!emailRegex.test(email)) {
        if(emailEl) emailEl.classList.add('input-error');
        isValid = false;
    }
    if (!mobileRegex.test(phone)) {
        if(phoneEl) phoneEl.classList.add('input-error');
        isValid = false;
    }
    return isValid;
}

// --- UPDATED: CALCULATOR LOGIC WITH DONUT CHART ---
function calculateCostOfConfusion() {
    const hoursInput = document.getElementById('researchHours');
    const rateInput = document.getElementById('hourlyRate');
    const tabsInput = document.getElementById('browserTabs');
    if (!hoursInput || !rateInput || !tabsInput) return;

    const hours = parseInt(hoursInput.value);
    const rate = parseInt(rateInput.value);
    const tabs = parseInt(tabsInput.value);
    
    const monthlyLoss = (hours * 4) * rate; 
    const anxietyLevel = Math.min(tabs * 5, 100); 

    const lossEl = document.getElementById('lossAmount');
    if(lossEl) lossEl.textContent = monthlyLoss.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    
    const anxEl = document.getElementById('anxietyLevel');
    if(anxEl) anxEl.textContent = `${anxietyLevel}%`;

    const hVal = document.getElementById('hoursValue');
    if(hVal) hVal.textContent = `${hours} hours`;
    
    const rVal = document.getElementById('rateValue');
    if(rVal) rVal.textContent = `₹${rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    
    const tVal = document.getElementById('tabsValue');
    if(tVal) tVal.textContent = `${tabs} tabs`;

    const donut = document.getElementById('confusionDonut');
    if(donut) {
        donut.style.setProperty('--anxiety-degree', `${anxietyLevel}%`);
    }
}

// --- CORE UI ACTIONS ---
function scrollToPricing() {
    const pricing = document.getElementById('pricing');
    if (pricing) pricing.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const stickyBtn = document.getElementById('stickyCTA');
    const landingPage = document.getElementById('landingPage');
    if (stickyBtn && landingPage) {
        if (window.scrollY > 300 && !landingPage.classList.contains('hidden')) {
            stickyBtn.style.display = 'flex';
        } else {
            stickyBtn.style.display = 'none';
        }
    }
});

function openSampleReport() {
    const modal = document.getElementById('sampleReportModal');
    const content = document.getElementById('sampleReportContent');
    if (content) {
        content.innerHTML = `
            <div style="text-align:center; margin-bottom:30px;">
                <h2 class="text-2xl font-bold text-brand-navy">Sample Report: The Decision Decoder</h2>
                <p class="text-sm text-slate-500">This is what you get after the assessment.</p>
            </div>
            <div class="report-card" style="background:#0F172A; color:white;">
                <div style="font-size:2rem; font-weight:800;">The Standardized Strategist</div>
                <div style="background:rgba(255,255,255,0.1); padding:10px; border-radius:8px; margin-top:10px;">
                    Recommended: <span style="color:#FF6B35; font-weight:bold;">CBSE</span>
                </div>
            </div>
            <div class="report-card" style="opacity: 0.6; filter: blur(1px); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 10; background: rgba(255,255,255,0.4);">
                    <button onclick="closeSampleReport(); scrollToPricing()" class="hero-btn-primary" style="box-shadow: 0 10px 20px rgba(0,0,0,0.2);">Unlock Full Report</button>
                </div>
                <div class="report-header-bg">CHILD'S PROFILE SUMMARY</div>
                <table class="data-table">
                    <tr><td><strong>Learning Style</strong></td><td>Visual Learner</td></tr>
                    <tr><td><strong>Core Interest</strong></td><td>Science & Logic</td></tr>
                </table>
            </div>
        `;
    }
    if (modal) modal.classList.add('active');
}

function closeSampleReport() {
    const modal = document.getElementById('sampleReportModal');
    if (modal) modal.classList.remove('active');
}

// --- UNIFIED MODAL CONTROLLER (UPDATED) ---
function openCollaborationModal(type) {
    const modal = document.getElementById('collaborationModal');
    const title = document.getElementById('collabModalTitle');
    const subject = document.getElementById('collabSubject');
    const submitBtn = document.getElementById('collabSubmitBtn');

    if (modal && title && subject && submitBtn) {
        if (type === 'Partner') {
            title.innerText = 'Partner Registration';
            subject.value = 'New Educator Partner Application';
            submitBtn.innerText = 'Submit Application';
        } else {
            title.innerText = 'Be Our Ambassador';
            subject.value = 'New Ambassador Application';
            submitBtn.innerText = 'Apply Now';
        }
        modal.classList.add('active');
    }
}

function goToLandingPage() {
    currentQuestion = 0;
    answers = {};
    const form = document.getElementById('customerForm');
    if(form) form.reset();
    
    document.getElementById('landingPage').classList.remove('hidden');
    const dPage = document.getElementById('detailsPage');
    if(dPage) dPage.classList.add('hidden');
    const pCont = document.getElementById('paymentPageContainer');
    if(pCont) pCont.classList.add('hidden');
    const sPage = document.getElementById('successPage');
    if(sPage) sPage.classList.add('hidden');
    const sGate = document.getElementById('syncMatchGate');
    if(sGate) sGate.classList.add('hidden');
    const sTrans = document.getElementById('syncMatchTransition');
    if(sTrans) sTrans.classList.add('hidden');
    
    const app = document.getElementById('questionPageApp');
    if (app) app.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getIntermediateHeaderHtml() {
     return `<div class="intermediate-header" onclick="goToLandingPage()" style="cursor:pointer;"><div class="max-w-7xl mx-auto"><span class="font-bold text-xl">Apt <span class="text-brand-orange">Skola</span></span></div></div>`;
}
function getIntermediateFooterHtml() {
     return `<div class="intermediate-footer"><div class="max-w-7xl mx-auto text-center"><p>&copy; 2025 Apt Skola, all rights reserved.</p></div></div>`;
}

// --- SYNC MATCH GATE LOGIC ---
function openSyncMatchGate() {
    const landing = document.getElementById('landingPage');
    const gate = document.getElementById('syncMatchGate');
    if (landing) landing.classList.add('hidden');
    if (gate) {
        gate.classList.remove('hidden');
        gate.classList.add('active'); 
        
        const gateContainer = gate.querySelector('.details-form');
        if (gateContainer && !gateContainer.querySelector('.foviz-banner')) {
            gateContainer.insertAdjacentHTML('afterbegin', fovizBannerHtml);
            const startBtn = document.getElementById('startSyncBtn');
            if (startBtn && !gateContainer.querySelector('.xray-card')) {
                startBtn.insertAdjacentHTML('afterend', xrayCardHtml);
            }
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateAndStartSyncMatch() {
    const orderIdInput = document.getElementById('syncOrderId');
    const ageInput = document.getElementById('syncChildAge');
    const orderId = orderIdInput ? orderIdInput.value.trim() : '';

    if(!orderId || orderId.length < 3) {
        alert("Please enter a valid Order ID.");
        return;
    }

    customerData.orderId = orderId; 

    if (orderId.startsWith('AS5-')) {
        const uBlock = document.getElementById('upgradeBlock');
        if(uBlock) uBlock.classList.remove('hidden');
        const sBtn = document.getElementById('startSyncBtn');
        if(sBtn) sBtn.classList.add('hidden');
        const manualBlock = document.getElementById('manualSyncBlock');
        if(manualBlock) manualBlock.style.display = 'none';
        return; 
    }

    const savedSession = localStorage.getItem(`aptskola_session_${orderId}`);
    
    if (!savedSession) {
        const startBtn = document.getElementById('startSyncBtn');
        if (startBtn && !document.getElementById('manualSyncBlock')) {
            startBtn.insertAdjacentHTML('beforebegin', manualSyncUI);
        }
        return;
    }

    const sessionData = JSON.parse(savedSession);
    answers = sessionData.answers;
    customerData = sessionData.customerData;
    if(ageInput) customerData.childAge = ageInput.value;

    if (orderId.startsWith('AS1-') || orderId.startsWith('AS9-')) {
        isSyncMatchMode = true; 
        isManualSync = false; 
        document.getElementById('syncMatchGate').classList.add('hidden');
        showSyncTransition();
    } 
    else {
        alert("Invalid Order ID format. Please use AS5-, AS9-, or AS1-.");
    }
}

function injectVisionMarkers(boardName) {
    if (boardName === 'CBSE') {
        answers.q1 = 1; answers.q2 = 0; answers.q3 = 0;
    } else if (boardName === 'ICSE') {
        answers.q1 = 0; answers.q2 = 1; answers.q3 = 2;
    } else if (boardName === 'IB' || boardName === 'Cambridge') {
        answers.q1 = 2; answers.q2 = 2; answers.q3 = 1;
    } else {
        answers.q1 = 1; answers.q2 = 0; answers.q3 = 0;
    }

    for (let i = 4; i <= 15; i++) {
        if (answers['q' + i] === undefined) {
            answers['q' + i] = 0; 
        }
    }
}

function confirmManualSync() {
    const boardSelect = document.getElementById('manualBoardSelect');
    const orderIdInput = document.getElementById('syncOrderId');
    const ageInput = document.getElementById('syncChildAge');
    
    if (!boardSelect || !boardSelect.value) {
        alert("Please select the Recommended Board from your report.");
        return;
    }
    
    injectVisionMarkers(boardSelect.value);
    if(orderIdInput) customerData.orderId = orderIdInput.value;
    if(ageInput) customerData.childAge = ageInput.value;
    isManualSync = true;
    isSyncMatchMode = true;

    document.getElementById('syncMatchGate').classList.add('hidden');
    showSyncTransition();
}

function showSyncTransition() {
    const transition = document.getElementById('syncMatchTransition');
    if (!transition) {
        startSyncMatchNow();
        return;
    }
    
    transition.classList.remove('hidden');
    transition.classList.add('active');
    
    const transitionContainer = transition.querySelector('.details-form');
    if (transitionContainer && !transitionContainer.querySelector('.xray-card')) {
        const timerCont = transitionContainer.querySelector('.timer-circle-container');
        if (timerCont) {
            timerCont.insertAdjacentHTML('beforebegin', xrayCardHtml);
        }
    }
    
    let timeLeft = 15;
    const timerDisplay = document.getElementById('syncTimer');
    
    if (syncTimerInterval) clearInterval(syncTimerInterval);
    syncTimerInterval = setInterval(() => {
        timeLeft--;
        if(timerDisplay) timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            startSyncMatchNow();
        }
    }, 1000);
}

function startSyncMatchNow() {
    if (syncTimerInterval) clearInterval(syncTimerInterval);
    const transition = document.getElementById('syncMatchTransition');
    if (transition) {
        transition.classList.remove('active');
        transition.classList.add('hidden');
    }
    initializeQuizShell(15); 
}

// --- HARDCODED GOOGLE MAPS LOADER ---
function loadGoogleMaps() {
    if (mapsLoadedPromise) return mapsLoadedPromise;
    
    mapsLoadedPromise = new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log("Maps API Hardcoded Load Success");
            resolve(true);
        };
        script.onerror = () => {
            console.error("Maps API Load Fail - Check key and console for errors");
            reject(new Error("Maps Script Load Error"));
        };
        document.head.appendChild(script);
    });
    return mapsLoadedPromise;
}

// --- UPDATED: ROBUST SCHOOL SCOUTING LOGIC ---
async function fetchNearbySchools(board, area, pincode) {
    const schoolBlock = document.getElementById('schoolFinderBlock');
    if (!schoolBlock || typeof google === 'undefined') return;

    const py = new google.maps.places.PlacesService(document.createElement('div'));
    const query = `${board} school near ${area} ${pincode}`;
    
    py.textSearch({ query: query }, async (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
            schoolBlock.innerHTML = `<div class="report-header-bg">LOCAL SCHOOL SCOUT: ${board}</div><p style="padding:15px;">No high-confidence matches in ${area}.</p>`;
            return;
        }

        const top5 = results.slice(0, 5);
        const userOrigin = await getCoords(`${area} ${pincode}`);
        
        await processSchoolResults(top5, userOrigin, board, area, schoolBlock);
    });
}

async function processSchoolResults(top5, userOrigin, board, area, schoolBlock) {
    try {
        let rowsHtml = '';
        if (userOrigin) {
            const schoolDestinations = top5.map(s => ({
                lat: s.geometry.location.lat(),
                lng: s.geometry.location.lng()
            }));

            const matrixData = await getDistanceMatrixWithRoutesAPI([userOrigin], schoolDestinations);
            
            top5.forEach((school, i) => {
                const info = (matrixData && matrixData.length > i) ? matrixData[i] : null;
                const driveTime = info && info.duration ? Math.round(parseInt(info.duration) / 60) + " mins" : "N/A";
                const busTime = info && info.duration ? Math.round((parseInt(info.duration) * 1.4) / 60) + " mins" : "N/A";
                rowsHtml += `<tr><td style="font-weight:600; color:var(--navy-premium);">${school.name}</td><td>${driveTime}</td><td>${busTime}</td></tr>`;
            });
        } else {
            top5.forEach(school => {
                rowsHtml += `<tr><td style="font-weight:600;">${school.name}</td><td>See Maps</td><td>See Maps</td></tr>`;
            });
        }

        schoolBlock.innerHTML = `
            <div class="report-header-bg">LOCAL SCHOOL SCOUT (${board})</div>
            <p style="font-size:0.85rem; color:#64748B; margin-bottom:15px;">Verified schools found near ${area}:</p>
            <table class="data-table">
                <thead><tr><th>School Name</th><th>Self Travel</th><th>Bus Travel</th></tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>`;
    } catch (e) {
        let fallbackRows = top5.map(s => `<tr><td style="font-weight:600;">${s.name}</td><td>See Maps</td><td>See Maps</td></tr>`).join('');
        schoolBlock.innerHTML = `<div class="report-header-bg">LOCAL SCHOOL SCOUT (${board})</div><p style="padding:10px; font-size:0.85rem;">Found schools, travel analysis failed. Please use Maps for commute times.</p><table class="data-table"><tbody>${fallbackRows}</tbody></table>`;
    }
}

// --- SCORING LOGIC ---
function calculateFullRecommendation(ansSet) {
    let scores = { "CBSE": 0, "ICSE": 0, "IB": 0, "Cambridge (IGCSE)": 0, "State Board": 0 };
    let veto = { ib: false, cambridge: false, icse: false };

    if (ansSet.q1 === 0) { scores["IB"] += 6; scores["Cambridge (IGCSE)"] += 6; scores["ICSE"] += 4; } 
    if (ansSet.q1 === 1) { scores["CBSE"] += 6; scores["State Board"] += 5; scores["ICSE"] += 4; } 
    if (ansSet.q1 === 2) { scores["IB"] += 8; scores["Cambridge (IGCSE)"] += 8; } 
    if (ansSet.q1 === 3) { scores["CBSE"] += 4; scores["ICSE"] += 4; } 

    if (ansSet.q2 === 0) { scores["CBSE"] += 7; scores["State Board"] += 5; } 
    if (ansSet.q2 === 1) { scores["ICSE"] += 7; scores["IB"] += 6; } 
    if (ansSet.q2 === 2) { scores["IB"] += 7; scores["Cambridge (IGCSE)"] += 7; } 

    if (ansSet.q3 === 0) { scores["CBSE"] += 20; scores["State Board"] += 15; scores["IB"] -= 10; }
    if (ansSet.q3 === 1) { scores["IB"] += 20; scores["Cambridge (IGCSE)"] += 20; scores["CBSE"] -= 5; }
    if (ansSet.q3 === 2) { scores["IB"] += 10; scores["ICSE"] += 8; }

    if (ansSet.q4 === 0) { veto.ib = true; veto.cambridge = true; scores["State Board"] += 10; scores["CBSE"] += 5; }
    if (ansSet.q4 === 1) { veto.ib = true; scores["CBSE"] += 8; scores["ICSE"] += 8; }
    
    let results = Object.keys(scores).map(board => { 
        let s = scores[board];
        if (veto.ib && (board === "IB" || board === "Cambridge (IGCSE)")) s = -999;
        return { name: board, score: s }; 
    });

    results.sort((a, b) => b.score - a.score);
    
    let topScore = Math.max(results[0].score, 1);
    results.forEach(r => {
        r.percentage = r.score < 0 ? 0 : Math.min(Math.round((r.score / topScore) * 95), 99);
    });

    return { recommended: results[0], alternative: results[1], fullRanking: results };
}

// --- HELPER: GEOCODING ---
async function getCoords(address) {
    await loadGoogleMaps();
    if (typeof google === 'undefined' || !google.maps || !google.maps.Geocoder) {
        throw new Error("Maps Service Unavailable");
    }
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                resolve({ 
                    lat: results[0].geometry.location.lat(), 
                    lng: results[0].geometry.location.lng() 
                });
            } else {
                reject('Geocode failed: ' + status);
            }
        });
    });
}

// --- HELPER: ROUTES API ---
async function getDistanceMatrixWithRoutesAPI(origins, destinations) {
    const response = await fetch('https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GMAPS_API_KEY, 
            'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,status',
        },
        body: JSON.stringify({
            origins: origins.map(o => ({ waypoint: { location: { latLng: { latitude: o.lat, longitude: o.lng } } } })),
            destinations: destinations.map(d => ({ waypoint: { location: { latLng: { latitude: d.lat, longitude: d.lng } } } })),
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE'
        }),
    });

    if (!response.ok) throw new Error(`Routes API error: ${response.statusText}`);
    return await response.json();
}

// --- QUIZ FLOW ---
function selectPackage(pkg, price) {
    if (price === 599) {
        hasSeenDowngradeModal = true;
        const modal = document.getElementById('downgradeModal');
        if (modal) modal.classList.add('active');
        return;
    }
    if (price === 999) {
        const modal = document.getElementById('proUpgradeModal');
        if (modal) modal.classList.add('active');
        return;
    }
    if (price === 1499) {
        proceedToQuiz(pkg, price);
    }
}

function confirmDowngrade() {
    const downgradeModal = document.getElementById('downgradeModal');
    if (downgradeModal) downgradeModal.classList.remove('active');
    proceedToQuiz('Essential', 599);
}

function upgradeAndProceed() {
    const downgradeModal = document.getElementById('downgradeModal');
    if (downgradeModal) downgradeModal.classList.remove('active');
    proceedToQuiz('Premium', 999);
}

function upgradeToProAndProceed() {
    const modal = document.getElementById('proUpgradeModal');
    if (modal) modal.classList.remove('active');
    proceedToQuiz('The Smart Parent Pro', 1499);
}

function confirmPremium() {
    const modal = document.getElementById('proUpgradeModal');
    if (modal) modal.classList.remove('active');
    proceedToQuiz('Premium', 999);
}

function proceedToQuiz(pkg, price) {
    const previousFlag = hasSeenDowngradeModal;
    currentQuestion = 0;
    answers = {};
    customerData = { orderId: 'N/A', childAge: '5-10' };
    hasSeenDowngradeModal = previousFlag;
    selectedPackage = pkg;
    selectedPrice = price;
    isSyncMatchMode = false; 
    document.getElementById('landingPage').classList.add('hidden');
    initializeQuizShell(0);
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function initializeQuizShell(index) {
    const questionPages = document.getElementById('questionPages');
    if (!questionPages) return;
    
    const shellHtml = `
        <div id="questionPageApp" class="question-page active">
            ${getIntermediateHeaderHtml()}
            <div class="question-content-wrapper"><div id="dynamicQuizContent" class="question-container"></div></div>
            ${getIntermediateFooterHtml()}
        </div>`;
    questionPages.innerHTML = shellHtml;
    renderQuestionContent(index);
}

function renderQuestionContent(index) {
    currentQuestion = index;

    if (!isSyncMatchMode && index >= 15) { 
        const app = document.getElementById('questionPageApp');
        if (app) app.classList.remove('active');
        showDetailsPage(); 
        return; 
    }
    if (isSyncMatchMode && index >= 30) { 
        const app = document.getElementById('questionPageApp');
        if (app) app.classList.remove('active');
        calculateSyncMatch(); 
        return;
    }

    const q = questions[index];
    if(!q) return;

    let qText = q.text;
    let qOptions = q.options || [];

    if(q.isObservation) {
        qText = q.text_variants[customerData.childAge] || q.text_variants["5-10"];
        if(q.options_variants && q.options_variants[customerData.childAge]) {
            qOptions = q.options_variants[customerData.childAge];
        }
    }

    const totalQ = isSyncMatchMode ? 30 : 15;
    const progressPercent = ((index + 1) / totalQ * 100).toFixed(0);

    const optionsHTML = qOptions.map((opt, i) => {
        const isSelected = answers[q.id] === i ? 'selected' : '';
        return `<div class="option-card ${isSelected}" onclick="selectOption('${q.id}', ${i}, ${index}, this)">${opt}</div>`;
    }).join('');

    let prevBtnHtml = '';
    const startIdx = isSyncMatchMode ? 15 : 0;
    if (index > startIdx) {
        prevBtnHtml = `<button onclick="renderQuestionContent(${index - 1})" class="btn-prev" style="margin-top:20px; background:none; text-decoration:underline; border:none; color:#64748B; cursor:pointer;">← Previous Question</button>`;
    }

    const dynamicQuizContent = document.getElementById('dynamicQuizContent');
    if (dynamicQuizContent) {
        dynamicQuizContent.innerHTML = `
            <div class="progress-container">
                <div class="progress-track"><div class="progress-fill" style="width: ${progressPercent}%"></div></div>
                <div class="progress-label">Question ${index + 1}/${totalQ}</div>
            </div>
            <div class="question-text">${qText}</div>
            <div class="options-grid">${optionsHTML}</div>
            <div style="text-align:center;">${prevBtnHtml}</div>
        `;
    }
}

function selectOption(qId, val, idx, el) {
    answers[qId] = val;
    Array.from(el.parentNode.children).forEach(child => child.classList.remove('selected'));
    el.classList.add('selected');
    setTimeout(() => { renderQuestionContent(idx + 1); }, 300);
}

function showDetailsPage() {
    const detailsPage = document.getElementById('detailsPage');
    if (detailsPage) {
        detailsPage.classList.remove('hidden');
        detailsPage.classList.add('active');
    }
}

function generateOrderId(prefix = '') {
    const typePrefix = prefix || (selectedPrice === 599 ? 'AS5-' : (selectedPrice === 999 ? 'AS9-' : 'AS1-'));
    return typePrefix + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
}

// --- FORM CAPTURE ---
document.getElementById('customerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const disclaimerBox = document.getElementById('confirmDisclaimer');
    if(disclaimerBox && !disclaimerBox.checked) {
        alert("Please acknowledge the Disclaimer & Terms to proceed.");
        return;
    }

    const emailValue = document.getElementById('email')?.value;
    const phoneValue = document.getElementById('phone')?.value;

    if (!validateInputs(emailValue, phoneValue)) {
        alert("Please provide a valid email and a 10-digit Indian mobile number.");
        return;
    }

    const newOrderId = generateOrderId();
    
    customerData = {
        parentName: document.getElementById('parentName')?.value,
        childName: document.getElementById('childName')?.value,
        email: emailValue,
        phone: phoneValue,
        childAge: document.getElementById('childAge')?.value,
        residentialArea: document.getElementById('residentialArea')?.value,
        pincode: document.getElementById('pincode')?.value,
        partnerId: document.getElementById('partnerId')?.value, 
        package: selectedPackage,
        amount: selectedPrice,
        orderId: newOrderId
    };

    localStorage.setItem(`aptskola_session_${newOrderId}`, JSON.stringify({
        answers: answers,
        customerData: customerData
    }));

    const formData = new FormData(this);
    formData.append('orderId', newOrderId);

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
    })
    .then(() => console.log("Lead captured via Web3Forms"))
    .catch((error) => console.error("Web3Forms Error:", error));

    setTimeout(() => {
        document.getElementById('detailsPage').classList.add('hidden');
        const pCont = document.getElementById('paymentPageContainer');
        pCont.classList.remove('hidden');
        pCont.classList.add('active');
        
        document.getElementById('summaryPackage').textContent = selectedPackage;
        document.getElementById('summaryPrice').textContent = `₹${selectedPrice}`;
        document.getElementById('summaryTotal').textContent = `₹${selectedPrice}`;
        document.getElementById('payButton').innerText = `Pay ₹${selectedPrice} via Razorpay Link →`;
        
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 500);
});

function redirectToRazorpay() {
    const payButton = document.getElementById('payButton');
    if(payButton) payButton.innerText = "Redirecting to Secure Payment...";
    const link = PAYMENT_LINKS[selectedPrice] || PAYMENT_LINKS[599];
    window.location.href = link;
}

// --- EMAIL DISPATCH ---
async function triggerAutomatedEmail() {
    const reportElement = document.getElementById('reportPreview');
    if(!reportElement || typeof emailjs === 'undefined') return;
    
    const canvas = await html2canvas(reportElement, { scale: 1.5, useCORS: true });
    const pdfData = canvas.toDataURL('image/jpeg', 0.7);

    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            user_email: customerData.email,
            user_name: customerData.parentName,
            order_id: customerData.orderId,
            report_image: pdfData 
        });
        console.log("EmailJS: Report dispatch success.");
    } catch (e) {
        console.warn("EmailJS failed.", e);
    }
}

function processSyncUpgrade() {
    const link = PAYMENT_LINKS[299];
    localStorage.setItem(`aptskola_session_${customerData.orderId}`, JSON.stringify({ answers, customerData }));
    window.location.href = link;
}

function closeBonusModalAndShowSuccess() {
    document.getElementById('bonusModal').classList.remove('active');
    if (selectedPrice >= 1499) {
        document.getElementById('forensicSuccessModal').classList.add('active');
    } else {
        showInstantSuccessPage();
    }
}

function closeForensicModalAndShowSuccess() {
    document.getElementById('forensicSuccessModal').classList.remove('active');
    showInstantSuccessPage();
}

function showInstantSuccessPage() {
    const paymentPage = document.getElementById('paymentPageContainer');
    const successPage = document.getElementById('successPage');
    
    if(paymentPage) paymentPage.classList.add('hidden');
    if(successPage) {
        successPage.classList.remove('hidden');
        successPage.classList.add('active');
    }
    
    if (selectedPrice >= 1499) {
        const ticket = document.getElementById('goldenTicketContainer');
        if (ticket) ticket.style.display = 'block';
    }

    const pNameEl = document.getElementById('successParentName');
    if(pNameEl) pNameEl.innerText = customerData.parentName || 'Parent';
    
    const reportDiv = document.getElementById('reportPreview');
    if(reportDiv) {
        reportDiv.classList.remove('off-screen-render');
        const dlBtn = document.getElementById('downloadBtn');
        if(dlBtn && dlBtn.parentNode && dlBtn.parentNode.parentNode) {
            const container = dlBtn.parentNode.parentNode;
            container.insertBefore(reportDiv, dlBtn.parentNode.nextSibling);
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// --- SYNC MATCH CALCULATION ---
function calculateSyncMatch() {
    const parentQuestions = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15"];
    const isParentDataMissing = parentQuestions.some(id => answers[id] === undefined);

    if (isParentDataMissing) {
        alert("Initial assessment data is missing.");
        goToLandingPage();
        return;
    }

    let perceptionRes = calculateFullRecommendation(answers);
    let parentRec = perceptionRes.recommended.name;

    let dnaScores = { "CBSE": 0, "IB": 0, "ICSE": 0, "State": 0 };
    for(let i=16; i<=30; i++) {
        let val = answers['q'+i];
        if(val === undefined) continue;
        let multiplier = (i === 30) ? 2.0 : 1.0; 
        if(val === 0) dnaScores["CBSE"] += multiplier;
        if(val === 1) dnaScores["IB"] += multiplier;
        if(val === 2) dnaScores["ICSE"] += multiplier;
        if(val === 3) dnaScores["State"] += multiplier;
    }
    let topDNA = Object.keys(dnaScores).reduce((a, b) => dnaScores[a] > dnaScores[b] ? a : b);
    
    const traits = { "CBSE": "Logical Structure", "IB": "Inquiry-based Autonomy", "ICSE": "Deep Narrative Context", "State": "Functional Local Proficiency" };
    const mappings = { "CBSE": "CBSE", "IB": "IB", "ICSE": "ICSE", "State": "State Board" };
    
    let normalizedDNA = mappings[topDNA] || topDNA;
    let isConflict = (parentRec !== normalizedDNA);
    let alignmentScore = isConflict ? 45 : 92;

    const manualDisclaimer = isManualSync ? `<p style="text-align: center; font-size: 0.75rem; color: #94A3B8; margin-bottom: 10px;">⚠️ Sync generated via Manual Input from Phase 1 Report.</p>` : '';

    let bridgeHtml = isConflict ? `
        <div class="report-card" style="border: 2px solid var(--sunrise-primary); background: #FFF9F2; margin-top: 20px;">
            <h3 style="color: var(--navy-premium); font-weight: 800; font-size: 1.2rem; margin-bottom: 10px;">Bridge Narrative</h3>
            <p style="color: var(--navy-light); font-size: 1rem; line-height: 1.6; margin-bottom: 15px;">
                Your aspiration is <strong>${parentRec}</strong>, but your child’s DNA shows high <strong>${traits[topDNA]}</strong> suggesting <strong>${normalizedDNA}</strong>.
            </p>
        </div>` : `
        <div class="report-card" style="border: 2px solid #22C55E; background: #F0FDF4; margin-top: 20px;">
            <h3 style="color: #166534; font-weight: 800; font-size: 1.2rem; margin-bottom: 10px;">✅ PERFECT ALIGNMENT</h3>
            <p style="color: #166534; font-size: 1rem;">Your vision and your child's natural DNA are in sync.</p>
        </div>`;

    const successPage = document.getElementById('successPage');
    if(successPage) {
        successPage.innerHTML = `
            ${getIntermediateHeaderHtml()}
            <div class="success-content-wrapper">
                <div class="success-container">
                    ${manualDisclaimer}
                    <h2 style="color:var(--navy-premium); text-align:center;">Sync Match Report 🔄</h2>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:30px;">
                        <div style="background:#F0F9FF; padding:20px; border-radius:10px; border:1px solid #BAE6FD;">
                            <h3 style="font-size:0.9rem; font-weight:bold; color:#0369A1; text-transform:uppercase;">Vision Match</h3>
                            <div style="font-size:1.4rem; font-weight:800; color:#0C4A6E;">${parentRec}</div>
                        </div>
                        <div style="background:#FFF7ED; padding:20px; border-radius:10px; border:1px solid #FFEDD5;">
                            <h3 style="font-size:0.9rem; font-weight:bold; color:#C2410C; text-transform:uppercase;">DNA Verification</h3>
                            <div style="font-size:1.4rem; font-weight:800; color:#7C2D12;">${normalizedDNA}</div>
                        </div>
                    </div>
                    ${bridgeHtml}
                    ${ambassadorButtonHtml}
                    ${xrayCardHtml}
                    ${fovizBannerHtml}
                    <button class="custom-cta-button" style="margin-top:30px;" onclick="endFullSession()">End Session</button>
                </div>
            </div>
            ${getIntermediateFooterHtml()}
        `;
        successPage.classList.remove('hidden');
        successPage.classList.add('active');
    }
}

function endFullSession() {
    if (customerData.orderId && customerData.orderId !== 'N/A') {
        localStorage.removeItem(`aptskola_session_${customerData.orderId}`);
    }
    goToLandingPage();
}

// --- REPORT RENDERER ---
async function renderReportToBrowser() {
    const res = calculateFullRecommendation(answers);
    const recBoard = res.recommended.name;
    const boardKey = recBoard.toLowerCase().includes('cbse') ? 'cbse' : 
                     (recBoard.toLowerCase().includes('icse') ? 'icse' : 
                     (recBoard.toLowerCase().includes('ib') ? 'ib' : 
                     (recBoard.toLowerCase().includes('cambridge') ? 'Cambridge (IGCSE)' : 'State Board')));
    
    const data = MASTER_DATA[boardKey];
    const isPremiumTier = (selectedPrice >= 999);
    const isPlatinumTier = (selectedPrice >= 1499);

    let html = `
        <div id="pdf-header" style="background:#0F172A; color:white; padding:30px; text-align:center; margin-bottom:30px; border-radius:12px;">
            <div style="font-size:2rem; font-weight:800;">Apt <span style="color:var(--sunrise-primary);">Skola</span></div>
            <div style="font-size:1.2rem;">${selectedPackage} Report</div>
            <div style="font-size:0.9rem; margin-top:10px;">Prepared for: ${customerData.childName || 'Student'} | Order ID: ${customerData.orderId}</div>
        </div>
    `;

    if (!isPlatinumTier) html += xrayCardHtml;

    html += `
        <div class="report-card" style="background:var(--navy-premium); color:white; border:none;">
            <div style="font-size:1.1rem; opacity:0.8; text-transform:uppercase;">The Recommended Archetype</div>
            <div style="font-size:2.2rem; font-weight:800; margin:5px 0;">${data.title}</div>
            <div style="background:rgba(255,255,255,0.1); padding:10px; border-radius:8px; display:inline-block; margin-top:10px;">
                Board Match: <span style="color:var(--sunrise-primary); font-weight:bold;">${recBoard}</span>
            </div>
        </div>
        <div class="report-card">
            <div class="report-header-bg">STUDENT PERSONA & MATCH LOGIC</div>
            <div class="narrative-item"><h3 class="narrative-theme">Archetype: ${data.persona}</h3><p>${data.profile}</p></div>
        </div>
        <div id="schoolFinderBlock" class="report-card">
            <div class="report-header-bg">LOCAL SCHOOL SCOUT: ${recBoard}</div>
            <p style="font-size:0.9rem; color:#64748B;">Scanning for verified ${recBoard} schools in ${customerData.residentialArea || 'the area'}...</p>
        </div>
    `;

    const preview = document.getElementById('reportPreview');
    if (preview) {
        preview.innerHTML = html;
        setTimeout(() => {
            fetchNearbySchools(recBoard, customerData.residentialArea, customerData.pincode, 0);
        }, 800);
    }
}

async function downloadReport() {
    const { jsPDF } = window.jspdf;
    const reportElement = document.getElementById('reportPreview');
    if(!reportElement) return;
    const cards = reportElement.querySelectorAll('.report-card, #pdf-header, .xray-card, .foviz-banner, .btn-ambassador');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - (2 * margin);
    
    let currentY = margin;

    for (let i = 0; i < cards.length; i++) {
        const canvas = await html2canvas(cards[i], { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

        if (currentY + imgHeight > pdfHeight - margin) {
            pdf.addPage();
            currentY = margin;
        }

        pdf.addImage(imgData, 'JPEG', margin, currentY, contentWidth, imgHeight);
        currentY += imgHeight + 5;
    }
    pdf.save(`Apt-Skola-${customerData.childName || 'Report'}.pdf`);
}

function sharePDF() {
    if (navigator.share) navigator.share({ title: 'Apt Skola Report', url: window.location.href });
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    calculateCostOfConfusion();
    checkPaymentStatus(); 
    loadGoogleMaps().catch(err => console.warn("Maps init failed:", err));
    const logos = document.querySelectorAll('#landingHeaderLogo');
    logos.forEach(l => l.addEventListener('click', goToLandingPage));
});
/**
 * Student Intelligence Engine
 * Handles logic for skill level calculation, AI context summarization, and intelligence scoring.
 */

export const calculateSkillLevel = (metrics) => {
    const { leetcode_solved = 0, total_projects = 0 } = metrics || {};
    
    // Logic:
    // Beginner: < 2 projects OR < 50 problems
    // Intermediate: 2-5 projects AND 50+ problems
    // Advanced: 5+ projects OR 200+ problems
    
    if (total_projects >= 5 || leetcode_solved >= 200) return 'Advanced';
    if (total_projects >= 2 && leetcode_solved >= 50) return 'Intermediate';
    return 'Beginner';
};

export const calculateIntelligenceScore = (userData) => {
    const { metrics = {} } = userData || {};
    
    const problemsScore = Math.min((metrics.leetcode_solved || 0) * 2, 400); // 400 max
    const projectScore = Math.min((metrics.total_projects || 0) * 100, 300); // 300 max
    const researchScore = Math.min((metrics.research_papers || 0) * 150, 300); // 300 max
    const experienceScore = Math.min((metrics.total_experience || 0) * 100, 200); // 200 max
    const academicsScore = Math.min(parseFloat(metrics.cgpa || 0) * 10, 100); // 100 max
    
    const total = problemsScore + projectScore + researchScore + experienceScore + academicsScore;
    return Math.min(total, 1000); // Max score 1000
};

export const generateAiContextSummary = (userData) => {
    if (!userData) return "No student data available.";

    const { 
        identity = {}, 
        metrics = {}, 
        career_dna = {}
    } = userData;

    const skillLevel = calculateSkillLevel(metrics);

    return `
Student Profile:
Name: ${identity.name || 'Student'}
Year: ${identity.year || 'N/A'}
Branch: ${identity.branch || 'N/A'}

Coding & Project Stats:
- LeetCode Solved: ${metrics.leetcode_solved || 0}
- Original Projects Built: ${metrics.total_projects || 0}
- Research Papers: ${metrics.research_papers || 0}
- Total Experience: ${metrics.total_experience || 0}
- Academic Performance (GPA): ${metrics.cgpa || 'N/A'}
- GitHub Stars: ${metrics.github_stars || 0}
- Top Languages (from GitHub): ${metrics.top_languages?.join(', ') || 'Unknown'}

Learning Behavior:
- Consistency: ${metrics.streak || 0} day streak
- Skill Level: ${skillLevel}

Current Goal: ${career_dna.learning_goal || 'Becoming a Software Engineer'}
`.trim();
};

export const getBehavioralInsight = (userData) => {
    const { metrics = {} } = userData || {};
    const streak = metrics.streak || 0;
    
    if (streak >= 7) return "Incredible consistency! You're in the top 5% of active students this week.";
    if (streak >= 3) return "You're building a great habit. Keep the momentum going for 4 more days to hit a weekly streak.";
    return "Start a coding habit today! Even 30 minutes of practice counts towards your daily streak.";
};

export const generateWeeklyGoals = (userData) => {
    const { metrics = {}, career_dna = {} } = userData || {};
    const goals = [];

    // Goal 1: Skill based
    if ((metrics.leetcode_solved || 0) < 50) {
        goals.push({ target: "Solve 10 Easy DSA Problems", type: "dsa", priority: "High" });
    } else if ((metrics.leetcode_solved || 0) < 200) {
        goals.push({ target: "Solve 5 Medium DSA Problems", type: "dsa", priority: "Medium" });
    } else {
        goals.push({ target: "Participate in Weekly Contest", type: "dsa", priority: "Medium" });
    }

    // Goal 2: Project based
    if ((metrics.total_projects || 0) === 0) {
        goals.push({ target: "Initialize First GitHub Project", type: "mern", priority: "High" });
    } else if ((metrics.total_projects || 0) < 3) {
        goals.push({ target: "Build a Portfolio Website", type: "mern", priority: "Medium" });
    } else {
        goals.push({ target: "Deploy one project to Cloud", type: "cloud", priority: "Low" });
    }

    // Goal 3: Career based
    const target = career_dna.target_role?.toLowerCase() || "";
    if (target.includes("backend")) {
        goals.push({ target: "Master JWT Authentication", type: "mern", priority: "High" });
    } else if (target.includes("frontend")) {
        goals.push({ target: "Optimize React Performance", type: "mern", priority: "High" });
    } else {
        goals.push({ target: "Optimize Technical Resume", type: "mern", priority: "Medium" });
    }

    return goals;
};

export const performSkillGapAnalysis = (userData) => {
    const { onboarding = {}, metrics = {} } = userData || {};
    const skills = onboarding.skills || {};
    const topLangs = metrics.top_languages || [];
    
    // Benchmarks based on target roles (simplified)
    const analysis = [
        { 
            skill: topLangs[0] || "Core Stack", 
            val: Math.min(40 + (metrics.total_projects || 0) * 10, 95), 
            demand: "92%", 
            color: "from-emerald-400 to-emerald-600",
            status: (metrics.total_projects || 0) >= 3 ? "Advanced" : "Growth Plan"
        },
        { 
            skill: "DSA & Logic", 
            val: Math.min(20 + (metrics.leetcode_solved || 0) / 2, 90), 
            demand: "88%", 
            color: "from-blue-400 to-blue-600",
            status: (metrics.leetcode_solved || 0) >= 100 ? "Strong" : "Foundation"
        },
        { 
            skill: "Soft Skills", 
            val: skills.communication || 50, 
            demand: "85%", 
            color: "from-purple-400 to-purple-600",
            status: (skills.communication || 0) > 70 ? "Lead Ready" : "Practice"
        }
    ];

    return analysis;
};

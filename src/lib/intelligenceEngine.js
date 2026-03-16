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
    const streakScore = Math.min((metrics.streak || 0) * 10, 100); // 100 max
    const communityScore = Math.min((metrics.hackathon_wins || 0) * 50, 200); // 200 max
    
    const total = problemsScore + projectScore + streakScore + communityScore;
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

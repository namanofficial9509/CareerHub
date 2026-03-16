/**
 * Platform Connector Utility
 * Handles fetching metrics from external platforms like GitHub and LeetCode.
 */

/**
 * Fetches GitHub statistics for a given username.
 * Documentation: https://docs.github.com/en/rest/users/users
 */
export const fetchGithubStats = async (username) => {
    if (!username) return null;
    
    try {
        // 1. Fetch user profile
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('GitHub user not found');
        const userData = await userRes.json();
        
        // 2. Fetch all public repos (handling pagination for > 100 repos)
        let repos = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore && page <= 5) { // Limit to 5 pages (500 repos) for performance
            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`);
            if (!reposRes.ok) break;
            const pageData = await reposRes.json();
            if (pageData.length === 0) {
                hasMore = false;
            } else {
                repos = [...repos, ...pageData];
                if (pageData.length < 100) hasMore = false;
                page++;
            }
        }
        
        let totalStars = 0;
        let ownReposCount = 0;
        const languages = {};
        
        repos.forEach(repo => {
            if (!repo.fork) {
                ownReposCount++;
                totalStars += repo.stargazers_count;
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            }
        });

        // Get top 3 languages
        const topLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([lang]) => lang);

        return {
            username: username,
            publicRepos: ownReposCount, // Only count original repos
            totalRepos: userData.public_repos, // Total including forks
            followers: userData.followers,
            totalStars,
            topLanguages,
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('GitHub Fetch Error:', error);
        throw error;
    }
};

/**
 * Fetches LeetCode statistics.
 * Note: LeetCode doesn't have a public CORS-enabled API for browsers.
 * In a real production app, this would call a backend proxy or an unofficial wrapper.
 * For this prototype, we simulate the fetch to demonstrate the data flow.
 */
export const fetchLeetcodeStats = async (username) => {
    if (!username) return null;

    try {
        // Simulated LeetCode API response (using the structure from common wrappers)
        // In production: return await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`).then(r => r.json());
        
        // For hackathon demo purposes, we generate realistic numbers based on username length or random
        // to show the UI reacting to "real" data.
        const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        return {
            username: username,
            totalSolved: (hash % 400) + 50,
            ranking: (hash * 123) % 100000 + 5000,
            easySolved: (hash % 100) + 20,
            mediumSolved: (hash % 150) + 15,
            hardSolved: (hash % 50) + 5,
            acceptanceRate: (65.5 + (hash % 10)).toFixed(1),
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('LeetCode Fetch Error:', error);
        throw error;
    }
};

/**
 * Unified fetcher that gathers all platform stats
 */
export const syncAllPlatformData = async (links) => {
    const results = {};
    
    if (links.github) {
        results.github = await fetchGithubStats(links.github).catch(() => null);
    }
    
    if (links.leetcode) {
        results.leetcode = await fetchLeetcodeStats(links.leetcode).catch(() => null);
    }
    
    return results;
};

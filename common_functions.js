// common_functions.js

// Function to generate a simple hash from a string
function stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Simple Linear Congruential Generator (LCG) for deterministic pseudo-random numbers
let currentSeed;
function setSeed(s) {
    currentSeed = s;
}
function nextRandom() {
    // A common LCG formula: X_n+1 = (a * X_n + c) mod m
    // Using parameters from Numerical Recipes: a=1664525, c=1013904223, m=2^32
    // For simplicity and browser compatibility, we'll use smaller numbers that still provide variation
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280; // Normalize to [0, 1)
}

/**
 * Generates a deterministic flag based on a user ID and challenge ID.
 * The flag will be one of 120 combinations, unique per user and challenge.
 * @param {string} userId - The unique ID of the user.
 * @param {string} challengeId - The ID of the challenge (e.g., 'xss-level1', 'sqli-level1').
 * @returns {string} The deterministically generated flag.
 */
function generateDeterministicFlag(userId, challengeId) {
    // Ensure userId is available
    if (!userId) {
        console.error("User ID is missing for deterministic flag generation.");
        return "FLAG_ERROR_NO_USER_ID";
    }

    const combinedSeedString = userId + challengeId;
    const initialSeed = stringToSeed(combinedSeedString);
    setSeed(initialSeed); // Set the seed for this specific flag generation

    // Generate a number between 1 and 120 (inclusive)
    const combinationNumber = Math.floor(nextRandom() * 120) + 1; // 1 to 120

    // Format the number with leading zeros (e.g., 001, 010, 120)
    const formattedCombination = String(combinationNumber).padStart(3, '0');

    // Convert challengeId to uppercase and replace hyphens with underscores for flag format
    const formattedChallengeId = challengeId.toUpperCase().replace(/-/g, '_');

    return `FLAG_${formattedChallengeId}_${formattedCombination}`;
}

/**
 * Manages the user ID, ensuring one is generated and stored if not present.
 * @returns {string} The unique user ID.
 */
function getOrCreateUserId() {
    let userId = localStorage.getItem('cyberBuddyUserId');
    if (!userId) {
        userId = crypto.randomUUID(); // Generate a new unique ID
        localStorage.setItem('cyberBuddyUserId', userId);
    }
    return userId;
}

// Initialize user ID on script load
const currentUserId = getOrCreateUserId();

// Expose functions globally if needed, or use modules if environment supports
// For simple HTML files, direct exposure is common.
window.generateDeterministicFlag = generateDeterministicFlag;
window.getOrCreateUserId = getOrCreateUserId;
window.currentUserId = currentUserId; // Make it easily accessible

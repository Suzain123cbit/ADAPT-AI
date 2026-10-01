const PROFILE_STORAGE_KEY = 'adapt_user_profile';
const RESULTS_STORAGE_KEY = 'adapt_diagnostic_results';

export const DEFAULT_PROFILE = {
  topic: 'Python for AI',
  goal: 'Build intelligent AI apps & agents',
  dailyTime: 30, // 15, 30, 60
  explanationPreference: 'Code-first', // Step-by-step, Analogy, Visual, Code-first, Technical, Socratic
  completedOnboarding: false,
};

/**
 * Save user onboarding profile to localStorage
 */
export function saveProfile(profile) {
  try {
    const data = { ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Failed to save profile to localStorage:', error);
    return profile;
  }
}

/**
 * Load user onboarding profile from localStorage
 */
export function loadProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load profile from localStorage:', error);
    return null;
  }
}

/**
 * Save diagnostic results to localStorage
 */
export function saveDiagnosticResults(results) {
  try {
    const data = {
      ...results,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Failed to save diagnostic results:', error);
    return results;
  }
}

/**
 * Load diagnostic results from localStorage
 */
export function loadDiagnosticResults() {
  try {
    const stored = localStorage.getItem(RESULTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load diagnostic results:', error);
    return null;
  }
}

/**
 * Clear all stored data for fresh demo/test
 */
export function clearAllData() {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(RESULTS_STORAGE_KEY);
    localStorage.removeItem('adapt_concept_mastery');
    localStorage.removeItem('adapt_weaknesses');
    localStorage.removeItem('adapt_weakness_latest');
    localStorage.removeItem('adapt_practice_stats');
    localStorage.removeItem('adapt_adaptation_count');
    localStorage.removeItem('adapt_adaptation_history');
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

/**
 * Calculate mastery tier status:
 * 80–100: Mastered
 * 50–79: Developing
 * below 50: Weak
 */
export function getMasteryTier(score) {
  if (score >= 80) {
    return {
      status: 'Mastered',
      color: 'emerald',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      barColor: 'from-emerald-500 to-teal-400',
      textColor: 'text-emerald-400'
    };
  }
  if (score >= 50) {
    return {
      status: 'Developing',
      color: 'amber',
      bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      barColor: 'from-amber-500 to-orange-400',
      textColor: 'text-amber-400'
    };
  }
  return {
    status: 'Weak',
    color: 'rose',
    bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    barColor: 'from-rose-500 to-red-400',
    textColor: 'text-rose-400'
  };
}

/**
 * Compute concept mastery scores (0 - 100) and identify strengths & weaknesses
 */
export function computeMasteryAnalysis(answers) {
  // answers is an array or object containing responses per concept
  // answer item: { conceptId, conceptName, difficulty, isCorrect, selectedOption, correctAnswer }
  
  const conceptScores = {};
  
  answers.forEach((ans) => {
    // Prefer a live tutor-updated mastery score when one has been stored.
    // Otherwise derive the baseline score from the original diagnostic response.
    let score = typeof ans.score === 'number' ? Math.max(0, Math.min(100, Math.round(ans.score))) : 0;
    if (typeof ans.score !== 'number') {
      if (ans.isCorrect) {
        if (ans.difficulty === 'hard') score = 96;
        else if (ans.difficulty === 'medium') score = 84;
        else score = 72; // easy correct is solid fundamental
      } else {
        if (ans.difficulty === 'hard') score = 48; // attempted hard, close to developing
        else if (ans.difficulty === 'medium') score = 38;
        else score = 25; // failed fundamental
      }
    }

    conceptScores[ans.conceptId] = {
      conceptId: ans.conceptId,
      conceptName: ans.conceptName,
      difficulty: ans.difficulty,
      isCorrect: ans.isCorrect,
      score: score,
      tier: getMasteryTier(score)
    };
  });

  const scoreValues = Object.values(conceptScores);
  const averageMastery = Math.round(
    scoreValues.reduce((sum, item) => sum + item.score, 0) / (scoreValues.length || 1)
  );

  const strengths = scoreValues
    .filter(item => item.score >= 70)
    .sort((a, b) => b.score - a.score);

  const weaknesses = scoreValues
    .filter(item => item.score < 70)
    .sort((a, b) => a.score - b.score);

  return {
    conceptScores,
    scoreValues,
    averageMastery,
    strengths,
    weaknesses
  };
}

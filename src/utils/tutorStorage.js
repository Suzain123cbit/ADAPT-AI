import { loadDiagnosticResults, saveDiagnosticResults } from './storage.js';

const TUTOR_MASTERY_KEY = 'adapt_concept_mastery';
const WEAKNESS_FLAGS_KEY = 'adapt_weaknesses';

/**
 * Get current concept mastery score from localStorage or fallback
 */
export function getConceptMasteryScore(conceptId, fallbackScore = 50) {
  try {
    const customScores = JSON.parse(localStorage.getItem(TUTOR_MASTERY_KEY) || '{}');
    if (typeof customScores[conceptId] === 'number') {
      return customScores[conceptId];
    }

    // Check diagnostic results in storage
    const diagnostic = loadDiagnosticResults();
    if (diagnostic && Array.isArray(diagnostic.answers)) {
      const match = diagnostic.answers.find(a => a.conceptId === conceptId);
      if (match) {
        // compute score based on diagnostic rules
        if (match.isCorrect) {
          if (match.difficulty === 'hard') return 96;
          if (match.difficulty === 'medium') return 84;
          return 72;
        } else {
          if (match.difficulty === 'hard') return 48;
          if (match.difficulty === 'medium') return 38;
          return 25;
        }
      }
    }

    return fallbackScore;
  } catch (e) {
    console.error('Error reading concept mastery:', e);
    return fallbackScore;
  }
}

/**
 * Save updated concept mastery score to localStorage (clamped 0-100)
 * Also syncs with diagnostic results so Knowledge Map and Roadmap stay synchronized.
 */
export function setConceptMasteryScore(conceptId, newScore) {
  try {
    const clamped = Math.max(0, Math.min(100, Math.round(newScore)));
    const customScores = JSON.parse(localStorage.getItem(TUTOR_MASTERY_KEY) || '{}');
    customScores[conceptId] = clamped;
    localStorage.setItem(TUTOR_MASTERY_KEY, JSON.stringify(customScores));

    // Also synchronize into diagnosticResults in localStorage if present
    const diagnostic = loadDiagnosticResults();
    if (diagnostic && Array.isArray(diagnostic.answers)) {
      const idx = diagnostic.answers.findIndex(a => a.conceptId === conceptId);
      if (idx !== -1) {
        // update the record
        diagnostic.answers[idx].score = clamped;
      } else {
        diagnostic.answers.push({
          conceptId,
          conceptName: conceptId,
          score: clamped,
          isCorrect: clamped >= 70
        });
      }
      saveDiagnosticResults(diagnostic);
    }

    return clamped;
  } catch (e) {
    console.error('Error saving concept mastery score:', e);
    return newScore;
  }
}

/**
 * Calculate mastery update according to Phase 3 rules:
 * - Correct without hint: +10
 * - Correct after hint: +5
 * - Wrong answer: -3
 * - Repeated wrong answer: -8
 */
export function calculateMasteryUpdate({ currentScore, isCorrect, usedHint, consecutiveErrors }) {
  let delta = 0;
  let reason = '';

  if (isCorrect) {
    if (usedHint) {
      delta = 5;
      reason = 'Correct with hint (+5)';
    } else {
      delta = 10;
      reason = 'Correct without hint (+10)';
    }
  } else {
    // Wrong answer
    if (consecutiveErrors >= 2) {
      delta = -8;
      reason = 'Repeated error (-8)';
    } else {
      delta = -3;
      reason = 'Incorrect attempt (-3)';
    }
  }

  const updatedScore = Math.max(0, Math.min(100, currentScore + delta));

  return {
    delta,
    updatedScore,
    reason
  };
}

/**
 * Weakness Flag management
 * Saves a weakness flag in localStorage if learner repeatedly answers incorrectly.
 * Example in localStorage: weakness: "parameters_vs_arguments"
 */
export function saveWeaknessFlag(conceptId, details = {}) {
  try {
    const flags = JSON.parse(localStorage.getItem(WEAKNESS_FLAGS_KEY) || '{}');
    const isNewFlag = !flags[conceptId];

    flags[conceptId] = {
      conceptId,
      flaggedAt: flags[conceptId]?.flaggedAt || new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      weakness: conceptId,
      ...flags[conceptId],
      ...details
    };
    localStorage.setItem(WEAKNESS_FLAGS_KEY, JSON.stringify(flags));

    // A new weakness corresponds to one visible roadmap adaptation.
    if (isNewFlag) {
      const count = Number(localStorage.getItem('adapt_adaptation_count') || 0) + 1;
      localStorage.setItem('adapt_adaptation_count', String(count));
      const history = JSON.parse(localStorage.getItem('adapt_adaptation_history') || '[]');
      history.push({ conceptId, at: new Date().toISOString(), ...details });
      localStorage.setItem('adapt_adaptation_history', JSON.stringify(history.slice(-20)));
    }

    // Also save direct legacy key for explicit inspection
    localStorage.setItem('adapt_weakness_latest', conceptId);
    return flags;
  } catch (e) {
    console.error('Error saving weakness flag:', e);
    return null;
  }
}

/**
 * Retrieve all currently flagged weaknesses from localStorage
 */
export function getWeaknessFlags() {
  try {
    return JSON.parse(localStorage.getItem(WEAKNESS_FLAGS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

/**
 * Clear a weakness flag once mastery improves (e.g. >= 70%)
 */
export function clearWeaknessFlag(conceptId) {
  try {
    const flags = JSON.parse(localStorage.getItem(WEAKNESS_FLAGS_KEY) || '{}');
    if (flags[conceptId]) {
      delete flags[conceptId];
      localStorage.setItem(WEAKNESS_FLAGS_KEY, JSON.stringify(flags));
    }
    return flags;
  } catch (e) {
    return {};
  }
}

const PRACTICE_STATS_KEY = 'adapt_practice_stats';
const ADAPTATION_COUNT_KEY = 'adapt_adaptation_count';
const ADAPTATION_HISTORY_KEY = 'adapt_adaptation_history';

/** Return every tutor-updated mastery score currently stored. */
export function getAllConceptMasteryScores() {
  try {
    return JSON.parse(localStorage.getItem(TUTOR_MASTERY_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

/** Persist lightweight practice analytics for the progress dashboard. */
export function recordPracticeAttempt({ conceptId, isCorrect, usedHint, delta, scoreAfter }) {
  try {
    const stats = JSON.parse(localStorage.getItem(PRACTICE_STATS_KEY) || '{"attempts":0,"correct":0,"hints":0,"history":[]}');
    stats.attempts = (stats.attempts || 0) + 1;
    stats.correct = (stats.correct || 0) + (isCorrect ? 1 : 0);
    stats.hints = (stats.hints || 0) + (usedHint ? 1 : 0);
    stats.history = Array.isArray(stats.history) ? stats.history : [];
    stats.history.push({
      conceptId,
      isCorrect,
      usedHint,
      delta,
      scoreAfter,
      at: new Date().toISOString(),
    });
    stats.history = stats.history.slice(-50);
    localStorage.setItem(PRACTICE_STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (e) {
    console.error('Error recording practice attempt:', e);
    return { attempts: 0, correct: 0, hints: 0, history: [] };
  }
}

export function getPracticeStats() {
  try {
    return JSON.parse(localStorage.getItem(PRACTICE_STATS_KEY) || '{"attempts":0,"correct":0,"hints":0,"history":[]}');
  } catch (e) {
    return { attempts: 0, correct: 0, hints: 0, history: [] };
  }
}

export function getAdaptationCount() {
  const value = Number(localStorage.getItem(ADAPTATION_COUNT_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

export function getAdaptationHistory() {
  try {
    return JSON.parse(localStorage.getItem(ADAPTATION_HISTORY_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function clearTutorData() {
  try {
    localStorage.removeItem(TUTOR_MASTERY_KEY);
    localStorage.removeItem(WEAKNESS_FLAGS_KEY);
    localStorage.removeItem('adapt_weakness_latest');
    localStorage.removeItem(PRACTICE_STATS_KEY);
    localStorage.removeItem(ADAPTATION_COUNT_KEY);
    localStorage.removeItem(ADAPTATION_HISTORY_KEY);
  } catch (e) {
    console.error('Error clearing tutor data:', e);
  }
}

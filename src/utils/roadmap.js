import { computeMasteryAnalysis } from './storage.js';
import { getWeaknessFlags, getAdaptationCount, getConceptMasteryScore } from './tutorStorage.js';

export const ROADMAP_TOPICS_CONFIG = [
  {
    id: 'python_basics',
    title: 'Python Basics',
    description: 'Variables, primitive types, dynamic typing, and memory reference model.',
    diagnosticKey: 'python_basics',
    baseMinutes: 30,
  },
  {
    id: 'conditions',
    title: 'Conditions',
    description: 'Boolean branching, truthy/falsy evaluation, and short-circuit logic.',
    diagnosticKey: 'conditions',
    baseMinutes: 30,
  },
  {
    id: 'loops',
    title: 'Loops & Iteration',
    description: 'Range traversal, list comprehensions, and iteration protocols.',
    diagnosticKey: 'loops',
    baseMinutes: 30,
  },
  {
    id: 'functions',
    title: 'Functions',
    description: 'Function scopes, parameter passing, mutable defaults, and decorators.',
    diagnosticKey: 'functions',
    baseMinutes: 45,
  },
  {
    id: 'data_structures',
    title: 'Data Structures',
    description: 'Hash tables, dictionary lookups, sets, and constant-time search.',
    diagnosticKey: 'data_structures',
    baseMinutes: 45,
  },
  {
    id: 'apis',
    title: 'Working with APIs',
    description: 'HTTP POST requests, headers, JSON payloads, and token streaming.',
    diagnosticKey: 'apis',
    baseMinutes: 45,
  },
  {
    id: 'gemini_api_basics',
    title: 'Gemini API Basics',
    description: 'Model inference, temperature sampling, system instructions, and token budgets.',
    diagnosticKey: 'ai_api_concepts', // Mapped from diagnostic AI API concepts
    baseMinutes: 60,
  },
  {
    id: 'build_first_ai_app',
    title: 'Build Your First AI App',
    description: 'End-to-end integration: prompt chain, structured responses, and interactive interface.',
    diagnosticKey: null, // Capstone topic
    baseMinutes: 90,
  },
];

/**
 * Generate a personalised roadmap based on diagnostic results, live tutor mastery,
 * and any repeated-error weakness flags detected during practice.
 */
export function generatePersonalisedRoadmap(diagnosticData, profile) {
  const answers = diagnosticData?.answers || [];
  const analysis = computeMasteryAnalysis(answers);
  const dailyTime = profile?.dailyTime || 30;
  const weaknessFlags = getWeaknessFlags();
  const adaptationCount = getAdaptationCount();

  const buildStatus = (score, hasScore = true) => {
    if (!hasScore) {
      return {
        status: 'Upcoming',
        statusClass: 'text-slate-400 bg-slate-800/60 border-slate-700',
      };
    }
    if (score >= 80) {
      return {
        status: 'Mastered',
        statusClass: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      };
    }
    if (score >= 50) {
      return {
        status: 'Developing',
        statusClass: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      };
    }
    return {
      status: 'Priority',
      statusClass: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    };
  };

  const buildTime = (status) => {
    if (status === 'Mastered') {
      const minutes = Math.min(15, dailyTime);
      return { estimatedMinutes: minutes, estimatedLabel: `${minutes} mins (Quick Review)` };
    }
    if (status === 'Developing') {
      return { estimatedMinutes: dailyTime, estimatedLabel: `${dailyTime} mins (1 session)` };
    }
    if (status === 'Priority' || status === 'Adaptive Micro-Lesson') {
      const minutes = Math.max(15, dailyTime);
      return { estimatedMinutes: minutes, estimatedLabel: `${minutes} mins (Targeted session)` };
    }
    const minutes = Math.max(60, dailyTime * 2);
    const sessions = Math.ceil(minutes / dailyTime);
    return { estimatedMinutes: minutes, estimatedLabel: `${minutes} mins (${sessions} sessions)` };
  };

  // Base curriculum enriched with diagnostic/live mastery.
  let topicsWithMastery = ROADMAP_TOPICS_CONFIG.map((config) => {
    let score = 0;
    let hasDiagnosticScore = false;

    if (config.diagnosticKey && analysis.conceptScores[config.diagnosticKey]) {
      score = analysis.conceptScores[config.diagnosticKey].score;
      hasDiagnosticScore = true;
    }

    const { status, statusClass } = buildStatus(score, hasDiagnosticScore);
    const time = buildTime(status);

    return {
      ...config,
      tutorLessonId: config.id,
      score,
      hasDiagnosticScore,
      status,
      statusClass,
      ...time,
      isAdaptive: false,
    };
  });

  // Repeated mistakes visibly alter the curriculum. Each weakness gets one targeted
  // micro-lesson. The tutorLessonId maps the micro-lesson to an existing reliable local lesson.
  const adaptiveItems = [];

  const addAdaptive = ({ id, title, description, tutorLessonId, afterId, score, flagKey }) => {
    const item = {
      id,
      title,
      description,
      diagnosticKey: null,
      tutorLessonId,
      score: Math.max(0, Math.min(100, Math.round(score))),
      hasDiagnosticScore: true,
      status: 'Adaptive Micro-Lesson',
      statusClass: 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-500/35',
      ...buildTime('Adaptive Micro-Lesson'),
      isAdaptive: true,
      adaptedFrom: flagKey,
      flaggedAt: weaknessFlags[flagKey]?.flaggedAt || weaknessFlags[flagKey]?.lastSeenAt || '',
    };
    adaptiveItems.push(item);
    const idx = topicsWithMastery.findIndex((t) => t.id === afterId);
    const insertAt = idx >= 0 ? idx + 1 : topicsWithMastery.length;
    topicsWithMastery.splice(insertAt, 0, item);
  };

  if (weaknessFlags.functions || weaknessFlags.parameters_vs_arguments) {
    const sourceKey = weaknessFlags.parameters_vs_arguments ? 'parameters_vs_arguments' : 'functions';
    const score = getConceptMasteryScore(sourceKey, getConceptMasteryScore('functions', 40));
    addAdaptive({
      id: 'parameters_vs_arguments',
      title: 'Parameters vs Arguments',
      description: 'Targeted micro-lesson added after repeated function-signature errors. Clarifies placeholders, passed values, defaults, and keyword arguments.',
      tutorLessonId: 'parameters_vs_arguments',
      afterId: 'functions',
      score,
      flagKey: sourceKey,
    });
  }

  if (weaknessFlags.loops) {
    const score = getConceptMasteryScore('loops', 40);
    addAdaptive({
      id: 'loop_control_practice',
      title: 'Loop Control Practice',
      description: 'Adaptive reinforcement on range boundaries, break/continue, and tracing loop execution.',
      tutorLessonId: 'loops',
      afterId: 'loops',
      score,
      flagKey: 'loops',
    });
  }

  if (weaknessFlags.apis) {
    const score = getConceptMasteryScore('apis', 40);
    addAdaptive({
      id: 'api_request_anatomy',
      title: 'API Request Anatomy',
      description: 'Adaptive micro-lesson on authentication, headers, JSON payloads, HTTP status codes, and response parsing.',
      tutorLessonId: 'apis',
      afterId: 'data_structures',
      score,
      flagKey: 'apis',
    });
  }

  // Pick current lesson. A freshly inserted adaptive lesson takes precedence because
  // that is the visible proof that the curriculum changed in response to performance.
  let currentTopicId = null;
  if (adaptiveItems.length > 0) {
    const newest = [...adaptiveItems].sort((a, b) => (b.flaggedAt || '').localeCompare(a.flaggedAt || ''))[0];
    currentTopicId = newest.id;
  } else if (answers.length === 0) {
    currentTopicId = 'python_basics';
  } else {
    const nonMasteredTopics = topicsWithMastery.filter(
      (t) => !t.isAdaptive && t.hasDiagnosticScore && t.score < 80
    );
    if (nonMasteredTopics.length > 0) {
      currentTopicId = [...nonMasteredTopics].sort((a, b) => a.score - b.score)[0].id;
    } else {
      currentTopicId = 'build_first_ai_app';
    }
  }

  const roadmapItems = topicsWithMastery.map((item) => {
    const isCurrent = item.id === currentTopicId;
    let nodeType = 'upcoming';
    if (isCurrent) nodeType = 'current';
    else if (item.status === 'Mastered') nodeType = 'mastered';

    return { ...item, isCurrent, nodeType };
  });

  const skippedTopics = roadmapItems.filter((item) => item.status === 'Mastered' && !item.isCurrent);
  const prioritisedTopics = roadmapItems.filter(
    (item) => item.status === 'Priority' || item.isCurrent || item.isAdaptive
  );
  const currentTopic = roadmapItems.find((item) => item.isCurrent);

  return {
    roadmapItems,
    currentTopic,
    skippedTopics,
    prioritisedTopics,
    adaptiveItems,
    adaptationCount,
    totalTopics: roadmapItems.length,
    masteredCount: roadmapItems.filter((i) => i.nodeType === 'mastered').length,
    analysis,
  };
}

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Code, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Play, 
  RotateCcw,
  Zap,
  Target,
  FileCode2,
  Eye,
  Sliders,
  Compass,
  BarChart3
} from 'lucide-react';
import { TUTOR_LESSONS, PHASE_3_DEMO_TOPICS } from '../data/tutorLessons';
import { 
  getConceptMasteryScore, 
  setConceptMasteryScore, 
  calculateMasteryUpdate, 
  saveWeaknessFlag, 
  getWeaknessFlags,
  recordPracticeAttempt
} from '../utils/tutorStorage';
import { getMasteryTier } from '../utils/storage';
import { ROADMAP_TOPICS_CONFIG } from '../utils/roadmap';

const EXPLANATION_MODES = [
  { id: 'Analogy', label: 'Analogy', icon: Lightbulb, tip: 'Intuitive real-world comparisons' },
  { id: 'Step-by-step', label: 'Step-by-step', icon: FileCode2, tip: 'Sequential logical breakdown' },
  { id: 'Code-first', label: 'Code-first', icon: Code, tip: 'Working code examples first' },
  { id: 'Technical', label: 'Technical', icon: Layers, tip: 'Architectural & stack internals' },
  { id: 'Socratic', label: 'Socratic', icon: HelpCircle, tip: 'Guided inquiry & deduction' }
];

export default function TutorScreen({ 
  initialLessonId, 
  userProfile, 
  diagnosticData, 
  onBackToRoadmap,
  onViewProgress
}) {
  // Determine active lesson (fallback to 'loops' if initial not in tutor bank)
  const defaultLessonKey = TUTOR_LESSONS[initialLessonId] 
    ? initialLessonId 
    : 'loops';
  
  const [activeLessonKey, setActiveLessonKey] = useState(defaultLessonKey);
  const lesson = TUTOR_LESSONS[activeLessonKey] || TUTOR_LESSONS.loops;

  // Active explanation mode (pre-filled from learner onboarding preference)
  const [explanationMode, setExplanationMode] = useState(
    userProfile?.explanationPreference && EXPLANATION_MODES.some(m => m.id === userProfile.explanationPreference)
      ? userProfile.explanationPreference
      : 'Code-first'
  );

  // Concept mastery state for current concept (0 to 100)
  const [masteryScore, setMasteryScore] = useState(() => {
    return getConceptMasteryScore(activeLessonKey, 50);
  });

  // Track recent mastery delta for animated notification (+10, +5, -3, -8)
  const [recentDelta, setRecentDelta] = useState(null);

  // Consecutive error counter for current concept (triggers -8 and weakness flag on >=2)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);

  // Weakness flags from storage
  const [weaknessFlags, setWeaknessFlags] = useState(() => getWeaknessFlags());

  // Adaptive difficulty for practice questions: 'easy' | 'medium' | 'hard'
  const [practiceDifficulty, setPracticeDifficulty] = useState(lesson.defaultDifficulty || 'medium');

  // Interactive practice state
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hasUsedHint, setHasUsedHint] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState(null);
  const [showSimplerExplanation, setShowSimplerExplanation] = useState(false);

  // Session stats
  const [sessionStats, setSessionStats] = useState({
    attempts: 0,
    correctCount: 0,
    hintsUsedCount: 0
  });

  // Sync mastery when active lesson changes
  useEffect(() => {
    const currentScore = getConceptMasteryScore(activeLessonKey, 50);
    setMasteryScore(currentScore);
    setSelectedOption(null);
    setShowHint(false);
    setHasUsedHint(false);
    setIsAnswerSubmitted(false);
    setLastSubmissionResult(null);
    setShowSimplerExplanation(false);
    setConsecutiveErrors(0);
    setPracticeDifficulty(TUTOR_LESSONS[activeLessonKey]?.defaultDifficulty || 'medium');
  }, [activeLessonKey]);

  // Current practice question
  const currentQuestion = lesson.practiceQuestions[practiceDifficulty] || lesson.practiceQuestions.medium;
  const currentTier = getMasteryTier(masteryScore);

  const handleSelectOption = (optId) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optId);
  };

  const handleToggleHint = () => {
    setShowHint(prev => !prev);
    setHasUsedHint(true);
    setSessionStats(prev => ({ ...prev, hintsUsedCount: prev.hintsUsedCount + 1 }));
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsAnswerSubmitted(true);

    let nextConsecutiveErrors = isCorrect ? 0 : consecutiveErrors + 1;
    setConsecutiveErrors(nextConsecutiveErrors);

    // Apply Phase 3 Mastery calculation rules:
    // Correct without hint -> +10
    // Correct after hint -> +5
    // Wrong answer -> -3
    // Repeated wrong answer -> -8
    const { delta, updatedScore, reason } = calculateMasteryUpdate({
      currentScore: masteryScore,
      isCorrect,
      usedHint: hasUsedHint,
      consecutiveErrors: nextConsecutiveErrors
    });

    // Update mastery immediately on screen and in localStorage
    setMasteryScore(updatedScore);
    setConceptMasteryScore(activeLessonKey, updatedScore);
    setRecentDelta({ delta, reason });

    // Adaptive difficulty adjustment:
    let nextDifficulty = practiceDifficulty;
    if (isCorrect) {
      setShowSimplerExplanation(false);
      if (practiceDifficulty === 'easy') nextDifficulty = 'medium';
      else if (practiceDifficulty === 'medium') nextDifficulty = 'hard';
    } else {
      setShowSimplerExplanation(true);
      if (practiceDifficulty === 'hard') nextDifficulty = 'medium';
      else if (practiceDifficulty === 'medium') nextDifficulty = 'easy';
    }

    // Repeated wrong answer check -> save weakness flag in localStorage
    if (!isCorrect && nextConsecutiveErrors >= 2) {
      const updatedFlags = saveWeaknessFlag(activeLessonKey, {
        conceptTitle: lesson.title,
        errorCount: nextConsecutiveErrors,
        scoreAtFlag: updatedScore
      });
      setWeaknessFlags(updatedFlags || {});
    }

    setLastSubmissionResult({
      isCorrect,
      delta,
      reason,
      nextDifficulty,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation
    });

    setSessionStats(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount
    }));

    // Persist lightweight analytics for the Progress Dashboard.
    recordPracticeAttempt({
      conceptId: activeLessonKey,
      isCorrect,
      usedHint: hasUsedHint,
      delta,
      scoreAfter: updatedScore
    });
  };

  const handleNextPracticeQuestion = () => {
    if (lastSubmissionResult?.nextDifficulty) {
      setPracticeDifficulty(lastSubmissionResult.nextDifficulty);
    }
    setSelectedOption(null);
    setShowHint(false);
    setHasUsedHint(false);
    setIsAnswerSubmitted(false);
    setLastSubmissionResult(null);
  };

  const isFlaggedAsWeakness = Boolean(weaknessFlags[activeLessonKey]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fadeIn">
      
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-navy-850">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToRoadmap}
            className="p-2 rounded-xl bg-navy-850 hover:bg-navy-800 text-slate-400 hover:text-white border border-slate-800 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Roadmap</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">•</span>
            <span className="text-brand-violet font-semibold uppercase tracking-wider">Adaptive Tutor</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">{lesson.title}</span>
          </div>
        </div>

        {/* Current explanation style badge */}
        <div className="flex items-center gap-2 text-xs bg-navy-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-brand-violet animate-pulse" />
          <span>Active Tutor Mode: <strong className="text-white">{explanationMode}</strong></span>
        </div>
      </div>

      {/* THREE-SECTION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Learning Roadmap (Highlighted Current Lesson) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-navy-850/90 rounded-2xl border border-navy-800 p-4 sm:p-5 glow-card space-y-4">
            
            <div className="flex items-center justify-between border-b border-navy-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-cyan" />
                <h3 className="font-bold text-sm text-white">Curriculum Roadmap</h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-violet/15 text-brand-violet border border-brand-violet/30">
                Interactive
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Click any topic to switch active lesson and practice questions:
            </p>

            {/* List of Demo Topics and Roadmap Topics */}
            <div className="space-y-2">
              {PHASE_3_DEMO_TOPICS.map((topic) => {
                const isSelected = activeLessonKey === topic.id;
                const score = getConceptMasteryScore(topic.id, 50);
                const tier = getMasteryTier(score);

                return (
                  <div
                    key={topic.id}
                    onClick={() => setActiveLessonKey(topic.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-violet/20 via-brand-blue/15 to-navy-900 border-brand-violet ring-1 ring-brand-violet/50 shadow-md text-white'
                        : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <div className="w-2 h-2 rounded-full bg-brand-violet animate-ping" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        )}
                        <span className="text-xs font-bold">{topic.title}</span>
                      </div>

                      {/* Score Badge */}
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${tier.badgeBg}`}>
                        {score}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pl-4">
                      <span>{topic.category}</span>
                      {isSelected && (
                        <span className="text-brand-violet font-semibold text-[10px] uppercase tracking-wider">
                          Current Lesson
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Return to Roadmap button */}
            <button
              onClick={onBackToRoadmap}
              className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-navy-900 hover:bg-navy-800 border border-slate-800 transition flex items-center justify-center gap-1.5"
            >
              <span>View Full Visual Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </aside>

        {/* CENTER COLUMN: Lesson Explanation + Interactive Tutor + Practice Question */}
        <section className="lg:col-span-6 space-y-6">
          
          {/* Lesson Header & Explain Differently Controls */}
          <div className="bg-navy-850/90 rounded-2xl border border-navy-800 p-5 sm:p-6 glow-card space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800/80 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-violet">
                  {lesson.category}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-0.5">
                  {lesson.title}
                </h2>
              </div>

              {/* Explain Differently Button / Label */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Explain Differently:</span>
                </span>
              </div>
            </div>

            {/* Explain Differently Option Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {EXPLANATION_MODES.map((mode) => {
                const isActive = explanationMode === mode.id;
                const Icon = mode.icon;

                return (
                  <button
                    key={mode.id}
                    onClick={() => setExplanationMode(mode.id)}
                    title={mode.tip}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-blue to-brand-violet text-white border-brand-violet shadow-md shadow-brand-violet/25'
                        : 'bg-navy-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Short Explanation Box */}
            <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-brand-cyan font-semibold">
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-brand-violet" />
                  {explanationMode} Explanation
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Adapts to your style</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {lesson.explanations[explanationMode] || lesson.explanations['Code-first']}
              </p>
            </div>

            {/* Simpler Explanation Fallback (shown if previous answer was incorrect) */}
            {showSimplerExplanation && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-1 animate-fadeIn">
                <div className="font-bold flex items-center gap-1.5 text-amber-400">
                  <TrendingDown className="w-4 h-4" />
                  <span>Simpler Explanation (Calibrated for Reinforcement):</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {lesson.simplerExplanation}
                </p>
              </div>
            )}

            {/* Worked Example */}
            <div className="space-y-2 pt-2 border-t border-navy-800/80">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-brand-blue" />
                <span>Worked Example: {lesson.workedExample.title}</span>
              </div>

              <div className="rounded-xl overflow-hidden border border-navy-700 bg-navy-950">
                <div className="bg-navy-900 px-3 py-1.5 border-b border-navy-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>python3</span>
                  <span className="text-slate-500">runnable example</span>
                </div>
                <pre className="p-3.5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  <code>{lesson.workedExample.code}</code>
                </pre>
              </div>
              <p className="text-xs text-slate-400 italic">
                {lesson.workedExample.takeaway}
              </p>
            </div>

          </div>

          {/* Interactive Practice Question Card */}
          <div className="bg-navy-850/90 rounded-2xl border border-navy-800 p-5 sm:p-6 glow-card space-y-5">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-violet" />
                <h3 className="font-bold text-base text-white">Interactive Practice</h3>
              </div>

              {/* Dynamic Difficulty Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Difficulty:</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                  practiceDifficulty === 'easy'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : practiceDifficulty === 'medium'
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                }`}>
                  {currentQuestion.difficultyLabel}
                </span>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                {currentQuestion.prompt}
              </p>

              {currentQuestion.code && (
                <div className="rounded-xl overflow-hidden border border-navy-700 bg-navy-950">
                  <pre className="p-3.5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto">
                    <code>{currentQuestion.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5 pt-1">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = opt.id === currentQuestion.correctAnswer;
                
                let optionStyle = 'bg-navy-900/70 border-slate-800 hover:border-slate-700 text-slate-200';

                if (!isAnswerSubmitted) {
                  if (isSelected) {
                    optionStyle = 'bg-brand-violet/20 border-brand-violet text-white ring-1 ring-brand-violet/50';
                  }
                } else {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500/15 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
                  } else {
                    optionStyle = 'bg-navy-900/40 border-slate-800/40 text-slate-500 opacity-60';
                  }
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                        isSelected && !isAnswerSubmitted
                          ? 'bg-brand-violet border-brand-violet text-white'
                          : isAnswerSubmitted && isCorrect
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isAnswerSubmitted && isSelected && !isCorrect
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : 'bg-navy-800 border-slate-700 text-slate-400'
                      }`}>
                        {opt.id}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{opt.text}</span>
                    </div>

                    {isAnswerSubmitted && (
                      <div>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hint Box (revealed on clicking Hint) */}
            {showHint && (
              <div className="p-3.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/25 text-xs text-brand-cyan space-y-1 animate-fadeIn">
                <div className="font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <span>Tutor Hint:</span>
                </div>
                <p className="text-slate-300">{currentQuestion.hint}</p>
                <div className="text-[10px] text-slate-500 pt-1">
                  Note: Answering correctly after viewing a hint yields +5 mastery (vs +10 without hint).
                </div>
              </div>
            )}

            {/* Post-Submission Feedback Banner */}
            {isAnswerSubmitted && (
              <div className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                lastSubmissionResult?.isCorrect 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center justify-between font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    {lastSubmissionResult?.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                  
                  {/* Delta Notification Badge */}
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    lastSubmissionResult?.delta > 0 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {lastSubmissionResult?.delta > 0 ? `+${lastSubmissionResult.delta}` : lastSubmissionResult?.delta} Mastery
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lastSubmissionResult?.explanation}
                </p>

                {/* Adaptive Difficulty Shift Notice */}
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
                  <span>
                    Adaptive Engine: {lastSubmissionResult?.isCorrect 
                      ? 'Difficulty maintained/increased for subsequent questions' 
                      : 'Difficulty reduced slightly & simpler explanation unlocked'}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-navy-800">
              
              {/* Hint Button */}
              {!isAnswerSubmitted && (
                <button
                  onClick={handleToggleHint}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                    showHint 
                      ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan' 
                      : 'bg-navy-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{showHint ? 'Hide Hint' : 'Get Hint'}</span>
                </button>
              )}

              {/* Submit or Next Question Button */}
              <div className="ml-auto">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOption}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                      selectedOption
                        ? 'bg-gradient-to-r from-brand-blue to-brand-violet text-white shadow-lg shadow-brand-violet/25 hover:from-blue-500 hover:to-purple-500 cursor-pointer'
                        : 'bg-navy-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    <span>Submit Answer</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextPracticeQuestion}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-md shadow-brand-violet/30 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next Practice Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

          </div>

        </section>

        {/* RIGHT COLUMN: Current Concept Mastery & Progress */}
        <aside className="lg:col-span-3 space-y-4">
          
          {/* Concept Mastery Card */}
          <div className="bg-navy-850/90 rounded-2xl border border-navy-800 p-5 glow-card space-y-5">
            
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-violet" />
                <span>Concept Mastery</span>
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${currentTier.badgeBg}`}>
                {currentTier.status}
              </span>
            </div>

            {/* Circular / Large Mastery Display */}
            <div className="flex flex-col items-center justify-center p-4 bg-navy-900/80 rounded-2xl border border-slate-800 relative overflow-hidden">
              
              {/* Score Delta Floater */}
              {recentDelta && (
                <div className={`absolute top-2 right-2 text-xs font-mono font-bold px-2 py-0.5 rounded-full border animate-bounce ${
                  recentDelta.delta > 0 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}>
                  {recentDelta.delta > 0 ? `+${recentDelta.delta}` : recentDelta.delta}
                </div>
              )}

              <div className="text-4xl font-extrabold text-white font-mono">
                {masteryScore}<span className="text-base text-slate-500 font-normal">/100</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {lesson.title}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden mt-4 border border-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${currentTier.barColor} transition-all duration-500`}
                  style={{ width: `${masteryScore}%` }}
                />
              </div>

              <div className="flex justify-between w-full text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 Weak</span>
                <span>50 Dev</span>
                <span>80 Mastered</span>
              </div>
            </div>

            {/* Weakness Flag Notification (saved in localStorage on repeated errors) */}
            {isFlaggedAsWeakness && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Weakness Flagged</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Repeated errors detected on <strong className="text-white">"{lesson.title}"</strong>. ADAPT.AI has flagged this learning pattern and will insert a targeted micro-lesson into your roadmap automatically.
                </p>
                <button
                  onClick={onBackToRoadmap}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[11px] font-semibold text-rose-200 transition"
                >
                  View Adapted Roadmap
                </button>
              </div>
            )}

            {/* Session Stats */}
            <div className="space-y-2 text-xs pt-1">
              <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                Session Performance
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 text-center">
                  <div className="text-base font-bold text-white font-mono">{sessionStats.attempts}</div>
                  <div className="text-[10px] text-slate-400">Questions Tried</div>
                </div>
                <div className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 text-center">
                  <div className="text-base font-bold text-emerald-400 font-mono">{sessionStats.correctCount}</div>
                  <div className="text-[10px] text-slate-400">Correct Answers</div>
                </div>
              </div>
            </div>

            {/* Learner Context Badges */}
            <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 text-xs space-y-2 text-slate-400">
              <div className="flex items-center justify-between">
                <span>Daily Pace:</span>
                <span className="text-brand-blue font-semibold">{userProfile?.dailyTime || 30} mins/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Preferred Style:</span>
                <span className="text-brand-violet font-semibold">{userProfile?.explanationPreference || 'Code-first'}</span>
              </div>
            </div>

            <button
              onClick={onViewProgress}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-brand-cyan/10 hover:bg-brand-cyan/15 border border-brand-cyan/25 transition flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-3.5 h-3.5 text-brand-cyan" />
              <span>View Progress Dashboard</span>
            </button>

            {/* Return to Full Roadmap */}
            <button
              onClick={onBackToRoadmap}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-750 border border-slate-700/80 transition flex items-center justify-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Back to Learning Roadmap</span>
            </button>

          </div>

        </aside>

      </div>

    </div>
  );
}

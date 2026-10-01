import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Code, 
  HelpCircle,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { QUESTION_BANK, DIAGNOSTIC_SEQUENCE, CONCEPTS } from '../data/diagnosticQuestions';
import { saveDiagnosticResults } from '../utils/storage';

const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];

export default function DiagnosticTest({ userProfile, onComplete }) {
  // Current question index in the 7-question sequence (0 to 6)
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Dynamic difficulty level: 'easy' | 'medium' | 'hard'
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');
  
  // Track selection and answer submission
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  
  // Adaptive feedback status for visual feedback ('up' | 'down' | 'maintain' | null)
  const [adaptiveShift, setAdaptiveShift] = useState(null);
  
  // History of recorded answers
  const [answersHistory, setAnswersHistory] = useState([]);

  const currentConceptId = DIAGNOSTIC_SEQUENCE[currentIndex];
  const currentConceptMeta = CONCEPTS.find(c => c.id === currentConceptId);
  const currentQuestion = QUESTION_BANK[currentConceptId]?.[currentDifficulty];

  const handleSelectOption = (optId) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsAnswerSubmitted(true);

    // Calculate difficulty adaptation
    let nextDifficulty = currentDifficulty;
    let shift = 'maintain';

    if (isCorrect) {
      if (currentDifficulty === 'easy') {
        nextDifficulty = 'medium';
        shift = 'up';
      } else if (currentDifficulty === 'medium') {
        nextDifficulty = 'hard';
        shift = 'up';
      } else {
        // Already at hard: maintain top difficulty
        nextDifficulty = 'hard';
        shift = 'maintain';
      }
    } else {
      if (currentDifficulty === 'hard') {
        nextDifficulty = 'medium';
        shift = 'down';
      } else if (currentDifficulty === 'medium') {
        nextDifficulty = 'easy';
        shift = 'down';
      } else {
        // Already at easy: maintain baseline
        nextDifficulty = 'easy';
        shift = 'maintain';
      }
    }

    setAdaptiveShift(shift);

    // Record answer
    const answerRecord = {
      conceptId: currentConceptId,
      conceptName: currentConceptMeta.name,
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      difficulty: currentDifficulty,
      selectedOption,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation,
      nextDifficulty
    };

    const updatedHistory = [...answersHistory, answerRecord];
    setAnswersHistory(updatedHistory);
  };

  const handleNextQuestion = () => {
    const lastRecord = answersHistory[answersHistory.length - 1];
    const nextDiff = lastRecord ? lastRecord.nextDifficulty : currentDifficulty;

    if (currentIndex < DIAGNOSTIC_SEQUENCE.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentDifficulty(nextDiff);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setAdaptiveShift(null);
    } else {
      // Finished all 7 questions
      const finalPayload = {
        completedAt: new Date().toISOString(),
        profile: userProfile,
        answers: answersHistory,
      };
      saveDiagnosticResults(finalPayload);
      onComplete(finalPayload);
    }
  };

  const progressPercent = Math.round(((currentIndex + (isAnswerSubmitted ? 1 : 0)) / DIAGNOSTIC_SEQUENCE.length) * 100);

  // Difficulty badge styling
  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'easy':
        return {
          label: 'Tier 1 • Fundamental',
          className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        };
      case 'medium':
        return {
          label: 'Tier 2 • Intermediate',
          className: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
        };
      case 'hard':
        return {
          label: 'Tier 3 • Advanced',
          className: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
        };
      default:
        return {
          label: diff,
          className: 'bg-slate-800 text-slate-400 border-slate-700'
        };
    }
  };

  const diffBadge = getDifficultyBadge(currentDifficulty);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Progress & Diagnostic Meta Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              Question {currentIndex + 1} of {DIAGNOSTIC_SEQUENCE.length}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-brand-violet font-medium">
              {currentConceptMeta?.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Adaptive Difficulty Tier */}
            <div className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 ${diffBadge.className}`}>
              <Sparkles className="w-3 h-3" />
              <span>{diffBadge.label}</span>
            </div>

            <span className="text-slate-400 text-xs font-mono">
              {progressPercent}% Complete
            </span>
          </div>

        </div>

        {/* Top Progress Track */}
        <div className="w-full bg-navy-900 rounded-full h-2 overflow-hidden border border-navy-800">
          <div 
            className="bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 7-Step Dots */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
          {DIAGNOSTIC_SEQUENCE.map((conceptKey, idx) => {
            const answeredItem = answersHistory[idx];
            const isCurrent = idx === currentIndex;
            
            let dotClass = 'bg-navy-850 border-navy-700 text-slate-500';
            if (answeredItem) {
              dotClass = answeredItem.isCorrect 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                : 'bg-rose-500/20 border-rose-500 text-rose-400';
            } else if (isCurrent) {
              dotClass = 'bg-brand-violet/20 border-brand-violet text-brand-violet ring-2 ring-brand-violet/20 animate-pulse';
            }

            return (
              <div 
                key={conceptKey} 
                className={`py-1 px-1 rounded-lg border text-center text-[10px] sm:text-xs font-medium transition-all ${dotClass}`}
                title={CONCEPTS[idx]?.name}
              >
                <span className="hidden sm:inline">Q{idx + 1}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-navy-850/90 rounded-2xl border border-navy-800 p-6 sm:p-8 glow-card space-y-6">
        
        {/* Topic Header & Adaptive Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-brand-violet" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Concept Domain
              </div>
              <div className="text-sm font-bold text-white">
                {currentConceptMeta?.name}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-navy-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Adaptive Engine: Real-time difficulty calibration</span>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
            {currentQuestion?.question}
          </h3>

          {/* Code Snippet Box (if question contains code) */}
          {currentQuestion?.code && (
            <div className="rounded-xl overflow-hidden border border-navy-700/80 bg-navy-950">
              <div className="bg-navy-900/90 px-4 py-2 border-b border-navy-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-brand-cyan" />
                  python
                </span>
                <span>snippet</span>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{currentQuestion.code}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQuestion?.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isSubmitted = isAnswerSubmitted;
            const isCorrectAnswer = option.id === currentQuestion.correctAnswer;
            
            let optionStyles = 'bg-navy-900/70 border-slate-800 hover:border-slate-700 text-slate-200';
            
            if (!isSubmitted) {
              if (isSelected) {
                optionStyles = 'bg-brand-violet/15 border-brand-violet text-white ring-1 ring-brand-violet/50 shadow-md';
              }
            } else {
              // Highlight correct answer
              if (isCorrectAnswer) {
                optionStyles = 'bg-emerald-500/15 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50';
              } else if (isSelected && !isCorrectAnswer) {
                optionStyles = 'bg-rose-500/15 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
              } else {
                optionStyles = 'bg-navy-900/40 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${optionStyles}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                    isSelected && !isSubmitted
                      ? 'bg-brand-violet border-brand-violet text-white'
                      : isSubmitted && isCorrectAnswer
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isSubmitted && isSelected && !isCorrectAnswer
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : 'bg-navy-800 border-slate-700 text-slate-400'
                  }`}>
                    {option.id}
                  </div>
                  <span className="text-sm font-medium leading-snug">{option.text}</span>
                </div>

                {/* Status indicator icon if submitted */}
                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Post-submission Adaptive Feedback & Explanation */}
        {isAnswerSubmitted && (
          <div className="rounded-xl p-5 border bg-navy-900/90 border-navy-700/80 space-y-3 animate-fadeIn">
            
            {/* Adaptive Shift Indicator */}
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div className="flex items-center gap-2">
                {selectedOption === currentQuestion.correctAnswer ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct Answer!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                    <XCircle className="w-4 h-4" />
                    <span>Incorrect</span>
                  </div>
                )}
              </div>

              {/* Real-time difficulty calibration announcement */}
              <div className="flex items-center gap-1.5 text-xs">
                {adaptiveShift === 'up' && (
                  <span className="text-purple-400 flex items-center gap-1 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Difficulty increased for next question
                  </span>
                )}
                {adaptiveShift === 'down' && (
                  <span className="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-medium">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Calibrating slightly easier for next concept
                  </span>
                )}
                {adaptiveShift === 'maintain' && (
                  <span className="text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20 font-medium">
                    <Minus className="w-3.5 h-3.5" />
                    Difficulty maintained at current tier
                  </span>
                )}
              </div>
            </div>

            {/* Explanation text */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="text-brand-cyan font-semibold block mb-1">Explanation:</span>
              {currentQuestion.explanation}
            </div>

          </div>
        )}

        {/* Action Button Row */}
        <div className="pt-3 flex items-center justify-between border-t border-navy-800/80">
          <div className="text-xs text-slate-500 hidden sm:block">
            {isAnswerSubmitted 
              ? 'Click continue to calibrate the next question' 
              : 'Select an option and confirm your answer'}
          </div>

          <div className="ml-auto">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className={`px-7 py-3 rounded-xl font-semibold text-sm transition duration-200 flex items-center gap-2 ${
                  selectedOption
                    ? 'bg-gradient-to-r from-brand-blue to-brand-violet text-white shadow-lg shadow-brand-violet/25 hover:from-blue-500 hover:to-purple-500 cursor-pointer'
                    : 'bg-navy-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                }`}
              >
                <span>Confirm Answer</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-brand-violet/25 hover:shadow-brand-violet/40 cursor-pointer flex items-center gap-2 group transition duration-200"
              >
                <span>
                  {currentIndex < DIAGNOSTIC_SEQUENCE.length - 1 
                    ? 'Next Question' 
                    : 'Generate Knowledge Map'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

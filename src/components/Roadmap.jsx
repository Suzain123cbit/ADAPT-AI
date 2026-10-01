import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ChevronRight, 
  TrendingUp, 
  FastForward, 
  Target, 
  Lightbulb, 
  RotateCcw,
  Zap,
  Lock,
  Layers,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { generatePersonalisedRoadmap } from '../utils/roadmap';

export default function Roadmap({ diagnosticData, userProfile, onViewKnowledgeMap, onRetakeDiagnostic, onStartLesson, onViewProgress }) {

  // Generate roadmap data from diagnostic & profile in localStorage
  const roadmapData = generatePersonalisedRoadmap(diagnosticData, userProfile);
  const { 
    roadmapItems, 
    currentTopic, 
    skippedTopics, 
    prioritisedTopics, 
    totalTopics, 
    masteredCount,
    adaptiveItems,
    adaptationCount
  } = roadmapData;

  const dailyTime = userProfile?.dailyTime || 30;
  const explanationPreference = userProfile?.explanationPreference || 'Code-first';
  const goal = userProfile?.goal || 'Build intelligent AI apps & agents';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-navy-850/90 rounded-3xl border border-navy-800 p-6 sm:p-8 glow-card space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-navy-800">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/15 text-brand-violet text-xs font-semibold uppercase tracking-wider border border-brand-violet/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalised Roadmap</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Python for AI Learning Path
            </h2>
            
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              Custom-tailored curriculum calibrated to your diagnostic strengths, weaknesses, and {explanationPreference} style.
            </p>
          </div>

          {/* Quick Action Button & Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onStartLesson?.(currentTopic?.tutorLessonId || currentTopic?.id)}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-brand-violet/30 hover:shadow-brand-violet/50 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Current Lesson</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
            </button>
          </div>

        </div>

        {/* Profile Context Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Target Goal</span>
            <span className="font-semibold text-white truncate block mt-0.5">{goal}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Daily Budget</span>
            <span className="font-semibold text-brand-blue block mt-0.5">{dailyTime} mins / day</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Tutor Format</span>
            <span className="font-semibold text-brand-violet block mt-0.5">{explanationPreference}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Milestones</span>
            <span className="font-semibold text-brand-cyan block mt-0.5">{masteredCount} of {totalTopics} Mastered</span>
          </div>
        </div>

      </div>

      {/* Personalised Diagnostic Impact Explanation Message */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-brand-violet/30 space-y-4">
        
        <div className="flex items-center gap-2.5 text-brand-violet">
          <div className="w-8 h-8 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-violet" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">How your diagnostic shaped this roadmap</h3>
            <p className="text-xs text-slate-400">Adaptive curriculum calibration details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          
          {/* Skipped / Mastered Topics Message */}
          <div className="p-4 rounded-xl bg-navy-950/70 border border-emerald-500/25 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <FastForward className="w-4 h-4" />
              <span>Skipped & Accelerated Topics (Mastery ≥ 80%)</span>
            </div>
            {skippedTopics.length > 0 ? (
              <p className="text-slate-300 leading-relaxed text-xs">
                You demonstrated solid proficiency in <span className="font-semibold text-emerald-300">{skippedTopics.map(t => `${t.title} (${t.score}%)`).join(', ')}</span>. Comprehensive introductory lectures for these modules are skipped so you progress faster.
              </p>
            ) : (
              <p className="text-slate-400 text-xs">
                No modules qualified for immediate skipping. You will build comprehensive fluency from the foundational concepts.
              </p>
            )}
          </div>

          {/* Prioritised Topics Message */}
          <div className="p-4 rounded-xl bg-navy-950/70 border border-brand-violet/25 space-y-2">
            <div className="flex items-center gap-2 text-brand-violet font-semibold text-xs">
              <Target className="w-4 h-4" />
              <span>Prioritised Focus Areas (Mastery &lt; 50% or Weakest)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {currentTopic ? (
                <>
                  <span className="font-semibold text-purple-300">{currentTopic.title}</span> ({currentTopic.score}%) was detected as your weakest prerequisite area and has been made your <span className="text-white font-bold">Current Lesson</span>. It will be reinforced using your <span className="text-brand-cyan font-semibold">{explanationPreference}</span> preference in {dailyTime}-minute daily sessions.
                </>
              ) : (
                'All diagnostic modules met mastery thresholds. Your roadmap advances directly to hands-on AI app synthesis.'
              )}
            </p>
          </div>

        </div>

      </div>

      {adaptiveItems?.length > 0 && (
        <div className="p-5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-fuchsia-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Learning Pattern Detected — Roadmap Adapted</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Repeated practice errors triggered {adaptiveItems.length} targeted micro-lesson{adaptiveItems.length === 1 ? '' : 's'}: <span className="text-fuchsia-300 font-semibold">{adaptiveItems.map(i => i.title).join(', ')}</span>. Your current lesson has been recalibrated automatically.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-navy-950 border border-fuchsia-500/30 text-fuchsia-300 whitespace-nowrap">
            {adaptationCount} adaptation{adaptationCount === 1 ? '' : 's'}
          </span>
        </div>
      )}

      {/* Polished Vertical Roadmap Section */}
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-blue" />
              <span>Curriculum Progression</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Green = Mastered • Blue/Violet = Current Lesson • Grey = Upcoming
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-slate-400">Mastered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-brand-violet/30 border border-brand-violet flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-ping" />
              </div>
              <span className="text-slate-300 font-medium">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
              <span className="text-slate-500">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-brand-violet before:to-slate-800">
          
          {roadmapItems.map((item, index) => {
            const isCurrent = item.nodeType === 'current';
            const isMastered = item.nodeType === 'mastered';
            const isUpcoming = item.nodeType === 'upcoming';

            return (
              <div key={item.id} className="relative group">
                
                {/* Node Indicator on the Timeline Rail */}
                <div 
                  className={`absolute -left-6 sm:-left-8 top-5 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition duration-300 z-10 ${
                    isMastered
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-brand-violet border-brand-violet text-white shadow-lg shadow-brand-violet/50 ring-4 ring-brand-violet/20 animate-pulse'
                      : 'bg-navy-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {isMastered && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
                  {isCurrent && <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white ml-0.5" />}
                  {isUpcoming && <span className="text-xs font-mono font-semibold">{index + 1}</span>}
                </div>

                {/* Card Container */}
                <div
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-gradient-to-r from-navy-850 via-brand-violet/10 to-navy-850 border-brand-violet/60 shadow-xl shadow-brand-violet/15 ring-1 ring-brand-violet/40'
                      : isMastered
                      ? 'bg-navy-850/70 border-emerald-500/30 hover:border-emerald-500/50'
                      : 'bg-navy-900/50 border-navy-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {/* Top Row: Title, Status Badge, and Mastery % */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    
                    <div className="flex items-center gap-2.5">
                      <h4 className={`text-base sm:text-lg font-bold ${isCurrent ? 'text-white' : isMastered ? 'text-slate-100' : 'text-slate-300'}`}>
                        {item.title}
                      </h4>

                      {/* Current Lesson Pill */}
                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-violet text-white shadow-sm shadow-brand-violet/40">
                          Current Lesson
                        </span>
                      )}
                    </div>

                    {/* Status & Mastery Tags */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Diagnostic Mastery % */}
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-navy-950 border border-slate-800 text-slate-300">
                        {item.hasDiagnosticScore ? `${item.score}% Mastery` : 'Capstone Project'}
                      </span>

                      {/* Status Tag: Mastered / Developing / Priority / Upcoming */}
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </div>

                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bottom Meta & Action Row */}
                  <div className="pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    
                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>Est: <strong className="text-slate-200">{item.estimatedLabel}</strong></span>
                      </span>

                      {isMastered && (
                        <span className="text-emerald-400 text-[11px] font-medium hidden sm:inline">
                          ✓ Prerequisite satisfied
                        </span>
                      )}

                      {isCurrent && (
                        <span className="text-brand-violet text-[11px] font-medium hidden sm:inline">
                          ★ Recommended next step
                        </span>
                      )}
                    </div>

                    {/* Direct Button if current item */}
                    {isCurrent && (
                      <button
                        onClick={() => onStartLesson?.(currentTopic?.tutorLessonId || currentTopic?.id)}
                        className="self-start sm:self-auto px-4 py-1.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-blue to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-md shadow-brand-violet/25 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Start Lesson</span>
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <button
            onClick={onViewKnowledgeMap}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-navy-850 hover:bg-navy-800 border border-slate-700/60 transition flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-brand-cyan" />
            <span>View Knowledge Map</span>
          </button>

          <button
            onClick={onRetakeDiagnostic}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-navy-850 hover:bg-navy-800 border border-slate-700/60 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Diagnostic</span>
          </button>
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <button
            onClick={onViewProgress}
            className="px-5 py-3 rounded-xl font-semibold text-sm text-slate-200 bg-navy-850 hover:bg-navy-800 border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-brand-cyan" />
            <span>View Progress</span>
          </button>
          <button
            onClick={() => onStartLesson?.(currentTopic?.tutorLessonId || currentTopic?.id)}
            className="px-7 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-brand-violet/25 hover:shadow-brand-violet/40 transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Start Current Lesson</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

      </div>



    </div>
  );
}

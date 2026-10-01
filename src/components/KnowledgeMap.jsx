import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Compass, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  Target,
  Sliders,
  Award,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { computeMasteryAnalysis, getMasteryTier } from '../utils/storage';
import { CONCEPTS } from '../data/diagnosticQuestions';
export default function KnowledgeMap({ diagnosticData, userProfile, onRetakeDiagnostic, onEditOnboarding, onGenerateRoadmap }) {
  const [selectedConceptFilter, setSelectedConceptFilter] = useState('all'); // 'all' | 'mastered' | 'developing' | 'weak'

  const answers = diagnosticData?.answers || [];
  const analysis = computeMasteryAnalysis(answers);

  const filterConceptList = () => {
    if (selectedConceptFilter === 'all') return analysis.scoreValues;
    if (selectedConceptFilter === 'mastered') {
      return analysis.scoreValues.filter(c => c.score >= 80);
    }
    if (selectedConceptFilter === 'developing') {
      return analysis.scoreValues.filter(c => c.score >= 50 && c.score < 80);
    }
    if (selectedConceptFilter === 'weak') {
      return analysis.scoreValues.filter(c => c.score < 50);
    }
    return analysis.scoreValues;
  };

  const filteredConcepts = filterConceptList();

  const overallTier = getMasteryTier(analysis.averageMastery);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Top Banner & Overview */}
      <div className="bg-navy-850/90 rounded-3xl border border-navy-800 p-6 sm:p-8 glow-card space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-navy-800">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan text-xs font-semibold uppercase tracking-wider border border-brand-cyan/30">
              <Compass className="w-3.5 h-3.5" />
              <span>Diagnostic Complete</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Knowledge Map
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              Real-time concept mastery derived from your 7-question adaptive diagnostic.
            </p>
          </div>

          {/* Overall Mastery Pill */}
          <div className="flex items-center gap-4 bg-navy-900/90 p-4 rounded-2xl border border-navy-750">
            <div className="text-right">
              <div className="text-xs uppercase font-bold text-slate-400">Mastery Index</div>
              <div className="text-3xl font-extrabold text-white">
                {analysis.averageMastery}<span className="text-sm font-normal text-slate-400">/100</span>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${overallTier.badgeBg}`}>
              {overallTier.status}
            </div>
          </div>

        </div>

        {/* Learner Profile Context Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-navy-900/70 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Topic</span>
            <span className="font-semibold text-white truncate block mt-0.5">{userProfile?.topic || 'Python for AI'}</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-900/70 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Goal</span>
            <span className="font-semibold text-white truncate block mt-0.5">{userProfile?.goal || 'Build AI apps'}</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-900/70 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Daily Pace</span>
            <span className="font-semibold text-brand-blue block mt-0.5">{userProfile?.dailyTime || 30} min / day</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-900/70 border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Explanation Mode</span>
            <span className="font-semibold text-brand-violet block mt-0.5">{userProfile?.explanationPreference || 'Code-first'}</span>
          </div>
        </div>

      </div>

      {/* Concept Mastery Visual Progress Bars */}
      <div className="space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-violet" />
              <span>Concept Mastery Breakdown (0–100)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              80–100: Mastered • 50–79: Developing • Below 50: Weak
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-navy-900 rounded-xl border border-navy-800 text-xs">
            <button
              onClick={() => setSelectedConceptFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                selectedConceptFilter === 'all'
                  ? 'bg-brand-violet text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All (7)
            </button>
            <button
              onClick={() => setSelectedConceptFilter('mastered')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedConceptFilter === 'mastered'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mastered ({analysis.scoreValues.filter(c => c.score >= 80).length})
            </button>
            <button
              onClick={() => setSelectedConceptFilter('developing')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedConceptFilter === 'developing'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Developing ({analysis.scoreValues.filter(c => c.score >= 50 && c.score < 80).length})
            </button>
            <button
              onClick={() => setSelectedConceptFilter('weak')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedConceptFilter === 'weak'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weak ({analysis.scoreValues.filter(c => c.score < 50).length})
            </button>
          </div>
        </div>

        {/* Concept Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConcepts.map((item) => {
            const tier = item.tier;
            const meta = CONCEPTS.find(c => c.id === item.conceptId);

            return (
              <div 
                key={item.conceptId}
                className="bg-navy-850/80 rounded-2xl border border-navy-800 p-5 hover:border-slate-700 transition space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-white text-base">
                      {item.conceptName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {meta?.description}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border uppercase tracking-wider ${tier.badgeBg}`}>
                      {tier.status}
                    </span>
                    <div className="text-xs font-mono font-bold text-slate-300 mt-1">
                      {item.score}%
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden border border-navy-800/80">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${tier.barColor} transition-all duration-700`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Tested at: {item.difficulty.toUpperCase()} tier</span>
                    <span>Result: {item.isCorrect ? 'Correct (+)' : 'Incorrect (-)'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Personalised Strengths and Weaknesses Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Strengths Card */}
        <div className="bg-navy-850/80 rounded-2xl border border-emerald-500/30 p-6 glow-card space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Your Strengths</h4>
              <p className="text-xs text-slate-400">Concepts with high retention and accuracy</p>
            </div>
          </div>

          {analysis.strengths.length > 0 ? (
            <div className="space-y-2.5">
              {analysis.strengths.map(s => (
                <div key={s.conceptId} className="p-3 rounded-xl bg-navy-900/80 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-semibold text-white">{s.conceptName}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{s.score}% mastery</span>
                </div>
              ))}
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                You have solid foundations here. In future learning sprints, ADAPT.AI will skip redundant remedial drills in these topics to accelerate your pace.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-navy-900/60 text-xs text-slate-400">
              No concepts have reached the 70%+ threshold yet. A dedicated foundation sprint will build quick wins.
            </div>
          )}
        </div>

        {/* Weaknesses Card */}
        <div className="bg-navy-850/80 rounded-2xl border border-rose-500/30 p-6 glow-card space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Growth & Weak Areas</h4>
              <p className="text-xs text-slate-400">Concepts requiring deliberate reinforcement</p>
            </div>
          </div>

          {analysis.weaknesses.length > 0 ? (
            <div className="space-y-2.5">
              {analysis.weaknesses.map(w => (
                <div key={w.conceptId} className="p-3 rounded-xl bg-navy-900/80 border border-rose-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-sm font-semibold text-white">{w.conceptName}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-400">{w.score}% mastery</span>
                </div>
              ))}
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                ADAPT.AI recommends prioritizing these using your <span className="text-brand-violet font-semibold">{userProfile?.explanationPreference || 'Code-first'}</span> preference with {userProfile?.dailyTime || 30} minutes per day.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-navy-900/60 text-xs text-emerald-400">
              Outstanding! You demonstrated proficient or mastered capability across all 7 evaluated concepts.
            </div>
          )}
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-brand-violet/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-brand-violet" />
            <span>Ready for your personalised curriculum?</span>
          </h4>
          <p className="text-xs text-slate-400">
            Generate an AI curriculum tailored to your detected mastery, goal, and daily pace.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetakeDiagnostic}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-750 border border-slate-700/60 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Diagnostic</span>
          </button>

          <button
            onClick={onEditOnboarding}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-750 border border-slate-700/60 transition flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          {/* Button: Generate My Learning Path -> Opens Phase 2 Personalised Roadmap */}
          <button
            onClick={onGenerateRoadmap}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-brand-violet/30 hover:shadow-brand-violet/50 transition flex items-center gap-2 group cursor-pointer"
          >
            <span>Generate My Learning Path</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

      </div>

    </div>
  );
}

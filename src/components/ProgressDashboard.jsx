import React from 'react';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Brain,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import {
  getConceptMasteryScore,
  getPracticeStats,
  getAdaptationCount,
  getAdaptationHistory,
} from '../utils/tutorStorage';
import { getMasteryTier } from '../utils/storage';

function diagnosticBaselineScore(answer) {
  if (!answer) return 0;
  if (answer.isCorrect) {
    if (answer.difficulty === 'hard') return 96;
    if (answer.difficulty === 'medium') return 84;
    return 72;
  }
  if (answer.difficulty === 'hard') return 48;
  if (answer.difficulty === 'medium') return 38;
  return 25;
}

export default function ProgressDashboard({ diagnosticData, userProfile, onBackToRoadmap, onContinueLearning, onRetakeDiagnostic }) {
  const answers = diagnosticData?.answers || [];
  const practiceStats = getPracticeStats();
  const adaptationCount = getAdaptationCount();
  const adaptationHistory = getAdaptationHistory();

  const conceptRows = answers.map((answer) => {
    const initial = diagnosticBaselineScore(answer);
    const current = getConceptMasteryScore(answer.conceptId, initial);
    return {
      id: answer.conceptId,
      name: answer.conceptName,
      initial,
      current,
      delta: current - initial,
      tier: getMasteryTier(current),
    };
  });

  const initialMastery = conceptRows.length
    ? Math.round(conceptRows.reduce((sum, item) => sum + item.initial, 0) / conceptRows.length)
    : 0;
  const currentMastery = conceptRows.length
    ? Math.round(conceptRows.reduce((sum, item) => sum + item.current, 0) / conceptRows.length)
    : 0;
  const improvement = currentMastery - initialMastery;
  const mastered = conceptRows.filter((item) => item.current >= 80);
  const weak = conceptRows.filter((item) => item.current < 50);
  const developing = conceptRows.filter((item) => item.current >= 50 && item.current < 80);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            onClick={onBackToRoadmap}
            className="mb-4 px-3 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmap
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            Learning Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">Your Progress Dashboard</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            ADAPT.AI compares your diagnostic baseline with live practice mastery to show what changed, what still needs work, and how the roadmap adapted.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-navy-850 border border-slate-800 rounded-xl px-4 py-3">
          <div className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Learning goal</div>
          <div className="text-white font-semibold mt-1">{userProfile?.goal || 'Build intelligent AI apps & agents'}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Initial Mastery" value={`${initialMastery}%`} icon={Brain} accent="text-slate-200" />
        <MetricCard label="Current Mastery" value={`${currentMastery}%`} icon={Target} accent="text-brand-cyan" />
        <MetricCard label="Improvement" value={`${improvement >= 0 ? '+' : ''}${improvement}%`} icon={TrendingUp} accent={improvement >= 0 ? 'text-emerald-400' : 'text-rose-400'} />
        <MetricCard label="Roadmap Adaptations" value={adaptationCount} icon={Sparkles} accent="text-brand-violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-navy-850/90 rounded-2xl border border-navy-800 p-5 sm:p-6 glow-card">
          <div className="flex items-center justify-between gap-3 border-b border-navy-800 pb-4 mb-5">
            <div>
              <h2 className="font-bold text-white text-lg">Concept-wise Mastery</h2>
              <p className="text-xs text-slate-400 mt-1">Diagnostic baseline → current tutor mastery</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{conceptRows.length} concepts</span>
          </div>

          <div className="space-y-4">
            {conceptRows.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-navy-900/65 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{item.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${item.tier.badgeBg}`}>{item.tier.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-500">{item.initial}%</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-white font-bold">{item.current}%</span>
                    <span className={item.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      ({item.delta >= 0 ? '+' : ''}{item.delta})
                    </span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-navy-950 border border-slate-800 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${item.tier.barColor} transition-all duration-500`} style={{ width: `${item.current}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="bg-navy-850/90 rounded-2xl border border-navy-800 p-5 glow-card space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-blue" /> Session Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <SmallStat label="Quizzes attempted" value={practiceStats.attempts || 0} />
              <SmallStat label="Correct answers" value={practiceStats.correct || 0} />
              <SmallStat label="Hints used" value={practiceStats.hints || 0} />
              <SmallStat label="Mastered concepts" value={mastered.length} />
            </div>
          </div>

          <div className="bg-navy-850/90 rounded-2xl border border-navy-800 p-5 glow-card space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-violet" />
              <h3 className="font-bold text-white">Adaptive Intelligence</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              ADAPT.AI has adapted your learning path <strong className="text-brand-violet">{adaptationCount} time{adaptationCount === 1 ? '' : 's'}</strong> based on repeated practice patterns.
            </p>
            {adaptationHistory.length > 0 ? (
              <div className="space-y-2">
                {adaptationHistory.slice(-3).reverse().map((event, index) => (
                  <div key={`${event.conceptId}-${index}`} className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs">
                    <div className="font-semibold text-fuchsia-300">Micro-lesson inserted</div>
                    <div className="text-slate-400 mt-1">Detected repeated difficulty in <span className="text-white">{event.conceptTitle || event.conceptId}</span>.</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500">No adaptive intervention has been triggered yet. Intentionally miss the same practice concept twice to demo this feature.</div>
            )}
          </div>

          <div className="bg-navy-850/90 rounded-2xl border border-navy-800 p-5 glow-card space-y-3">
            <div className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /><span className="font-bold text-sm">Mastered</span></div>
            <p className="text-xs text-slate-400">{mastered.length ? mastered.map((x) => x.name).join(', ') : 'No concepts have reached 80% mastery yet.'}</p>
            <div className="flex items-center gap-2 text-rose-400 pt-2"><AlertTriangle className="w-4 h-4" /><span className="font-bold text-sm">Needs Attention</span></div>
            <p className="text-xs text-slate-400">{weak.length ? weak.map((x) => x.name).join(', ') : developing.length ? `Developing: ${developing.map((x) => x.name).join(', ')}` : 'No weak concepts detected.'}</p>
          </div>
        </aside>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={onRetakeDiagnostic}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-navy-850 hover:bg-navy-800 border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Retake Diagnostic
        </button>
        <button
          onClick={onContinueLearning}
          className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet shadow-lg shadow-brand-violet/25 transition flex items-center justify-center gap-2"
        >
          Continue Learning <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="p-5 rounded-2xl bg-navy-850/90 border border-navy-800 glow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-bold text-slate-500">{label}</span>
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <div className={`text-3xl font-extrabold font-mono mt-3 ${accent}`}>{value}</div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-navy-900 border border-slate-800 text-center">
      <div className="text-xl font-bold text-white font-mono">{value}</div>
      <div className="text-[10px] text-slate-500 mt-1">{label}</div>
    </div>
  );
}

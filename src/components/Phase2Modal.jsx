import React from 'react';
import { 
  Sparkles, 
  X, 
  MapPin, 
  Clock, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  BrainCircuit
} from 'lucide-react';

export default function Phase2Modal({ isOpen, onClose, profile, analysis }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-navy-900 border border-brand-violet/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-violet/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/15 text-brand-violet text-xs font-semibold uppercase tracking-wider border border-brand-violet/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 2 Placeholder</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Personalised Learning Path Generator
            </h3>
            
            <p className="text-sm text-slate-300">
              Phase 1 completed! In Phase 2, ADAPT.AI transforms your diagnostic mastery and learning style into a dynamic, adaptive curriculum.
            </p>
          </div>

          {/* User Profile Context */}
          <div className="p-4 rounded-2xl bg-navy-850 border border-navy-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Topic</span>
              <span className="font-semibold text-white truncate block">{profile?.topic || 'Python for AI'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Time Budget</span>
              <span className="font-semibold text-white block">{profile?.dailyTime || 30} min / day</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Explanation Mode</span>
              <span className="font-semibold text-brand-cyan block">{profile?.explanationPreference || 'Code-first'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Avg Mastery</span>
              <span className="font-semibold text-brand-violet block">{analysis?.averageMastery || 0}%</span>
            </div>
          </div>

          {/* Curriculum Preview Structure */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Preview: Generated Curriculum Sequence
            </div>

            <div className="space-y-2">
              {/* Sprint 1: Targeted reinforcement for weaknesses */}
              <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>Targeted Reinforcement Sprint</span>
                    <span className="text-[10px] bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30">
                      Weak Areas Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Focused drills on {analysis?.weaknesses?.length ? analysis.weaknesses.map(w => w.conceptName).slice(0, 2).join(' & ') : 'core foundational concepts'} using your preferred {profile?.explanationPreference || 'Code-first'} format.
                  </p>
                </div>
              </div>

              {/* Sprint 2: Core AI projects */}
              <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-brand-violet/20 text-brand-violet flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>AI Engineering Application Milestones</span>
                    <span className="text-[10px] bg-brand-violet/15 text-brand-violet px-2 py-0.5 rounded border border-brand-violet/30">
                      Goal Aligned
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Hands-on project track targeting: “{profile?.goal || 'Build intelligent AI apps & agents'}” with {profile?.dailyTime || 30}-minute daily sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-750 transition"
            >
              Back to Knowledge Map
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

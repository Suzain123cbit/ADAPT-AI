import React from 'react';
import { Sparkles, X, BrainCircuit, ArrowLeft, Clock, Target, Lightbulb } from 'lucide-react';

export default function Phase3Modal({ isOpen, onClose, currentTopic, profile }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-navy-900 border border-brand-violet/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-violet/25 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6 text-center sm:text-left">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/15 text-brand-violet text-xs font-semibold uppercase tracking-wider border border-brand-violet/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 3 Preview</span>
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              Adaptive Tutor coming in Phase 3.
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              In Phase 3, your interactive AI tutor will guide you through this lesson dynamically adjusting explanations, hints, and code exercises.
            </p>
          </div>

          {/* Current Lesson Card Preview */}
          <div className="p-4 rounded-2xl bg-navy-850 border border-navy-800 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Selected Starting Lesson</span>
              <span className="text-brand-violet font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-violet/15 border border-brand-violet/25">
                Current
              </span>
            </div>
            
            <div className="text-lg font-bold text-white">
              {currentTopic?.title || 'Python Basics'}
            </div>

            <p className="text-xs text-slate-400">
              {currentTopic?.description}
            </p>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                <span>{currentTopic?.estimatedLabel || '30 mins'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lightbulb className="w-3.5 h-3.5 text-brand-violet" />
                <span>Style: {profile?.explanationPreference || 'Code-first'}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-md shadow-brand-violet/20 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Roadmap</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

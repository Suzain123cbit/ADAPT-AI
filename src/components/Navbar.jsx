import React from 'react';
import { Sparkles, Brain, Compass, RefreshCw, Map, GraduationCap, BarChart3 } from 'lucide-react';

export default function Navbar({ currentView, setView, hasResults, onReset }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-navy-950/85 border-b border-navy-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <button 
          onClick={() => setView('landing')}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-indigo to-brand-violet p-0.5 shadow-lg shadow-brand-violet/20 group-hover:shadow-brand-violet/40 transition duration-300">
            <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition duration-300" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                ADAPT<span className="text-brand-violet">.AI</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-violet/20 text-brand-violet border border-brand-violet/30">
                MVP
              </span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Personalised AI Tutor
            </span>
          </div>
        </button>

        {/* Navigation Badges / Stepper */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setView('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              currentView === 'landing'
                ? 'bg-navy-800 text-white border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setView('onboarding')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              currentView === 'onboarding'
                ? 'bg-navy-800 text-white border border-slate-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
            }`}
          >
            Onboarding
          </button>

          <button
            onClick={() => setView('diagnostic')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
              currentView === 'diagnostic'
                ? 'bg-navy-800 text-white border border-brand-violet/40 text-brand-violet shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
            <span>Diagnostic</span>
          </button>

          {hasResults && (
            <>
              <button
                onClick={() => setView('knowledge_map')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'knowledge_map'
                    ? 'bg-navy-800 text-brand-cyan border border-brand-cyan/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Knowledge Map</span>
              </button>

              <button
                onClick={() => setView('roadmap')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'roadmap'
                    ? 'bg-navy-800 text-brand-violet border border-brand-violet/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
                }`}
              >
                <Map className="w-3.5 h-3.5 text-brand-violet" />
                <span>Roadmap</span>
              </button>

              <button
                onClick={() => setView('tutor')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'tutor'
                    ? 'bg-navy-800 text-brand-blue border border-brand-blue/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-brand-blue" />
                <span className="hidden lg:inline">Tutor</span>
              </button>

              <button
                onClick={() => setView('progress')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentView === 'progress'
                    ? 'bg-navy-800 text-brand-cyan border border-brand-cyan/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="hidden lg:inline">Progress</span>
              </button>
            </>
          )}

          {/* Reset / Clear Data */}
          <button
            onClick={onReset}
            title="Reset diagnostic & demo state"
            className="ml-2 p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-navy-800/80 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </nav>

      </div>
    </header>
  );
}

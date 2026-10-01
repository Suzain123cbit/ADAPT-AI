import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Zap, 
  Activity, 
  SlidersHorizontal 
} from 'lucide-react';

export default function LandingPage({ onStartLearning, onTryDemo, hasResults, onViewKnowledgeMap, onViewRoadmap }) {
  return (
    <div className="relative overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-blue/20 via-brand-violet/20 to-brand-cyan/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Brand Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/90 border border-brand-violet/30 text-xs sm:text-sm font-medium text-slate-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-brand-violet animate-pulse" />
            <span className="text-brand-violet font-semibold tracking-wide uppercase">ADAPT.AI</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Hackathon MVP • Adaptive Engine & Roadmap</span>
          </div>

          {/* Headline & Tagline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              AI shouldn't teach <br className="hidden sm:inline" />
              <span className="gradient-text">everyone the same way.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              “An AI tutor that learns how you learn.”
            </p>
          </div>

          {/* Subtext description */}
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Experience our 7-question adaptive diagnostic. It calibrates real-time difficulty to map your Python for AI mastery, strengths, and unique learning style.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-brand-violet/25 hover:shadow-brand-violet/40 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
            </button>

            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-navy-850 hover:bg-navy-800 border border-slate-700/80 hover:border-slate-600 transition duration-200 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-brand-cyan fill-brand-cyan/20" />
              <span>Try Demo</span>
            </button>
          </div>

          {/* Quick status if learner already completed a diagnostic */}
          {hasResults && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
              <button
                onClick={onViewKnowledgeMap}
                className="text-brand-cyan hover:underline inline-flex items-center gap-1.5"
              >
                <span>View Knowledge Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={onViewRoadmap}
                className="text-brand-violet hover:underline inline-flex items-center gap-1.5 font-medium"
              >
                <span>View Personalised Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Feature Preview Cards */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Onboarding & Preferences */}
          <div className="p-6 rounded-2xl bg-navy-850/70 border border-navy-800 backdrop-blur-sm hover:border-brand-blue/40 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition">
              <SlidersHorizontal className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">1. Personalised Onboarding</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Define your goals, daily 15/30/60 minute pace, and preferred explanation mode: Step-by-step, Analogy, Visual, Code-first, Technical, or Socratic.
            </p>
          </div>

          {/* Card 2: Adaptive Diagnostic */}
          <div className="p-6 rounded-2xl bg-navy-850/70 border border-navy-800 backdrop-blur-sm hover:border-brand-violet/40 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">2. Adaptive 7-Question Test</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time calibration covering Python Basics, Conditions, Loops, Functions, Data Structures, APIs, and AI API concepts. Difficulty scales as you answer.
            </p>
          </div>

          {/* Card 3: AI Knowledge Map */}
          <div className="p-6 rounded-2xl bg-navy-850/70 border border-navy-800 backdrop-blur-sm hover:border-brand-cyan/40 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">3. AI Knowledge Map</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Concept mastery scoring from 0–100 with visual progress bars categorized into Mastered (80–100), Developing (50–79), and Weak (&lt;50).
            </p>
          </div>

        </div>

        {/* Diagnostic topics pill row */}
        <div className="mt-12 p-4 rounded-xl bg-navy-900/60 border border-navy-800/80 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-300">
          <span className="text-slate-400 font-medium">Diagnostic Coverage:</span>
          <span className="px-2.5 py-1 rounded-md bg-navy-800 border border-slate-700/60">Python Basics</span>
          <span className="px-2.5 py-1 rounded-md bg-navy-800 border border-slate-700/60">Conditions</span>
          <span className="px-2.5 py-1 rounded-md bg-navy-800 border border-slate-700/60">Loops</span>
          <span className="px-2.5 py-1 rounded-md bg-navy-800 border border-slate-700/60">Functions</span>
          <span className="px-2.5 py-1 rounded-md bg-navy-800 border border-slate-700/60">Data Structures</span>
          <span className="px-2.5 py-1 rounded-md bg-navy-800 border border-slate-700/60">APIs</span>
          <span className="px-2.5 py-1 rounded-md bg-navy-800 border border-slate-700/60">AI API Concepts</span>
        </div>

      </div>
    </div>
  );
}

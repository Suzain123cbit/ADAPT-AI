import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Code, 
  Lightbulb, 
  Eye, 
  Terminal, 
  FileCode2, 
  HelpCircle,
  Cpu
} from 'lucide-react';
import { DEFAULT_PROFILE, saveProfile } from '../utils/storage';

const TOPIC_OPTIONS = [
  {
    id: 'Python for AI',
    title: 'Python for AI',
    badge: 'Recommended Demo Topic',
    description: 'Essential Python syntax, data manipulation, HTTP APIs, and LLM inference integrations.',
    icon: Terminal
  },
  {
    id: 'Prompt Engineering & LLMs',
    title: 'Prompt Engineering & LLMs',
    badge: 'Available',
    description: 'System prompting, zero-shot/few-shot techniques, chain-of-thought, and JSON structured outputs.',
    icon: Sparkles
  },
  {
    id: 'RAG & Vector Search',
    title: 'RAG & Vector Search',
    badge: 'Available',
    description: 'Embeddings, vector databases, chunking strategies, and semantic retrieval pipelines.',
    icon: Cpu
  }
];

const GOAL_OPTIONS = [
  { id: 'Build AI apps & agents', label: 'Build autonomous AI apps & agent workflows' },
  { id: 'Career transition into AI', label: 'Transition into AI Engineering or Machine Learning career' },
  { id: 'Automate business tasks', label: 'Automate repetitive workflows & business processes with LLMs' },
  { id: 'Master foundational principles', label: 'Master deep theoretical and mathematical foundations of AI' },
];

const TIME_OPTIONS = [
  { value: 15, label: '15 min / day', sub: 'Micro-learning pace' },
  { value: 30, label: '30 min / day', sub: 'Balanced progression (Recommended)' },
  { value: 60, label: '60 min / day', sub: 'Accelerated intensive' },
];

const PREFERENCE_OPTIONS = [
  {
    id: 'Step-by-step',
    name: 'Step-by-step',
    icon: FileCode2,
    desc: 'Structured, sequential breakdowns with clear instructions at each stage.'
  },
  {
    id: 'Analogy',
    name: 'Analogy',
    icon: Lightbulb,
    desc: 'Intuitive real-world comparisons making abstract AI concepts tangible.'
  },
  {
    id: 'Visual',
    name: 'Visual',
    icon: Eye,
    desc: 'Diagrams, mental models, flowchart schemas, and visual mappings.'
  },
  {
    id: 'Code-first',
    name: 'Code-first',
    icon: Code,
    desc: 'Runnable syntax examples first, followed by explanations of mechanics.'
  },
  {
    id: 'Technical',
    name: 'Technical',
    icon: Cpu,
    desc: 'Rigorous architectural, algorithmic, and mathematical depth.'
  },
  {
    id: 'Socratic',
    name: 'Socratic',
    icon: HelpCircle,
    desc: 'Guided inquiry and thought-provoking questions promoting deduction.'
  },
];

export default function Onboarding({ initialProfile, onComplete }) {
  const [topic, setTopic] = useState(initialProfile?.topic || 'Python for AI');
  const [goal, setGoal] = useState(initialProfile?.goal || GOAL_OPTIONS[0].id);
  const [dailyTime, setDailyTime] = useState(initialProfile?.dailyTime || 30);
  const [explanationPreference, setExplanationPreference] = useState(
    initialProfile?.explanationPreference || 'Code-first'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      topic,
      goal,
      dailyTime,
      explanationPreference,
      completedOnboarding: true,
    };
    saveProfile(updated);
    onComplete(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/10 text-brand-violet text-xs font-semibold uppercase tracking-wider border border-brand-violet/20">
          <span>Step 1 of 2</span>
          <span>•</span>
          <span>Learner Calibration</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Personalise your learning experience
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          ADAPT.AI customises question difficulty, explanatory style, and practice velocity around you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Section 1: Learning Topic */}
        <div className="bg-navy-850/80 rounded-2xl border border-navy-800 p-6 sm:p-7 glow-card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-semibold text-white">1. Select Learning Topic</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {TOPIC_OPTIONS.map((item) => {
              const isSelected = topic === item.id;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => setTopic(item.id)}
                  className={`p-4 rounded-xl cursor-pointer transition border relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-blue/15 border-brand-blue ring-1 ring-brand-blue/50 text-white'
                      : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-blue' : 'text-slate-400'}`} />
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        item.id === 'Python for AI' ? 'bg-brand-blue/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                    <div className="font-semibold text-sm mb-1">{item.title}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-brand-blue/20 flex items-center gap-1 text-xs text-brand-blue font-medium">
                      <Check className="w-3.5 h-3.5" /> Selected Topic
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Final Goal */}
        <div className="bg-navy-850/80 rounded-2xl border border-navy-800 p-6 sm:p-7 glow-card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-brand-violet" />
            <h3 className="text-lg font-semibold text-white">2. What is your final goal?</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((g) => {
              const isSelected = goal === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition border flex items-center gap-3 ${
                    isSelected
                      ? 'bg-brand-violet/15 border-brand-violet ring-1 ring-brand-violet/50 text-white'
                      : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-brand-violet bg-brand-violet text-white' : 'border-slate-600'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{g.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Daily Commitment */}
        <div className="bg-navy-850/80 rounded-2xl border border-navy-800 p-6 sm:p-7 glow-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-lg font-semibold text-white">3. Daily Time Commitment</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {TIME_OPTIONS.map((t) => {
              const isSelected = dailyTime === t.value;
              return (
                <div
                  key={t.value}
                  onClick={() => setDailyTime(t.value)}
                  className={`p-4 rounded-xl cursor-pointer text-center transition border ${
                    isSelected
                      ? 'bg-brand-cyan/15 border-brand-cyan ring-1 ring-brand-cyan/50 text-white'
                      : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-xl font-bold mb-1">{t.label}</div>
                  <div className="text-xs text-slate-400">{t.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Explanation Preference */}
        <div className="bg-navy-850/80 rounded-2xl border border-navy-800 p-6 sm:p-7 glow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-indigo" />
              <h3 className="text-lg font-semibold text-white">4. Explanation Preference</h3>
            </div>
            <span className="text-xs text-slate-400">Choose how AI should explain to you</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PREFERENCE_OPTIONS.map((p) => {
              const isSelected = explanationPreference === p.id;
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  onClick={() => setExplanationPreference(p.id)}
                  className={`p-4 rounded-xl cursor-pointer transition border relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-indigo/20 border-brand-indigo ring-1 ring-brand-indigo/60 text-white'
                      : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-navy-800 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      </div>
                      <div className="font-semibold text-sm">{p.name}</div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-indigo-300 font-medium">
                      <Check className="w-3.5 h-3.5" /> Preferred style
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-brand-violet/25 hover:shadow-brand-violet/40 transition duration-200 flex items-center justify-center gap-2 group"
          >
            <span>Proceed to 7-Question Diagnostic</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
          </button>
        </div>

      </form>
    </div>
  );
}

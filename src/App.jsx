import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import DiagnosticTest from './components/DiagnosticTest';
import KnowledgeMap from './components/KnowledgeMap';
import Roadmap from './components/Roadmap';
import TutorScreen from './components/TutorScreen';
import ProgressDashboard from './components/ProgressDashboard';
import { 
  loadProfile, 
  saveProfile, 
  loadDiagnosticResults, 
  saveDiagnosticResults, 
  clearAllData, 
  DEFAULT_PROFILE 
} from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'onboarding' | 'diagnostic' | 'knowledge_map' | 'roadmap'
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState('loops');

  // Restore state from localStorage on load
  useEffect(() => {
    const savedProfile = loadProfile();
    const savedResults = loadDiagnosticResults();

    if (savedProfile) {
      setUserProfile(savedProfile);
    }
    if (savedResults) {
      setDiagnosticResults(savedResults);
    }
  }, []);

  // Handlers
  const handleStartLearning = () => {
    setCurrentView('onboarding');
  };

  const handleTryDemo = () => {
    const demoProfile = {
      topic: 'Python for AI',
      goal: 'Build intelligent AI apps & agents',
      dailyTime: 30,
      explanationPreference: 'Code-first',
      completedOnboarding: true,
    };
    saveProfile(demoProfile);
    setUserProfile(demoProfile);
    setCurrentView('diagnostic');
  };

  const handleOnboardingComplete = (profileData) => {
    setUserProfile(profileData);
    setCurrentView('diagnostic');
  };

  const handleDiagnosticComplete = (results) => {
    setDiagnosticResults(results);
    setCurrentView('knowledge_map');
  };

  const handleRetakeDiagnostic = () => {
    setCurrentView('diagnostic');
  };

  const handleEditOnboarding = () => {
    setCurrentView('onboarding');
  };

  const refreshDiagnosticResults = () => {
    const latest = loadDiagnosticResults();
    if (latest) setDiagnosticResults(latest);
    return latest || diagnosticResults;
  };

  const handleOpenRoadmap = () => {
    refreshDiagnosticResults();
    setCurrentView('roadmap');
  };

  const handleStartLesson = (lessonId) => {
    setSelectedLessonId(lessonId || 'loops');
    setCurrentView('tutor');
  };

  const handleViewProgress = () => {
    refreshDiagnosticResults();
    setCurrentView('progress');
  };

  const handleReset = () => {
    if (window.confirm('Reset all diagnostic progress and onboarding profile?')) {
      clearAllData();
      setUserProfile(DEFAULT_PROFILE);
      setDiagnosticResults(null);
      setCurrentView('landing');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-violet/30 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        hasResults={Boolean(diagnosticResults)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartLearning={handleStartLearning}
            onTryDemo={handleTryDemo}
            hasResults={Boolean(diagnosticResults)}
            onViewKnowledgeMap={() => setCurrentView('knowledge_map')}
            onViewRoadmap={handleOpenRoadmap}
          />
        )}

        {currentView === 'onboarding' && (
          <Onboarding
            initialProfile={userProfile}
            onComplete={handleOnboardingComplete}
          />
        )}

        {currentView === 'diagnostic' && (
          <DiagnosticTest
            userProfile={userProfile}
            onComplete={handleDiagnosticComplete}
          />
        )}

        {currentView === 'knowledge_map' && (
          <KnowledgeMap
            diagnosticData={diagnosticResults}
            userProfile={userProfile}
            onRetakeDiagnostic={handleRetakeDiagnostic}
            onEditOnboarding={handleEditOnboarding}
            onGenerateRoadmap={handleOpenRoadmap}
          />
        )}

        {currentView === 'roadmap' && (
          <Roadmap
            diagnosticData={diagnosticResults}
            userProfile={userProfile}
            onViewKnowledgeMap={() => setCurrentView('knowledge_map')}
            onRetakeDiagnostic={handleRetakeDiagnostic}
            onStartLesson={handleStartLesson}
            onViewProgress={handleViewProgress}
          />
        )}

        {currentView === 'tutor' && (
          <TutorScreen
            initialLessonId={selectedLessonId}
            userProfile={userProfile}
            diagnosticData={diagnosticResults}
            onBackToRoadmap={handleOpenRoadmap}
            onViewProgress={handleViewProgress}
          />
        )}

        {currentView === 'progress' && (
          <ProgressDashboard
            diagnosticData={diagnosticResults}
            userProfile={userProfile}
            onBackToRoadmap={handleOpenRoadmap}
            onContinueLearning={() => handleStartLesson(selectedLessonId)}
            onRetakeDiagnostic={handleRetakeDiagnostic}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-navy-850 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ADAPT.AI</span>
            <span>•</span>
            <span>An AI tutor that learns how you learn</span>
          </div>
          <div className="text-slate-500">
            Hackathon MVP • Diagnose → Adapt → Improve
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  Voice,
  Generation,
  Project,
  UsageInfo,
  VoiceSettings,
  ToastNotification,
} from './types';
import { api } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { LoadingState } from './components/LoadingState';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Studio } from './pages/Studio';
import { Voices } from './pages/Voices';
import { History } from './pages/History';
import { Projects } from './pages/Projects';
import { Usage } from './pages/Usage';
import { Settings } from './pages/Settings';
import { Account } from './pages/Account';
import { Menu, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('studio');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isRefreshingVoices, setIsRefreshingVoices] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [voicesData, gensData, projectsData, usageData] = await Promise.allSettled([
          api.getVoices(),
          api.getGenerations(),
          api.getProjects(),
          api.getUsage(),
        ]);

        if (!isMounted) return;

        if (voicesData.status === 'fulfilled' && voicesData.value.length > 0) {
          setVoices(voicesData.value);
          setSelectedVoiceId(voicesData.value[0].voice_id);
        }

        if (gensData.status === 'fulfilled') {
          setGenerations(gensData.value);
        }

        if (projectsData.status === 'fulfilled') {
          setProjects(projectsData.value);
        }

        if (usageData.status === 'fulfilled') {
          setUsage(usageData.value);
        }
      } catch (err: any) {
        console.error('Initial data load error:', err);
        addToast({
          type: 'error',
          title: 'Initialization Notice',
          message: 'Could not load all workspace assets. Running in offline/cached mode.',
        });
      } finally {
        if (isMounted) {
          setIsLoadingInitial(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh voices
  const handleRefreshVoices = async () => {
    setIsRefreshingVoices(true);
    try {
      const refreshed = await api.getVoices(true);
      setVoices(refreshed);
      addToast({
        type: 'success',
        title: 'Voice Catalog Updated',
        message: `Fetched ${refreshed.length} voices from backend.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to Refresh Voices',
        message: err.message || 'Check your ElevenLabs credentials.',
      });
    } finally {
      setIsRefreshingVoices(false);
    }
  };

  // Refresh usage data
  const handleRefreshUsage = async () => {
    try {
      const u = await api.getUsage();
      setUsage(u);
    } catch (err) {
      console.warn('Failed to refresh usage:', err);
    }
  };

  // Generation completion handler
  const handleGenerationComplete = (gen: Generation) => {
    setGenerations((prev) => [gen, ...prev]);
    // Refresh usage
    handleRefreshUsage();
  };

  // Save or update project
  const handleSaveProject = async (text: string, voiceId: string, settings: VoiceSettings) => {
    try {
      if (activeProject) {
        const updated = await api.updateProject(activeProject.id, {
          text,
          voiceId,
          settings,
        });
        setActiveProject(updated);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const titleWords = text.trim().slice(0, 30);
        const name = titleWords ? `Project: "${titleWords}..."` : `Project ${projects.length + 1}`;
        const created = await api.createProject({
          name,
          text,
          voiceId,
          settings,
        });
        setActiveProject(created);
        setProjects((prev) => [created, ...prev]);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save project.',
      });
    }
  };

  // Create new project
  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const created = await api.createProject({
        name,
        description,
        text: '',
        voiceId: selectedVoiceId,
      });
      setProjects((prev) => [created, ...prev]);
      setActiveProject(created);
      setActiveTab('studio');
      addToast({
        type: 'success',
        title: 'Project Created',
        message: `Project "${name}" is now active in Studio.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Project Creation Failed',
        message: err.message,
      });
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProject?.id === id) {
        setActiveProject(null);
      }
      addToast({
        type: 'info',
        title: 'Project Deleted',
        message: 'The project was removed from your workspace.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

  // Delete generation
  const handleDeleteGeneration = async (id: string) => {
    try {
      await api.deleteGeneration(id);
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      addToast({
        type: 'info',
        title: 'Recording Deleted',
        message: 'Generation clip removed from history.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

  // Clear all history
  const handleClearHistory = async () => {
    try {
      await api.clearAllGenerations();
      setGenerations([]);
      addToast({
        type: 'info',
        title: 'History Cleared',
        message: 'All audio recordings removed.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Clear Failed',
        message: err.message,
      });
    }
  };

  // Select voice and go to Studio
  const handleSelectVoiceAndStudio = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    setActiveTab('studio');
  };

  // Open generation in Studio
  const handleOpenGenerationInStudio = (gen: Generation) => {
    setSelectedVoiceId(gen.voiceId);
    setActiveProject({
      id: `from_gen_${gen.id}`,
      name: `Session: ${gen.voiceName}`,
      text: gen.text,
      voiceId: gen.voiceId,
      modelId: gen.modelId,
      settings: gen.settings,
      createdAt: gen.createdAt,
      updatedAt: new Date().toISOString(),
    });
    setActiveTab('studio');
    addToast({
      type: 'info',
      title: 'Loaded in Studio',
      message: 'Original text, voice, and model settings restored.',
    });
  };

  // Play audio globally
  const handlePlayGlobalAudio = (url: string) => {
    setActiveAudioUrl(url);
    const audio = new Audio(url);
    audio.play().catch(console.warn);
  };

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <LoadingState
          message="Loading VOXIA AI Studio..."
          subtext="Connecting to voice generation engine and local cache"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* If activeTab === 'landing', render standalone full Landing experience */}
      {activeTab === 'landing' ? (
        <Landing
          onNavigate={setActiveTab}
          voices={voices}
          onSelectVoiceAndStudio={handleSelectVoiceAndStudio}
        />
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
          {/* Mobile Top Header */}
          <header className="lg:hidden sticky top-0 z-30 bg-[#080b12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-extrabold text-sm tracking-wider text-white">VOXIA AI</span>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </header>

          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            usage={usage}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Workspace Content Area */}
          <main className="flex-1 flex flex-col min-w-0">
            {activeTab === 'dashboard' && (
              <Dashboard
                onNavigate={setActiveTab}
                voices={voices}
                generations={generations}
                projects={projects}
                usage={usage}
                onSelectVoiceAndStudio={handleSelectVoiceAndStudio}
                onPlayAudio={handlePlayGlobalAudio}
              />
            )}

            {activeTab === 'studio' && (
              <Studio
                voices={voices}
                selectedVoiceId={selectedVoiceId}
                onSelectVoice={setSelectedVoiceId}
                activeProject={activeProject}
                onSaveProject={handleSaveProject}
                onGenerationComplete={handleGenerationComplete}
                addToast={addToast}
              />
            )}

            {activeTab === 'voices' && (
              <Voices
                voices={voices}
                selectedVoiceId={selectedVoiceId}
                onSelectVoiceAndStudio={handleSelectVoiceAndStudio}
                onRefreshVoices={handleRefreshVoices}
                isRefreshing={isRefreshingVoices}
              />
            )}

            {activeTab === 'history' && (
              <History
                generations={generations}
                onDeleteGeneration={handleDeleteGeneration}
                onClearAll={handleClearHistory}
                onOpenInStudio={handleOpenGenerationInStudio}
                activeAudioUrl={activeAudioUrl}
                onPlayAudio={handlePlayGlobalAudio}
              />
            )}

            {activeTab === 'projects' && (
              <Projects
                projects={projects}
                voices={voices}
                onCreateProject={handleCreateProject}
                onSelectProject={(proj) => {
                  setActiveProject(proj);
                  setActiveTab('studio');
                }}
                onDeleteProject={handleDeleteProject}
              />
            )}

            {activeTab === 'usage' && (
              <Usage
                usage={usage}
                onNavigate={setActiveTab}
                onRefreshUsage={handleRefreshUsage}
                addToast={addToast}
              />
            )}

            {activeTab === 'settings' && (
              <Settings
                voices={voices}
                defaultVoiceId={selectedVoiceId}
                onSetDefaultVoiceId={setSelectedVoiceId}
                addToast={addToast}
              />
            )}

            {activeTab === 'account' && (
              <Account usage={usage} onNavigate={setActiveTab} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

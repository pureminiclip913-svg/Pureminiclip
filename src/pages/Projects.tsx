import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  ArrowRight,
  Trash2,
  Calendar,
  FileText,
  User,
  Sparkles,
  X,
} from 'lucide-react';
import { Project, Voice } from '../types';

interface ProjectsProps {
  projects: Project[];
  voices: Voice[];
  onCreateProject: (name: string, description?: string) => void;
  onSelectProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  voices,
  onCreateProject,
  onSelectProject,
  onDeleteProject,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateProject(newProjectName.trim(), newProjectDesc.trim());
    setNewProjectName('');
    setNewProjectDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#07090e] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize scripts, voice settings, and synthesized audio files by narrative or client project.
          </p>
        </div>

        <button
          id="btn-create-project-open-modal"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const matchedVoice = voices.find((v) => v.voice_id === proj.voiceId);
          return (
            <div
              key={proj.id}
              id={`project-card-${proj.id}`}
              className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                    <FolderKanban className="w-5 h-5" />
                  </div>

                  <button
                    id={`btn-delete-project-${proj.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete project "${proj.name}"?`)) {
                        onDeleteProject(proj.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {proj.name}
                </h3>
                {proj.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {proj.description}
                  </p>
                )}

                {/* Text excerpt preview */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 line-clamp-3 font-mono">
                  {proj.text || 'No script entered yet.'}
                </div>

                {/* Metadata badges */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span>{proj.text.length} chars</span>
                  </span>
                  {matchedVoice && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <User className="w-3 h-3 text-blue-400" />
                      <span>{matchedVoice.name}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Updated {new Date(proj.updatedAt).toLocaleDateString()}
                </span>

                <button
                  id={`btn-open-project-${proj.id}`}
                  onClick={() => onSelectProject(proj)}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Open in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="p-16 rounded-3xl bg-[#0c101a] border border-slate-800 text-center text-slate-400 space-y-3">
          <FolderKanban className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-base font-semibold text-slate-300">No projects created yet</p>
          <p className="text-xs text-slate-400">
            Create a project to store your script scripts and audio outputs in dedicated spaces.
          </p>
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0c101a] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-base">Create New Project</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  id="input-project-name"
                  type="text"
                  required
                  placeholder="e.g. Chapter 1: The Dark Forest"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="input-project-desc"
                  rows={3}
                  placeholder="Notes on voice tone, pacing, target audience..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-create-project"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

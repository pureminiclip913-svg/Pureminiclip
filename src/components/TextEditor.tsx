import React, { useState, useEffect, useRef } from 'react';
import {
  Trash2,
  Undo2,
  Redo2,
  Copy,
  Check,
  Clock,
  Sparkles,
  Command,
} from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  onGenerate: () => void;
  onSave?: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  onGenerate,
  onSave,
  isGenerating = false,
  disabled = false,
  placeholder = 'Type or paste the text you want to synthesize into lifelike speech...',
  className = '',
}) => {
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [lastAutosaved, setLastAutosaved] = useState<string>('Saved');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Character and word counts
  const characterCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  // Estimated audio duration based on average human speech rate of 140-150 words/min
  const estimatedSeconds = Math.max(0, Math.round((wordCount / 145) * 60));
  const estimatedMinutes = (estimatedSeconds / 60).toFixed(1);

  // Handle value change with undo/redo stack
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    onChange(nextVal);

    // Debounced history record
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextVal);
    // Keep last 30 states
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setLastAutosaved('Saving...');
  };

  // Simulate autosave indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      setLastAutosaved(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [value]);

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(prev);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(next);
    }
  };

  // Clear
  const handleClear = () => {
    if (value && window.confirm('Are you sure you want to clear the editor?')) {
      onChange('');
      setHistory(['']);
      setHistoryIndex(0);
      textareaRef.current?.focus();
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Keyboard shortcuts: Ctrl/Cmd + Enter to generate, Ctrl/Cmd + S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating && value.trim().length > 0) {
          onGenerate();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (onSave) {
          onSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGenerate, onSave, isGenerating, value]);

  return (
    <div className={`flex flex-col rounded-2xl bg-[#0b0e17] border border-slate-800/90 shadow-xl overflow-hidden ${className}`}>
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <button
            id="btn-editor-undo"
            onClick={handleUndo}
            disabled={historyIndex <= 0 || disabled}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-editor-redo"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1 || disabled}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-slate-800 mx-1" />

          {/* Clear button */}
          <button
            id="btn-editor-clear"
            onClick={handleClear}
            disabled={!value || disabled}
            title="Clear text"
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 disabled:opacity-30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          {/* Copy button */}
          <button
            id="btn-editor-copy"
            onClick={handleCopy}
            disabled={!value}
            title="Copy text to clipboard"
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 hover:text-slate-200 text-slate-400 disabled:opacity-30 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Autosave badge & Shortcut hint */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Command className="w-3 h-3" />
            <span>Enter to Generate</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            {lastAutosaved}
          </span>
        </div>
      </div>

      {/* Main Text Area */}
      <div className="relative flex-1 p-5 min-h-[260px] md:min-h-[320px]">
        <textarea
          id="tts-text-input"
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-full min-h-[240px] md:min-h-[300px] bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none resize-y text-base leading-relaxed font-sans"
        />
      </div>

      {/* Editor Footer Stats */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-[#080b12]/80 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-200 font-semibold">{characterCount.toLocaleString()}</span>
            <span className="text-slate-400">/ 5,000 chars</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-200 font-semibold">{wordCount}</span>
            <span className="text-slate-400">words</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono text-slate-400">
            <Clock className="w-3 h-3 text-cyan-500" />
            <span>~{estimatedSeconds < 60 ? `${estimatedSeconds}s` : `${estimatedMinutes}m`} speech</span>
          </div>
        </div>

        {characterCount > 4500 && (
          <span className="text-amber-400 font-medium text-[11px]">
            Approaching limit ({(5000 - characterCount).toLocaleString()} chars remaining)
          </span>
        )}
      </div>
    </div>
  );
};

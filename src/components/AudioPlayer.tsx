import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { Waveform } from './Waveform';

interface AudioPlayerProps {
  audioUrl: string | null;
  title?: string;
  subtitle?: string;
  fileName?: string;
  onDownload?: () => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title = 'Generated Audio',
  subtitle,
  fileName,
  onDownload,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Speed options
  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    if (audioUrl) {
      setIsPlaying(false);
      setCurrentTime(0);
      setIsReady(false);
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isMuted, playbackRate, isLooping]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Playback blocked or failed:', e);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsReady(true);
    }
  };

  const handleEnded = () => {
    if (!isLooping) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const cycleSpeed = () => {
    const currentIndex = speedOptions.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    setPlaybackRate(speedOptions[nextIndex]);
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    }
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec) || timeInSec <= 0) return '00:00';
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (!audioUrl) return;

    const today = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = fileName || `voxia-tts-${today}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!audioUrl) {
    return (
      <div className={`p-6 rounded-2xl bg-[#0d121c]/80 border border-slate-800/80 text-center text-slate-400 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3 text-cyan-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <p className="font-medium text-slate-300">Ready to synthesize speech</p>
        <p className="text-xs text-slate-500 mt-1">Enter your text and click generate to listen to audio</p>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl bg-[#0c101a] border border-slate-800/90 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Invisible HTML Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h4 className="font-semibold text-slate-100 text-sm">{title}</h4>
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Loop toggle */}
          <button
            id="btn-loop-audio"
            onClick={() => setIsLooping(!isLooping)}
            title="Loop playback"
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isLooping
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Speed badge button */}
          <button
            id="btn-playback-speed"
            onClick={cycleSpeed}
            title="Cycle speed"
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-medium text-slate-300 hover:border-slate-700 hover:text-cyan-300 transition-colors"
          >
            {playbackRate}x
          </button>

          {/* Download button */}
          <button
            id="btn-download-audio"
            onClick={handleDownloadClick}
            title="Download Audio to browser Downloads folder"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-200 transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="mb-4">
        <Waveform
          audioElement={audioRef.current}
          isPlaying={isPlaying}
          audioUrl={audioUrl}
          height={50}
        />
      </div>

      {/* Scrubber Progress Bar */}
      <div className="space-y-1 mb-4">
        <input
          id="audio-scrubber-range"
          type="range"
          min={0}
          max={duration || 100}
          step={0.05}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Volume */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            id="btn-restart-audio"
            onClick={restartAudio}
            title="Restart"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Main Play / Pause */}
          <button
            id="btn-toggle-play"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            )}
          </button>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-mute"
            onClick={toggleMute}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            id="audio-volume-range"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

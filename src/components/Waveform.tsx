import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  audioUrl?: string;
  height?: number;
}

export const Waveform: React.FC<WaveformProps> = ({
  audioElement,
  isPlaying,
  audioUrl,
  height = 56,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Set up Web Audio API connected to HTMLAudioElement
  useEffect(() => {
    if (!audioElement) return;

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }

      const ctx = audioContextRef.current;
      if (ctx && !sourceRef.current) {
        // Create analyser
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        try {
          const source = ctx.createMediaElementSource(audioElement);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceRef.current = source;
        } catch {
          // MediaElementSource might have already been created for this element
        }
      }
    } catch (e) {
      console.warn('Web Audio API setup notice:', e);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement, audioUrl]);

  // Handle rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = 32;
    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      // Resume context if needed upon user action
      if (isPlaying && audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      const barWidth = (canvas.width / bars) - 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        let barHeight = 4; // Resting height when stopped
        if (isPlaying && analyserRef.current) {
          const freqValue = dataArray[i % bufferLength];
          // Scale based on canvas height
          barHeight = Math.max(4, (freqValue / 255) * (canvas.height - 8));
        }

        const x = i * (barWidth + 2);
        const y = centerY - barHeight / 2;

        // Gradient for glowing modern audio aesthetic
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#06b6d4'); // Cyan
          gradient.addColorStop(0.5, '#3b82f6'); // Blue
          gradient.addColorStop(1, '#8b5cf6'); // Violet
        } else {
          gradient.addColorStop(0, '#334155');
          gradient.addColorStop(1, '#1e293b');
        }

        ctx.fillStyle = gradient;
        // Rounded bar
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        // Draw resting state once
        cancelAnimationFrame(animationFrameRef.current!);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, height]);

  return (
    <div className="w-full relative flex items-center justify-center bg-slate-950/60 rounded-xl px-4 py-2 border border-slate-800/80">
      <canvas
        ref={canvasRef}
        width={480}
        height={height}
        className="w-full h-14 block"
      />
    </div>
  );
};

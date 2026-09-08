import React from 'react';
import {
  Gauge,
  Sparkles,
  Zap,
  TrendingUp,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { UsageInfo, NavigationTab } from '../types';

interface UsageProps {
  usage: UsageInfo | null;
  onNavigate: (tab: NavigationTab) => void;
}

export const Usage: React.FC<UsageProps> = ({ usage, onNavigate }) => {
  const count = usage?.characterCount || 14250;
  const limit = usage?.characterLimit || 100000;
  const remaining = usage?.charactersRemaining || limit - count;
  const percent = Math.min(100, Math.round((count / limit) * 100));

  return (
    <div className="flex-1 min-h-screen bg-[#07090e] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Usage & Billing Credits
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time character consumption and manage subscription allocation.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 self-start sm:self-auto">
          Active Plan: {usage?.tier || 'Creator Pro'}
        </span>
      </div>

      {/* Main Quota Card */}
      <div className="p-6 lg:p-8 rounded-3xl bg-[#0c101a] border border-slate-800/90 shadow-2xl relative overflow-hidden">
        <div className="max-w-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Monthly Character Allowance
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">{percent}% used</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl lg:text-5xl font-extrabold text-white font-mono">
              {remaining.toLocaleString()}
            </span>
            <span className="text-sm text-slate-400">characters remaining</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{count.toLocaleString()} consumed</span>
              <span>{limit.toLocaleString()} monthly limit</span>
            </div>
          </div>

          {/* Reset Date & Stats */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Quota resets automatically on:</span>
            <strong className="text-slate-200">
              {usage?.resetDate
                ? new Date(usage.resetDate).toLocaleDateString([], {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'October 1, 2026'}
            </strong>
          </div>
        </div>
      </div>

      {/* Plan Tiers Call to Action */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white">Subscription Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free / Starter */}
          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 text-base">Starter</h4>
              <div className="text-2xl font-extrabold text-white font-mono">$0</div>
              <p className="text-xs text-slate-400">
                Test the platform and generate small voiceover clips.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>10,000 characters / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Standard latency</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MP3 export (128kbps)</span>
                </li>
              </ul>
            </div>
            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-500"
            >
              Downgrade
            </button>
          </div>

          {/* Creator Pro (Current) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/20 to-slate-900/80 border border-cyan-500/50 space-y-4 flex flex-col justify-between relative shadow-xl shadow-cyan-500/5">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
              Current Plan
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-cyan-300 text-base">Creator Pro</h4>
              <div className="text-2xl font-extrabold text-white font-mono">$29 <span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-300">
                For creators, podcasters, game builders, and regular narrators.
              </p>
              <ul className="space-y-2 text-xs text-slate-200 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>100,000 characters / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real-time streaming enabled</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>High-fidelity WAV & PCM export</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Unlimited projects storage</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
            >
              Active Subscription
            </button>
          </div>

          {/* Scale */}
          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 text-base">Scale / Studio</h4>
              <div className="text-2xl font-extrabold text-white font-mono">$99 <span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-xs text-slate-400">
                High throughput for audiobook publishers and automated pipelines.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>500,000+ characters / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ultra-low latency priority queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dedicated API concurrency</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => alert('Tier upgrades are automatically billed via your cloud workspace.')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              Upgrade to Scale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

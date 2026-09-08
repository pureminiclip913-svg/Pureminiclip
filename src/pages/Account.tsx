import React from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Calendar,
  Sparkles,
  CreditCard,
  ExternalLink,
  Award,
} from 'lucide-react';
import { UsageInfo, NavigationTab } from '../types';

interface AccountProps {
  usage: UsageInfo | null;
  onNavigate: (tab: NavigationTab) => void;
}

export const Account: React.FC<AccountProps> = ({ usage, onNavigate }) => {
  return (
    <div className="flex-1 min-h-screen bg-[#07090e] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800/80">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, credentials, and subscription status.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* User Card */}
        <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-xl text-slate-950 shadow-lg shadow-cyan-500/20">
              VA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-100">Voice Creator</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>creator@voxia.ai</span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-500" />
                <span>Member since August 2026</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('usage')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-colors"
          >
            Manage Subscription
          </button>
        </div>

        {/* Plan & Usage Summary */}
        <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-4">
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Current Subscription</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Plan Tier</span>
              <div className="text-lg font-bold text-cyan-300 mt-1">
                {usage?.tier || 'Creator Pro'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Characters Remaining</span>
              <div className="text-lg font-bold text-white font-mono mt-1">
                {usage ? usage.charactersRemaining.toLocaleString() : '85,750'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">Next Billing Cycle</span>
              <div className="text-lg font-bold text-white font-mono mt-1">
                {usage?.resetDate
                  ? new Date(usage.resetDate).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Oct 1'}
              </div>
            </div>
          </div>
        </div>

        {/* Security & Infrastructure Note */}
        <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Server-Side Architecture</span>
          </div>
          <p className="leading-relaxed">
            VOXIA AI communicates exclusively through server-side authenticated proxies. Your synthesized clips and generated voice files are stored with isolated unique IDs and can be cleared or exported at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

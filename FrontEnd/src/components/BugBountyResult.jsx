import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Bot,
  ClipboardCheck,
  Trophy,
  Clock,
} from 'lucide-react';

// ── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig = {
  submitted:    { label: 'Submitted',     color: 'badge-ghost' },
  auto_tested:  { label: 'Auto Tested',   color: 'badge-info' },
  ai_reviewed:  { label: 'AI Reviewed',   color: 'badge-primary' },
  approved:     { label: '✅ Approved',   color: 'badge-success' },
};

function ScoreRing({ score, size = 80 }) {
  const radius = (size - 12) / 2;
  const circ   = 2 * Math.PI * radius;
  const filled = ((score ?? 0) / 100) * circ;
  const color  = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={10} />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={circ}
        strokeDashoffset={circ - filled}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text
        x="50%" y="50%"
        textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg) translateY(-100%)', fontSize: 14, fontWeight: 700, fill: color }}
      />
    </svg>
  );
}

function TestCaseRow({ detail, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-lg border ${detail.passed ? 'border-success/30 bg-success/5' : 'border-error/30 bg-error/5'}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium"
        onClick={() => setOpen((p) => !p)}
      >
        <span className="flex items-center gap-2">
          {detail.passed
            ? <CheckCircle2 className="size-4 text-success" />
            : <XCircle className="size-4 text-error" />}
          Test Case {index + 1}
        </span>
        {open ? <ChevronUp className="size-4 opacity-60" /> : <ChevronDown className="size-4 opacity-60" />}
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-1 text-xs font-mono">
          <div className="flex gap-2">
            <span className="text-base-content/50 w-24 shrink-0">Input:</span>
            <span className="text-base-content">{detail.input}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-base-content/50 w-24 shrink-0">Expected:</span>
            <span className="text-success">{detail.expectedOutput}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-base-content/50 w-24 shrink-0">Got:</span>
            <span className={detail.passed ? 'text-success' : 'text-error'}>{detail.actualOutput || '(empty)'}</span>
          </div>
          {detail.stderr && (
            <div className="flex gap-2">
              <span className="text-base-content/50 w-24 shrink-0">Error:</span>
              <span className="text-warning">{detail.stderr}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * BugBountyResult
 *
 * @param {{ submission: object }} props
 */
export default function BugBountyResult({ submission }) {
  if (!submission) return null;

  const {
    status,
    autoTestResult,
    aiReviewScore,
    aiReviewFeedback,
    manualReviewScore,
    manualReviewFeedback,
    finalScore,
  } = submission;

  const autoScore   = autoTestResult?.score   ?? null;
  const autoPassed  = autoTestResult?.passed  ?? 0;
  const autoTotal   = autoTestResult?.total   ?? 0;
  const autoDetails = autoTestResult?.details ?? [];

  const statusInfo = statusConfig[status] || { label: status, color: 'badge-ghost' };

  return (
    <div className="card bg-base-100 border border-primary/20 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ── */}
      <div className="card-body p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ClipboardCheck className="size-5 text-primary" />
            Submission Results
          </h3>
          <span className={`badge ${statusInfo.color} badge-md font-semibold`}>
            {statusInfo.label}
          </span>
        </div>

        {/* ── Final Score Hero ── */}
        {finalScore !== null && finalScore !== undefined && (
          <div className="flex items-center justify-center py-2">
            <div className="flex flex-col items-center gap-1">
              <div className="relative flex items-center justify-center size-24">
                <svg width={96} height={96} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                  <circle cx={48} cy={48} r={40} fill="none" stroke="#1e293b" strokeWidth={10} />
                  <circle
                    cx={48} cy={48} r={40}
                    fill="none"
                    stroke={finalScore >= 80 ? '#22c55e' : finalScore >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth={10}
                    strokeDasharray={251.3}
                    strokeDashoffset={251.3 - (finalScore / 100) * 251.3}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <span className="text-3xl font-black text-base-content z-10">{finalScore}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-base-content/60">
                <Trophy className="size-4 text-yellow-500" />
                <span className="font-semibold">Final Score</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Score Breakdown ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Auto Tests */}
          <div className="rounded-xl bg-base-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
              <ClipboardCheck className="size-4 text-info" />
              Auto Tests
            </div>
            {autoTotal > 0 ? (
              <>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-info">{autoPassed}/{autoTotal}</span>
                  <span className="text-sm text-base-content/50 pb-0.5">passed</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className="bg-info h-2 rounded-full transition-all duration-700"
                    style={{ width: `${autoTotal > 0 ? (autoPassed / autoTotal) * 100 : 0}%` }}
                  />
                </div>
                {autoScore !== null && (
                  <span className="text-xs text-base-content/50">{autoScore}% score</span>
                )}
              </>
            ) : (
              <span className="text-sm text-base-content/40 italic">No test results</span>
            )}
          </div>

          {/* AI Review */}
          <div className="rounded-xl bg-base-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
              <Bot className="size-4 text-primary" />
              AI Review
            </div>
            {aiReviewScore !== null && aiReviewScore !== undefined ? (
              <>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-primary">{aiReviewScore}</span>
                  <span className="text-sm text-base-content/50 pb-0.5">/100</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-700"
                    style={{ width: `${aiReviewScore}%` }}
                  />
                </div>
              </>
            ) : (
              <span className="text-sm text-base-content/40 italic">Pending</span>
            )}
          </div>

          {/* Manual Review */}
          <div className="rounded-xl bg-base-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
              <Star className="size-4 text-warning" />
              Host Review
            </div>
            {manualReviewScore !== null && manualReviewScore !== undefined ? (
              <>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-warning">{manualReviewScore}</span>
                  <span className="text-sm text-base-content/50 pb-0.5">/100</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all duration-700"
                    style={{ width: `${manualReviewScore}%` }}
                  />
                </div>
              </>
            ) : (
              <span className="text-sm text-base-content/40 italic">Pending host review</span>
            )}
          </div>
        </div>

        {/* ── AI Feedback ── */}
        {aiReviewFeedback && (
          <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Bot className="size-4" />
              AI Feedback
            </div>
            <p className="text-sm text-base-content/80 leading-relaxed">{aiReviewFeedback}</p>
          </div>
        )}

        {/* ── Manual Feedback ── */}
        {manualReviewFeedback && (
          <div className="rounded-xl bg-success/5 border border-success/15 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-success">
              <Star className="size-4" />
              Host Feedback
            </div>
            <p className="text-sm text-base-content/80 leading-relaxed">{manualReviewFeedback}</p>
          </div>
        )}

        {/* ── Test Case Details ── */}
        {autoDetails.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
              <ClipboardCheck className="size-4" />
              Test Case Details
            </h4>
            <div className="space-y-1.5">
              {autoDetails.map((d, i) => (
                <TestCaseRow key={i} detail={d} index={i} />
              ))}
            </div>
          </div>
        )}

        {autoTestResult?.error && (
          <div className="alert alert-warning text-sm">
            <span>⚠️ {autoTestResult.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

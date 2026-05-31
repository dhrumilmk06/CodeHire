import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { bugBountyApi } from '../api/bugBounty';
import { getDifficultyBadgeClass } from '../lib/utils';
import {
  Bug,
  ClipboardCheck,
  Star,
  Clock,
  LayoutDashboardIcon,
  Bot,
  ChevronRight,
  Loader2,
  InboxIcon,
  Users,
} from 'lucide-react';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  submitted:   'badge-ghost',
  auto_tested: 'badge-info',
  ai_reviewed: 'badge-primary',
  approved:    'badge-success',
};

const STATUS_LABEL = {
  submitted:   'Submitted',
  auto_tested: 'Auto Tested',
  ai_reviewed: 'AI Reviewed',
  approved:    '✅ Approved',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(secs) {
  if (!secs) return '—';
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

// ── Submission Row ────────────────────────────────────────────────────────────
function SubmissionRow({ sub, navigate }) {
  const autoScore = sub.autoTestResult?.score ?? null;
  return (
    <tr className="hover:bg-base-200 transition-colors">
      <td className="px-4 py-3">
        <div className="font-semibold text-sm">{sub.candidateName ?? sub.userId}</div>
        <div className="text-xs text-base-content/40 font-mono">{sub.userId.slice(0, 12)}…</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium">{sub.problem?.title ?? '—'}</div>
        <div className={`badge badge-xs mt-1 ${getDifficultyBadgeClass(sub.problem?.difficultyLevel)}`}>
          {sub.problem?.difficultyLevel ?? '—'}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {autoScore !== null
          ? <span className={`font-bold text-sm ${autoScore >= 80 ? 'text-success' : autoScore >= 50 ? 'text-warning' : 'text-error'}`}>{autoScore}%</span>
          : <span className="text-base-content/30 text-xs">—</span>
        }
      </td>
      <td className="px-4 py-3 text-center">
        {sub.aiReviewScore !== null && sub.aiReviewScore !== undefined
          ? <span className="font-bold text-sm text-primary">{sub.aiReviewScore}/100</span>
          : <span className="text-base-content/30 text-xs">—</span>
        }
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`badge badge-sm ${STATUS_BADGE[sub.status] ?? 'badge-ghost'}`}>
          {STATUS_LABEL[sub.status] ?? sub.status}
        </span>
      </td>
      <td className="px-4 py-3 text-center text-xs text-base-content/60">
        {formatTime(sub.timeTakenSeconds)}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          className="btn btn-ghost btn-xs gap-1 text-primary"
          onClick={() => navigate(`/host/bug-bounty/review/${sub.id}`)}
        >
          Review <ChevronRight className="size-3" />
        </button>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BugBountyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]       = useState('pending');
  const [submissions, setSubmissions]   = useState([]);
  const [loading, setLoading]           = useState(true);

  // "pending" tab = ai_reviewed (ready to review) + auto_tested
  // "reviewed" tab = approved
  const statusFilter = activeTab === 'pending' ? 'ai_reviewed' : 'approved';

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bugBountyApi.getSubmissions({ status: statusFilter });
      setSubmissions(data.submissions ?? []);
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div className="min-h-screen bg-base-300">
      {/* ── Header ── */}
      <div className="bg-gradient-to-b from-primary/10 via-base-200 to-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Bug className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">Bug Bounty Dashboard</h1>
              <p className="text-base-content/60 text-sm mt-0.5">Review candidate bug fixes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {/* ── Tabs ── */}
        <div className="tabs tabs-boxed bg-base-100 w-fit mb-6 shadow">
          <button
            className={`tab gap-2 ${activeTab === 'pending' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <ClipboardCheck className="size-4" />
            Pending Review
          </button>
          <button
            className={`tab gap-2 ${activeTab === 'reviewed' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('reviewed')}
          >
            <Star className="size-4" />
            Reviewed
          </button>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4 text-center">
            <InboxIcon className="size-14 text-base-content/20" />
            <h3 className="font-bold text-xl text-base-content/40">No submissions here</h3>
            <p className="text-sm text-base-content/30">
              {activeTab === 'pending' ? 'No AI-reviewed submissions pending your review yet.' : 'No approved submissions yet.'}
            </p>
          </div>
        ) : (
          <div className="card bg-base-100 shadow border border-base-content/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead className="bg-base-200 text-base-content/60 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Problem</th>
                    <th className="px-4 py-3 text-center">Auto Score</th>
                    <th className="px-4 py-3 text-center">AI Score</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Time Taken</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <SubmissionRow key={sub.id} sub={sub} navigate={navigate} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

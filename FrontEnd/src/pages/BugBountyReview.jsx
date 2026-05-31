import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { bugBountyApi } from '../api/bugBounty';
import BugBountyResult from '../components/BugBountyResult';
import {
  Bug,
  Clock,
  User,
  CheckCircle2,
  Loader2,
  Star,
  Send,
  ArrowLeft,
} from 'lucide-react';

const MONACO_LANG = {
  javascript: 'javascript',
  python:     'python',
  java:       'java',
  cpp:        'cpp',
  typescript: 'typescript',
};

function formatTime(secs) {
  if (!secs) return '—';
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

export default function BugBountyReview() {
  const { submissionId } = useParams();
  const navigate         = useNavigate();

  const [submission, setSubmission]           = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [manualScore, setManualScore]         = useState(80);
  const [manualFeedback, setManualFeedback]   = useState('');
  const [submitting, setSubmitting]           = useState(false);
  const [approved, setApproved]               = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await bugBountyApi.getSubmission(submissionId);
        setSubmission(data.submission);
        if (data.submission?.manualReviewScore) {
          setManualScore(data.submission.manualReviewScore);
          setManualFeedback(data.submission.manualReviewFeedback ?? '');
        }
      } catch (err) {
        toast.error('Failed to load submission');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [submissionId]);

  const handleApprove = async () => {
    if (!manualFeedback.trim()) {
      return toast.error('Please add feedback before approving.');
    }
    setSubmitting(true);
    try {
      const data = await bugBountyApi.reviewSubmission(submissionId, {
        manualReviewScore:    manualScore,
        manualReviewFeedback: manualFeedback,
      });
      setSubmission((prev) => ({ ...prev, ...data.submission }));
      setApproved(true);
      toast.success('✅ Submission approved!');
      setTimeout(() => navigate('/host/bug-bounty'), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Review failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <p className="text-error">Submission not found.</p>
      </div>
    );
  }

  const { problem, fixedCode, userId, timeTakenSeconds, status } = submission;
  const lang       = problem?.language ?? 'javascript';
  const monacoLang = MONACO_LANG[lang] ?? 'javascript';
  const isAlreadyApproved = status === 'approved';

  return (
    <div className="min-h-screen bg-base-300">
      {/* ── Header ── */}
      <div className="bg-gradient-to-b from-primary/10 via-base-200 to-base-300 border-b border-base-content/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
          <button
            className="btn btn-ghost btn-sm gap-1"
            onClick={() => navigate('/host/bug-bounty')}
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-xl truncate">{problem?.title ?? 'Review Submission'}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-base-content/60">
              <span className="flex items-center gap-1">
                <User className="size-3" /> {userId?.slice(0, 16)}…
              </span>
              {timeTakenSeconds && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" /> {formatTime(timeTakenSeconds)}
                </span>
              )}
              <span className={`badge badge-xs ${isAlreadyApproved ? 'badge-success' : 'badge-primary'}`}>
                {isAlreadyApproved ? '✅ Approved' : 'Pending Review'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── Two-panel Code View ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original buggy code */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-2 px-1">
              <Bug className="size-4 text-error" />
              🐛 Original Buggy Code
            </h3>
            <div className="rounded-xl overflow-hidden border border-error/20 shadow-inner" style={{ height: '380px' }}>
              <Editor
                height="380px"
                language={monacoLang}
                value={problem?.buggyCode ?? '// No code'}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 13,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          {/* Candidate's fix */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-2 px-1">
              <CheckCircle2 className="size-4 text-success" />
              🔧 Candidate's Fix
            </h3>
            <div className="rounded-xl overflow-hidden border border-success/20 shadow-inner" style={{ height: '380px' }}>
              <Editor
                height="380px"
                language={monacoLang}
                value={fixedCode ?? ''}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 13,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Auto + AI Score Results ── */}
        <BugBountyResult submission={submission} />

        {/* ── Manual Review Form ── */}
        <div className="card bg-base-100 border border-primary/20 shadow">
          <div className="card-body p-6 space-y-5">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Star className="size-5 text-warning" />
              {isAlreadyApproved ? 'Your Review' : 'Add Manual Review'}
            </h3>

            {/* Score slider */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center justify-between">
                <span>Score</span>
                <span className="text-2xl font-black text-primary">{manualScore}/100</span>
              </label>
              <input
                type="range"
                min={0} max={100} step={1}
                value={manualScore}
                disabled={isAlreadyApproved}
                onChange={(e) => setManualScore(Number(e.target.value))}
                className="range range-primary range-sm w-full"
              />
              <div className="flex justify-between text-xs text-base-content/40">
                <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
              </div>
            </div>

            {/* Or number input */}
            <div className="form-control w-28">
              <label className="label py-0">
                <span className="label-text text-xs">Exact score</span>
              </label>
              <input
                type="number"
                min={0} max={100}
                value={manualScore}
                disabled={isAlreadyApproved}
                onChange={(e) => setManualScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="input input-sm input-bordered"
              />
            </div>

            {/* Feedback textarea */}
            <div className="form-control">
              <label className="label py-0 mb-1">
                <span className="label-text font-semibold">Feedback</span>
              </label>
              <textarea
                className="textarea textarea-bordered min-h-28 resize-y text-sm"
                placeholder="Add your feedback — e.g., 'Good catch! The boundary fix is correct. Could also add input validation.'"
                value={manualFeedback}
                disabled={isAlreadyApproved}
                onChange={(e) => setManualFeedback(e.target.value)}
              />
            </div>

            {/* Submit button */}
            {!isAlreadyApproved && (
              <div className="flex justify-end">
                <button
                  className="btn btn-success gap-2"
                  disabled={submitting || approved}
                  onClick={handleApprove}
                >
                  {submitting ? (
                    <><Loader2 className="size-4 animate-spin" /> Approving…</>
                  ) : (
                    <><CheckCircle2 className="size-4" /> ✅ Approve</>
                  )}
                </button>
              </div>
            )}

            {isAlreadyApproved && (
              <div className="alert alert-success text-sm">
                <CheckCircle2 className="size-4" />
                This submission has been approved with a final score of{' '}
                <strong>{submission.finalScore}/100</strong>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bug, Trophy, Clock, Eye, EyeOff, Send, CheckCircle } from 'lucide-react';
import axiosInstance from '../lib/axios';
import Editor from '@monaco-editor/react';

const BugBountyInterviewPanel = ({ problem, sessionId, userId }) => {
  const [fixedCode, setFixedCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime] = useState(Date.now());

  // Pre-populate editor with buggy code when problem loads
  useEffect(() => {
    if (problem?.starterCode) {
      const lang = Object.keys(problem.starterCode)[0];
      if (lang) {
        setFixedCode(problem.starterCode[lang]);
      }
    } else if (problem?.buggyCode) {
      setFixedCode(problem.buggyCode);
    }
  }, [problem]);

  const handleSubmit = async () => {
    if (!fixedCode.trim()) return;
    setSubmitting(true);
    try {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      const res = await axiosInstance.post(`/bug-bounty/problems/${problem.id}/submit`, {
        fixedCode,
        sessionId,
        timeTakenSeconds: timeTaken,
      });
      setResult(res.data.submission);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-full text-base-content/60">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent mr-3" />
        Loading bug bounty problem...
      </div>
    );
  }

  // Get language from problem structure
  const language = problem.language || (problem.starterCode ? Object.keys(problem.starterCode)[0] : 'javascript');
  const buggyCode = problem.buggyCode || (problem.starterCode ? problem.starterCode[language] : '');
  const difficultyLevel = problem.difficulty || problem.difficultyLevel;
  const descriptionText = problem.description?.text || problem.bugDescription;
  const hints = problem.description?.notes || problem.bugHints;

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-base-100">
      {/* Problem Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/25 flex-shrink-0">
            <Bug className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold text-base-content text-lg leading-tight">{problem.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                difficultyLevel === 'easy'   ? 'bg-green-500/20 text-green-400' :
                difficultyLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                               'bg-red-500/20 text-red-400'
              }`}>
                {difficultyLevel}
              </span>
              {problem.bountyPoints && (
                <span className="flex items-center gap-1 text-xs text-yellow-500">
                  <Trophy className="h-3 w-3" /> {problem.bountyPoints} pts
                </span>
              )}
              {problem.estimatedTimeMinutes && (
                <span className="flex items-center gap-1 text-xs text-base-content/60">
                  <Clock className="h-3 w-3" /> {problem.estimatedTimeMinutes}m
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bug Description */}
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
        <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Bug Description</p>
        <p className="text-sm text-base-content/90 leading-relaxed">{descriptionText}</p>
      </div>

      {/* Two panels: Buggy code (left) + Fix editor (right) */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {/* Left: Buggy code read-only */}
        <div className="flex flex-col min-h-0">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Bug className="h-3.5 w-3.5" /> Buggy Code
          </p>
          <div className="flex-1 rounded-xl overflow-hidden border border-red-500/20 min-h-0 bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={language === 'python' ? 'python' : 'javascript'}
              value={buggyCode}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                theme: 'vs-dark',
              }}
            />
          </div>
        </div>

        {/* Right: Fix editor (editable) */}
        <div className="flex flex-col min-h-0">
          <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2">
            🔧 Your Fix
          </p>
          <div className="flex-1 rounded-xl overflow-hidden border border-base-300 min-h-0 bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={language === 'python' ? 'python' : 'javascript'}
              value={fixedCode}
              onChange={(val) => setFixedCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                theme: 'vs-dark',
              }}
            />
          </div>
        </div>
      </div>

      {/* Hint + Submit row */}
      <div className="flex items-center gap-3">
        {/* Hint toggle */}
        {hints && (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-base-300 text-base-content/60 hover:border-base-400 hover:text-base-content text-sm transition-all"
          >
            {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !!result}
          className="flex items-center gap-2 px-6 py-2 rounded-lg btn-success text-success-content font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-auto border-none"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Running tests...
            </>
          ) : result ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Submitted
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Fix
            </>
          )}
        </button>
      </div>

      {/* Hint text (revealed on toggle) */}
      {showHint && hints && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-warning/10 border border-warning/20 p-3"
        >
          <p className="text-xs font-semibold text-warning mb-1">💡 Hint</p>
          <p className="text-sm text-base-content/80">{Array.isArray(hints) ? hints.join('\n') : hints}</p>
        </motion.div>
      )}

      {/* Result panel (shown after submission) */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-base-200 border border-base-300 p-4"
        >
          <p className="text-sm font-semibold text-base-content mb-3">📊 Results</p>
          <div className="flex flex-wrap gap-4 text-sm">
            {result.autoTestResult && (
              <div className="flex items-center gap-2">
                <span className="text-base-content/60">Tests:</span>
                <span className={result.autoTestResult.passed === result.autoTestResult.total ? 'text-success font-bold' : 'text-warning font-bold'}>
                  {result.autoTestResult.passed}/{result.autoTestResult.total} passed
                </span>
              </div>
            )}
            {result.aiReviewScore != null && (
              <div className="flex items-center gap-2">
                <span className="text-base-content/60">AI Score:</span>
                <span className="text-info font-bold">{result.aiReviewScore}/100</span>
              </div>
            )}
            {result.finalScore != null && (
              <div className="flex items-center gap-2">
                <span className="text-base-content/60">Score:</span>
                <span className="text-success font-bold">{result.finalScore}/100</span>
              </div>
            )}
          </div>
          {result.aiReviewFeedback && (
            <p className="text-xs text-base-content/60 mt-2 leading-relaxed">{result.aiReviewFeedback}</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BugBountyInterviewPanel;

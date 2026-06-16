import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Bug, Clock, Trophy, RotateCcw, Lightbulb, Play, Send,
  CheckCircle2, XCircle, Sparkles, ArrowLeft, Terminal,
  Eye, Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

// ── Difficulty badge styles ───────────────────────────────────────────────
const difficultyStyles = {
  easy:   'bg-green-500/15 text-green-400 border border-green-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  hard:   'bg-red-500/15 text-red-400 border border-red-500/30',
};

const languageStyles = {
  javascript: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  python:     'bg-sky-500/10 text-sky-300 border border-sky-500/20',
};

// ── Markdown-ish renderer for bug report (preserve exactly from Lovable) ──
const renderReport = (text) =>
  text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-3" />;
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
      <p key={i} className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 95% / 0.85)' }}>
        {parts.map((p, j) => {
          if (p.startsWith('**') && p.endsWith('**'))
            return (
              <span key={j} className="font-semibold text-white">
                {p.slice(2, -2)}
              </span>
            );
          if (p.startsWith('`') && p.endsWith('`'))
            return (
              <code
                key={j}
                className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[12.5px] font-mono border border-red-500/20"
              >
                {p.slice(1, -1)}
              </code>
            );
          return <span key={j}>{p}</span>;
        })}
      </p>
    );
  });

// ── Main Component ────────────────────────────────────────────────────────
const BugBountyProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Problem data
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor state
  const [code, setCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');

  // Test state
  const [tests, setTests] = useState([]);
  const [consoleOut, setConsoleOut] = useState('');
  const [running, setRunning] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Hint state
  const [hintLoading, setHintLoading] = useState(false);
  const [hintText, setHintText] = useState(null);
  const [hintShown, setHintShown] = useState(false);
  const [hintSubmissionId, setHintSubmissionId] = useState(null);

  // Solution state
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [solutionCode, setSolutionCode] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  // Explain state
  const [explainLoading, setExplainLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);

  // Timer
  const [seconds, setSeconds] = useState(0);
  const lineRef = useRef(null);

  // ── Fetch problem on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/bug-bounty/problems/${id}`);
        const p = res.data.problem;
        setProblem(p);
        setCode(p.buggyCode);
        setOriginalCode(p.buggyCode);
        // Map initialTestCases to local test state
        setTests(
          (p.initialTestCases || []).map((tc, idx) => ({
            id: idx + 1,
            input: tc.input,
            expected: tc.expectedOutput,
            status: 'idle',
          }))
        );
      } catch (err) {
        setError('Failed to load problem. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // ── Timer ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mmss = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [seconds]);

  const lineCount = code.split('\n').length;

  // ── Run public tests ────────────────────────────────────────────────────
  const runTests = async () => {
    if (!problem) return;
    setRunning(true);
    setConsoleOut('Running tests...');
    try {
      const res = await axios.post(`/api/bug-bounty/problems/${id}/run-public-tests`, {
        code,
      });
      const { result } = res.data;
      const updatedTests = tests.map((t, idx) => {
        const detail = result.details?.[idx];
        return {
          ...t,
          status: detail?.passed ? 'pass' : 'fail',
        };
      });
      setTests(updatedTests);
      const passCount = updatedTests.filter((t) => t.status === 'pass').length;
      const lines = result.details?.map(
        (d) =>
          `input=${d.input} → ${d.passed ? '✓ ' + d.expectedOutput : '✗ got: ' + (d.actualOutput || 'error')}`
      ) || [];
      
      let errorMsg = '';
      if (result.error) {
        errorMsg = `[System Error]: ${result.error}\n\n`;
      }
      
      setConsoleOut(
        `> Running ${updatedTests.length} public tests...\n\n${errorMsg}${lines.join('\n')}${lines.length > 0 ? '\n\n' : ''}${passCount}/${updatedTests.length} tests passed.`
      );
    } catch (err) {
      setConsoleOut('Error running tests. Check your code for syntax errors.');
      setTests((prev) => prev.map((t) => ({ ...t, status: 'idle' })));
    } finally {
      setRunning(false);
    }
  };

  // ── Submit fix ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!problem || submitting || submitted) return;
    setSubmitting(true);
    setConsoleOut('Submitting fix... Running all tests + AI review...');
    try {
      const res = await axios.post(`/api/bug-bounty/problems/${id}/submit`, {
        fixedCode: code,
        timeTakenSeconds: seconds,
      });
      const submission = res.data.submission;
      setSubmitResult(submission);
      setSubmitted(true);
      setHintSubmissionId(submission.id);

      // Update test statuses from auto-test result
      if (submission.autoTestResult?.details) {
        setTests((prev) =>
          prev.map((t, idx) => ({
            ...t,
            status: submission.autoTestResult.details[idx]?.passed ? 'pass' : 'fail',
          }))
        );
      }

      const score = submission.finalScore ?? submission.aiReviewScore ?? '—';
      setConsoleOut(
        `> Submission complete!\n\nAuto tests: ${submission.autoTestResult?.passed ?? '?'}/${submission.autoTestResult?.total ?? '?'} passed\nAI Score: ${submission.aiReviewScore ?? '—'}/100\nFinal Score: ${score}/100\n\n${submission.aiReviewFeedback || ''}`
      );
    } catch (err) {
      setConsoleOut('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Request hint ────────────────────────────────────────────────────────
  const handleHint = async () => {
    if (hintText) { setHintShown(true); return; }
    setHintLoading(true);
    try {
      const res = await axios.post(`/api/bug-bounty/problems/${id}/hints`, {
        submissionId: hintSubmissionId,
      });
      setHintText(res.data.hint);
      setHintShown(true);
    } catch (err) {
      setHintText('Hint unavailable at this time.');
      setHintShown(true);
    } finally {
      setHintLoading(false);
    }
  };

  // ── Show solution ───────────────────────────────────────────────────────
  const handleShowSolution = async () => {
    if (solutionCode) { setShowSolution(true); return; }
    setSolutionLoading(true);
    try {
      const res = await axios.get(`/api/bug-bounty/problems/${id}/solution`);
      setSolutionCode(res.data.solution);
      setShowSolution(true);
    } catch (err) {
      setSolutionCode('Solution unavailable.');
      setShowSolution(true);
    } finally {
      setSolutionLoading(false);
    }
  };

  // ── Explain fix ─────────────────────────────────────────────────────────
  const handleExplain = async () => {
    if (explanation) return;
    setExplainLoading(true);
    try {
      const res = await axios.post(`/api/bug-bounty/problems/${id}/explain`);
      setExplanation(res.data.explanation);
    } catch (err) {
      setExplanation('Explanation unavailable at this time.');
    } finally {
      setExplainLoading(false);
    }
  };

  // ── Reset ───────────────────────────────────────────────────────────────
  const reset = () => {
    setCode(originalCode);
    setTests((prev) => prev.map((t) => ({ ...t, status: 'idle' })));
    setConsoleOut('');
    setSubmitted(false);
    setSubmitResult(null);
  };

  // ── Loading / Error states ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen bg-[hsl(220_20%_7%)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin text-red-500" />
          Loading problem...
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="relative min-h-screen bg-[hsl(220_20%_7%)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Problem not found'}</p>
          <button
            onClick={() => navigate('/bug-bounty')}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700"
          >
            Back to Bug Bounty
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[hsl(220_20%_7%)] text-[hsl(0_0%_95%)]">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 dot-pattern-red opacity-40" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[480px] w-[800px] rounded-full blur-[140px]"
           style={{ background: 'hsl(0 84% 60% / 0.08)' }} />

      {/* ── Use existing CodeHire Navbar here ── */}

      <main className="w-full px-4 relative z-10 pt-4 pb-2">

        {/* ── Top bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          {/* Left: back + title + badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/bug-bounty')}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border glow-red flex-shrink-0"
              style={{ background: 'hsl(0 84% 60% / 0.15)', borderColor: 'hsl(0 84% 60% / 0.3)' }}
            >
              <Bug className="h-5 w-5 text-red-400" />
            </motion.div>

            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
              {problem.title}
            </h1>

            <span className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
              difficultyStyles[problem.difficultyLevel] || difficultyStyles.medium
            )}>
              {problem.difficultyLevel}
            </span>

            <span className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
              languageStyles[problem.language] || 'bg-gray-500/10 text-gray-300 border-gray-500/20'
            )}>
              {problem.language}
            </span>
          </div>

          {/* Right: points + timer + reset + hint */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="glass-card flex items-center gap-1.5 px-3 py-1.5">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold">{problem.bountyPoints} pts</span>
            </div>
            <div className="glass-card flex items-center gap-1.5 px-3 py-1.5">
              <Clock className="h-4 w-4 text-red-400" />
              <span className="text-sm font-mono font-semibold tabular-nums">{mmss}</span>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button
              onClick={handleHint}
              disabled={hintLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all disabled:opacity-50"
            >
              {hintLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Lightbulb className="h-4 w-4 text-yellow-400" />
              }
              {hintShown ? 'Hide Hint' : 'Request Hint'}
            </button>
          </div>
        </motion.div>

        {/* ── Hint banner (AnimatePresence) ── */}
        <AnimatePresence>
          {hintShown && hintText && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-4 rounded-xl px-4 py-3 border border-yellow-500/25 text-sm text-yellow-300 flex items-start gap-2"
              style={{ background: 'hsl(45 100% 50% / 0.07)' }}
            >
              <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-400" />
              <span>{hintText}</span>
              <button
                onClick={() => setHintShown(false)}
                className="ml-auto text-yellow-500/60 hover:text-yellow-300 text-xs"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Adjustable layout ── */}
        <div className="h-[calc(100vh-120px)] min-h-[600px] w-full flex pb-0">
          <PanelGroup direction="horizontal" autoSaveId="bug-bounty-main">
            {/* ═══ LEFT: Bug Report + Code Editor ═══ */}
            <Panel defaultSize={50} minSize={30} className="flex flex-col pr-2">
              <PanelGroup direction="vertical">

                {/* Bug Report */}
                <Panel defaultSize={40} minSize={20} className="flex flex-col pb-2">
                  <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass-card p-6 relative overflow-hidden flex flex-col flex-1"
                  >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px"
                         style={{ background: 'linear-gradient(90deg, transparent, hsl(0 84% 60% / 0.4), transparent)' }} />
      
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                      <Bug className="h-4 w-4 text-red-400" />
                      <span className="text-xs font-bold tracking-widest text-red-400">BUG REPORT</span>
                    </div>
                    <div className="space-y-1.5 flex-1 overflow-auto pr-2 pb-4">
                      {renderReport(problem.bugDescription)}

                      {/* AI Explanation directly in Bug Report */}
                      <AnimatePresence>
                        {explanation && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-6 rounded-xl border border-green-500/30 bg-green-500/5 p-5"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="h-4 w-4 text-green-400" />
                              <span className="text-xs font-bold tracking-widest text-green-400">AI EXPLANATION</span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'hsl(0 0% 95% / 0.8)' }}>
                              {explanation}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Correct Solution directly in Bug Report */}
                      <AnimatePresence>
                        {solutionCode && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                              <span className="text-xs font-bold tracking-widest text-yellow-400">CORRECT SOLUTION</span>
                            </div>
                            <pre className="font-mono text-[13px] overflow-auto leading-[1.5]" style={{ color: 'hsl(0 0% 95% / 0.8)' }}>
                              {solutionCode}
                            </pre>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.section>
                </Panel>

                <PanelResizeHandle className="h-3 w-full flex items-center justify-center cursor-row-resize">
                  <div className="w-8 h-1 rounded-full bg-white/10 hover:bg-white/30 transition-colors" />
                </PanelResizeHandle>

                {/* Code Editor (textarea with line numbers — Lovable design) */}
                <Panel defaultSize={60} minSize={20} className="flex flex-col pt-2">
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-card overflow-hidden flex flex-col flex-1"
                  >
              {/* Editor header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10"
                   style={{ background: 'hsl(220 20% 7% / 0.4)' }}>
                <div className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-red-400" />
                  <span className="text-xs font-bold tracking-widest text-red-400">BUGGY CODE</span>
                </div>
                <span className="text-xs text-yellow-300 capitalize">{problem.language}</span>
              </div>

              {/* Line numbers + textarea */}
              <div className="relative flex flex-1 font-mono text-[13px] overflow-hidden">
                {/* Line numbers */}
                <div
                  ref={lineRef}
                  className="select-none py-4 px-3 text-right border-r"
                  style={{
                    color: 'hsl(220 10% 55% / 0.6)',
                    background: 'hsl(220 20% 7% / 0.3)',
                    borderColor: 'hsl(220 15% 18% / 0.4)',
                  }}
                >
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Editable textarea */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 bg-transparent py-4 px-4 outline-none resize-none leading-[1.5] overflow-auto h-full"
                  style={{ color: 'hsl(0 0% 95% / 0.9)' }}
                />
              </div>
                  </motion.section>
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-3 h-full flex flex-col items-center justify-center cursor-col-resize">
              <div className="h-8 w-1 rounded-full bg-white/10 hover:bg-white/30 transition-colors" />
            </PanelResizeHandle>

            {/* ═══ RIGHT: Console + Tests ═══ */}
            <Panel defaultSize={50} minSize={30} className="flex flex-col pl-2">
              <PanelGroup direction="vertical">

                {/* Console Output */}
                <Panel defaultSize={35} minSize={20} className="flex flex-col pb-2">
                  <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass-card p-5 flex flex-col flex-1"
                  >
                    <div className="flex items-center gap-2 mb-3 shrink-0">
                      <Terminal className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-bold tracking-widest" style={{ color: 'hsl(0 0% 95% / 0.8)' }}>
                        CONSOLE OUTPUT
                      </span>
                    </div>
                    <pre className="flex-1 font-mono text-[12.5px] whitespace-pre-wrap leading-relaxed overflow-auto"
                         style={{ color: 'hsl(220 10% 55%)' }}>
                      {consoleOut || 'No output yet. Run tests to see console output.'}
                    </pre>
                  </motion.section>
                </Panel>

                <PanelResizeHandle className="h-3 w-full flex items-center justify-center cursor-row-resize">
                  <div className="w-8 h-1 rounded-full bg-white/10 hover:bg-white/30 transition-colors" />
                </PanelResizeHandle>

                {/* Tests Panel */}
                <Panel defaultSize={65} minSize={30} className="flex flex-col pt-2">
                  <div className="flex flex-col flex-1 overflow-auto gap-4 pb-2">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="glass-card overflow-hidden flex flex-col flex-1 shrink-0 min-h-[300px]"
                    >
                      {/* Tests header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10"
                   style={{ background: 'hsl(220 20% 7% / 0.4)' }}>
                <span className="text-xs font-bold tracking-widest text-white">TESTS</span>
                <div className="flex items-center gap-2">
                  {/* Run button */}
                  <button
                    onClick={runTests}
                    disabled={running || submitting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white transition-all disabled:opacity-50"
                  >
                    {running
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Play className="h-3.5 w-3.5" />
                    }
                    Run
                  </button>
                  {/* Submit button */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || submitted}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-50 glow-green"
                    style={{ background: 'hsl(152 69% 45%)', color: 'hsl(220 20% 7%)' }}
                  >
                    {submitting
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : submitted
                      ? <CheckCircle2 className="h-3.5 w-3.5" />
                      : <Send className="h-3.5 w-3.5" />
                    }
                    {submitted ? 'Submitted' : 'Submit'}
                  </button>
                </div>
              </div>

              {/* Test case list */}
              <div className="p-4 flex flex-col gap-3 flex-1 overflow-auto">
                {tests.map((t, idx) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className={cn(
                      'rounded-xl border p-4 transition-colors',
                      t.status === 'pass' && 'border-green-500/40 bg-green-500/5',
                      t.status === 'fail' && 'border-red-500/40 bg-red-500/5',
                      (!t.status || t.status === 'idle') && 'border-white/10 bg-white/2',
                    )}
                    style={
                      !t.status || t.status === 'idle'
                        ? { background: 'hsl(220 20% 7% / 0.4)' }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs" style={{ color: 'hsl(220 10% 55%)' }}>
                        Case {t.id}
                      </span>
                      {t.status === 'pass' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        </motion.div>
                      )}
                      {t.status === 'fail' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <XCircle className="h-4 w-4 text-red-400" />
                        </motion.div>
                      )}
                    </div>
                    <div className="grid gap-y-1 font-mono text-xs" style={{ gridTemplateColumns: '80px 1fr' }}>
                      <span style={{ color: 'hsl(220 10% 55%)' }}>Input:</span>
                      <span style={{ color: 'hsl(0 0% 95% / 0.9)' }}>{t.input}</span>
                      <span style={{ color: 'hsl(220 10% 55%)' }}>Expected:</span>
                      <span className="text-green-400">{t.expected}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Show Solution + Explain Fix footer */}
              <div className="flex items-center gap-2 p-4 border-t border-white/10"
                   style={{ background: 'hsl(220 20% 7% / 0.3)' }}>
                {/* Show Solution */}
                <button
                  onClick={handleShowSolution}
                  disabled={solutionLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {solutionLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Eye className="h-4 w-4 text-yellow-400" />
                  }
                  Show Solution
                </button>
                {/* Explain Fix */}
                <button
                  onClick={handleExplain}
                  disabled={explainLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {explainLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Sparkles className="h-4 w-4 text-green-400" />
                  }
                  Explain Fix
                </button>
              </div>
                    </motion.section>
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </main>

    </div>
  );
};

export default BugBountyProblem;

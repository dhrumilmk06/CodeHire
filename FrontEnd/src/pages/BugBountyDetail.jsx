import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { bugBountyApi } from '../api/bugBounty';
import axiosInstance from '../lib/axios';
import { getDifficultyBadgeClass } from '../lib/utils';
import BugBountyResult from '../components/BugBountyResult';
import {
  Bug,
  Lightbulb,
  Play,
  Send,
  Loader2,
  Clock,
  Trophy,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';

// ── Monaco language map ───────────────────────────────────────────────────────
const MONACO_LANG = {
  javascript: 'javascript',
  python:     'python',
  java:       'java',
  cpp:        'cpp',
  typescript: 'typescript',
};

// ── Test case display ─────────────────────────────────────────────────────────
function TestCasesList({ testCases, runResults }) {
  return (
    <div className="space-y-2">
      {testCases.map((tc, i) => {
        const result = runResults?.[i];
        return (
          <div
            key={i}
            className={`rounded-xl border px-4 py-3 text-xs font-mono space-y-1 ${
              result == null
                ? 'border-base-content/10 bg-base-200'
                : result.passed
                  ? 'border-success/30 bg-success/5'
                  : 'border-error/30 bg-error/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-base-content/60">Case {i + 1}</span>
              {result != null && (
                result.passed
                  ? <CheckCircle2 className="size-4 text-success" />
                  : <XCircle className="size-4 text-error" />
              )}
            </div>
            <div className="flex gap-2">
              <span className="text-base-content/40 w-24 shrink-0">Input:</span>
              <span>{tc.input}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-base-content/40 w-24 shrink-0">Expected:</span>
              <span className="text-success">{tc.expectedOutput}</span>
            </div>
            {result && !result.passed && (
              <div className="flex gap-2">
                <span className="text-base-content/40 w-24 shrink-0">Got:</span>
                <span className="text-error">{result.actualOutput || '(empty)'}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Hint Modal ────────────────────────────────────────────────────────────────
function HintModal({ hint, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl border border-primary/20 animate-in zoom-in-95 duration-200">
        <div className="card-body">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Lightbulb className="size-5 text-yellow-400" />
            Hint
          </h3>
          <p className="text-sm text-base-content/80 leading-relaxed bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            {hint}
          </p>
          <div className="card-actions justify-end mt-2">
            <button className="btn btn-primary btn-sm" onClick={onClose}>Got it!</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Custom Resize Handle ───────────────────────────────────────────────────────
function ResizeHandle({ direction = 'vertical' }) {
  return (
    <PanelResizeHandle
      className={`relative flex items-center justify-center transition-colors group ${
        direction === 'horizontal' ? 'w-2 mx-1 cursor-col-resize' : 'h-2 my-1 cursor-row-resize'
      }`}
    >
      <div
        className={`bg-base-content/10 group-hover:bg-primary/50 group-active:bg-primary rounded-full transition-colors ${
          direction === 'horizontal' ? 'w-1 h-8' : 'h-1 w-8'
        }`}
      />
    </PanelResizeHandle>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BugBountyDetail() {
  const { id } = useParams();

  const [problem, setProblem]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [fixedCode, setFixedCode]       = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  const [result, setResult]             = useState(null);
  const [hint, setHint]                 = useState(null);
  const [hintLoading, setHintLoading]   = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [runResults, setRunResults]     = useState(null);
  const [runError, setRunError]         = useState(null);
  const [showDesc, setShowDesc]         = useState(true);

  // Solution and Explanation states
  const [solution, setSolution] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [loadingSolution, setLoadingSolution] = useState(false);

  // Track time on page (seconds)
  const startTimeRef = useRef(Date.now());
  const [timeTaken, setTimeTaken]       = useState(0);

  // Submission to link hints to (set after first submit)
  const submissionIdRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTaken(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Strip the Piston test harness boilerplate so the candidate only edits the bug logic
  const stripHarness = (code = '') => {
    const separator = code.includes('// --- Piston test harness')
      ? '// --- Piston test harness'
      : '# --- Piston test harness';
    const idx = code.indexOf(separator);
    return idx !== -1 ? code.slice(0, idx).trimEnd() : code;
  };

  // Build a skeleton boilerplate: function signatures with placeholder comment, no body
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await bugBountyApi.getProblem(id);
        setProblem(data.problem);
        setFixedCode(data.problem?.buggyCode ?? '');
      } catch (err) {
        toast.error('Failed to load problem');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Re-attach the Piston harness to the candidate's fix before sending to backend
  const getFullCode = () => {
    if (!problem?.buggyCode) return fixedCode;
    const separator = problem.buggyCode.includes('// --- Piston test harness')
      ? '// --- Piston test harness'
      : '# --- Piston test harness';
    const idx = problem.buggyCode.indexOf(separator);
    if (idx === -1) return fixedCode;
    
    // If candidate pasted the harness, don't append it again
    if (fixedCode.includes(separator)) return fixedCode;
    
    const harness = problem.buggyCode.slice(idx);
    return `${fixedCode}\n\n${harness}`;
  };

  const handleRunTests = async () => {
    if (!fixedCode.trim()) return toast.error('Please write your fix first.');
    setRunningTests(true);
    setRunResults(null);
    setRunError(null);
    try {
      const data = await bugBountyApi.runTests(id, getFullCode());
      setRunResults(data.results?.details ?? []);
      
      if (data.results?.error) {
        setRunError(data.results.error);
        toast.error(data.results.error);
      } else {
        const { passed, total } = data.results ?? {};
        toast.success(`${passed ?? 0}/${total ?? 0} test cases passed`);
      }
    } catch (err) {
      toast.error('Failed to run tests');
    } finally {
      setRunningTests(false);
    }
  };

  const handleSubmit = async () => {
    if (!fixedCode.trim()) return toast.error('Please write your fix first.');
    setSubmitting(true);
    setResult(null);
    try {
      const data = await bugBountyApi.submitFix(id, {
        fixedCode: getFullCode(),   // send full code with harness to backend
        timeTakenSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
      });
      setResult(data.submission);
      submissionIdRef.current = data.submission?.id;
      toast.success('Submission complete!');
      // Scroll to results
      setTimeout(() => document.getElementById('bb-results')?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestHint = async () => {
    setHintLoading(true);
    try {
      const data = await bugBountyApi.requestHint(id, submissionIdRef.current);
      setHint(data.hint);
      setShowHintModal(true);
    } catch {
      toast.error('Could not fetch hint');
    } finally {
      setHintLoading(false);
    }
  };

  const handleShowSolution = async () => {
    if (solution) { setShowSolution(true); return; }
    setLoadingSolution(true);
    try {
      const res = await axiosInstance.get(`/bug-bounty/problems/${id}/solution`);
      setSolution(res.data.solution);
      setShowSolution(true);
    } catch (err) {
      toast.error('Failed to load solution');
    } finally {
      setLoadingSolution(false);
    }
  };

  const handleExplainFix = async () => {
    if (explanation) return;
    setLoadingExplanation(true);
    try {
      const res = await axiosInstance.post(`/bug-bounty/problems/${id}/explain`);
      setExplanation(res.data.explanation);
    } catch (err) {
      const fallback = 'Could not load explanation. Try again.';
      setExplanation(fallback);
      toast.error(fallback);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="text-center">
          <Bug className="size-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-bold">Problem not found</h2>
        </div>
      </div>
    );
  }

  const lang = problem.language ?? 'javascript';
  const monacoLang = MONACO_LANG[lang] ?? 'javascript';

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-[#0a0a0a] overflow-hidden">
      {/* ── Header ── */}
      <div className="flex-none bg-base-200/50 border-b border-primary/10 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Bug className="size-5 text-primary shrink-0" />
          <h1 className="font-bold text-base sm:text-lg text-base-content/90">{problem.title}</h1>
          <span className={`badge badge-sm font-bold ${getDifficultyBadgeClass(problem.difficultyLevel)}`}>
            {problem.difficultyLevel}
          </span>
          <span className="badge badge-sm badge-ghost opacity-80">{lang}</span>
          {problem.bountyPoints && (
            <span className="flex items-center gap-1 text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full ml-2">
              <Trophy className="size-3" />{problem.bountyPoints} pts
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-base-content/50 ml-2 bg-base-300 px-2 py-0.5 rounded-full font-mono">
            <Clock className="size-3" />{formatTime(timeTaken)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button 
            className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content gap-2" 
            onClick={() => setFixedCode(problem.buggyCode)}
          >
            Reset Code
          </button>
          <button
            className="btn btn-ghost btn-sm text-yellow-500 hover:bg-yellow-500/10 gap-2"
            disabled={hintLoading}
            onClick={handleRequestHint}
          >
            {hintLoading ? <Loader2 className="size-4 animate-spin" /> : <Lightbulb className="size-4" />}
            <span className="hidden sm:inline">Request Hint</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <div className="flex-1 p-4 min-h-0">
        <PanelGroup direction="horizontal" autoSaveId="bug-bounty-layout">
          
          {/* ── Left Column ── */}
          <Panel defaultSize={50} minSize={30} className="flex flex-col">
            <PanelGroup direction="vertical" autoSaveId="bug-bounty-left-col">
              
              {/* Bug Report */}
              <Panel defaultSize={30} minSize={20} className="flex flex-col pr-1 pb-1">
                <div className="bg-[#121212] rounded-xl border border-error/10 p-5 shadow-sm flex-1 overflow-y-auto custom-scrollbar">
                  <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-3">
                     <h3 className="text-error font-black tracking-wider text-xs mb-2 flex items-center gap-1.5">
                       <Bug className="size-3.5"/> BUG REPORT
                     </h3>
                     <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap font-medium">
                       {problem.bugDescription}
                     </p>
                  </div>
                  <div className="mt-4 px-1">
                    <h4 className="text-xs font-bold text-base-content/60 uppercase tracking-wider mb-2">Your Task</h4>
                    <ul className="list-disc list-inside text-sm text-base-content/70 space-y-1">
                      <li>Find and fix the logic error so all tests pass.</li>
                      <li>Do not change the function signature.</li>
                    </ul>
                  </div>

                  {showSolution && solution && (
                    <div className="mt-6 animate-in fade-in slide-in-from-top-4">
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="size-4" /> CORRECT SOLUTION
                          </h4>
                          <button onClick={() => setShowSolution(false)} className="text-xs text-base-content/50 hover:text-base-content underline">Hide</button>
                        </div>
                        <pre className="bg-[#121212] p-3 rounded border border-base-content/10 text-sm overflow-x-auto font-mono whitespace-pre-wrap text-base-content/90">
                          {solution}
                        </pre>
                      </div>
                    </div>
                  )}

                  {explanation && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Bug className="size-4" /> AI EXPLANATION
                          </h4>
                          <button onClick={() => setExplanation(null)} className="text-xs text-base-content/50 hover:text-base-content underline">Hide</button>
                        </div>
                        <p className="text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">{explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Panel>

              <ResizeHandle direction="vertical" />

              {/* Buggy Code */}
              <Panel defaultSize={70} minSize={30} className="flex flex-col pr-1 pt-1 pb-1">
                <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-base-content/10 bg-[#1e1e1e]">
                  <div className="bg-[#2a2a2a] px-4 py-2 flex items-center justify-between border-b border-black/20">
                    <span className="text-xs font-bold text-base-content/50 flex items-center gap-2">
                      <Bug className="size-3.5 text-error/70" /> BUGGY CODE
                    </span>
                    <span className="text-xs font-mono text-base-content/40">{lang}</span>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      language={monacoLang}
                      value={fixedCode}
                      onChange={(val) => setFixedCode(val ?? '')}
                      theme="vs-dark"
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        suggest: { showSnippets: true },
                        padding: { top: 16 }
                      }}
                    />
                  </div>
                </div>
              </Panel>

            </PanelGroup>
          </Panel>

          <ResizeHandle direction="horizontal" />

          {/* ── Right Column ── */}
          <Panel defaultSize={50} minSize={30} className="flex flex-col pl-1 pb-1">
            <PanelGroup direction="vertical" autoSaveId="bug-bounty-right-col">
              
              {/* Console Output */}
              <Panel defaultSize={40} minSize={20} className="flex flex-col pb-1">
                <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-base-content/10 bg-[#1e1e1e]">
                  <div className="bg-[#2a2a2a] px-4 py-2 flex items-center justify-between border-b border-black/20">
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">CONSOLE OUTPUT</span>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1 custom-scrollbar font-mono text-sm">
                    {(() => {
                      if (runError) return <span className="text-error font-semibold">{runError}</span>;
                      if (!runResults) return <span className="text-base-content/30 italic">No output yet. Run tests to see console output.</span>;
                      if (runResults.length === 0) return <span className="text-base-content/30 italic">No console output.</span>;
                      
                      return runResults.map((result, i) => (
                        <div key={i} className="mb-4 last:mb-0">
                          <div className="text-base-content/50 text-xs mb-1 select-none">=== Case {i+1} ===</div>
                          {result.actualOutput && <pre className="text-base-content/80 whitespace-pre-wrap">{result.actualOutput}</pre>}
                          {result.stderr && <pre className="text-error whitespace-pre-wrap mt-1">{result.stderr}</pre>}
                          {!result.actualOutput && !result.stderr && <span className="text-base-content/30 italic">No output</span>}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </Panel>

              <ResizeHandle direction="vertical" />

              {/* Tests Panel */}
              <Panel defaultSize={60} minSize={30} className="flex flex-col pt-1">
                <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-base-content/10 bg-[#121212]">
                  <div className="bg-[#2a2a2a] px-4 py-2 flex items-center justify-between border-b border-black/20">
                <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">TESTS</span>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-outline btn-xs gap-1 hover:bg-base-content/10"
                    disabled={runningTests || submitting}
                    onClick={handleRunTests}
                  >
                    {runningTests ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />} 
                    Run
                  </button>
                  <button
                    className="btn btn-primary btn-xs gap-1 min-w-[70px]"
                    disabled={submitting || runningTests}
                    onClick={handleSubmit}
                  >
                    {submitting ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />} 
                    Submit
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                {Array.isArray(problem.initialTestCases) && problem.initialTestCases.length > 0 ? (
                  <TestCasesList testCases={problem.initialTestCases} runResults={runResults} />
                ) : (
                  <p className="text-sm text-base-content/40 italic">No public test cases.</p>
                )}
                
                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-base-content/10">
                  <button
                    onClick={handleShowSolution}
                    disabled={loadingSolution}
                    className="btn bg-purple-600 hover:bg-purple-700 text-white border-none gap-2 flex-1 sm:flex-none"
                  >
                    {loadingSolution ? <Loader2 className="size-4 animate-spin" /> : '💡 Show Solution'}
                  </button>

                  <button
                    onClick={handleExplainFix}
                    disabled={loadingExplanation}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white border-none gap-2 flex-1 sm:flex-none"
                  >
                    {loadingExplanation ? <Loader2 className="size-4 animate-spin" /> : '🤖 Explain Fix'}
                  </button>
                </div>
                
                {result && (
                  <div id="bb-results" className="mt-6 pt-4 border-t border-base-content/10 animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-4">
                    <BugBountyResult submission={result} />
                  </div>
                )}
              </div>
            </div>
          </Panel>

        </PanelGroup>
      </Panel>

        </PanelGroup>
      </div>

      {/* ── Hint Modal ── */}
      {showHintModal && hint && (
        <HintModal hint={hint} onClose={() => setShowHintModal(false)} />
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}

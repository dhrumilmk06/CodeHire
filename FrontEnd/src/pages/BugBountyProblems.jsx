import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { bugBountyApi } from '../api/bugBounty';
import { getDifficultyBadgeClass } from '../lib/utils';
import {
  Bug,
  Trophy,
  Clock,
  Code2,
  Layers,
  ChevronRight,
  Loader2,
  SearchX,
  Filter,
  Flame,
} from 'lucide-react';

// ── Language color map ───────────────────────────────────────────────────────
const LANG_COLORS = {
  javascript: 'badge-warning',
  python:     'badge-info',
  java:       'badge-error',
  cpp:        'badge-secondary',
  typescript: 'badge-primary',
};

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonProblemCard() {
  return (
    <div className="card bg-base-100 border border-base-content/5 animate-pulse">
      <div className="card-body p-5 space-y-3">
        <div className="h-5 bg-base-300 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-base-300 rounded w-16" />
          <div className="h-5 bg-base-300 rounded w-20" />
        </div>
        <div className="h-4 bg-base-300 rounded w-1/2" />
        <div className="h-9 bg-base-300 rounded mt-2" />
      </div>
    </div>
  );
}

function ProblemCard({ problem }) {
  const navigate = useNavigate();
  const submissionCount = problem._count?.submissions ?? 0;

  return (
    <div
      className="card bg-base-100/60 backdrop-blur-md border border-white/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group relative overflow-hidden"
      onClick={() => navigate(`/bug-bounty/${problem.id}`)}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 size-36 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
      <div className="absolute -bottom-8 -left-8 size-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors duration-500" />

      <div className="card-body p-6 flex flex-col gap-4 relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-base-200 to-base-300 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0 shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Bug className="size-6 text-primary relative z-10 group-hover:animate-pulse" />
          </div>
          <div className="flex flex-col items-end gap-1.5 min-w-0">
            <span className={`badge badge-sm font-bold border-none shadow-xs ${getDifficultyBadgeClass(problem.difficultyLevel)}`}>
              {problem.difficultyLevel ?? 'Unknown'}
            </span>
            <span className={`badge badge-xs font-semibold border-none ${LANG_COLORS[problem.language] ?? 'badge-ghost'}`}>
              {problem.language}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-base-content/90 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
          {problem.title}
        </h3>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-base-content/60 mt-auto pt-3 border-t border-white/5">
          <span className="flex items-center gap-1.5 text-yellow-500/90 bg-yellow-500/10 px-2 py-1 rounded-lg">
            <Trophy className="size-3.5" />
            {problem.bountyPoints ?? 100} pts
          </span>
          {problem.estimatedTimeMinutes && (
            <span className="flex items-center gap-1.5 bg-base-200/50 px-2 py-1 rounded-lg">
              <Clock className="size-3.5" />
              {problem.estimatedTimeMinutes}m
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-base-200/50 px-2 py-1 rounded-lg ml-auto">
            <Layers className="size-3.5" />
            {submissionCount} {submissionCount === 1 ? 'try' : 'tries'}
          </span>
        </div>

        {/* CTA Button */}
        <button className="btn btn-primary btn-sm w-full mt-2 gap-2 bg-primary/10 text-primary border-transparent hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25">
          Start Solving
          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BugBountyProblems() {
  const [problems, setProblems]         = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [language, setLanguage]         = useState('');
  const [difficulty, setDifficulty]     = useState('');
  const [page, setPage]                 = useState(1);
  const LIMIT = 18;

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bugBountyApi.getProblems({ language, difficulty, page, limit: LIMIT });
      setProblems(data.problems ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error('[BugBountyProblems] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [language, difficulty, page]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [language, difficulty]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-base-300">
      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-b from-primary/10 via-base-200 to-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Bug className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Bug Bounty
              </h1>
              <p className="text-base-content/60 mt-1 text-sm sm:text-base">
                Fix the bug. Claim the bounty. 💰
              </p>
            </div>
            {total > 0 && (
              <div className="sm:ml-auto flex items-center gap-2 bg-base-100 rounded-xl px-4 py-2 shadow">
                <Flame className="size-4 text-orange-400" />
                <span className="text-sm font-semibold">{total} challenges</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <Filter className="size-4" />
            <span className="font-medium">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="select select-sm select-bordered bg-base-100"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
            </select>

            <select
              className="select select-sm select-bordered bg-base-100"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {(language || difficulty) && (
              <button
                className="btn btn-ghost btn-sm text-error"
                onClick={() => { setLanguage(''); setDifficulty(''); }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Problem Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonProblemCard key={i} />)
          ) : problems.length > 0 ? (
            problems.map((p) => <ProblemCard key={p.id} problem={p} />)
          ) : (
            <div className="col-span-full flex flex-col items-center py-24 text-center gap-4">
              <SearchX className="size-12 text-base-content/20" />
              <h3 className="text-xl font-bold text-base-content/40">No problems found</h3>
              <p className="text-sm text-base-content/30">Try changing the filters</p>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              className="btn btn-ghost btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span className="text-sm text-base-content/60">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { Bug, Filter, Flame, Trophy, Clock, Layers, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../lib/utils';
import axios from 'axios';

// ── Framer Motion variants (keep exactly as Lovable design) ──────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ── Difficulty & language badge styles ───────────────────────────────────
const difficultyStyles = {
  easy: 'bg-green-500/15 text-green-400 border border-green-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  hard: 'bg-red-500/15 text-red-400 border border-red-500/30',
};

const languageStyles = {
  javascript: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  python: 'bg-sky-500/10 text-sky-300 border border-sky-500/20',
};

// ── Component ─────────────────────────────────────────────────────────────
const BugBountyList = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [query, setQuery] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch problems from real API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/bug-bounty/problems');
        setProblems(res.data.problems || []);
      } catch (err) {
        setError('Failed to load challenges. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Client-side filtering
  const filtered = useMemo(
    () =>
      problems.filter(
        (c) =>
          (language === 'all' || c.language === language) &&
          (difficulty === 'all' || c.difficultyLevel === difficulty) &&
          (query === '' || c.title.toLowerCase().includes(query.toLowerCase())),
      ),
    [problems, language, difficulty, query],
  );

  // Total bounty points across all problems
  const totalPoints = problems.reduce((sum, p) => sum + (p.bountyPoints || 0), 0);

  return (
    <div className="relative min-h-screen bg-[hsl(220_20%_7%)] text-[hsl(0_0%_95%)]">

      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 dot-pattern-red opacity-50" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-red-500/8 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-red-500/5 blur-[120px]" />

      {/* Use your existing CodeHire Navbar/Sidebar here */}

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">

        {/* ── Header ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <div className="flex items-start gap-5">
            <motion.div
              initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 14 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 glow-red-intense flex-shrink-0"
            >
              <Bug className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-red-400 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE CHALLENGES
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight text-gradient-white">
                Bug Bounty
              </h1>
              <p className="mt-2 text-[hsl(220_10%_55%)] max-w-lg">
                Fix the bug. Claim the bounty. Hunt down logic errors in real code and prove your debugging instinct.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="glass-card flex items-center gap-2 px-4 py-2.5">
              <Flame className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold">
                {loading ? '—' : `${problems.length} challenges`}
              </span>
            </div>
            <div className="glass-card flex items-center gap-2 px-4 py-2.5">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold">
                {loading ? '—' : `${totalPoints.toLocaleString()} pts`}
              </span>
            </div>
          </motion.div>
        </motion.section>

        {/* ── Filters ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-12 glass-card p-4 flex flex-col md:flex-row gap-3 md:items-center"
        >
          <div className="flex items-center gap-2 text-sm text-[hsl(220_10%_55%)] pl-2">
            <Filter className="h-4 w-4" />
            Filter
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(220_10%_55%)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search challenges..."
              className="w-full h-10 pl-9 pr-3 rounded-md border border-[hsl(220_15%_18%)] bg-[hsl(220_20%_7%)/0.4] text-sm text-[hsl(0_0%_95%)] placeholder:text-[hsl(220_10%_55%)] focus:outline-none focus:ring-2 focus:ring-[hsl(152_69%_45%)]"
            />
          </div>

          {/* Language filter */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 px-3 rounded-md border border-[hsl(220_15%_18%)] bg-[hsl(220_18%_10%)] text-sm text-[hsl(0_0%_95%)] focus:outline-none focus:ring-2 focus:ring-[hsl(152_69%_45%)] md:w-44 cursor-pointer"
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          {/* Difficulty filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="h-10 px-3 rounded-md border border-[hsl(220_15%_18%)] bg-[hsl(220_18%_10%)] text-sm text-[hsl(0_0%_95%)] focus:outline-none focus:ring-2 focus:ring-[hsl(152_69%_45%)] md:w-44 cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </motion.section>

        {/* ── Loading state ── */}
        {loading && (
          <div className="mt-16 text-center text-[hsl(220_10%_55%)]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent mb-4" />
            <p>Loading challenges...</p>
          </div>
        )}

        {/* ── Error state ── */}
        {error && !loading && (
          <div className="mt-16 text-center text-red-400">
            <p>{error}</p>
          </div>
        )}

        {/* ── Problem Cards Grid ── */}
        {!loading && !error && (
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((c) => (
              <motion.article
                key={c.id}
                variants={item}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group glass-card-hover p-6 flex flex-col relative overflow-hidden cursor-pointer"
              >
                {/* Hover radial glow */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(400px circle at 50% 0%, hsl(0 84% 60% / 0.14), transparent 60%)' }}
                />

                {/* Card header: bug icon + badges */}
                <div className="flex items-start justify-between relative">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/15 transition-colors"
                  >
                    <Bug className="h-5 w-5 text-red-400" />
                  </motion.div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', difficultyStyles[c.difficultyLevel])}>
                      {c.difficultyLevel}
                    </span>
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', languageStyles[c.language] || 'bg-gray-500/10 text-gray-300 border border-gray-500/20')}>
                      {c.language}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-semibold mt-6 leading-snug min-h-[3.5rem] group-hover:text-red-400 transition-colors">
                  {c.title}
                </h3>

                {/* Meta info */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[hsl(220_10%_55%)]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    <Trophy className="h-3.5 w-3.5" />
                    {c.bountyPoints} pts
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {c.estimatedTimeMinutes}m
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    {c._count?.submissions || 0} tries
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate(`/bug-bounty/${c.id}`)}
                  className="mt-6 w-full h-10 flex items-center justify-center gap-2 rounded-md bg-[hsl(152_69%_45%)] text-[hsl(220_20%_7%)] text-sm font-semibold glow-green hover:bg-[hsl(152_69%_40%)] transition-all duration-200 group/btn"
                >
                  Start Solving
                  <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </motion.article>
            ))}
          </motion.section>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-[hsl(220_10%_55%)]">
            No challenges match your filters.
          </div>
        )}

      </main>
    </div>
  );
};

export default BugBountyList;

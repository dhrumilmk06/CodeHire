import { useState } from 'react';
import { whiteboardApi } from '../../api/whiteboard';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, Loader2Icon, SparklesIcon } from 'lucide-react';

// ── Circular Score Badge ──────────────────────────────────────────────────────
const ScoreBadge = ({ score }) => {
    const color =
        score >= 75 ? '#22c55e' :
        score >= 50 ? '#eab308' :
        '#ef4444';

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = ((score / 100) * circumference).toFixed(1);

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r={radius} fill="none" stroke="#374151" strokeWidth="7" />
                    <circle
                        cx="36" cy="36" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        style={{ transition: 'stroke-dasharray 0.8s ease' }}
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">
                    {score}
                </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                {score >= 75 ? 'Strong' : score >= 50 ? 'Average' : 'Weak'}
            </span>
        </div>
    );
};

// ── Sub Score Progress Bar ────────────────────────────────────────────────────
const SubScore = ({ label, score, feedback }) => {
    const color =
        score >= 75 ? 'bg-green-500' :
        score >= 50 ? 'bg-yellow-500' :
        'bg-red-500';

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-300 font-medium">
                <span>{label}</span>
                <span className="font-bold">{score}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                    className={`h-1.5 rounded-full ${color} transition-all duration-700`}
                    style={{ width: `${score}%` }}
                />
            </div>
            {feedback && <p className="text-gray-400 text-[10px] leading-relaxed">{feedback}</p>}
        </div>
    );
};

// ── Collapsible Section ───────────────────────────────────────────────────────
const CollapsibleSection = ({ title, items, colorClass, icon, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);

    if (!items || items.length === 0) return null;

    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-widest ${colorClass} hover:opacity-90 transition-opacity`}
            >
                <span className="flex items-center gap-1.5">
                    {icon} {title} ({items.length})
                </span>
                {open ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {items.map((item, i) => (
                            <li key={i} className="flex gap-2 px-3 py-2 text-[11px] text-gray-300 border-t border-gray-700/50">
                                <span className="shrink-0 mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
export const AIWhiteboardReview = ({ snapshotId, sessionId, designContext }) => {
    const [review, setReview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!snapshotId) {
            toast.error('Save a snapshot first to analyze it');
            return;
        }
        setIsLoading(true);
        try {
            const res = await whiteboardApi.reviewDesign(snapshotId, sessionId, designContext);
            setReview(res.data);
            toast.success('AI analysis complete!');
        } catch (err) {
            console.error('[AIWhiteboardReview] Failed:', err);
            toast.error(err?.response?.data?.error || 'AI analysis failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border-t border-gray-700 p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-violet-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Review</h3>
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !snapshotId}
                    className="btn btn-xs bg-violet-600 hover:bg-violet-500 border-none text-white gap-1.5 rounded-lg font-bold disabled:opacity-50"
                    id="ai-analyze-design-btn"
                >
                    {isLoading
                        ? <><Loader2Icon className="w-3 h-3 animate-spin" /> Analyzing…</>
                        : review
                            ? <><SparklesIcon className="w-3 h-3" /> Re-analyze</>
                            : <><SparklesIcon className="w-3 h-3" /> Analyze Design</>
                    }
                </button>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                    <Loader2Icon className="w-8 h-8 animate-spin text-violet-400" />
                    <p className="text-gray-400 text-xs font-medium">Analyzing your system design…</p>
                    <p className="text-gray-600 text-[10px]">This may take a few seconds</p>
                </div>
            )}

            {/* Results */}
            <AnimatePresence>
                {review && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Score + Summary */}
                        <div className="flex items-start gap-4">
                            <ScoreBadge score={review.score ?? 0} />
                            <p className="text-gray-300 text-[11px] leading-relaxed flex-1">
                                {review.summary}
                            </p>
                        </div>

                        {/* Sub-scores */}
                        <div className="space-y-3">
                            {review.completeness && (
                                <SubScore
                                    label="Completeness"
                                    score={review.completeness.score}
                                    feedback={review.completeness.feedback}
                                />
                            )}
                            {review.scalability && (
                                <SubScore
                                    label="Scalability"
                                    score={review.scalability.score}
                                    feedback={review.scalability.feedback}
                                />
                            )}
                        </div>

                        {/* Collapsible sections */}
                        <div className="space-y-2">
                            <CollapsibleSection
                                title="Strengths"
                                items={review.strengths}
                                colorClass="bg-green-500/20 text-green-400"
                                icon="✅"
                                defaultOpen={true}
                            />
                            <CollapsibleSection
                                title="Issues"
                                items={review.issues}
                                colorClass="bg-red-500/20 text-red-400"
                                icon="⚠️"
                            />
                            <CollapsibleSection
                                title="Improvements"
                                items={review.improvements}
                                colorClass="bg-yellow-500/20 text-yellow-400"
                                icon="💡"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* No snapshot hint */}
            {!snapshotId && !isLoading && !review && (
                <p className="text-gray-600 text-[10px] text-center">
                    Save a snapshot first, then analyze it with AI.
                </p>
            )}
        </div>
    );
};

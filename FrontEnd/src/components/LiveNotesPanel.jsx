import { useCallback, useEffect, useRef, useState } from "react";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    NotebookPenIcon,
    StarIcon,
    XIcon,
} from "lucide-react";
import axiosInstance from "../lib/axios";

const QUICK_TAGS = [
    "Good Problem Solving",
    "Needs Improvement",
    "Strong Communication",
    "Struggled with Edge Cases",
    "Clean Code",
    "Good Complexity Analysis",
];

// Simple debounce helper — no lodash import needed
function useDebouncedCallback(fn, delay) {
    const timer = useRef(null);
    return useCallback(
        (...args) => {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => fn(...args), delay);
        },
        [fn, delay]
    );
}

export const LiveNotesPanel = ({ sessionId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [notes, setNotes] = useState("");
    const [rating, setRating] = useState(0);
    const [tags, setTags] = useState([]);
    const [savedStatus, setSavedStatus] = useState("idle"); // idle | saving | saved | error
    const [hoverRating, setHoverRating] = useState(0);

    // Load saved notes when panel first opens
    useEffect(() => {
        if (!isOpen || !sessionId) return;
        axiosInstance
            .get(`/sessions/${sessionId}/notes`)
            .then(({ data }) => {
                setNotes(data.notes || "");
                setRating(data.rating || 0);
                setTags(data.tags || []);
            })
            .catch(() => {
                // Silent fail – new session with no notes yet
            });
    }, [isOpen, sessionId]);

    // Core save function
    const persist = useCallback(
        async (notesVal, ratingVal, tagsVal) => {
            setSavedStatus("saving");
            try {
                await axiosInstance.post(`/sessions/${sessionId}/notes`, {
                    notes: notesVal,
                    rating: ratingVal,
                    tags: tagsVal,
                });
                setSavedStatus("saved");
                setTimeout(() => setSavedStatus("idle"), 2000);
            } catch {
                setSavedStatus("error");
            }
        },
        [sessionId]
    );

    // Debounced auto-save (2.5s)
    const debouncedSave = useDebouncedCallback(persist, 2500);

    const handleNotesChange = (e) => {
        const val = e.target.value;
        setNotes(val);
        setSavedStatus("idle");
        debouncedSave(val, rating, tags);
    };

    const handleRating = (stars) => {
        setRating(stars);
        persist(notes, stars, tags);
    };

    const handleTagToggle = (tag) => {
        const next = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
        setTags(next);
        persist(notes, rating, next);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                title="Open Interview Notes"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1a1f2e] hover:bg-[#232b3e] text-emerald-400 border border-emerald-800/60 rounded-full px-4 py-3 shadow-2xl transition-all duration-200 hover:scale-105 group"
            >
                <NotebookPenIcon className="size-5" />
                <span className="text-sm font-semibold pr-1">Notes</span>
            </button>
        );
    }

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 w-[360px] bg-[#0f1117] border border-[#1e2433] rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isMinimized ? "h-14" : "h-[600px]"
                }`}
            style={{ maxHeight: "calc(100vh - 100px)" }}
        >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#131720] rounded-t-2xl border-b border-[#1e2433] shrink-0">
                <div className="flex items-center gap-2 text-emerald-400">
                    <NotebookPenIcon className="size-4" />
                    <span className="font-semibold text-sm tracking-wide">Interview Notes</span>
                    {savedStatus === "saving" && (
                        <span className="text-xs text-zinc-500 animate-pulse ml-1">Saving…</span>
                    )}
                    {savedStatus === "saved" && (
                        <span className="text-xs text-emerald-500 ml-1">Saved ✓</span>
                    )}
                    {savedStatus === "error" && (
                        <span className="text-xs text-red-500 ml-1">Save failed</span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
                        title={isMinimized ? "Expand" : "Minimize"}
                    >
                        {isMinimized ? (
                            <ChevronUpIcon className="size-4" />
                        ) : (
                            <ChevronDownIcon className="size-4" />
                        )}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-zinc-400 hover:text-red-400 p-1 rounded transition-colors"
                        title="Close"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>
            </div>

            {/* ── Body (hidden when minimized) ── */}
            {!isMinimized && (
                <div className="flex flex-col flex-1 overflow-hidden p-4 gap-4">
                    {/* Star Rating */}
                    <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2 font-semibold">
                            Candidate Rating
                        </p>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-125 duration-150"
                                    title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                >
                                    <StarIcon
                                        className={`size-6 transition-colors ${star <= (hoverRating || rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-zinc-600"
                                            }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="text-xs text-zinc-500 ml-2">
                                    {rating}/5
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Tags */}
                    <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2 font-semibold">
                            Quick Tags
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_TAGS.map((tag) => {
                                const active = tags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagToggle(tag)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${active
                                            ? "bg-emerald-600/30 border-emerald-500/70 text-emerald-300"
                                            : "bg-[#1a1f2e] border-[#2a3045] text-zinc-400 hover:border-emerald-700/60 hover:text-emerald-400"
                                            }`}
                                    >
                                        {active ? "✓ " : ""}{tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notes Textarea */}
                    <div className="flex flex-col flex-1 min-h-0">
                        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2 font-semibold">
                            Notes
                        </p>
                        <textarea
                            value={notes}
                            onChange={handleNotesChange}
                            placeholder="Write your interview observations here…&#10;&#10;• How did they approach the problem?&#10;• Did they ask clarifying questions?&#10;• Communication style?"
                            className="flex-1 w-full bg-[#131720] text-zinc-200 placeholder-zinc-600 border border-[#1e2433] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-emerald-700/60 transition-colors leading-relaxed"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

import { useState, useMemo, useEffect } from "react";
import {
  Code2, Clock, Users, Trophy, Loader, StarIcon,
  ChevronDownIcon, ChevronUpIcon, TagIcon, FileTextIcon,
  CheckCircleIcon, PauseCircleIcon, XCircleIcon, SearchIcon,
  TimerIcon, ClipboardCheckIcon, SaveIcon, ColumnsIcon, XIcon,
  CrownIcon, PlusCircleIcon, MinusCircleIcon, LayersIcon
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "../api/sessions";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// ── Helpers & Config ──────────────────────────────────────────────────────────

const StarRating = ({ value, onChange, readonly = false, size = "sm" }) => {
  const [hover, setHover] = useState(0);
  const sz = size === "sm" ? "size-4" : "size-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={readonly ? undefined : () => onChange?.(s)}
          onMouseEnter={readonly ? undefined : () => setHover(s)}
          onMouseLeave={readonly ? undefined : () => setHover(0)}
          disabled={readonly}
          className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <StarIcon
            className={`${sz} transition-colors ${s <= (hover || value) ? "text-emerald-400 fill-emerald-400" : "text-zinc-600"}`}
          />
        </button>
      ))}
    </div>
  );
};

const DECISION_CONFIG = {
  move_forward: {
    label: "Move Forward",
    color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40",
    icon: CheckCircleIcon,
    hover: "hover:bg-emerald-500/25 hover:border-emerald-500/60"
  },
  on_hold: {
    label: "On Hold",
    color: "text-yellow-400 bg-yellow-500/15 border-yellow-500/40",
    icon: PauseCircleIcon,
    hover: "hover:bg-yellow-500/25 hover:border-yellow-500/60"
  },
  rejected: {
    label: "Rejected",
    color: "text-red-400 bg-red-500/15 border-red-500/40",
    icon: XCircleIcon,
    hover: "hover:bg-red-500/25 hover:border-red-500/60"
  },
};

// ── Comparison Modal ──────────────────────────────────────────────────────────

const ComparisonModal = ({ selectedSessions, onClose, onUpdateDecision }) => {
  if (!selectedSessions.length) return null;

  const bestRating = Math.max(...selectedSessions.map(s => s.rating || 0));

  return (
    <div className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex flex-col p-8 overflow-hidden animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <ColumnsIcon className="size-8 text-primary" />
            Compare Candidates
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Side-by-side performance analysis</p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-circle bg-white/5 border-white/10 hover:bg-red-500/20 hover:text-red-400 border-none transition-all"
        >
          <XIcon className="size-6" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-8 custom-scrollbar">
        <div className="flex gap-6 min-w-max h-full">
          {selectedSessions.map((session) => {
            const isBest = session.rating > 0 && session.rating === bestRating;
            const decisionInfo = session.decision ? DECISION_CONFIG[session.decision] : null;

            return (
              <div
                key={session._id}
                className={`w-[400px] flex flex-col bg-[#0f1117] rounded-[32px] border-2 transition-all duration-500 ${isBest ? "border-primary shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]" : "border-white/5"
                  } relative overflow-hidden`}
              >
                {isBest && (
                  <div className="absolute top-0 right-0 p-6 z-10">
                    <CrownIcon className="size-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] animate-bounce" />
                  </div>
                )}

                <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white truncate">{session.participant?.name || "Anonymous"}</h3>
                    <p className="text-primary font-bold text-xs uppercase tracking-widest">
                      {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="p-5 bg-white/3 rounded-2xl border border-white/5 space-y-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Problem Assignment</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white truncate mr-2">{session.problem}</span>
                      <span className={`badge badge-sm font-bold shrink-0 ${getDifficultyBadgeClass(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Interview Score</p>
                    <div className="flex items-center gap-4">
                      <StarRating value={session.rating || 0} readonly size="lg" />
                      <span className={`text-2xl font-black ${isBest ? "text-primary" : "text-white"}`}>
                        {session.rating || 0}/5
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/2 border border-white/5 rounded-2xl space-y-1">
                      <p className="text-[9px] text-zinc-600 uppercase font-black">Speed</p>
                      <div className="flex items-center gap-2 text-white font-bold">
                        <TimerIcon className="size-4 text-yellow-500" />
                        {session.timeTaken || 0}m
                      </div>
                    </div>
                    <div className="p-4 bg-white/2 border border-white/5 rounded-2xl space-y-1">
                      <p className="text-[9px] text-zinc-600 uppercase font-black">Test Score</p>
                      <div className="flex items-center gap-2 text-white font-bold">
                        <ClipboardCheckIcon className="size-4 text-emerald-500" />
                        {session.testCasesPassed || "0/0"}
                      </div>
                    </div>
                  </div>

                  {session.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {session.tags.map(t => (
                        <span key={t} className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-black uppercase tracking-tight">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Executive Summary</p>
                    <div className="bg-black/40 rounded-2xl p-5 text-sm text-zinc-400 border border-white/5 italic leading-relaxed h-[200px] overflow-y-auto custom-scrollbar">
                      {session.notes || "No notes available."}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/3 border-t border-white/5 mt-auto flex flex-col gap-4">
                  {isBest && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 group animate-in slide-in-from-bottom duration-500">
                      <Trophy className="size-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Top Performer</span>
                    </div>
                  )}
                  <div className="dropdown dropdown-top w-full">
                    <div tabIndex={0} role="button" className={`btn w-full rounded-xl border transition-all ${decisionInfo ? decisionInfo.color : "bg-white/5 border-white/10 text-white"}`}>
                      {decisionInfo ? (
                        <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                          <decisionInfo.icon className="size-4" />
                          {decisionInfo.label}
                        </div>
                      ) : (
                        <span className="font-black uppercase tracking-widest text-xs opacity-50">Set Decision</span>
                      )}
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-2xl bg-[#131720] border border-white/10 rounded-2xl w-full mb-2">
                      {Object.entries(DECISION_CONFIG).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                          <li key={key}>
                            <button
                              onClick={() => onUpdateDecision(session._id, key)}
                              className="flex items-center gap-3 font-bold uppercase tracking-widest text-[10px] py-3 hover:bg-white/5"
                            >
                              <Icon className={`size-4 ${cfg.color.split(' ')[0]}`} />
                              {cfg.label}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Session Card ──────────────────────────────────────────────────────────────

const SessionCard = ({ session, userClerkId, onSelect, isSelected, compareMode }) => {
  const isHost = session.host?.clerkId === userClerkId;
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const [editRating, setEditRating] = useState(session.rating || 0);
  const [editTime, setEditTime] = useState(session.timeTaken || 0);
  const [editTests, setEditTests] = useState(session.testCasesPassed || "0/0");

  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: ["session-notes", session._id],
    queryFn: () => sessionApi.getSessionNotes(session._id),
    enabled: isExpanded && isHost,
  });

  useEffect(() => {
    if (notesData) {
      setEditRating(notesData.rating || 0);
      setEditTime(notesData.timeTaken || 0);
      setEditTests(notesData.testCasesPassed || "0/0");
    }
  }, [notesData]);

  const handleSaveAll = async () => {
    try {
      const { default: axiosInstance } = await import("../lib/axios");
      await axiosInstance.post(`/sessions/${session._id}/notes`, {
        rating: editRating,
        timeTaken: editTime,
        testCasesPassed: editTests,
        notes: notesData?.notes || "",
        tags: notesData?.tags || []
      });
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      toast.success("Interview data saved");
    } catch {
      toast.error("Failed to save changes");
    }
  };

  const decisionMutation = useMutation({
    mutationFn: ({ id, decision }) => sessionApi.setSessionDecision({ id, decision }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] }),
  });

  const displayRating = session.rating || 0;
  const displayTags = session.tags || [];
  const decisionInfo = session.decision ? DECISION_CONFIG[session.decision] : null;

  return (
    <div
      className={`card relative border transition-all duration-500 group/card ${isExpanded
        ? "bg-[#0f1117] border-primary/40 col-span-1 md:col-span-2 lg:col-span-3 h-auto"
        : isSelected
          ? "bg-base-200 border-primary shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] scale-[1.02]"
          : "bg-base-200 border-base-300 hover:border-primary/30 h-full"
        }`}
    >
      {isHost && (
        <div className={`absolute top-4 right-4 z-10 transition-all duration-300 ${compareMode || isSelected ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover/card:opacity-100 group-hover/card:scale-100"}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(session._id);
            }}
            className={`btn btn-circle btn-sm shadow-xl border-none transition-all ${isSelected
              ? "bg-primary text-white scale-110"
              : "bg-[#131720]/80 backdrop-blur-md text-primary hover:bg-primary hover:text-white"
              }`}
          >
            {isSelected ? <MinusCircleIcon className="size-5" /> : <PlusCircleIcon className="size-5" />}
          </button>
        </div>
      )}

      <div className="card-body p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-linear-to-br from-primary to-secondary shrink-0 shadow-lg shadow-primary/20">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg truncate text-white">{session.problem}</h3>
              {decisionInfo && (
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${decisionInfo.color} animate-in fade-in zoom-in duration-300`}>
                  {decisionInfo.label}
                </div>
              )}
            </div>
            {isHost && session.participant && (
              <p className="text-xs font-bold text-secondary -mt-1 mb-2">Candidate: {session.participant.name}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge badge-sm font-bold ${getDifficultyBadgeClass(session.difficulty)}`}>
                {session.difficulty}
              </span>
              {isHost && displayRating > 0 && <StarRating value={displayRating} readonly />}
            </div>
          </div>
        </div>

        {isHost && displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayTags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold uppercase tracking-tight">
                <TagIcon className="size-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs opacity-70 mb-4 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-secondary" />
            <span>{session.participant ? "2" : "1"} Participants</span>
          </div>
          {isHost && session.timeTaken > 0 && (
            <div className="flex items-center gap-2">
              <TimerIcon className="w-3.5 h-3.5 text-yellow-500" />
              <span>{session.timeTaken}m</span>
            </div>
          )}
          {isHost && session.testCasesPassed !== "0/0" && (
            <div className="flex items-center gap-2">
              <ClipboardCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>{session.testCasesPassed}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-base-300 bg-white/2 -mx-5 px-5 -mb-5 pb-5 rounded-b-2xl">
          <span className="text-[10px] font-black opacity-30 uppercase tracking-widest leading-none">
            {new Date(session.updatedAt).toDateString()}
          </span>
          {isHost && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`btn btn-xs rounded-lg gap-1 border-none shadow-sm transition-all duration-300 ${isExpanded ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
            >
              <FileTextIcon className="size-3" />
              {isExpanded ? "Close" : "View Notes"}
              {isExpanded ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
            </button>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && isHost && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-8 pt-8 border-t border-white/10 space-y-8">
                {notesLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-primary/40">
                    <Loader className="size-8 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="p-4 bg-white/3 rounded-2xl border border-white/5 space-y-3">
                        <p className="text-[10px] text-zinc-500 uppercase font-black">Rating</p>
                        <div className="flex items-center gap-4">
                          <StarRating value={editRating} onChange={setEditRating} size="lg" />
                          <span className="text-xl font-black text-white">{editRating}/5</span>
                        </div>
                      </div>
                      <div className="p-4 bg-white/3 rounded-2xl border border-white/5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                          <p className="text-[9px] text-zinc-500 uppercase font-black">Minutes</p>
                          <input type="number" value={editTime} onChange={(e) => setEditTime(Number(e.target.value))} className="bg-[#131720] border border-white/10 rounded-xl px-4 py-1.5 text-sm text-white font-bold h-10" />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <p className="text-[9px] text-zinc-500 uppercase font-black">Tests (e.g. 4/5)</p>
                          <input type="text" value={editTests} onChange={(e) => setEditTests(e.target.value)} className="bg-[#131720] border border-white/10 rounded-xl px-4 py-1.5 text-sm text-white font-bold h-10" placeholder="X/Y" />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button onClick={handleSaveAll} className="w-full btn btn-primary rounded-2xl h-full flex flex-col gap-1 py-4 group overflow-hidden">
                          <SaveIcon className="size-5" />
                          <span className="font-black uppercase tracking-widest text-[10px]">Update Review</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] text-zinc-500 uppercase font-black">Interview Notes</p>
                      <textarea readOnly value={notesData?.notes || "No notes."} className="w-full h-40 bg-[#0a0c10] text-zinc-400 border border-white/10 rounded-2xl p-4 text-sm resize-none" />
                    </div>

                    {notesData?.timings?.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-zinc-500 uppercase font-black">Time Breakdown by Problem</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {notesData.timings.map((t, idx) => (
                            <div key={idx} className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-colors">
                              <span className="text-xs font-bold text-white truncate mr-4">{t.problemId}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <TimerIcon className="size-3 text-primary opacity-50" />
                                <span className="text-xs font-mono font-bold text-primary">
                                  {Math.floor((t.duration || 0) / 60)}:{((t.duration || 0) % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <p className="text-[10px] text-zinc-500 uppercase font-black">Final Decision</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(DECISION_CONFIG).map(([key, cfg]) => {
                          const Icon = cfg.icon;
                          const isCurrent = session.decision === key;
                          return (
                            <button
                              key={key}
                              onClick={() => decisionMutation.mutate({ id: session._id, decision: key })}
                              disabled={decisionMutation.isPending}
                              className={`flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-xs font-black border transition-all ${isCurrent ? cfg.color : "bg-white/3 border-white/5 text-zinc-500 " + cfg.hover}`}
                            >
                              <Icon className="size-4" />
                              <span className="uppercase tracking-widest">{cfg.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const RecentSession = ({ sessions, isLoading, userClerkId }) => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedIds, setSelectedIds] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isSameProblemFilter, setIsSameProblemFilter] = useState(false);

  const queryClient = useQueryClient();

  const handleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) {
        toast.error("Max 4 candidates for comparison");
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedSessions = useMemo(() => sessions.filter(s => selectedIds.includes(s._id)), [sessions, selectedIds]);
  const viewerIsHost = useMemo(() => sessions.some((s) => s.host?.clerkId === userClerkId), [sessions, userClerkId]);

  const updateDecisionMutation = useMutation({
    mutationFn: ({ id, decision }) => sessionApi.setSessionDecision({ id, decision }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      toast.success("Decision updated");
    }
  });

  const filtered = useMemo(() => {
    let list = [...sessions];

    if (isSameProblemFilter && selectedIds.length > 0) {
      const targetProblems = selectedSessions.map(s => s.problem);
      list = list.filter(s => targetProblems.includes(s.problem));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.problem?.toLowerCase().includes(q) ||
        s.participant?.name?.toLowerCase().includes(q) ||
        s.host?.name?.toLowerCase().includes(q)
      );
    }

    if (ratingFilter !== "all") {
      const stars = parseInt(ratingFilter);
      list = list.filter(s => (s.rating || 0) === stars && s.host?.clerkId === userClerkId);
    }

    if (decisionFilter !== "all") {
      list = list.filter(s => s.decision === decisionFilter && s.host?.clerkId === userClerkId);
    }

    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "highest_rated") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [sessions, search, ratingFilter, decisionFilter, sortBy, userClerkId, isSameProblemFilter, selectedIds, selectedSessions]);

  return (
    <div className="mt-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-br from-accent to-secondary rounded-2xl shadow-lg shadow-accent/20">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Your Past Sessions</h2>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">History of your coding interviews</p>
          </div>
        </div>
        {sessions.length > 0 && (
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
            <Trophy className="size-4" />
            {sessions.length} Sessions Total
          </div>
        )}
      </div>

      {sessions.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 mb-10 p-5 bg-[#1a1f2e]/50 backdrop-blur-md rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="flex items-center gap-3 bg-[#0f1117] border border-white/10 rounded-2xl px-5 py-3 flex-1 min-w-[280px] group-hover:border-primary/30 transition-colors duration-500">
            <SearchIcon className="size-5 text-zinc-600 shrink-0" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full text-white placeholder:text-zinc-700 font-medium" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {viewerIsHost && (
              <button
                onClick={() => {
                  setIsCompareMode(!isCompareMode);
                  if (isCompareMode) setSelectedIds([]);
                }}
                className={`btn btn-sm rounded-xl gap-2 font-black uppercase tracking-widest transition-all ${isCompareMode ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
              >
                <LayersIcon className="size-4" />
                {isCompareMode ? "Exit Select" : "Compare Mode"}
              </button>
            )}

            {viewerIsHost && isCompareMode && selectedIds.length > 0 && (
              <button
                onClick={() => setIsSameProblemFilter(!isSameProblemFilter)}
                className={`btn btn-sm rounded-xl gap-2 font-black uppercase tracking-widest transition-all ${isSameProblemFilter ? "bg-secondary text-white border-secondary" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
              >
                <Code2 className="size-4" />
                Same Problem Only
              </button>
            )}

            <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />

            {viewerIsHost && (
              <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="bg-[#0f1117] border border-white/10 text-white text-[10px] font-black rounded-xl px-4 py-2.5 outline-none cursor-pointer">
                <option value="all">ALL RATINGS</option>
                {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} STARS</option>)}
              </select>
            )}

            {viewerIsHost && (
              <select value={decisionFilter} onChange={(e) => setDecisionFilter(e.target.value)} className="bg-[#0f1117] border border-white/10 text-white text-[10px] font-black rounded-xl px-4 py-2.5 outline-none cursor-pointer">
                <option value="all">ALL DECISIONS</option>
                <option value="move_forward">MOVE FORWARD</option>
                <option value="on_hold">ON HOLD</option>
                <option value="rejected">REJECTED</option>
              </select>
            )}

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#0f1117] border border-white/10 text-white text-[10px] font-black rounded-xl px-4 py-2.5 outline-none cursor-pointer">
              <option value="newest">NEWEST</option>
              <option value="oldest">OLDEST</option>
              {viewerIsHost && <option value="highest_rated">BY RATING</option>}
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader className="w-12 h-12 animate-spin text-primary opacity-20" />
          <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Synchronizing...</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              userClerkId={userClerkId}
              onSelect={handleSelect}
              isSelected={selectedIds.includes(session._id)}
              compareMode={isCompareMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[#0f1117] rounded-3xl border border-white/5 border-dashed">
          <SearchIcon className="w-16 h-16 mx-auto mb-6 text-zinc-800" />
          <p className="text-xl font-black text-white opacity-40 uppercase tracking-tighter">No results found</p>
        </div>
      )}

      <AnimatePresence>
        {selectedIds.length >= 2 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-90 w-[90%] max-w-2xl">
            <div className="bg-[#1a1f2e] border border-primary/30 rounded-[28px] p-4 shadow-2xl flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center gap-4 pl-4">
                <div className="flex -space-x-3">
                  {selectedSessions.map(s => (
                    <div key={s._id} className="size-9 rounded-full bg-linear-to-br from-primary to-secondary border-4 border-[#1a1f2e] flex items-center justify-center text-[10px] font-black text-white">
                      {s.participant?.name?.charAt(0) || "A"}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-black uppercase text-[10px] tracking-widest">{selectedIds.length} Selected</p>
                  <p className="text-[9px] text-primary font-bold uppercase tracking-tighter shrink-0">Ready to compare</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedIds([])} className="btn btn-ghost btn-xs text-zinc-500 font-bold uppercase tracking-widest">Clear</button>
                <button onClick={() => setShowCompareModal(true)} className="btn btn-primary btn-sm bg-primary border-none rounded-xl px-6 h-10 flex items-center gap-2 group relative overflow-hidden">
                  <ColumnsIcon className="size-4" />
                  <span className="font-bold uppercase tracking-widest text-xs">Compare Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompareModal && (
          <ComparisonModal
            selectedSessions={selectedSessions}
            onClose={() => setShowCompareModal(false)}
            onUpdateDecision={(id, decision) => updateDecisionMutation.mutate({ id, decision })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

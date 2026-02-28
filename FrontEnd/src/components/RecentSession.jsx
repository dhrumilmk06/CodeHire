import { useState, useMemo, useEffect } from "react";
import {
  Code2, Clock, Users, Trophy, Loader, StarIcon,
  ChevronDownIcon, ChevronUpIcon, TagIcon, FileTextIcon,
  CheckCircleIcon, PauseCircleIcon, XCircleIcon, SearchIcon,
  TimerIcon, ClipboardCheckIcon, SaveIcon
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "../api/sessions";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// ── Sub-component: star display/edit ─────────────────────────────────────────
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
            className={`${sz} transition-colors ${s <= (hover || value) ? "text-emerald-400 fill-emerald-400" : "text-zinc-600"
              }`}
          />
        </button>
      ))}
    </div>
  );
};

// ── Decision config ───────────────────────────────────────────────────────────
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

// ── Single expanded session card ──────────────────────────────────────────────
const SessionCard = ({ session, userClerkId }) => {
  const isHost = session.host?.clerkId === userClerkId;
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  // Local state for editable fields
  const [editRating, setEditRating] = useState(session.rating || 0);
  const [editTime, setEditTime] = useState(session.timeTaken || 0);
  const [editTests, setEditTests] = useState(session.testCasesPassed || "0/0");

  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: ["session-notes", session._id],
    queryFn: () => sessionApi.getSessionNotes(session._id),
    enabled: isExpanded && isHost,
  });

  // Keep local state synced with notesData when it loads
  useEffect(() => {
    if (notesData) {
      setEditRating(notesData.rating || 0);
      setEditTime(notesData.timeTaken || 0);
      setEditTests(notesData.testCasesPassed || "0/0");
    }
  }, [notesData]);

  // Save all metadata mutation
  const saveMetadataMutation = useMutation({
    mutationFn: (data) => {
      // We pass existing notes and tags so they don't get overwritten
      return sessionApi.setSessionDecision({
        id: session._id,
        ...data,
        notes: notesData?.notes,
        tags: notesData?.tags
      });
    },
    // We actually use the saveNotes endpoint logic but it's more flexible to use a dedicated patch for decision
    // and a post for everything else. For post-session edits, let's use saveNotes logic via axiosInstance.
  });

  const axiosSave = async (payload) => {
    const { default: axiosInstance } = await import("../lib/axios");
    return axiosInstance.post(`/sessions/${session._id}/notes`, payload);
  };

  const handleSaveAll = async () => {
    try {
      await axiosSave({
        rating: editRating,
        timeTaken: editTime,
        testCasesPassed: editTests,
        notes: notesData?.notes || "",
        tags: notesData?.tags || []
      });
      queryClient.invalidateQueries({ queryKey: ["session-notes", session._id] });
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      toast.success("Interview data saved");
    } catch {
      toast.error("Failed to save changes");
    }
  };

  const decisionMutation = useMutation({
    mutationFn: ({ id, decision }) => sessionApi.setSessionDecision({ id, decision }),
    onSuccess: (_, { decision }) => {
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      toast.success(DECISION_CONFIG[decision]?.label + " updated");
    },
    onError: () => toast.error("Failed to update decision"),
  });

  const displayRating = session.rating || 0;
  const displayTags = session.tags || [];
  const displayDecision = session.decision || null;
  const decisionInfo = displayDecision ? DECISION_CONFIG[displayDecision] : null;

  return (
    <div
      className={`card relative border transition-all duration-300 ${isExpanded
        ? "bg-[#0f1117] border-primary/40 col-span-1 md:col-span-2 lg:col-span-3 h-auto"
        : "bg-base-200 border-base-300 hover:border-primary/30 h-full"
        }`}
    >
      <div className="card-body p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-linear-to-br from-primary to-secondary shrink-0 shadow-lg shadow-primary/20">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg truncate text-white">{session.problem}</h3>
              {decisionInfo && (
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${decisionInfo.color} animate-in fade-in zoom-in duration-300`}>
                  {decisionInfo.label}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge badge-sm font-bold ${getDifficultyBadgeClass(session.difficulty)}`}>
                {session.difficulty}
              </span>
              {isHost && displayRating > 0 && (
                <StarRating value={displayRating} readonly />
              )}
            </div>
          </div>
        </div>

        {isHost && displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold uppercase tracking-tight"
              >
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
              <span>{session.timeTaken}m Duration</span>
            </div>
          )}
          {isHost && session.testCasesPassed !== "0/0" && (
            <div className="flex items-center gap-2">
              <ClipboardCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>{session.testCasesPassed} tests passed</span>
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
              className={`btn btn-xs rounded-lg gap-1 border-none shadow-sm transition-all duration-300 ${isExpanded ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
            >
              <FileTextIcon className="size-3" />
              {isExpanded ? "Close Review" : "View Notes"}
              {isExpanded ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
            </button>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && isHost && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8 pt-8 border-t border-white/10 space-y-8">
                {notesLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-primary/40">
                    <Loader className="size-8 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Loading Interview Data...</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Star Rating Section */}
                      <div className="p-4 bg-white/3 rounded-2xl border border-white/5 space-y-3">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Performance Rating</p>
                        <div className="flex items-center gap-4">
                          <StarRating
                            value={editRating}
                            onChange={setEditRating}
                            size="lg"
                          />
                          <span className="text-xl font-black text-white">{editRating}/5</span>
                        </div>
                      </div>

                      {/* Time and Tests Section */}
                      <div className="p-4 bg-white/3 rounded-2xl border border-white/5 flex flex-col gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Minutes Taken</p>
                          <input
                            type="number"
                            value={editTime}
                            onChange={(e) => setEditTime(Number(e.target.value))}
                            className="bg-[#131720] border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-bold focus:border-primary outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Test Cases (e.g. 4/5)</p>
                          <input
                            type="text"
                            value={editTests}
                            onChange={(e) => setEditTests(e.target.value)}
                            className="bg-[#131720] border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-bold focus:border-emerald-500 outline-none placeholder:opacity-20"
                            placeholder="X/Y"
                          />
                        </div>
                      </div>

                      {/* Save Changes Button */}
                      <div className="flex items-end">
                        <button
                          onClick={handleSaveAll}
                          className="w-full btn btn-primary rounded-2xl h-full flex flex-col gap-2 py-6 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                          <SaveIcon className="size-6 relative z-10" />
                          <span className="relative z-10 font-black uppercase tracking-widest">Update Review data</span>
                        </button>
                      </div>
                    </div>

                    {/* Notes Display */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Interview Notes (Read-only)</p>
                        {notesData?.tags?.length > 0 && (
                          <div className="flex gap-1">
                            {notesData.tags.map(t => <span key={t} className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-bold">{t}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <textarea
                          readOnly
                          value={notesData?.notes || "No notes available for this session."}
                          className="relative w-full h-48 bg-[#0a0c10] text-zinc-300 border border-white/10 rounded-2xl p-6 text-sm resize-none focus:outline-none leading-relaxed shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Decision Section */}
                    <div className="space-y-4">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Final Candidate Decision</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(DECISION_CONFIG).map(([key, cfg]) => {
                          const Icon = cfg.icon;
                          const isCurrent = session.decision === key;
                          return (
                            <button
                              key={key}
                              onClick={() => decisionMutation.mutate({ id: session._id, decision: key })}
                              disabled={decisionMutation.isPending}
                              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black border transition-all duration-300 ${isCurrent
                                ? cfg.color + " shadow-xl border-opacity-100 scale-[1.02]"
                                : "bg-white/3 border-white/5 text-zinc-500 " + cfg.hover
                                }`}
                            >
                              <Icon className="size-5" />
                              <span className="uppercase tracking-widest">{cfg.label}</span>
                              {isCurrent && <div className="size-2 bg-current rounded-full animate-pulse ml-auto" />}
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

// ── Main RecentSession component ──────────────────────────────────────────────
export const RecentSession = ({ sessions, isLoading, userClerkId }) => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const viewerIsHost = useMemo(() => sessions.some((s) => s.host?.clerkId === userClerkId), [sessions, userClerkId]);

  const filtered = useMemo(() => {
    let list = [...sessions];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.problem?.toLowerCase().includes(q) ||
          s.participant?.name?.toLowerCase().includes(q) ||
          s.host?.name?.toLowerCase().includes(q)
      );
    }

    // Rating filter (only for sessions user hosted)
    if (ratingFilter !== "all") {
      const stars = parseInt(ratingFilter);
      list = list.filter((s) => (s.rating || 0) === stars && s.host?.clerkId === userClerkId);
    }

    // Decision filter (only for sessions user hosted)
    if (decisionFilter !== "all") {
      list = list.filter((s) => s.decision === decisionFilter && s.host?.clerkId === userClerkId);
    }

    // Sort
    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "highest_rated") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [sessions, search, ratingFilter, decisionFilter, sortBy, userClerkId]);

  return (
    <div className="mt-12">
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

          {/* Search */}
          <div className="flex items-center gap-3 bg-[#0f1117] border border-white/10 rounded-2xl px-5 py-3 flex-1 min-w-[280px] group-hover:border-primary/30 transition-colors duration-500">
            <SearchIcon className="size-5 text-zinc-600 shrink-0" />
            <input
              type="text"
              placeholder="Search problem, candidate or host..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full text-white placeholder:text-zinc-700 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Rating filter */}
            {viewerIsHost && (
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="bg-[#0f1117] border border-white/10 text-white text-xs font-bold rounded-2xl px-4 py-3 outline-none focus:border-primary select-custom appearance-none cursor-pointer"
              >
                <option value="all">ALL RATINGS</option>
                {[5, 4, 3, 2, 1].map((s) => (
                  <option key={s} value={s}>{s} STAR{s > 1 ? "S" : ""}</option>
                ))}
              </select>
            )}

            {/* Decision filter */}
            {viewerIsHost && (
              <select
                value={decisionFilter}
                onChange={(e) => setDecisionFilter(e.target.value)}
                className="bg-[#0f1117] border border-white/10 text-white text-xs font-bold rounded-2xl px-4 py-3 outline-none focus:border-primary select-custom appearance-none cursor-pointer"
              >
                <option value="all">ALL DECISIONS</option>
                <option value="move_forward">MOVE FORWARD</option>
                <option value="on_hold">ON HOLD</option>
                <option value="rejected">REJECTED</option>
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0f1117] border border-white/10 text-white text-xs font-bold rounded-2xl px-4 py-3 outline-none focus:border-primary select-custom appearance-none cursor-pointer"
            >
              <option value="newest">MOST RECENT</option>
              <option value="oldest">OLDEST FIRST</option>
              {viewerIsHost && <option value="highest_rated">HIGHEST RATED</option>}
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader className="w-12 h-12 animate-spin text-primary opacity-20" />
          <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] animate-pulse">Synchronizing Data...</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((session) => (
            <SessionCard key={session._id} session={session} userClerkId={userClerkId} />
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="text-center py-24 bg-[#0f1117] rounded-3xl border border-white/5 border-dashed">
          <SearchIcon className="w-16 h-16 mx-auto mb-6 text-zinc-800" />
          <p className="text-xl font-black text-white opacity-40 uppercase tracking-tighter">No sessions match your criteria</p>
          <p className="text-sm text-zinc-600 font-bold mt-2">Adjust your filters or clear your search to see more results</p>
        </div>
      ) : (
        <div className="text-center py-32 bg-[#0f1117] rounded-[40px] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-b from-primary/2 to-transparent pointer-events-none" />
          <div className="w-24 h-24 mx-auto mb-8 bg-linear-to-br from-accent/20 to-secondary/20 rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
            <Trophy className="w-12 h-12 text-accent animate-bounce-slow" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Stage is set for your first session</h3>
          <p className="text-sm text-zinc-500 font-medium max-w-xs mx-auto">Create a room and start your interview journey to see your progress here.</p>
        </div>
      )}
    </div>
  );
};

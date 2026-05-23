import { useState, useMemo, useEffect } from "react";
import {
  Code2, Clock, Users, Trophy, Loader, StarIcon,
  ChevronDownIcon, ChevronUpIcon, TagIcon, FileTextIcon,
  CheckCircleIcon, PauseCircleIcon, XCircleIcon, SearchIcon,
  TimerIcon, ClipboardCheckIcon, SaveIcon, ColumnsIcon, XIcon,
  CrownIcon, PlusCircleIcon, MinusCircleIcon, LayersIcon
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { SkeletonCard } from "./ui/SkeletonCard";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "../api/sessions";
import { whiteboardApi } from "../api/whiteboard";
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

// ── Whiteboard Design Score (system-design sessions only) ─────────────────────

const WhiteboardDesignScore = ({ session }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const queryClient = useQueryClient();

  const { data: snapshotsData, isLoading } = useQuery({
    queryKey: ["whiteboard-snapshots", session._id],
    queryFn: () => whiteboardApi.getSnapshots(session._id),
    enabled: session.sessionType === "system-design",
  });

  const snapshots = snapshotsData?.data || [];
  const latest = snapshots[0] || null; // already ordered desc

  const handleRunAIReview = async () => {
    if (!latest) {
      toast.error("No snapshot saved yet — save a snapshot from the whiteboard first.");
      return;
    }
    setIsReviewing(true);
    try {
      const result = await whiteboardApi.reviewDesign(
        latest.id,
        session._id,
        session.problem || "System design interview"
      );
      toast.success(`AI Review complete! Score: ${result.score}/100`);
      // Refresh to show new score
      queryClient.invalidateQueries({ queryKey: ["whiteboard-snapshots", session._id] });
    } catch (err) {
      console.error("AI review failed:", err);
      toast.error("AI review failed — try again");
    } finally {
      setIsReviewing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-zinc-500">
        <Loader className="size-4 animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">Loading snapshots...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-zinc-500 uppercase font-black">Whiteboard Design Score</p>

      {/* Latest snapshot preview */}
      {latest ? (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
          {/* We need to fetch full snapshot with imageData — lazy fetch on expand */}
          <SnapshotImagePreview snapshotId={latest.id} sessionId={session._id} />
          <div className="p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">{latest.label || 'Snapshot'}</p>
              <p className="text-[10px] text-zinc-600">
                {new Date(latest.createdAt).toLocaleString()}
              </p>
            </div>
            {latest.aiScore != null ? (
              <div className="text-right">
                <p className="text-2xl font-black text-violet-400">{latest.aiScore}<span className="text-sm text-zinc-500">/100</span></p>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500">AI Score</p>
              </div>
            ) : (
              <button
                onClick={handleRunAIReview}
                disabled={isReviewing}
                className="btn btn-xs bg-violet-600 hover:bg-violet-500 border-none text-white gap-1 font-bold"
              >
                {isReviewing ? <Loader className="size-3 animate-spin" /> : '🤖'}
                {isReviewing ? 'Reviewing...' : 'Run AI Review'}
              </button>
            )}
          </div>
          {/* Show AI feedback summary if available */}
          {latest.aiFeedback && (
            <div className="px-3 pb-3">
              <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">AI Feedback</p>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4">{latest.aiFeedback}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-white/2 border border-white/5 border-dashed rounded-2xl text-center">
          <p className="text-xs text-zinc-600 font-bold">No whiteboard snapshots saved for this session.</p>
        </div>
      )}
    </div>
  );
};

// Lazy-loads the full imageData only when the card is expanded
const SnapshotImagePreview = ({ snapshotId, sessionId }) => {
  const { data } = useQuery({
    queryKey: ["snapshot-full", snapshotId],
    queryFn: () => whiteboardApi.getSnapshotById(sessionId, snapshotId),
    staleTime: Infinity,
  });
  const imageData = data?.data?.imageData;
  if (!imageData) return (
    <div className="h-32 flex items-center justify-center bg-black/60">
      <Loader className="size-5 animate-spin text-zinc-700" />
    </div>
  );
  return <img src={imageData} alt="Whiteboard snapshot" className="w-full object-contain max-h-52 bg-white" />;
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
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white truncate">{session.participant?.name || "Anonymous"}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold truncate">{session.participant?.email}</p>
                    <p className="text-primary font-bold text-[10px] uppercase tracking-widest mt-1">
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
                      {session.notes || session.agentSummary || "No notes available."}
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

const SessionCard = ({ session, userClerkId, onSelect, isSelected, compareMode, handleGenerateReport, reportLoading, reportStep, reportError }) => {
  const isHost = session.host?.clerkId === userClerkId;
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const [editRating, setEditRating] = useState(session.rating || 0);
  const [editTime, setEditTime] = useState(session.timeTaken || 0);
  const [editTests, setEditTests] = useState(session.testCasesPassed || "0/0");

  // Decision email state
  const [activeDecision, setActiveDecision] = useState(session.decisionStatus || null);
  const [emailSending, setEmailSending] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { decision } | null

  // Sync activeDecision if session prop updates (e.g. after refetch)
  useEffect(() => {
    setActiveDecision(session.decisionStatus || null);
  }, [session.decisionStatus]);

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

  const handleDecisionClick = (decisionKey) => {
    // Don't re-send if already active
    if (activeDecision === decisionKey) return;
    const candidateName = session.participant?.name || "Candidate";
    const candidateEmail = session.participant?.email || "";
    setConfirmDialog({ decision: decisionKey, candidateName, candidateEmail });
  };

  const handleConfirmDecision = async () => {
    if (!confirmDialog) return;
    const { decision, candidateName, candidateEmail } = confirmDialog;
    setConfirmDialog(null);
    setEmailSending(decision);
    try {
      await sessionApi.sendDecisionEmail({
        id: session._id,
        decision,
        candidateEmail,
        candidateName,
        jobRole: session.problem || "Software Engineer",
        companyName: "CodeHire",
      });
      setActiveDecision(decision);
      queryClient.invalidateQueries({ queryKey: ["myRecentSessions"] });
      toast.success(`✅ Email sent to ${candidateName}`);
    } catch {
      toast.error("❌ Failed to send email. Please try again.");
    } finally {
      setEmailSending(false);
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
        ? "bg-[#0f1117] border-primary/40 col-span-1 sm:col-span-2 lg:col-span-3 h-auto"
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
              <div className="flex flex-col -mt-1 mb-2">
                <p className="text-xs font-bold text-secondary">Candidate: {session.participant.name}</p>
                <p className="text-[10px] text-zinc-500 font-medium truncate">{session.participant.email}</p>
              </div>
            )}
            {!isHost && session.host && (
              <div className="flex flex-col -mt-1 mb-2">
                <p className="text-xs font-bold text-secondary">Interviewer: {session.host.name}</p>
                <p className="text-[10px] text-zinc-500 font-medium truncate">{session.host.email}</p>
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge badge-sm font-bold ${getDifficultyBadgeClass(session.difficulty)}`}>
                {session.difficulty}
              </span>
              {displayRating > 0 && <StarRating value={displayRating} readonly />}
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
          {session.timeTaken > 0 && (
            <div className="flex items-center gap-2">
              <TimerIcon className="w-3.5 h-3.5 text-yellow-500" />
              <span>{session.timeTaken}m</span>
            </div>
          )}
          {session.testCasesPassed !== "0/0" && (
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
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`btn btn-xs w-full rounded-lg gap-1 border-none shadow-sm transition-all duration-300 ${isExpanded ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
              >
                <FileTextIcon className="size-3" />
                {isExpanded ? "Close" : "View Notes"}
                {isExpanded ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
              </button>

              <button
                onClick={() => handleGenerateReport(session)}
                disabled={reportLoading[session._id]}
                className={`
                  flex items-center justify-center gap-2
                  w-full px-4 py-2 rounded-lg
                  text-[10px] font-black cursor-pointer
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${reportError[session._id]
                    ? 'bg-[#111111] border border-red-500 text-red-500'
                    : 'bg-[#111111] border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-black shadow-[0_0_15px_-5px_rgba(34,197,94,0.3)]'
                  }
                `}
              >
                {reportLoading[session._id] ? (
                  <>
                    <Loader className="size-3 animate-spin" />
                    <span className="uppercase tracking-widest">
                      {reportStep[session._id] === 'review'
                        ? 'AI Review...'
                        : 'PDF...'}
                    </span>
                  </>
                ) : reportError[session._id] ? (
                  <span className="uppercase tracking-widest">❌ Failed — Try Again</span>
                ) : (
                  <>
                     <LayersIcon className="size-3" />
                    <span className="uppercase tracking-widest text-[10px]">Report Card</span>
                  </>
                )}
              </button>
            </div>
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
                      <textarea readOnly value={notesData?.notes || notesData?.agentSummary || "No notes."} className="w-full h-40 bg-[#0a0c10] text-zinc-400 border border-white/10 rounded-2xl p-4 text-sm resize-none" />
                    </div>

                    {/* Whiteboard Design Score — system-design sessions only */}
                    {session.sessionType === 'system-design' && (
                      <div>
                        <WhiteboardDesignScore session={session} />
                      </div>
                    )}

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
                          const isActive = activeDecision === key;
                          const isSending = emailSending === key;

                          const activeStyles = {
                            move_forward: "bg-emerald-500/20 border-emerald-500 text-emerald-400",
                            on_hold: "bg-yellow-500/20 border-yellow-500 text-yellow-400",
                            rejected: "bg-red-500/20 border-red-500 text-red-400",
                          };

                          return (
                            <button
                              key={key}
                              onClick={() => handleDecisionClick(key)}
                              disabled={!!emailSending}
                              className={`relative flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-xs font-black border transition-all ${
                                isActive
                                  ? activeStyles[key]
                                  : "bg-white/3 border-white/5 text-zinc-500 " + cfg.hover
                              } disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                              {isSending ? (
                                <Loader className="size-4 animate-spin" />
                              ) : (
                                <Icon className="size-4" />
                              )}
                              <span className="uppercase tracking-widest">
                                {isSending ? "Sending..." : cfg.label}
                              </span>
                              {isActive && (
                                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-current opacity-80 flex items-center justify-center text-[8px]">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Status line — shown after email sent */}
                      {activeDecision && session.decisionSentAt && (
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1 px-1">
                          <span>📧</span>
                          <span>
                            <span className="font-bold" style={{ color: activeDecision === 'move_forward' ? '#00ff9d' : activeDecision === 'on_hold' ? '#fbbf24' : '#ef4444' }}>
                              {DECISION_CONFIG[activeDecision]?.label}
                            </span>
                            {" "}email sent to{" "}
                            <span className="text-zinc-400">{session.participant?.email}</span>
                            {" "}on{" "}
                            {new Date(session.decisionSentAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f1117] border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-5">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Confirm Decision</p>
              <h3 className="text-white font-black text-lg leading-tight">
                Send <span style={{ color: confirmDialog.decision === 'move_forward' ? '#00ff9d' : confirmDialog.decision === 'on_hold' ? '#fbbf24' : '#ef4444' }}>
                  {DECISION_CONFIG[confirmDialog.decision]?.label}
                </span> email?
              </h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              This will send a <strong className="text-white">{DECISION_CONFIG[confirmDialog.decision]?.label}</strong> email
              to <strong className="text-white">{confirmDialog.candidateName}</strong> at{" "}
              <span className="text-zinc-300 font-mono text-xs">{confirmDialog.candidateEmail}</span>.
              <br /><br />
              <span className="text-zinc-600 text-xs">This action cannot be undone.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 btn btn-sm bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white rounded-xl font-black uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className="flex-1 btn btn-sm rounded-xl font-black uppercase tracking-widest border-none"
                style={{
                  backgroundColor: confirmDialog.decision === 'move_forward' ? '#00ff9d20' : confirmDialog.decision === 'on_hold' ? '#fbbf2420' : '#ef444420',
                  color: confirmDialog.decision === 'move_forward' ? '#00ff9d' : confirmDialog.decision === 'on_hold' ? '#fbbf24' : '#ef4444',
                  border: `1px solid ${confirmDialog.decision === 'move_forward' ? '#00ff9d40' : confirmDialog.decision === 'on_hold' ? '#fbbf2440' : '#ef444440'}`,
                }}
              >
                ✓ Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const RecentSession = ({ sessions, isLoading, userClerkId, hideCompare = false }) => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedIds, setSelectedIds] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isSameProblemFilter, setIsSameProblemFilter] = useState(false);

  const [reportLoading, setReportLoading] = useState({});
  const [reportStep, setReportStep] = useState({});
  const [reportError, setReportError] = useState({});

  const handleGenerateReport = async (session) => {
    // Set loading state for this specific session card
    setReportLoading(prev => ({ ...prev, [session._id]: true }));
    setReportError(prev => ({ ...prev, [session._id]: false }));
    setReportStep(prev => ({ ...prev, [session._id]: "review" }));

    try {
      const token = await window.Clerk?.session?.getToken();
      const apiUrl = import.meta.env.VITE_API_URL || "";

      // Step 1 — For coding sessions, generate AI Code Review first.
      // For system-design sessions, skip this step (no code to review).
      if (session.sessionType !== 'system-design') {
        const reviewRes = await fetch(`${apiUrl}/ai/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId: session._id,
            problemTitle: session.problem || "Coding Problem",
            problemDescription: "",
            candidateCode: Object.values(session.problemCodes || {})[0] || "",
            score: session.testCasesPassed || "0/0",
            timeTaken: session.timeTaken ? `${session.timeTaken}:00` : "12:00",
            language: "JavaScript",
          }),
        });

        if (!reviewRes.ok) throw new Error("AI review failed");
      }

      // Step 2 — Generate PDF
      setReportStep(prev => ({ ...prev, [session._id]: "pdf" }));

      const reportRes = await fetch(`${apiUrl}/reports/${session._id}/generate`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!reportRes.ok) throw new Error("PDF generation failed");

      // Step 3 — Auto download PDF
      const blob = await reportRes.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CodeHire-Report-${session._id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Report generation error:", error);
      setReportError(prev => ({ ...prev, [session._id]: true }));

      // Reset error after 3 seconds
      setTimeout(() => {
        setReportError(prev => ({ ...prev, [session._id]: false }));
      }, 3000);
    } finally {
      setReportLoading(prev => ({ ...prev, [session._id]: false }));
      setReportStep(prev => ({ ...prev, [session._id]: null }));
    }
  };

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
  const viewerIsHost = useMemo(() => {
    if (hideCompare) return false;
    return sessions.some((s) => s.host?.clerkId === userClerkId);
  }, [sessions, userClerkId, hideCompare]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-linear-to-br from-accent to-secondary rounded-xl sm:rounded-2xl shadow-lg shadow-accent/20">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mb-1">Recent Sessions</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">History of your coding interviews</p>
          </div>
        </div>
        {sessions.length > 0 && (
          <div className="flex items-center gap-2 text-primary font-black text-[10px] sm:text-xs uppercase bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-primary/20 self-start sm:self-auto">
            <Trophy className="size-3 sm:size-4" />
            {sessions.length} Sessions
          </div>
        )}
      </div>

      {sessions.length > 0 && (
        <div className="flex flex-col gap-4 mb-10 p-4 sm:p-5 bg-[#1a1f2e]/50 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="flex items-center gap-3 bg-[#0f1117] border border-white/10 rounded-xl sm:rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 w-full group-hover:border-primary/30 transition-colors duration-500">
            <SearchIcon className="size-4 sm:size-5 text-zinc-600 shrink-0" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-xs sm:text-sm outline-none w-full text-white placeholder:text-zinc-700 font-medium" />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {viewerIsHost && (
              <button
                onClick={() => {
                  setIsCompareMode(!isCompareMode);
                  if (isCompareMode) setSelectedIds([]);
                }}
                className={`btn btn-xs sm:btn-sm rounded-lg sm:rounded-xl gap-2 font-black uppercase tracking-widest transition-all ${isCompareMode ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
              >
                <LayersIcon className="size-3 sm:size-4" />
                <span className="hidden xs:inline">{isCompareMode ? "Exit Select" : "Compare Mode"}</span>
                <span className="xs:hidden">{isCompareMode ? "Exit" : "Compare"}</span>
              </button>
            )}

            {viewerIsHost && isCompareMode && selectedIds.length > 0 && (
              <button
                onClick={() => setIsSameProblemFilter(!isSameProblemFilter)}
                className={`btn btn-xs sm:btn-sm rounded-lg sm:rounded-xl gap-2 font-black uppercase tracking-widest transition-all ${isSameProblemFilter ? "bg-secondary text-white border-secondary" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
              >
                <Code2 className="size-3 sm:size-4" />
                <span className="hidden xs:inline">Same Problem</span>
                <span className="xs:hidden">Filter</span>
              </button>
            )}

            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 flex-wrap">
              {viewerIsHost && (
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="bg-[#0f1117] border border-white/10 text-white text-[9px] sm:text-[10px] font-black rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 outline-none cursor-pointer">
                  <option value="all">RATINGS</option>
                  {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} STARS</option>)}
                </select>
              )}

              {viewerIsHost && (
                <select value={decisionFilter} onChange={(e) => setDecisionFilter(e.target.value)} className="bg-[#0f1117] border border-white/10 text-white text-[9px] sm:text-[10px] font-black rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 outline-none cursor-pointer">
                  <option value="all">DECISIONS</option>
                  <option value="move_forward">MOVE FORWARD</option>
                  <option value="on_hold">ON HOLD</option>
                  <option value="rejected">REJECTED</option>
                </select>
              )}

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#0f1117] border border-white/10 text-white text-[9px] sm:text-[10px] font-black rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 outline-none cursor-pointer">
                <option value="newest">NEWEST</option>
                <option value="oldest">OLDEST</option>
                {viewerIsHost && <option value="highest_rated">BY RATING</option>}
              </select>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} variant="session" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              userClerkId={userClerkId}
              onSelect={handleSelect}
              isSelected={selectedIds.includes(session._id)}
              compareMode={isCompareMode}
              handleGenerateReport={handleGenerateReport}
              reportLoading={reportLoading}
              reportStep={reportStep}
              reportError={reportError}
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

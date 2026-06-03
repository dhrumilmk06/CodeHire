import { useState, useMemo, useEffect } from "react";
import { PROBLEMS } from "../data/problems";
import { useMyProblems } from "../hooks/useCustomProblems";
import {
  Code2Icon,
  LoaderIcon,
  PlusIcon,
  LockIcon,
  Search,
  X,
  GripVertical,
  CheckCircle2,
  MonitorIcon,
  Bug, Trophy, Clock, CheckCircle
} from "lucide-react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { getDifficultyBadgeClass, cn } from "../lib/utils";
import axiosInstance from "../lib/axios";

export const CreateSessionModel = ({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const builtInProblems = Object.values(PROBLEMS);
  const { data: customProblems = [] } = useMyProblems();

  const [bugBountyProblems, setBugBountyProblems] = useState([]);
  const [loadingBugBountyProblems, setLoadingBugBountyProblems] = useState(false);

  useEffect(() => {
    if (roomConfig.sessionType !== 'bug_bounty') return;
    setLoadingBugBountyProblems(true);
    axiosInstance.get('/bug-bounty/problems/for-session')
      .then(res => setBugBountyProblems(res.data.problems || []))
      .catch(err => console.error('Failed to load bug bounty problems', err))
      .finally(() => setLoadingBugBountyProblems(false));
  }, [roomConfig.sessionType]);

  // Merge both lists
  const allProblems = useMemo(() => [
    ...customProblems.map((p) => ({ ...p, _isCustom: true, id: p._id || p.id })),
    ...builtInProblems.map((p) => ({ ...p, _isCustom: false, id: p.id })),
  ], [customProblems, builtInProblems]);

  const filteredProblems = useMemo(() => {
    return allProblems.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProblems, searchQuery]);

  if (!isOpen) return null;

  const handleSelectProblem = (problem) => {
    const isAlreadySelected = roomConfig.problems.find(p => p.title === problem.title);
    if (isAlreadySelected) return;

    if (roomConfig.problems.length >= 10) return;

    setRoomConfig(prev => ({
      ...prev,
      problems: [...prev.problems, { title: problem.title, difficulty: problem.difficulty }]
    }));
  };

  const handleRemoveProblem = (title) => {
    setRoomConfig(prev => ({
      ...prev,
      problems: prev.problems.filter(p => p.title !== title)
    }));
  };

  const handleReorder = (newOrder) => {
    setRoomConfig(prev => ({
      ...prev,
      problems: newOrder
    }));
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-base-100 border border-base-300 shadow-2xl p-0 overflow-hidden">
        <div className="p-6 border-b border-base-300 flex items-center justify-between">
          <h3 className="font-bold text-2xl">Create New Session</h3>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* SESSION TYPE TOGGLE */}
          <div className="space-y-2">
            <label className="label py-0">
              <span className="label-text font-bold text-base">Interview Type</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                id="session-type-coding"
                type="button"
                onClick={() => setRoomConfig(prev => ({ ...prev, sessionType: 'coding' }))}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  (roomConfig.sessionType || 'coding') === 'coding'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-base-300 bg-base-200/50 text-base-content/60 hover:border-base-400'
                }`}
              >
                <Code2Icon className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-sm">Coding</p>
                  <p className="text-[10px] opacity-60">Algorithm & DS</p>
                </div>
              </button>
              <button
                id="session-type-system-design"
                type="button"
                onClick={() => setRoomConfig(prev => ({ ...prev, sessionType: 'system-design' }))}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  roomConfig.sessionType === 'system-design'
                    ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                    : 'border-base-300 bg-base-200/50 text-base-content/60 hover:border-base-400'
                }`}
              >
                <MonitorIcon className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-sm">System Design</p>
                  <p className="text-[10px] opacity-60">Whiteboard mode</p>
                </div>
              </button>
              <button
                id="session-type-bug-bounty"
                type="button"
                onClick={() => setRoomConfig(prev => ({ ...prev, sessionType: 'bug_bounty' }))}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  roomConfig.sessionType === 'bug_bounty'
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-base-300 bg-base-200/50 text-base-content/60 hover:border-base-400'
                }`}
              >
                <Bug className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-sm">Bug Bounty</p>
                  <p className="text-[10px] opacity-60">Fix the bugs</p>
                </div>
              </button>
            </div>
          </div>

          {/* PROBLEM PICKER */}
          {roomConfig.sessionType === 'bug_bounty' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-base-content mb-3">
                Select Bug Bounty Problem
                <span className="text-red-400 ml-1">*</span>
              </label>

              {loadingBugBountyProblems ? (
                <div className="flex items-center gap-2 text-base-content/60 text-sm p-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  Loading problems...
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {bugBountyProblems.map((problem) => (
                    <button
                      key={problem.id}
                      type="button"
                      onClick={() => setRoomConfig(prev => ({ ...prev, bugBountyProblemId: problem.id }))}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        roomConfig.bugBountyProblemId === problem.id
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-base-300 bg-base-200/30 hover:border-base-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Bug className={`h-4 w-4 flex-shrink-0 ${
                          roomConfig.bugBountyProblemId === problem.id ? 'text-red-400' : 'text-base-content/50'
                        }`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-base-content truncate">{problem.title}</p>
                          <p className="text-xs text-base-content/50 mt-0.5 truncate">{problem.bugDescription}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        {/* Difficulty badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                          problem.difficultyLevel === 'easy'   ? 'bg-green-500/20 text-green-400' :
                          problem.difficultyLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                 'bg-red-500/20 text-red-400'
                        }`}>
                          {problem.difficultyLevel}
                        </span>
                        {/* Points */}
                        <span className="flex items-center gap-1 text-xs text-yellow-500">
                          <Trophy className="h-3 w-3" />
                          {problem.bountyPoints}
                        </span>
                        {/* Time */}
                        <span className="flex items-center gap-1 text-xs text-base-content/50">
                          <Clock className="h-3 w-3" />
                          {problem.estimatedTimeMinutes}m
                        </span>
                        {/* Selected check */}
                        {roomConfig.bugBountyProblemId === problem.id && (
                          <CheckCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Validation hint */}
              {!roomConfig.bugBountyProblemId && (
                <p className="text-xs text-red-400 mt-2">Please select a bug bounty problem to continue.</p>
              )}
            </div>
          ) : (
          <div className="space-y-4">
            <label className="label py-0">
              <span className="label-text font-bold text-base">Select Problems</span>
              <span className="label-text-alt text-base-content/50 italic">{roomConfig.problems.length}/10 selected</span>
            </label>

            {/* Selected Pills (Reorderable) */}
            <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-xl bg-base-200/50 border border-dashed border-base-300">
              {roomConfig.problems.length === 0 && (
                <span className="text-sm text-base-content/30 flex items-center gap-2 px-2 py-1">
                  No problems selected yet.
                </span>
              )}
              <Reorder.Group axis="x" values={roomConfig.problems} onReorder={handleReorder} className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {roomConfig.problems.map((prob) => (
                    <Reorder.Item
                      key={prob.title}
                      value={prob}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-flex"
                    >
                      <div className="badge badge-lg gap-2 bg-base-100 border-base-300 py-4 pl-2 pr-1 shadow-sm group">
                        <GripVertical className="size-3.5 text-base-content/30 cursor-grab active:cursor-grabbing hover:text-primary transition-colors" />
                        <span className="font-bold text-sm">{prob.title}</span>
                        <button
                          onClick={() => handleRemoveProblem(prob.title)}
                          className="btn btn-ghost btn-circle btn-xs hover:bg-error/20 hover:text-error transition-all ml-1"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>

            {/* Search and List */}
            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search problems by name or difficulty..."
                  className="input input-bordered w-full pl-10 h-10 bg-base-200/50 focus:bg-base-100 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-base-300 bg-base-200/30">
                {filteredProblems.length === 0 ? (
                  <div className="p-8 text-center text-base-content/50 italic text-sm">
                    No matching problems found.
                  </div>
                ) : (
                  <div className="divide-y divide-base-300/50">
                    {filteredProblems.map((p) => {
                      const isSelected = roomConfig.problems.find(sp => sp.title === p.title);
                      return (
                        <div
                          key={p.id}
                          onClick={() => isSelected ? handleRemoveProblem(p.title) : handleSelectProblem(p)}
                          className={cn(
                            "flex items-center justify-between p-3 transition-all cursor-pointer",
                            isSelected
                              ? "bg-primary/5 hover:bg-primary/10"
                              : "hover:bg-primary/10"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "size-8 rounded-lg flex items-center justify-center transition-colors shadow-sm",
                              isSelected ? "bg-primary text-white" : "bg-base-100"
                            )}>
                              {isSelected ? <CheckCircle2 className="size-5" /> : <Code2Icon className="size-4" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm flex items-center gap-1.5">
                                {p.title}
                                {p._isCustom && <LockIcon className="size-3 opacity-40" />}
                              </span>
                              <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">{p._isCustom ? "Custom Problem" : "Built-in"}</span>
                            </div>
                          </div>
                          <span className={cn("badge badge-sm font-bold shadow-sm py-2", getDifficultyBadgeClass(p.difficulty))}>
                            {p.difficulty}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          )}

          {roomConfig.sessionType !== 'bug_bounty' && roomConfig.problems.length > 0 && (
            <div className="alert bg-success text-success-content border-none shadow-lg rounded-2xl p-5">
              <Code2Icon className="size-6 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="font-black text-xs uppercase tracking-[0.2em] opacity-80">Room Summary</p>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="font-bold opacity-70">Problems:</span>
                    <span className="font-black underline decoration-2 underline-offset-4">{roomConfig.problems.length} Selected</span>
                    <span className="opacity-60 text-xs font-medium">
                      ({roomConfig.problems.map(p => p.title).join(" → ")})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold opacity-70">Max Participants:</span>
                    <span className="font-black underline decoration-2 underline-offset-4">2 (1-on-1 session)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-base-200 border-t border-base-300 flex justify-end gap-3">
          <button className="btn btn-ghost font-bold rounded-xl px-6" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2 min-w-[140px] rounded-xl shadow-lg font-black uppercase tracking-widest text-xs"
            onClick={onCreateRoom}
            disabled={isCreating || (roomConfig.sessionType === 'bug_bounty' ? !roomConfig.bugBountyProblemId : roomConfig.problems.length === 0)}
          >
            {isCreating ? (
              <LoaderIcon className="size-4 animate-spin text-white" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            {isCreating ? "Creating..." : "Create Room"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};

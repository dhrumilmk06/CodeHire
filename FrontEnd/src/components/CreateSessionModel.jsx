import { useState, useMemo } from "react";
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
  CheckCircle2
} from "lucide-react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { getDifficultyBadgeClass, cn } from "../lib/utils";

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
          {/* MULTI-SELECT PICKER */}
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

          {/* ROOM SUMMARY */}
          {roomConfig.problems.length > 0 && (
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
            disabled={isCreating || roomConfig.problems.length === 0}
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

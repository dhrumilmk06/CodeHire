import { PROBLEMS } from "../data/problems";
import { useMyProblems } from "../hooks/useCustomProblems";
import { Code2Icon, LoaderIcon, PlusIcon, LockIcon } from "lucide-react";

export const CreateSessionModel = ({ isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) => {
  const builtInProblems = Object.values(PROBLEMS);
  const { data: customProblems = [] } = useMyProblems();

  // Merge both lists — custom first so they appear at the top
  const allProblems = [
    ...customProblems.map((p) => ({ ...p, _isCustom: true })),
    ...builtInProblems.map((p) => ({ ...p, _isCustom: false })),
  ];

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = allProblems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem?.difficulty || "Easy",
                  problem: e.target.value,
                });
              }}>
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {/* Custom problems group */}
              {customProblems.length > 0 && (
                <optgroup label="🔒 My Custom Problems">
                  {customProblems.map((problem) => (
                    <option key={problem._id} value={problem.title}>
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </optgroup>
              )}

              {/* Built-in problems group */}
              <optgroup label="📚 Built-in Problems">
                {builtInProblems.map((problem) => (
                  <option key={problem.id} value={problem.title}>
                    {problem.title} ({problem.difficulty})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="model-action mt-6">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}

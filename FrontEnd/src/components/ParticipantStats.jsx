import { TrophyIcon, Code2Icon, CalendarIcon } from "lucide-react";

export const ParticipantStats = ({ totalInterviews, avgScore, problemsSolved }) => {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6">
      {/* Total Interviews */}
      <div className="card bg-base-100 border-2 border-primary/20 hover:border-primary/40">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <CalendarIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="badge badge-primary">Total</div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mb-1">{totalInterviews}</div>
          <div className="text-[10px] sm:text-xs opacity-60 font-bold uppercase tracking-widest">Interviews</div>
        </div>
      </div>

      {/* Avg Score */}
      <div className="card bg-base-100 border-2 border-secondary/20 hover:border-secondary/40">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-secondary/10 rounded-2xl">
              <TrophyIcon className="w-7 h-7 text-secondary" />
            </div>
            <div className="badge badge-secondary">Avg Score</div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mb-1">{avgScore}%</div>
          <div className="text-[10px] sm:text-xs opacity-60 font-bold uppercase tracking-widest">Success Rate</div>
        </div>
      </div>

      {/* Problems Solved */}
      <div className="card bg-base-100 border-2 border-accent/20 hover:border-accent/40">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <Code2Icon className="w-7 h-7 text-accent" />
            </div>
            <div className="badge badge-accent">Solved</div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mb-1">{problemsSolved}</div>
          <div className="text-[10px] sm:text-xs opacity-60 font-bold uppercase tracking-widest">Solved</div>
        </div>
      </div>
    </div>
  );
}

export default ParticipantStats;

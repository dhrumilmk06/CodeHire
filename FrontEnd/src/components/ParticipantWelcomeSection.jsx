import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, VideoIcon } from "lucide-react";
import { Link } from "react-router";

export const ParticipantWelcomeSection = () => {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-xl text-base-content/60 ml-16">
              Track your process and ace your next technical interview.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ParticipantWelcomeSection;

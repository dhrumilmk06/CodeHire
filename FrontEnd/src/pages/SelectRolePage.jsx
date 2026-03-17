import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { TargetIcon, LaptopIcon, ArrowRightIcon, LoaderIcon } from "lucide-react";
import { userApi } from "../api/users";
import toast from "react-hot-toast";

export const SelectRolePage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null); // 'host' | 'participant' | null

  // Redirection logic: If already a Host or Admin, don't show this page
  useEffect(() => {
    if (isLoaded && user) {
        const role = user.publicMetadata?.role || user.role;
        if (role === 'admin') navigate("/admin");
        if (role === 'host') navigate("/dashboard");
        // If participant, we allow them to stay once to choose or if it's their first time
    }
  }, [isLoaded, user, navigate]);

  const handleRoleSelection = async (role) => {
    try {
      setLoading(role);
      await userApi.updateRole(role);
      
      // Sync Clerk user object so role is available immediately
      await user.reload();
      
      toast.success(`Welcome aboard as a ${role}!`);
      
      // Redirect based on role
      if (role === 'host') {
        navigate("/dashboard");
      } else {
        navigate("/my-interviews");
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to save role. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <LoaderIcon className="size-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-black mb-4 bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Welcome to CodeHire! 🎉
        </h1>
        <p className="text-zinc-400 text-lg font-medium">
          How will you use this platform today?
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* HOST CARD */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => !loading && handleRoleSelection('host')}
          className={`relative cursor-pointer group p-8 bg-[#111111] border-2 transition-all duration-300 rounded-3xl ${
            loading === 'host' ? 'border-primary shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-[#2a2a2a] hover:border-[#22c55e]'
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <TargetIcon className="size-10 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">I am an Interviewer</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Create coding sessions, manage custom problems, and evaluate candidates with auto-scoring.
              </p>
            </div>
            <div className={`flex items-center gap-2 font-bold text-sm ${loading === 'host' ? 'text-primary' : 'text-zinc-400 group-hover:text-primary'} transition-colors`}>
              {loading === 'host' ? (
                <LoaderIcon className="size-5 animate-spin" />
              ) : (
                <>
                  <span>Select Host Role</span>
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* PARTICIPANT CARD */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => !loading && handleRoleSelection('participant')}
          className={`relative cursor-pointer group p-8 bg-[#111111] border-2 transition-all duration-300 rounded-3xl ${
            loading === 'participant' ? 'border-secondary shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-[#2a2a2a] hover:border-[#22c55e]'
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="size-20 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <LaptopIcon className="size-10 text-secondary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">I am a Candidate</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Join interview sessions via link, solve live coding problems, and view your performance feedback.
              </p>
            </div>
            <div className={`flex items-center gap-2 font-bold text-sm ${loading === 'participant' ? 'text-secondary' : 'text-zinc-400 group-hover:text-[#22c55e]'} transition-colors`}>
              {loading === 'participant' ? (
                <LoaderIcon className="size-5 animate-spin text-secondary" />
              ) : (
                <>
                  <span>Select Candidate Role</span>
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <p className="mt-12 text-zinc-600 text-xs font-medium uppercase tracking-[0.2em]">
        Role selection is permanent and can only be changed by platform admins.
      </p>
    </div>
  );
};

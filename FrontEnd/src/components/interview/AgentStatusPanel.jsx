import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { Loader2Icon, BotIcon, BrainCircuitIcon, PlayIcon, SquareIcon, CheckCircle2Icon, AlertTriangleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AgentStatusPanel = ({ sessionId, roomId, isHost, socket }) => {
  const [agentActive, setAgentActive] = useState(false);
  const [hints, setHints] = useState([]);
  const [scoreUpdate, setScoreUpdate] = useState(null);
  const [timeWarning, setTimeWarning] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Track metrics
  const [hintsSuggestedCount, setHintsSuggestedCount] = useState(0);
  const [autoTestsRunCount, setAutoTestsRunCount] = useState(0);

  // Initial fetch for agent status
  useEffect(() => {
    if (!isHost || !sessionId) return;
    
    const fetchAgentStatus = async () => {
      try {
        const { data } = await axiosInstance.get(`/agent/status/${sessionId}`);
        if (data.success) {
          setAgentActive(data.agentActive);
          setHintsSuggestedCount(data.hintsGenerated || 0);
          setAutoTestsRunCount(data.autoTestsRun || 0);
          if (data.testCasesPassed) {
            setScoreUpdate({ scoreString: data.testCasesPassed });
          }
        }
      } catch (error) {
        console.error("Failed to fetch agent status:", error);
      }
    };
    
    fetchAgentStatus();
  }, [isHost, sessionId]);

  useEffect(() => {
    if (isHost && socket) {
      // Join host-specific room
      socket.emit('host:join-room', { sessionId });

      // Listeners
      const handleHintSuggestion = (data) => {
        setHints(prev => [...prev, data.hint]);
        setHintsSuggestedCount(prev => prev + 1);
        toast('Agent suggested a new hint!', { icon: '💡' });
      };

      const handleScoreUpdate = (data) => {
        setScoreUpdate({
          passed: data.testCasesPassed,
          total: data.total,
          scoreString: data.scoreString
        });
        setAutoTestsRunCount(prev => prev + 1);
      };

      const handleAutoScore = (data) => {
        if (data.sessionId == sessionId) { // Use non-strict equality to handle potential string/number mismatch
          setScoreUpdate({
            passed: data.score.passed,
            total: data.score.total,
            scoreString: `${data.score.passed}/${data.score.total}`
          });
        }
      };

      const handleTimeWarning = (data) => {
        setTimeWarning(true);
      };

      const handleSummaryReady = (data) => {
        setSummary(data.summary);
      };

      const handleAgentStarted = (data) => {
        setAgentActive(true);
      };

      const handleAgentStopped = (data) => {
        setAgentActive(false);
      };

      socket.on('agent:hint-suggestion', handleHintSuggestion);
      socket.on('agent:score-update', handleScoreUpdate);
      socket.on('autoScoreResults', handleAutoScore);
      socket.on('agent:time-warning', handleTimeWarning);
      socket.on('agent:summary-ready', handleSummaryReady);
      socket.on('agent:started', handleAgentStarted);
      socket.on('agent:stopped', handleAgentStopped);

      return () => {
        socket.emit('host:leave-room', { sessionId });
        socket.off('agent:hint-suggestion', handleHintSuggestion);
        socket.off('agent:score-update', handleScoreUpdate);
        socket.off('autoScoreResults', handleAutoScore);
        socket.off('agent:time-warning', handleTimeWarning);
        socket.off('agent:summary-ready', handleSummaryReady);
        socket.off('agent:started', handleAgentStarted);
        socket.off('agent:stopped', handleAgentStopped);
      };
    }
  }, [sessionId, isHost, socket]);

  if (!isHost) return null;

  const handleToggleAgent = async () => {
    setLoading(true);
    const endpoint = agentActive ? '/agent/stop' : '/agent/start';
    try {
      const { data } = await axiosInstance.post(endpoint, { sessionId });
      if (data.success) {
        setAgentActive(data.agentActive);
        if (data.agentActive) {
          toast.success("Agent started");
        } else {
          toast.success("Agent stopped");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to toggle agent");
      setLoading(false);
    } finally {
      // Small timeout to prevent flicker if socket is fast
      setTimeout(() => setLoading(false), 500);
    }
  };

  const dismissHint = (index) => {
    setHints(prev => prev.filter((_, i) => i !== index));
  };

  const sendHintToCandidate = (hintText, index) => {
    if (socket) {
      socket.emit('send-hint', {
        roomId: roomId, 
        sessionId,
        hint: hintText
      });
      toast.success("Hint sent to candidate!");
      dismissHint(index);
    }
  };

  return (
    <div className="bg-base-200 border border-base-300 rounded-xl overflow-hidden mt-4 shadow-sm flex flex-col">
      {/* HEADER */}
      <div className="bg-base-300 px-4 py-3 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuitIcon className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/80">Interview Agent</h3>
        </div>
        
        <button 
          onClick={handleToggleAgent}
          disabled={loading}
          className={`btn btn-sm ${agentActive ? 'btn-error' : 'btn-primary'} gap-2`}
        >
          {loading ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : agentActive ? (
            <>
              <SquareIcon className="w-4 h-4 fill-current" />
              Stop
            </>
          ) : (
            <>
              <PlayIcon className="w-4 h-4 fill-current" />
              Start
            </>
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* STATUS BAR */}
        <div className="flex items-center gap-3 bg-base-100 p-3 rounded-lg border border-base-200">
          <div className="relative flex h-3 w-3">
            {agentActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${agentActive ? 'bg-success' : 'bg-base-300'}`}></span>
          </div>
          <span className="text-sm font-medium text-base-content/80">
          {agentActive ? 'Active — checking every 1 min' : 'Inactive'}
          </span>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-base-100 border border-base-200 rounded-lg p-3 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-primary mb-1">
              {scoreUpdate ? scoreUpdate.scoreString : '0/0'}
            </span>
            <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Auto Score</span>
          </div>
          <div className="bg-base-100 border border-base-200 rounded-lg p-3 flex flex-col justify-center gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-base-content/60">Hints Suggested</span>
              <span className="font-bold">{hintsSuggestedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-base-content/60">Auto Tests</span>
              <span className="font-bold">{autoTestsRunCount}</span>
            </div>
          </div>
        </div>

        {/* TIME WARNING */}
        <AnimatePresence>
          {timeWarning && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-warning/20 border border-warning text-warning-content p-3 rounded-lg flex items-start gap-3"
            >
              <AlertTriangleIcon className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">TIME WARNING</p>
                <p className="text-xs opacity-90 mt-1">~15 minutes remaining!</p>
              </div>
              <button 
                onClick={() => setTimeWarning(false)}
                className="ml-auto text-warning hover:opacity-70"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HINT SUGGESTIONS */}
        {hints.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-base-content/50 uppercase tracking-widest px-1">
              Hint Suggestions
            </h4>
            <div className="space-y-2">
              <AnimatePresence>
                {hints.map((hint, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-base-100 border border-primary/30 rounded-lg p-3 shadow-sm relative group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <p className="text-sm text-base-content/90 italic leading-relaxed">"{hint}"</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-base-200">
                      <button 
                        onClick={() => dismissHint(index)}
                        className="btn btn-xs btn-ghost text-base-content/50 hover:text-error flex-1"
                      >
                        Dismiss
                      </button>
                      <button 
                        onClick={() => sendHintToCandidate(hint, index)}
                        className="btn btn-xs btn-primary btn-outline flex-1"
                      >
                        Send to Candidate
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* FINAL SUMMARY */}
        {summary && (
          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2 text-success">
              <CheckCircle2Icon className="w-4 h-4" />
              <h4 className="font-bold text-sm">Session Summary Generated</h4>
            </div>
            <p className="text-xs text-base-content/80 leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

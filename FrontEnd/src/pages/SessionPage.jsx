import { useUser } from '@clerk/clerk-react';
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useEndSession, useJoinSession, useSessionById } from '../hooks/useSessions';
import { PROBLEMS } from '../data/problems';
import { executeCode } from '../lib/piston';

import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { OutputPanel } from '../components/OutputPanel';
import { useStreamClient } from '../hooks/useStreamClient'
import { StreamCall, StreamVideo } from '@stream-io/video-react-sdk';
import { VideoCallUI } from '../components/VideoCallUI';
import { useCollabEditor } from '../hooks/useCollabEditor';
import { LiveNotesPanel } from '../components/LiveNotesPanel';
import { TimeTracker } from '../components/TimeTracker';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { sessionApi } from '../api/sessions';
import { toast } from 'react-hot-toast';

export const SessionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isProblemLoading, setIsProblemLoading] = useState(false);

  // Track remote typing state for the indicator
  const remoteTypingTimer = useRef(null);
  const lastProblemRef = useRef(null);
  const [remoteUser, setRemoteUser] = useState(null);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession()
  const endSessionMutation = useEndSession()

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  )

  // Find the problem data — first check built-in problems, then fetch custom by title
  const builtInProblem = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  // Fetch custom problem by title from the server (works for ALL users, not just the owner)
  const { data: customProblemData } = useQuery({
    queryKey: ["custom-problem-by-title", session?.problem],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/problems/find?title=${encodeURIComponent(session.problem)}`);
      return data.problem;
    },
    // Only fetch if session has a problem title AND it's not a built-in problem
    enabled: !!session?.problem && !builtInProblem,
    retry: false, // Don't retry on 404 (means it's not a custom problem)
  });

  const problemData = builtInProblem ?? customProblemData ?? null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  // ── Collaborative Editor ─────────────────────────────────────────────────
  // We use the session's callId as the collab room ID
  const roomId = session?.callId;
  const role = isHost ? "host" : "participant";

  // Remote user info for the typing indicator
  const getRemoteName = () => {
    if (isHost) return session?.participant?.name || "Participant";
    return session?.host?.name || "Host";
  };
  const getRemoteRole = () => (isHost ? "participant" : "host");

  const showRemoteTyping = () => {
    setRemoteUser({ name: getRemoteName(), role: getRemoteRole() });
    // Clear from display after 2s of no activity
    clearTimeout(remoteTypingTimer.current);
    remoteTypingTimer.current = setTimeout(() => setRemoteUser(null), 2000);
  };

  const [socketConnected, setSocketConnected] = useState(false);

  const { emitCodeChange, emitLanguageChange, emitOutputUpdate, emitProblemChange } = useCollabEditor({
    roomId,
    userId: user?.id,
    role,
    onCodeChange: (remoteCode, remoteLang) => {
      showRemoteTyping();
      setCode(remoteCode);
      if (remoteLang && remoteLang !== selectedLanguage) {
        setSelectedLanguage(remoteLang);
      }
    },
    onProblemChange: (problemTitle, difficulty) => {
      setIsProblemLoading(true);
      setTimeout(() => {
        setIsProblemLoading(false);
        refetch(); // Fetch latest session state to update problem desc
      }, 3000);
    },
    onLanguageChange: (remoteLang, remoteCode) => {
      showRemoteTyping();
      setSelectedLanguage(remoteLang);
      if (remoteCode !== undefined) setCode(remoteCode);
    },
    onOutputUpdate: (remoteOutput) => {
      setOutput(remoteOutput);
    },
  });

  // Detect socket connected state by checking if roomId+userId are available
  useEffect(() => {
    setSocketConnected(!!(roomId && user?.id));
  }, [roomId, user?.id]);
  // ────────────────────────────────────────────────────────────────────────

  // Auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return

    joinSessionMutation.mutate(id, { onSuccess: refetch })
  }, [session, user, loadingSession, isHost, isParticipant, id])

  // Redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate])

  // Update code when problem loads or changes
  useEffect(() => {
    if (!problemData) return;

    // Reset editor if it's a completely new problem we haven't seen in this state session
    if (lastProblemRef.current !== problemData.title) {
      lastProblemRef.current = problemData.title;
      // Only set starter code if we don't already have content in the editor 
      // (restored code from handleProblemSwitch will take priority)
      if (!code || code === "") {
        if (problemData?.starterCode?.[selectedLanguage]) {
          setCode(problemData.starterCode[selectedLanguage]);
        }
      }
    }
  }, [problemData, selectedLanguage, code]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setSelectedLanguage(newLang);
    setCode(starterCode);
    setOutput(null);
    // Broadcast language + new starter code to partner
    emitLanguageChange(newLang, starterCode);
  }

  const handleCodeChange = (value) => {
    setCode(value);
    // Broadcast every keystroke to partner
    emitCodeChange(value, selectedLanguage);
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    // Broadcast the output so partner sees it too
    emitOutputUpdate(result);
  }

  const handleProblemSwitch = async (newProblem) => {
    if (!isHost || isProblemLoading) return;
    if (!newProblem || newProblem.title === session.problem) return;

    console.log(`[Switch] Switching to: ${newProblem.title}`);
    try {
      setIsProblemLoading(true);

      // Save current code
      await sessionApi.updateActiveProblem(id, {
        problemTitle: newProblem.title,
        difficulty: newProblem.difficulty,
        codeToSave: code,
        previousProblemTitle: session.problem
      });

      // Clear current state to prepare for new problem
      setCode("");
      setOutput(null);
      emitCodeChange("", selectedLanguage);
      emitOutputUpdate(null);

      // Fetch the saved code for the NEW problem (if any)
      const { code: restoredCode } = await sessionApi.getProblemCode(id, newProblem.title);
      console.log(`[Switch] Restored code for ${newProblem.title} exists:`, !!restoredCode);

      // If there's saved code, use it. Otherwise use the new problem's starter code.
      if (restoredCode) {
        setCode(restoredCode);
        emitCodeChange(restoredCode, selectedLanguage);
      } else {
        // Fallback: Manually set starter code if no saved code exists
        // (This helps the editor update immediately without waiting for useEffect)
        const nextBuiltIn = Object.values(PROBLEMS).find((p) => p.title === newProblem.title);
        const nextStarter = nextBuiltIn?.starterCode?.[selectedLanguage] || "";
        if (nextStarter) {
          console.log(`[Switch] Applied starter code for ${newProblem.title}`);
          setCode(nextStarter);
          emitCodeChange(nextStarter, selectedLanguage);
        }
      }

      // Broadcast switch to candidate
      emitProblemChange(newProblem.title, newProblem.difficulty);

      await refetch();
      console.log("[Switch] Refetch completed");

      toast.success(`Switched to: ${newProblem.title}`);

      // Delay for candidate sync and visual effect
      setTimeout(() => {
        setIsProblemLoading(false);
      }, 2500); // 2.5s delay
    } catch (error) {
      console.error("[Switch] Failed to switch problem:", error);
      toast.error(error.response?.data?.message || "Failed to switch problem");
      setIsProblemLoading(false);
    }
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate('/dashboard') })
    }
  }

  return (
    <div className='h-screen bg-base-100 flex flex-col'>
      <div className='flex-1'>
        <PanelGroup direction='horizontal'>
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DESCRIPTION PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  {/* Header */}
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base-content/60 mt-1">{problemData.category}</p>
                        )}
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {isHost && session && session.status === "active" && (
                          <TimeTracker
                            sessionId={id}
                            currentProblemTitle={session.problem}
                            initialTimings={session.timings}
                          />
                        )}
                        <span
                          className={`badge badge-lg ${getDifficultyBadgeClass(session?.difficulty)}`}
                        >
                          {session?.difficulty?.slice(0, 1).toUpperCase() +
                            session?.difficulty?.slice(1) || "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="badge badge-ghost badge-lg">Completed</span>
                        )}
                      </div>
                    </div>

                    {/* Problem Navigation Tabs (Host Only) */}
                    {isHost && session?.problems && session.problems.length > 1 && (
                      <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
                        <div className="flex items-center gap-2">
                          {session.problems.map((p, idx) => {
                            const isActive = p.title === session.problem;
                            // A problem is "completed" if its index is less than the active one
                            const activeIdx = session.problems.findIndex(sp => sp.title === session.problem);
                            const isCompleted = idx < activeIdx;

                            return (
                              <button
                                key={idx}
                                onClick={() => handleProblemSwitch(p)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap border-2 ${isActive
                                  ? "bg-success/10 border-success text-success shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                                  : isCompleted
                                    ? "bg-base-200 border-base-300 text-base-content/50 hover:bg-base-300"
                                    : "bg-base-100 border-transparent text-base-content/30 hover:bg-base-200"
                                  }`}
                              >
                                <span className="opacity-50">{idx + 1}.</span>
                                {p.title}
                                {isCompleted && <span className="text-success">✓</span>}
                                {isActive && <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>}
                              </button>
                            );
                          })}
                        </div>

                        {(() => {
                          const activeIdx = session.problems.findIndex(sp => sp.title === session.problem);
                          const nextProblem = session.problems[activeIdx + 1];
                          if (!nextProblem) return null;

                          return (
                            <button
                              onClick={() => {
                                console.log(`[NextBtn] Index: ${activeIdx}, Next: ${nextProblem.title}`);
                                handleProblemSwitch(nextProblem);
                              }}
                              className="btn btn-primary btn-sm gap-2 whitespace-nowrap px-6 h-10 shadow-[0_0_20px_rgba(var(--p),0.3)] hover:shadow-[0_0_30px_rgba(var(--p),0.5)] hover:scale-105 active:scale-95 transition-all duration-300 group font-black uppercase tracking-[0.2em] text-[11px] border-none"
                            >
                              NEXT PROBLEM
                              <span className="group-hover:translate-x-1 transition-transform text-lg">→</span>
                            </button>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Problem Description */}
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                        <div className="space-y-3 text-base leading-relaxed">
                          <p className="text-base-content/90">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-base-content/90">{note}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Examples */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>
                        <div className="space-y-4">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-sm">{idx + 1}</span>
                                <p className="font-semibold text-base-content">Example {idx + 1}</p>
                              </div>
                              <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-primary font-bold min-w-[70px]">Input:</span>
                                  <span>{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                                  <span>{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-2">
                                    <span className="text-base-content/60 font-sans text-xs">
                                      <span className="font-semibold">Explanation:</span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                        <ul className="space-y-2 text-base-content/90">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <code className="text-sm">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* CODE EDITOR PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={handleCodeChange}
                      onRunCode={handleRunCode}
                      isConnected={socketConnected}
                      remoteUser={remoteUser}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALL & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className='h-full bg-base-200 p-4 overflow-auto'>
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='h-full'>
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Host-only floating notes panel — rendered outside the panel layout so it never displaces existing UI */}
      {isHost && <LiveNotesPanel sessionId={id} />}

      {/* NEW PROBLEM LOADING OVERLAY */}
      {isProblemLoading && (
        <div className="fixed inset-0 z-9999 bg-base-300/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="size-20 border-4 border-success/20 border-t-success rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-3 w-3 rounded-full bg-success animate-ping"></span>
              </div>
            </div>
            <h2 className="text-3xl font-black text-base-content uppercase tracking-[0.3em]">New Problem Loading...</h2>
            <p className="text-base-content/50 font-medium">Please wait while the host switches the problem</p>
          </div>
        </div>
      )}
    </div>
  )
}

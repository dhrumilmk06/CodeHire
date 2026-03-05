import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { sessionApi } from '../api/sessions';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const TimeTracker = ({ sessionId, currentProblemTitle, initialTimings = [] }) => {
    const [timings, setTimings] = useState(initialTimings || []);
    const [activeElapsed, setActiveElapsed] = useState(0);
    const timerRef = useRef(null);
    const timingsRef = useRef(initialTimings || []);

    // Sync from props if they change (e.g. initial load from server)
    // Only update if prop data has more entries or different "completed" states
    // to avoid overwriting local fresh additions during problem switches.
    useEffect(() => {
        if (initialTimings && Array.isArray(initialTimings)) {
            const hasMoreData = initialTimings.length > timings.length;
            const hasStatusChange = initialTimings.some((t, i) => t.endTime && !timings[i]?.endTime);

            if (hasMoreData || hasStatusChange || timings.length === 0) {
                setTimings(initialTimings);
            }
        }
    }, [initialTimings]);

    const saveTimings = async (updatedTimings) => {
        try {
            await sessionApi.updateTimings(sessionId, updatedTimings);
        } catch (error) {
            console.error("Failed to save timings:", error);
        }
    };

    useEffect(() => {
        if (!currentProblemTitle || !sessionId) return;

        let activeStartTime = null;

        setTimings(prev => {
            let localTimings = [...prev];
            let activeIndex = localTimings.findIndex(t => !t.endTime);
            let activeEntry = activeIndex !== -1 ? localTimings[activeIndex] : null;

            // 1. If we are on the correct problem already, just grab the start time for the ticker
            if (activeEntry && activeEntry.problemId === currentProblemTitle) {
                activeStartTime = new Date(activeEntry.startTime).getTime();
                return prev;
            }

            const now = new Date();

            // 2. If changing problems, close the old one
            if (activeEntry) {
                const duration = Math.floor((now - new Date(activeEntry.startTime)) / 1000);
                localTimings[activeIndex] = { ...activeEntry, endTime: now, duration };
            }

            // 3. Start the brand new problem entry
            const newEntry = {
                problemId: currentProblemTitle,
                startTime: now,
                endTime: null,
                duration: null
            };
            localTimings.push(newEntry);
            activeStartTime = now.getTime();

            saveTimings(localTimings);
            return localTimings;
        });

        // Ticker logic: Always calculate based on the REAL start time stored in the record
        // This ensures that if you refresh, (Date.now() - activeStartTime) reflects the real progress.
        if (timerRef.current) clearInterval(timerRef.current);

        const runTicker = () => {
            if (activeStartTime) {
                const seconds = Math.floor((Date.now() - activeStartTime) / 1000);
                setActiveElapsed(Math.max(0, seconds));
            }
        };

        runTicker(); // Run once immediately
        timerRef.current = setInterval(runTicker, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentProblemTitle, sessionId]);

    const totalSeconds = timings.reduce((acc, t) => {
        if (t.endTime) return acc + (t.duration || 0);
        if (t.problemId === currentProblemTitle) return acc + activeElapsed;
        return acc;
    }, 0);

    return (
        <div className="dropdown dropdown-bottom dropdown-end group">
            <div
                tabIndex={0}
                role="button"
                className="badge badge-lg gap-2 cursor-pointer bg-base-300 border-base-300 text-success font-mono hover:bg-base-200 transition-colors py-5 px-4 shadow-sm"
            >
                <Clock className="w-4 h-4" />
                <span className="font-bold underline decoration-dotted underline-offset-4 tracking-tight">
                    {formatTime(activeElapsed)}
                </span>
            </div>

            <div
                tabIndex={0}
                className="dropdown-content z-50 menu p-4 shadow-2xl bg-base-100 rounded-xl border border-base-300 w-80 mt-2 animate-in fade-in slide-in-from-top-2 duration-200"
            >
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40">Timing Breakdown</h3>
                    <div className="badge badge-success badge-outline badge-xs text-[10px] font-bold py-2">Session Live</div>
                </div>

                <div className="space-y-1 mb-4 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-base-300">
                    {(() => {
                        // Group timings by problemId for a cleaner single-problem display
                        const groups = timings.reduce((acc, t) => {
                            if (!acc[t.problemId]) {
                                acc[t.problemId] = {
                                    problemId: t.problemId,
                                    totalDuration: 0,
                                    isActive: false
                                };
                            }
                            if (t.endTime) {
                                acc[t.problemId].totalDuration += (t.duration || 0);
                            } else {
                                acc[t.problemId].isActive = true;
                            }
                            return acc;
                        }, {});

                        return Object.values(groups).map((group, idx) => {
                            const isLive = group.isActive && group.problemId === currentProblemTitle;
                            const displayDuration = isLive
                                ? group.totalDuration + activeElapsed
                                : group.totalDuration;

                            return (
                                <div key={idx} className="flex items-center justify-between text-sm p-2.5 rounded-lg border border-transparent hover:border-base-300 hover:bg-base-200/50 transition-all duration-200">
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className={`font-bold truncate transition-colors ${group.isActive ? 'text-success' : 'text-base-content/70'}`}>
                                            {group.problemId} {isLive && '— (live)'}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {group.isActive ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-success animate-ping"></span>
                                                    <span className="text-[10px] text-success uppercase font-extrabold tracking-widest">Active</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-base-content/40 uppercase font-bold tracking-tighter flex items-center gap-1">
                                                    Completed <span className="text-success">✓</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`font-mono font-bold text-base ${group.isActive ? 'text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'text-base-content/60'}`}>
                                        {formatTime(displayDuration)}
                                    </span>
                                </div>
                            );
                        });
                    })()}
                </div>

                <div className="pt-4 border-t border-base-300 flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-widest">Total Session Time</span>
                    <span className="text-lg font-black text-success font-mono leading-none tracking-tight">
                        Total: {formatTime(totalSeconds)}
                    </span>
                </div>
            </div>
        </div>
    );
};

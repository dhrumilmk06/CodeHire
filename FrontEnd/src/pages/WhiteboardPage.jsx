import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { useSessionById } from '../hooks/useSessions';
import { whiteboardApi } from '../api/whiteboard';
import { WhiteboardSnapshots } from '../components/whiteboard/WhiteboardSnapshots';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon, Loader2Icon, MonitorIcon } from 'lucide-react';

export const WhiteboardPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const snapshotsRef = useRef(null); // ref to trigger list refresh

    const { data: sessionData, isLoading: loadingSession } = useSessionById(sessionId);
    const session = sessionData?.session;

    const isHost = session?.host?.clerkId === user?.id;
    const userRole = isHost ? 'host' : 'participant';

    // ── Snapshot Save Logic ────────────────────────────────────────────────
    // Called by both the top bar button and the sidebar's "Save Current"
    const handleSaveSnapshot = useCallback(async ({ label = 'Snapshot' } = {}) => {
        if (!excalidrawAPI) {
            toast.error('Whiteboard not ready yet');
            return;
        }
        setIsSaving(true);
        try {
            // 1. Export canvas to PNG blob
            const blob = await excalidrawAPI.exportToBlob({
                mimeType: 'image/png',
                quality: 0.85,
                exportPadding: 16,
            });

            // 2. Convert blob → base64 data URI
            const imageData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            // 3. Capture scene elements for later restore
            const elements = excalidrawAPI.getSceneElements();
            const excalidrawData = JSON.stringify(elements);

            // 4. POST to backend
            const res = await whiteboardApi.saveSnapshot(sessionId, {
                imageData,
                excalidrawData,
                label,
            });

            toast.success(`Snapshot saved: ${label}`);
            return res.data; // Return so sidebar can refresh
        } catch (err) {
            console.error('[Whiteboard] Save snapshot failed:', err);
            toast.error('Failed to save snapshot');
            throw err; // Re-throw so sidebar knows it failed
        } finally {
            setIsSaving(false);
        }
    }, [excalidrawAPI, sessionId]);

    // ── Sidebar action handler (save OR restore) ──────────────────────────
    const handleSnapshotAction = useCallback(async ({ action, label, snapshot }) => {
        if (action === 'save') {
            return handleSaveSnapshot({ label });
        }

        if (action === 'restore' && snapshot) {
            if (!excalidrawAPI) return;
            try {
                const elements = JSON.parse(snapshot.excalidrawData || '[]');
                excalidrawAPI.updateScene({ elements });
                toast.success('Scene restored');
            } catch (err) {
                console.error('[Whiteboard] Restore failed:', err);
                toast.error('Failed to restore snapshot');
            }
        }
    }, [excalidrawAPI, handleSaveSnapshot]);

    if (loadingSession) {
        return (
            <div className="h-screen bg-gray-950 flex items-center justify-center">
                <Loader2Icon className="w-10 h-10 animate-spin text-violet-400" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="h-screen bg-gray-950 flex items-center justify-center text-white">
                Session not found.
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
            {/* ── Top Bar ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-700 shrink-0">
                {/* Left: Session info */}
                <div className="flex items-center gap-3 min-w-0">
                    <MonitorIcon className="w-5 h-5 text-violet-400 shrink-0" />
                    <div className="min-w-0">
                        <h1 className="text-white font-bold text-sm truncate">
                            System Design Whiteboard
                        </h1>
                        <p className="text-gray-400 text-xs truncate">
                            {session.host?.name}
                            {session.participant ? ` · ${session.participant.name}` : ''}
                            <span className="ml-2 text-violet-400 font-bold uppercase text-[10px]">
                                {userRole}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => handleSaveSnapshot({ label: 'Quick Save' })}
                        disabled={isSaving || !excalidrawAPI}
                        className="btn btn-sm bg-violet-600 hover:bg-violet-500 border-none text-white gap-2 rounded-lg font-bold disabled:opacity-50"
                        id="whiteboard-save-snapshot-btn"
                    >
                        {isSaving
                            ? <Loader2Icon className="w-4 h-4 animate-spin" />
                            : '📸'
                        }
                        Save Snapshot
                    </button>

                    <button
                        onClick={() => navigate(`/session/${sessionId}`)}
                        className="btn btn-sm bg-gray-700 hover:bg-gray-600 border-none text-gray-200 gap-2 rounded-lg font-bold"
                        id="whiteboard-back-btn"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Code
                    </button>
                </div>
            </div>

            {/* ── Main Content: Canvas + Sidebar ──────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">
                {/* Excalidraw Canvas */}
                <div className="flex-1 overflow-hidden">
                    <Excalidraw
                        excalidrawAPI={(api) => setExcalidrawAPI(api)}
                        UIOptions={{
                            canvasActions: {
                                export: { saveFileToDisk: true },
                                loadScene: true,
                            },
                        }}
                        theme="dark"
                    />
                </div>

                {/* Snapshots Sidebar */}
                <WhiteboardSnapshots
                    ref={snapshotsRef}
                    sessionId={sessionId}
                    onRestore={handleSnapshotAction}
                    userRole={userRole}
                />
            </div>
        </div>
    );
};

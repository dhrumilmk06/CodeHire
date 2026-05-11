import { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, RotateCcw, Loader2, PlusIcon, X } from 'lucide-react';
import { whiteboardApi } from '../../api/whiteboard';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const WhiteboardSnapshots = ({ sessionId, onRestore, userRole }) => {
    const [snapshots, setSnapshots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [labelInput, setLabelInput] = useState('');
    const [showLabelInput, setShowLabelInput] = useState(false);
    const labelRef = useRef(null);

    const isHost = userRole === 'host' || userRole === 'admin';

    const fetchSnapshots = async () => {
        try {
            setIsLoading(true);
            const res = await whiteboardApi.getSnapshots(sessionId);
            setSnapshots(res.data || []);
        } catch (err) {
            console.error('[Whiteboard] Failed to fetch snapshots:', err);
            toast.error('Failed to load snapshots');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) fetchSnapshots();
    }, [sessionId]);

    // Focus label input when it shows
    useEffect(() => {
        if (showLabelInput && labelRef.current) {
            labelRef.current.focus();
        }
    }, [showLabelInput]);

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            // Trigger parent to export the canvas, passing the label
            await onRestore({ action: 'save', label: labelInput.trim() || 'Snapshot' });
            setLabelInput('');
            setShowLabelInput(false);
            // Refresh the list after save
            await fetchSnapshots();
        } catch (err) {
            toast.error('Failed to save snapshot');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRestore = async (snapshot) => {
        try {
            const res = await whiteboardApi.getSnapshotById(sessionId, snapshot.id);
            onRestore({ action: 'restore', snapshot: res.data });
            toast.success(`Restored: ${snapshot.label || 'Snapshot'}`);
        } catch (err) {
            toast.error('Failed to restore snapshot');
        }
    };

    const handleDelete = async (snapshot) => {
        if (!isHost) return;
        try {
            await whiteboardApi.deleteSnapshot(sessionId, snapshot.id);
            setSnapshots(prev => prev.filter(s => s.id !== snapshot.id));
            toast.success('Snapshot deleted');
        } catch (err) {
            toast.error('Failed to delete snapshot');
        }
    };

    const formatTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 border-l border-gray-700 w-72 min-w-[288px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-violet-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Snapshots</h3>
                        <span className="badge badge-sm bg-violet-500/20 text-violet-300 border-violet-500/30 font-bold">
                            {snapshots.length}
                        </span>
                    </div>
                </div>

                {/* Save Controls */}
                <AnimatePresence mode="wait">
                    {!showLabelInput ? (
                        <motion.button
                            key="show-btn"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            onClick={() => setShowLabelInput(true)}
                            className="w-full btn btn-sm bg-violet-600 hover:bg-violet-500 border-none text-white gap-2 rounded-lg font-bold"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Save Current
                        </motion.button>
                    ) : (
                        <motion.div
                            key="label-input"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    ref={labelRef}
                                    type="text"
                                    value={labelInput}
                                    onChange={e => setLabelInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                                    placeholder="Label (optional)"
                                    className="input input-sm flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-violet-500 rounded-lg text-sm"
                                />
                                <button
                                    onClick={() => { setShowLabelInput(false); setLabelInput(''); }}
                                    className="btn btn-sm btn-ghost btn-circle text-gray-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full btn btn-sm bg-violet-600 hover:bg-violet-500 border-none text-white gap-2 rounded-lg font-bold"
                            >
                                {isSaving
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Camera className="w-4 h-4" />
                                }
                                {isSaving ? 'Saving...' : 'Confirm Save'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Snapshot List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                    </div>
                ) : snapshots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                        <Camera className="w-10 h-10 text-gray-600" />
                        <p className="text-gray-500 text-sm font-medium">No snapshots yet.</p>
                        <p className="text-gray-600 text-xs">Click "Save Current" to capture the whiteboard.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {snapshots.map((snap, i) => (
                            <motion.div
                                key={snap.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: i * 0.04 }}
                                className="group bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all duration-200"
                            >
                                {/* Thumbnail — lazy loaded */}
                                {snap.imageData && (
                                    <div className="w-full h-24 bg-gray-900 overflow-hidden">
                                        <img
                                            src={snap.imageData}
                                            alt={snap.label || `Snapshot ${i + 1}`}
                                            loading="lazy"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                {/* Meta + Actions */}
                                <div className="p-2.5">
                                    <div className="flex items-start justify-between gap-1 mb-2">
                                        <div className="min-w-0">
                                            <p className="text-white text-xs font-bold truncate">
                                                {snap.label || `Snapshot ${i + 1}`}
                                            </p>
                                            <p className="text-gray-500 text-[10px] mt-0.5">
                                                {formatTime(snap.createdAt)}
                                            </p>
                                        </div>
                                        {snap.aiScore != null && (
                                            <span className={`badge badge-sm font-bold shrink-0 border-0 ${
                                                snap.aiScore >= 75 ? 'bg-green-500/20 text-green-400' :
                                                snap.aiScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {snap.aiScore}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => handleRestore(snap)}
                                            className="flex-1 btn btn-xs bg-gray-700 hover:bg-violet-600 border-none text-gray-300 hover:text-white gap-1 rounded-lg transition-all"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            Restore
                                        </button>
                                        {isHost && (
                                            <button
                                                onClick={() => handleDelete(snap)}
                                                className="btn btn-xs bg-gray-700 hover:bg-red-600/70 border-none text-gray-400 hover:text-white rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

import { useEffect, useCallback } from "react";

/**
 * Hook to manage real-time collaborative editor state via Socket.io.
 *
 * This hook no longer creates its own socket connection. It expects a socket
 * instance from SessionContext (via useSessionSocket) to be passed in, so the
 * connection survives navigation between SessionPage and WhiteboardPage.
 *
 * @param {object} params
 * @param {object} params.socket          - Socket.io instance from SessionContext
 * @param {string} params.roomId          - The session's callId used as the Socket room
 * @param {function} params.onCodeChange     - Called when remote user changes code
 * @param {function} params.onLanguageChange - Called when remote user changes language
 * @param {function} params.onOutputUpdate   - Called when remote user runs code
 * @param {function} params.onProblemChange  - Called when host switches problem
 */
export const useCollabEditor = ({
    socket,
    roomId,
    onCodeChange,
    onLanguageChange,
    onOutputUpdate,
    onProblemChange,
}) => {
    useEffect(() => {
        if (!socket || !roomId) return;

        // Remote participant changed code
        const handleCodeChange = ({ code, language }) => {
            onCodeChange?.(code, language);
        };

        // Remote participant changed language
        const handleLanguageChange = ({ language, code }) => {
            onLanguageChange?.(language, code);
        };

        // Remote participant ran code — sync output
        const handleOutputUpdate = ({ output }) => {
            onOutputUpdate?.(output);
        };

        // Remote host changed problem
        const handleProblemChange = ({ problemTitle, difficulty }) => {
            onProblemChange?.(problemTitle, difficulty);
        };

        // New joiner receives current room state
        const handleSyncState = ({ code, language, output }) => {
            if (code !== undefined) onCodeChange?.(code, language);
            if (output !== undefined) onOutputUpdate?.(output);
        };

        // Session rejoined — restore state
        const handleSessionRejoined = ({ code, language }) => {
            if (code !== undefined) onCodeChange?.(code, language);
        };

        socket.on("code-change", handleCodeChange);
        socket.on("language-change", handleLanguageChange);
        socket.on("output-update", handleOutputUpdate);
        socket.on("problem-change", handleProblemChange);
        socket.on("sync-state", handleSyncState);
        socket.on("session-rejoined", handleSessionRejoined);

        return () => {
            socket.off("code-change", handleCodeChange);
            socket.off("language-change", handleLanguageChange);
            socket.off("output-update", handleOutputUpdate);
            socket.off("problem-change", handleProblemChange);
            socket.off("sync-state", handleSyncState);
            socket.off("session-rejoined", handleSessionRejoined);
        };
    }, [socket, roomId, onCodeChange, onLanguageChange, onOutputUpdate, onProblemChange]);

    /** Emit a code change to all other participants */
    const emitCodeChange = useCallback((code, language) => {
        socket?.emit("code-change", { roomId, code, language });
    }, [roomId, socket]);

    /** Emit a language change to all other participants */
    const emitLanguageChange = useCallback((language, code) => {
        socket?.emit("language-change", { roomId, language, code });
    }, [roomId, socket]);

    /** Emit the run-output to all other participants */
    const emitOutputUpdate = useCallback((output) => {
        socket?.emit("output-update", { roomId, output });
    }, [roomId, socket]);

    /** Emit a problem switch to all other participants */
    const emitProblemChange = useCallback((problemTitle, difficulty) => {
        socket?.emit("problem-change", { roomId, problemTitle, difficulty });
    }, [roomId, socket]);

    return {
        emitCodeChange,
        emitLanguageChange,
        emitOutputUpdate,
        emitProblemChange,
    };
};

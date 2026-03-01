import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";

// Relative URL — Vite proxy forwards /socket.io → backend:3000
const SOCKET_URL = "/";

/**
 * Hook to manage real-time collaborative editor state via Socket.io.
 *
 * @param {object} params
 * @param {string} params.roomId      - The session's callId used as the Socket room
 * @param {string} params.userId      - Current user's clerk ID
 * @param {string} params.role        - "host" | "participant"
 * @param {function} params.onCodeChange     - Called when remote user changes code: (code, language) => void
 * @param {function} params.onLanguageChange - Called when remote user changes language: (language, code) => void
 * @param {function} params.onOutputUpdate   - Called when remote user runs code: (output) => void
 */
export const useCollabEditor = ({
    roomId,
    userId,
    role,
    onCodeChange,
    onLanguageChange,
    onOutputUpdate,
    onProblemChange,
}) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!roomId || !userId) return;

        const s = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        setSocket(s);

        s.on("connect", () => {
            s.emit("join-room", { roomId, userId, role });
        });

        // Remote participant changed code
        s.on("code-change", ({ code, language }) => {
            onCodeChange?.(code, language);
        });

        // Remote participant changed language
        s.on("language-change", ({ language, code }) => {
            onLanguageChange?.(language, code);
        });

        // Remote participant ran code — sync output
        s.on("output-update", ({ output }) => {
            onOutputUpdate?.(output);
        });

        // Remote host changed problem
        s.on("problem-change", ({ problemTitle, difficulty }) => {
            onProblemChange?.(problemTitle, difficulty);
        });

        // New joiner receives current room state
        s.on("sync-state", ({ code, language, output }) => {
            if (code !== undefined) onCodeChange?.(code, language);
            if (output !== undefined) onOutputUpdate?.(output);
        });

        return () => {
            s.disconnect();
            setSocket(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, userId, role]);

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
        socket
    };
};

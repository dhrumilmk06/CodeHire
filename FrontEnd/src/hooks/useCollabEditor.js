import { useEffect, useRef, useCallback } from "react";
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
}) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!roomId || !userId) return;

        const socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join-room", { roomId, userId, role });
        });

        // Remote participant changed code
        socket.on("code-change", ({ code, language }) => {
            onCodeChange?.(code, language);
        });

        // Remote participant changed language
        socket.on("language-change", ({ language, code }) => {
            onLanguageChange?.(language, code);
        });

        // Remote participant ran code — sync output
        socket.on("output-update", ({ output }) => {
            onOutputUpdate?.(output);
        });

        // New joiner receives current room state
        socket.on("sync-state", ({ code, language, output }) => {
            if (code !== undefined) onCodeChange?.(code, language);
            if (output !== undefined) onOutputUpdate?.(output);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, userId, role]);

    /** Emit a code change to all other participants */
    const emitCodeChange = useCallback((code, language) => {
        socketRef.current?.emit("code-change", { roomId, code, language });
    }, [roomId]);

    /** Emit a language change to all other participants */
    const emitLanguageChange = useCallback((language, code) => {
        socketRef.current?.emit("language-change", { roomId, language, code });
    }, [roomId]);

    /** Emit the run-output to all other participants */
    const emitOutputUpdate = useCallback((output) => {
        socketRef.current?.emit("output-update", { roomId, output });
    }, [roomId]);

    return { emitCodeChange, emitLanguageChange, emitOutputUpdate };
};

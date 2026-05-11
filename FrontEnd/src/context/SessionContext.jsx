import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SessionContext = createContext(null);

// Relative URL — Vite proxy forwards /socket.io → backend:3000
const SOCKET_URL = "/";

/**
 * Provides a single persistent socket connection that survives navigation
 * between SessionPage and WhiteboardPage. Both pages are children of this
 * context via SessionLayout, so the socket never gets destroyed on route change.
 */
export function SessionProvider({ sessionId, userId, role, children }) {
    const socketRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [reconnected, setReconnected] = useState(false);

    useEffect(() => {
        if (!sessionId || !userId) return;

        // Already connected to this session — don't reinitialize
        if (socketRef.current) return;

        const s = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

        socketRef.current = s;
        setSocket(s);

        s.on("connect", () => {
            setConnected(true);
            if (isReconnecting) {
                s.emit("rejoin-session", { roomId: sessionId, userId, role });
            } else {
                s.emit("join-room", { roomId: sessionId, userId, role });
            }
        });

        s.on("disconnect", (reason) => {
            setConnected(false);
            if (
                reason === "io server disconnect" ||
                reason === "transport close" ||
                reason === "transport error"
            ) {
                setIsReconnecting(true);
            }
        });

        s.on("session-rejoined", () => {
            setIsReconnecting(false);
            setReconnected(true);
        });

        return () => {
            // Only disconnect when the user fully leaves the session context
            s.disconnect();
            socketRef.current = null;
            setSocket(null);
            setConnected(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, userId]);

    const clearReconnected = useCallback(() => setReconnected(false), []);

    return (
        <SessionContext.Provider
            value={{
                socket,
                connected,
                isReconnecting,
                reconnected,
                clearReconnected,
                sessionId,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export const useSessionSocket = () => {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSessionSocket must be used inside <SessionProvider>");
    return ctx;
};

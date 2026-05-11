import { useParams, Outlet, Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useSessionById } from "../hooks/useSessions";
import { SessionProvider } from "../context/SessionContext";
import { useStreamClient } from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";

/**
 * Layout route that wraps both SessionPage and WhiteboardPage.
 * The SessionProvider (and its socket) mounts once here and NEVER unmounts
 * during navigation between the two pages — fixing the WebSocket 1006 error.
 * 
 * We also mount the Stream video call here so the video WebSocket connection
 * survives navigation between the code editor and whiteboard.
 */
export default function SessionLayout() {
    const { sessionId } = useParams();
    const { user, isSignedIn } = useUser();

    // Fetch session to get the callId (used as roomId) and determine role
    const { data: sessionData, isLoading } = useSessionById(sessionId);
    const session = sessionData?.session;

    const isHost = session?.host?.clerkId === user?.id;
    const isParticipant = session?.participant?.clerkId === user?.id;
    const role = isHost ? "host" : "participant";

    // Use callId as the socket room (same as before), fall back to sessionId
    const roomId = session?.callId || sessionId;

    // Initialize the Stream video call here in the layout so it never unmounts
    const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
        session,
        isLoading,
        isHost,
        isParticipant
    );

    if (!isSignedIn) return <Navigate to="/" />;
    
    // Prevent rendering the context until session data is fully loaded
    // This avoids race conditions where the provider mounts with just the URL param
    // and then re-renders with the actual callId, which destroyed the socket.
    if (!sessionData) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-base-content/60 font-medium">Connecting to session...</p>
                </div>
            </div>
        );
    }

    const content = <Outlet context={{ chatClient, channel, isInitializingCall }} />;

    return (
        <SessionProvider sessionId={roomId} userId={user?.id} role={role}>
            {/* Wrap the pages in the Video provider only if initialized, otherwise just render pages */}
            {streamClient && call ? (
                <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                        {content}
                    </StreamCall>
                </StreamVideo>
            ) : (
                content
            )}
        </SessionProvider>
    );
}

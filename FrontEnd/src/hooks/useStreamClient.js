import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";


export const useStreamClient = (session, loadingSession, isHost, isParticipant) => {

  //this is for video call
  const [streamClient, setStreamClient] = useState(null)
  const [call, setCall] = useState(null)
  //this is for chat
  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  //this is for loading
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    let isMounted = true;

    const initCall = async () => {
      if (!session?.callId || loadingSession) return
      if (!isHost && !isParticipant) return
      if (session.status === "completed") return

      // If already initializing or initialized, don't do it again
      setIsInitializingCall(true);

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        if (!isMounted) return;

        // 1. Initialize Video Client
        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage
          },
          token
        );

        if (!isMounted) return;
        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });

        if (!isMounted) return;
        setCall(videoCall)

        // 2. Initialize Chat Client
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey)

        // Only connect if not already connected
        if (!chatClientInstance.userID) {
          await chatClientInstance.connectUser(
            {
              id: userId,
              name: userName,
              image: userImage,
            },
            token
          );
        }

        if (!isMounted) return;
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch()

        if (!isMounted) return;
        setChannel(chatChannel);

      } catch (error) {
        if (isMounted) {
          toast.error("Failed to join video call");
          console.error("Error init call", error);
        }
      } finally {
        if (isMounted) {
          setIsInitializingCall(false)
        }
      }
    };

    initCall();

    return () => {
      isMounted = false;
      const cleanup = async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient()
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      };
      cleanup();
    }
  }, [session?.callId, loadingSession, isHost, isParticipant])
  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  }
}

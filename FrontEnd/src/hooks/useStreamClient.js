import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";


export const useStreamClient = (session, loadingSession, isHost,  isParticipant) => {

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

    const initCall = async () => {
      if (!session?.callId) return
      if (!isHost && !isParticipant) return
      if (session.status === "completed") return

      try {
      const {token, userId, userName, userImage}=   await sessionApi.getStreamToken();

      const client = await initializeStreamClient(
        {
          id: userId,
          name: userName,
          image: userImage
        },
        token
      );

      setStreamClient(client);

      videoCall = client.call("default", session.callId);
      await videoCall.join({ create: true});
      setCall(videoCall)

      const apiKey = import.meta.env.VITE_STREAM_API_KEY;

      //StreamChat for chats feature & passing api key or secret to know we are sending to stream server
      chatClientInstance = StreamChat.getInstance(apiKey)

      await chatClientInstance.connectUser(
        {
          id: userId,
          name: userName,
          image: userImage,
        },
        token
      );
      setChatClient(chatClientInstance);

      const chatChannel = chatClientInstance.channel("messaging", session.callId);
      //watch - Loads the initial channel state and watches for changes
      await chatChannel.watch()
      setChannel(chatChannel);

      } catch (error) {
        
        toast.error("Failed to join video call");
        console.error("Error init call", error);

      } finally {
        setIsInitializingCall(false)
      }
    };

    if (session && !loadingSession) initCall();

    // cleanup - performance reasons
    return () => {
      
      // iife - fn calling it-self for only one time
      
      (async () => {
      
        try {
      
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient()
      
        } catch (error) {
      
          console.error("Cleanup error:", error);
        }
      })();
    }

  },[session, loadingSession, isHost, isParticipant])
  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  }
}

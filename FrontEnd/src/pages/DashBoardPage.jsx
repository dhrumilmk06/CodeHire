import { useNavigate } from 'react-router'
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from '../hooks/useSessions';

import { WelcomeSection } from '../components/WelcomeSection.jsx'
import { StatsCards } from '../components/StatsCards.jsx'
import { ActiveSessions } from '../components/ActiveSessions.jsx'
import { RecentSession } from '../components/RecentSession.jsx'
import { CreateSessionModel } from '../components/CreateSessionModel.jsx'

export const DashBoardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  //showCreateModel show the pop-up after we click on createsessionBtn  
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" })

  const createSessionMutation = useCreateSession();

  // this will handel createRoom btn
  const handelCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      { // problem and diffeculty come from createSession controller
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModel(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();


  const activeSession = activeSessionsData?.sessions || []; //sessions is coming from session controller ActiveSessions fn response
  const recentSession = recentSessionsData?.sessions || [];

  // check if user is in session
  const isUserInsession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id
  }

  return (
    <>
      <div className='min-h-screen bg-base-300'>

        <WelcomeSection onCreateSession={() => setShowCreateModel(true)} />

        {/* Grid layout */}
        <div className='container mx-auto px-6 pb-16'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <StatsCards
              activeSessionsCount={activeSession.length}
              recentSessionsCount={recentSession.length}
            />
            <ActiveSessions
              sessions={activeSession}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInsession}
            />
          </div>

          <RecentSession
            sessions={recentSession} isLoading={loadingRecentSessions}
          />
        </div>
      </div>
      <CreateSessionModel
        isOpen={showCreateModel}
        onClose={() => setShowCreateModel(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handelCreateRoom}
        isCreating={createSessionMutation.isPending}
      />

    </>
  )
}

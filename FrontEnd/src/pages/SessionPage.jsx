import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {  useEndSession, useJoinSession, useSessionById } from '../hooks/useSessions';
import { PROBLEMS } from '../data/problems';

export const SessionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const {data: sessionData, isLoading: loadingSession, refetch} = useSessionById(id);

  const joinSessionMutation = useJoinSession()
  const endSessionMutation =useEndSession()

  const session = sessionData?.session;
  const isHost = session?.host?.clearkId === user?.id;
  const isParticipant = session?.participant?.clearkId === user?.id;

  // find the problem data based on session problem title
  const problemData = session?.problem 
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem) 
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");
  
  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if(!session || !user || loadingSession) return;
    if(isHost || isParticipant) return

    joinSessionMutation.mutate(id, {onSuccess: refetch})
  },[session, user, loadingSession, isHost, isParticipant, id])


   // redirect the "participant" when session ends
  useEffect(() => {
    if(!session || loadingSession) return

    if(session.status === "completed") navigate("/dashboard");
  },[session, loadingSession,navigate])

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);
  return (
    <div>SessionPage</div>
  )
}

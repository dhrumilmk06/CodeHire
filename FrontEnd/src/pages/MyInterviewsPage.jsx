import { useUser } from "@clerk/clerk-react";
import { useMyRecentSessions } from '../hooks/useSessions';
import { ParticipantWelcomeSection } from '../components/ParticipantWelcomeSection.jsx';
import { ParticipantStats } from '../components/ParticipantStats.jsx';
import { RecentSession } from '../components/RecentSession.jsx';
import QuickJoinCard from '../components/dashboard/QuickJoinCard';

export const MyInterviewsPage = () => {
  const { user } = useUser();
  const { data: recentSessionsData, isLoading } = useMyRecentSessions();

  const sessions = recentSessionsData?.sessions || [];

  // Calculate Stats
  const totalInterviews = sessions.length;
  
  const solvedCount = sessions.filter(s => {
      const tests = s.testCasesPassed?.split('/') || ["0", "0"];
      return parseInt(tests[0]) > 0 && tests[0] === tests[1];
  }).length;

  const totalScore = sessions.reduce((acc, s) => {
      const tests = s.testCasesPassed?.split('/') || ["0", "0"];
      const passed = parseInt(tests[0]);
      const total = parseInt(tests[1]);
      const ratio = total > 0 ? (passed / total) : 0;
      return acc + ratio;
  }, 0);

  const avgScore = totalInterviews > 0 
    ? Math.round((totalScore / totalInterviews) * 100) 
    : 0;

  return (
    <div className='min-h-screen bg-base-300'>
      {/* Welcome Hero Section */}
      <div className="bg-linear-to-br from-primary/10 via-base-200 to-secondary/5 border-b border-base-300">
        <ParticipantWelcomeSection />
      </div>

      {/* Grid layout */}
      <div className='container mx-auto px-6 pb-16 mt-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Stats Sidebar */}
          <ParticipantStats 
            totalInterviews={totalInterviews}
            avgScore={avgScore}
            problemsSolved={solvedCount}
          />

          {/* Sessions List */}
          <div className="lg:col-span-3 -mt-12">
            <QuickJoinCard />
            <RecentSession
              sessions={sessions}
              isLoading={isLoading}
              userClerkId={user?.id}
              hideCompare={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInterviewsPage;

import { useUser } from "@clerk/clerk-react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { Navbar } from './components/Navbar.jsx';
import { PageTransition } from './components/PageTransition.jsx';
import { DashBoardPage } from './pages/DashBoardPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ProblemPage } from './pages/ProblemPage.jsx';
import { ProblemsPage } from './pages/ProblemsPage';
import { SessionPage } from './pages/SessionPage.jsx';
import { ProblemBankPage } from './pages/ProblemBankPage.jsx';

import { AdminRoute, HostRoute, ParticipantRoute, AuthenticatedRoute } from './components/RoleRoutes.jsx';
import { AdminPanelPage } from './pages/AdminPanelPage.jsx';
import { MyInterviewsPage } from './pages/MyInterviewsPage.jsx';
import { SelectRolePage } from './pages/SelectRolePage.jsx';

function LandingRedirect() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role || user?.role;

  // First time login — no role set yet
  if (!role || role === '') {
    return <Navigate to="/select-role" />;
  }

  // Admin → go to admin panel
  if (role === 'admin') {
    return <Navigate to="/admin" />;
  }

  // Host → go to host dashboard
  if (role === 'host') {
    return <Navigate to="/dashboard" />;
  }

  // Participant → go to participant dashboard
  if (role === 'participant') {
    return <Navigate to="/my-interviews" />;
  }

  return <Navigate to="/select-role" />;
}

function App() {

  const { isSignedIn, isLoaded } = useUser()
  const location = useLocation()

  if (!isLoaded) return null
  return (
    <>
      {isSignedIn && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* Public / Landing */}
          <Route path='/' element={
            <PageTransition>
              {!isSignedIn ? <HomePage /> : <LandingRedirect />}
            </PageTransition>
          } />

          <Route path='/select-role' element={
            <PageTransition>
              {isSignedIn ? <SelectRolePage /> : <Navigate to={'/'} />}
            </PageTransition>
          } />

          {/* Admin Routes */}
          <Route path='/admin' element={
            <AdminRoute>
              <PageTransition>
                <AdminPanelPage />
              </PageTransition>
            </AdminRoute>
          } />

          {/* Host Routes */}
          <Route path='/dashboard' element={
            <HostRoute>
              <PageTransition>
                <DashBoardPage />
              </PageTransition>
            </HostRoute>
          } />

          <Route path='/problems' element={
            <AuthenticatedRoute>
              <PageTransition>
                <ProblemsPage />
              </PageTransition>
            </AuthenticatedRoute>
          } />

          <Route path='/problem-bank' element={
            <HostRoute>
              <PageTransition>
                <ProblemBankPage />
              </PageTransition>
            </HostRoute>
          } />

          <Route path='/problem/:id' element={
            <AuthenticatedRoute>
              <PageTransition>
                <ProblemPage />
              </PageTransition>
            </AuthenticatedRoute>
          } />

          {/* Participant Routes */}
          <Route path='/my-interviews' element={
            <ParticipantRoute>
              <PageTransition>
                <MyInterviewsPage />
              </PageTransition>
            </ParticipantRoute>
          } />

          {/* Shared Routes (Interview Session) */}
          <Route path='/session/:id' element={
            <PageTransition>
              {isSignedIn ? <SessionPage /> : <Navigate to={'/'} />}
            </PageTransition>
          } />

        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  )
}


export default App

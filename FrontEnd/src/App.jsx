import { useUser } from "@clerk/clerk-react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { PageTransition } from './components/PageTransition.jsx';
import { DashBoardPage } from './pages/DashBoardPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ProblemPage } from './pages/ProblemPage.jsx';
import { ProblemsPage } from './pages/ProblemsPage';
import { SessionPage } from './pages/SessionPage.jsx';

function App() {

  const { isSignedIn, isLoaded } = useUser()
  const location = useLocation()

  //this will stop the filckering effect of changing page
  if (!isLoaded) return null

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path='/' element={
            <PageTransition>
              {!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />}
            </PageTransition>
          } />

          <Route path='/dashboard' element={
            <PageTransition>
              {isSignedIn ? <DashBoardPage /> : <Navigate to={"/"} />}
            </PageTransition>
          } />

          <Route path='/problems' element={
            <PageTransition>
              {isSignedIn ? <ProblemsPage /> : <Navigate to={'/'} />}
            </PageTransition>
          } />

          <Route path='/problem/:id' element={
            <PageTransition>
              {isSignedIn ? <ProblemPage /> : <Navigate to={'/'} />}
            </PageTransition>
          } />

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

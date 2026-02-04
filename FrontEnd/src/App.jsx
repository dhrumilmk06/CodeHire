import { useUser } from "@clerk/clerk-react";
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router';
import { DashBoardPage } from './pages/DashBoardPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ProblemPage } from './pages/ProblemPage.jsx';
import { ProblemsPage } from './pages/ProblemsPage';
import { SessionPage } from './pages/SessionPage.jsx';

function App() {

      const {isSignedIn , isLoaded} = useUser()

      //this will stop the filckering effect of changing page
      if(!isLoaded) return null
  return (
    <>
      <Routes>

        <Route path='/' element={!isSignedIn ? <HomePage /> : <Navigate to= {"/dashboard"} /> } />
        <Route path='/dashboard' element={isSignedIn ? <DashBoardPage /> : <Navigate to= {"/"} /> } />
        <Route path='/problems' element={isSignedIn ? <ProblemsPage/> : <Navigate to = {'/'} />} />
        <Route path='/problem/:id' element={isSignedIn ? <ProblemPage/> : <Navigate to = {'/'} />} />
        <Route path='/session/:id' element={isSignedIn ? <SessionPage/> : <Navigate to = {'/'} />} />

      </Routes>
      <Toaster />
    </>
  )
}

export default App

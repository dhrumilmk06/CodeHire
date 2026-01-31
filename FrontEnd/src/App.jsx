import {Routes, Route, Navigate} from 'react-router'
import { HomePage } from './pages/Homepage'
import { ProblemPage } from './pages/ProblemPage'
import { useUser } from "@clerk/clerk-react";
import { Toaster } from 'react-hot-toast';

function App() {

      const {isSignedIn} = useUser()

  return (
    <>
      <Routes>

        <Route path='/' element={<HomePage />} />
        <Route path='/problem' element={isSignedIn ? <ProblemPage/> : <Navigate to = {'/'} />} />
        
      </Routes>
      <Toaster />
    </>
  )
}

export default App

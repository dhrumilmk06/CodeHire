import { SignedOut, SignInButton, SignOutButton, UserButton, SignedIn } from '@clerk/clerk-react'
import './App.css'

function App() {


  return (
    <>
      <h1>Welcome to CodeHire</h1>

      <SignedOut> // only show when user is signed out
        <SignInButton mode='modal' > 
          <button className=''>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn> // only show when user is signed in
        <SignOutButton />
      </SignedIn>

      <UserButton /> 
      
    </>
  )
}

export default App

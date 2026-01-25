import { SignedOut, SignInButton, SignOutButton, UserButton, SignedIn } from '@clerk/clerk-react'
import './App.css'

function App() {


  return (
    <>
      <h1>Welcome to CodeHire</h1>


      {/* only show when user is signed out */ }
      <SignedOut> 
        <SignInButton mode='modal' > 
          <button className=''>Login</button>
        </SignInButton>
      </SignedOut>

      {/*only show when user is signed in*/ }
      <SignedIn> 
        <SignOutButton />
      </SignedIn>

      <UserButton /> 
      
    </>
  )
}

export default App

import React from 'react'
import { SignedOut, SignInButton, SignOutButton, UserButton, SignedIn, useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

export const HomePage = () => {
  

    return (
    <div>
        HomePage
        <h1 className='text-red-500'>Welcome to CodeHire</h1>
    <button
     className='btn btn-primary'
     onClick={() => toast.success("this is Success toast")}>Click me</button>

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
    </div>
  )
}

import React from 'react'
import { AccountAvatar } from '../AccountAvatar'
import { useSession } from 'next-auth/react';
import LoginSignup from '../LoginSignup'

function LoginSignupAvatar() {
    const { data: session, status } = useSession();

    return (
        <div className="absolute top-6 right-6 z-50">
            {status === 'loading' ? (
                <div></div>
            ) : session ? (
              <AccountAvatar imageLink={session.user?.image}/>
            ) : (
              <LoginSignup />
            )}
        </div>
  )
}

export default LoginSignupAvatar
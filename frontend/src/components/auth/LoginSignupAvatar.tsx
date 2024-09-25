"use client"

import React from 'react'
import { AccountAvatar } from '../AccountAvatar'
import { useSession } from 'next-auth/react';
import LoginSignup from '../LoginSignup'

interface LoginSignupAvatarProps {
  session: any;
  status: string;
  ref: React.RefObject<string>;
  onSignOut?: () => void;
}

function LoginSignupAvatar({session, status, ref, onSignOut}: LoginSignupAvatarProps) {

    return (
        <div className="absolute top-6 right-6 z-50">
            {status === 'loading' ? (
              <LoginSignup />
            ) : status === "authenticated" ? (
              <AccountAvatar imageLink={session.user?.image}/>
            ) : (
              <LoginSignup />
            )}
        </div>
  )
}

export default LoginSignupAvatar
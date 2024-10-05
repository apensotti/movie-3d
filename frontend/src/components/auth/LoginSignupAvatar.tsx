"use client"

import React from 'react'
import { AccountAvatar } from '../AccountAvatar'
import { useSession } from 'next-auth/react';
import LoginSignup from '../LoginSignup'
import { Button } from '../ui/button';

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
              <div>
                <AccountAvatar imageLink={session.user?.image}/>
              </div>
            ) : (
              <LoginSignup />
            )}
        </div>
  )
}

export default LoginSignupAvatar
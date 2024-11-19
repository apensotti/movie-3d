"use client"

import React from 'react'
import { AccountAvatar } from '../component/AccountAvatar'
import { useSession } from 'next-auth/react';
import LoginSignup from './LoginSignup'
import { Button } from '../ui/button';
import { CgMenuGridO } from "react-icons/cg";

interface LoginSignupAvatarProps {
  session: any;
  status?: string;
  onSignOut?: () => void;
}

function LoginSignupAvatar({session, status, onSignOut}: LoginSignupAvatarProps) {

    return (
        <div className="absolute top-6 right-6 z-50">
            {session ? (
              <div className='flex flex-row gap-5 items-center'>
                <AccountAvatar imageLink={session.user?.image}/>
              </div>
            ) : (
              <div>
                <LoginSignup />
              </div>
            )}
        </div>
  )
}

export default LoginSignupAvatar
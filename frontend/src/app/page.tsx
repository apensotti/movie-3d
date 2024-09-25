import { checkIsAuthenticated } from '@/lib/auth/checkAuth';
import React from 'react'
import AIPage from '../components/AIPage';
import LoginSignup from '@/components/LoginSignup';
import { AccountAvatar } from '@/components/AccountAvatar';
import { auth } from '@/lib/auth/authConfig';


const page = async () => {
  const isAuthenticated = await checkIsAuthenticated();
  const session = await auth()
 
  return (
      <AIPage session={session} />
  )
};

export default page
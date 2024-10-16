"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from 'react';

interface provider_props {
  children: React.ReactNode,
  session: Session | null
}

function AuthProvider({ children, session }: provider_props) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;
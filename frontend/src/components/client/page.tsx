import React from 'react'
import AIPage from '../AIPage'
import { useSession } from 'next-auth/react'

export const page = () => {

    const { data: session, status } = useSession()

    return (
      <AIPage session={session}/>
    )
}

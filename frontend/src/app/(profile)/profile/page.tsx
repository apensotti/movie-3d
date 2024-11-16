import { Suspense } from 'react'
import ProfileForm from '@/components/component/ProfileForm/ProileForm'
import { auth } from '@/lib/auth/authConfig'
import { redirect } from 'next/navigation'
import { getProfileData } from '@/lib/profile'
import { ProfileData } from '@/components/component/ProfileForm/ProileForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Pre-fetch profile data on server
  const profileData = await getProfileData(session.user.email || '')
  
  const initialProfileData: ProfileData = {
    userId: session.user.id || '',
    username: profileData?.username || '',
    name: profileData?.name || '',
    favoriteMovie: profileData?.favoriteMovie || '',
    bio: profileData?.bio || '',
    tagline: profileData?.tagline || '',
    links: profileData?.links || '',
    image: profileData?.image || session.user?.image || '/defaultprofile2.png'
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileForm 
        session={session} 
        initialProfileData={initialProfileData} 
      />
    </Suspense>
  )
}

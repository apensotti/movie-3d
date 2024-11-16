import { getProfileData } from '@/lib/profile'
import { cache } from 'react'

export const getProfileDataCached = cache(async (email: string) => {
  if (!email) return null
  return getProfileData(email)
})

export async function ProfileDataProvider({ email }: { email: string }) {
  const data = await getProfileDataCached(email)
  return <script id="profile-data" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
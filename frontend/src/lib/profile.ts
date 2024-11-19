import client from '@/lib/mongodb'
import { getProfileImage } from './utils'
import { cache } from 'react'

export const getProfileData = cache(async (email: string) => {
  if (!email) return null

  try {
    const clientPromise = await client
    const db = clientPromise.db("mw_users")
    
    const profileData = await db.collection("users").findOne({ 
      email: email 
    }, {
      projection: {
        username: 1,
        name: 1,
        favoriteMovie: 1,
        bio: 1,
        tagline: 1,
        links: 1,
        image: 1
      }
    })

    return {
      username: profileData?.username || '',
      name: profileData?.name || '',
      favoriteMovie: profileData?.favoriteMovie || '',
      bio: profileData?.bio || '',
      tagline: profileData?.tagline || '',
      links: profileData?.links || '',
      image: profileData?.image || getProfileImage(email) || '/defaultprofile2.png'
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    return null
  }
})
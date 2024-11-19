import { NextResponse } from 'next/server'
import { getProfileData } from '@/lib/profile'
import { CACHE_TAGS } from '@/lib/constants'

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const profileData = await getProfileData(decodeURIComponent(params.email))

    return NextResponse.json(profileData || {}, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
        'Tag': CACHE_TAGS.PROFILE
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 
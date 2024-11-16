import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/lib/auth/authConfig';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileData = await request.json();
    
    const client = await clientPromise;
    const db = client.db("mw_users");

    const updateResult = await db.collection("users").updateOne(
      { email: session.user.email },
      { 
        $set: {
          ...profileData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // Revalidate cache after update
    revalidateTag(CACHE_TAGS.PROFILE);

    return NextResponse.json({ 
      success: true,
      updated: updateResult.modifiedCount > 0,
      created: updateResult.upsertedCount > 0
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
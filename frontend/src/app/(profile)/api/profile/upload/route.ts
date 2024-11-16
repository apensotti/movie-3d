import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { auth } from '@/lib/auth/authConfig'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const filename = `${session.user.id}-${Date.now()}${path.extname(file.name)}`
    const publicPath = path.join(process.cwd(), 'public', 'profile-images', filename)
    
    // Ensure directory exists
    await writeFile(publicPath, buffer)
    
    const imageUrl = `/profile-images/${filename}`
    
    return NextResponse.json({ success: true, imageUrl })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
} 
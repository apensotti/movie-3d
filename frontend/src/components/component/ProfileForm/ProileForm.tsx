"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input3'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { getProfileImage, setProfileImage } from '@/lib/utils'
import { Suspense } from 'react'
import { Session } from 'next-auth'

export interface ProfileData {
  userId: string;
  username: string;
  name: string;
  favoriteMovie: string;
  bio: string;
  tagline: string;
  links: string;
  image?: string;
}

export default function ProfileForm({ 
  session, 
  initialProfileData 
}: { 
  session: Session, 
  initialProfileData: ProfileData 
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileData, setProfileData] = useState(initialProfileData)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && session?.user?.id) {
      try {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('file', file)

        // Upload image to server
        const uploadResponse = await fetch('/api/profile/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const { imageUrl } = await uploadResponse.json()

        // Update profile with new image URL
        const updateResponse = await fetch('/api/profile/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            image: imageUrl
          }),
        })

        if (!updateResponse.ok) {
          throw new Error('Failed to update profile image')
        }

        // Update local state
        setProfileData(prev => ({ ...prev, image: imageUrl }))
        setProfileImage(session.user.email || '', imageUrl)
        toast.success('Profile image updated successfully')
      } catch (error) {
        console.error('Error updating profile image:', error)
        toast.error('Failed to update profile image')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      // Image is already saved in localStorage during upload
      const mongoData: ProfileData = {
        userId: session.user.id,
        username: profileData.username,
        name: profileData.name,
        favoriteMovie: profileData.favoriteMovie,
        bio: profileData.bio,
        tagline: profileData.tagline,
        links: profileData.links
      };

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mongoData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-32 w-32">
                <AvatarImage 
                  src={profileData.image || session?.user?.image || '/defaultprofile2.png'} 
                  alt="Profile" 
                />
                <AvatarFallback>
                  {session?.user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 rounded-full transition-opacity">
                <span className="text-white text-sm">Upload Photo</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({...prev, username: e.target.value}))}
                placeholder="@username"
              />
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={profileData.tagline}
                onChange={(e) => setProfileData(prev => ({...prev, tagline: e.target.value}))}
                placeholder="A brief tagline about yourself"
              />
            </div>

            <div>
              <Label htmlFor="favoriteMovie">Favorite Movie</Label>
              <Input
                id="favoriteMovie"
                value={profileData.favoriteMovie}
                onChange={(e) => setProfileData(prev => ({...prev, favoriteMovie: e.target.value}))}
                placeholder="Your favorite movie"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                placeholder="Tell us about yourself"
                className="h-32"
              />
            </div>

            <div>
              <Label htmlFor="links">Social Links</Label>
              <Textarea
                id="links"
                value={profileData.links}
                onChange={(e) => setProfileData(prev => ({...prev, links: e.target.value}))}
                placeholder="Add your social media links (one per line)"
                className="h-24"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </div>
    </Suspense>
  )
}

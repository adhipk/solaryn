"use client"

import { useEffect, useState } from "react"
import ProfileLayout from "~/components/ProfileLayout"
import type { ProfileData } from "~/types/profile"

export function ProfileContent({ name }: { name: string }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`/api/wikipedia?name=${name}`)
        if (!response.ok) {
          throw new Error('Failed to fetch profile data')
        }
        const data = await response.json() as ProfileData
        setProfileData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    void loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No profile data found</div>
      </div>
    )
  }

  return <ProfileLayout {...profileData} />
} 
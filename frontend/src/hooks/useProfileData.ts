import { useEffect, useState } from 'react'

export function useProfileData() {
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    const script = document.getElementById('profile-data')
    if (script) {
      const data = JSON.parse(script.innerHTML)
      setProfileData(data)
    }
  }, [])

  return profileData
}

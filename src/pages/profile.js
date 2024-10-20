import React from 'react'
import ProfileView from '../components/ProfileView'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <ProfileView />
      </div>
    </div>
  )
}
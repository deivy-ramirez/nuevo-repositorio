import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ProfileView() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push('/login')
      }
    }

    fetchProfile()
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Perfil de usuario</h2>
      <div>
        <strong>Nombre:</strong> {user.username}
      </div>
      <div>
        <strong>Fecha de nacimiento:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Ciudad:</strong> {user.city}
      </div>
      <button
        onClick={() => router.push('/promotions')}
        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Ver promociones
      </button>
    </div>
  )
}
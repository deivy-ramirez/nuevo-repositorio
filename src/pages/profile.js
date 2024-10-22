import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ProfileView from '../components/ProfileView'

export default function ProfileView() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token found, redirecting to login')
        router.push('/login')
        return
      }

      try {
        console.log('Fetching profile data')
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          console.log('Profile data received:', userData)
          setUser(userData)
        } else {
          console.error('Error response:', response.status, response.statusText)
          const errorData = await response.json().catch(() => ({}))
          console.error('Error data:', errorData)
          setError(`Error: ${response.status} ${response.statusText}`)
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to login')
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError(`Error fetching profile: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!user) {
    return <div>No se pudo cargar el perfil del usuario.</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div>
        <p><strong>Nombre de usuario:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Ciudad:</strong> {user.city}</p>
      </div>
      <button
        onClick={() => router.push('/promotions')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Ver Promociones
      </button>
    </div>
  )
}
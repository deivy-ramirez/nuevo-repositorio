import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function WinnersList() {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchWinners = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        
        return
      }

      try {
        const response = await fetch('/api/winners', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const winnersData = await response.json()
          setWinners(winnersData)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Error al cargar los ganadores')
        }
      } catch (error) {
        console.error('Error fetching winners:', error)
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchWinners()
  }, [router])

  if (loading) return <div className="text-center">Cargando lista de ganadores...</div>

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Ganadores de Promociones</h1>
      {winners.length === 0 ? (
        <p className="text-gray-600">No hay ganadores registrados aún.</p>
      ) : (
        <div className="space-y-6">
          {winners.map((winner) => (
            <div key={winner._id} className="border p-4 rounded-md">
              <h2 className="text-xl font-semibold">{winner.username}</h2>
              <p className="mt-2"><strong className="text-gray-700">Premio:</strong> {winner.prize}</p>
              <p><strong className="text-gray-700">Código de promoción:</strong> {winner.promotionCode}</p>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => router.push('/profile')}
        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Volver al Perfil
      </button>
    </div>
  )
}
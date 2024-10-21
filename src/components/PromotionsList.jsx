import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PromotionsList() {
  const [promotions, setPromotions] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchPromotions = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/promotions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const promotionsData = await response.json()
        setPromotions(promotionsData)
      } else {
        router.push('/login')
      }
    }

    fetchPromotions()
  }, [router])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Promotions</h2>
      {promotions.map((promotion) => (
        <div key={promotion._id} className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold">{promotion.name}</h3>
          <p>{promotion.description}</p>
          <p>
            <strong>Prize:</strong> {promotion.prize}
          </p>
          <p>
            <strong>Code:</strong> {promotion.promotionCode}
          </p>
        </div>
      ))}
      <button
        onClick={() => router.push('/winners')}
        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Ver ganadores
      </button>
    </div>
  )
}
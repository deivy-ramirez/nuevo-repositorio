import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function WinnersList() {
  const [winners, setWinners] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchWinners = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/winners', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const winnersData = await response.json()
        setWinners(winnersData)
      } else {
        router.push('/login')
      }
    }

    fetchWinners()
  }, [router])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Winners</h2>
      {winners.map((winner) => (
        <div key={winner._id} className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold">{winner.username}</h3>
          <p>
            <strong>Prize:</strong> {winner.prize}
          </p>
          <p>
            <strong>Promotion Code:</strong> {winner.promotionCode}
          </p>
        </div>
      ))}
    </div>
  )
}
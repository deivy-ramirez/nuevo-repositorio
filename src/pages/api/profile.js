import clientPromise from '../../lib/mongodb'
import { verifyToken } from '../../lib/auth'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = verifyToken(token)
    const client = await clientPromise
    const db = client.db('mi-app-promociones')

    const user = await db.collection('usuarios').findOne({ _id: ObjectId(decoded.userId) })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { password, ...userWithoutPassword } = user
    res.status(200).json(userWithoutPassword)
  } catch (error) {
    console.error('Error in profile API:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}
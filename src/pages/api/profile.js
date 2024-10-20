import clientPromise from '../../lib/mongodb'
import { verifyToken } from '../../lib/auth'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  try {
    const decodedToken = verifyToken(token)
    const client = await clientPromise
    const db = client.db()

    if (req.method === 'GET') {
      const user = await db.collection('users').findOne({ _id: ObjectId(decodedToken.userId) })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const { password, ...userWithoutPassword } = user
      return res.status(200).json(userWithoutPassword)
    }

    if (req.method === 'PUT') {
      const { dateOfBirth, email, city } = req.body
      await db.collection('users').updateOne(
        { _id: ObjectId(decodedToken.userId) },
        { $set: { dateOfBirth: new Date(dateOfBirth), email, city } }
      )
      return res.status(200).json({ message: 'Profile updated successfully' })
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
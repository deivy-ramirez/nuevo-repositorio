import clientPromise from '../../../lib/mongodb'
import { verifyPassword, createToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { username, password } = req.body

  try {
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection('usuarios').findOne({ username })

    if (!user) {
      console.log('User not found:', username)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      console.log('Invalid password for user:', username)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken({ userId: user._id, username: user.username })

    res.status(200).json({ token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
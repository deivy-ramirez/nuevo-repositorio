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

    console.log('Buscando usuario:', username)
    const user = await db.collection('usuarios').findOne({ username })

    if (!user) {
      console.log('Usuario no encontrado:', username)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    console.log('Verificando contraseña para:', username)
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      console.log('Contraseña inválida para:', username)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    console.log('Creando token para:', username)
    const token = createToken({ userId: user._id, username: user.username })

    res.status(200).json({ token })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ message: 'Internal server error', error: error.toString() })
  }
}
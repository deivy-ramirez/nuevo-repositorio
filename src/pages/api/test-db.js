import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    // Intenta obtener un documento de la colección 'usuarios'
    const user = await db.collection('usuarios').findOne({})
    
    res.status(200).json({ message: 'Conexión exitosa a la base de datos', user })
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error)
    res.status(500).json({ message: 'Error al conectar con la base de datos', error: error.toString() })
  }
}
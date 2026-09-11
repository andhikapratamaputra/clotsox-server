import { verifyToken } from './auth'

export async function verifyAdmin(token: string) {
  const payload = await verifyToken(token)
  if (!payload) return null
  if (payload.type !== 'admin') return null
  return payload
}

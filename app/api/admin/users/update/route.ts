export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '')
  const admin = await verifyAdmin(token)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, tier, status, password, expiredAt, resetDevice } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const data: any = {}
  if (tier) data.tier = tier
  if (status) data.status = status
  if (expiredAt !== undefined) data.expiredAt = expiredAt ? new Date(expiredAt) : null
  if (resetDevice) data.deviceId = null
  if (password) data.passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.update({ where: { id }, data })
  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } })
}

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

  const { username, password, tier, expiredAt } = await req.json()
  if (!username || !password || !tier) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    return NextResponse.json({ error: 'Username sudah dipakai' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: hash,
      tier,
      createdBy: admin.sub as string,
      expiredAt: expiredAt ? new Date(expiredAt) : null,
    },
  })

  return NextResponse.json({ ok: true, userId: user.id })
}

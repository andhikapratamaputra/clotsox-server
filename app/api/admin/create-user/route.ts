export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { username, password, tier, expiredAt } = await req.json()

  if (!username || !password || !tier) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: hash,
      tier,
      expiredAt: expiredAt ? new Date(expiredAt) : null,
    },
  })

  return NextResponse.json({ ok: true, userId: user.id })
}

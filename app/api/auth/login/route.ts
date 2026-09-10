import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password, deviceId } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (user.status !== 'active') {
    return NextResponse.json({ error: 'Account banned or expired' }, { status: 403 })
  }

  if (user.expiredAt && user.expiredAt < new Date()) {
    return NextResponse.json({ error: 'Account expired' }, { status: 403 })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (deviceId) {
    if (user.deviceId && user.deviceId !== deviceId) {
      return NextResponse.json({ error: 'Device mismatch' }, { status: 403 })
    }
    if (!user.deviceId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { deviceId },
      })
    }
  }

  const token = await signToken({
    sub: user.id,
    username: user.username,
    tier: user.tier,
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  })

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: 'LOGIN',
      ip: req.headers.get('x-forwarded-for') || '',
    },
  })

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      tier: user.tier,
    },
  })
}

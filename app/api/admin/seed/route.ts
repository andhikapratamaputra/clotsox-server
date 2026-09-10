import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const existing = await prisma.admin.findFirst()
  if (existing) {
    return NextResponse.json({ error: 'Admin already exists' }, { status: 400 })
  }

  const hash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.create({
    data: { username: 'admin', passwordHash: hash, role: 'super_admin' },
  })

  return NextResponse.json({ ok: true, adminId: admin.id })
}

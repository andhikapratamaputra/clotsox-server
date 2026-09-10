import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const TIER_FEATURES: Record<string, any> = {
  T15: { backgroundKill: 5, ramTrimMb: 200, cpuPriority: false, gpuTuning: false, networkTuning: false, profiles: 1 },
  T35: { backgroundKill: 10, ramTrimMb: 500, cpuPriority: false, gpuTuning: false, networkTuning: true, profiles: 2 },
  T65: { backgroundKill: 15, ramTrimMb: 1024, cpuPriority: false, gpuTuning: false, networkTuning: true, profiles: 3 },
  T75: { backgroundKill: 25, ramTrimMb: 1536, cpuPriority: true, gpuTuning: false, networkTuning: true, profiles: 5 },
  T85: { backgroundKill: 40, ramTrimMb: 2048, cpuPriority: true, gpuTuning: true, networkTuning: true, profiles: 10 },
  T100: { unlimited: true, aiAutotune: true, customKernel: true },
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '')
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub as string } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const features = TIER_FEATURES[user.tier] || TIER_FEATURES.T15
  return NextResponse.json({ tier: user.tier, features })
}

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      totalLeads,
      leadsWithWhatsapp,
      contactedToday,
      leadsByStatus,
      leadsByNiche,
      recentLeads,
      leadsPerDay
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { whatsapp: { not: null } } }),
      prisma.lead.count({
        where: {
          last_contact: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.lead.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      prisma.lead.groupBy({
        by: ['niche'],
        _count: { id: true },
        where: { niche: { not: null } }
      }),
      prisma.lead.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          city: true,
          niche: true,
          status: true,
          whatsapp: true,
          last_contact: true,
          created_at: true
        }
      }),
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM leads 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) 
        ORDER BY date
      `
    ])

    const statusCounts = leadsByStatus.reduce((acc, item) => {
      acc[item.status || 'Sin status'] = item._count.id
      return acc
    }, {} as Record<string, number>)

    const nicheCounts = leadsByNiche.map(item => ({
      name: item.niche || 'Otro',
      value: item._count.id
    }))

    return NextResponse.json({
      kpis: {
        totalLeads,
        leadsWithWhatsapp,
        contactedToday,
        responseRate: totalLeads > 0 ? Math.round((contactedToday / totalLeads) * 100) : 0
      },
      funnel: {
        nuevo: statusCounts['Nuevo'] || 0,
        contactado: statusCounts['Contactado'] || 0,
        interesado: statusCounts['Interesado'] || 0,
        cliente: statusCounts['Cliente'] || 0
      },
      leadsByNiche: nicheCounts,
      recentLeads,
      leadsPerDay
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

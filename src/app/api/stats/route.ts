import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('=== API /api/stats called ===')
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
  console.log('DATABASE_URL host:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown')
  
  try {
    console.log('Fetching data from database...')
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

    console.log('=== Data fetched successfully ===')
    console.log('totalLeads:', totalLeads)
    console.log('leadsWithWhatsapp:', leadsWithWhatsapp)
    console.log('contactedToday:', contactedToday)
    console.log('leadsByStatus:', JSON.stringify(leadsByStatus))
    console.log('recentLeads count:', recentLeads.length)
    console.log('leadsPerDay:', JSON.stringify(leadsPerDay))

    // Normalize status counts (case-insensitive) - handles 'nuevo' vs 'Nuevo'
    const statusCounts = leadsByStatus.reduce((acc, item) => {
      const normalizedStatus = (item.status || 'Sin status').toLowerCase()
      acc[normalizedStatus] = (acc[normalizedStatus] || 0) + item._count.id
      return acc
    }, {} as Record<string, number>)

    const nicheCounts = leadsByNiche.map(item => ({
      name: item.niche || 'Otro',
      value: item._count.id
    }))

    const response = {
      kpis: {
        totalLeads,
        leadsWithWhatsapp,
        contactedToday,
        responseRate: totalLeads > 0 ? Math.round((contactedToday / totalLeads) * 100) : 0
      },
      funnel: {
        nuevo: statusCounts['nuevo'] || 0,
        contactado: statusCounts['contactado'] || 0,
        interesado: statusCounts['interesado'] || 0,
        cliente: statusCounts['cliente'] || 0
      },
      leadsByNiche: nicheCounts,
      recentLeads,
      leadsPerDay
    }
    
    console.log('=== Response being sent ===')
    console.log('funnel:', JSON.stringify(response.funnel))
    console.log('kpis:', JSON.stringify(response.kpis))
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Stats error:', error)
    // Return empty data structure so frontend doesn't crash
    return NextResponse.json({
      kpis: {
        totalLeads: 0,
        leadsWithWhatsapp: 0,
        contactedToday: 0,
        responseRate: 0
      },
      funnel: {
        nuevo: 0,
        contactado: 0,
        interesado: 0,
        cliente: 0
      },
      leadsByNiche: [],
      recentLeads: [],
      leadsPerDay: [],
      error: 'Database connection failed - check DATABASE_URL'
    })
  }
}

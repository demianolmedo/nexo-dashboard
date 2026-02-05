import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse query params
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const niche = searchParams.get('niche') || ''
    const city = searchParams.get('city') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: Prisma.LeadWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { whatsapp: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = { equals: status, mode: 'insensitive' }
    }

    if (priority) {
      where.priority = priority
    }

    if (niche) {
      where.niche = { contains: niche, mode: 'insensitive' }
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    // Get total count
    const totalItems = await prisma.lead.count({ where })
    const totalPages = Math.ceil(totalItems / pageSize)

    // Get leads with pagination
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return NextResponse.json({
      data: leads,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Leads API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// Update lead status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updated_at: new Date()
      }
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Lead update error:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

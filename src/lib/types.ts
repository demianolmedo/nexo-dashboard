// Lead Types
export interface Lead {
  id: number
  name: string
  phone: string | null
  whatsapp: string | null
  email: string | null
  city: string | null
  address: string | null
  website: string | null
  facebook: string | null
  instagram: string | null
  niche: string | null
  status: string | null
  priority: string | null
  source: string | null
  pain_point: string | null
  notes: string | null
  next_action: string | null
  last_contact: Date | null
  created_at: Date | null
  updated_at: Date | null
}

// Filter Types
export interface LeadFilters {
  search?: string
  status?: string
  priority?: string
  niche?: string
  city?: string
  source?: string
  hasWhatsapp?: boolean
  dateFrom?: string
  dateTo?: string
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// API Request Types
export interface LeadsQueryParams extends LeadFilters {
  page?: number
  pageSize?: number
  sortBy?: keyof Lead
  sortOrder?: 'asc' | 'desc'
}

// Status & Priority Options
export const LEAD_STATUSES = [
  'Nuevo',
  'Contactado',
  'Interesado',
  'Negociando',
  'Cliente',
  'Perdido'
] as const

export const LEAD_PRIORITIES = ['Alta', 'Media', 'Baja'] as const

export type LeadStatus = typeof LEAD_STATUSES[number]
export type LeadPriority = typeof LEAD_PRIORITIES[number]

// Style Constants
export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Nuevo': { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
  'Contactado': { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
  'Interesado': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
  'Negociando': { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20' },
  'Cliente': { bg: 'bg-green-500/10', text: 'text-green-700', border: 'border-green-500/20' },
  'Perdido': { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' }
}

export const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  'Alta': { bg: 'bg-red-500/10', text: 'text-red-600' },
  'Media': { bg: 'bg-amber-500/10', text: 'text-amber-600' },
  'Baja': { bg: 'bg-gray-500/10', text: 'text-gray-600' }
}

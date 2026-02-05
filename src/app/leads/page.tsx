'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/GlassCard'
import { StatusBadge } from '@/components/StatusBadge'
import { SearchInput } from '@/components/SearchInput'
import { Lead, LEAD_STATUSES, LEAD_PRIORITIES, PaginatedResponse } from '@/lib/types'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy,
        sortOrder,
      })
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      if (priorityFilter) params.set('priority', priorityFilter)

      const res = await fetch(`/api/leads?${params}`)
      const data: PaginatedResponse<Lead> = await res.json()
      
      setLeads(data.data)
      setPagination(p => ({ ...p, ...data.pagination }))
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.pageSize, search, statusFilter, priorityFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      fetchLeads()
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-500 mt-1">
              {pagination.totalItems} leads en total
            </p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors"
          >
            ← Dashboard
          </a>
        </motion.div>

        {/* Filters */}
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPagination(p => ({ ...p, page: 1 })) }}
              placeholder="Buscar por nombre, email, teléfono..."
            />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
              className="px-4 py-3 bg-white/50 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Todos los estados</option>
              {LEAD_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
              className="px-4 py-3 bg-white/50 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Todas las prioridades</option>
              {LEAD_PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('')
                setPriorityFilter('')
                setPagination(p => ({ ...p, page: 1 }))
              }}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50">
                  {[
                    { key: 'name', label: 'Nombre' },
                    { key: 'whatsapp', label: 'WhatsApp' },
                    { key: 'city', label: 'Ciudad' },
                    { key: 'niche', label: 'Nicho' },
                    { key: 'status', label: 'Estado' },
                    { key: 'priority', label: 'Prioridad' },
                    { key: 'created_at', label: 'Fecha' },
                  ].map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    >
                      {col.label}
                      {sortBy === col.key && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/30">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200/50 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron leads
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        {lead.email && (
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {lead.whatsapp || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {lead.city || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {lead.niche || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status || 'Nuevo'}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="bg-transparent border-none focus:outline-none cursor-pointer"
                        >
                          {LEAD_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {lead.priority && (
                          <StatusBadge status={lead.priority} type="priority" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {lead.created_at 
                          ? new Date(lead.created_at).toLocaleDateString('es-ES')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Ver detalle
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200/50 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} - {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} de {pagination.totalItems}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 bg-white/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 bg-white/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

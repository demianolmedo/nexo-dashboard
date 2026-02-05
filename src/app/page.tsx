'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

interface Stats {
  kpis: {
    totalLeads: number
    leadsWithWhatsapp: number
    contactedToday: number
    responseRate: number
  }
  funnel: {
    nuevo: number
    contactado: number
    interesado: number
    cliente: number
  }
  leadsByNiche: { name: string; value: number }[]
  recentLeads: any[]
  leadsPerDay: { date: string; count: number }[]
}

const COLORS = ['#0071E3', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5856D6']

const statusColors: Record<string, string> = {
  'Nuevo': 'bg-blue-100 text-blue-800',
  'Contactado': 'bg-yellow-100 text-yellow-800',
  'Interesado': 'bg-green-100 text-green-800',
  'Cliente': 'bg-purple-100 text-purple-800',
  'Perdido': 'bg-red-100 text-red-800'
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071E3]"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <p className="text-[#86868B]">Error al cargar datos</p>
      </div>
    )
  }

  const funnelData = [
    { name: 'Nuevo', value: stats.funnel.nuevo, color: '#0071E3' },
    { name: 'Contactado', value: stats.funnel.contactado, color: '#FF9500' },
    { name: 'Interesado', value: stats.funnel.interesado, color: '#34C759' },
    { name: 'Cliente', value: stats.funnel.cliente, color: '#AF52DE' }
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0071E3] to-[#5856D6] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#1D1D1F]">AgentesNexo</h1>
              <p className="text-xs text-[#86868B]">Dashboard CRM</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[#1D1D1F]">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-xs text-[#86868B]">
              {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: stats.kpis.totalLeads, icon: '👥', color: 'from-blue-500 to-blue-600' },
            { label: 'Con WhatsApp', value: stats.kpis.leadsWithWhatsapp, icon: '📱', color: 'from-green-500 to-green-600' },
            { label: 'Contactados Hoy', value: stats.kpis.contactedToday, icon: '✅', color: 'from-orange-500 to-orange-600' },
            { label: 'Tasa Respuesta', value: `${stats.kpis.responseRate}%`, icon: '📊', color: 'from-purple-500 to-purple-600' }
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg p-4"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${kpi.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}></div>
              <span className="text-2xl">{kpi.icon}</span>
              <p className="text-3xl font-bold text-[#1D1D1F] mt-2">{kpi.value}</p>
              <p className="text-sm text-[#86868B]">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Funnel & Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Funnel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-4">Funnel de Conversión</h2>
            <div className="space-y-3">
              {funnelData.map((stage, i) => {
                const maxValue = Math.max(...funnelData.map(d => d.value))
                const width = maxValue > 0 ? (stage.value / maxValue) * 100 : 0
                return (
                  <div key={stage.name} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-[#1D1D1F]">{stage.name}</span>
                      <span className="text-sm text-[#86868B]">{stage.value}</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-xl overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                        className="h-full rounded-xl"
                        style={{ backgroundColor: stage.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-4">Por Nicho</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.leadsByNiche}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.leadsByNiche.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {stats.leadsByNiche.map((item, i) => (
                <span key={item.name} className="flex items-center gap-1 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  {item.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-[#1D1D1F] mb-4">Leads Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[#86868B]">
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Ciudad</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Nicho</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium hidden md:table-cell">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentLeads.map(lead => (
                  <tr key={lead.id} className="text-sm">
                    <td className="py-3 font-medium text-[#1D1D1F]">{lead.name}</td>
                    <td className="py-3 text-[#86868B] hidden md:table-cell">{lead.city || '-'}</td>
                    <td className="py-3 text-[#86868B] hidden md:table-cell">{lead.niche || '-'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      {lead.whatsapp ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[#86868B]">
        AgentesNexo © 2026
      </footer>
    </div>
  )
}

'use client'

import { STATUS_COLORS, PRIORITY_COLORS } from '@/lib/types'

interface StatusBadgeProps {
  status: string
  type?: 'status' | 'priority'
}

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const colors = type === 'status' 
    ? STATUS_COLORS[status] || { bg: 'bg-gray-500/10', text: 'text-gray-600', border: 'border-gray-500/20' }
    : PRIORITY_COLORS[status] || { bg: 'bg-gray-500/10', text: 'text-gray-600' }

  return (
    <span className={`
      inline-flex items-center px-3 py-1 
      rounded-full text-xs font-medium
      ${colors.bg} ${colors.text}
      ${type === 'status' && 'border' in colors ? colors.border : ''}
      border
    `}>
      {status}
    </span>
  )
}

'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      className={`
        backdrop-blur-xl bg-white/70 
        border border-white/20 
        rounded-3xl shadow-lg
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

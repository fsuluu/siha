import React from 'react'
import { cn } from '@/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary'
  children: React.ReactNode
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium'

  const variants = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-secondary-100 text-secondary-800',
    secondary: 'bg-primary-100 text-primary-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-accent-100 text-accent-800',
    info: 'bg-primary-100 text-primary-800',
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  )
}
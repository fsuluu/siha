import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Configure drone and system settings</p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <p className="text-slate-500">Settings functionality coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
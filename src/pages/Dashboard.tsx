import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { TelemetryPanel } from '@/components/dashboard/TelemetryPanel'
import { ArenaMap } from '@/components/dashboard/ArenaMap'
import { WarningPanel } from '@/components/dashboard/WarningPanel'
import { FlightControls } from '@/components/dashboard/FlightControls'
import { SystemStatus } from '@/components/dashboard/SystemStatus'

export function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Real-time drone monitoring and control</p>
      </div>

      {/* Warning Panel - Critical alerts */}
      <WarningPanel />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Telemetry and Controls */}
        <div className="xl:col-span-2 space-y-6">
          {/* Telemetry Panel */}
          <TelemetryPanel />

          {/* Flight Controls */}
          <FlightControls />
        </div>

        {/* Right Column - Map and Status */}
        <div className="space-y-6">
          {/* Arena Map */}
          <ArenaMap />

          {/* System Status */}
          <SystemStatus />
        </div>
      </div>
    </motion.div>
  )
}
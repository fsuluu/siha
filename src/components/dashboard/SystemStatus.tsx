import React from 'react'
import { motion } from 'framer-motion'
import { useDroneStore } from '@/stores/droneStore'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatTimestamp } from '@/utils'
import {
  Cpu,
  HardDrive,
  Wifi,
  Camera,
  Battery,
  Activity,
  Thermometer,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react'

interface SystemStatus {
  name: string
  status: 'online' | 'warning' | 'offline' | 'error'
  value?: number
  unit?: string
  icon: React.ComponentType<{ className?: string }>
  details?: string
}

// Mock system data for demonstration
const mockSystemStatus: SystemStatus[] = [
  {
    name: 'CPU',
    status: 'online',
    value: 35,
    unit: '%',
    icon: Cpu,
    details: 'Temperature: 62°C',
  },
  {
    name: 'Memory',
    status: 'online',
    value: 67,
    unit: '%',
    icon: HardDrive,
    details: '4.2GB / 6.4GB used',
  },
  {
    name: 'Network',
    status: 'online',
    value: 85,
    unit: '%',
    icon: Wifi,
    details: 'Latency: 12ms',
  },
  {
    name: 'GPS',
    status: 'online',
    value: 12,
    unit: 'sats',
    icon: Activity,
    details: 'HDOP: 0.8',
  },
  {
    name: 'Camera',
    status: 'online',
    icon: Camera,
    details: '1080p @ 30fps',
  },
  {
    name: 'IMU',
    status: 'online',
    icon: Activity,
    details: 'Calibrated',
  },
]

const getStatusColor = (status: SystemStatus['status']) => {
  switch (status) {
    case 'online':
      return 'text-secondary-600 bg-secondary-100'
    case 'warning':
      return 'text-warning-600 bg-warning-100'
    case 'offline':
      return 'text-slate-600 bg-slate-100'
    case 'error':
      return 'text-accent-600 bg-accent-100'
  }
}

const getStatusBadge = (status: SystemStatus['status']) => {
  switch (status) {
    case 'online':
      return 'success' as const
    case 'warning':
      return 'warning' as const
    case 'offline':
      return 'default' as const
    case 'error':
      return 'error' as const
  }
}

const getStatusIcon = (status: SystemStatus['status']) => {
  switch (status) {
    case 'online':
      return <CheckCircle className="w-4 h-4" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4" />
    case 'offline':
      return <XCircle className="w-4 h-4" />
    case 'error':
      return <XCircle className="w-4 h-4" />
  }
}

export function SystemStatus() {
  const { connected, lastUpdate } = useDroneStore()

  const getStatusValueColor = (value: number, type: string) => {
    if (type === 'CPU' || type === 'Memory') {
      if (value > 80) return 'text-accent-600'
      if (value > 60) return 'text-warning-600'
      return 'text-secondary-600'
    }
    if (type === 'Network') {
      if (value > 70) return 'text-secondary-600'
      if (value > 40) return 'text-warning-600'
      return 'text-accent-600'
    }
    if (type === 'GPS') {
      if (value >= 8) return 'text-secondary-600'
      if (value >= 5) return 'text-warning-600'
      return 'text-accent-600'
    }
    return 'text-slate-600'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Status
          </h2>
          <Badge variant={connected ? "success" : "error"} className="text-xs">
            {connected ? 'All Systems' : 'Offline'}
          </Badge>
        </div>
        {lastUpdate && (
          <p className="text-xs text-slate-500 mt-1">
            Last update: {formatTimestamp(lastUpdate)}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockSystemStatus.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    {item.details && (
                      <p className="text-xs text-slate-500">{item.details}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.value !== undefined && (
                    <span
                      className={`text-sm font-mono font-medium ${getStatusValueColor(
                        item.value,
                        item.name
                      )}`}
                    >
                      {item.value}{item.unit}
                    </span>
                  )}
                  <Badge variant={getStatusBadge(item.status)} className="text-xs">
                    {getStatusIcon(item.status)}
                  </Badge>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* System Summary */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-secondary-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-secondary-700">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Operational</span>
              </div>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                {mockSystemStatus.filter(s => s.status === 'online').length}
              </p>
            </div>
            <div className="bg-warning-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-warning-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Warnings</span>
              </div>
              <p className="text-2xl font-bold text-warning-900 mt-1">
                {mockSystemStatus.filter(s => s.status === 'warning').length}
              </p>
            </div>
          </div>
        </div>

        {/* System Actions */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">System diagnostics</p>
            <div className="flex items-center space-x-2">
              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                Run Diagnostics
              </button>
              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                Export Logs
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
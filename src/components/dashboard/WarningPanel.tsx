import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDroneStore } from '@/stores/droneStore'
import { AlertTriangle, Battery, Wifi, MapPin, X, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Warning {
  id: string
  type: 'boundary' | 'battery' | 'signal' | 'system' | 'nofly'
  severity: 'warning' | 'critical'
  title: string
  message: string
  timestamp: Date
  dismissible: boolean
  acknowledged: boolean
}

export function WarningPanel() {
  const { telemetry, emergencyStatus } = useDroneStore()
  const [warnings, setWarnings] = useState<Warning[]>([])

  // Generate warnings based on telemetry data
  useEffect(() => {
    if (!telemetry) return

    const newWarnings: Warning[] = []

    // Battery warnings
    if (telemetry.battery.percentage <= 10 && telemetry.battery.percentage > 0) {
      newWarnings.push({
        id: 'battery-critical',
        type: 'battery',
        severity: 'critical',
        title: 'Critical Battery Level',
        message: `Battery at ${telemetry.battery.percentage.toFixed(0)}% - Land immediately`,
        timestamp: new Date(),
        dismissible: false,
        acknowledged: false,
      })
    } else if (telemetry.battery.percentage <= 20 && telemetry.battery.percentage > 10) {
      newWarnings.push({
        id: 'battery-low',
        type: 'battery',
        severity: 'warning',
        title: 'Low Battery',
        message: `Battery at ${telemetry.battery.percentage.toFixed(0)}% - Consider returning`,
        timestamp: new Date(),
        dismissible: true,
        acknowledged: false,
      })
    }

    // Signal warnings
    if (telemetry.signals.connectionQuality <= 30) {
      newWarnings.push({
        id: 'signal-poor',
        type: 'signal',
        severity: 'critical',
        title: 'Poor Connection Quality',
        message: `Signal strength at ${telemetry.signals.connectionQuality}% - Risk of disconnection`,
        timestamp: new Date(),
        dismissible: false,
        acknowledged: false,
      })
    } else if (telemetry.signals.connectionQuality <= 50) {
      newWarnings.push({
        id: 'signal-weak',
        type: 'signal',
        severity: 'warning',
        title: 'Weak Connection',
        message: `Signal strength at ${telemetry.signals.connectionQuality}%`,
        timestamp: new Date(),
        dismissible: true,
        acknowledged: false,
      })
    }

    // Emergency status
    if (emergencyStatus) {
      newWarnings.push({
        id: 'emergency-active',
        type: 'system',
        severity: 'critical',
        title: 'EMERGENCY ACTIVATED',
        message: 'Emergency protocols are active - Drone in emergency state',
        timestamp: new Date(),
        dismissible: false,
        acknowledged: false,
      })
    }

    setWarnings(newWarnings)
  }, [telemetry, emergencyStatus])

  const dismissWarning = (id: string) => {
    setWarnings(prev =>
      prev.map(warning =>
        warning.id === id ? { ...warning, acknowledged: true } : warning
      )
    )
  }

  const getWarningIcon = (type: Warning['type']) => {
    switch (type) {
      case 'battery':
        return <Battery className="w-5 h-5" />
      case 'signal':
        return <Wifi className="w-5 h-5" />
      case 'boundary':
      case 'nofly':
        return <MapPin className="w-5 h-5" />
      case 'system':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getWarningStyles = (severity: Warning['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-accent-50 border-accent-200 text-accent-800'
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getBadgeVariant = (severity: Warning['severity']) => {
    switch (severity) {
      case 'critical':
        return 'error' as const
      case 'warning':
        return 'warning' as const
      default:
        return 'info' as const
    }
  }

  const activeWarnings = warnings.filter(w => !w.acknowledged)
  const criticalWarnings = activeWarnings.filter(w => w.severity === 'critical')

  return (
    <AnimatePresence>
      {activeWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="rounded-2xl border-2 overflow-hidden"
        >
          {/* Critical alerts - Always visible banner */}
          {criticalWarnings.length > 0 && (
            <div className="bg-accent-600 text-white p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-pulse" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">CRITICAL ALERTS</h3>
                  <div className="mt-2 space-y-1">
                    {criticalWarnings.map(warning => (
                      <div key={warning.id} className="text-sm opacity-90">
                        {warning.title}: {warning.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning list */}
          <div className={`bg-white border-2 ${criticalWarnings.length > 0 ? 'border-t-0 border-accent-200' : 'border-slate-200'}`}>
            <div className="divide-y divide-slate-100">
              {activeWarnings.map((warning) => {
                const Icon = getWarningIcon(warning.type)
                return (
                  <motion.div
                    key={warning.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 ${getWarningStyles(warning.severity)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-sm">{warning.title}</h4>
                          <Badge variant={getBadgeVariant(warning.severity)} className="text-xs">
                            {warning.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1 opacity-90">{warning.message}</p>
                        <p className="text-xs mt-2 opacity-75">
                          {warning.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {warning.dismissible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissWarning(warning.id)}
                          className="p-1 opacity-75 hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
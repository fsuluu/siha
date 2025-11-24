import React from 'react'
import { motion } from 'framer-motion'
import { useDroneStore } from '@/stores/droneStore'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCoordinates, formatSpeed, getCardinalDirection, getBatteryColor } from '@/utils'
import {
  MapPin,
  Activity,
  Gauge,
  Compass,
  Battery,
  Wifi,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'

export function TelemetryPanel() {
  const { telemetry, connected } = useDroneStore()

  const getTrendIcon = (value: number, threshold = 0.1) => {
    if (value > threshold) return <TrendingUp className="w-4 h-4 text-secondary-600" />
    if (value < -threshold) return <TrendingDown className="w-4 h-4 text-accent-600" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  if (!telemetry || !connected) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Telemetry Data
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Waiting for telemetry data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Telemetry Data
          </h2>
          <Badge variant={connected ? "success" : "error"}>
            {connected ? 'Live' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary Metrics */}
          <div className="space-y-4">
            {/* GPS Position */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-primary-100 rounded-lg">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">GPS Position</p>
                <p className="text-lg font-mono text-slate-700">
                  {formatCoordinates(telemetry.position.latitude, telemetry.position.longitude)}
                </p>
                {telemetry.position.accuracy && (
                  <p className="text-xs text-slate-500">
                    Accuracy: ±{telemetry.position.accuracy.toFixed(1)}m
                  </p>
                )}
              </div>
            </motion.div>

            {/* Altitude */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Activity className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Altitude</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-mono text-slate-700">
                    {telemetry.position.altitude.toFixed(1)}m
                  </p>
                  {telemetry.velocity.verticalSpeed && (
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(telemetry.velocity.verticalSpeed)}
                      <span className="text-xs text-slate-500">
                        {Math.abs(telemetry.velocity.verticalSpeed).toFixed(1)}m/s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Speed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-warning-100 rounded-lg">
                <Gauge className="w-6 h-6 text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Ground Speed</p>
                <p className="text-lg font-mono text-slate-700">
                  {formatSpeed(telemetry.velocity.speed, 'km/h')}
                </p>
                <p className="text-xs text-slate-500">
                  {formatSpeed(telemetry.velocity.speed, 'm/s')}
                </p>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-slate-100 rounded-lg">
                <Compass className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Heading</p>
                <p className="text-lg font-mono text-slate-700">
                  {telemetry.velocity.heading.toFixed(0)}° {getCardinalDirection(telemetry.velocity.heading)}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Secondary Metrics */}
          <div className="space-y-4">
            {/* Battery Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className={`p-3 rounded-lg ${getBatteryColor(telemetry.battery.percentage) === 'text-secondary-600' ? 'bg-secondary-100' : getBatteryColor(telemetry.battery.percentage) === 'text-warning-600' ? 'bg-warning-100' : 'bg-accent-100'}`}>
                <Battery className={`w-6 h-6 ${getBatteryColor(telemetry.battery.percentage)}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Battery</p>
                <div className="flex items-center space-x-2">
                  <p className={`text-lg font-mono font-bold ${getBatteryColor(telemetry.battery.percentage)}`}>
                    {telemetry.battery.percentage.toFixed(0)}%
                  </p>
                  <span className="text-sm text-slate-500">{telemetry.battery.voltage.toFixed(1)}V</span>
                </div>
                {telemetry.battery.remainingTime && (
                  <p className="text-xs text-slate-500">
                    ~{Math.floor(telemetry.battery.remainingTime / 60)}min remaining
                  </p>
                )}
              </div>
            </motion.div>

            {/* Flight Mode */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-primary-100 rounded-lg">
                <Activity className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Flight Mode</p>
                <Badge variant="info" className="text-xs">
                  {telemetry.flightMode.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </motion.div>

            {/* Connection Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-slate-100 rounded-lg">
                <Wifi className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Connection</p>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-4 rounded-full ${
                          i < Math.ceil(telemetry.signals.connectionQuality / 25)
                            ? 'bg-secondary-500'
                            : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{telemetry.signals.latency}ms</span>
                </div>
              </div>
            </motion.div>

            {/* System Time */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-slate-100 rounded-lg">
                <Clock className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">System Time</p>
                <p className="text-lg font-mono text-slate-700">
                  {telemetry.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
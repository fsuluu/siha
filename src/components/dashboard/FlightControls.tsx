import React from 'react'
import { motion } from 'framer-motion'
import { useDroneStore } from '@/stores/droneStore'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FlightMode } from '@/types'
import {
  Gamepad2,
  Navigation,
  Zap,
  Home,
  Square,
  Pause,
  Play,
  AlertTriangle,
} from 'lucide-react'

const flightModeButtons = [
  {
    mode: FlightMode.MANUAL,
    label: 'Manual',
    description: 'Direct control',
    icon: Gamepad2,
    color: 'bg-slate-600 hover:bg-slate-700',
  },
  {
    mode: FlightMode.AUTONOMOUS,
    label: 'Autonomous',
    description: 'Pre-programmed path',
    icon: Navigation,
    color: 'bg-primary-600 hover:bg-primary-700',
  },
  {
    mode: FlightMode.GUIDED,
    label: 'Guided',
    description: 'Waypoint navigation',
    icon: Zap,
    color: 'bg-secondary-600 hover:bg-secondary-700',
  },
] as const

export function FlightControls() {
  const { telemetry, changeFlightMode, emergencyStop, returnToHome, connected, emergencyStatus } = useDroneStore()

  const handleModeChange = (mode: FlightMode) => {
    if (!connected) return
    changeFlightMode(mode)
  }

  const handleEmergencyStop = () => {
    if (!connected) return
    emergencyStop()
  }

  const handleReturnToHome = () => {
    if (!connected) return
    returnToHome()
  }

  const getCurrentModeInfo = () => {
    return flightModeButtons.find(btn => btn.mode === telemetry?.flightMode) || flightModeButtons[0]
  }

  const currentMode = getCurrentModeInfo()
  const CurrentModeIcon = currentMode.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Gamepad2 className="w-5 h-5 mr-2" />
            Flight Controls
          </h2>
          <Badge variant={connected ? "success" : "error"} className="text-xs">
            {connected ? 'Connected' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Connect to drone to enable controls</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Mode Display */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${currentMode.color} text-white`}>
                    <CurrentModeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Current Mode</p>
                    <p className="text-xs text-slate-600">{currentMode.description}</p>
                  </div>
                </div>
                <Badge variant="info" className="text-sm px-3 py-1">
                  {currentMode.label}
                </Badge>
              </div>
            </div>

            {/* Flight Mode Buttons */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Flight Modes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {flightModeButtons.map(({ mode, label, description, icon: Icon, color }) => (
                  <motion.div key={mode} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleModeChange(mode)}
                      disabled={mode === telemetry?.flightMode || emergencyStatus}
                      className={`w-full h-auto p-4 flex flex-col items-center space-y-2 text-white ${color} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Icon className="w-6 h-6" />
                      <div className="text-center">
                        <p className="font-medium">{label}</p>
                        <p className="text-xs opacity-90">{description}</p>
                      </div>
                      {mode === telemetry?.flightMode && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Emergency Controls */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent-600" />
                <h3 className="text-sm font-medium text-slate-700">Emergency Actions</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleReturnToHome}
                    disabled={emergencyStatus || telemetry?.flightMode === FlightMode.RETURN_TO_HOME}
                    variant="secondary"
                    className="w-full h-auto p-4 flex items-center justify-center space-x-2"
                  >
                    <Home className="w-5 h-5" />
                    <span>Return to Home</span>
                    {telemetry?.flightMode === FlightMode.RETURN_TO_HOME && (
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
                    )}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleEmergencyStop}
                    disabled={emergencyStatus}
                    variant="danger"
                    className="w-full h-auto p-4 flex items-center justify-center space-x-2"
                  >
                    <Square className="w-5 h-5" />
                    <span>Emergency Stop</span>
                    {emergencyStatus && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Additional Controls */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button variant="ghost" size="sm" className="p-3">
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
                <Button variant="ghost" size="sm" className="p-3">
                  <Play className="w-4 h-4 mr-1" />
                  Resume
                </Button>
                <Button variant="ghost" size="sm" className="p-3">
                  <Navigation className="w-4 h-4 mr-1" />
                  Hold
                </Button>
                <Button variant="ghost" size="sm" className="p-3">
                  <Home className="w-4 h-4 mr-1" />
                  Land
                </Button>
              </div>
            </div>

            {/* Status Messages */}
            {emergencyStatus && (
              <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-accent-600 animate-pulse" />
                  <div>
                    <p className="font-medium text-accent-800">Emergency Active</p>
                    <p className="text-sm text-accent-700">
                      Drone motors will stop immediately. Verify this action.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
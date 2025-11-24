import React from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'
import { useDroneStore } from '@/stores/droneStore'
import { X, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDuration, getBatteryColor } from '@/utils'
import { LockOnIndicator } from '@/components/video/LockOnIndicator'
import { QRStatusPanel } from '@/components/dashboard/QRStatus'

export function RightPanel() {
  const { setRightPanelVisible, videoSettings } = useUIStore()
  const { telemetry, lockOnData, connected, emergencyStatus } = useDroneStore()

  const toggleFullscreen = () => {
    // Implementation for fullscreen video
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Live Feeds</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelVisible(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Connection Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-secondary-500 animate-pulse' : 'bg-accent-500'}`} />
                <span className="text-sm font-medium text-slate-900">
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {emergencyStatus && (
                <Badge variant="error">Emergency</Badge>
              )}
            </div>
            {telemetry && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Battery: </span>
                  <span className={`font-medium ${getBatteryColor(telemetry.battery.percentage)}`}>
                    {telemetry.battery.percentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Altitude: </span>
                  <span className="font-medium text-slate-900">
                    {telemetry.position.altitude.toFixed(1)}m
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Speed: </span>
                  <span className="font-medium text-slate-900">
                    {(telemetry.velocity.speed * 3.6).toFixed(1)}km/h
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Mode: </span>
                  <span className="font-medium text-slate-900">
                    {telemetry.flightMode}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Feed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Camera Feed</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
              {/* Placeholder for video feed */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-slate-600 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Connecting to camera...</p>
                </div>
              </div>

              {/* Lock-on overlay */}
              {videoSettings.showOverlay && <LockOnIndicator data={lockOnData} />}
            </div>
          </CardContent>
        </Card>

        {/* QR Scanner Status */}
        <QRStatusPanel />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <Button variant="secondary" size="sm" className="w-full">
              Take Screenshot
            </Button>
            <Button
              variant={videoSettings.recording ? "danger" : "ghost"}
              size="sm"
              className="w-full"
            >
              {videoSettings.recording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </CardContent>
        </Card>

        {/* Event Timeline */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900">Recent Events</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-900">Telemetry connected</p>
                  <p className="text-xs text-slate-500">2 seconds ago</p>
                </div>
              </div>
              {lockOnData.locked && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2 animate-pulse" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-900">Target locked</p>
                    <p className="text-xs text-slate-500">
                      Duration: {formatDuration(lockOnData.lockDuration)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
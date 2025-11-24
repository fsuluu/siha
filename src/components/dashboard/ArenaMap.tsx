import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDroneStore } from '@/stores/droneStore'
import { useUIStore } from '@/stores/uiStore'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCoordinates } from '@/utils'
import {
  Map,
  Navigation,
  Maximize2,
  Settings,
  Eye,
  EyeOff,
  Target,
  AlertTriangle,
} from 'lucide-react'

// Mock arena data for demonstration
const mockArena = {
  boundaries: [
    [40.7128, -74.0060], // NYC coordinates for demo
    [40.7135, -74.0050],
    [40.7130, -74.0040],
    [40.7120, -74.0045],
  ],
  noFlyZones: [
    {
      id: 'nfz1',
      name: 'Restricted Area A',
      center: [40.7125, -74.0050],
      radius: 100, // meters
    },
  ],
  qrTargets: [
    {
      id: 'qr1',
      position: [40.7123, -74.0055],
      active: true,
    },
  ],
}

export function ArenaMap() {
  const { telemetry, connected } = useDroneStore()
  const { mapSettings, updateMapSettings } = useUIStore()
  const mapRef = useRef<HTMLDivElement>(null)

  // Mock drone position for demo
  const mockDronePosition = {
    lat: 40.7124,
    lng: -74.0052,
  }

  const handleToggleOverlay = (setting: keyof typeof mapSettings) => {
    updateMapSettings({ [setting]: !mapSettings[setting] })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center">
            <Map className="w-5 h-5 mr-2" />
            Arena Map
          </h2>
          <div className="flex items-center space-x-2">
            <Badge variant={connected ? "success" : "error"}>
              {connected ? 'GPS Lock' : 'No Signal'}
            </Badge>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleOverlay('showGrid')}
              className={mapSettings.showGrid ? 'text-primary-600' : 'text-slate-400'}
            >
              {mapSettings.showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="ml-1 text-xs">Grid</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleOverlay('showDistanceRings')}
              className={mapSettings.showDistanceRings ? 'text-primary-600' : 'text-slate-400'}
            >
              {mapSettings.showDistanceRings ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="ml-1 text-xs">Rings</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleOverlay('showTrail')}
              className={mapSettings.showTrail ? 'text-primary-600' : 'text-slate-400'}
            >
              {mapSettings.showTrail ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="ml-1 text-xs">Trail</span>
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Map Container */}
          <div
            ref={mapRef}
            className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200"
          >
            {/* Mock map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200" />

            {/* Grid overlay */}
            {mapSettings.showGrid && (
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-30">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className="border border-slate-300" />
                ))}
              </div>
            )}

            {/* Distance rings */}
            {mapSettings.showDistanceRings && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 border-2 border-slate-300 rounded-full" />
                  <div className="absolute inset-4 border-2 border-slate-300 rounded-full" />
                  <div className="absolute inset-8 border-2 border-slate-300 rounded-full" />
                </div>
              </div>
            )}

            {/* No-fly zones */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {mockArena.noFlyZones.map((zone) => (
                <g key={zone.id}>
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    fill="rgba(220, 38, 38, 0.2)"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    className="fill-red-600 text-xs font-medium"
                  >
                    {zone.name}
                  </text>
                </g>
              ))}
            </svg>

            {/* QR Targets */}
            {mockArena.qrTargets.map((target) => (
              target.active && (
                <div
                  key={target.id}
                  className="absolute w-4 h-4 bg-secondary-500 rounded-sm border-2 border-white shadow-lg animate-pulse"
                  style={{
                    top: '30%',
                    left: '70%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Target className="w-3 h-3 text-white m-0.5" />
                </div>
              )
            ))}

            {/* Drone Position */}
            {connected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute w-6 h-6 bg-primary-500 rounded-full border-2 border-white shadow-lg"
                style={{
                  top: '45%',
                  left: '55%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Navigation className="w-4 h-4 text-white m-1 rotate-45" />
              </motion.div>
            )}

            {/* Flight trail (mock) */}
            {mapSettings.showTrail && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 20% 80% Q 30% 60%, 45% 50% T 55% 45%"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  strokeDasharray="4,2"
                />
              </svg>
            )}

            {/* Status overlay */}
            <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-lg p-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-secondary-500' : 'bg-accent-500'}`} />
                <span className="font-medium">
                  {connected ? 'Position: Locked' : 'Position: Searching'}
                </span>
              </div>
              {connected && (
                <div className="mt-1 text-slate-600">
                  {formatCoordinates(mockDronePosition.lat, mockDronePosition.lng)}
                </div>
              )}
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full" />
              <span className="text-slate-600">Your Drone</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary-500 rounded-sm" />
              <span className="text-slate-600">QR Target</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-500 opacity-30 rounded-full" />
              <span className="text-slate-600">No-Fly Zone</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
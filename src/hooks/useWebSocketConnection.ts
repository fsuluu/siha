import { useEffect, useRef } from 'react'
import { useDroneStore } from '@/stores/droneStore'
import { startMockTelemetryUpdates } from '@/services/mockDataService'

export function useWebSocketConnection() {
  const { updateTelemetry, setConnected } = useDroneStore()
  const intervalRef = useRef<(() => void) | null>()

  useEffect(() => {
    // Simulate WebSocket connection with mock data
    console.log('Starting simulated telemetry updates...')

    // Simulate connection delay
    const connectionTimeout = setTimeout(() => {
      setConnected(true)

      // Start mock telemetry updates
      const stopUpdates = startMockTelemetryUpdates((telemetry) => {
        updateTelemetry(telemetry)
      }, 2000) // Update every 2 seconds

      intervalRef.current = stopUpdates
    }, 1500) // 1.5 second connection delay

    return () => {
      clearTimeout(connectionTimeout)
      if (intervalRef.current) {
        intervalRef.current()
      }
    }
  }, [updateTelemetry, setConnected])
}
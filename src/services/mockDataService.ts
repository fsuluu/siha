import { TelemetryData, FlightMode, DroneStatus } from '@/types'

// Generate mock telemetry data for demonstration
export function generateMockTelemetry(): TelemetryData {
  const now = new Date()

  return {
    droneId: 'DRONE-001',
    timestamp: now,
    position: {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.001, // Small random variation
      longitude: -74.0060 + (Math.random() - 0.5) * 0.001,
      altitude: 100 + Math.random() * 50, // 100-150m
      accuracy: 0.5 + Math.random() * 1.5, // 0.5-2m
    },
    velocity: {
      speed: 5 + Math.random() * 10, // 5-15 m/s
      heading: Math.random() * 360, // 0-360 degrees
      verticalSpeed: (Math.random() - 0.5) * 2, // -1 to 1 m/s
    },
    battery: {
      percentage: 85 - Math.random() * 10, // 75-85%
      voltage: 12.6 + Math.random() * 0.4, // 12.6-13.0V
      current: 15 + Math.random() * 5, // 15-20A
      remainingTime: 1200 + Math.random() * 600, // 20-30 minutes
    },
    signals: {
      gpsStrength: 8 + Math.floor(Math.random() * 5), // 8-12 satellites
      connectionQuality: 70 + Math.random() * 25, // 70-95%
      latency: 10 + Math.random() * 20, // 10-30ms
    },
    flightMode: FlightMode.AUTONOMOUS,
    status: DroneStatus.FLYING,
  }
}

// Simulate real-time telemetry updates
export function startMockTelemetryUpdates(callback: (data: TelemetryData) => void, interval = 1000) {
  const updateInterval = setInterval(() => {
    const telemetry = generateMockTelemetry()
    callback(telemetry)
  }, interval)

  return () => clearInterval(updateInterval)
}
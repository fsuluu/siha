import { create } from 'zustand'
import { TelemetryData, LockOnData, QRDetectionData, Arena, SystemDiagnostics, FlightMode } from '@/types'

interface DroneStore {
  // Current drone state
  droneId: string
  telemetry: TelemetryData | null
  lockOnData: LockOnData
  qrDetectionData: QRDetectionData
  arena: Arena | null
  diagnostics: SystemDiagnostics | null

  // Connection and status
  connected: boolean
  lastUpdate: Date | null
  emergencyStatus: boolean

  // Actions
  setDroneId: (id: string) => void
  updateTelemetry: (telemetry: TelemetryData) => void
  updateLockOn: (data: LockOnData) => void
  updateQRDetection: (data: QRDetectionData) => void
  setArena: (arena: Arena) => void
  updateDiagnostics: (diagnostics: SystemDiagnostics) => void
  setConnected: (connected: boolean) => void
  setEmergencyStatus: (emergency: boolean) => void
  changeFlightMode: (mode: FlightMode) => void
  emergencyStop: () => void
  returnToHome: () => void
  reset: () => void
}

const initialLockOnData: LockOnData = {
  detected: false,
  locked: false,
  boundingBox: { x: 0, y: 0, width: 0, height: 0 },
  confidence: 0,
  lockDuration: 0,
}

const initialQRData: QRDetectionData = {
  detected: false,
  timestamp: new Date(),
  validated: false,
  transmitted: false,
}

export const useDroneStore = create<DroneStore>((set, get) => ({
  // Initial state
  droneId: '',
  telemetry: null,
  lockOnData: initialLockOnData,
  qrDetectionData: initialQRData,
  arena: null,
  diagnostics: null,
  connected: false,
  lastUpdate: null,
  emergencyStatus: false,

  // Actions
  setDroneId: (id) =>
    set(() => ({
      droneId: id,
    })),

  updateTelemetry: (telemetry) =>
    set(() => ({
      telemetry,
      lastUpdate: new Date(),
    })),

  updateLockOn: (data) =>
    set(() => ({
      lockOnData: data,
    })),

  updateQRDetection: (data) =>
    set(() => ({
      qrDetectionData: data,
    })),

  setArena: (arena) =>
    set(() => ({
      arena,
    })),

  updateDiagnostics: (diagnostics) =>
    set(() => ({
      diagnostics,
    })),

  setConnected: (connected) =>
    set(() => ({
      connected,
    })),

  setEmergencyStatus: (emergency) =>
    set(() => ({
      emergencyStatus: emergency,
    })),

  changeFlightMode: (mode) => {
    const state = get()
    if (state.telemetry) {
      set({
        telemetry: {
          ...state.telemetry,
          flightMode: mode,
        },
      })
    }
  },

  emergencyStop: () => {
    const state = get()
    if (state.telemetry) {
      set({
        telemetry: {
          ...state.telemetry,
          flightMode: FlightMode.EMERGENCY_STOP,
        },
        emergencyStatus: true,
      })
    }
  },

  returnToHome: () => {
    const state = get()
    if (state.telemetry) {
      set({
        telemetry: {
          ...state.telemetry,
          flightMode: FlightMode.RETURN_TO_HOME,
        },
      })
    }
  },

  reset: () =>
    set(() => ({
      droneId: '',
      telemetry: null,
      lockOnData: initialLockOnData,
      qrDetectionData: initialQRData,
      arena: null,
      diagnostics: null,
      connected: false,
      lastUpdate: null,
      emergencyStatus: false,
    })),
}))
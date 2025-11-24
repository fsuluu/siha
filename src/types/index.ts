// Core telemetry data structures
export interface TelemetryData {
  droneId: string
  timestamp: Date
  position: {
    latitude: number
    longitude: number
    altitude: number
    accuracy?: number
  }
  velocity: {
    speed: number // m/s
    heading: number // degrees (0-360)
    verticalSpeed?: number // m/s
  }
  battery: {
    percentage: number
    voltage: number
    current?: number
    remainingTime?: number // seconds
  }
  signals: {
    gpsStrength: number // satellites
    connectionQuality: number // 0-100%
    latency: number // ms
  }
  flightMode: FlightMode
  status: DroneStatus
}

export enum FlightMode {
  MANUAL = 'manual',
  AUTONOMOUS = 'autonomous',
  GUIDED = 'guided',
  RETURN_TO_HOME = 'return_to_home',
  EMERGENCY_STOP = 'emergency_stop',
}

export enum DroneStatus {
  LANDED = 'landed',
  TAKEOFF = 'takeoff',
  FLYING = 'flying',
  LANDING = 'landing',
  EMERGENCY = 'emergency',
  LOST_CONNECTION = 'lost_connection',
}

// Arena and map data
export interface Arena {
  id: string
  name: string
  boundaries: {
    type: 'polygon' | 'circle'
    coordinates: [number, number][] // [lat, lng]
    radius?: number // for circle boundaries
  }
  noFlyZones: NoFlyZone[]
  qrTargets: QRTarget[]
}

export interface NoFlyZone {
  id: string
  name: string
  type: 'polygon' | 'circle'
  coordinates: [number, number][]
  radius?: number
  altitude?: {
    min?: number
    max?: number
  }
}

export interface QRTarget {
  id: string
  position: {
    latitude: number
    longitude: number
    altitude?: number
  }
  value?: string
  active: boolean
}

// Video and detection data
export interface VideoStream {
  id: string
  droneId: string
  type: 'main' | 'qr_scanner' | 'thermal'
  url: string
  quality: VideoQuality
  status: StreamStatus
}

export interface VideoQuality {
  resolution: string // '720p', '1080p', etc.
  fps: number
  bitrate?: number
}

export enum StreamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CONNECTING = 'connecting',
  ERROR = 'error',
}

export interface LockOnData {
  targetId?: string
  detected: boolean
  locked: boolean
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence: number // 0-100%
  lockDuration: number // seconds
  targetInfo?: {
    distance: number // meters
    relativePosition: {
      azimuth: number // degrees
      elevation: number // degrees
    }
    speed?: number // m/s
  }
}

export interface QRDetectionData {
  detected: boolean
  value?: string
  timestamp: Date
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  validated: boolean
  transmitted: boolean
}

// Log and history data
export interface TelemetryLog {
  id: string
  timestamp: Date
  droneId: string
  eventType: LogEventType
  severity: LogSeverity
  position?: {
    latitude: number
    longitude: number
    altitude: number
  }
  details: Record<string, any>
  duration?: number // for ongoing events
}

export enum LogEventType {
  FLIGHT_MODE_CHANGE = 'flight_mode_change',
  TAKEOFF = 'takeoff',
  LANDING = 'landing',
  LOCK_ON = 'lock_on',
  LOCK_RELEASE = 'lock_release',
  QR_DETECTED = 'qr_detected',
  QR_VALIDATED = 'qr_validated',
  BOUNDARY_VIOLATION = 'boundary_violation',
  NO_FLY_ZONE_ENTRY = 'no_fly_zone_entry',
  LOW_BATTERY = 'low_battery',
  CONNECTION_LOST = 'connection_lost',
  CONNECTION_RESTORED = 'connection_restored',
  EMERGENCY = 'emergency',
  SYSTEM_ERROR = 'system_error',
}

export enum LogSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Settings and configuration
export interface DroneConfiguration {
  flightLimits: {
    maxAltitude: number
    maxSpeed: number
    maxDistance: number
  }
  geofence: {
    enabled: boolean
    boundaries?: [number, number][]
    radius?: number
  }
  returnToHome: {
    enabled: boolean
    altitude: number
    speed: number
    triggerConditions: {
      lowBattery: boolean
      signalLoss: boolean
      manualTrigger: boolean
    }
  }
  autonomousMode: {
    waypoints: Waypoint[]
    behaviors: {
      hoverOnWaypoint: boolean
      avoidObstacles: boolean
      maintainAltitude: boolean
    }
  }
  safety: {
    emergencyProcedures: {
      autoLandOnCriticalBattery: boolean
      returnOnSignalLoss: boolean
      emergencyStop: boolean
    }
    pidGains?: {
      roll: { p: number; i: number; d: number }
      pitch: { p: number; i: number; d: number }
      yaw: { p: number; i: number; d: number }
    }
  }
}

export interface Waypoint {
  id: string
  position: {
    latitude: number
    longitude: number
    altitude: number
  }
  actions: string[] // 'hover', 'scan', 'take_photo', etc.
  timeout?: number
}

export interface SystemDiagnostics {
  performance: {
    cpu: {
      usage: number
      temperature?: number
    }
    memory: {
      used: number
      available: number
      percentage: number
    }
    gpu?: {
      usage: number
      memory?: {
        used: number
        total: number
      }
    }
  }
  components: {
    cameras: ComponentStatus[]
    gps: ComponentStatus
    imu: ComponentStatus
    battery: ComponentStatus
    communication: ComponentStatus
  }
  network: {
    connectionType: string
    quality: number
    bandwidth?: {
      upload: number
      download: number
    }
    latency: number
  }
}

export interface ComponentStatus {
  status: 'online' | 'offline' | 'error' | 'warning'
  quality?: number
  lastUpdate: Date
  details?: Record<string, any>
}

// UI state management
export interface UIState {
  sidebarCollapsed: boolean
  rightPanelVisible: boolean
  currentPage: string
  theme: 'light' | 'dark' | 'auto'
  mapSettings: {
    showGrid: boolean
    showDistanceRings: boolean
    showBearingLines: boolean
    showTrail: boolean
    trailDuration: number // seconds
    mapStyle: 'satellite' | 'street' | 'hybrid'
  }
  videoSettings: {
    showOverlay: boolean
    recording: boolean
    quality: string
    fullscreen: boolean
    pictureInPicture: boolean
  }
}

// WebSocket messages
export interface WebSocketMessage {
  type: string
  timestamp: Date
  droneId?: string
  data: any
}

export interface TelemetryUpdate extends WebSocketMessage {
  type: 'telemetry_update'
  data: TelemetryData
}

export interface LockOnEvent extends WebSocketMessage {
  type: 'lock_on_event'
  data: LockOnData
}

export interface QRDetectionEvent extends WebSocketMessage {
  type: 'qr_detection_event'
  data: QRDetectionData
}

export interface SystemAlert extends WebSocketMessage {
  type: 'system_alert'
  data: {
    severity: LogSeverity
    message: string
    details?: Record<string, any>
  }
}
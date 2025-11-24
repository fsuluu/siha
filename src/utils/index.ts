import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format utility functions
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`
}

export function formatSpeed(speed: number, unit: 'm/s' | 'km/h' | 'mph' = 'm/s'): string {
  switch (unit) {
    case 'km/h':
      return `${(speed * 3.6).toFixed(1)} km/h`
    case 'mph':
      return `${(speed * 2.237).toFixed(1)} mph`
    default:
      return `${speed.toFixed(1)} m/s`
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTimestamp(date)}`
}

export function getBatteryColor(percentage: number): string {
  if (percentage > 50) return 'text-secondary-600'
  if (percentage > 20) return 'text-warning-600'
  return 'text-accent-600'
}

export function getBatteryBgColor(percentage: number): string {
  if (percentage > 50) return 'bg-secondary-500'
  if (percentage > 20) return 'bg-warning-500'
  return 'bg-accent-500'
}

export function getSignalStrength(quality: number): { label: string; color: string } {
  if (quality >= 80) return { label: 'Excellent', color: 'text-secondary-600' }
  if (quality >= 60) return { label: 'Good', color: 'text-primary-600' }
  if (quality >= 40) return { label: 'Fair', color: 'text-warning-600' }
  return { label: 'Poor', color: 'text-accent-600' }
}

export function getCardinalDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

export function metersToFeet(meters: number): number {
  return meters * 3.28084
}

export function metersToMiles(meters: number): number {
  return meters * 0.000621371
}
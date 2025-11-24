import React from 'react'
import { motion } from 'framer-motion'
import { useDroneStore } from '@/stores/droneStore'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { QRDetectionData } from '@/types'
import { QrCode, CheckCircle, XCircle, Clock, Send } from 'lucide-react'

export function QRStatusPanel() {
  const { qrDetectionData } = useDroneStore()

  const getQRStatus = (data: QRDetectionData) => {
    if (data.transmitted) return { status: 'transmitted', label: 'Transmitted', variant: 'success' as const }
    if (data.validated && data.detected) return { status: 'validated', label: 'Validated', variant: 'secondary' as const }
    if (data.detected) return { status: 'detected', label: 'Detected', variant: 'warning' as const }
    return { status: 'scanning', label: 'Scanning', variant: 'default' as const }
  }

  const qrStatus = getQRStatus(qrDetectionData)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center">
            <QrCode className="w-4 h-4 mr-2" />
            QR Scanner Status
          </h3>
          <Badge variant={qrStatus.variant} className="text-xs">
            {qrStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* QR Scanner Preview */}
          <div className="aspect-square bg-slate-900 rounded-lg relative overflow-hidden">
            {/* Mock QR scanner view */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-slate-600 border-t-primary-500 rounded-full mx-auto mb-3" />
                <p className="text-slate-400 text-sm">QR Scanner Active</p>
              </div>
            </div>

            {/* Scanning overlay */}
            {qrStatus.status === 'scanning' && (
              <div className="absolute inset-0">
                <div className="absolute inset-4 border-2 border-primary-500 rounded-lg">
                  <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-primary-500 animate-pulse" />
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary-500 animate-pulse" />
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-500 animate-pulse" />
                  <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-primary-500 animate-pulse" />
                </div>
              </div>
            )}

            {/* Success indicator */}
            {qrStatus.status === 'validated' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-secondary-500 bg-opacity-90"
              >
                <div className="text-center text-white">
                  <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                  <p className="font-medium">QR Code Detected</p>
                </div>
              </motion.div>
            )}

            {/* Detected QR value */}
            {qrDetectionData.value && (
              <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 rounded p-2">
                <p className="text-white text-xs font-mono truncate">
                  {qrDetectionData.value}
                </p>
              </div>
            )}
          </div>

          {/* QR Information */}
          {qrDetectionData.detected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Detected:</span>
                <span className="font-medium text-slate-900">
                  {qrDetectionData.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {qrDetectionData.validated && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-secondary-600" />
                  <span className="text-sm text-slate-700">QR Code validated successfully</span>
                </div>
              )}

              {qrDetectionData.transmitted && (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4 text-secondary-600" />
                  <span className="text-sm text-slate-700">Data transmitted to server</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {qrDetectionData.value && !qrDetectionData.transmitted && (
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send to Server
              </Button>
              <Button variant="ghost" size="sm" className="w-full">
                Rescan QR Code
              </Button>
            </div>
          )}

          {/* Scan History */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Last successful scan:</span>
              <span>None</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
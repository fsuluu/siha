import React from 'react'
import { motion } from 'framer-motion'
import { LockOnData } from '@/types'
import { formatDuration } from '@/utils'
import { Target, Crosshair, Zap } from 'lucide-react'

interface LockOnIndicatorProps {
  data: LockOnData
}

export function LockOnIndicator({ data }: LockOnIndicatorProps) {
  if (!data.detected) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Crosshair className="w-16 h-16 text-slate-600 opacity-30" />
      </div>
    )
  }

  const boundingBoxStyle = {
    left: `${data.boundingBox.x}%`,
    top: `${data.boundingBox.y}%`,
    width: `${data.boundingBox.width}%`,
    height: `${data.boundingBox.height}%`,
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Bounding box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`absolute border-2 ${
          data.locked ? 'border-accent-500 bg-accent-500 bg-opacity-20' : 'border-warning-500 border-dashed'
        } rounded-lg`}
        style={boundingBoxStyle}
      >
        {/* Corner brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent-500" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent-500" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent-500" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent-500" />

        {/* Lock indicator */}
        {data.locked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1"
          >
            <Target className="w-3 h-3" />
            <span className="font-medium">LOCKED</span>
            {data.lockDuration > 0 && (
              <span className="opacity-75">{formatDuration(data.lockDuration)}</span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Target info box */}
      {(data.locked || data.confidence > 50) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-accent-400" />
            <span className="font-medium">Target Info</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Confidence:</span>
              <span className={data.confidence > 80 ? 'text-secondary-400' : data.confidence > 50 ? 'text-warning-400' : 'text-accent-400'}>
                {data.confidence.toFixed(0)}%
              </span>
            </div>
            {data.targetInfo && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-300">Distance:</span>
                  <span>{data.targetInfo.distance.toFixed(0)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Speed:</span>
                  <span>{(data.targetInfo.speed! * 3.6).toFixed(1)}km/h</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Crosshair className={`w-12 h-12 ${data.locked ? 'text-accent-500 animate-pulse' : 'text-slate-600 opacity-50'}`} />
      </div>
    </div>
  )
}
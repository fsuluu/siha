import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function VideoFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Live Video Feed</h1>
        <p className="text-slate-600 mt-1">Real-time camera feed with lock-on detection</p>
      </div>

      {/* Video Feed Area */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Main Camera</h2>
            <Badge variant="success">Connected</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-slate-600 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading video stream...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
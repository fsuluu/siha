import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'
import { Sidebar } from './Sidebar'
import { RightPanel } from './RightPanel'
import { Dashboard } from '@/pages/Dashboard'
import { VideoFeed } from '@/pages/VideoFeed'
import { QRTargets } from '@/pages/QRTargets'
import { TelemetryLogs } from '@/pages/TelemetryLogs'
import { Settings } from '@/pages/Settings'

export function MainLayout() {
  const { sidebarCollapsed, rightPanelVisible, currentPage } = useUIStore()

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'video':
        return <VideoFeed />
      case 'qr':
        return <QRTargets />
      case 'telemetry':
        return <TelemetryLogs />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-60'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto p-6"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Right Panel */}
      <AnimatePresence>
        {rightPanelVisible && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-80 bg-white border-l border-slate-200 flex-shrink-0"
          >
            <RightPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
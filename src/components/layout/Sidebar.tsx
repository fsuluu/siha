import React from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/utils'
import {
  LayoutDashboard,
  Video,
  QrCode,
  FileText,
  Settings,
  Menu,
  X,
  Activity,
  Shield,
  MapPin,
} from 'lucide-react'

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'video', label: 'Video Feed', icon: Video },
  { id: 'qr', label: 'QR Targets', icon: QrCode },
  { id: 'telemetry', label: 'Telemetry Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, setCurrentPage, currentPage } = useUIStore()

  return (
    <>
      {/* Mobile Backdrop */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 240 }}
        className={cn(
          'fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700 z-50',
          'transition-all duration-300 ease-in-out'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <Shield className="w-8 h-8 text-primary-500" />
                <div>
                  <h1 className="text-lg font-bold text-white">Savaşan İHA</h1>
                  <p className="text-xs text-slate-400">Control System</p>
                </div>
              </motion.div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {sidebarCollapsed ? (
                <Menu className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={cn(
                    'w-full flex items-center p-3 rounded-lg transition-all duration-200',
                    'hover:bg-slate-800 group',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      !sidebarCollapsed && 'mr-3',
                      'group-hover:scale-110'
                    )}
                  />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Status Footer */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse" />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">System Online</p>
                  <p className="text-xs text-slate-400">All systems operational</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
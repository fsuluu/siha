import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from './components/layout/MainLayout'
import { useWebSocketConnection } from './hooks/useWebSocketConnection'

// WebSocket connection wrapper component
function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocketConnection()
  return <>{children}</>
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60, // 1 minute
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <MainLayout />
      </WebSocketProvider>
    </QueryClientProvider>
  )
}

export default App
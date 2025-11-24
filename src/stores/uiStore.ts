import { create } from 'zustand'
import { UIState } from '@/types'

interface UIStore extends UIState {
  // Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleRightPanel: () => void
  setRightPanelVisible: (visible: boolean) => void
  setCurrentPage: (page: string) => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  updateMapSettings: (settings: Partial<UIState['mapSettings']>) => void
  updateVideoSettings: (settings: Partial<UIState['videoSettings']>) => void
  resetSettings: () => void
}

const defaultUIState: UIState = {
  sidebarCollapsed: false,
  rightPanelVisible: true,
  currentPage: 'dashboard',
  theme: 'light',
  mapSettings: {
    showGrid: false,
    showDistanceRings: true,
    showBearingLines: false,
    showTrail: true,
    trailDuration: 60,
    mapStyle: 'satellite',
  },
  videoSettings: {
    showOverlay: true,
    recording: false,
    quality: '1080p',
    fullscreen: false,
    pictureInPicture: false,
  },
}

export const useUIStore = create<UIStore>((set) => ({
  ...defaultUIState,

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  setSidebarCollapsed: (collapsed) =>
    set(() => ({
      sidebarCollapsed: collapsed,
    })),

  toggleRightPanel: () =>
    set((state) => ({
      rightPanelVisible: !state.rightPanelVisible,
    })),

  setRightPanelVisible: (visible) =>
    set(() => ({
      rightPanelVisible: visible,
    })),

  setCurrentPage: (page) =>
    set(() => ({
      currentPage: page,
    })),

  setTheme: (theme) =>
    set(() => ({
      theme,
    })),

  updateMapSettings: (settings) =>
    set((state) => ({
      mapSettings: {
        ...state.mapSettings,
        ...settings,
      },
    })),

  updateVideoSettings: (settings) =>
    set((state) => ({
      videoSettings: {
        ...state.videoSettings,
        ...settings,
      },
    })),

  resetSettings: () =>
    set(() => ({
      ...defaultUIState,
    })),
}))
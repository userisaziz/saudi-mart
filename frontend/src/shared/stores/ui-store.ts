import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface UIState {
  // Sidebar
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void

  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Loading states
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void

  // Modals
  modals: Record<string, boolean>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  toggleModal: (modalId: string) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  autoClose?: boolean
  duration?: number
}

export const useUIStore = create<UIState>()(
  subscribeWithSelector((set, get) => ({
    // Sidebar state
    sidebarCollapsed: JSON.parse(localStorage.getItem('sidebar-collapsed') || 'false'),
    setSidebarCollapsed: (collapsed) => {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed))
      set({ sidebarCollapsed: collapsed })
    },
    toggleSidebar: () => {
      const collapsed = !get().sidebarCollapsed
      get().setSidebarCollapsed(collapsed)
    },

    // Theme state
    theme: (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system',
    setTheme: (theme) => {
      localStorage.setItem('theme', theme)
      set({ theme })
    },

    // Global loading
    globalLoading: false,
    setGlobalLoading: (loading) => set({ globalLoading: loading }),

    // Modal management
    modals: {},
    openModal: (modalId) => set((state) => ({
      modals: { ...state.modals, [modalId]: true }
    })),
    closeModal: (modalId) => set((state) => ({
      modals: { ...state.modals, [modalId]: false }
    })),
    toggleModal: (modalId) => set((state) => ({
      modals: { ...state.modals, [modalId]: !state.modals[modalId] }
    })),

    // Notifications
    notifications: [],
    addNotification: (notification) => {
      const id = crypto.randomUUID()
      const timestamp = Date.now()
      const newNotification: Notification = {
        id,
        timestamp,
        autoClose: true,
        duration: 5000,
        ...notification,
      }
      
      set((state) => ({
        notifications: [newNotification, ...state.notifications]
      }))

      // Auto-remove notification
      if (newNotification.autoClose) {
        setTimeout(() => {
          get().removeNotification(id)
        }, newNotification.duration)
      }
    },
    removeNotification: (id) => set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
    clearNotifications: () => set({ notifications: [] }),
  }))
)
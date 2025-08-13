import { create } from 'zustand'

interface AppState {
  privacyAccepted: boolean
  theme: 'light' | 'dark'
  setPrivacyAccepted: (accepted: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}

const initialAccepted = typeof localStorage !== 'undefined' && localStorage.getItem('privacyAccepted') === 'true'
const initialTheme = (typeof localStorage !== 'undefined' && (localStorage.getItem('theme') as 'light' | 'dark')) || 'light'

export const useAppStore = create<AppState>((set) => ({
  privacyAccepted: initialAccepted,
  theme: initialTheme,
  setPrivacyAccepted: (accepted) => {
    localStorage.setItem('privacyAccepted', String(accepted))
    set({ privacyAccepted: accepted })
  },
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
}))
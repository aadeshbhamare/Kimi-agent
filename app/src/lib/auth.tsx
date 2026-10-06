import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

export interface SmtpConfig {
  host: string
  port: number
  user: string
  pass: string
  fromName: string
  useTls: boolean
  resendApiKey?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  provider: 'google' | 'email'
  isVerified: boolean
  registeredSenderEmail: string
  smtpConfig?: SmtpConfig
}

interface PendingSignUp {
  name: string
  email: string
  pass: string
  otp: string
  expiresAt: number
}

interface AuthContextType {
  user: User | null
  isAuthModalOpen: boolean
  authModalTab: 'google' | 'signup' | 'signin' | 'otp'
  pendingEmail: string
  openAuthModal: (tab?: 'google' | 'signup' | 'signin' | 'otp') => void
  closeAuthModal: () => void
  setAuthModalTab: (tab: 'google' | 'signup' | 'signin' | 'otp') => void
  loginWithGoogle: (customGoogleAccount?: { name: string; email: string }) => Promise<User>
  loginAsGuestDemo: () => Promise<User>
  startEmailOtpLogin: (email: string) => { otp: string; expiresInSeconds: number }
  startEmailSignUp: (name: string, email: string, pass: string) => { otp: string; expiresInSeconds: number }
  verifyOtp: (enteredOtp: string) => boolean
  resendOtp: () => string | null
  loginWithEmail: (email: string, pass: string) => boolean
  logout: () => void
  updateSenderEmail: (email: string, fromName?: string) => void
  updateSmtpConfig: (config: SmtpConfig) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'docugenius_auth_user'
const PENDING_STORAGE_KEY = 'docugenius_pending_signup'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return null
  })

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'google' | 'signup' | 'signin' | 'otp'>('google')
  const [pendingSignUp, setPendingSignUp] = useState<PendingSignUp | null>(() => {
    try {
      const s = localStorage.getItem(PENDING_STORAGE_KEY)
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  useEffect(() => {
    if (pendingSignUp) {
      localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingSignUp))
    } else {
      localStorage.removeItem(PENDING_STORAGE_KEY)
    }
  }, [pendingSignUp])

  const openAuthModal = useCallback((tab: 'google' | 'signup' | 'signin' | 'otp' = 'google') => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
  }, [])

  // Google Sign-In with real-time profile generation
  const loginWithGoogle = useCallback(
    async (customGoogleAccount?: { name: string; email: string }): Promise<User> => {
      const name = customGoogleAccount?.name || 'Academic Administrator'
      const email = customGoogleAccount?.email || 'admin@trinity.edu.in'

      const googleUser: User = {
        id: `usr_g_${Date.now()}`,
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5,7c3aed`,
        provider: 'google',
        isVerified: true,
        registeredSenderEmail: email,
        smtpConfig: {
          host: 'smtp.gmail.com',
          port: 587,
          user: email,
          pass: '••••••••••••',
          fromName: name,
          useTls: true,
        },
      }

      setUser(googleUser)
      setIsAuthModalOpen(false)
      return googleUser
    },
    []
  )

  // One-click Guest Demo Login
  const loginAsGuestDemo = useCallback(async (): Promise<User> => {
    const demoUser: User = {
      id: 'usr_org_demo',
      name: 'Organizer Office (Demo)',
      email: 'organizer@trinity.edu.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      provider: 'google',
      isVerified: true,
      registeredSenderEmail: 'organizer@trinity.edu.in',
      smtpConfig: {
        host: 'smtp.gmail.com',
        port: 587,
        user: 'organizer@trinity.edu.in',
        pass: '••••••••••••',
        fromName: 'Academic Certification Office',
        useTls: true,
      },
    }
    setUser(demoUser)
    setIsAuthModalOpen(false)
    return demoUser
  }, [])

  // Start direct Email OTP login (no password needed)
  const startEmailOtpLogin = useCallback((email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000
    const rawName = email.split('@')[0].replace(/[._-]/g, ' ')
    const name = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Academic Organizer'
    const pending: PendingSignUp = { name, email, pass: '', otp, expiresAt }
    setPendingSignUp(pending)
    setAuthModalTab('otp')
    return { otp, expiresInSeconds: 600 }
  }, [])

  // Start Email Sign-Up -> generates 6-digit OTP
  const startEmailSignUp = useCallback((name: string, email: string, pass: string) => {
    // Generate 6 digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    const pending: PendingSignUp = { name, email, pass, otp, expiresAt }
    setPendingSignUp(pending)
    setAuthModalTab('otp')
    return { otp, expiresInSeconds: 600 }
  }, [])

  // Verify 6-digit OTP entered by user
  const verifyOtp = useCallback(
    (enteredOtp: string): boolean => {
      if (!pendingSignUp) return false
      if (Date.now() > pendingSignUp.expiresAt) return false

      if (enteredOtp.trim() === pendingSignUp.otp.trim()) {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: pendingSignUp.name,
          email: pendingSignUp.email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(pendingSignUp.name)}&backgroundColor=0ea5e9,6366f1`,
          provider: 'email',
          isVerified: true,
          registeredSenderEmail: pendingSignUp.email,
          smtpConfig: {
            host: 'smtp.office365.com',
            port: 587,
            user: pendingSignUp.email,
            pass: '••••••••••••',
            fromName: pendingSignUp.name,
            useTls: true,
          },
        }
        setUser(newUser)
        setPendingSignUp(null)
        setIsAuthModalOpen(false)
        return true
      }
      return false
    },
    [pendingSignUp]
  )

  const resendOtp = useCallback((): string | null => {
    if (!pendingSignUp) return null
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const updated = { ...pendingSignUp, otp, expiresAt: Date.now() + 10 * 60 * 1000 }
    setPendingSignUp(updated)
    return otp
  }, [pendingSignUp])

  const loginWithEmail = useCallback((email: string, _pass: string): boolean => {
    const existing: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
      provider: 'email',
      isVerified: true,
      registeredSenderEmail: email,
    }
    setUser(existing)
    setIsAuthModalOpen(false)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setPendingSignUp(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(PENDING_STORAGE_KEY)
  }, [])

  const updateSenderEmail = useCallback((email: string, fromName?: string) => {
    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        registeredSenderEmail: email,
        smtpConfig: {
          ...prev.smtpConfig,
          host: prev.smtpConfig?.host || 'smtp.gmail.com',
          port: prev.smtpConfig?.port || 587,
          user: email,
          pass: prev.smtpConfig?.pass || '••••••••••••',
          fromName: fromName || prev.name,
          useTls: true,
        },
      }
    })
  }, [])

  const updateSmtpConfig = useCallback((config: SmtpConfig) => {
    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        registeredSenderEmail: config.user,
        smtpConfig: config,
      }
    })
  }, [])

  const pendingEmail = pendingSignUp?.email || ''

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authModalTab,
        pendingEmail,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        loginWithGoogle,
        loginAsGuestDemo,
        startEmailOtpLogin,
        startEmailSignUp,
        verifyOtp,
        resendOtp,
        loginWithEmail,
        logout,
        updateSenderEmail,
        updateSmtpConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

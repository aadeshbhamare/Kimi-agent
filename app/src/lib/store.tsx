import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { INITIAL_ACTIVITY, type ActivityItem, type SectionKey } from './data'

interface AppState {
  section: SectionKey
  navigate: (s: SectionKey) => void
  activity: ActivityItem[]
  logActivity: (icon: ActivityItem['icon'], text: string) => void
}

const Ctx = createContext<AppState | null>(null)

const VALID: SectionKey[] = [
  'landing',
  'dashboard',
  'documents',
  'workflow',
  'workflow-upload',
  'workflow-analyze',
  'workflow-model',
  'workflow-editor',
  'workflow-generate',
  'workflow-validate',
  'workflow-export',
  'templates',
  'research',
  'assistant',
  'projects',
  'collaboration',
  'history',
  'certificates',
  'results',
  'architecture',
]

function parseHash(): SectionKey {
  const h = window.location.hash.replace(/^#\/?/, '').split('?')[0] as SectionKey
  return VALID.includes(h) ? h : 'landing'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<SectionKey>(parseHash)
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY)

  useEffect(() => {
    const onHash = () => setSection(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((s: SectionKey) => {
    window.location.hash = s === 'landing' ? '/' : `/${s}`
    setSection(s)
    window.scrollTo({ top: 0 })
  }, [])

  const logActivity = useCallback((icon: ActivityItem['icon'], text: string) => {
    setActivity((prev) => [{ id: `a${Date.now()}`, icon, text, time: 'Just now' }, ...prev].slice(0, 20))
  }, [])

  const value = useMemo(() => ({ section, navigate, activity, logActivity }), [section, navigate, activity, logActivity])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside provider')
  return v
}

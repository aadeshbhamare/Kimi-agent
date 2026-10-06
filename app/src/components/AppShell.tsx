import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/store'
import type { SectionKey } from '@/lib/data'
import {
  LayoutDashboard, FileText, Layers, BookOpen, Sparkles, FolderKanban,
  Users, History, Award, Search, Bell, HelpCircle, Settings, Menu,
  ChevronRight, ScanSearch, X, Globe,
} from 'lucide-react'

const NAV: { key: SectionKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'templates', label: 'Templates', icon: Layers },
  { key: 'research', label: 'Research', icon: BookOpen },
  { key: 'assistant', label: 'AI Assistant', icon: Sparkles },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'collaboration', label: 'Collaboration', icon: Users },
  { key: 'history', label: 'History', icon: History },
]

const WORKFLOW_NAV: { key: SectionKey; label: string }[] = [
  { key: 'workflow-upload', label: '1. Upload / Sample' },
  { key: 'workflow-analyze', label: '2. AI Understanding' },
  { key: 'workflow-model', label: '3. Universal Model' },
  { key: 'workflow-editor', label: '4. Smart Fields & Editor' },
  { key: 'workflow-generate', label: '5. Batch Generation' },
  { key: 'workflow-validate', label: '6. AI Validation & Fix' },
  { key: 'workflow-export', label: '7. Preview & Export' },
]

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lift">
        <ScanSearch className="h-5 w-5 text-white" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[15px] font-bold text-slate-900">DocEngine <span className="text-gradient">AI</span></div>
          <div className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">Document Engineering</div>
        </div>
      )}
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { section, navigate } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-5 pb-4">
        <Logo />
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 scrollbar-thin">
        <button
          onClick={() => { navigate('landing'); setMobileOpen(false) }}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors mb-1',
            section === 'landing' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          <Globe className={cn('h-[17px] w-[17px]', section === 'landing' ? 'text-indigo-600' : 'text-slate-400')} />
          Landing Page
        </button>

        <div className="pt-1 pb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Workspace</div>
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = section === key || (key === 'documents' && section === 'workflow')
          return (
            <button
              key={key}
              onClick={() => { navigate(key); setMobileOpen(false) }}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors',
                active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className={cn('h-[17px] w-[17px]', active ? 'text-indigo-600' : 'text-slate-400')} />
              {label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-indigo-400" />}
            </button>
          )
        })}

        <div className="pt-4 pb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Workflow Steps</div>
        {WORKFLOW_NAV.map(({ key, label }) => {
          const active = section === key
          return (
            <button
              key={key}
              onClick={() => { navigate(key); setMobileOpen(false) }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-[12.5px] font-medium transition-colors',
                active ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', active ? 'bg-indigo-600' : 'bg-slate-300')} />
              <span className="truncate">{label}</span>
              {active && <ChevronRight className="ml-auto h-3 w-3 text-indigo-400 shrink-0" />}
            </button>
          )
        })}

        <div className="pt-4 pb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Automation</div>
        <button
          onClick={() => { navigate('certificates'); setMobileOpen(false) }}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all',
            section === 'certificates'
              ? 'gradient-brand text-white shadow-lift'
              : 'border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 hover:shadow-soft'
          )}
        >
          <Award className={cn('h-[17px] w-[17px]', section === 'certificates' ? 'text-white' : 'text-violet-500')} />
          Certificate Automation
          <span className={cn('ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase', section === 'certificates' ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-600')}>Pro</span>
        </button>
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl gradient-brand-soft border border-indigo-100 p-3">
          <div className="text-xs font-semibold text-slate-800">AI Jobs running</div>
          <div className="mt-0.5 text-[11px] text-slate-500">2 queued · 1 processing</div>
          <button onClick={() => navigate('history')} className="mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800">View job queue →</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-[#f7f8fc]">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl">
            <button className="absolute right-3 top-4 text-slate-400" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
          <button className="lg:hidden text-slate-500" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents, templates, projects…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100" title="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" title="Help"><HelpCircle className="h-[18px] w-[18px]" /></button>
            <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" title="Settings"><Settings className="h-[18px] w-[18px]" /></button>
            <div className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 py-1 pl-1 pr-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-brand text-[11px] font-bold text-white">AB</div>
              <div className="hidden text-left leading-tight md:block">
                <div className="text-[12px] font-semibold text-slate-800">Aadesh Bhamare</div>
                <div className="text-[10px] text-slate-400">Owner</div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-[1200px] p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

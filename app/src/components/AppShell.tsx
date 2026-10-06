
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import { AuthModal } from '@/components/AuthModal'
import type { SectionKey } from '@/lib/data'
import {
  LayoutDashboard, FileText, Layers, BookOpen, Sparkles, FolderKanban,
  Users, History, Award, Search, Bell, HelpCircle, Settings, Menu,
  ChevronRight, ScanSearch, X, Globe, Cpu, FlaskConical, Play,
  Zap, CheckCircle2, ArrowRight, ShieldCheck, LogOut, LogIn, Mail
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
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 shadow-lift">
        <ScanSearch className="h-5 w-5 text-white" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[15px] font-extrabold tracking-tight text-slate-900">
            DocuGenius <span className="text-gradient">AI</span>
          </div>
          <div className="text-[9.5px] font-bold tracking-wider text-indigo-600/80 uppercase">
            One Platform · Two Modules
          </div>
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
            'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors mb-1.5',
            section === 'landing' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          <Globe className={cn('h-4 w-4', section === 'landing' ? 'text-indigo-600' : 'text-slate-400')} />
          Landing Overview
        </button>

        {/* =================================================================== */}
        {/* Flagship Modules Section */}
        {/* =================================================================== */}
        <div className="pt-2 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600/90 flex items-center justify-between">
          <span>Core Modules</span>
          <span className="rounded bg-indigo-50 px-1 py-0.2 text-[9px] font-bold text-indigo-600">Dual Core</span>
        </div>

        {/* M1 Button */}
        <button
          onClick={() => { navigate('workflow'); setMobileOpen(false) }}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-all mb-1',
            section.startsWith('workflow')
              ? 'bg-sky-600 text-white shadow-lift'
              : 'border border-sky-100 bg-sky-50/50 text-sky-900 hover:bg-sky-50 hover:border-sky-300'
          )}
        >
          <span className={cn(
            'flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black',
            section.startsWith('workflow') ? 'bg-white/20 text-white' : 'bg-sky-600 text-white'
          )}>
            M1
          </span>
          <div className="text-left min-w-0 flex-1">
            <div className="truncate leading-tight">Document Engineering</div>
            <div className={cn('text-[9.5px] font-normal truncate', section.startsWith('workflow') ? 'text-sky-100' : 'text-slate-500')}>
              Personalization & UDM
            </div>
          </div>
          <ChevronRight className={cn('h-3.5 w-3.5 shrink-0', section.startsWith('workflow') ? 'text-white' : 'text-slate-400')} />
        </button>

        {/* M2 Button */}
        <button
          onClick={() => { navigate('certificates'); setMobileOpen(false) }}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-all mb-2',
            section === 'certificates'
              ? 'bg-violet-600 text-white shadow-lift'
              : 'border border-violet-100 bg-violet-50/50 text-violet-900 hover:bg-violet-50 hover:border-violet-300'
          )}
        >
          <span className={cn(
            'flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black',
            section === 'certificates' ? 'bg-white/20 text-white' : 'bg-violet-600 text-white'
          )}>
            M2
          </span>
          <div className="text-left min-w-0 flex-1">
            <div className="truncate leading-tight">Certificate Automation</div>
            <div className={cn('text-[9.5px] font-normal truncate', section === 'certificates' ? 'text-violet-100' : 'text-slate-500')}>
              Design Lock & Distribution
            </div>
          </div>
          <ChevronRight className={cn('h-3.5 w-3.5 shrink-0', section === 'certificates' ? 'text-white' : 'text-slate-400')} />
        </button>

        {/* =================================================================== */}
        {/* Company & Enterprise Administration (Restricted)                  */}
        {/* =================================================================== */}
        <div className="pt-2 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Company & Administration
        </div>

        <button
          onClick={() => { navigate('admin'); setMobileOpen(false) }}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-all mb-2',
            section === 'admin'
              ? 'bg-slate-900 text-white shadow-lift'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-900 hover:text-white group'
          )}
        >
          <ShieldCheck className={cn('h-4 w-4 shrink-0', section === 'admin' ? 'text-indigo-400' : 'text-indigo-600 group-hover:text-indigo-400')} />
          <span>Company Admin</span>
          <span className="ml-auto rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 border border-indigo-200 group-hover:bg-indigo-900/60 group-hover:text-indigo-300">
            Internal
          </span>
        </button>

        {/* =================================================================== */}
        {/* General Workspace Section */}
        {/* =================================================================== */}
        <div className="pt-2 pb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace Hub
        </div>
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = section === key
          return (
            <button
              key={key}
              onClick={() => { navigate(key); setMobileOpen(false) }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-[12.5px] font-medium transition-colors',
                active ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-indigo-600' : 'text-slate-400')} />
              {label}
            </button>
          )
        })}

        {/* Workflow steps breakdown - visible only when active in M1 */}
        {section.startsWith('workflow') && (
          <div className="pt-2 animate-fade-up">
            <div className="pt-2 pb-1 px-3 text-[10px] font-extrabold uppercase tracking-wider text-sky-600 flex items-center justify-between">
              <span>M1 Active Stepper</span>
              <span className="rounded bg-sky-100 px-1 py-0.2 text-[9px] font-bold text-sky-700">7 Steps</span>
            </div>
            {WORKFLOW_NAV.map(({ key, label }) => {
              const active = section === key
              return (
                <button
                  key={key}
                  onClick={() => { navigate(key); setMobileOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-[11.5px] font-medium transition-colors mb-0.5',
                    active ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200 shadow-2xs' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', active ? 'bg-sky-600' : 'bg-slate-300')} />
                  <span className="truncate">{label}</span>
                </button>
              )
            })}
          </div>
        )}
      </nav>

      <div className="border-t border-slate-200 p-3.5 bg-slate-50/50">
        <div className="rounded-xl border border-indigo-100 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-800">DocuGenius AI</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-1 text-[10.5px] text-slate-500">M1 & M2 Pipelines Ready</div>
          <button
            onClick={() => navigate('admin')}
            className="mt-2 block w-full text-center rounded-lg bg-indigo-50 py-1 text-[10.5px] font-bold text-indigo-700 hover:bg-indigo-100 transition"
          >
            Company Command Center →
          </button>
        </div>
      </div>
    </div>
  )

  const { user, openAuthModal, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-[#f8fafc]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white lg:block shadow-xs">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl">
            <button className="absolute right-3 top-4 text-slate-400 hover:text-slate-700" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur shadow-2xs">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>

            {/* Quick switcher buttons right in topbar */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => navigate('workflow')}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-bold transition flex items-center gap-1.5',
                  section.startsWith('workflow') ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                M1: Document Engineering
              </button>

              <button
                onClick={() => navigate('certificates')}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-bold transition flex items-center gap-1.5',
                  section === 'certificates' ? 'bg-violet-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
                M2: Certificate Automation
              </button>

              <button
                onClick={() => navigate('admin')}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-bold transition flex items-center gap-1.5',
                  section === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span>Company Admin</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100" title="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            {/* Authenticated User & Sender Email Status */}
            {user ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-1 pl-1.5 pr-2.5 transition shadow-2xs"
                >
                  <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-lg object-cover ring-1 ring-indigo-200" />
                  <div className="hidden text-left leading-tight md:block">
                    <div className="text-[12px] font-bold text-slate-900 truncate max-w-[120px]">{user.name}</div>
                    <div className="text-[9.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <ShieldCheck className="h-2.5 w-2.5" /> Sender: {user.registeredSenderEmail.split('@')[0]}
                    </div>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl z-50 animate-fade-up">
                    <div className="border-b border-slate-100 pb-2.5">
                      <div className="text-xs font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 truncate">{user.email}</div>
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-[10.5px] font-semibold text-emerald-900">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold">Authorized Dispatcher</div>
                          <div className="font-mono text-[10px] text-emerald-700">{user.registeredSenderEmail}</div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2.5 space-y-1">
                      <button
                        onClick={() => { navigate('admin'); setUserMenuOpen(false) }}
                        className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-indigo-700 hover:bg-indigo-50 font-bold flex items-center gap-2"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> Company Command Center
                      </button>
                      <button
                        onClick={() => { openAuthModal('google'); setUserMenuOpen(false) }}
                        className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-2"
                      >
                        <Mail className="h-3.5 w-3.5 text-indigo-600" /> Switch / Google Account
                      </button>
                      <button
                        onClick={() => { openAuthModal('signup'); setUserMenuOpen(false) }}
                        className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-2"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-sky-600" /> Verify New Email (OTP)
                      </button>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); navigate('login') }}
                        className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="ml-1 inline-flex items-center gap-1.5 rounded-xl gradient-brand px-3 py-1.5 text-xs font-bold text-white shadow-lift hover:brightness-110"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In (Google / OTP)</span>
              </button>
            )}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-[1340px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  )
}


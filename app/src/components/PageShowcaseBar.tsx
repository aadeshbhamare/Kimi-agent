import { useState } from 'react'
import { useApp } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import type { SectionKey } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  Globe, LayoutDashboard, FileText, Layers, BookOpen, Sparkles,
  FolderKanban, Users, History as HistoryIcon, Award, UploadCloud,
  BrainCircuit, Boxes, MousePointerClick, Layers3, ShieldCheck,
  MonitorDown, Copy, Check, ChevronDown, ChevronUp, Grid3x3, X,
  ArrowRight, LogIn
} from 'lucide-react'

export interface PageInfo {
  key: SectionKey
  label: string
  shortLabel?: string
  category: 'Marketing' | 'Core Platform' | 'Workflow Steps'
  icon: React.ElementType
  desc: string
  route: string
}

export const ALL_PAGES: PageInfo[] = [
  // Marketing
  {
    key: 'login',
    label: 'Sign In / Out Hub',
    shortLabel: 'Sign In/Out',
    category: 'Marketing',
    icon: LogIn,
    desc: 'Authentication portal with Google Sign-In, 6-digit OTP email verification, and animated title circle.',
    route: '#/login',
  },
  {
    key: 'landing',
    label: 'Landing Page',
    shortLabel: 'Landing',
    category: 'Marketing',
    icon: Globe,
    desc: 'Public landing page with product introduction, features, hero showcase, and FAQ.',
    route: '#/landing',
  },
  // Core Platform
  {
    key: 'dashboard',
    label: 'Dashboard',
    category: 'Core Platform',
    icon: LayoutDashboard,
    desc: 'Main user hub with statistics, quick actions, ongoing pipelines, and recent projects.',
    route: '#/dashboard',
  },
  {
    key: 'documents',
    label: 'Documents',
    category: 'Core Platform',
    icon: FileText,
    desc: 'Document manager, university reports, thesis files, batch records, and actions.',
    route: '#/documents',
  },
  {
    key: 'templates',
    label: 'Templates Library',
    shortLabel: 'Templates',
    category: 'Core Platform',
    icon: Layers,
    desc: 'University project report templates (SPPU, VTU, Mumbai Univ, IEEE, LaTeX).',
    route: '#/templates',
  },
  {
    key: 'research',
    label: 'Research Workspace',
    shortLabel: 'Research',
    category: 'Core Platform',
    icon: BookOpen,
    desc: 'RAG-powered paper Q&A, citation generators (IEEE, APA), methodology extraction.',
    route: '#/research',
  },
  {
    key: 'assistant',
    label: 'AI Assistant',
    shortLabel: 'Assistant',
    category: 'Core Platform',
    icon: Sparkles,
    desc: 'Autonomous document copilot for rewriting, formatting, formatting queries, and help.',
    route: '#/assistant',
  },
  {
    key: 'projects',
    label: 'Projects',
    category: 'Core Platform',
    icon: FolderKanban,
    desc: 'Project boards, milestones, deadlines, and multi-team document tracking.',
    route: '#/projects',
  },
  {
    key: 'collaboration',
    label: 'Collaboration',
    category: 'Core Platform',
    icon: Users,
    desc: 'Real-time team members, permissions, active viewers, and document sharing.',
    route: '#/collaboration',
  },
  {
    key: 'history',
    label: 'History & Logs',
    shortLabel: 'History',
    category: 'Core Platform',
    icon: HistoryIcon,
    desc: 'Audit trail of AI actions, batch export jobs, validation logs, and activity records.',
    route: '#/history',
  },
  {
    key: 'certificates',
    label: 'Certificate Automation Studio',
    shortLabel: 'Certificates Studio',
    category: 'Core Platform',
    icon: Award,
    desc: 'AI Field Detection · CSV Mapping · Design Lock · Adaptive Text-Fitting · Bulk PDF/PNG · Verified Email Dispatch.',
    route: '#/certificates',
  },
  // Workflow Steps (Separated)
  {
    key: 'workflow-upload',
    label: 'Step 1: Upload / Create',
    shortLabel: '1. Upload',
    category: 'Workflow Steps',
    icon: UploadCloud,
    desc: 'Upload PDF, DOCX, LaTeX, or choose standard SPPU engineering report sample.',
    route: '#/workflow-upload',
  },
  {
    key: 'workflow-analyze',
    label: 'Step 2: AI Understanding',
    shortLabel: '2. AI Analyze',
    category: 'Workflow Steps',
    icon: BrainCircuit,
    desc: 'OCR, structure hierarchy, visual entity recognition, and smart element detection.',
    route: '#/workflow-analyze',
  },
  {
    key: 'workflow-model',
    label: 'Step 3: Universal Model',
    shortLabel: '3. Doc Model',
    category: 'Workflow Steps',
    icon: Boxes,
    desc: 'Universal Document Model layer inspector showing AST, layout, and style fingerprint.',
    route: '#/workflow-model',
  },
  {
    key: 'workflow-editor',
    label: 'Step 4: Smart Fields & AI Editor',
    shortLabel: '4. Editor & Fields',
    category: 'Workflow Steps',
    icon: MousePointerClick,
    desc: 'Interactive document canvas with highlighting, natural-language prompt edits, and undo/redo.',
    route: '#/workflow-editor',
  },
  {
    key: 'workflow-generate',
    label: 'Step 5: Batch Generation',
    shortLabel: '5. Generation',
    category: 'Workflow Steps',
    icon: Layers3,
    desc: 'Personalized batch document generator with multi-student records and live preview.',
    route: '#/workflow-generate',
  },
  {
    key: 'workflow-validate',
    label: 'Step 6: AI Validation & Audit',
    shortLabel: '6. AI Validation',
    category: 'Workflow Steps',
    icon: ShieldCheck,
    desc: '18-point automated compliance audit for layout overflow, fonts, and one-click fixes.',
    route: '#/workflow-validate',
  },
  {
    key: 'admin',
    label: 'Company Admin Command Center',
    shortLabel: 'Company Admin',
    category: 'Core Platform',
    icon: ShieldCheck,
    desc: 'Restricted company portal: DNS SPF/DKIM verification, SMTP relay, AI key vault, user directory, and cryptographic audit ledgers.',
    route: '#/admin',
  },
  {
    key: 'workflow-export',
    label: 'Step 7: Preview & Export',
    shortLabel: '7. Multi-Export',
    category: 'Workflow Steps',
    icon: MonitorDown,
    desc: 'Export high-res PDF, editable DOCX, LaTeX package, or ZIP bundle with verification seal.',
    route: '#/workflow-export',
  },
]

export function PageShowcaseBar() {
  const { section, navigate } = useApp()
  const { isAdmin } = useAuth()
  const [collapsed, setCollapsed] = useState(true)
  const [directoryOpen, setDirectoryOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'All' | 'Marketing' | 'Core Platform' | 'Workflow Steps'>('All')

  // Completely invisible to standard users - only visible in Admin mode or for company admins
  if (!isAdmin && section !== 'admin') {
    return null
  }

  const currentPage = ALL_PAGES.find((p) => {
    if (section === 'workflow') return p.key === 'workflow-upload'
    return p.key === section
  }) || ALL_PAGES[0]

  const handleCopyUrl = () => {
    const fullUrl = window.location.origin + window.location.pathname + currentPage.route
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredPages = activeCategory === 'All'
    ? ALL_PAGES
    : ALL_PAGES.filter((p) => p.category === activeCategory)

  if (collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setDirectoryOpen(true)}
          className="flex items-center gap-2 rounded-full bg-slate-900/90 hover:bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md border border-slate-700/80 transition-all hover:scale-105 active:scale-95 ring-1 ring-white/10"
          title="Open complete frontend pages directory"
        >
          <Grid3x3 className="h-4 w-4 text-indigo-400" />
          <span>Page Navigator</span>
          <span className="rounded-full bg-indigo-500/30 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300">
            {ALL_PAGES.length}
          </span>
        </button>

        {directoryOpen && <DirectoryModal onClose={() => setDirectoryOpen(false)} />}
      </div>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-950/95 text-slate-100 border-b border-slate-800/80 shadow-lg backdrop-blur-md">
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
          {/* Brand & All Pages Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDirectoryOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 px-2.5 py-1.5 text-xs font-bold text-white shadow transition-all hover:shadow-indigo-500/25"
              title="Open full pages directory"
            >
              <Grid3x3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Pages Showcase</span>
              <span className="rounded-full bg-indigo-900/60 px-1.5 py-0.2 text-[10px] text-indigo-200">
                {ALL_PAGES.length}
              </span>
            </button>

            <div className="hidden lg:flex items-center text-xs text-slate-400 border-l border-slate-800 pl-2 gap-1">
              <span>Viewing:</span>
              <span className="font-semibold text-indigo-300">{currentPage.label}</span>
            </div>
          </div>

          {/* Quick Page Jump Pills (Horizontal scrollable) */}
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 px-1 max-w-full">
            {ALL_PAGES.map((page) => {
              const isActive = (section === page.key) || (section === 'workflow' && page.key === 'workflow-upload')
              const Icon = page.icon
              return (
                <button
                  key={page.key}
                  onClick={() => navigate(page.key)}
                  className={cn(
                    'shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/25 ring-1 ring-indigo-400/50'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                  )}
                  title={`${page.category}: ${page.label}`}
                >
                  <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-white' : 'text-slate-400')} />
                  <span>{page.shortLabel || page.label}</span>
                </button>
              )
            })}
          </div>

          {/* Utilities: Copy URL & Minimize */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 px-2 py-1 text-xs text-slate-300 border border-slate-800 transition"
              title="Copy direct URL to this page"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
              <span className="hidden md:inline">{copied ? 'Copied' : 'Share URL'}</span>
            </button>

            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Minimize Showcase Bar"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Directory Modal */}
      {directoryOpen && (
        <DirectoryModal
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filteredPages={filteredPages}
          onSelect={(key) => {
            navigate(key)
            setDirectoryOpen(false)
          }}
          onClose={() => setDirectoryOpen(false)}
        />
      )}
    </>
  )
}

function DirectoryModal({
  activeCategory = 'All',
  setActiveCategory,
  filteredPages,
  onSelect,
  onClose,
}: {
  activeCategory?: 'All' | 'Marketing' | 'Core Platform' | 'Workflow Steps'
  setActiveCategory?: (c: 'All' | 'Marketing' | 'Core Platform' | 'Workflow Steps') => void
  filteredPages?: PageInfo[]
  onSelect?: (k: SectionKey) => void
  onClose: () => void
}) {
  const { section, navigate } = useApp()
  const pages = filteredPages || ALL_PAGES

  const categories: ('All' | 'Marketing' | 'Core Platform' | 'Workflow Steps')[] = [
    'All',
    'Marketing',
    'Core Platform',
    'Workflow Steps',
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 text-slate-100 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
                <Grid3x3 className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-white">All Frontend Pages Showcase</h2>
              <span className="rounded-full bg-indigo-950 border border-indigo-700/50 px-2 py-0.5 text-xs text-indigo-300 font-medium">
                {ALL_PAGES.length} Complete Pages
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Direct access to all individual pages, isolated workflow steps, and interactive views. Click any card to launch immediately.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Tabs */}
        {setActiveCategory && (
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none border-b border-slate-800/60">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-semibold transition',
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid of Pages */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 scrollbar-thin">
          {pages.map((p) => {
            const Icon = p.icon
            const isCurrent = (section === p.key) || (section === 'workflow' && p.key === 'workflow-upload')
            return (
              <div
                key={p.key}
                onClick={() => {
                  if (onSelect) onSelect(p.key)
                  else {
                    navigate(p.key)
                    onClose()
                  }
                }}
                className={cn(
                  'group flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer hover:scale-[1.01]',
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-400">
                      {p.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {p.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <code className="text-indigo-400 font-mono text-[10px]">{p.route}</code>
                  <span className="flex items-center gap-1 font-semibold text-slate-300 group-hover:text-indigo-400">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Tip: Every page has a unique URL hash that you can copy, bookmark, or link directly.</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 font-medium text-slate-200 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

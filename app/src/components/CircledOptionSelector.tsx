import { useState } from 'react'
import { useApp } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import {
  FileText,
  Award,
  ArrowRight,
  Sparkles,
  Check,
  UploadCloud,
  Layers,
  Send,
  Sliders,
  CheckCircle2,
  Cpu,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModuleCardOption {
  id: 'm1' | 'm2'
  code: 'M1' | 'M2'
  moduleName: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  pipeline: string[]
  icon: typeof FileText
  theme: {
    gradient: string
    activeBorder: string
    activeRing: string
    activeGlow: string
    badgeBg: string
    badgeBorder: string
    badgeText: string
    buttonBg: string
    accentColor: string
  }
  primaryRoute: string
  quickLinks: { label: string; route: string }[]
}

export const CORE_MODULES: ModuleCardOption[] = [
  {
    id: 'm1',
    code: 'M1',
    moduleName: 'Module 1: Document Engineering',
    title: 'Universal Document Engineering',
    subtitle: 'Template Ingestion & Schema Variable Mapping',
    description:
      'Upload PDF, DOCX, or TXT templates. Automatically extract 14 universal schema fields, inspect side-by-side in real-time, and batch-personalize reports with zero layout distortion.',
    tags: [
      '14 Universal Schema Fields',
      'PDF & DOCX Multi-Format',
      'Dual-Pane Live Viewer',
      'Zero Format Distortion',
    ],
    pipeline: [
      '1. Ingest Template',
      '2. Map 14 Fields',
      '3. Batch Personalize',
    ],
    icon: FileText,
    theme: {
      gradient: 'from-sky-500 via-blue-600 to-indigo-700',
      activeBorder: 'border-sky-500',
      activeRing: 'ring-sky-400/30',
      activeGlow: 'shadow-[0_10px_35px_rgba(14,165,233,0.18)]',
      badgeBg: 'bg-sky-50',
      badgeBorder: 'border-sky-200',
      badgeText: 'text-sky-700',
      buttonBg: 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600',
      accentColor: 'text-sky-600',
    },
    primaryRoute: 'workflow',
    quickLinks: [
      { label: 'Upload Template', route: 'workflow-upload' },
      { label: 'Extract Schema', route: 'workflow-model' },
      { label: 'Interactive Editor', route: 'workflow-editor' },
    ],
  },
  {
    id: 'm2',
    code: 'M2',
    moduleName: 'Module 2: Certificate Automation',
    title: 'Intelligent Certificate Automation',
    subtitle: 'Design-Lock Canvas & Recipient Distribution',
    description:
      'Upload raw certificate templates (PNG, JPG, PDF) with 0% aspect distortion lock. Sync recipient lists via CSV, dynamically position name/date/credential fields, and dispatch from registered sender.',
    tags: [
      '0% Distortion Guarantee',
      'CSV Recipient Sync',
      'Design-Lock Canvas',
      'Direct Sender Dispatch',
    ],
    pipeline: [
      '1. Upload Raw Canvas',
      '2. Sync Recipient CSV',
      '3. Instant Email Dispatch',
    ],
    icon: Award,
    theme: {
      gradient: 'from-violet-500 via-purple-600 to-indigo-800',
      activeBorder: 'border-violet-500',
      activeRing: 'ring-violet-400/30',
      activeGlow: 'shadow-[0_10px_35px_rgba(139,92,246,0.18)]',
      badgeBg: 'bg-violet-50',
      badgeBorder: 'border-violet-200',
      badgeText: 'text-violet-700',
      buttonBg: 'bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600',
      accentColor: 'text-violet-600',
    },
    primaryRoute: 'certificates',
    quickLinks: [
      { label: 'Open Studio Canvas', route: 'certificates' },
      { label: 'Upload CSV List', route: 'certificates' },
      { label: 'Sender Dispatch Hub', route: 'certificates' },
    ],
  },
]

interface CircledOptionSelectorProps {
  onProceed?: (option: ModuleCardOption) => void
  initialSelected?: 'm1' | 'm2'
  title?: string
  subtitle?: string
}

export function CircledOptionSelector({
  onProceed,
  initialSelected = 'm1',
  title = 'Select Production Module & Begin Processing',
  subtitle = 'DocuGenius AI divides document workflows into two dedicated, production-grade engines. Choose a module below to launch your workspace.',
}: CircledOptionSelectorProps) {
  const { navigate } = useApp()
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState<'m1' | 'm2'>(initialSelected)

  const selectedOption = CORE_MODULES.find((o) => o.id === selectedId) || CORE_MODULES[0]

  const handleLaunch = (option: ModuleCardOption) => {
    if (onProceed) {
      onProceed(option)
    } else {
      navigate(option.primaryRoute as any)
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-soft">
      {/* Header with Title and User Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 px-3 py-1 text-[11px] font-bold text-indigo-700 mb-1.5 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Dual-Core Architecture · Production Modules</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 p-2 pl-3.5 self-start sm:self-auto shadow-2xs">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
              <div className="text-[10px] font-mono text-emerald-600 font-semibold truncate max-w-[170px]">
                {user.registeredSenderEmail}
              </div>
            </div>
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
          </div>
        )}
      </div>

      {/* Two Prominent Module Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {CORE_MODULES.map((mod) => {
          const isSelected = selectedId === mod.id
          const Icon = mod.icon
          return (
            <div
              key={mod.id}
              onClick={() => setSelectedId(mod.id)}
              className={cn(
                'group relative rounded-3xl border-2 p-6 sm:p-7 cursor-pointer transition-all duration-300 flex flex-col justify-between select-none',
                isSelected
                  ? cn('bg-white ring-4 shadow-lift', mod.theme.activeBorder, mod.theme.activeRing, mod.theme.activeGlow)
                  : 'border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-md'
              )}
            >
              <div>
                {/* Top Row: Circled Animated Icon + Badge + Radio Check */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3.5">
                    {/* Big Circled Icon */}
                    <div
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105',
                        'bg-gradient-to-br',
                        mod.theme.gradient,
                        isSelected ? 'ring-4 ring-offset-2 ring-indigo-300' : 'opacity-90'
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <div>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10.5px] font-bold border mb-1',
                          mod.theme.badgeBg,
                          mod.theme.badgeBorder,
                          mod.theme.badgeText
                        )}
                      >
                        {mod.moduleName}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        {mod.title}
                      </h3>
                    </div>
                  </div>

                  {/* Radio Selection Status */}
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all shrink-0 mt-1',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Subtitle & Description */}
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  {mod.subtitle}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {mod.description}
                </p>

                {/* Processing Pipeline Flow */}
                <div className="rounded-2xl bg-slate-100/70 border border-slate-200/60 p-3 mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Standard Processing Pipeline
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
                    {mod.pipeline.map((step, idx) => (
                      <div key={step} className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{step}</span>
                        {idx < mod.pipeline.length - 1 && (
                          <span className="text-slate-300">➔</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Capabilities Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-white border border-slate-200 px-2 py-1 text-[10.5px] font-semibold text-slate-700 shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Launch Button & Quick Links */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10.5px] font-medium text-slate-400">Quick:</span>
                  {mod.quickLinks.map((ql) => (
                    <button
                      key={ql.label}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(ql.route as any)
                      }}
                      className="text-[10.5px] font-semibold text-slate-600 hover:text-indigo-600 underline underline-offset-2 transition"
                    >
                      {ql.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLaunch(mod)
                  }}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lift transition shrink-0',
                    mod.theme.buttonBg
                  )}
                >
                  <span>Start {mod.code} Processing</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Module Summary Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-sky-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br',
              selectedOption.theme.gradient
            )}
          >
            <selectedOption.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Ready to proceed with:</span>
              <span className="font-extrabold text-indigo-700 underline decoration-indigo-300">
                {selectedOption.title} ({selectedOption.code})
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Click proceed to enter the dedicated {selectedOption.code} workspace and begin processing.
            </div>
          </div>
        </div>

        <button
          onClick={() => handleLaunch(selectedOption)}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl gradient-brand px-6 py-3 text-xs sm:text-sm font-black text-white shadow-lift hover:brightness-110 active:scale-95 transition"
        >
          <span>Proceed with {selectedOption.code}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

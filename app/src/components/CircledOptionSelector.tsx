import { useState } from 'react'
import { useApp } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import {
  FileText,
  Award,
  Mail,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CircledOption {
  id: 'm1' | 'm2' | 'sender' | 'architecture'
  title: string
  shortTitle: string
  code: string
  description: string
  tags: string[]
  icon: typeof FileText
  theme: {
    circleBg: string
    activeBorder: string
    activeRing: string
    activeGlow: string
    badgeBg: string
    badgeText: string
    iconColor: string
  }
  route: string
}

export const WORKFLOW_OPTIONS: CircledOption[] = [
  {
    id: 'm1',
    code: 'M1',
    title: 'Universal Document Engineering',
    shortTitle: 'Document Personalizer',
    description: 'Upload PDF, DOCX, or TXT templates. Auto-extract 14 universal schema fields and batch generate personalized reports.',
    tags: ['PDF & DOCX Support', '14 Universal Fields', 'Zero Format Loss'],
    icon: FileText,
    theme: {
      circleBg: 'from-sky-500 to-blue-600',
      activeBorder: 'border-sky-500',
      activeRing: 'ring-sky-400/40',
      activeGlow: 'shadow-[0_0_25px_rgba(14,165,233,0.3)]',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      badgeText: 'text-sky-600',
      iconColor: 'text-sky-500',
    },
    route: 'workflow',
  },
  {
    id: 'm2',
    code: 'M2',
    title: 'Intelligent Certificate Automation',
    shortTitle: 'Certificate Studio',
    description: 'Canvas design-lock with 0% distortion. Batch generate certificates from CSV and preserve original backgrounds, seals, and watermarks.',
    tags: ['0% Distortion Guarantee', 'CSV Recipient Sync', 'Design-Lock Canvas'],
    icon: Award,
    theme: {
      circleBg: 'from-violet-500 to-purple-600',
      activeBorder: 'border-violet-500',
      activeRing: 'ring-violet-400/40',
      activeGlow: 'shadow-[0_0_25px_rgba(139,92,246,0.3)]',
      badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
      badgeText: 'text-violet-600',
      iconColor: 'text-violet-500',
    },
    route: 'certificates',
  },
  {
    id: 'sender',
    code: 'DISP',
    title: 'Registered Sender Email Hub',
    shortTitle: 'Fast Sender Mailer',
    description: 'Deliver certificates to everyone directly from the organizer registered email address with Turbo parallel queues and live telemetry.',
    tags: ['From Registered Address', 'Turbo 100ms Parallel', 'Live Audit Logs'],
    icon: Mail,
    theme: {
      circleBg: 'from-amber-500 to-orange-600',
      activeBorder: 'border-amber-500',
      activeRing: 'ring-amber-400/40',
      activeGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.3)]',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeText: 'text-amber-600',
      iconColor: 'text-amber-500',
    },
    route: 'certificates',
  },
  {
    id: 'architecture',
    code: 'ARCH',
    title: 'System Architecture & Metrics',
    shortTitle: 'Pipeline Architecture',
    description: 'Inspect the dual-module execution architecture, latency analysis, and experimental evaluation results.',
    tags: ['Dual Pipeline Diagram', 'Ablation Studies', 'Evaluation Benchmarks'],
    icon: Cpu,
    theme: {
      circleBg: 'from-emerald-500 to-teal-600',
      activeBorder: 'border-emerald-500',
      activeRing: 'ring-emerald-400/40',
      activeGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.3)]',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeText: 'text-emerald-600',
      iconColor: 'text-emerald-500',
    },
    route: 'architecture',
  },
]

interface CircledOptionSelectorProps {
  onProceed?: (option: CircledOption) => void
  initialSelected?: 'm1' | 'm2' | 'sender' | 'architecture'
  title?: string
  subtitle?: string
}

export function CircledOptionSelector({
  onProceed,
  initialSelected = 'm2',
  title = 'Select Workflow & Proceed',
  subtitle = 'Choose a core module with one click to proceed with your document or certificate workflow.',
}: CircledOptionSelectorProps) {
  const { navigate } = useApp()
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState<'m1' | 'm2' | 'sender' | 'architecture'>(initialSelected)

  const selectedOption = WORKFLOW_OPTIONS.find((o) => o.id === selectedId) || WORKFLOW_OPTIONS[0]

  const handleProceed = () => {
    if (onProceed) {
      onProceed(selectedOption)
    } else {
      navigate(selectedOption.route as any)
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 mb-1">
            <Sparkles className="h-3 w-3 text-indigo-600" /> Concise Workflow Hub
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">{subtitle}</p>
        </div>

        {user && (
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 pl-3 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-800 leading-tight">{user.name}</div>
              <div className="text-[9.5px] font-mono text-emerald-600 font-semibold truncate max-w-[150px]">
                {user.registeredSenderEmail}
              </div>
            </div>
            <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-xl object-cover ring-1 ring-slate-200" />
          </div>
        )}
      </div>

      {/* 4 Concise Circled Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {WORKFLOW_OPTIONS.map((opt) => {
          const isSelected = selectedId === opt.id
          const Icon = opt.icon
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedId(opt.id)}
              className={cn(
                'group relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between select-none',
                isSelected
                  ? cn('bg-white shadow-lift ring-4', opt.theme.activeBorder, opt.theme.activeRing, opt.theme.activeGlow)
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs'
              )}
            >
              <div>
                {/* Top: Circled Selector Badge + Code */}
                <div className="flex items-center justify-between mb-3">
                  {/* The Circled Selector Button */}
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-transform duration-300 group-hover:scale-105',
                      'bg-gradient-to-br',
                      opt.theme.circleBg,
                      isSelected ? 'ring-4 ring-offset-2 ring-indigo-400' : 'opacity-90'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Radio Checked Status Indicator */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-mono font-bold border',
                        isSelected ? opt.theme.badgeBg : 'bg-slate-200/60 text-slate-600 border-slate-300'
                      )}
                    >
                      {opt.code}
                    </span>
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-300 bg-white'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-black text-slate-900 leading-tight mb-1">
                  {opt.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {opt.description}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                {opt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Action Banner & Proceed Button */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-sky-50/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br',
              selectedOption.theme.circleBg
            )}
          >
            <selectedOption.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Ready to proceed with:</span>
              <span className="font-extrabold text-indigo-700">{selectedOption.title}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Click proceed to launch this workflow immediately.
            </div>
          </div>
        </div>

        <button
          onClick={handleProceed}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl gradient-brand px-6 py-3 text-xs font-black text-white shadow-lift hover:brightness-110 active:scale-95 transition"
        >
          <span>Proceed with {selectedOption.shortTitle}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

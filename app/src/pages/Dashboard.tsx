import { useApp } from '@/lib/store'
import { Card } from '@/lib/ui'
import { CircledOptionSelector } from '@/components/CircledOptionSelector'
import {
  UploadCloud,
  Award,
  FileText,
  ArrowRight,
  BrainCircuit,
  Layers3,
  ShieldCheck,
  PenLine,
  FileDown,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
  Mail,
  Send,
  PlusCircle,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ACT_ICON: Record<string, typeof BrainCircuit> = {
  analyze: BrainCircuit,
  generate: Layers3,
  validate: ShieldCheck,
  certificate: Award,
  edit: PenLine,
  export: FileDown,
}

const ACT_COLOR: Record<string, string> = {
  analyze: 'text-indigo-600 bg-indigo-50',
  generate: 'text-violet-600 bg-violet-50',
  validate: 'text-emerald-600 bg-emerald-50',
  certificate: 'text-amber-600 bg-amber-50',
  edit: 'text-sky-600 bg-sky-50',
  export: 'text-slate-600 bg-slate-100',
}

export default function Dashboard() {
  const { navigate, activity } = useApp()

  const systemStatus = [
    { label: 'Module 1 Engine', status: 'Ready', sub: '14 Universal Schema Fields', icon: FileText, color: 'text-sky-600 bg-sky-50' },
    { label: 'Module 2 Studio', status: 'Ready', sub: '0% Distortion Canvas Lock', icon: Award, color: 'text-violet-600 bg-violet-50' },
    { label: 'Registered Sender Mailer', status: 'Active', sub: 'Turbo 100ms Parallel Queue', icon: Mail, color: 'text-amber-600 bg-amber-50' },
    { label: 'Cryptographic Notary', status: 'Enforced', sub: 'SHA-256 Tamper Protection', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <div className="space-y-6 animate-fade-up pb-8">
      {/* Primary Hero: Two Core Module Cards */}
      <CircledOptionSelector />

      {/* Neat System Status & Production Readiness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStatus.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-4 border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs transition">
              <div className="flex items-center justify-between">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', s.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {s.status}
                </span>
              </div>
              <div className="mt-3 text-xs font-bold text-slate-900">{s.label}</div>
              <div className="mt-0.5 text-[11px] text-slate-500">{s.sub}</div>
            </Card>
          )
        })}
      </div>

      {/* Main Workspace Area */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left: Quick Actions & Clean Workspace Queue */}
        <div className="space-y-6">
          {/* Quick Actions Bar */}
          <Card className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-0 shadow-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10.5px] font-semibold text-indigo-200 mb-1">
                  <Sparkles className="h-3 w-3 text-indigo-400" /> Fast Execution
                </div>
                <h3 className="text-base font-bold text-white">Clean Production Workspace</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Launch any workflow with zero pre-populated mock clutter. Upload your templates or design certificates live.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => navigate('workflow')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition"
                >
                  <FileText className="h-3.5 w-3.5" /> Start M1 Ingestion
                </button>
                <button
                  onClick={() => navigate('certificates')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition"
                >
                  <Award className="h-3.5 w-3.5" /> Start M2 Studio
                </button>
              </div>
            </div>
          </Card>

          {/* Clean Active Queue / Documents */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Production Session Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Templates and certificates generated in your current session appear here.
                </p>
              </div>

              <button
                onClick={() => navigate('workflow')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>Upload New Template</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Clean Empty State without Mock Jargon */}
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-2xs">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Your Workspace is Clean and Ready</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No mock demo documents. Choose Module 1 to personalize reports or Module 2 to design and batch-issue official certificates.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => navigate('workflow')}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs transition"
                >
                  Universal Document Personalizer (M1)
                </button>
                <button
                  onClick={() => navigate('certificates')}
                  className="rounded-xl gradient-brand px-4 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition"
                >
                  Live Certificate Studio & Editor (M2)
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Real Live AI Activity Log */}
        <div>
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span>Session Activity Log</span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400">Real-Time</span>
            </div>

            {activity && activity.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto scrollbar-thin">
                {activity.slice(0, 10).map((a) => {
                  const Icon = ACT_ICON[a.icon] || BrainCircuit
                  const color = ACT_COLOR[a.icon] || 'text-indigo-600 bg-indigo-50'
                  return (
                    <div key={a.id} className="flex items-start gap-3 py-3 first:pt-1 last:pb-1">
                      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5', color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs leading-snug text-slate-700 font-medium">{a.text}</div>
                        <div className="mt-0.5 text-[10px] text-slate-400 font-mono">{a.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <span>No actions performed yet in this session.</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertTriangle, Eye, Loader2, Clock, XCircle } from 'lucide-react'
import type { JobStatus } from './data'

export function StatusPill({ status }: { status: JobStatus }) {
  const map: Record<JobStatus, { label: string; cls: string; icon: ReactNode }> = {
    queued: { label: 'Queued', cls: 'bg-slate-100 text-slate-600', icon: <Clock className="h-3 w-3" /> },
    processing: { label: 'Processing', cls: 'bg-indigo-100 text-indigo-700', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    complete: { label: 'Complete', cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
    failed: { label: 'Failed', cls: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> },
    review: { label: 'Needs Review', cls: 'bg-amber-100 text-amber-700', icon: <Eye className="h-3 w-3" /> },
  }
  const m = map[status]
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium', m.cls)}>
      {m.icon}{m.label}
    </span>
  )
}

export function AuditPill({ level }: { level: 'pass' | 'warn' | 'review' }) {
  if (level === 'pass')
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700"><CheckCircle2 className="h-3 w-3" />Passed</span>
  if (level === 'warn')
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700"><AlertTriangle className="h-3 w-3" />Warning</span>
  return <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700"><Eye className="h-3 w-3" />Needs Review</span>
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div onClick={onClick} className={cn('rounded-2xl border border-slate-200/80 bg-white shadow-soft', className)}>{children}</div>
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div className="h-full rounded-full gradient-brand transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

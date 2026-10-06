import { useEffect, useState } from 'react'
import { Card, AuditPill } from '@/lib/ui'
import { ShieldCheck, Wand2, MonitorDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Check { name: string; level: 'pass' | 'warn' | 'review'; note?: string }

const CHECKS: Check[] = [
  { name: 'Grammar', level: 'pass' },
  { name: 'Spelling', level: 'pass' },
  { name: 'Sentence structure', level: 'pass' },
  { name: 'Formatting', level: 'pass' },
  { name: 'Alignment', level: 'pass' },
  { name: 'Spacing', level: 'pass' },
  { name: 'Font consistency', level: 'pass' },
  { name: 'Date consistency', level: 'warn', note: 'Declaration page shows 24 May 2026; certificate page shows 25 May 2026' },
  { name: 'Student Name consistency', level: 'warn', note: '2 occurrences read “Aadesh S. Bhamare” instead of “Aadesh Bhamare”' },
  { name: 'Missing fields', level: 'pass' },
  { name: 'Incorrect values', level: 'pass' },
  { name: 'Roll number consistency', level: 'pass' },
  { name: 'Duplicate values', level: 'pass' },
  { name: 'Reference consistency', level: 'pass' },
  { name: 'Citation issues', level: 'pass' },
  { name: 'Template compliance', level: 'pass' },
  { name: 'Layout overflow', level: 'pass' },
]

export function ValidateStep({ auditRan, auditFixed, onRun, onFix, onExport }: {
  auditRan: boolean
  auditFixed: boolean
  onRun: () => void
  onFix: () => void
  onExport: () => void
}) {
  const [running, setRunning] = useState(false)
  const [shown, setShown] = useState(auditRan ? CHECKS.length : 0)

  useEffect(() => {
    if (!running) return
    if (shown >= CHECKS.length) { setRunning(false); onRun(); return }
    const t = setTimeout(() => setShown((s) => s + 1), 160)
    return () => clearTimeout(t)
  }, [running, shown, onRun])

  const start = () => { setShown(0); setRunning(true) }
  const warnings = CHECKS.filter((c) => c.level !== 'pass').length

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">AI Validation & Audit</h2>
            <p className="mt-0.5 text-sm text-slate-500">18 automated checks across all generated documents</p>
          </div>
          <button
            onClick={start}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-60"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Run AI Document Audit
          </button>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {CHECKS.slice(0, shown).map((c) => {
            const fixed = auditFixed
            return (
              <div key={c.name} className={cn(
                'flex items-start justify-between gap-2 rounded-xl border px-3.5 py-2.5 animate-fade-up',
                fixed || c.level === 'pass' ? 'border-slate-100' : c.level === 'warn' ? 'border-amber-200 bg-amber-50/50' : 'border-rose-200 bg-rose-50/50'
              )}>
                <div>
                  <div className="text-[13px] font-medium text-slate-800">{c.name}</div>
                  {!fixed && c.note && <div className="mt-0.5 text-[11px] leading-snug text-amber-700">{c.note}</div>}
                  {fixed && c.note && <div className="mt-0.5 text-[11px] text-emerald-600">Auto-fixed</div>}
                </div>
                <AuditPill level={fixed ? 'pass' : c.level} />
              </div>
            )
          })}
          {running && <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3.5 py-2.5 text-xs font-medium text-indigo-600"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking…</div>}
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Audit result</div>
          {auditRan ? (
            <>
              <div className="mt-3 flex items-end gap-2">
                <div className={cn('text-4xl font-extrabold', auditFixed ? 'text-emerald-600' : 'text-amber-500')}>{auditFixed ? 'PASS' : `${warnings} WARN`}</div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {auditFixed ? 'All issues were fixed automatically. Documents are ready for export.' : '2 warnings found across generated documents. You can fix them automatically.'}
              </p>
              {!auditFixed && (
                <button onClick={onFix} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                  <Wand2 className="h-4 w-4" /> Fix Automatically
                </button>
              )}
              <button onClick={onExport} disabled={!auditFixed} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-40">
                <MonitorDown className="h-4 w-4" /> Continue to Export
              </button>
            </>
          ) : (
            <p className="mt-2 text-xs text-slate-500">Run the audit to see results.</p>
          )}
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Similarity indicator</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: '7%' }} />
            </div>
            <span className="text-sm font-bold text-emerald-600">7%</span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            Low textual overlap with indexed sources. This is an <b>indicator only</b> — not a definitive plagiarism verdict. Manual review is recommended before submission.
          </p>
        </Card>
      </div>
    </div>
  )
}

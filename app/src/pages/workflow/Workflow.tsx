import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/store'
import {
  UploadCloud, BrainCircuit, Boxes, MousePointerClick, PenLine,
  Layers3, ShieldCheck, MonitorDown, Check,
} from 'lucide-react'
import { DEFAULT_RECORDS, type GeneratedDoc, type StudentRecord } from '@/lib/data'
import { UploadStep } from './UploadStep'
import { AnalyzeStep } from './AnalyzeStep'
import { EditorStep } from './EditorStep'
import { GenerateStep } from './GenerateStep'
import { ValidateStep } from './ValidateStep'
import { ExportStep } from './ExportStep'

export const STEPS = [
  { key: 'upload', label: 'Upload / Create', icon: UploadCloud },
  { key: 'analyze', label: 'AI Understanding', icon: BrainCircuit },
  { key: 'model', label: 'Universal Model', icon: Boxes },
  { key: 'fields', label: 'Smart Fields', icon: MousePointerClick },
  { key: 'edit', label: 'AI Editing', icon: PenLine },
  { key: 'generate', label: 'Generation', icon: Layers3 },
  { key: 'validate', label: 'AI Validation', icon: ShieldCheck },
  { key: 'export', label: 'Preview / Export', icon: MonitorDown },
] as const

export interface UploadedFile {
  name: string
  type: string
  size: string
  pages: number
}

const DEMO_FILE: UploadedFile = {
  name: 'Final_Year_BTech_Project_Report_SPPU.docx',
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  size: '4.2 MB',
  pages: 28,
}

export default function Workflow({ initialStep = 0 }: { initialStep?: number }) {
  const { logActivity } = useApp()
  const [step, setStep] = useState(initialStep)
  const [file, setFile] = useState<UploadedFile | null>(initialStep > 0 ? DEMO_FILE : null)
  const [analyzed, setAnalyzed] = useState(initialStep > 0)
  const [selectedField, setSelectedField] = useState<string | null>('studentName')
  const [records, setRecords] = useState<StudentRecord[]>(DEFAULT_RECORDS)
  const [generated, setGenerated] = useState<GeneratedDoc[]>([])
  const [aiEdits, setAiEdits] = useState<string[]>([])
  const [undone, setUndone] = useState<string[]>([])
  const [auditRan, setAuditRan] = useState(false)
  const [auditFixed, setAuditFixed] = useState(false)

  useEffect(() => {
    setStep(initialStep)
    if (initialStep > 0) {
      setFile((f) => f || DEMO_FILE)
      setAnalyzed(true)
    }
  }, [initialStep])

  const maxReachable = useMemo(() => {
    if (initialStep > 0) return STEPS.length - 1
    if (!file) return 0
    if (!analyzed) return 1
    return STEPS.length - 1
  }, [file, analyzed, initialStep])

  const applyAiEdit = (cmd: string) => {
    setAiEdits((p) => [...p, cmd])
    setUndone([])
    logActivity('edit', `AI edit applied — “${cmd}”`)
  }
  const undo = () => {
    setAiEdits((p) => {
      if (!p.length) return p
      setUndone((u) => [...u, p[p.length - 1]])
      return p.slice(0, -1)
    })
  }
  const redo = () => {
    setUndone((u) => {
      if (!u.length) return u
      setAiEdits((p) => [...p, u[u.length - 1]])
      return u.slice(0, -1)
    })
  }

  return (
    <div>
      {/* Stepper */}
      <div className="mb-6 overflow-x-auto scrollbar-thin">
        <div className="flex min-w-[860px] items-center">
          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step
            const reachable = i <= maxReachable
            return (
              <div key={s.key} className="flex flex-1 items-center last:flex-none">
                <button
                  disabled={!reachable}
                  onClick={() => setStep(i)}
                  className={cn('group flex flex-col items-center gap-1.5', !reachable && 'opacity-40 cursor-not-allowed')}
                >
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl border transition-all',
                    active ? 'gradient-brand border-transparent text-white shadow-lift scale-110'
                      : done ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      : 'border-slate-200 bg-white text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-500'
                  )}>
                    {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </div>
                  <span className={cn('whitespace-nowrap text-[10.5px] font-medium', active ? 'text-indigo-700' : done ? 'text-emerald-600' : 'text-slate-400')}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && <div className={cn('mx-2 mb-5 h-px flex-1', i < step ? 'bg-emerald-300' : 'bg-slate-200')} />}
              </div>
            )
          })}
        </div>
      </div>

      {step === 0 && (
        <UploadStep
          file={file}
          onFile={(f) => { setFile(f); logActivity('analyze', `Uploaded ${f.name} — ready for AI analysis`) }}
          onAnalyze={() => setStep(1)}
        />
      )}
      {step === 1 && file && (
        <AnalyzeStep
          file={file}
          analyzed={analyzed}
          onComplete={() => { setAnalyzed(true); logActivity('analyze', 'Document analyzed — 12 fields, 8 tables, 14 images detected') }}
          onOpenEditor={() => setStep(3)}
          onViewModel={() => setStep(2)}
        />
      )}
      {step === 2 && <ModelStep onContinue={() => setStep(3)} />}
      {(step === 3 || step === 4) && (
        <EditorStep
          editing={step === 4}
          selectedField={selectedField}
          onSelectField={setSelectedField}
          records={records}
          setRecords={setRecords}
          aiEdits={aiEdits}
          applyAiEdit={applyAiEdit}
          undo={undo}
          redo={redo}
          canUndo={aiEdits.length > 0}
          canRedo={undone.length > 0}
          onGenerate={() => setStep(5)}
        />
      )}
      {step === 5 && (
        <GenerateStep
          records={records}
          generated={generated}
          setGenerated={setGenerated}
          onValidated={() => setStep(6)}
        />
      )}
      {step === 6 && (
        <ValidateStep
          auditRan={auditRan}
          auditFixed={auditFixed}
          onRun={() => { setAuditRan(true); logActivity('validate', 'AI validation completed — Final Year Project Report (2 warnings)') }}
          onFix={() => { setAuditFixed(true); logActivity('validate', 'Auto-fix applied — all audit checks passed') }}
          onExport={() => setStep(7)}
        />
      )}
      {step === 7 && <ExportStep generated={generated} />}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          ← Back
        </button>
        {step < STEPS.length - 1 && step !== 4 && (
          <button
            onClick={() => setStep((s) => Math.min(maxReachable, s + 1))}
            disabled={step + 1 > maxReachable}
            className="rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-40"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}

// ── STEP: Universal Document Model ──────────────────────────────────────────

function ModelStep({ onContinue }: { onContinue: () => void }) {
  const layers = [
    { name: 'Content', desc: 'Headings, paragraphs, tables, equations — normalized text', pct: 100 },
    { name: 'Structure', desc: 'Chapters → sections → blocks hierarchy (7 chapters, 23 sections)', pct: 100 },
    { name: 'Layout', desc: 'Page geometry, bounding boxes, columns, margins', pct: 100 },
    { name: 'Styles', desc: 'Fonts, sizes, spacing, alignment — format fingerprint', pct: 100 },
    { name: 'Fields', desc: '6 semantic fields · 23 occurrences detected by AI', pct: 100 },
    { name: 'Relationships', desc: 'Cross-references, citations ↔ bibliography, figure captions', pct: 96 },
    { name: 'Metadata', desc: 'Author, title, version history, engine hints', pct: 100 },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-base font-bold text-slate-900">Universal Document Model</h2>
        <p className="mt-1 text-sm text-slate-500">
          Your document has been converted into a structured semantic model. The same model powers editing,
          personalization, validation and multi-format export — you never need to write LaTeX, Typst or placeholders.
        </p>
        <div className="mt-5 space-y-3">
          {layers.map((l) => (
            <div key={l.name} className="rounded-xl border border-slate-100 p-3.5 transition hover:border-indigo-200 hover:bg-indigo-50/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">{l.name}</span>
                <span className="text-[11px] font-medium text-emerald-600">✓ mapped</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-indigo-100 gradient-brand-soft p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Model summary</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center">
            {[['7', 'Layers'], ['23', 'Field refs'], ['50', 'Pages'], ['7', 'Engines']].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-white/80 p-3">
                <div className="text-xl font-bold text-slate-900">{v}</div>
                <div className="text-[11px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            One model → many outputs: PDF, DOCX, LaTeX, Typst, Quarto, HTML/CSS, Markdown.
          </p>
        </div>
        <button onClick={onContinue} className="w-full rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110">
          Open Smart Field Selection →
        </button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/lib/ui'
import {
  ScanText, LayoutGrid, Table2, ScanSearch, ListTree, Type,
  CheckCircle2, Loader2, PenLine, Boxes, FileText, Image as ImageIcon,
  Award,
} from 'lucide-react'
import type { UploadedFile } from './Workflow'

const PHASES = [
  { label: 'OCR & Text Extraction (25 Pages)', icon: ScanText, desc: '6,400+ words extracted and normalized' },
  { label: 'Layout & Page Border Analysis', icon: LayoutGrid, desc: 'Outer 1.5pt frame detected on Cover & Certificate' },
  { label: 'Logos, Figures & Diagrams', icon: Table2, desc: 'Trinity emblem + 7 architecture figures identified' },
  { label: 'Semantic Field Detection', icon: ScanSearch, desc: '14 dynamic fields mapped across 25 pages' },
  { label: 'Document Structure & Signatures', icon: ListTree, desc: '8 chapters, 24 subsections, 4 approval signatories' },
  { label: 'References & Citations Analysis', icon: Type, desc: '7 IEEE reference citations verified' },
]

const DETECTED_ELEMENTS = [
  { label: 'Page Border Frame', cat: 'Border', count: 'Pages 1 & 2' },
  { label: 'Trinity Academy Logo', cat: 'Logo', count: 'Vectorized' },
  { label: 'Figure 4.1 Use Case Diagram', cat: 'Diagram', count: 'Page 8' },
  { label: 'Figure 4.2 Flow Chart Diagram', cat: 'Diagram', count: 'Page 9' },
  { label: 'Figures 6.1 & 6.2 Login UI', cat: 'UI Screenshot', count: 'Page 10' },
  { label: 'Figure 6.3 Parking Grid (120 spots)', cat: 'Matrix', count: 'Page 11' },
  { label: 'Figure 6.4 QR Token Receipt', cat: 'Receipt', count: 'Page 11' },
  { label: 'Figure 6.5 Firebase Store Tree', cat: 'Database', count: 'Page 12' },
  { label: 'Running Header', cat: 'Header', count: 'Pages 3–25' },
  { label: 'Department Footer', cat: 'Footer', count: 'Pages 3–25' },
  { label: 'Guide Mrs. Shweta Joshi', cat: 'Signatory', count: 'Page 2' },
  { label: 'HOD Mrs. P.R. Patil', cat: 'Signatory', count: 'Page 2' },
  { label: 'Principal Dr R.J. Patil', cat: 'Signatory', count: 'Page 2' },
  { label: 'Aadesh Bhamare (Roll 04)', cat: 'Student', count: '14 occurrences' },
  { label: 'Vikrant Borse (Roll 08)', cat: 'Co-Author', count: '8 occurrences' },
  { label: 'Shravan Kanade (Roll 22)', cat: 'Co-Author', count: '8 occurrences' },
]

export function AnalyzeStep({
  file,
  analyzed,
  onComplete,
  onOpenEditor,
  onViewModel,
}: {
  file: UploadedFile
  analyzed: boolean
  onComplete: () => void
  onOpenEditor: () => void
  onViewModel: () => void
}) {
  const [phaseIdx, setPhaseIdx] = useState(analyzed ? PHASES.length : 0)

  useEffect(() => {
    if (analyzed) {
      setPhaseIdx(PHASES.length)
      return
    }
    if (phaseIdx >= PHASES.length) {
      onComplete()
      return
    }
    const t = setTimeout(() => setPhaseIdx((p) => p + 1), 600)
    return () => clearTimeout(t)
  }, [phaseIdx, analyzed, onComplete])

  const done = phaseIdx >= PHASES.length

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* ── Left: Processing Pipeline ────────────────────────────────────────── */}
      <Card className="p-5">
        <div className="text-sm font-bold text-slate-900">Analyzing “{file.name}”</div>
        <div className="mt-0.5 text-xs text-slate-500">Multimodal Vision + OCR + LayoutLM Pipeline</div>

        <div className="mt-4 space-y-2">
          {PHASES.map((p, i) => {
            const state = i < phaseIdx ? 'done' : i === phaseIdx ? 'run' : 'wait'
            return (
              <div
                key={p.label}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all',
                  state === 'done' && 'border-emerald-200 bg-emerald-50/70',
                  state === 'run' && 'border-indigo-300 bg-indigo-50/80 shadow-xs',
                  state === 'wait' && 'border-slate-100 opacity-50'
                )}
              >
                <p.icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    state === 'done' ? 'text-emerald-600' : state === 'run' ? 'text-indigo-600' : 'text-slate-400'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{p.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{p.desc}</div>
                </div>
                <span className="shrink-0">
                  {state === 'done' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {state === 'run' && <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />}
                </span>
              </div>
            )
          })}
        </div>

        {done && (
          <div className="mt-4 animate-fade-up rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            ✓ Complete! Borders, logos, figures, headers, and semantic fields are mapped into the Universal Document Model.
          </div>
        )}
      </Card>

      {/* ── Right: Detected Document Components ─────────────────────────────── */}
      <div className="space-y-5">
        {/* Identified Elements Badge Grid */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Detected Document Elements (A to Z Analysis)</span>
            <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10.5px] font-bold text-indigo-700">
              16 Core Anchors
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Every element is normalized into the common document AST — fully visible and editable on the canvas.
          </p>

          <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DETECTED_ELEMENTS.map((el, i) => (
              <div
                key={el.label}
                className={cn(
                  'rounded-xl border p-2 text-left transition-all',
                  i / DETECTED_ELEMENTS.length <= phaseIdx / PHASES.length
                    ? 'border-indigo-100 bg-indigo-50/50 opacity-100'
                    : 'border-slate-100 bg-slate-50 opacity-30'
                )}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{el.cat}</div>
                <div className="text-xs font-semibold text-slate-800 truncate mt-0.5">{el.label}</div>
                <div className="text-[10px] font-medium text-slate-500">{el.count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quantified Summary Cards */}
        <Card className={cn('p-5 transition-opacity', done ? 'opacity-100' : 'opacity-40 pointer-events-none')}>
          <div className="text-sm font-bold text-slate-900">Analysis Summary & Universal Model Metrics</div>
          <div className="mt-1 text-xs text-slate-500">
            Project: <span className="font-bold text-slate-800">The Ultimate Smart Parking Token System (TAE, Pune)</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: '25', l: 'Total Pages', icon: FileText, color: 'text-blue-600' },
              { v: '14', l: 'Semantic Fields', icon: ScanSearch, color: 'text-indigo-600' },
              { v: '7', l: 'Figures & Diagrams', icon: ImageIcon, color: 'text-purple-600' },
              { v: '4', l: 'Approval Signatories', icon: Award, color: 'text-emerald-600' },
            ].map(({ v, l, icon: Icon, color }) => (
              <div key={l} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-center">
                <Icon className={cn('mx-auto h-5 w-5', color)} />
                <div className="mt-1.5 text-xl font-extrabold text-slate-900">{v}</div>
                <div className="text-[11px] font-medium text-slate-500">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2.5">
            <button
              onClick={onOpenEditor}
              className="flex-1 rounded-xl gradient-brand px-4 py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center justify-center gap-1.5"
            >
              <PenLine className="h-4 w-4" /> Open Interactive Document Editor →
            </button>
            <button
              onClick={onViewModel}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Boxes className="h-4 w-4" /> View Universal Model
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

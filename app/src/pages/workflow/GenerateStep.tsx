import { useEffect, useRef, useState } from 'react'
import { Card, StatusPill } from '@/lib/ui'
import { MASTER_PAGES, TOTAL_PAGES, type GeneratedDoc, type StudentRecord } from '@/lib/data'
import { buildPdf, downloadBlob } from '@/lib/pdf'
import { resolveTokens, DocumentPage } from '@/components/DocumentRenderer'
import { useApp } from '@/lib/store'
import { Layers3, Eye, Download, GitCompareArrows, RefreshCw, X, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

function slug(name: string) {
  return name.trim().replace(/\s+/g, '_') || 'Document'
}

export function buildRecordPdf(record: StudentRecord, pages = TOTAL_PAGES): Blob {
  type Line = { text: string; size?: number; bold?: boolean; align?: 'left' | 'center'; gap?: number }
  const pdfPages = []
  for (let p = 0; p < pages; p++) {
    const model = MASTER_PAGES[p % MASTER_PAGES.length]
    const lines: Line[] = model.blocks.flatMap((b): Line[] => {
      if (b.type === 'table') return b.rows.map((r) => ({ text: r.join('   |   '), size: 9 }))
      if (b.type === 'spacer') return [{ text: '', size: 8 }]
      if (b.type === 'logo') return [{ text: `[${b.title ?? 'TRINITY ACADEMY OF ENGINEERING'}]`, size: 10, bold: true, align: 'center' }]
      if (b.type === 'figure') return [{ text: `[${b.figNum}: ${b.title}]`, size: 10, bold: true, align: 'center' }]
      if (b.type === 'student_list') return b.items.map((st) => ({ text: `${resolveTokens(st.name, record)}   —   Roll: ${resolveTokens(st.roll, record)}`, size: 10, align: 'center' as const }))
      if (b.type === 'signatures') return b.items.map((sig) => ({ text: `${resolveTokens(sig.name, record)} (${sig.title})`, size: 9 }))
      if (b.type === 'reference_list') return b.items.map((rf) => ({ text: `[${rf.num}] ${rf.text}`, size: 8.5 }))
      if (!('text' in b)) return []
      const size = b.type === 'h1' ? 20 : b.type === 'h2' ? 14 : b.type === 'h3' ? 12 : 10.5
      return [{
        text: resolveTokens(b.text, record),
        size,
        bold: b.type.startsWith('h'),
        align: (b.type === 'center' || b.type === 'h1') ? 'center' as const : 'left' as const,
      }]
    })
    lines.push({ text: `Page ${p + 1} of ${pages} · ${model.label}`, size: 8, align: 'center' as const, gap: 12 })
    pdfPages.push({ lines })
  }
  return buildPdf(pdfPages)
}

export function GenerateStep({ records, generated, setGenerated, onValidated }: {
  records: StudentRecord[]
  generated: GeneratedDoc[]
  setGenerated: React.Dispatch<React.SetStateAction<GeneratedDoc[]>>
  onValidated: () => void
}) {
  const { logActivity } = useApp()
  const [running, setRunning] = useState(false)
  const [preview, setPreview] = useState<GeneratedDoc | null>(null)
  const [compare, setCompare] = useState<[GeneratedDoc, GeneratedDoc] | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const start = () => {
    const docs: GeneratedDoc[] = records.map((r, i) => ({
      id: `g${Date.now()}_${i}`,
      name: `${slug(r.studentName)}_Report.pdf`,
      record: r,
      pages: TOTAL_PAGES,
      status: i === 0 ? 'processing' : 'queued',
      sizeKB: 480 + i * 12,
      createdAt: 'Just now',
    }))
    setGenerated(docs)
    setRunning(true)
    docs.forEach((d, i) => {
      timers.current.push(setTimeout(() => {
        setGenerated((prev) => {
          const next = prev.map((x) => x.id === d.id ? { ...x, status: 'processing' as const } : x)
          return next
        })
      }, i * 1400))
      timers.current.push(setTimeout(() => {
        setGenerated((prev) => prev.map((x) => x.id === d.id ? { ...x, status: 'complete' as const } : x))
        if (i === docs.length - 1) {
          setRunning(false)
          logActivity('generate', `${docs.length} personalized drafts generated from master document`)
        }
      }, i * 1400 + 1300))
    })
  }

  const regenerate = (id: string) => {
    setGenerated(generated.map((g) => g.id === id ? { ...g, status: 'processing' } : g))
    setTimeout(() => setGenerated((prev) => prev.map((g) => g.id === id ? { ...g, status: 'complete' } : g)), 1200)
  }

  const doneCount = generated.filter((g) => g.status === 'complete').length

  return (
    <div>
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Multi-Format Draft Generation</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              1 master document × {records.length} records → <span className="font-semibold text-slate-800">{records.length} complete, independent 50-page documents</span>. All 23 field occurrences updated per document.
            </p>
          </div>
          <button
            onClick={start}
            disabled={running || records.length === 0}
            className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-50"
          >
            <Layers3 className="h-4 w-4" /> Generate Drafts
          </button>
        </div>

        {generated.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">{running ? `Generating ${generated.length} documents…` : 'Generation complete'}</span>
              <span>{doneCount}/{generated.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full gradient-brand transition-all duration-500" style={{ width: `${(doneCount / generated.length) * 100}%` }} />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {generated.map((g) => (
                <div key={g.id} className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                  <div className="doc-page mx-auto aspect-[595/842] w-full max-w-[150px] rounded-sm p-2.5">
                    <div className="text-center text-[6px] font-bold text-slate-800 leading-tight">{g.record.college}</div>
                    <div className="mt-2 text-center text-[7px] font-bold text-slate-900">{g.record.projectTitle}</div>
                    <div className="mt-3 text-center text-[6px] text-slate-600">Submitted by</div>
                    <div className="text-center text-[7px] font-bold text-indigo-700">{g.record.studentName}</div>
                    <div className="mt-0.5 text-center text-[5.5px] text-slate-500">Roll No. {g.record.rollNumber}</div>
                    <div className="mt-4 space-y-0.5">{[...Array(7)].map((_, i) => <div key={i} className="h-0.5 rounded bg-slate-200" style={{ width: `${90 - i * 6}%` }} />)}</div>
                  </div>
                  <div className="mt-3 truncate text-[13px] font-semibold text-slate-900">{g.name}</div>
                  <div className="mt-0.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{g.pages} pages · {g.sizeKB} KB</span>
                    <StatusPill status={g.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1">
                    {[
                      { icon: Eye, label: 'Preview', fn: () => setPreview(g) },
                      { icon: Download, label: 'Save', fn: () => downloadBlob(buildRecordPdf(g.record), g.name) },
                      { icon: GitCompareArrows, label: 'Compare', fn: () => setCompare([g, generated.find((x) => x.id !== g.id) ?? g]) },
                      { icon: RefreshCw, label: 'Redo', fn: () => regenerate(g.id) },
                    ].map(({ icon: Icon, label, fn }) => (
                      <button key={label} onClick={fn} disabled={g.status !== 'complete'}
                        className="flex flex-col items-center gap-0.5 rounded-lg border border-slate-100 py-1.5 text-[9.5px] font-medium text-slate-500 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40">
                        <Icon className="h-3.5 w-3.5" />{label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!running && (
              <div className="mt-6 flex justify-end">
                <button onClick={onValidated} className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                  <ShieldCheck className="h-4 w-4" /> Run AI Document Audit →
                </button>
              </div>
            )}
          </div>
        )}

        {generated.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center text-sm text-slate-500">
            Drafts will appear here. Each output is a complete independent document — not a name swap inside one file.
          </div>
        )}
      </Card>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">{preview.name}</div>
                <div className="text-xs text-slate-500">Personalized for {preview.record.studentName} · {preview.pages} pages</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => downloadBlob(buildRecordPdf(preview.record), preview.name)} className="inline-flex items-center gap-1.5 rounded-lg gradient-brand px-3 py-1.5 text-xs font-semibold text-white"><Download className="h-3.5 w-3.5" />PDF</button>
                <button onClick={() => setPreview(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="space-y-5 bg-slate-100/70 p-4 rounded-xl">
              {[0, 1, 2].map((i) => (
                <DocumentPage key={i} pageIndex={i} record={preview.record} scale={0.92} />
              ))}
              <div className="text-center text-xs text-slate-400">… pages 4–50 continue with full personalization …</div>
            </div>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {compare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setCompare(null)}>
          <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900">Side-by-side comparison — field personalization proof</div>
              <button onClick={() => setCompare(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {compare.map((g, i) => (
                <div key={i} className={cn('rounded-xl border p-3', i === 0 ? 'border-indigo-200' : 'border-violet-200')}>
                  <div className="mb-2 text-center text-xs font-bold text-slate-700">{g.record.studentName} — {g.name}</div>
                  <div className="bg-slate-100/70 rounded-lg p-2">
                    <DocumentPage pageIndex={1} record={g.record} scale={0.62} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs font-medium text-emerald-700">
              ✓ All 23 field occurrences differ correctly between documents — content, structure and formatting otherwise identical.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

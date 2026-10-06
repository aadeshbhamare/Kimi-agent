import { useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import { DocumentPage } from '@/components/DocumentRenderer'
import { buildRecordPdf } from './GenerateStep'
import { downloadBlob } from '@/lib/pdf'
import { useApp } from '@/lib/store'
import type { GeneratedDoc } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Download, Maximize2, FileDown, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const ENGINES = [
  { fmt: 'PDF', engine: 'WeasyPrint / LaTeX', desc: 'Print-ready final output' },
  { fmt: 'DOCX', engine: 'python-docx', desc: 'Word-compatible editing' },
  { fmt: 'LaTeX', engine: 'LaTeX', desc: 'Research papers & theses' },
  { fmt: 'Typst', engine: 'Typst', desc: 'Modern academic documents' },
  { fmt: 'Quarto', engine: 'Quarto', desc: 'Data-science reports' },
  { fmt: 'HTML/CSS', engine: 'HTML/CSS', desc: 'Custom visual documents' },
  { fmt: 'Markdown', engine: 'Markdown', desc: 'Lightweight portable text' },
]

export function ExportStep({ generated }: { generated: GeneratedDoc[] }) {
  const { logActivity } = useApp()
  const [docIdx, setDocIdx] = useState(0)
  const [page, setPage] = useState(0)
  const [full, setFull] = useState(false)
  const [engine, setEngine] = useState('PDF')
  const doc = generated[docIdx]

  const exportAll = () => {
    generated.forEach((g) => downloadBlob(buildRecordPdf(g.record), g.name))
    logActivity('export', `Exported ${generated.length} generated documents (PDF)`)
  }

  return (
    <div>
      <PageHeader
        title="Preview & Export"
        subtitle="High-fidelity preview with thumbnails, zoom, search, compare — and multi-format export. The right engine is selected automatically."
        actions={
          <button onClick={exportAll} disabled={!generated.length} className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-40">
            <FileDown className="h-4 w-4" /> Export all ({generated.length})
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <select value={docIdx} onChange={(e) => setDocIdx(+e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium outline-none">
              {generated.length === 0 && <option>Master document</option>}
              {generated.map((g, i) => <option key={g.id} value={i}>{g.name}</option>)}
            </select>
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-xs text-slate-500">Page {page + 1}</span>
            <button onClick={() => setPage((p) => Math.min(5, p + 1))} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><ChevronRight className="h-4 w-4" /></button>
            <div className="relative ml-auto hidden sm:block">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search…" className="w-36 rounded-lg border border-slate-200 py-1.5 pl-7 pr-2 text-xs outline-none" />
            </div>
            <button onClick={() => setFull((f) => !f)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" title="Full screen"><Maximize2 className="h-4 w-4" /></button>
          </div>
          <div className={cn('bg-slate-100/70 p-6 overflow-auto scrollbar-thin', full && 'fixed inset-0 z-50')}>
            <DocumentPage pageIndex={page} record={doc?.record ?? {}} scale={full ? 1.2 : 1} />
            {full && <button onClick={() => setFull(false)} className="mx-auto mt-4 block rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">Exit full screen</button>}
          </div>
          <div className="flex gap-2 overflow-x-auto border-t border-slate-100 p-3 scrollbar-thin">
            {[...Array(6)].map((_, i) => (
              <button key={i} onClick={() => setPage(i)} className={cn('shrink-0 rounded-md border p-1 transition', page === i ? 'border-indigo-400 ring-1 ring-indigo-200' : 'border-slate-200')}>
                <div className="doc-page h-16 w-12 rounded-sm p-1">
                  <div className="h-0.5 w-3/4 rounded bg-slate-300" />
                  <div className="mt-0.5 space-y-0.5">{[...Array(4)].map((_, j) => <div key={j} className="h-px bg-slate-200" />)}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-900">Output format</div>
            <p className="mt-0.5 text-[11px] text-slate-500">You choose the format — the engine is selected automatically.</p>
            <div className="mt-3 space-y-1.5">
              {ENGINES.map((e) => (
                <button key={e.fmt} onClick={() => setEngine(e.fmt)} className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition',
                  engine === e.fmt ? 'border-indigo-300 bg-indigo-50/60 ring-1 ring-indigo-200' : 'border-slate-100 hover:border-indigo-100'
                )}>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{e.fmt}</div>
                    <div className="text-[10.5px] text-slate-500">{e.desc}</div>
                  </div>
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[9.5px] text-slate-500">{e.engine}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => { if (doc) downloadBlob(buildRecordPdf(doc.record), doc.name); logActivity('export', `Exported ${doc?.name ?? 'document'} (${engine})`) }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110"
            >
              <Download className="h-4 w-4" /> Generate {engine}
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}

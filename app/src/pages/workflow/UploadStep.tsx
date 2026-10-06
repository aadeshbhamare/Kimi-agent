import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/lib/ui'
import { UploadCloud, FileText, FilePlus2, FileImage, FileCode2, CheckCircle2, Sparkles, BookOpen } from 'lucide-react'
import type { UploadedFile } from './Workflow'

const ACCEPTED = [
  { ext: 'PDF', icon: FileText },
  { ext: 'DOCX', icon: FileText },
  { ext: 'Image', icon: FileImage },
  { ext: 'LaTeX', icon: FileCode2 },
  { ext: 'Typst', icon: FileCode2 },
  { ext: 'Markdown', icon: FileCode2 },
  { ext: 'HTML', icon: FileCode2 },
]

export function UploadStep({
  file,
  onFile,
  onAnalyze,
}: {
  file: UploadedFile | null
  onFile: (f: UploadedFile) => void
  onAnalyze: () => void
}) {
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const simulateUpload = useCallback(
    (name: string, type: string, pages = 25, size = '6.4 MB') => {
      setUploading(true)
      setProgress(0)
      const iv = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(iv)
            setUploading(false)
            onFile({ name, type, size, pages })
            return 100
          }
          return p + 15
        })
      }, 70)
    },
    [onFile]
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    simulateUpload(
      f?.name ?? 'CEP_Project_Report_Smart_Parking_Token_System.pdf',
      f?.name?.split('.').pop()?.toUpperCase() ?? 'PDF',
      25,
      '6.4 MB'
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white px-6 py-12 text-center transition-all shadow-soft',
            dragging ? 'border-indigo-400 bg-indigo-50/60 scale-[1.01]' : 'border-slate-300 hover:border-indigo-300'
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand-soft border border-indigo-100">
            <UploadCloud className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">Upload Existing Document</h2>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Upload any academic report, thesis, or certificate. AI will automatically analyze borders, college logos,
            architecture diagrams, running headers, and semantic fields without requiring merge tags.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {ACCEPTED.map(({ ext, icon: Icon }) => (
              <span
                key={ext}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
              >
                <Icon className="h-3 w-3 text-slate-400" />
                {ext}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {/* Direct load for the user's authentic report */}
            <button
              onClick={() =>
                simulateUpload(
                  'CEP_Project_Report_Smart_Parking_Token_System.pdf',
                  'PDF (SPPU Academic)',
                  25,
                  '6.4 MB'
                )
              }
              className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110"
            >
              <BookOpen className="h-4 w-4" /> Load "Smart Parking Token System" Report (25p)
            </button>

            <button
              onClick={() =>
                simulateUpload('CEP_Project_Report_Smart_Parking_Token_System.pdf', 'PDF', 25, '6.4 MB')
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse other files
            </button>

            <button
              onClick={() => onFile({ name: 'Blank Academic Report', type: 'New', size: '0 KB', pages: 1 })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FilePlus2 className="h-4 w-4" /> Create Blank
            </button>
          </div>

          {uploading && (
            <div className="mt-5 w-full max-w-xs">
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full gradient-brand transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-1 text-[11px] text-slate-500 font-medium">Ingesting into Universal Document Model… {progress}%</div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {file ? (
          <Card className="p-5 animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">{file.name}</div>
                <div className="text-xs text-slate-500">{file.type} · {file.size}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ['Pages', `${file.pages}`],
                ['Size', file.size],
                ['Format', file.type.split(' ')[0]],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <div className="text-sm font-bold text-slate-900">{v}</div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">{l}</div>
                </div>
              ))}
            </div>

            <div className="mt-3.5 space-y-1.5 rounded-xl bg-emerald-50/70 p-3 border border-emerald-100 text-xs font-medium text-emerald-800">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Ready for AI Understanding
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Detected: Trinity Academy of Engineering (SPPU) Project Report with outer border, emblems, diagrams, and signatures.
              </p>
            </div>

            <button
              onClick={onAnalyze}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-bold text-white shadow-lift hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" /> Start AI Vision & Document Analysis →
            </button>
          </Card>
        ) : (
          <Card className="p-5">
            <div className="text-sm font-bold text-slate-800">Novelty & Architecture</div>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Instead of traditional mail merge that requires creating merge tags, our AI converts the raw document into an intelligent Universal Document Model.
            </p>
            <ol className="mt-3 space-y-2 text-xs text-slate-600">
              {[
                'Detects page borders, logos, and margin geometry',
                'Identifies architecture figures and diagrams',
                'Auto-groups student occurrences across all 25 pages',
                'Generates independent personalized drafts',
                'Validates layout and exports to LaTeX/Typst/PDF',
              ].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>
    </div>
  )
}

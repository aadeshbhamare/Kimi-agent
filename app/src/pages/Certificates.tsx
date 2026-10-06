import { useMemo, useRef, useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import { analyzeFit, generateCertRecords, CERT_FIELDS, type CertRecord, type FitResult } from '@/lib/data'
import { CertificateView } from '@/components/Certificate'
import { buildPdf, downloadBlob } from '@/lib/pdf'
import { buildZip } from '@/lib/zip'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  UploadCloud, FileSpreadsheet, ScanSearch, Lock, Ruler, Wand2, Layers3, MonitorDown,
  Check, CheckCircle2, Download, ChevronRight,
} from 'lucide-react'

const STEPS = [
  { label: 'Upload Template', icon: UploadCloud },
  { label: 'Upload Data', icon: FileSpreadsheet },
  { label: 'AI Field Mapping', icon: ScanSearch },
  { label: 'Design Lock', icon: Lock },
  { label: 'Fit Analysis', icon: Ruler },
  { label: 'Adaptive Fitting', icon: Wand2 },
  { label: 'Bulk Generation', icon: Layers3 },
  { label: 'Preview & Download', icon: MonitorDown },
]

function certPdf(record: CertRecord, fit?: FitResult): Blob {
  const size = fit?.fontSize ?? 34
  return buildPdf([{
    landscape: true,
    lines: [
      { text: record.college, size: 13, align: 'center' },
      { text: 'CERTIFICATE OF ACHIEVEMENT', size: 22, bold: true, align: 'center', gap: 10 },
      { text: 'This certificate is proudly presented to', size: 10, align: 'center', gap: 8 },
      { text: record.name, size, bold: true, align: 'center', gap: 14 },
      { text: record.achievement, size: 12, align: 'center', gap: 10 },
      { text: `Rank: ${record.rank}`, size: 11, align: 'center', gap: 6 },
      { text: `${record.certNumber}        Date: ${record.date}`, size: 9, align: 'center', gap: 40 },
    ],
  }])
}

export default function Certificates() {
  const { logActivity } = useApp()
  const [step, setStep] = useState(0)
  const [templateReady, setTemplateReady] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const records = useMemo(() => generateCertRecords(100), [])
  const [mapping, setMapping] = useState<Record<string, string>>({
    name: 'Name', college: 'College', achievement: 'Achievement', certNumber: 'Certificate Number', date: 'Date', rank: 'Rank',
  })
  const [locks, setLocks] = useState<Record<string, boolean>>({
    Background: true, Logo: true, Border: true, Graphics: true, 'Static text': true, Colors: true, Decorations: true,
  })
  const [fits, setFits] = useState<FitResult[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [genProgress, setGenProgress] = useState(-1) // -1 idle
  const [previewTab, setPreviewTab] = useState<'normal' | 'adaptive' | 'review'>('normal')
  const [numberPattern, setNumberPattern] = useState('TRINITY-2026-###')
  const timers = useRef<ReturnType<typeof setInterval>[]>([])

  const runAnalysis = () => {
    setAnalyzing(true)
    setTimeout(() => { setFits(analyzeFit(records)); setAnalyzing(false) }, 1400)
  }

  const stats = useMemo(() => ({
    normal: fits.filter((f) => f.status === 'normal').length,
    adaptive: fits.filter((f) => f.status === 'adaptive').length,
    review: fits.filter((f) => f.status === 'review').length,
  }), [fits])

  const startGeneration = () => {
    setGenProgress(0)
    const iv = setInterval(() => {
      setGenProgress((p) => {
        if (p >= 100) {
          clearInterval(iv)
          logActivity('certificate', `Certificate batch generated — ${records.length} certificates (${numberPattern.replace('###', '001')}…)`)
          return 100
        }
        return p + 2
      })
    }, 60)
    timers.current.push(iv)
  }

  const numbered = (r: CertRecord, i: number) => ({ ...r, certNumber: numberPattern.replace(/#+/g, (m) => String(i + 1).padStart(m.length, '0')) })

  const downloadAllZip = async () => {
    const files = records.map((r, i) => {
      const rec = numbered(r, i)
      return { name: `${rec.certNumber}_${r.name.replace(/\s+/g, '_')}.pdf`, data: certPdf(rec, fits[i]) }
    })
    const zip = await buildZip(files)
    downloadBlob(zip, 'certificates_batch.zip')
  }

  const downloadCombined = () => {
    const pages = records.slice(0, 100).map((r, i) => {
      const rec = numbered(r, i)
      return {
        landscape: true,
        lines: [
          { text: rec.college, size: 13, align: 'center' as const },
          { text: 'CERTIFICATE OF ACHIEVEMENT', size: 22, bold: true, align: 'center' as const, gap: 10 },
          { text: 'This certificate is proudly presented to', size: 10, align: 'center' as const, gap: 8 },
          { text: rec.name, size: fits[i]?.fontSize ?? 34, bold: true, align: 'center' as const, gap: 14 },
          { text: rec.achievement, size: 12, align: 'center' as const, gap: 10 },
          { text: `${rec.certNumber}        Date: ${rec.date}`, size: 9, align: 'center' as const, gap: 40 },
        ],
      }
    })
    downloadBlob(buildPdf(pages), 'certificates_combined.pdf')
  }

  const canContinue =
    (step === 0 && templateReady) || (step === 1 && dataReady) || (step === 4 && fits.length > 0) ||
    (step === 6 && genProgress >= 100) || (step !== 0 && step !== 1 && step !== 4 && step !== 6)

  const filteredFits = fits.filter((f) => f.status === previewTab)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Certificate Automation"
        subtitle="AI field detection · spreadsheet mapping · capacity analysis · adaptive fitting · bulk generation — the design never changes"
      />

      {/* Stepper */}
      <div className="mb-6 overflow-x-auto scrollbar-thin">
        <div className="flex min-w-[820px] items-center">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center last:flex-none">
              <button onClick={() => i < step && setStep(i)} className={cn('flex flex-col items-center gap-1.5', i < step ? 'cursor-pointer' : 'cursor-default')}>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl border transition-all',
                  i === step ? 'gradient-brand border-transparent text-white shadow-lift scale-110'
                    : i < step ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : 'border-slate-200 bg-white text-slate-400')}>
                  {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={cn('whitespace-nowrap text-[10.5px] font-medium', i === step ? 'text-indigo-700' : i < step ? 'text-emerald-600' : 'text-slate-400')}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <div className={cn('mx-2 mb-5 h-px flex-1', i < step ? 'bg-emerald-300' : 'bg-slate-200')} />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: template */}
      {step === 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 p-10 text-center">
            <UploadCloud className="h-10 w-10 text-indigo-400" />
            <div className="mt-3 text-sm font-bold text-slate-900">Upload certificate template</div>
            <p className="mt-1 text-xs text-slate-500">PDF, PNG or JPG — your design is used as-is</p>
            <button
              onClick={() => setTemplateReady(true)}
              className="mt-4 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-lift hover:brightness-110"
            >
              {templateReady ? '✓ Template loaded — re-upload' : 'Browse files'}
            </button>
          </Card>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Template preview</div>
            {templateReady ? <CertificateView /> : (
              <div className="flex aspect-[842/595] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-400">No template yet</div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: data */}
      {step === 1 && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 p-8 text-center">
            <FileSpreadsheet className="h-10 w-10 text-emerald-500" />
            <div className="mt-3 text-sm font-bold text-slate-900">Upload Excel / CSV</div>
            <p className="mt-1 text-xs text-slate-500">Columns: Name, College, Achievement, Certificate Number, Date, Rank</p>
            <button onClick={() => setDataReady(true)} className="mt-4 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-lift hover:brightness-110">
              {dataReady ? '✓ 100 rows loaded' : 'Load sample data'}
            </button>
          </Card>
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700">Data preview {dataReady && `— ${records.length} records`}</div>
            <div className="max-h-80 overflow-auto scrollbar-thin">
              {dataReady ? (
                <table className="w-full text-[11.5px]">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr className="text-left text-slate-500">
                      {['Name', 'College', 'Achievement', 'Cert №', 'Date', 'Rank'].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {records.slice(0, 12).map((r, i) => (
                      <tr key={i} className="border-t border-slate-50">
                        <td className="px-3 py-1.5 font-medium text-slate-800">{r.name}</td>
                        <td className="px-3 py-1.5 text-slate-600">{r.college}</td>
                        <td className="max-w-44 truncate px-3 py-1.5 text-slate-600">{r.achievement}</td>
                        <td className="px-3 py-1.5 font-mono text-slate-500">{r.certNumber}</td>
                        <td className="px-3 py-1.5 text-slate-600">{r.date}</td>
                        <td className="px-3 py-1.5 text-slate-600">{r.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-xs text-slate-400">Upload a spreadsheet to preview records</div>
              )}
            </div>
            {dataReady && <div className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">… and 88 more rows</div>}
          </Card>
        </div>
      )}

      {/* STEP 3: mapping */}
      {step === 2 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <ScanSearch className="h-4 w-4 text-indigo-500" /> AI detected 6 field areas
            </div>
            <CertificateView record={records[0]} showOverlays />
          </div>
          <Card className="p-5">
            <div className="text-sm font-bold text-slate-900">Field → column mapping</div>
            <p className="mt-0.5 text-xs text-slate-500">AI mapped CSV columns automatically. Correct anything manually.</p>
            <div className="mt-4 space-y-2.5">
              {CERT_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-slate-800">{f.label}</div>
                    <div className="text-[10.5px] text-slate-400">{f.area}</div>
                  </div>
                  <select
                    value={mapping[f.key]}
                    onChange={(e) => setMapping({ ...mapping, [f.key]: e.target.value })}
                    className="ml-auto rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium outline-none focus:border-indigo-300"
                  >
                    {['Name', 'College', 'Achievement', 'Certificate Number', 'Date', 'Rank', '— unmapped —'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> All 6 fields mapped with 98.4% detection confidence
            </div>
          </Card>
        </div>
      )}

      {/* STEP 4: design lock */}
      {step === 3 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Lock className="h-4 w-4 text-violet-500" /> Design Lock</div>
            <p className="mt-1 text-xs text-slate-500">Locked elements are frozen in every output — only dynamic fields change.</p>
            <div className="mt-4 space-y-2">
              {Object.entries(locks).map(([k, v]) => (
                <label key={k} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                  <span className="text-[13px] font-medium text-slate-700">{k}</span>
                  <button
                    onClick={() => setLocks({ ...locks, [k]: !v })}
                    className={cn('relative h-6 w-11 rounded-full transition-colors', v ? 'bg-violet-500' : 'bg-slate-200')}
                  >
                    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', v ? 'left-[22px]' : 'left-0.5')} />
                  </button>
                </label>
              ))}
            </div>
          </Card>
          <div className="flex flex-col justify-center rounded-2xl border border-violet-100 gradient-brand-soft p-6">
            <div className="text-sm font-bold text-slate-900">Why design lock matters</div>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              Bulk tools often reflow layouts when content changes. Here, the certificate's visual identity —
              background artwork, logo placement, borders, colors and typography — is extracted and frozen at the model level.
              Adaptive fitting only ever adjusts <b>inside</b> each field's designated area.
            </p>
            <div className="mt-4 rounded-xl bg-white/80 p-3 text-[11.5px] text-slate-500">
              {Object.values(locks).filter(Boolean).length} of 7 design elements locked
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: fit analysis */}
      {step === 4 && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-slate-900">Capacity & Fit Analysis</div>
                <p className="mt-0.5 text-xs text-slate-500">Per field: character count, word count, available width/height, rendered size, max lines, font size, line spacing and overflow risk.</p>
              </div>
              <button onClick={runAnalysis} disabled={analyzing} className="rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-60">
                {analyzing ? 'Analyzing 100 certificates…' : fits.length ? 'Re-run analysis' : 'Analyze 100 certificates'}
              </button>
            </div>
            {fits.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-3 animate-fade-up">
                {[
                  { v: stats.normal, l: 'Normal fit', cls: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
                  { v: stats.adaptive, l: 'Adaptive fit', cls: 'border-sky-200 bg-sky-50 text-sky-700' },
                  { v: stats.review, l: 'Manual review', cls: 'border-amber-200 bg-amber-50 text-amber-700' },
                ].map((s) => (
                  <div key={s.l} className={cn('rounded-xl border p-4 text-center', s.cls)}>
                    <div className="text-3xl font-extrabold">{s.v}</div>
                    <div className="text-xs font-medium">{s.l}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          {fits.length > 0 && (
            <Card className="overflow-hidden animate-fade-up">
              <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700">Per-record fit detail (name field)</div>
              <div className="max-h-80 overflow-auto scrollbar-thin">
                <table className="w-full text-[11.5px]">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr className="text-left text-slate-500">
                      {['Name', 'Chars', 'Words', 'Font', 'Lines', 'Overflow risk', 'Status'].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {fits.map((f, i) => (
                      <tr key={i} className="border-t border-slate-50">
                        <td className="px-3 py-1.5 font-medium text-slate-800">{f.record.name}</td>
                        <td className="px-3 py-1.5 text-slate-600">{f.chars}</td>
                        <td className="px-3 py-1.5 text-slate-600">{f.words}</td>
                        <td className="px-3 py-1.5 text-slate-600">{f.fontSize}px</td>
                        <td className="px-3 py-1.5 text-slate-600">{f.lines}</td>
                        <td className="px-3 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                              <div className={cn('h-full rounded-full', f.risk > 0.75 ? 'bg-amber-400' : f.risk > 0.45 ? 'bg-sky-400' : 'bg-emerald-400')} style={{ width: `${f.risk * 100}%` }} />
                            </div>
                            <span className="text-slate-500">{Math.round(f.risk * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-1.5">
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            f.status === 'normal' && 'bg-emerald-100 text-emerald-700',
                            f.status === 'adaptive' && 'bg-sky-100 text-sky-700',
                            f.status === 'review' && 'bg-amber-100 text-amber-700')}>
                            {f.status === 'normal' ? 'Normal' : f.status === 'adaptive' ? 'Adaptive' : 'Review'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* STEP 6: adaptive fitting */}
      {step === 5 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Wand2 className="h-4 w-4 text-sky-500" /> Adaptive Fitting</div>
            <p className="mt-1 text-xs text-slate-500">Long names are fitted intelligently — font size reduction, line breaks, spacing — while alignment and the fixed design stay untouched.</p>
            <ul className="mt-4 space-y-2 text-[13px] text-slate-600">
              {['Intelligently reduce font size within field bounds', 'Create line breaks at natural word boundaries', 'Adjust line spacing and preserve centering', 'Keep all text inside the designated area', 'Never alter background, logo, border or colors'].map((li) => (
                <li key={li} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />{li}</li>
              ))}
            </ul>
          </Card>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Live examples</div>
            <div className="space-y-3">
              {fits.filter((f) => f.status !== 'normal').slice(0, 3).map((f, i) => (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700">{f.record.name}</span>
                    <span className="text-slate-400">font 34px → {f.fontSize}px{f.lines > 1 ? ' · wrapped to 2 lines' : ''}</span>
                  </div>
                  <CertificateView record={f.record} fit={f} small />
                </div>
              ))}
              {fits.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">Run fit analysis in the previous step to see examples</div>}
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: bulk generation */}
      {step === 6 && (
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-slate-900">Bulk Generation</div>
              <p className="mt-0.5 text-xs text-slate-500">Supports batches of 100, 500 and 1,000+ certificates. Jobs run asynchronously (FastAPI → Redis → Celery → Storage).</p>
            </div>
            <button onClick={startGeneration} disabled={genProgress >= 0 && genProgress < 100} className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-50">
              <Layers3 className="h-4 w-4" /> {genProgress >= 100 ? 'Regenerate batch' : genProgress >= 0 ? 'Generating…' : 'Generate 100 certificates'}
            </button>
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-700">Certificate numbering pattern</label>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <input value={numberPattern} onChange={(e) => setNumberPattern(e.target.value)} className="w-56 rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-300" />
              <span className="text-[11px] text-slate-400">### = padded sequence → {numberPattern.replace(/#+/g, '001')}, {numberPattern.replace(/#+/g, '002')}…</span>
            </div>
          </div>
          {genProgress >= 0 && (
            <div className="mt-5 animate-fade-up">
              <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                <span>{genProgress < 100 ? `Generating… ${Math.round(genProgress)} of 100` : 'Batch complete'}</span>
                <span>{Math.round(genProgress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full gradient-brand transition-all" style={{ width: `${genProgress}%` }} />
              </div>
              {genProgress >= 100 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => downloadBlob(certPdf(numbered(records[0], 0), fits[0]), `${numbered(records[0], 0).certNumber}.pdf`)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"><Download className="h-3.5 w-3.5" /> Individual PDF</button>
                  <button onClick={downloadCombined} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"><Download className="h-3.5 w-3.5" /> Combined PDF (100)</button>
                  <button onClick={downloadAllZip} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600"><Download className="h-3.5 w-3.5" /> ZIP archive</button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* STEP 8: preview */}
      {step === 7 && (
        <div>
          <div className="mb-4 flex gap-2">
            {(['normal', 'adaptive', 'review'] as const).map((t) => (
              <button key={t} onClick={() => setPreviewTab(t)} className={cn('rounded-full px-4 py-1.5 text-xs font-semibold capitalize',
                previewTab === t ? 'gradient-brand text-white shadow-lift' : 'border border-slate-200 bg-white text-slate-600')}>
                {t === 'normal' ? `Normal (${stats.normal})` : t === 'adaptive' ? `Adapted (${stats.adaptive})` : `Manual review (${stats.review})`}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFits.slice(0, 9).map((f, i) => {
              const rec = numbered(f.record, records.indexOf(f.record))
              return (
                <Card key={i} className="p-3">
                  <CertificateView record={rec} fit={f} small />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-slate-800">{f.record.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{rec.certNumber}</div>
                    </div>
                    <button onClick={() => downloadBlob(certPdf(rec, f), `${rec.certNumber}.pdf`)} className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-indigo-200 hover:text-indigo-600"><Download className="h-3.5 w-3.5" /></button>
                  </div>
                </Card>
              )
            })}
          </div>
          {filteredFits.length > 9 && <div className="mt-3 text-center text-xs text-slate-400">… and {filteredFits.length - 9} more in this category</div>}
          {filteredFits.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">No certificates in this category</div>}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40">← Back</button>
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep((s) => s + 1)} disabled={!canContinue} className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-40">
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

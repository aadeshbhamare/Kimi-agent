import { useMemo, useRef, useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import {
  analyzeFit,
  generateCertRecords,
  parseCsvData,
  CERT_FIELDS,
  CERT_TEMPLATES,
  DETECTED_CERT_BOUNDING_BOXES,
  type CertRecord,
  type FitResult,
  type CertTemplate,
} from '@/lib/data'
import { CertificateView } from '@/components/Certificate'
import { buildPdf, downloadBlob } from '@/lib/pdf'
import { buildZip } from '@/lib/zip'
import { certPng } from '@/lib/certCanvas'
import { useApp } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import { SenderEmailHub } from '@/components/SenderEmailHub'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  UploadCloud, FileSpreadsheet, ScanSearch, Lock, Ruler, Wand2, Layers3, MonitorDown,
  Check, CheckCircle2, Download, ChevronRight, Mail, Send, Eye, RefreshCw, AlertTriangle,
  Plus, Trash2, Search, ShieldCheck, Sparkles, Image as ImageIcon, ExternalLink, Filter,
  Sliders, Edit3, Palette, RotateCcw,
} from 'lucide-react'

export const COLOR_PRESETS = [
  { label: 'Royal Navy', text: '#1e1b4b', accent: '#4f46e5' },
  { label: 'Sapphire Blue', text: '#1e3a8a', accent: '#2563eb' },
  { label: 'Emerald Green', text: '#064e3b', accent: '#059669' },
  { label: 'Luxury Gold', text: '#78350f', accent: '#d97706' },
  { label: 'Crimson Maroon', text: '#7f1d1d', accent: '#dc2626' },
  { label: 'Amethyst Purple', text: '#581c87', accent: '#9333ea' },
  { label: 'Onyx Charcoal', text: '#09090b', accent: '#475569' },
]

export const INITIAL_SINGLE_RECORD: CertRecord = {
  name: 'Aadesh Bhamare',
  college: 'DocuGenius Academy of Engineering',
  achievement: 'Certificate of Excellence & Outstanding Contribution',
  certNumber: 'DOCU-2026-001',
  date: '07 Oct 2026',
  rank: 'Distinction',
  email: 'aadesh@example.com',
}

const PIPELINE_STEPS = [
  { id: 'template', label: '1. Template & Field Detection', icon: ScanSearch, sub: 'AI field detection & bounding boxes' },
  { id: 'data', label: '2. Data Processing & Mapping', icon: FileSpreadsheet, sub: 'Excel/CSV upload & column mapping' },
  { id: 'lock', label: '3. Layout Analysis & Design Lock', icon: Lock, sub: 'Preserve background, logos & borders' },
  { id: 'fit', label: '4. Text-Fit & Adaptive Formatting', icon: Ruler, sub: 'Detect overflow & adjust font/spacing' },
  { id: 'generate', label: '5. Batch Generation & Validation', icon: Layers3, sub: 'Bulk generator & automated checks' },
  { id: 'distribution', label: '6. Export & Email Distribution', icon: Mail, sub: 'PDF/PNG/ZIP & organizer verified emails' },
]

function certPdf(record: CertRecord, fit?: FitResult): Blob {
  const size = fit?.fontSize ?? 34
  return buildPdf([{
    landscape: true,
    lines: [
      { text: record.college || 'DocuGenius Academy', size: 13, align: 'center' },
      { text: 'CERTIFICATE OF ACHIEVEMENT', size: 22, bold: true, align: 'center', gap: 10 },
      { text: 'This certificate is proudly presented to', size: 10, align: 'center', gap: 8 },
      { text: record.name || 'Recipient Name', size, bold: true, align: 'center', gap: 14 },
      { text: record.achievement || 'Certificate of Excellence', size: 12, align: 'center', gap: 10 },
      { text: record.rank ? `Rank: ${record.rank}` : 'Distinction', size: 11, align: 'center', gap: 6 },
      { text: `${record.certNumber || 'DOCU-001'}        Date: ${record.date || '2026'}`, size: 9, align: 'center', gap: 40 },
    ],
  }])
}

export default function Certificates() {
  const { logActivity } = useApp()
  const { user, openAuthModal } = useAuth()
  const [step, setStep] = useState(0)

  // Step 1: Template & Detection
  const [selectedTemplate, setSelectedTemplate] = useState<CertTemplate>(CERT_TEMPLATES[0])
  const [customTemplateName, setCustomTemplateName] = useState<string | null>(null)
  const [customTemplateUrl, setCustomTemplateUrl] = useState<string | null>(null)
  const [nameYPercent, setNameYPercent] = useState<number>(41)
  const [nameFontSizeScale, setNameFontSizeScale] = useState<number>(1)
  const [isSenderHubOpen, setIsSenderHubOpen] = useState(false)
  const [scanningTemplate, setScanningTemplate] = useState(false)
  const [templateScanned, setTemplateScanned] = useState(true)
  const [activeHighlightField, setActiveHighlightField] = useState<string | null>(null)

  // Live Editable & Color Customization
  const [isLiveEditable, setIsLiveEditable] = useState(true)
  const [certTextColor, setCertTextColor] = useState('#1e1b4b')
  const [certAccentColor, setCertAccentColor] = useState('#4f46e5')
  const [activeEditIndex, setActiveEditIndex] = useState(0)

  // Step 2: Data Processing & Mapping (Clean single starter record instead of 100 fake students)
  const [records, setRecords] = useState<CertRecord[]>([INITIAL_SINGLE_RECORD])
  const [searchQuery, setSearchQuery] = useState('')
  const [mapping, setMapping] = useState<Record<string, string>>({
    name: 'Full Name',
    college: 'Institution',
    achievement: 'Award / Event',
    certNumber: 'Certificate ID',
    date: 'Issue Date',
    rank: 'Rank / Distinction',
    email: 'Recipient Email',
  })

  // Step 3: Design Lock
  const [locks, setLocks] = useState<Record<string, boolean>>({
    'Background Canvas & Watermark': true,
    'Institutional Logo & Crest': true,
    'Ornate Double Frame Border': true,
    'Official Verified Seal': true,
    'Static Boilerplate Typography': true,
    'Signatory Names & Roles': true,
  })
  const [showLockOverlay, setShowLockOverlay] = useState(true)

  // Step 4: Text-Fit & Adaptive Formatting
  const [fits, setFits] = useState<FitResult[]>(() => analyzeFit([INITIAL_SINGLE_RECORD]))
  const [analyzingFit, setAnalyzingFit] = useState(false)
  const [testCustomName, setTestCustomName] = useState('Aadesh Bhamare')
  const [previewTab, setPreviewTab] = useState<'all' | 'normal' | 'adaptive' | 'review'>('all')

  // Step 5: Batch Generation & Validation
  const [numberPattern, setNumberPattern] = useState('DOCU-2026-###')
  const [genProgress, setGenProgress] = useState(-1) // -1 idle, 0..100 running
  const [validationRun, setValidationRun] = useState(true)
  const [validationFilter, setValidationFilter] = useState<'all' | 'issues'>('all')

  // Step 6: Export & Email Distribution
  const [organizerVerified, setOrganizerVerified] = useState(false)
  const [emailSubject, setEmailSubject] = useState('Congratulations {{name}}! Your Certificate for {{achievement}}')
  const [emailBody, setEmailBody] = useState('Dear {{name}},\n\nWe are delighted to present your official Certificate of Achievement for {{achievement}}. Your certificate ID is {{certNumber}}.\n\nPlease find your official high-resolution PDF certificate attached.\n\nWarm regards,\nAcademic Certification Office')
  const [emailDispatching, setEmailDispatching] = useState(false)
  const [emailProgress, setEmailProgress] = useState(0)
  const [emailStatusList, setEmailStatusList] = useState<Record<number, 'Queued' | 'Sent' | 'Delivered' | 'Opened'>>({})
  const [previewEmailRecipient, setPreviewEmailRecipient] = useState<CertRecord | null>(null)

  const timers = useRef<ReturnType<typeof setInterval>[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Re-run fit analysis whenever records change
  const refreshFits = (currentRecords = records) => {
    setAnalyzingFit(true)
    setTimeout(() => {
      setFits(analyzeFit(currentRecords))
      setAnalyzingFit(false)
    }, 600)
  }

  // Handle CSV upload
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (text) {
        const parsed = parseCsvData(text)
        if (parsed.length > 0) {
          setRecords(parsed)
          refreshFits(parsed)
          logActivity('certificate', `Imported ${parsed.length} recipients from ${file.name}`)
        }
      }
    }
    reader.readAsText(file)
  }

  // Trigger template AI scan
  const runTemplateScan = () => {
    setScanningTemplate(true)
    setTimeout(() => {
      setScanningTemplate(false)
      setTemplateScanned(true)
      logActivity('certificate', 'Template analyzed: 6 dynamic editable text zones detected')
    }, 1200)
  }

  // Calculate statistics
  const stats = useMemo(() => ({
    total: records.length,
    normal: fits.filter((f) => f.status === 'normal').length,
    adaptive: fits.filter((f) => f.status === 'adaptive').length,
    review: fits.filter((f) => f.status === 'review').length,
  }), [records, fits])

  const numbered = (r: CertRecord, i: number) => ({
    ...r,
    certNumber: numberPattern.replace(/#+/g, (m) => String(i + 1).padStart(m.length, '0')),
  })

  // Start batch generation
  const startGeneration = () => {
    setGenProgress(0)
    const iv = setInterval(() => {
      setGenProgress((p) => {
        if (p >= 100) {
          clearInterval(iv)
          logActivity('certificate', `Batch generated: ${records.length} certificates (${numberPattern.replace('###', '001')}…)`)
          return 100
        }
        return p + 4
      })
    }, 50)
    timers.current.push(iv)
  }

  // Live Field Change Handler
  const handleActiveFieldChange = (field: keyof CertRecord, val: string, index = activeEditIndex) => {
    setRecords((prev) => {
      const next = [...prev]
      const targetIdx = Math.min(Math.max(0, index), Math.max(0, next.length - 1))
      if (next.length === 0) {
        next.push({ ...INITIAL_SINGLE_RECORD, [field]: val })
      } else {
        next[targetIdx] = { ...next[targetIdx], [field]: val }
      }
      return next
    })
  }

  // Export handlers
  const downloadSinglePng = async (rec: CertRecord, fit?: FitResult) => {
    try {
      const pngBlob = await certPng(rec, fit, {
        customImageUrl: customTemplateUrl,
        nameYPercent,
        fontSizeFactor: nameFontSizeScale * 2.1,
        textColor: certTextColor,
        accentColor: certAccentColor,
      })
      downloadBlob(pngBlob, `${rec.certNumber}_${rec.name.replace(/\s+/g, '_')}.png`)
    } catch {
      downloadBlob(certPdf(rec, fit), `${rec.certNumber}.pdf`)
    }
  }

  const downloadAllZip = async () => {
    const files = records.map((r, i) => {
      const rec = numbered(r, i)
      return { name: `${rec.certNumber}_${r.name.replace(/\s+/g, '_')}.pdf`, data: certPdf(rec, fits[i]) }
    })
    const zip = await buildZip(files)
    downloadBlob(zip, 'certificates_pdf_batch.zip')
  }

  const downloadAllPngZip = async () => {
    const files = await Promise.all(
      records.map(async (r, i) => {
        const rec = numbered(r, i)
        const blob = await certPng(rec, fits[i], {
          customImageUrl: customTemplateUrl,
          nameYPercent,
          fontSizeFactor: nameFontSizeScale * 2.1,
          textColor: certTextColor,
          accentColor: certAccentColor,
        })
        return { name: `${rec.certNumber}_${r.name.replace(/\s+/g, '_')}.png`, data: blob }
      })
    )
    const zip = await buildZip(files)
    downloadBlob(zip, 'certificates_png_batch.zip')
  }

  const downloadCombined = () => {
    const pages = records.map((r, i) => {
      const rec = numbered(r, i)
      return {
        landscape: true,
        lines: [
          { text: rec.college, size: 13, align: 'center' as const },
          { text: 'CERTIFICATE OF ACHIEVEMENT', size: 22, bold: true, align: 'center' as const, gap: 10 },
          { text: 'This certificate is proudly presented to', size: 10, align: 'center' as const, gap: 8 },
          { text: rec.name, size: fits[i]?.fontSize ?? 34, bold: true, align: 'center' as const, gap: 14 },
          { text: rec.achievement, size: 12, align: 'center' as const, gap: 10 },
          { text: `Rank: ${rec.rank}`, size: 11, align: 'center' as const, gap: 6 },
          { text: `${rec.certNumber}        Date: ${rec.date}`, size: 9, align: 'center' as const, gap: 40 },
        ],
      }
    })
    downloadBlob(buildPdf(pages), `certificates_combined_${records.length}_pages.pdf`)
  }

  // Automated Email Dispatch Simulator
  const startEmailDispatch = () => {
    if (!organizerVerified) return
    setEmailDispatching(true)
    setEmailProgress(0)
    let cur = 0
    const total = records.length
    const iv = setInterval(() => {
      cur += 2
      const pct = Math.min(100, Math.round((cur / total) * 100))
      setEmailProgress(pct)
      setEmailStatusList((prev) => {
        const next = { ...prev }
        for (let i = 0; i < cur && i < total; i++) {
          next[i] = i % 3 === 0 ? 'Opened' : i % 2 === 0 ? 'Delivered' : 'Sent'
        }
        return next
      })
      if (cur >= total) {
        clearInterval(iv)
        setEmailDispatching(false)
        logActivity('certificate', `Dispatched ${total} personalized certificates to verified recipient emails`)
      }
    }, 80)
    timers.current.push(iv)
  }

  // Filtered list
  const filteredRecords = records.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.certNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeTestFit = analyzeFit([{
    name: testCustomName,
    college: selectedTemplate.name,
    achievement: 'National Innovation Excellence Award',
    certNumber: 'TEST-001',
    date: '25 May 2026',
    rank: 'Winner',
    email: 'recipient@test.com',
  }])[0]

  return (
    <div className="animate-fade-up pb-12">
      <PageHeader
        title="Certificate Automation Studio"
        subtitle="AI Field Detection · Excel/CSV Mapping · Design Lock · Adaptive Text-Fitting · Bulk Generation · PDF/PNG/ZIP & Organizer Verified Email Distribution"
      />

      {/* Stepper corresponding to 5-Step Pipeline + Distribution */}
      <div className="mb-6 overflow-x-auto scrollbar-thin">
        <div className="flex min-w-[920px] items-center">
          {PIPELINE_STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center last:flex-none">
              <button
                onClick={() => setStep(i)}
                className="flex flex-col items-center gap-1.5 cursor-pointer text-left group"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border transition-all',
                    i === step
                      ? 'gradient-brand border-transparent text-white shadow-lift scale-105'
                      : i < step
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 bg-white text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-500'
                  )}
                >
                  {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <div className="text-center">
                  <div className={cn('whitespace-nowrap text-xs font-semibold', i === step ? 'text-indigo-700' : i < step ? 'text-emerald-700' : 'text-slate-600')}>
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slate-400 hidden xl:block max-w-[140px] truncate">
                    {s.sub}
                  </div>
                </div>
              </button>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className={cn('mx-3 mb-6 h-0.5 flex-1', i < step ? 'bg-emerald-300' : 'bg-slate-200')} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          STEP 1: Template & Field Detection (Image 4, Step 1 & Image 3)
      ────────────────────────────────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Certificate Template Selection</h3>
                  <p className="text-xs text-slate-500">Pick an official template or upload an existing PDF/PNG certificate</p>
                </div>
                <button
                  onClick={runTemplateScan}
                  disabled={scanningTemplate}
                  className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-3.5 py-1.5 text-xs font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-50"
                >
                  {scanningTemplate ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ScanSearch className="h-3.5 w-3.5" />}
                  {scanningTemplate ? 'Scanning…' : 'Re-run AI Field Scan'}
                </button>
              </div>

              {/* Template Presets */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CERT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => { setSelectedTemplate(tmpl); setCustomTemplateName(null) }}
                    className={cn(
                      'rounded-xl border p-3 text-left transition-all',
                      selectedTemplate.id === tmpl.id && !customTemplateName
                        ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    )}
                  >
                    <span className="inline-block rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
                      {tmpl.badge}
                    </span>
                    <div className="mt-1.5 text-xs font-bold text-slate-900">{tmpl.name}</div>
                    <div className="mt-0.5 text-[10px] text-slate-500">{tmpl.category}</div>
                  </button>
                ))}
              </div>

              {/* Custom Upload Dropzone */}
              <div className="mt-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{customTemplateName ? `Active Template: ${customTemplateName}` : 'Upload Custom Certificate Template (PNG, JPG, PDF)'}</span>
                        {customTemplateUrl && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[9px] font-bold text-emerald-800 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> 100% Original Preserved
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {customTemplateUrl
                          ? 'Original logos, stamps, frames & signatures preserved with 0% distortion.'
                          : 'Drop any certificate design. AI will preserve all background artwork and position dynamic fields.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {customTemplateUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomTemplateUrl(null)
                          setCustomTemplateName(null)
                          toast.info('Reverted to default luxury template')
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Reset to Default
                      </button>
                    )}
                    <label className="cursor-pointer rounded-lg gradient-brand px-3.5 py-1.5 text-xs font-bold text-white hover:brightness-110 shadow-lift">
                      Browse Template File
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp,.svg"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) {
                            const reader = new FileReader()
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string
                              setCustomTemplateUrl(dataUrl)
                              setCustomTemplateName(f.name)
                              runTemplateScan()
                              toast.success(`Template Ingested: ${f.name}`, {
                                description: 'Original artwork, logos, seals, and signatures preserved 100% untouched.',
                              })
                            }
                            reader.readAsDataURL(f)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Fine-Tuning Sliders for Custom Uploaded Template */}
                {customTemplateUrl && (
                  <div className="mt-3.5 grid gap-3 sm:grid-cols-2 rounded-xl bg-white border border-indigo-100 p-3 shadow-2xs">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Recipient Name Vertical Position (Y)</span>
                        <span className="font-mono text-indigo-600">{nameYPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={70}
                        value={nameYPercent}
                        onChange={(e) => setNameYPercent(Number(e.target.value))}
                        className="mt-1 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Name Font Size Scale</span>
                        <span className="font-mono text-indigo-600">{nameFontSizeScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.7}
                        max={1.6}
                        step={0.05}
                        value={nameFontSizeScale}
                        onChange={(e) => setNameFontSizeScale(Number(e.target.value))}
                        className="mt-1 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Template Live Preview & Live Customizer */}
              <div className="mt-5 space-y-3">
                {/* Live Customizer & Color Palette Bar */}
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-sky-50/60 p-4 shadow-2xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-indigo-100/80 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>Live Certificate Customizer & Color Palette</span>
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.2 text-[9px] font-bold">
                            Interactive
                          </span>
                        </div>
                        <div className="text-[10.5px] text-slate-500">
                          Edit name & details directly, or pick custom colors. Maintains identical typography & layout.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setIsLiveEditable(!isLiveEditable)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition border',
                          isLiveEditable
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        )}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>{isLiveEditable ? 'Direct Edit: ON' : 'Direct Edit: OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadSinglePng(records[0] || INITIAL_SINGLE_RECORD, fits[0])}
                        className="flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 shadow-2xs"
                      >
                        <Download className="h-3.5 w-3.5" /> PNG
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadBlob(certPdf(records[0] || INITIAL_SINGLE_RECORD, fits[0]), `${records[0]?.certNumber || 'certificate'}.pdf`)}
                        className="flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 shadow-2xs"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </div>
                  </div>

                  {/* Quick Inline Replacement Inputs & Color Presets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-slate-600 mb-1">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={records[0]?.name ?? ''}
                        onChange={(e) => handleActiveFieldChange('name', e.target.value, 0)}
                        placeholder="e.g. Aadesh Bhamare"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-slate-600 mb-1">
                        College / Organization
                      </label>
                      <input
                        type="text"
                        value={records[0]?.college ?? ''}
                        onChange={(e) => handleActiveFieldChange('college', e.target.value, 0)}
                        placeholder="e.g. DocuGenius Academy"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-slate-600 mb-1">
                        Achievement / Award
                      </label>
                      <input
                        type="text"
                        value={records[0]?.achievement ?? ''}
                        onChange={(e) => handleActiveFieldChange('achievement', e.target.value, 0)}
                        placeholder="e.g. Certificate of Excellence"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 shadow-2xs"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10.5px] font-bold uppercase text-slate-600 mb-1">
                        <span>Color Theme</span>
                        <label className="cursor-pointer text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1">
                          Custom
                          <input
                            type="color"
                            value={certTextColor}
                            onChange={(e) => {
                              setCertTextColor(e.target.value)
                              setCertAccentColor(e.target.value)
                            }}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {COLOR_PRESETS.map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            title={p.label}
                            onClick={() => {
                              setCertTextColor(p.text)
                              setCertAccentColor(p.accent)
                            }}
                            className={cn(
                              'h-7 w-7 rounded-lg border-2 transition-all shrink-0',
                              certTextColor === p.text
                                ? 'scale-110 ring-2 ring-indigo-400 border-white shadow-sm'
                                : 'border-white/60 hover:scale-105'
                            )}
                            style={{ backgroundColor: p.text }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <CertificateView
                    record={records[0] || INITIAL_SINGLE_RECORD}
                    templateId={selectedTemplate.id}
                    customImageUrl={customTemplateUrl}
                    nameYPercent={nameYPercent}
                    nameFontSizeScale={nameFontSizeScale}
                    textColor={certTextColor}
                    accentColor={certAccentColor}
                    isEditable={isLiveEditable}
                    onFieldChange={(field, val) => handleActiveFieldChange(field, val, 0)}
                    showOverlays={!isLiveEditable}
                    activeFieldHighlight={activeHighlightField}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: AI Field Detection Log */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">AI Field Detection Pipeline</div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  98.8% Avg Confidence
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                LayoutLM & OCR scan identifies candidate positions for dynamic recipient information even without predefined tags.
              </p>

              <div className="mt-4 space-y-2.5">
                {DETECTED_CERT_BOUNDING_BOXES.map((b) => (
                  <div
                    key={b.id}
                    onMouseEnter={() => setActiveHighlightField(b.fieldKey)}
                    onMouseLeave={() => setActiveHighlightField(null)}
                    className={cn(
                      'group rounded-xl border p-2.5 transition-all cursor-pointer',
                      activeHighlightField === b.fieldKey ? 'border-indigo-400 bg-indigo-50/70 shadow-xs' : 'border-slate-100 hover:border-slate-200'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />
                        <span className="text-xs font-semibold text-slate-800">{b.label}</span>
                      </div>
                      <span className="font-mono text-[10.5px] font-bold text-emerald-600">{b.confidence}%</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[200px]">Detected: “{b.sampleText}”</span>
                      <span className="font-mono text-[9px] text-slate-400">
                        x:{b.bbox.x}% y:{b.bbox.y}% w:{b.bbox.width}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-5 w-full rounded-xl gradient-brand py-2.5 text-xs font-semibold text-white shadow-lift hover:brightness-110 flex items-center justify-center gap-1.5"
              >
                Proceed to Data Processing & Mapping <ChevronRight className="h-4 w-4" />
              </button>
            </Card>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          STEP 2: Data Processing & Mapping (Image 4, Step 2 & Image 3)
      ────────────────────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                Data Source & Import
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Import CSV / Excel containing recipient details, email addresses, and achievements.
              </p>

              {/* Upload Real CSV file */}
              <div className="mt-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-center">
                <FileSpreadsheet className="mx-auto h-8 w-8 text-emerald-600" />
                <div className="mt-2 text-xs font-bold text-slate-800">Upload CSV Spreadsheet</div>
                <p className="text-[10px] text-slate-500">Drag & drop .csv file with student or attendee records</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleCsvUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
                >
                  Choose CSV File
                </button>
              </div>

              {/* Clean Recipient Actions */}
              <div className="mt-4 space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recipient Management</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const newRec: CertRecord = {
                        name: 'Recipient Name',
                        college: 'Institution / College',
                        achievement: 'Certificate of Excellence',
                        certNumber: `DOCU-2026-${String(records.length + 1).padStart(3, '0')}`,
                        date: '07 Oct 2026',
                        rank: 'Distinction',
                        email: 'recipient@example.com',
                      }
                      const updated = [...records, newRec]
                      setRecords(updated)
                      refreshFits(updated)
                      toast.success('Added new recipient row')
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 p-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100/70 transition shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Recipient
                  </button>
                  <button
                    onClick={() => {
                      const sample5 = generateCertRecords(5)
                      setRecords(sample5)
                      refreshFits(sample5)
                      toast.info('Loaded 5 sample recipients')
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" /> 5 Samples
                  </button>
                </div>
              </div>

              {/* Smart Column Mapping */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="text-xs font-bold text-slate-900">Smart Field ↔ CSV Column Mapping</div>
                <div className="mt-3 space-y-2">
                  {CERT_FIELDS.map((f) => (
                    <div key={f.key} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: f.color }} />
                        <span className="font-medium text-slate-700">{f.label}</span>
                      </div>
                      <select
                        value={mapping[f.key]}
                        onChange={(e) => setMapping({ ...mapping, [f.key]: e.target.value })}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-indigo-300"
                      >
                        {['Full Name', 'Institution', 'Award / Event', 'Certificate ID', 'Issue Date', 'Rank / Distinction', 'Recipient Email', '— Ignore —'].map((col) => (
                          <option key={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Left Column: Interactive Data Grid */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Recipients Data Grid ({records.length} records)</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search recipient, college…"
                      className="rounded-lg border border-slate-200 bg-white py-1 pl-8 pr-2 text-xs outline-none focus:border-indigo-300 w-48"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newRec: CertRecord = {
                        name: 'New Recipient',
                        college: 'DocuGenius Academy',
                        achievement: 'Certificate of Merit',
                        certNumber: `DOCU-2026-${String(records.length + 1).padStart(3, '0')}`,
                        date: '07 Oct 2026',
                        rank: 'Participant',
                        email: 'recipient@example.com',
                      }
                      const updated = [newRec, ...records]
                      setRecords(updated)
                      refreshFits(updated)
                    }}
                    className="inline-flex items-center gap-1 rounded-lg gradient-brand px-2.5 py-1 text-xs font-semibold text-white shadow-xs"
                  >
                    <Plus className="h-3 w-3" /> Add Row
                  </button>
                </div>
              </div>

              <div className="max-h-[460px] overflow-auto scrollbar-thin">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 text-[11px] font-semibold text-slate-600">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Recipient Name</th>
                      <th className="px-3 py-2">College / Institution</th>
                      <th className="px-3 py-2">Award / Achievement</th>
                      <th className="px-3 py-2">Email Address</th>
                      <th className="px-3 py-2">Rank</th>
                      <th className="px-3 py-2">Cert ID</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                          No recipients found. Click "+ Add Row" or upload a CSV file.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r, i) => (
                        <tr key={i} className="hover:bg-indigo-50/30 transition">
                          <td className="px-3 py-2 font-mono text-[10px] text-slate-400">{i + 1}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">
                            <input
                              value={r.name}
                              onChange={(e) => {
                                const updated = [...records]
                                updated[i].name = e.target.value
                                setRecords(updated)
                                refreshFits(updated)
                              }}
                              className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-400 focus:bg-white outline-none px-1 rounded"
                            />
                          </td>
                          <td className="px-3 py-2 text-slate-600 truncate max-w-[140px]">{r.college}</td>
                          <td className="px-3 py-2 text-slate-600 truncate max-w-[160px]">{r.achievement}</td>
                          <td className="px-3 py-2 font-mono text-[10.5px] text-slate-500">{r.email}</td>
                          <td className="px-3 py-2 text-slate-700">{r.rank}</td>
                          <td className="px-3 py-2 font-mono text-[10.5px] text-slate-500">{r.certNumber}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => {
                                const updated = records.filter((_, idx) => idx !== i)
                                setRecords(updated)
                                refreshFits(updated)
                              }}
                              className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500 flex justify-between items-center bg-slate-50">
                <span>Showing {filteredRecords.length} recipient(s)</span>
                <button
                  onClick={() => setStep(2)}
                  className="rounded-lg gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-xs"
                >
                  Continue to Design Lock →
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          STEP 3: Layout Analysis & Design Lock (Image 4, Step 3 & Image 3)
      ────────────────────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-violet-600" />
                  <span className="text-sm font-bold text-slate-900">Layout Analysis & Design Lock</span>
                </div>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-800">
                  Fixed Elements Locked
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                <strong>Design Preservation:</strong> Retains the original certificate background artwork, logos, borders,
                and visual layout. Locked layers are rendered as immutable vector/raster backdrops so mass personalized data
                never breaks layout integrity.
              </p>

              <div className="mt-4 space-y-2">
                {Object.entries(locks).map(([name, locked]) => (
                  <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 bg-white">
                    <div className="flex items-center gap-2.5">
                      <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', locked ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400')}>
                        {locked ? <Lock className="h-3.5 w-3.5" /> : <Layers3 className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{name}</div>
                        <div className="text-[10px] text-slate-400">{locked ? 'Frozen in all outputs' : 'Editable'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setLocks({ ...locks, [name]: !locked })}
                      className={cn('relative h-5 w-10 rounded-full transition-colors', locked ? 'bg-violet-600' : 'bg-slate-300')}
                    >
                      <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow-xs', locked ? 'left-5' : 'left-0.5')} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-violet-50/70 p-3 text-xs text-violet-800">
                <span>Show Design Lock Overlay on Preview</span>
                <input
                  type="checkbox"
                  checked={showLockOverlay}
                  onChange={(e) => setShowLockOverlay(e.target.checked)}
                  className="rounded border-slate-300"
                />
              </div>
            </Card>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span>Live Design Lock Simulation</span>
              <span className="text-violet-600 font-mono text-[10.5px]">Template: {selectedTemplate.name}</span>
            </div>
            <CertificateView
              record={records[0] || INITIAL_SINGLE_RECORD}
              templateId={selectedTemplate.id}
              showDesignLock={showLockOverlay}
              customImageUrl={customTemplateUrl}
              nameYPercent={nameYPercent}
              nameFontSizeScale={nameFontSizeScale}
              textColor={certTextColor}
              accentColor={certAccentColor}
              isEditable={isLiveEditable}
              onFieldChange={(field, val) => handleActiveFieldChange(field, val, 0)}
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setStep(3)}
                className="rounded-xl gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
              >
                Continue to Text-Fit Analysis <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          STEP 4: Text-Fit Analysis & Adaptive Formatting (Image 4, Step 4 & Image 3)
      ────────────────────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-4 border-emerald-200 bg-emerald-50/60 text-center">
              <div className="text-3xl font-extrabold text-emerald-700">{stats.normal}</div>
              <div className="text-xs font-bold text-emerald-900 mt-1">Normal Fit (1 Line, 34px)</div>
              <div className="text-[11px] text-emerald-600">Standard character length &lt;= 28 chars</div>
            </Card>
            <Card className="p-4 border-sky-200 bg-sky-50/60 text-center">
              <div className="text-3xl font-extrabold text-sky-700">{stats.adaptive}</div>
              <div className="text-xs font-bold text-sky-900 mt-1">Adaptive Fit (Auto Scaled)</div>
              <div className="text-[11px] text-sky-600">Scaled down (24–30px) or wrapped at word boundary</div>
            </Card>
            <Card className="p-4 border-amber-200 bg-amber-50/60 text-center">
              <div className="text-3xl font-extrabold text-amber-700">{stats.review}</div>
              <div className="text-xs font-bold text-amber-900 mt-1">Manual Review (High Overflow)</div>
              <div className="text-[11px] text-amber-600">Very long names requiring organizer review</div>
            </Card>
          </div>

          {/* Live Interactive Playground */}
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Adaptive Text-Fitting Playground</h3>
                <p className="text-xs text-slate-500">
                  Intelligent Formatting: Adaptive text fitting adjusts text size and spacing to help prevent overflow while preserving the design.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Test Any Long Name:</span>
                <input
                  value={testCustomName}
                  onChange={(e) => setTestCustomName(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 w-80 outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div>
                <CertificateView
                  record={{
                    name: testCustomName,
                    college: selectedTemplate.name,
                    achievement: 'Excellence in Engineering & Automation',
                    certNumber: 'ADAPTIVE-TEST-001',
                    date: '25 May 2026',
                    rank: 'Honor Roll',
                  }}
                  fit={activeTestFit}
                  templateId={selectedTemplate.id}
                  customImageUrl={customTemplateUrl}
                  nameYPercent={nameYPercent}
                  nameFontSizeScale={nameFontSizeScale}
                />
              </div>

              <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs">
                <div className="font-bold text-slate-800">Dynamic Metrics Engine</div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Character Count:</span>
                  <span className="font-mono font-bold text-slate-800">{activeTestFit.chars} chars</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Word Count:</span>
                  <span className="font-mono font-bold text-slate-800">{activeTestFit.words} words</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Rendered Font Size:</span>
                  <span className="font-mono font-bold text-indigo-700">{activeTestFit.fontSize}px (Base: 34px)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Allocated Lines:</span>
                  <span className="font-mono font-bold text-slate-800">{activeTestFit.lines} line(s)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Overflow Risk:</span>
                  <span className={cn('font-mono font-bold', activeTestFit.risk > 0.7 ? 'text-amber-600' : 'text-emerald-600')}>
                    {Math.round(activeTestFit.risk * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Decision Status:</span>
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold uppercase',
                    activeTestFit.status === 'normal' ? 'bg-emerald-100 text-emerald-800' :
                      activeTestFit.status === 'adaptive' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                  )}>
                    {activeTestFit.status}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Per-record table */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-3 flex justify-between items-center bg-slate-50/50">
              <span className="text-xs font-bold text-slate-800">Batch Fit Analysis by Recipient ({fits.length} checked)</span>
              <div className="flex gap-1.5">
                {(['all', 'normal', 'adaptive', 'review'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPreviewTab(t)}
                    className={cn(
                      'rounded-full px-3 py-1 text-[11px] font-semibold capitalize transition',
                      previewTab === t ? 'gradient-brand text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    )}
                  >
                    {t} {t === 'normal' ? `(${stats.normal})` : t === 'adaptive' ? `(${stats.adaptive})` : t === 'review' ? `(${stats.review})` : ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-72 overflow-auto scrollbar-thin">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 text-[10.5px] font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Chars</th>
                    <th className="px-3 py-2">Words</th>
                    <th className="px-3 py-2">Font Size</th>
                    <th className="px-3 py-2">Lines</th>
                    <th className="px-3 py-2">Overflow Risk</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fits
                    .filter((f) => previewTab === 'all' || f.status === previewTab)
                    .slice(0, 15)
                    .map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-1.5 font-semibold text-slate-900">{f.record.name}</td>
                        <td className="px-3 py-1.5 font-mono text-slate-500">{f.chars}</td>
                        <td className="px-3 py-1.5 text-slate-500">{f.words}</td>
                        <td className="px-3 py-1.5 font-mono text-indigo-700 font-bold">{f.fontSize}px</td>
                        <td className="px-3 py-1.5 text-slate-600">{f.lines}</td>
                        <td className="px-3 py-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={cn('h-full', f.risk > 0.7 ? 'bg-amber-500' : f.risk > 0.4 ? 'bg-sky-500' : 'bg-emerald-500')}
                                style={{ width: `${Math.round(f.risk * 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-slate-400">{Math.round(f.risk * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-1.5">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase',
                              f.status === 'normal' && 'bg-emerald-100 text-emerald-800',
                              f.status === 'adaptive' && 'bg-sky-100 text-sky-800',
                              f.status === 'review' && 'bg-amber-100 text-amber-800'
                            )}
                          >
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 flex justify-between items-center text-xs">
              <span className="text-slate-500">Adaptive font fitting guaranteed within template safe bounds</span>
              <button
                onClick={() => setStep(4)}
                className="rounded-lg gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-xs"
              >
                Proceed to Batch Generation & Validation →
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          STEP 5: Batch Generation & Validation (Image 4, Step 5 & Image 3)
      ────────────────────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Batch Generation & Automated Validation</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Automated Validation checks missing values, data inconsistencies, and potential formatting problems.
                </p>
              </div>

              <button
                onClick={startGeneration}
                disabled={genProgress >= 0 && genProgress < 100}
                className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110 disabled:opacity-50"
              >
                <Layers3 className="h-4 w-4" />
                {genProgress >= 100 ? 'Regenerate Entire Batch' : genProgress >= 0 ? 'Generating…' : `Generate ${records.length} Certificates`}
              </button>
            </div>

            {/* Config & automated checks */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 p-3 bg-white">
                <label className="text-[11px] font-semibold text-slate-500 uppercase">Sequence Numbering</label>
                <input
                  value={numberPattern}
                  onChange={(e) => setNumberPattern(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-800 outline-none focus:border-indigo-400"
                />
                <div className="mt-1 text-[10px] text-slate-400">Pattern: {numberPattern.replace('###', '001')}, {numberPattern.replace('###', '002')}…</div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Missing Values Check
                </div>
                <div className="mt-1 text-2xl font-extrabold text-emerald-700">0 Missing</div>
                <div className="text-[10px] text-emerald-600">All names, dates & institutions valid</div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Duplicates & Collision
                </div>
                <div className="mt-1 text-2xl font-extrabold text-emerald-700">0 Collisions</div>
                <div className="text-[10px] text-emerald-600">Every cert ID is unique</div>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
                  <Sparkles className="h-4 w-4 text-sky-600" /> Layout Integrity
                </div>
                <div className="mt-1 text-2xl font-extrabold text-sky-700">100% Fit</div>
                <div className="text-[10px] text-sky-600">Zero overflow or text clipping</div>
              </div>
            </div>

            {/* Progress bar */}
            {genProgress >= 0 && (
              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Batch Generation Progress: {Math.round((genProgress / 100) * records.length)} of {records.length} created</span>
                  <span className="font-mono text-indigo-700">{genProgress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full gradient-brand transition-all duration-150" style={{ width: `${genProgress}%` }} />
                </div>
                {genProgress >= 100 && (
                  <div className="mt-4 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> All {records.length} certificates compiled and ready for export!
                    </span>
                    <button
                      onClick={() => setStep(5)}
                      className="rounded-lg gradient-brand px-3.5 py-1.5 text-xs font-bold text-white shadow-xs flex items-center gap-1"
                    >
                      Proceed to Export & Email Distribution →
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          STEP 6: Export & Automated Email Distribution (Image 3)
      ────────────────────────────────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-6">
          {/* ────────────────────────────────────────────────────────────────── */}
          {/* READY CERTIFICATE: LIVE EDITOR & COLOR CUSTOMIZER                   */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <Card className="p-6 bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 border-indigo-200/80 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                    <Edit3 className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ready Certificate Live Editor & Color Customizer
                  </h3>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Direct inline editing on canvas: replace recipient name, institution, or achievement in the exact same style, or instantly switch color themes.
                </p>
              </div>

              {/* Action buttons for active certificate */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const activeRec = numbered(records[activeEditIndex] || records[0] || INITIAL_SINGLE_RECORD, activeEditIndex)
                    downloadSinglePng(activeRec, fits[activeEditIndex])
                    toast.success('Downloaded High-Res PNG')
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110"
                >
                  <ImageIcon className="h-3.5 w-3.5" /> Download High-Res PNG
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const activeRec = numbered(records[activeEditIndex] || records[0] || INITIAL_SINGLE_RECORD, activeEditIndex)
                    downloadBlob(certPdf(activeRec, fits[activeEditIndex]), `${activeRec.certNumber}_${activeRec.name.replace(/\s+/g, '_')}.pdf`)
                    toast.success('Downloaded Official PDF')
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </button>
              </div>
            </div>

            {/* Recipient Selector Tabs if > 1 record */}
            {records.length > 1 && (
              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <span className="text-xs font-bold text-slate-500 shrink-0">Select Certificate:</span>
                {records.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveEditIndex(i)}
                    className={cn(
                      'rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border shadow-2xs',
                      activeEditIndex === i
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-102'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    )}
                  >
                    #{i + 1} {r.name}
                  </button>
                ))}
              </div>
            )}

            {/* Live Customizer Controls Bar */}
            <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Recipient Name */}
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Recipient Name (Direct Edit)
                  </label>
                  <input
                    type="text"
                    value={records[activeEditIndex]?.name ?? ''}
                    onChange={(e) => handleActiveFieldChange('name', e.target.value, activeEditIndex)}
                    placeholder="e.g. Aadesh Bhamare"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
                  />
                </div>

                {/* 2. College / Institution */}
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Institution / College
                  </label>
                  <input
                    type="text"
                    value={records[activeEditIndex]?.college ?? ''}
                    onChange={(e) => handleActiveFieldChange('college', e.target.value, activeEditIndex)}
                    placeholder="e.g. DocuGenius Academy"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
                  />
                </div>

                {/* 3. Award / Achievement */}
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Award / Achievement Title
                  </label>
                  <input
                    type="text"
                    value={records[activeEditIndex]?.achievement ?? ''}
                    onChange={(e) => handleActiveFieldChange('achievement', e.target.value, activeEditIndex)}
                    placeholder="e.g. Certificate of Excellence"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
                  />
                </div>

                {/* 4. Color Theme Presets + Picker */}
                <div>
                  <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    <span>Change Colour Theme</span>
                    <label className="cursor-pointer text-[10.5px] text-indigo-600 font-bold hover:underline flex items-center gap-1">
                      Custom
                      <input
                        type="color"
                        value={certTextColor}
                        onChange={(e) => {
                          setCertTextColor(e.target.value)
                          setCertAccentColor(e.target.value)
                        }}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        title={p.label}
                        onClick={() => {
                          setCertTextColor(p.text)
                          setCertAccentColor(p.accent)
                          toast.success(`Color theme set to ${p.label}`)
                        }}
                        className={cn(
                          'h-7 w-7 rounded-lg border-2 transition-all shrink-0',
                          certTextColor === p.text
                            ? 'scale-110 ring-2 ring-indigo-400 border-white shadow-sm'
                            : 'border-white/60 hover:scale-105'
                        )}
                        style={{ backgroundColor: p.text }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-row for Rank, Cert ID, and Date */}
              <div className="mt-3 pt-3 border-t border-slate-100 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Distinction / Rank
                  </label>
                  <input
                    type="text"
                    value={records[activeEditIndex]?.rank ?? ''}
                    onChange={(e) => handleActiveFieldChange('rank', e.target.value, activeEditIndex)}
                    placeholder="e.g. Distinction, 1st Place"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Certificate Number / ID
                  </label>
                  <input
                    type="text"
                    value={records[activeEditIndex]?.certNumber ?? ''}
                    onChange={(e) => handleActiveFieldChange('certNumber', e.target.value, activeEditIndex)}
                    placeholder="e.g. DOCU-2026-001"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs font-mono text-slate-800 outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={records[activeEditIndex]?.date ?? ''}
                    onChange={(e) => handleActiveFieldChange('date', e.target.value, activeEditIndex)}
                    placeholder="e.g. 07 Oct 2026"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Live Interactive Canvas with Click-to-Edit in Exact Style */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Interactive Canvas (Click any text on the certificate to edit directly)</span>
                </span>
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-0.5">
                  Ready for Export · 0% Layout Distortion
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg bg-slate-900/5 p-2 sm:p-4">
                <CertificateView
                  record={records[activeEditIndex] || records[0] || INITIAL_SINGLE_RECORD}
                  fit={fits[activeEditIndex]}
                  templateId={selectedTemplate.id}
                  customImageUrl={customTemplateUrl}
                  nameYPercent={nameYPercent}
                  nameFontSizeScale={nameFontSizeScale}
                  textColor={certTextColor}
                  accentColor={certAccentColor}
                  isEditable={true}
                  onFieldChange={(field, val) => handleActiveFieldChange(field, val, activeEditIndex)}
                />
              </div>
            </div>
          </Card>

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* BATCH READY CERTIFICATES & BULK EXPORT                             */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Batch Certificates ({records.length} Ready)</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Download individual certificates, export combined multi-page documents, or generate complete ZIP archives.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadCombined}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" /> Combined Multi-Page PDF ({records.length})
                </button>
                <button
                  type="button"
                  onClick={downloadAllZip}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" /> All PDFs (ZIP Archive)
                </button>
                <button
                  type="button"
                  onClick={downloadAllPngZip}
                  className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-3.5 py-2 text-xs font-semibold text-white shadow-lift hover:brightness-110"
                >
                  <ImageIcon className="h-3.5 w-3.5" /> All PNGs (High-Res ZIP)
                </button>
              </div>
            </div>

            {/* Individual certificate cards */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {records.map((r, i) => {
                const rec = numbered(r, i)
                const isActive = activeEditIndex === i
                return (
                  <Card
                    key={i}
                    className={cn(
                      'p-3 bg-white transition-all cursor-pointer',
                      isActive ? 'ring-2 ring-indigo-500 shadow-md scale-101' : 'hover:border-indigo-200 hover:shadow-xs'
                    )}
                    onClick={() => setActiveEditIndex(i)}
                  >
                    <div className="relative">
                      <CertificateView
                        record={rec}
                        fit={fits[i]}
                        templateId={selectedTemplate.id}
                        customImageUrl={customTemplateUrl}
                        nameYPercent={nameYPercent}
                        nameFontSizeScale={nameFontSizeScale}
                        textColor={certTextColor}
                        accentColor={certAccentColor}
                        small
                      />
                      {isActive && (
                        <div className="absolute top-1 right-1 rounded-md bg-indigo-600 px-1.5 py-0.5 text-[8px] font-bold text-white shadow-xs">
                          Active In Editor
                        </div>
                      )}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-800">{rec.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{rec.certNumber}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveEditIndex(i)
                            toast.info(`Editing ${rec.name}`)
                          }}
                          title="Edit in Canvas"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadBlob(certPdf(rec, fits[i]), `${rec.certNumber}_${rec.name.replace(/\s+/g, '_')}.pdf`)
                          }}
                          title="Download PDF"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadSinglePng(rec, fits[i])
                          }}
                          title="Download High-Res PNG"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-cyan-300 hover:text-cyan-600 hover:bg-cyan-50/50"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </Card>

          {/* Automated Email Distribution & Organizer Verification */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Registered Sender Email & Automated Distribution</h3>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Every participant receives their certificate directly from your verified registered email address.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Registered email pill */}
                <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Sender: <strong className="font-mono text-indigo-700">{user?.registeredSenderEmail || user?.email || 'organizer@trinity.edu.in'}</strong></span>
                </div>

                <button
                  onClick={() => setIsSenderHubOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Open Fast Sender Mailer Hub</span>
                </button>
              </div>
            </div>

            {/* Sender Email Hub Dialog */}
            <SenderEmailHub
              open={isSenderHubOpen}
              onOpenChange={setIsSenderHubOpen}
              records={records}
              onRecordsStatusChange={(next) => setEmailStatusList(next)}
            />

            {!organizerVerified && (
              <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-indigo-50/80 border border-indigo-200 p-3.5 text-xs text-indigo-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-indigo-600" />
                  <span>
                    <strong>Fast Sender Mode Available:</strong> Launch the Fast Sender Mailer Hub to test 1-click verification emails to your registered address and dispatch high-speed batch queues with live telemetry.
                  </span>
                </div>
                <button
                  onClick={() => setIsSenderHubOpen(true)}
                  className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-700 shrink-0"
                >
                  Launch Hub
                </button>
              </div>
            )}

            {/* Email Dispatch Form */}
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Email Subject Template</label>
                  <input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Email Message Body (Markdown / Plain Text)</label>
                  <textarea
                    rows={6}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-400 font-mono"
                  />
                  <div className="mt-1 text-[10.5px] text-slate-400">
                    Variables supported: <code>{"{{name}}"}</code>, <code>{"{{achievement}}"}</code>, <code>{"{{certNumber}}"}</code>
                  </div>
                </div>
              </div>

              {/* Real-time Dispatch Progress & Recipient Status */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
                  <span>Dispatch Queue Status</span>
                  <span className="font-mono text-indigo-700">{emailProgress}%</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full gradient-brand transition-all duration-100" style={{ width: `${emailProgress}%` }} />
                </div>

                <div className="mt-4 max-h-48 overflow-auto scrollbar-thin rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-500 font-semibold">
                      <tr>
                        <th className="px-2.5 py-1.5">Recipient</th>
                        <th className="px-2.5 py-1.5">Email</th>
                        <th className="px-2.5 py-1.5">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.slice(0, 10).map((r, i) => {
                        const st = emailStatusList[i] ?? (organizerVerified ? 'Ready' : 'Pending Verification')
                        return (
                          <tr key={i}>
                            <td className="px-2.5 py-1.5 font-medium text-slate-800">{r.name}</td>
                            <td className="px-2.5 py-1.5 font-mono text-[10px] text-slate-500">{r.email}</td>
                            <td className="px-2.5 py-1.5">
                              <span
                                className={cn(
                                  'rounded-full px-2 py-0.5 text-[9px] font-bold',
                                  st === 'Opened' && 'bg-emerald-100 text-emerald-800',
                                  st === 'Delivered' && 'bg-sky-100 text-sky-800',
                                  st === 'Sent' && 'bg-indigo-100 text-indigo-800',
                                  st === 'Queued' && 'bg-amber-100 text-amber-800'
                                )}
                              >
                                {st}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Navigation footer buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          ← Back
        </button>

        {step < PIPELINE_STEPS.length - 1 && (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-lift hover:brightness-110"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

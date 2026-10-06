import { useState } from 'react'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  UploadCloud,
  FileText,
  ScanText,
  ScanSearch,
  PenLine,
  FileSpreadsheet,
  Layers3,
  ShieldCheck,
  Download,
  Award,
  LayoutGrid,
  Ruler,
  Send,
  Cloud,
  Database,
  Lock,
  Cpu,
  ArrowRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  Play,
  Briefcase,
  GraduationCap,
  ScrollText,
  Trophy,
  Users2,
  Calendar,
} from 'lucide-react'

export function ArchitectureVisualizer({
  onStepClick,
}: {
  onStepClick?: (module: 'm1' | 'm2', stepNumber: number) => void
}) {
  const { navigate } = useApp()
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)

  const handleStepJump = (module: 'm1' | 'm2', step: number) => {
    if (onStepClick) {
      onStepClick(module, step)
    } else {
      if (module === 'm1') {
        const stepRoutes = [
          'workflow-upload',
          'workflow-analyze',
          'workflow-model',
          'workflow-editor',
          'workflow-editor',
          'workflow-generate',
          'workflow-validate',
          'workflow-export',
        ]
        navigate(stepRoutes[step - 1] as any)
      } else {
        navigate('certificates')
      }
    }
  }

  return (
    <div className="w-full rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 via-white to-indigo-50/30 p-4 sm:p-6 lg:p-8 shadow-xl space-y-6">
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER BANNER (Matching Image 1) */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-xl text-center">
        <div className="inline-block rounded-2xl bg-[#0b2447] px-8 py-3.5 shadow-lift text-white border border-sky-400/30">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>DocuGenius</span>
            <span className="text-amber-300">AI</span>
          </h2>
          <div className="mt-1 text-xs sm:text-sm font-semibold tracking-wide text-sky-200">
            One Platform &nbsp;|&nbsp; Two Powerful Modules
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 2. DUAL-MODULE GRID (M1 Left & M2 Right) */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ======================================================================= */}
        {/* MODULE 1 (M1): Universal Document Engineering & Personalization */}
        {/* ======================================================================= */}
        <div className="rounded-3xl border-2 border-sky-300 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/20 p-5 sm:p-6 shadow-soft flex flex-col justify-between">
          <div>
            {/* M1 Header */}
            <div className="flex items-center gap-3 border-b border-sky-200 pb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white font-black text-xl shadow-md">
                M1
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Universal Document Engineering & Personalization
                </h3>
                <p className="text-xs font-semibold text-sky-800">
                  From generic documents to personalized, ready-to-use files
                </p>
              </div>
            </div>

            {/* M1 8-Step Sequential Workflow Grid (4 rows of 2 steps) */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
              {/* Step 1: Upload Document */}
              <div
                onClick={() => handleStepJump('m1', 1)}
                className="group relative cursor-pointer rounded-2xl border border-sky-200 bg-white p-3.5 shadow-2xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white shadow-xs">
                    1
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Upload Document</span>
                </div>
                <div className="my-2.5 flex items-center justify-center gap-1.5 py-1">
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">PDF</span>
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">DOCX</span>
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">TXT</span>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Upload files in supported formats (PDF, DOCX, TXT, etc.)
                </p>
              </div>

              {/* Step 2: Document Processing */}
              <div
                onClick={() => handleStepJump('m1', 2)}
                className="group relative cursor-pointer rounded-2xl border border-sky-200 bg-white p-3.5 shadow-2xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white shadow-xs">
                    2
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Document Processing</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10.5px] font-bold text-teal-700">
                    <ScanText className="h-3.5 w-3.5" /> OCR + Layout
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Extract text, structure and layout using OCR and document analysis.
                </p>
              </div>

              {/* Step 3: AI Field Detection */}
              <div
                onClick={() => handleStepJump('m1', 3)}
                className="group relative cursor-pointer rounded-2xl border border-sky-200 bg-white p-3.5 shadow-2xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white shadow-xs">
                    3
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">AI Field Detection</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10.5px] font-bold text-purple-700">
                    <ScanSearch className="h-3.5 w-3.5" /> AI & NLP
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Identify key fields (names, dates, numbers, etc.) using AI and NLP.
                </p>
              </div>

              {/* Step 4: Editing & Refinement */}
              <div
                onClick={() => handleStepJump('m1', 4)}
                className="group relative cursor-pointer rounded-2xl border border-sky-200 bg-white p-3.5 shadow-2xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white shadow-xs">
                    4
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Editing & Refinement</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
                    <PenLine className="h-3.5 w-3.5" /> AI Copilot
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Edit manually or use AI-assisted suggestions to improve content.
                </p>
              </div>

              {/* Step 5: Data Mapping */}
              <div
                onClick={() => handleStepJump('m1', 5)}
                className="group relative cursor-pointer rounded-2xl border border-sky-200 bg-white p-3.5 shadow-2xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white shadow-xs">
                    5
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Data Mapping</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">
                    <FileSpreadsheet className="h-3.5 w-3.5" /> Excel / CSV Map
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Import Excel/CSV data and map columns to identified fields.
                </p>
              </div>

              {/* Step 6: Bulk Generation */}
              <div
                onClick={() => handleStepJump('m1', 6)}
                className="group relative cursor-pointer rounded-2xl border border-sky-200 bg-white p-3.5 shadow-2xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white shadow-xs">
                    6
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Bulk Generation</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10.5px] font-bold text-indigo-700">
                    <Layers3 className="h-3.5 w-3.5" /> Multi-Draft
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Create personalized documents for multiple recipients.
                </p>
              </div>

              {/* Step 7: Validation & Preview */}
              <div
                onClick={() => handleStepJump('m1', 7)}
                className="group relative cursor-pointer rounded-2xl border border-sky-200 bg-white p-3.5 shadow-2xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white shadow-xs">
                    7
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Validation & Preview</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10.5px] font-bold text-rose-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> 18 Rules Audit
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Check missing values, incorrect mappings and formatting issues.
                </p>
              </div>

              {/* Step 8: Download / Export */}
              <div
                onClick={() => handleStepJump('m1', 8)}
                className="group relative cursor-pointer rounded-2xl border border-sky-200 bg-white p-3.5 shadow-2xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold text-white shadow-xs">
                    8
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Download / Export</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10.5px] font-bold text-sky-700">
                    <Download className="h-3.5 w-3.5" /> PDF / DOCX / TXT
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Get personalized documents in your preferred format (PDF/DOCX/TXT).
                </p>
              </div>
            </div>
          </div>

          {/* M1 Example Use Cases Footer (Matching Image 1) */}
          <div className="mt-5 border-t border-sky-200/80 pt-3.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-900">
              Example Use Cases
            </div>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-sky-100 p-2 text-[11px] font-semibold text-slate-700">
                <FileText className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">Reports & Forms</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-sky-100 p-2 text-[11px] font-semibold text-slate-700">
                <ScrollText className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">Letters & Deeds</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-sky-100 p-2 text-[11px] font-semibold text-slate-700">
                <GraduationCap className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">Academic Papers</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-sky-100 p-2 text-[11px] font-semibold text-slate-700">
                <Briefcase className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">Business Files</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* MODULE 2 (M2): Intelligent Certificate Automation */}
        {/* ======================================================================= */}
        <div className="rounded-3xl border-2 border-purple-300 bg-gradient-to-b from-purple-50/50 via-white to-purple-50/20 p-5 sm:p-6 shadow-soft flex flex-col justify-between">
          <div>
            {/* M2 Header */}
            <div className="flex items-center gap-3 border-b border-purple-200 pb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white font-black text-xl shadow-md">
                M2
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Intelligent Certificate Automation
                </h3>
                <p className="text-xs font-semibold text-purple-800">
                  Design, personalize and distribute certificates with ease
                </p>
              </div>
            </div>

            {/* M2 8-Step Sequential Workflow Grid (4 rows of 2 steps) */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
              {/* Step 1: Upload / Create Template */}
              <div
                onClick={() => handleStepJump('m2', 1)}
                className="group relative cursor-pointer rounded-2xl border border-purple-200 bg-white p-3.5 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white shadow-xs">
                    1
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Upload / Template</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10.5px] font-bold text-indigo-700">
                    <Award className="h-3.5 w-3.5" /> Vector / Raster
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Upload an existing template or design a new certificate.
                </p>
              </div>

              {/* Step 2: Template Processing */}
              <div
                onClick={() => handleStepJump('m2', 2)}
                className="group relative cursor-pointer rounded-2xl border border-purple-200 bg-white p-3.5 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white shadow-xs">
                    2
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Template Processing</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10.5px] font-bold text-teal-700">
                    <LayoutGrid className="h-3.5 w-3.5" /> Layer Lock
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Analyze layout, background and text elements.
                </p>
              </div>

              {/* Step 3: AI Field Detection */}
              <div
                onClick={() => handleStepJump('m2', 3)}
                className="group relative cursor-pointer rounded-2xl border border-purple-200 bg-white p-3.5 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white shadow-xs">
                    3
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">AI Field Detection</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10.5px] font-bold text-purple-700">
                    <ScanSearch className="h-3.5 w-3.5" /> Bounding Boxes
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Identify recipient names, awards, dates and other details.
                </p>
              </div>

              {/* Step 4: Recipient Data Import */}
              <div
                onClick={() => handleStepJump('m2', 4)}
                className="group relative cursor-pointer rounded-2xl border border-purple-200 bg-white p-3.5 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white shadow-xs">
                    4
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Recipient Import</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">
                    <FileSpreadsheet className="h-3.5 w-3.5" /> CSV / Excel
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Import Excel/CSV and map recipient fields to the template.
                </p>
              </div>

              {/* Step 5: Personalization & Text Fitting */}
              <div
                onClick={() => handleStepJump('m2', 5)}
                className="group relative cursor-pointer rounded-2xl border border-purple-200 bg-white p-3.5 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white shadow-xs">
                    5
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Text Fitting</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
                    <Ruler className="h-3.5 w-3.5" /> Zero-Overflow
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Insert recipient info & adjust text to fit design and layout.
                </p>
              </div>

              {/* Step 6: Bulk Generation */}
              <div
                onClick={() => handleStepJump('m2', 6)}
                className="group relative cursor-pointer rounded-2xl border border-purple-200 bg-white p-3.5 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white shadow-xs">
                    6
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Bulk Generation</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10.5px] font-bold text-indigo-700">
                    <Layers3 className="h-3.5 w-3.5" /> 1000+ Certs
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Generate individual certificates for all recipients.
                </p>
              </div>

              {/* Step 7: Validation & Preview */}
              <div
                onClick={() => handleStepJump('m2', 7)}
                className="group relative cursor-pointer rounded-2xl border border-purple-200 bg-white p-3.5 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white shadow-xs">
                    7
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Validation & Preview</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10.5px] font-bold text-rose-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Alignment Pass
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Verify details, check alignment, missing values & layout.
                </p>
              </div>

              {/* Step 8: Export & Distribute */}
              <div
                onClick={() => handleStepJump('m2', 8)}
                className="group relative cursor-pointer rounded-2xl border border-purple-200 bg-white p-3.5 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white shadow-xs">
                    8
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">Export & Distribute</span>
                </div>
                <div className="my-2.5 flex items-center justify-center py-1">
                  <div className="flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10.5px] font-bold text-purple-700">
                    <Send className="h-3.5 w-3.5" /> Email + ZIP
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-tight">
                  Download as PDF/PNG, get ZIP or send via verified email.
                </p>
              </div>
            </div>
          </div>

          {/* M2 Example Use Cases Footer (Matching Image 1) */}
          <div className="mt-5 border-t border-purple-200/80 pt-3.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
              Example Use Cases
            </div>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-purple-100 p-2 text-[11px] font-semibold text-slate-700">
                <Users2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="truncate">Workshops</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-purple-100 p-2 text-[11px] font-semibold text-slate-700">
                <Trophy className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="truncate">Competitions</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-purple-100 p-2 text-[11px] font-semibold text-slate-700">
                <Calendar className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="truncate">Conferences</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-purple-100 p-2 text-[11px] font-semibold text-slate-700">
                <Award className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="truncate">Recognition</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 3. SHARED INFRASTRUCTURE & TECHNOLOGY LAYER (Matching Image 1 Bottom) */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-300 bg-[#f0f4f9] p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2447] text-white">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Shared Infrastructure & Technology Layer
              </div>
              <div className="text-[11px] font-medium text-slate-500">
                Cloud Hosting &nbsp;|&nbsp; Secure Data Handling &nbsp;|&nbsp; Scalable Architecture
              </div>
            </div>
          </div>

          {/* 4 Feature Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
              <Database className="h-3.5 w-3.5 text-indigo-600" />
              <span>Database</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
              <Cpu className="h-3.5 w-3.5 text-purple-600" />
              <span>AI & NLP Services</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Security & Auth</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
              <Cloud className="h-3.5 w-3.5 text-sky-600" />
              <span>File Storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

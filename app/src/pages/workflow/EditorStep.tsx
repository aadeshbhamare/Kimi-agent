import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { DOC_FIELDS, MASTER_PAGES, type StudentRecord } from '@/lib/data'
import {
  DocumentPage,
  DEFAULT_CUSTOMIZATION,
  type DocumentCustomization,
} from '@/components/DocumentRenderer'
import {
  ZoomIn, ZoomOut, Search, Undo2, Redo2, Plus, Trash2,
  Layers3, Sparkles, Send, ChevronLeft, ChevronRight, Wand2,
} from 'lucide-react'

const QUICK_COMMANDS = [
  'Change border to academic double line',
  'Make all headings bold and centered',
  'Update guide name to Mrs. Shweta Joshi',
  'Set primary draft to Vikrant Borse (08)',
  'Scale Trinity emblem logo to 110%',
  'Convert all references to IEEE standard',
  'Ensure running header is present on chapters',
  'Check student roll numbers consistency',
]

export function EditorStep({
  editing,
  selectedField,
  onSelectField,
  records,
  setRecords,
  aiEdits,
  applyAiEdit,
  undo,
  redo,
  canUndo,
  canRedo,
  onGenerate,
}: {
  editing: boolean
  selectedField: string | null
  onSelectField: (k: string | null) => void
  records: StudentRecord[]
  setRecords: (r: StudentRecord[]) => void
  aiEdits: string[]
  applyAiEdit: (cmd: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  onGenerate: () => void
}) {
  const [page, setPage] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [cmd, setCmd] = useState('')
  const [activeDraftIdx, setActiveDraftIdx] = useState(0)
  const [inspectorTab, setInspectorTab] = useState<
    'fields' | 'border' | 'logo' | 'figures' | 'header' | 'signatures' | 'ai' | 'comments'
  >(editing ? 'ai' : 'fields')
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Document visual styling state (Borders, Logos, Headers, Signatures, Figures)
  const [customization, setCustomization] = useState<DocumentCustomization>(DEFAULT_CUSTOMIZATION)

  const activeRecord = records[activeDraftIdx] ?? records[0]
  const field = DOC_FIELDS.find((f) => f.key === selectedField) ?? null

  const addRecord = () => {
    setRecords([
      ...records,
      {
        ...records[0],
        studentName: 'New Student',
        rollNumber: String(records.length + 1).padStart(2, '0'),
      },
    ])
  }

  const updateRecord = (i: number, key: keyof StudentRecord, value: string) => {
    const next = [...records]
    next[i] = { ...next[i], [key]: value }
    setRecords(next)
  }

  const removeRecord = (i: number) => {
    if (records.length <= 1) return
    setRecords(records.filter((_, idx) => idx !== i))
    if (activeDraftIdx >= records.length - 1) {
      setActiveDraftIdx(Math.max(0, records.length - 2))
    }
  }

  const handleAiCommandSubmit = (textToApply?: string) => {
    const commandText = textToApply ?? cmd
    if (!commandText.trim()) return

    const lower = commandText.toLowerCase()

    // Handle natural language border commands
    if (lower.includes('border') && lower.includes('double')) {
      setCustomization((prev) => ({
        ...prev,
        border: { ...prev.border, style: 'double', width: 2 },
      }))
    } else if (lower.includes('border') && (lower.includes('none') || lower.includes('remove'))) {
      setCustomization((prev) => ({
        ...prev,
        border: { ...prev.border, enabled: false },
      }))
    } else if (lower.includes('border') && lower.includes('all')) {
      setCustomization((prev) => ({
        ...prev,
        border: { ...prev.border, applyTo: 'all' },
      }))
    }

    // Handle logo scale commands
    if (lower.includes('logo') && lower.includes('scale')) {
      setCustomization((prev) => ({
        ...prev,
        logo: { ...prev.logo, scale: 1.15 },
      }))
    }

    // Handle guide change commands
    if (lower.includes('shweta') || lower.includes('guide')) {
      const next = records.map((r) => ({ ...r, guide: 'Mrs. Shweta Joshi' }))
      setRecords(next)
    }

    // Handle primary author switch
    if (lower.includes('vikrant')) {
      setActiveDraftIdx(1)
    } else if (lower.includes('shravan')) {
      setActiveDraftIdx(2)
    } else if (lower.includes('aadesh')) {
      setActiveDraftIdx(0)
    }

    applyAiEdit(commandText)
    setCmd('')
  }

  const appliedNote = useMemo(() => aiEdits[aiEdits.length - 1], [aiEdits])

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[580px] gap-4">
      {/* ── LEFT: 25-Page Thumbnails ────────────────────────────────────────── */}
      <div className="hidden w-40 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-soft md:flex">
        <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
          <span className="text-xs font-bold text-slate-800">Pages · 25</span>
          <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">SPPU AY 25-26</span>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-2 scrollbar-thin">
          {MASTER_PAGES.map((p, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn(
                'w-full rounded-lg border p-1.5 text-left transition',
                page === i
                  ? 'border-indigo-400 bg-indigo-50/70 ring-1 ring-indigo-200 shadow-xs'
                  : 'border-slate-200 hover:border-indigo-200 bg-slate-50/40'
              )}
            >
              <div className="doc-page aspect-[595/842] w-full rounded-sm p-1 bg-white border border-slate-200 relative overflow-hidden">
                {p.hasBorder && <div className="absolute inset-0.5 border border-slate-400" />}
                <div className="h-1 w-3/4 rounded bg-slate-400 mx-auto" />
                <div className="mt-1 space-y-0.5">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-0.5 rounded bg-slate-200" style={{ width: `${85 - j * 8}%` }} />
                  ))}
                </div>
              </div>
              <div className="mt-1 truncate px-0.5 text-[10px] font-semibold text-slate-700">
                {p.page}. {p.label}
              </div>
            </button>
          ))}
          <div className="rounded-lg border border-dashed border-slate-200 p-2 text-center text-[10px] text-slate-400">
            Pages 14–25 (Full Report)
          </div>
        </div>
      </div>

      {/* ── CENTER: Document Canvas & Controls ───────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-slate-100/70 shadow-soft">
        {/* Top Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-3 py-2">
          {/* Active Draft Pill Switcher (1 Master -> N Drafts) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl mr-2">
            <span className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">Active Draft:</span>
            {records.map((rec, i) => (
              <button
                key={i}
                onClick={() => setActiveDraftIdx(i)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                  activeDraftIdx === i
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white hover:text-indigo-600'
                )}
                title={`Draft ${i + 1}: ${rec.studentName} (${rec.rollNumber})`}
              >
                {rec.studentName.split(' ')[0]} ({rec.rollNumber})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-slate-700">
              {page + 1} / {MASTER_PAGES.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(MASTER_PAGES.length - 1, p + 1))}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          {/* Zoom controls */}
          <button
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-xs font-medium text-slate-600">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          <div className="relative hidden lg:block">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in report..."
              className="w-40 rounded-lg border border-slate-200 py-1.5 pl-7 pr-2 text-xs outline-none focus:border-indigo-400"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </button>
            <button
              onClick={onGenerate}
              className="rounded-xl gradient-brand px-3 py-1.5 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
            >
              <Layers3 className="h-3.5 w-3.5" />
              Generate 4 Drafts
            </button>
          </div>
        </div>

        {/* Document Render Area */}
        <div
          className="min-h-0 flex-1 overflow-auto p-4 scrollbar-thin"
          onClick={() => {
            onSelectField(null)
            setSelectedElement(null)
          }}
        >
          {/* Style Transformation Prompt & Revert Banner */}
          <div className="mx-auto mb-4 max-w-[520px]">
            {customization.styleMode === 'original' ? (
              <div className="rounded-xl border border-slate-300 bg-white p-3 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-800 border border-slate-300 font-serif font-bold text-sm">
                    📄
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">Original Document Style Active</span>
                      <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.2 text-[9px] font-semibold text-slate-700">
                        Exact Alignment · Original Images
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                      All alignments and diagrams match your uploaded file as-is. Should I transform this into AI Enhanced Academic Style?
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCustomization((prev) => ({ ...prev, styleMode: 'ai_enhanced' }))
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg gradient-brand px-3 py-1.5 text-xs font-bold text-white shadow-lift hover:brightness-110 transition active:scale-95"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Yes, Transform with AI</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-purple-200 bg-purple-50/80 p-3 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-sm shadow">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-purple-950">AI Enhanced Academic Style Applied</span>
                      <span className="rounded bg-purple-200/80 px-1.5 py-0.2 text-[9px] font-bold text-purple-900">
                        Modern Layout
                      </span>
                    </div>
                    <p className="text-[10.5px] text-purple-800 mt-0.5 leading-relaxed">
                      Transformed into modern layout. Don't like the result? You can revert anytime to your original uploaded layout & alignment:
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCustomization((prev) => ({ ...prev, styleMode: 'original' }))
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-lift transition active:scale-95"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    <span>↩ Revert to Original Style</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <DocumentPage
            pageIndex={page}
            record={activeRecord}
            customization={customization}
            selectedField={selectedField}
            selectedElement={selectedElement}
            onFieldClick={(k) => {
              onSelectField(k)
              setSelectedElement(null)
              setInspectorTab('fields')
            }}
            onBorderClick={() => {
              setSelectedElement('border')
              onSelectField(null)
              setInspectorTab('border')
            }}
            onLogoClick={() => {
              setSelectedElement('logo')
              onSelectField(null)
              setInspectorTab('logo')
            }}
            onFigureClick={(figId) => {
              setSelectedElement(figId)
              onSelectField(null)
              setInspectorTab('figures')
            }}
            onFigureAiTransform={(figId, transformed) => {
              setCustomization((prev) => ({
                ...prev,
                figures: {
                  ...prev.figures,
                  [figId]: {
                    ...prev.figures[figId],
                    aiTransformed: transformed,
                  },
                },
              }))
            }}
            onHeaderClick={() => {
              setSelectedElement('header')
              onSelectField(null)
              setInspectorTab('header')
            }}
            onFooterClick={() => {
              setSelectedElement('footer')
              onSelectField(null)
              setInspectorTab('header')
            }}
            onSignaturesClick={() => {
              setSelectedElement('signatures')
              onSelectField(null)
              setInspectorTab('signatures')
            }}
            scale={zoom}
          />
          <div className="pb-4 pt-3 text-center text-[11px] font-medium text-slate-500">
            💡 Click on any element (Border, Trinity Logo, Figures 4.1/4.2/6.1, Header/Footer, or Names) to inspect and edit.
          </div>
        </div>

        {appliedNote && (
          <div className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11.5px] font-medium text-emerald-700">
            <Wand2 className="h-3.5 w-3.5" /> AI applied: “{appliedNote}” — layout preserved
          </div>
        )}
      </div>

      {/* ── RIGHT: Multi-Element Inspector Panel ───────────────────────────── */}
      <div className="flex w-96 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-soft">
        {/* Document Global Style Selector */}
        <div className="border-b border-slate-200 bg-slate-50/80 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Document Layout Style</span>
            <span
              className={cn(
                'rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tight',
                customization.styleMode === 'original'
                  ? 'bg-slate-200 text-slate-800'
                  : 'bg-purple-100 text-purple-800 border border-purple-200'
              )}
            >
              {customization.styleMode === 'original' ? 'Original (As-Is)' : 'AI Enhanced'}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setCustomization((prev) => ({ ...prev, styleMode: 'original' }))}
              className={cn(
                'flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition',
                customization.styleMode === 'original'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              <span>📄 Original Style</span>
            </button>
            <button
              onClick={() => setCustomization((prev) => ({ ...prev, styleMode: 'ai_enhanced' }))}
              className={cn(
                'flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition',
                customization.styleMode === 'ai_enhanced'
                  ? 'gradient-brand text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              <Sparkles className="h-3 w-3" />
              <span>AI Enhanced</span>
            </button>
          </div>
          {customization.styleMode === 'ai_enhanced' && (
            <button
              onClick={() => setCustomization((prev) => ({ ...prev, styleMode: 'original' }))}
              className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg border border-amber-300 bg-amber-50 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition shadow-xs"
            >
              <Undo2 className="h-3 w-3" />
              <span>↩ Revert to Original Document Style</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs for All Elements */}
        <div className="grid grid-cols-4 border-b border-slate-100 p-1 text-[11px] font-semibold text-slate-500">
          <button
            onClick={() => setInspectorTab('fields')}
            className={cn('rounded-lg py-1.5 transition text-center', inspectorTab === 'fields' && 'bg-indigo-50 text-indigo-700 font-bold')}
          >
            Fields
          </button>
          <button
            onClick={() => setInspectorTab('border')}
            className={cn('rounded-lg py-1.5 transition text-center', inspectorTab === 'border' && 'bg-indigo-50 text-indigo-700 font-bold')}
          >
            Border
          </button>
          <button
            onClick={() => setInspectorTab('logo')}
            className={cn('rounded-lg py-1.5 transition text-center', inspectorTab === 'logo' && 'bg-indigo-50 text-indigo-700 font-bold')}
          >
            Logo
          </button>
          <button
            onClick={() => setInspectorTab('figures')}
            className={cn('rounded-lg py-1.5 transition text-center', inspectorTab === 'figures' && 'bg-indigo-50 text-indigo-700 font-bold')}
          >
            Figures
          </button>
        </div>
        <div className="grid grid-cols-3 border-b border-slate-100 p-1 text-[11px] font-semibold text-slate-500">
          <button
            onClick={() => setInspectorTab('header')}
            className={cn('rounded-lg py-1.5 transition text-center', inspectorTab === 'header' && 'bg-indigo-50 text-indigo-700 font-bold')}
          >
            Header/Footer
          </button>
          <button
            onClick={() => setInspectorTab('signatures')}
            className={cn('rounded-lg py-1.5 transition text-center', inspectorTab === 'signatures' && 'bg-indigo-50 text-indigo-700 font-bold')}
          >
            Signatures
          </button>
          <button
            onClick={() => setInspectorTab('ai')}
            className={cn('rounded-lg py-1.5 transition text-center flex items-center justify-center gap-1', inspectorTab === 'ai' && 'bg-indigo-50 text-indigo-700 font-bold')}
          >
            <Sparkles className="h-3 w-3 text-indigo-600" /> AI Edit
          </button>
        </div>

        {/* Content of the Active Inspector */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {/* 1. SMART FIELDS INSPECTOR */}
          {inspectorTab === 'fields' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {field ? `Selected: ${field.label}` : 'Smart Semantic Fields (Auto-Mapped)'}
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  1 Master Document → 4 Complete Independent Drafts. Changes propagate across Cover, Certificate, Acknowledgement, Header, and Footers.
                </p>
              </div>

              {/* Student Draft Records list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Team Members / Drafts ({records.length})</span>
                  <button
                    onClick={addRecord}
                    className="flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 hover:bg-indigo-100"
                  >
                    <Plus className="h-3 w-3" /> Add Student
                  </button>
                </div>

                {records.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveDraftIdx(i)}
                    className={cn(
                      'rounded-xl border p-2.5 transition-all cursor-pointer',
                      activeDraftIdx === i
                        ? 'border-indigo-300 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-200'
                        : 'border-slate-200 hover:border-indigo-200 bg-white'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        {i === 0 ? 'Lead Student (Draft 1)' : `Team Member (Draft ${i + 1})`}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {activeDraftIdx === i && (
                          <span className="rounded bg-indigo-600 px-1.5 py-0.2 text-[9px] font-bold text-white">
                            Active Preview
                          </span>
                        )}
                        {records.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeRecord(i)
                            }}
                            className="text-slate-400 hover:text-red-500"
                            title="Remove student"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_80px] gap-2">
                      <input
                        value={r.studentName}
                        onChange={(e) => updateRecord(i, 'studentName', e.target.value)}
                        placeholder="Student Name"
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 outline-none focus:border-indigo-400"
                      />
                      <input
                        value={r.rollNumber}
                        onChange={(e) => updateRecord(i, 'rollNumber', e.target.value)}
                        placeholder="Roll No"
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono font-bold text-slate-800 outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Global Metadata Fields */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <span className="text-xs font-bold text-slate-700">Project & Institutional Metadata</span>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Project Title</label>
                  <input
                    value={activeRecord.projectTitle}
                    onChange={(e) => {
                      const v = e.target.value
                      setRecords(records.map((r) => ({ ...r, projectTitle: v })))
                    }}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">Guide Name</label>
                  <input
                    value={activeRecord.guide}
                    onChange={(e) => {
                      const v = e.target.value
                      setRecords(records.map((r) => ({ ...r, guide: v })))
                    }}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500">College / Institute</label>
                  <input
                    value={activeRecord.college}
                    onChange={(e) => {
                      const v = e.target.value
                      setRecords(records.map((r) => ({ ...r, college: v })))
                    }}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. BORDER INSPECTOR */}
          {inspectorTab === 'border' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Page Border & Frame</h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Customize the outer document frame border. Analyzed: 1.5pt solid black border detected on Pages 1 & 2.
                </p>
              </div>

              {/* Enable / Disable Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5">
                <span className="text-xs font-semibold text-slate-800">Enable Page Border Frame</span>
                <input
                  type="checkbox"
                  checked={customization.border.enabled}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      border: { ...prev.border, enabled: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded accent-indigo-600"
                />
              </div>

              {/* Border Style Options */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Border Style</label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Solid', value: 'solid' },
                    { label: 'Double Line', value: 'double' },
                    { label: 'None', value: 'none' },
                  ].map((st) => (
                    <button
                      key={st.value}
                      onClick={() =>
                        setCustomization((prev) => ({
                          ...prev,
                          border: { ...prev.border, style: st.value as any },
                        }))
                      }
                      className={cn(
                        'rounded-lg border py-2 text-xs font-medium transition text-center',
                        customization.border.style === st.value
                          ? 'border-indigo-400 bg-indigo-50 font-bold text-indigo-700 ring-1 ring-indigo-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Scope / Pages */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Apply Border To</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setCustomization((prev) => ({
                        ...prev,
                        border: { ...prev.border, applyTo: 'cover-cert' },
                      }))
                    }
                    className={cn(
                      'rounded-lg border p-2 text-xs font-medium transition text-center',
                      customization.border.applyTo === 'cover-cert'
                        ? 'border-indigo-400 bg-indigo-50 font-bold text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    Cover & Certificate Only (Standard)
                  </button>
                  <button
                    onClick={() =>
                      setCustomization((prev) => ({
                        ...prev,
                        border: { ...prev.border, applyTo: 'all' },
                      }))
                    }
                    className={cn(
                      'rounded-lg border p-2 text-xs font-medium transition text-center',
                      customization.border.applyTo === 'all'
                        ? 'border-indigo-400 bg-indigo-50 font-bold text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    All 25 Pages
                  </button>
                </div>
              </div>

              {/* Width Slider */}
              <div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Border Thickness</span>
                  <span className="font-mono text-slate-500">{customization.border.width}px</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={customization.border.width}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      border: { ...prev.border, width: parseFloat(e.target.value) },
                    }))
                  }
                  className="mt-1 w-full accent-indigo-600"
                />
              </div>

              {/* Inset Padding Slider */}
              <div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Margin Inset</span>
                  <span className="font-mono text-slate-500">{customization.border.inset}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="2"
                  value={customization.border.inset}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      border: { ...prev.border, inset: parseInt(e.target.value, 10) },
                    }))
                  }
                  className="mt-1 w-full accent-indigo-600"
                />
              </div>

              {/* Color Presets */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Border Color</label>
                <div className="mt-1.5 flex gap-2">
                  {[
                    { label: 'Black', hex: '#0f172a' },
                    { label: 'Navy', hex: '#1e3a8a' },
                    { label: 'Maroon', hex: '#7f1d1d' },
                    { label: 'Gold', hex: '#b45309' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      onClick={() =>
                        setCustomization((prev) => ({
                          ...prev,
                          border: { ...prev.border, color: c.hex },
                        }))
                      }
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-xs font-medium transition',
                        customization.border.color === c.hex ? 'border-slate-800 font-bold ring-1 ring-slate-400' : 'border-slate-200'
                      )}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.hex }} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. LOGO & EMBLEM INSPECTOR */}
          {inspectorTab === 'logo' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Logo & Institutional Insignia</h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Trinity Academy of Engineering emblem (KJEI Institute shield, wings & ribbon).
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5">
                <span className="text-xs font-semibold text-slate-800">Show Emblem Logo</span>
                <input
                  type="checkbox"
                  checked={customization.logo.enabled}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      logo: { ...prev.logo, enabled: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded accent-indigo-600"
                />
              </div>

              {/* Logo Scale Slider */}
              <div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Logo Scale</span>
                  <span className="font-mono text-slate-500">{Math.round(customization.logo.scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={customization.logo.scale}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      logo: { ...prev.logo, scale: parseFloat(e.target.value) },
                    }))
                  }
                  className="mt-1 w-full accent-indigo-600"
                />
              </div>

              {/* Tagline text toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5">
                <span className="text-xs font-semibold text-slate-800">Display "TRINITY" Banner Text</span>
                <input
                  type="checkbox"
                  checked={customization.logo.showTagline}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      logo: { ...prev.logo, showTagline: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded accent-indigo-600"
                />
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-[11.5px] text-indigo-900 leading-relaxed">
                ✓ Vector emblem normalized into Universal Document Model. Clean export ready for LaTeX, Typst, Quarto, and PDF.
              </div>
            </div>
          )}

          {/* 4. FIGURES & DIAGRAMS INSPECTOR */}
          {inspectorTab === 'figures' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Figures & Architecture Diagrams</h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  7 Figures detected across Chapters 4 & 6. Click any figure in the list to jump to its page or edit caption.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'fig-4-1', num: 'Figure 4.1', title: 'Use Case Diagram of the System', page: 7 },
                  { id: 'fig-4-2', num: 'Figure 4.2', title: 'Flow Chart of the System', page: 8 },
                  { id: 'fig-6-1', num: 'Figures 6.1 & 6.2', title: 'Customer & Admin Login Screen', page: 9 },
                  { id: 'fig-6-3', num: 'Figure 6.3', title: 'Kumar Pacific Mall Slot Matrix', page: 10 },
                  { id: 'fig-6-4', num: 'Figure 6.4', title: 'Booking QR Token Confirmation', page: 10 },
                  { id: 'fig-6-5', num: 'Figure 6.5', title: 'Firebase for DataStorage', page: 11 },
                ].map((f) => {
                  const isAi = Boolean(customization.figures[f.id]?.aiTransformed)
                  return (
                    <div
                      key={f.id}
                      onClick={() => {
                        setPage(f.page)
                        setSelectedElement(f.id)
                      }}
                      className={cn(
                        'rounded-xl border p-2.5 transition cursor-pointer',
                        selectedElement === f.id
                          ? 'border-indigo-400 bg-indigo-50/70 ring-1 ring-indigo-200'
                          : 'border-slate-200 hover:border-indigo-200 bg-white'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{f.num}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.2 text-[8.5px] font-bold uppercase tracking-tight',
                              isAi
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            )}
                          >
                            {isAi ? '✨ AI Style' : '📄 Original'}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">P.{f.page + 1}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate mt-0.5">{f.title}</div>
                    </div>
                  )
                })}
              </div>

              {selectedElement && selectedElement.startsWith('fig-') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3">
                  {/* AI Image Style Toggle with Revert Option */}
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                          <span>AI Image Style Transform</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {customization.figures[selectedElement]?.aiTransformed
                            ? 'Transformed in modern AI vector style'
                            : 'Preserved as-is (Original uploaded diagram)'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={customization.figures[selectedElement]?.aiTransformed ?? false}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setCustomization((prev) => ({
                            ...prev,
                            figures: {
                              ...prev.figures,
                              [selectedElement]: {
                                ...prev.figures[selectedElement],
                                aiTransformed: checked,
                              },
                            },
                          }))
                        }}
                        className="h-4 w-4 rounded accent-purple-600 cursor-pointer"
                      />
                    </div>

                    {customization.figures[selectedElement]?.aiTransformed && (
                      <div className="mt-2 pt-2 border-t border-purple-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-700">AI Vector Render Active</span>
                        <button
                          onClick={() => {
                            setCustomization((prev) => ({
                              ...prev,
                              figures: {
                                ...prev.figures,
                                [selectedElement]: {
                                  ...prev.figures[selectedElement],
                                  aiTransformed: false,
                                },
                              },
                            }))
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded px-2 py-0.5 transition"
                        >
                          <Undo2 className="h-3 w-3" />
                          <span>Revert to Original Image</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800">Edit Caption</span>
                    <input
                      value={customization.figures[selectedElement]?.caption ?? ''}
                      onChange={(e) => {
                        const v = e.target.value
                        setCustomization((prev) => ({
                          ...prev,
                          figures: {
                            ...prev.figures,
                            [selectedElement]: {
                              ...prev.figures[selectedElement],
                              caption: v,
                            },
                          },
                        }))
                      }}
                      placeholder="Custom caption text..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Show Border Frame</span>
                    <input
                      type="checkbox"
                      checked={customization.figures[selectedElement]?.border ?? true}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setCustomization((prev) => ({
                          ...prev,
                          figures: {
                            ...prev.figures,
                            [selectedElement]: {
                              ...prev.figures[selectedElement],
                              border: checked,
                            },
                          },
                        }))
                      }}
                      className="h-4 w-4 rounded accent-indigo-600"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. HEADER & FOOTER INSPECTOR */}
          {inspectorTab === 'header' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Running Header & Footer</h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Standard university running head for chapters and departmental footers with page numbers.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Running Header Text</label>
                <input
                  value={customization.header.text}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      header: { ...prev.header, text: e.target.value },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Header Left Label</label>
                <input
                  value={customization.header.leftText}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      header: { ...prev.header, leftText: e.target.value },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Footer Left Text</label>
                <input
                  value={customization.footer.leftText}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, leftText: e.target.value },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Footer Right Text</label>
                <input
                  value={customization.footer.rightText}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, rightText: e.target.value },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          )}

          {/* 6. SIGNATURES & APPROVALS INSPECTOR */}
          {inspectorTab === 'signatures' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Certificate Signatures</h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  4 academic approval authorities detected on the Certificate (Page 2).
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Project Guide</label>
                <input
                  value={activeRecord.guide}
                  onChange={(e) => {
                    const v = e.target.value
                    setRecords(records.map((r) => ({ ...r, guide: v })))
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CEP Coordinator</label>
                <input
                  value={activeRecord.coordinator}
                  onChange={(e) => {
                    const v = e.target.value
                    setRecords(records.map((r) => ({ ...r, coordinator: v })))
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Head of Department (HOD)</label>
                <input
                  value={activeRecord.hod}
                  onChange={(e) => {
                    const v = e.target.value
                    setRecords(records.map((r) => ({ ...r, hod: v })))
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Principal</label>
                <input
                  value={activeRecord.principal}
                  onChange={(e) => {
                    const v = e.target.value
                    setRecords(records.map((r) => ({ ...r, principal: v })))
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date</label>
                  <input
                    value={activeRecord.date}
                    onChange={(e) => {
                      const v = e.target.value
                      setRecords(records.map((r) => ({ ...r, date: v })))
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-mono text-slate-800 outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Place</label>
                  <input
                    value={activeRecord.place}
                    onChange={(e) => {
                      const v = e.target.value
                      setRecords(records.map((r) => ({ ...r, place: v })))
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. AI COMMANDS ASSISTANT */}
          {inspectorTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Natural-Language Document Engineering</h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Command edits to styling, structure, layout, borders, logos, or content. The Universal Document Model preserves formatting.
                </p>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={cmd}
                  onChange={(e) => setCmd(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiCommandSubmit()}
                  placeholder="e.g. Change border to double line..."
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-400 shadow-xs"
                />
                <button
                  onClick={() => handleAiCommandSubmit()}
                  className="rounded-xl gradient-brand px-3 py-2 text-white shadow-xs hover:brightness-110"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Prompt Suggestions */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Suggested Commands</span>
                <div className="mt-2 space-y-1.5">
                  {QUICK_COMMANDS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleAiCommandSubmit(q)}
                      className="w-full text-left rounded-lg border border-slate-100 bg-slate-50/70 p-2 text-[11px] font-medium text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/60 transition"
                    >
                      ⚡ {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Card } from '@/lib/ui'
import { cn } from '@/lib/utils'
import {
  Boxes, Code2, Layers, Cpu, FileCode2, ArrowRight, CheckCircle2,
  FileText, ShieldCheck, Sparkles, Terminal, FileCheck, RefreshCw,
} from 'lucide-react'

const UDM_LAYERS = [
  {
    id: 'content',
    name: '1. Content Layer',
    badge: 'Normalized',
    desc: 'Extracts headings, paragraphs, tables, equations, citations and lists as abstract text tokens.',
    stats: '25 Pages · 6,420 words · 8 chapters',
    sampleAst: {
      type: 'document_body',
      children: [
        { type: 'chapter', id: 'ch-1', title: 'Introduction', depth: 1 },
        { type: 'paragraph', tokens: ['The smart parking system leverages IoT tokens...'] },
        { type: 'table', columns: 4, rows: 12, caption: 'Hardware Specifications' },
      ],
    },
  },
  {
    id: 'structure',
    name: '2. Structure & AST Layer',
    badge: 'Hierarchical',
    desc: 'Maintains document outline, chapter nesting, figure numbering, and cross-reference graphs.',
    stats: '7 Chapters · 24 Subsections · 16 Cross-refs',
    sampleAst: {
      outlineTree: {
        root: 'CEP_Project_Report',
        nodes: [
          { id: 'sec-1', label: '1. Problem Definition', parent: null },
          { id: 'sec-2', label: '2. Literature Survey (IEEE)', parent: null },
          { id: 'sec-4', label: '4. System Architecture (Fig 4.1)', parent: null },
          { id: 'sec-6', label: '6. Database Schema (Firestore)', parent: null },
        ],
      },
    },
  },
  {
    id: 'layout',
    name: '3. Layout & Geometry Layer',
    badge: 'Preserved',
    desc: 'Preserves margins (1-inch academic), double-line borders, headers, footers, and canvas aspect ratios.',
    stats: 'A4 Portrait (210×297mm) · 1.5pt Border',
    sampleAst: {
      pageGeometry: {
        format: 'A4',
        margins: { top: '25.4mm', bottom: '25.4mm', left: '31.7mm', right: '25.4mm' },
        border: { style: 'double', width: '1.5pt', color: '#6366f1' },
        runningHeader: { text: 'The Ultimate Smart Parking Token System', align: 'center' },
      },
    },
  },
  {
    id: 'styles',
    name: '4. Styles & Typography Layer',
    badge: 'Standardized',
    desc: 'Normalizes fonts (Times New Roman / Inter), leading, line height, and heading hierarchy.',
    stats: 'Heading 1 (18pt Bold) · Body (12pt / 1.5 spacing)',
    sampleAst: {
      typography: {
        bodyFont: 'Times New Roman, serif',
        headingFont: 'Arial, sans-serif',
        lineHeight: 1.5,
        alignment: 'justify',
        headingSizes: { h1: '18pt', h2: '14pt', h3: '12pt' },
      },
    },
  },
  {
    id: 'fields',
    name: '5. Semantic Fields & Data Mapping',
    badge: 'AI Detected',
    desc: 'Automatically identifies student names, roll numbers, guides, HODs, institutions, and submission dates without placeholders.',
    stats: '14 Dynamic Fields · 23 Token Occurrences',
    sampleAst: {
      detectedFields: [
        { key: 'studentName', value: 'Aadesh Bhamare', occurrences: 14, confidence: 0.99 },
        { key: 'rollNumber', value: '04', occurrences: 12, confidence: 0.98 },
        { key: 'coAuthor1', value: 'Vikrant Borse (Roll 08)', occurrences: 8, confidence: 0.97 },
        { key: 'guide', value: 'Mrs. Shweta Joshi', occurrences: 9, confidence: 0.99 },
        { key: 'college', value: 'Trinity Academy of Engineering', occurrences: 16, confidence: 1.0 },
      ],
    },
  },
  {
    id: 'relationships',
    name: '6. Relationships & Citations',
    badge: 'Verified',
    desc: 'Bi-directional resolution between in-text citations [1]–[7] and references, plus figure anchors.',
    stats: '7 IEEE Citations · 7 Figures linked',
    sampleAst: {
      citationGraph: [
        { refNum: 1, text: 'F. J. Enríquez, Smart Parking (MDPI Sensors 2024)', linkedLocations: ['Page 4', 'Page 13'] },
        { figure: 'Fig 4.1', title: 'Use Case Diagram', linkedLocations: ['Page 8'] },
      ],
    },
  },
  {
    id: 'metadata',
    name: '7. Multi-Engine Compiler Layer',
    badge: '7 Target Engines',
    desc: 'Direct intermediate representation that compiles into PDF, DOCX, LaTeX, Typst, Quarto, HTML/CSS, or Markdown.',
    stats: 'Zero Loss Round-Trip Serialization',
    sampleAst: {
      targetEngines: ['WeasyPrint (PDF)', 'python-docx (DOCX)', 'XeLaTeX', 'Typst CLI', 'Quarto Engine', 'HTML5/Tailwind', 'Pandoc GFM'],
    },
  },
]

export function ModelStep({ onContinue }: { onContinue: () => void }) {
  const [activeLayer, setActiveLayer] = useState(UDM_LAYERS[0])
  const [viewMode, setViewMode] = useState<'architecture' | 'astJson' | 'compiler'>('architecture')

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Universal Document Model (UDM)</h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              <strong>Core Architecture:</strong> Represents document content, structure, layout, and semantic fields in a common format.
              Enables multi-format compilation and personalized document generation without altering original layouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('architecture')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                viewMode === 'architecture' ? 'gradient-brand text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              7-Layer Architecture
            </button>
            <button
              onClick={() => setViewMode('astJson')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                viewMode === 'astJson' ? 'gradient-brand text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              AST JSON Schema
            </button>
            <button
              onClick={() => setViewMode('compiler')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                viewMode === 'compiler' ? 'gradient-brand text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              Multi-Format Compiler
            </button>
          </div>
        </div>

        {/* 7-Layer Architecture View */}
        {viewMode === 'architecture' && (
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Select a Semantic Layer to Inspect
              </div>
              {UDM_LAYERS.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer)}
                  className={cn(
                    'rounded-xl border p-3.5 transition-all cursor-pointer text-left',
                    activeLayer.id === layer.id
                      ? 'border-indigo-400 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-200'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{layer.name}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] font-bold text-emerald-800">
                      {layer.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-slate-600">{layer.desc}</p>
                  <div className="mt-1.5 text-[10px] font-mono text-slate-400">{layer.stats}</div>
                </div>
              ))}
            </div>

            {/* Layer Inspector Panel */}
            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-100 bg-slate-900 p-4 text-white">
                <div className="flex items-center justify-between text-xs font-mono text-indigo-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5" /> UDM Node Inspector: {activeLayer.name}
                  </span>
                  <span className="text-[10px] text-slate-500">AST v2.4</span>
                </div>
                <pre className="mt-3 overflow-auto max-h-72 text-[11px] font-mono leading-relaxed text-slate-300 scrollbar-thin">
                  {JSON.stringify(activeLayer.sampleAst, null, 2)}
                </pre>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="text-xs font-bold text-indigo-950">Why Universal Document Model?</div>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">
                  Instead of fragile regex string-replacement, UDM treats documents as a semantic tree of objects.
                  Layout boundaries are mathematically preserved while dynamic values (e.g. 14 student name occurrences)
                  are resolved seamlessly into independent, publication-grade outputs.
                </p>
                <button
                  onClick={onContinue}
                  className="mt-4 w-full rounded-xl gradient-brand py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center justify-center gap-1.5"
                >
                  Open Smart Field Selection & Personalization <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AST JSON Schema View */}
        {viewMode === 'astJson' && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-900 p-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-indigo-400 font-mono">
              <span>Complete Universal Document Model Schema (JSON)</span>
              <span>Root: Document AST</span>
            </div>
            <pre className="mt-3 max-h-96 overflow-auto font-mono text-xs text-emerald-400 scrollbar-thin">
{`{
  "$schema": "https://docengine.ai/udm-v2.json",
  "documentId": "doc-sppu-cep-parking-001",
  "title": "{{projectTitle}}",
  "pages": 25,
  "engine": "universal-document-model",
  "metadata": {
    "author": "{{studentName}}",
    "institution": "{{college}}",
    "degree": "{{degree}}",
    "academicYear": "{{academicYear}}",
    "detectedTokensCount": 23
  },
  "layers": {
    "content": { "blocksCount": 142, "words": 6420, "tables": 8, "figures": 7 },
    "structure": { "chapters": 7, "sections": 24, "signatories": 4 },
    "layout": { "border": "double 1.5pt", "margins": "academic 1-inch", "aspect": "A4" },
    "styles": { "baseFont": "Times New Roman", "headingFont": "Inter", "leading": 1.5 },
    "fields": [
      { "key": "studentName", "type": "string", "mappedFrom": "studentRecords.studentName" },
      { "key": "rollNumber", "type": "string", "mappedFrom": "studentRecords.rollNumber" },
      { "key": "guide", "type": "string", "mappedFrom": "studentRecords.guide" },
      { "key": "college", "type": "string", "mappedFrom": "studentRecords.college" }
    ]
  }
}`}
            </pre>
          </div>
        )}

        {/* Multi-Format Compiler View */}
        {viewMode === 'compiler' && (
          <div className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { fmt: 'PDF (Print Ready)', engine: 'WeasyPrint / Cairo', desc: 'Vector layout with exact 1.5pt borders and pagination' },
                { fmt: 'DOCX (Word)', engine: 'python-docx', desc: 'Editable office documents with native Word styles' },
                { fmt: 'LaTeX & Typst', engine: 'XeLaTeX / Typst', desc: 'Academic publishing with IEEE citations and math' },
              ].map((c) => (
                <div key={c.fmt} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <div className="text-xs font-bold text-slate-900">{c.fmt}</div>
                  <div className="text-[10px] font-mono text-indigo-600 mt-0.5">{c.engine}</div>
                  <p className="mt-1 text-xs text-slate-500">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={onContinue}
                className="rounded-xl gradient-brand px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
              >
                Continue to Smart Field Selection →
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

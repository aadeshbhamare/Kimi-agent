import { useApp } from '@/lib/store'
import { Logo } from '@/components/AppShell'
import {
  ArrowRight, UploadCloud, BrainCircuit, MousePointerClick, Layers3, ShieldCheck,
  FileDown, Sparkles, BookOpen, Award, CheckCircle2, ChevronDown, FileText, Layers, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const FLOW = [
  { icon: FileText, label: 'Document' },
  { icon: BrainCircuit, label: 'AI Understanding' },
  { icon: MousePointerClick, label: 'Smart Fields' },
  { icon: Layers3, label: 'Multiple Drafts' },
  { icon: ShieldCheck, label: 'AI Validation' },
  { icon: FileDown, label: 'Final Documents' },
]

const FEATURES = [
  { icon: BrainCircuit, title: 'AI Document Understanding', desc: 'OCR, layout analysis and vision models convert any PDF, DOCX, image, LaTeX, Typst, Markdown or HTML file into a structured Universal Document Model.' },
  { icon: MousePointerClick, title: 'Smart Field Detection', desc: 'Names, dates, IDs, roll numbers, certificate numbers, college and guide names are detected semantically — no manual placeholders.' },
  { icon: Layers3, title: 'Multiple Complete Drafts', desc: 'One master document plus N value sets produces N complete, independent documents — every occurrence personalized, formatting preserved.' },
  { icon: Sparkles, title: 'AI Editing', desc: '“Make all headings bold”, “Convert references to IEEE” — natural-language edits applied to the document model with undo/redo.' },
  { icon: BookOpen, title: 'Research Workspace', desc: 'RAG-powered Q&A, summarization, paper comparison, methodology extraction and citation management in IEEE, APA, MLA, Harvard and Chicago.' },
  { icon: ShieldCheck, title: 'AI Validation & Audit', desc: '18 automated checks — grammar, consistency, formatting, layout overflow, template compliance — with one-click auto-fix.' },
  { icon: Award, title: 'Certificate Automation', desc: 'AI field mapping, capacity & fit analysis, adaptive fitting and bulk generation of 1000+ certificates — design stays locked.' },
  { icon: FileDown, title: 'Multi-Format Engines', desc: 'LaTeX, Typst, Quarto, HTML/CSS, DOCX, Markdown, PDF — the right engine is selected automatically. You just click Generate.' },
]

const DOC_TYPES = ['College Project Report', 'Thesis', 'Research Paper', 'Assignment', 'Resume', 'Business Document', 'Company Profile', 'Certificate', 'Custom Template']

const FAQS = [
  { q: 'Is this just mail merge?', a: 'No. Mail merge swaps placeholders in one template. DocEngine AI understands an existing finished document, builds a semantic model of it, detects fields automatically, and generates complete independent documents — then validates them. No placeholder authoring, no code.' },
  { q: 'Do I need to know LaTeX, Typst or Markdown?', a: 'Never. The Universal Document Model separates content from rendering. You edit visually or with natural-language commands; the platform picks the right generation engine per output format.' },
  { q: 'How does personalization keep formatting intact?', a: 'Edits happen on the structured model, not on rendered pixels. Styles, layout and bounding boxes are preserved, and capacity checks prevent overflow before generation.' },
  { q: 'Are citations in the Research workspace reliable?', a: 'Answers are grounded in your uploaded documents via retrieval (RAG) and every claim links back to a source chunk. The platform never fabricates citations.' },
  { q: 'What makes Certificate Automation different?', a: 'AI detects field areas on your certificate design, locks the design, runs capacity & fit analysis on every record, adaptively fits long names, and bulk-generates PDFs/PNGs with custom numbering patterns.' },
]

export default function Landing() {
  const { navigate } = useApp()
  const [openFaq, setOpenFaq] = useState(0)

  const start = () => navigate('dashboard')

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#how" className="hover:text-indigo-600">How it works</a>
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#certificates" className="hover:text-indigo-600">Certificates</a>
            <a href="#faq" className="hover:text-indigo-600">FAQ</a>
          </nav>
          <button onClick={start} className="rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-lift hover:brightness-110">Start Creating</button>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-brand-soft border-b border-indigo-100">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
            <Zap className="h-3 w-3" /> One Platform. Multiple Document Types.
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            AI Universal <span className="text-gradient">Document Engineering</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Understand, edit, personalize, generate and validate documents with AI — without writing document code.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <button onClick={start} className="inline-flex items-center gap-2 rounded-xl gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-lift hover:brightness-110">
              Start Creating <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#how" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-700">
              Explore Platform
            </a>
          </div>

          {/* Hero flow visual */}
          <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-indigo-100 bg-white p-6 shadow-lift">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {FLOW.map((f, i) => (
                <div key={f.label} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', i === 0 || i === FLOW.length - 1 ? 'bg-slate-900 text-white' : 'gradient-brand text-white')}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <span className="whitespace-nowrap text-[10.5px] font-semibold text-slate-600">{f.label}</span>
                  </div>
                  {i < FLOW.length - 1 && <ArrowRight className="mb-5 h-4 w-4 shrink-0 text-indigo-300" />}
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-slate-500">
              An AI-powered universal document engineering platform that understands existing documents, converts them into a semantic model, enables field-level personalization, generates complete variants across formats, and validates the outputs.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
        <p className="mt-2 text-center text-sm text-slate-500">The core document-engineering workflow — end to end.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: UploadCloud, t: '1 · Upload / Create', d: 'Drop a PDF, DOCX, image, LaTeX, Typst, Markdown or HTML file — or start fresh.' },
            { icon: BrainCircuit, t: '2 · AI Understanding', d: 'OCR, layout analysis and semantic field detection build the Universal Document Model.' },
            { icon: MousePointerClick, t: '3 · Personalize', d: 'Click any value, add multiple records — names, roll numbers, divisions, dates.' },
            { icon: Layers3, t: '4 · Generate & Validate', d: 'N complete independent documents, audited by AI, exported to any format.' },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50"><s.icon className="h-5 w-5 text-indigo-600" /></div>
              <div className="mt-3 text-sm font-bold text-slate-900">{s.t}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-slate-900">Core features</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-soft">
                <f.icon className="h-5 w-5 text-indigo-600" />
                <div className="mt-3 text-sm font-bold text-slate-900">{f.title}</div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-14 text-center text-lg font-bold text-slate-900">Multiple document types</h3>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {DOC_TYPES.map((t) => (
              <span key={t} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-slate-600">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate automation */}
      <section id="certificates" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700"><Award className="h-3 w-3" /> Dedicated module</span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Certificate Automation</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Automate certificates using AI-powered field detection, spreadsheet mapping, capacity analysis, adaptive fitting and bulk generation — while preserving the original design.
            </p>
            <ul className="mt-5 space-y-2.5">
              {['AI detects name, college, achievement, date and number areas automatically', 'Design lock — backgrounds, logos, borders and colors never change', 'Capacity & fit analysis flags overflow risk before generation', 'Adaptive fitting shrinks, wraps and re-spaces long names intelligently', 'Bulk-generate 1,000+ certificates with custom numbering (TRINITY-2026-001)'].map((li) => (
                <li key={li} className="flex items-start gap-2 text-[13.5px] text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />{li}</li>
              ))}
            </ul>
            <button onClick={() => navigate('certificates')} className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110">
              Open Certificate Automation <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-2xl border border-violet-100 gradient-brand-soft p-6">
            <div className="rounded-xl border-4 border-double border-violet-300 bg-white p-6 text-center shadow-soft">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500">Trinity College of Engineering</div>
              <div className="mt-1 text-lg font-bold text-slate-900">Certificate of Achievement</div>
              <div className="mt-1 text-[10px] text-slate-500">This certificate is proudly presented to</div>
              <div className="mt-2 text-base font-bold text-indigo-700 underline decoration-indigo-200 underline-offset-4">Aadesh Bhamare</div>
              <div className="mt-1.5 text-[10.5px] text-slate-600">First Rank — National Hackathon 2026</div>
              <div className="mt-4 flex items-end justify-between text-[9px] text-slate-400">
                <span>TRINITY-2026-001</span><span>Date: 25 May 2026</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[['94', 'Normal fit'], ['4', 'Adaptive fit'], ['2', 'Manual review']].map(([v, l]) => (
                <div key={l} className="rounded-lg bg-white/80 p-2">
                  <div className="text-sm font-bold text-slate-900">{v}</div>
                  <div className="text-[10px] text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-slate-900">Technology architecture</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Frontend', items: ['React.js', 'TypeScript', 'Tailwind CSS', 'Tiptap / ProseMirror', 'PDF.js'] },
              { t: 'Backend', items: ['Python · FastAPI', 'Pydantic', 'SQLAlchemy', 'PostgreSQL', 'Redis + Celery'] },
              { t: 'AI & Data', items: ['LLM + Vision', 'OCR · NLP', 'Embeddings', 'RAG', 'Qdrant / pgvector'] },
              { t: 'Engines & Infra', items: ['LaTeX · Typst · Quarto', 'WeasyPrint', 'PyMuPDF · OpenCV', 'S3-compatible storage', 'Docker'] },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-bold text-slate-900">{c.t}</div>
                <ul className="mt-3 space-y-1.5">
                  {c.items.map((i) => <li key={i} className="flex items-center gap-2 text-[12.5px] text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-slate-500">
            Large operations (50-page analysis, 100-document generation, 1000-certificate batches, RAG indexing) run asynchronously: FastAPI → Redis → Celery → Storage → live job status.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">Use cases</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { t: 'Universities & Colleges', d: 'One master project report → personalized, validated reports for an entire class. Certificates for every event, numbered automatically.' },
            { t: 'Research Teams', d: 'Grounded literature reviews, citation management and IEEE-ready papers generated through LaTeX — without writing LaTeX.' },
            { t: 'Enterprises', d: 'Company templates, proposal generation, role-based collaboration, version history and audit trails across departments.' },
          ].map((u) => (
            <div key={u.t} className="rounded-2xl border border-slate-200 p-6 transition hover:border-indigo-200 hover:shadow-soft">
              <div className="text-sm font-bold text-slate-900">{u.t}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{u.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="mt-8 space-y-2.5">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white">
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-800">
                {f.q}
                <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', openFaq === i && 'rotate-180')} />
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-[13px] leading-relaxed text-slate-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row">
          <Logo />
          <div className="text-xs text-slate-500">Understand · Edit · Personalize · Generate · Automate</div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Layers className="h-3.5 w-3.5 text-indigo-400" /> DocEngine AI © 2026
          </div>
        </div>
      </footer>
    </div>
  )
}

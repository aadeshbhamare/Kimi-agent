import { useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import { RESEARCH_DOCS, CITATION_STYLES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { BookOpen, UploadCloud, Send, FileText, Database, Layers3, Quote } from 'lucide-react'

interface QA { q: string; a: string; sources: { doc: string; chunk: string }[] }

const CANNED: QA[] = [
  {
    q: 'Summarize the phishing detection survey',
    a: 'Gupta et al. (2023) categorize phishing detection into list-based, heuristic, visual-similarity and ML approaches. They conclude that transformer-based content classifiers outperform heuristic methods on adversarial samples, but emphasize that header-authentication signals (SPF/DKIM/DMARC) remain the strongest single feature for zero-day campaigns.',
    sources: [
      { doc: 'A Survey of Phishing Detection Techniques', chunk: 'Chunk 41 · §4.2 ML-based detection' },
      { doc: 'Email Forensics: Header Analysis at Scale', chunk: 'Chunk 12 · §2.1 Authentication signals' },
    ],
  },
]

export default function Research() {
  const [q, setQ] = useState('')
  const [style, setStyle] = useState<(typeof CITATION_STYLES)[number]>('IEEE')
  const [history, setHistory] = useState<QA[]>(CANNED)
  const [thinking, setThinking] = useState(false)

  const ask = () => {
    if (!q.trim()) return
    const question = q.trim()
    setQ('')
    setThinking(true)
    setTimeout(() => {
      setHistory((h) => [{
        q: question,
        a: 'Based on the indexed corpus, transformer-based classification combined with header-authentication signals achieves the strongest results on adversarial phishing content. The retrieved passages indicate that hybrid pipelines reduce false positives by roughly 38% versus content-only models.',
        sources: [
          { doc: 'BERT: Pre-training of Deep Bidirectional Transformers', chunk: 'Chunk 87 · §3 Model architecture' },
          { doc: 'A Survey of Phishing Detection Techniques', chunk: 'Chunk 55 · §5 Comparative results' },
        ],
      }, ...h])
      setThinking(false)
    }, 1100)
  }

  const cite = (s: { doc: string }) => {
    const year = RESEARCH_DOCS.find((r) => r.title === s.doc)?.year ?? 2024
    switch (style) {
      case 'IEEE': return `[1] “${s.doc},” indexed research corpus, ${year}.`
      case 'APA': return `Author. (${year}). ${s.doc}. Indexed research corpus.`
      case 'MLA': return `Author. "${s.doc}." Indexed research corpus, ${year}.`
      case 'Harvard': return `Author, ${year}. ${s.doc}. Indexed research corpus.`
      case 'Chicago': return `Author. "${s.doc}." Indexed research corpus (${year}).`
    }
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Research Workspace"
        subtitle="RAG-grounded answers from your papers — never fabricated citations"
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110">
            <UploadCloud className="h-4 w-4" /> Upload Papers / PDFs / Notes / Datasets
          </button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card>
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-900">Indexed documents</div>
          <div className="divide-y divide-slate-50">
            {RESEARCH_DOCS.map((r) => (
              <div key={r.id} className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  <div>
                    <div className="text-[12.5px] font-semibold leading-snug text-slate-800">{r.title}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{r.authors} · {r.year}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10.5px]">
                      <span className="inline-flex items-center gap-1 text-slate-400"><Layers3 className="h-3 w-3" />{r.chunks} chunks</span>
                      <span className={cn('font-medium', r.status === 'Indexed' ? 'text-emerald-600' : 'text-amber-600')}>{r.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ask()}
                placeholder="Ask questions, summarize, compare papers, extract methodology…"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
              <button onClick={ask} className="rounded-xl gradient-brand px-4 text-white hover:brightness-110"><Send className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-400">Citation style:</span>
              {CITATION_STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)} className={cn('rounded-full px-2.5 py-1 text-[11px] font-medium', style === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>{s}</button>
              ))}
            </div>
          </Card>

          {thinking && (
            <Card className="p-4 text-sm text-indigo-600 font-medium flex items-center gap-2">
              <Database className="h-4 w-4 animate-pulse-soft" /> Retrieving context from vector index…
            </Card>
          )}

          {history.map((item, i) => (
            <Card key={i} className="p-5 animate-fade-up">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white text-[10px] font-bold">Q</div>
                <div className="text-sm font-semibold text-slate-900">{item.q}</div>
              </div>
              <div className="mt-3 flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg gradient-brand"><BookOpen className="h-3.5 w-3.5 text-white" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-relaxed text-slate-700">{item.a}</p>
                  <div className="mt-3 space-y-1.5">
                    {item.sources.map((s, j) => (
                      <div key={j} className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
                        <div className="flex items-center gap-2 text-[11.5px] font-medium text-slate-700">
                          <Quote className="h-3 w-3 text-indigo-400" /> {s.doc}
                          <span className="text-slate-400">· {s.chunk}</span>
                        </div>
                        <div className="mt-1 font-mono text-[10.5px] text-indigo-600">{cite(s)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

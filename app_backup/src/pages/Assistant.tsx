import { useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import { useApp } from '@/lib/store'
import { Sparkles, Send, User } from 'lucide-react'

interface Msg { role: 'user' | 'ai'; text: string }

const SUGGESTIONS = [
  'Generate 4 personalized drafts of my project report',
  'Convert all references to IEEE style',
  'Check name consistency across my documents',
  'Create a certificate batch for 100 students',
]

const RESPONSES: [RegExp, string][] = [
  [/draft|personaliz|generate/i, 'I can do that. Your master document "Final Year Project Report" has 6 semantic fields with 23 occurrences. Open Documents → workflow, click "Generate Drafts" and I\'ll produce one complete 50-page document per record. I\'ve prepared the job queue.'],
  [/ieee|reference|citation/i, 'I\'ll convert the bibliography to IEEE numbered style: in-text citations become [n], references reordered by first appearance, and author initials normalized. 14 references will be updated. Apply it from the Editor\'s AI panel to preview before committing.'],
  [/consisten/i, 'Consistency check: "Student Name" appears 5 times — 3 as "Aadesh Bhamare", 2 as "Aadesh S. Bhamare". I recommend normalizing to "Aadesh Bhamare". Dates are consistent except the Declaration page. Run the AI Document Audit for the full 18-check report.'],
  [/certificate/i, 'Certificate Automation is a dedicated module — open it from the sidebar. Upload a template and a CSV, and I\'ll detect field areas, lock the design, run capacity analysis and bulk-generate numbered certificates (e.g. TRINITY-2026-001…).'],
  [/.*/, 'Understood. I\'ve interpreted your instruction against the Universal Document Model. The change preserves layout, styles and unrelated content, and is fully undoable from History.'],
]

export default function Assistant() {
  const { navigate } = useApp()
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'ai', text: 'Hello! I\'m your document engineering assistant. I can understand documents, apply edits, generate personalized drafts, run audits and automate certificates. What would you like to do?' },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)

  const send = (text: string) => {
    if (!text.trim()) return
    setMsgs((m) => [...m, { role: 'user', text }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      const r = RESPONSES.find(([re]) => re.test(text)) ?? RESPONSES[RESPONSES.length - 1]
      setMsgs((m) => [...m, { role: 'ai', text: r[1] }])
      setThinking(false)
    }, 900)
  }

  return (
    <div className="animate-fade-up flex h-[calc(100vh-130px)] flex-col">
      <PageHeader title="AI Assistant" subtitle="Natural-language control over the entire document workflow" />
      <Card className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={m.role === 'user'
                ? 'max-w-[75%] rounded-2xl rounded-br-sm gradient-brand px-4 py-2.5 text-[13px] text-white'
                : 'max-w-[75%] rounded-2xl rounded-bl-sm border border-slate-100 bg-slate-50 px-4 py-2.5 text-[13px] leading-relaxed text-slate-700'}>
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-70">
                  {m.role === 'ai' ? <><Sparkles className="h-3 w-3" /> Assistant</> : <><User className="h-3 w-3" /> You</>}
                </div>
                {m.text}
                {m.role === 'ai' && /workflow|module/i.test(m.text) && (
                  <button onClick={() => navigate(/certificate/i.test(m.text) ? 'certificates' : 'workflow')} className="mt-2 block rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700">
                    Open module →
                  </button>
                )}
              </div>
            </div>
          ))}
          {thinking && <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium"><Sparkles className="h-3.5 w-3.5 animate-pulse-soft" /> Thinking…</div>}
        </div>
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-slate-200 px-3 py-1 text-[11.5px] text-slate-600 hover:border-indigo-200 hover:text-indigo-600">{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Type an instruction… e.g. “Make all headings bold”"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
            <button onClick={() => send(input)} className="rounded-xl gradient-brand px-4 text-white hover:brightness-110"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </Card>
    </div>
  )
}

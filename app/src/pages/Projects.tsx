import { useState } from 'react'
import { Card, PageHeader, ProgressBar } from '@/lib/ui'
import { PROJECTS } from '@/lib/data'
import { useApp } from '@/lib/store'
import { FolderKanban, Plus, Users, FileText, MessageSquare, GitBranch, BrainCircuit, FileDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = ['Documents', 'Templates', 'Research', 'Generated Drafts', 'Comments', 'Versions', 'AI Analysis', 'Exports']

export default function Projects() {
  const { navigate } = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const [tab, setTab] = useState('Documents')
  const project = PROJECTS.find((p) => p.id === open)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Projects"
        subtitle="Documents, drafts, research, comments and versions — grouped by project"
        actions={<button className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110"><Plus className="h-4 w-4" /> New Project</button>}
      />
      {PROJECTS.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
            <FolderKanban className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Projects Created Yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Group your documents, personalization batches, feedback rounds, and export archives into unified project workspaces.
          </p>
          <button
            onClick={() => navigate('workflow')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Start In Workflow
          </button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <Card key={p.id} className="p-5 transition hover:shadow-lift cursor-pointer" >
              <button className="w-full text-left" onClick={() => setOpen(p.id)}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${p.color}18` }}>
                    <FolderKanban className="h-5 w-5" style={{ color: p.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">Updated {p.updated}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-[11.5px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{p.docs} docs</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p.members} members</span>
                  <span className="ml-auto font-semibold" style={{ color: p.color }}>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} className="mt-2" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setOpen(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="text-sm font-bold text-slate-900">{project.name}</div>
              <button onClick={() => setOpen(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 py-2 scrollbar-thin">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cn('whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium', tab === t ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100')}>{t}</button>
              ))}
            </div>
            <div className="p-5">
              {tab === 'Documents' && (
                <div className="space-y-2">
                  {['Final Year Project Report — MailTrace AI', 'Research Paper — Phishing Detection Survey', 'Project Presentation v3', 'Synopsis — approved'].map((d) => (
                    <button key={d} onClick={() => navigate('workflow')} className="flex w-full items-center gap-2.5 rounded-xl border border-slate-100 px-3.5 py-2.5 text-left text-[13px] font-medium text-slate-700 hover:border-indigo-200">
                      <FileText className="h-4 w-4 text-indigo-400" />{d}
                    </button>
                  ))}
                </div>
              )}
              {tab === 'Comments' && <div className="flex items-start gap-2 text-sm text-slate-600"><MessageSquare className="h-4 w-4 mt-0.5 text-slate-400" /> 3 open comments — latest from Prof. S. Kulkarni on the Abstract section.</div>}
              {tab === 'Versions' && <div className="flex items-start gap-2 text-sm text-slate-600"><GitBranch className="h-4 w-4 mt-0.5 text-slate-400" /> 14 versions. Latest: v14 saved 40 minutes ago. Any version can be restored.</div>}
              {tab === 'AI Analysis' && <div className="flex items-start gap-2 text-sm text-slate-600"><BrainCircuit className="h-4 w-4 mt-0.5 text-slate-400" /> 4 documents analyzed · 12 fields · 8 tables · 14 images detected in the master report.</div>}
              {tab === 'Generated Drafts' && <div className="text-sm text-slate-600">4 personalized 50-page drafts generated 26 minutes ago (Aadesh, Rahul, Rohan, Om).</div>}
              {tab === 'Exports' && <div className="flex items-start gap-2 text-sm text-slate-600"><FileDown className="h-4 w-4 mt-0.5 text-slate-400" /> 6 exports — PDF ×4, DOCX ×1, LaTeX ×1.</div>}
              {(tab === 'Templates' || tab === 'Research') && <div className="text-sm text-slate-600">Linked {tab.toLowerCase()} appear here.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

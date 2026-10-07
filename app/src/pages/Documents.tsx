import { useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import { DOCUMENTS } from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import { FileText, UploadCloud, Search, Download, Trash2, Eye } from 'lucide-react'

export default function Documents() {
  const { navigate } = useApp()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const types = ['All', ...Array.from(new Set(DOCUMENTS.map((d) => d.type)))]
  const rows = DOCUMENTS.filter((d) =>
    (filter === 'All' || d.type === filter) && d.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Documents"
        subtitle="Every document, its status and AI analysis state"
        actions={
          <button onClick={() => navigate('workflow')} className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110">
            <UploadCloud className="h-4 w-4" /> Upload Document
          </button>
        }
      />
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents…" className="w-56 rounded-xl border border-slate-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-indigo-300" />
          </div>
          <div className="flex gap-1.5">
            {types.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={cn('rounded-lg px-2.5 py-1.5 text-xs font-medium', filter === t ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100')}>{t}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          {rows.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Documents Uploaded Yet</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                Clean workspace ready. Upload your master document, report, or thesis to begin AI structure detection and bulk personalization.
              </p>
              <button
                onClick={() => navigate('workflow')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110"
              >
                <UploadCloud className="h-4 w-4" /> Start Document Workflow
              </button>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-2.5 font-medium">Name</th>
                  <th className="px-3 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 font-medium">Pages</th>
                  <th className="px-3 py-2.5 font-medium">Project</th>
                  <th className="px-3 py-2.5 font-medium">Modified</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">AI</th>
                  <th className="px-3 py-2.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id} className="border-t border-slate-50 hover:bg-slate-50/60">
                    <td className="px-5 py-3"><div className="flex items-center gap-2.5"><FileText className="h-4 w-4 text-indigo-400" /><span className="font-medium text-slate-800">{d.name}</span></div></td>
                    <td className="px-3 py-3"><span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] text-slate-600">{d.type}</span></td>
                    <td className="px-3 py-3 text-slate-500">{d.pages}</td>
                    <td className="px-3 py-3 text-slate-500">{d.project}</td>
                    <td className="px-3 py-3 text-slate-500">{d.modified}</td>
                    <td className="px-3 py-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium',
                        d.status === 'Final' && 'bg-emerald-100 text-emerald-700',
                        d.status === 'Draft' && 'bg-slate-100 text-slate-600',
                        d.status === 'In Review' && 'bg-amber-100 text-amber-700',
                        d.status === 'Generated' && 'bg-violet-100 text-violet-700')}>{d.status}</span>
                    </td>
                    <td className="px-3 py-3"><span className={cn('text-[11.5px] font-medium', d.aiStatus === 'Analyzed' ? 'text-indigo-600' : 'text-slate-400')}>{d.aiStatus}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => navigate('workflow')} className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" title="Open"><Eye className="h-3.5 w-3.5" /></button>
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Download"><Download className="h-3.5 w-3.5" /></button>
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}

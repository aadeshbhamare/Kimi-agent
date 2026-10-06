import { useApp } from '@/lib/store'
import { DOCUMENTS, PROJECTS, type ActivityItem } from '@/lib/data'
import { Card } from '@/lib/ui'
import { CircledOptionSelector } from '@/components/CircledOptionSelector'
import {
  UploadCloud, FilePlus2, Layers, BookOpen, Award, FileText, ArrowRight,
  BrainCircuit, Layers3, ShieldCheck, PenLine, FileDown, ChevronRight, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ACT_ICON: Record<ActivityItem['icon'], typeof BrainCircuit> = {
  analyze: BrainCircuit, generate: Layers3, validate: ShieldCheck, certificate: Award, edit: PenLine, export: FileDown,
}
const ACT_COLOR: Record<ActivityItem['icon'], string> = {
  analyze: 'text-indigo-600 bg-indigo-50', generate: 'text-violet-600 bg-violet-50', validate: 'text-emerald-600 bg-emerald-50',
  certificate: 'text-amber-600 bg-amber-50', edit: 'text-sky-600 bg-sky-50', export: 'text-slate-600 bg-slate-100',
}

export default function Dashboard() {
  const { navigate, activity } = useApp()

  const stats = [
    { label: 'Total Documents', value: '42', delta: '+6 this week' },
    { label: 'Active Projects', value: '4', delta: '2 due soon' },
    { label: 'Generated Documents', value: '128', delta: '+104 bulk' },
    { label: 'Templates', value: '9', delta: '3 shared' },
    { label: 'Recent AI Jobs', value: '17', delta: '1 processing' },
  ]

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Concise Circled Options to Select & Proceed */}
      <CircledOptionSelector />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{s.label}</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">{s.value}</div>
            <div className="mt-0.5 text-[11px] font-medium text-emerald-600">{s.delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Recent documents */}
          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div className="text-sm font-bold text-slate-900">Recent Documents</div>
              <button onClick={() => navigate('documents')} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">View all <ArrowRight className="h-3 w-3" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-2.5 font-medium">Document</th>
                    <th className="px-3 py-2.5 font-medium">Type</th>
                    <th className="px-3 py-2.5 font-medium">Modified</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">AI Analysis</th>
                    <th className="px-3 py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {DOCUMENTS.slice(0, 5).map((d) => (
                    <tr key={d.id} className="border-t border-slate-50 hover:bg-slate-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 shrink-0 text-indigo-400" />
                          <span className="font-medium text-slate-800">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3"><span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] text-slate-600">{d.type}</span></td>
                      <td className="px-3 py-3 text-slate-500">{d.modified}</td>
                      <td className="px-3 py-3">
                        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium',
                          d.status === 'Final' && 'bg-emerald-100 text-emerald-700',
                          d.status === 'Draft' && 'bg-slate-100 text-slate-600',
                          d.status === 'In Review' && 'bg-amber-100 text-amber-700',
                          d.status === 'Generated' && 'bg-violet-100 text-violet-700')}>{d.status}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('text-[11.5px] font-medium', d.aiStatus === 'Analyzed' ? 'text-indigo-600' : 'text-slate-400')}>{d.aiStatus}</span>
                      </td>
                      <td className="px-3 py-3">
                        <button onClick={() => navigate('workflow')} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600">Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent projects */}
          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div className="text-sm font-bold text-slate-900">Recent Projects</div>
              <button onClick={() => navigate('projects')} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">View all <ArrowRight className="h-3 w-3" /></button>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {PROJECTS.slice(0, 4).map((p) => (
                <button key={p.id} onClick={() => navigate('projects')} className="rounded-xl border border-slate-100 p-4 text-left transition hover:border-indigo-200 hover:shadow-soft">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="truncate text-[13px] font-semibold text-slate-800">{p.name}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">{p.docs} documents · {p.members} members · {p.updated}</div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* AI activity */}
        <Card>
          <div className="border-b border-slate-100 px-5 py-3.5 text-sm font-bold text-slate-900">AI Activity</div>
          <div className="divide-y divide-slate-50">
            {activity.slice(0, 8).map((a) => {
              const Icon = ACT_ICON[a.icon]
              return (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                  <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', ACT_COLOR[a.icon])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12.5px] leading-snug text-slate-700">{a.text}</div>
                    <div className="mt-0.5 text-[10.5px] text-slate-400">{a.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

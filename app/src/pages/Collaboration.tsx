import { useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import { cn } from '@/lib/utils'
import { UserPlus, Crown, Pencil, Eye, MessageSquareWarning, GitCompareArrows, RotateCcw, Share2 } from 'lucide-react'

const MEMBERS = [
  { name: 'Aadesh Bhamare', email: 'aadesh@trinity.edu', role: 'Owner', color: '#6366f1' },
  { name: 'Rahul Patil', email: 'rahul@trinity.edu', role: 'Editor', color: '#0ea5e9' },
  { name: 'Rohan Shinde', email: 'rohan@trinity.edu', role: 'Editor', color: '#8b5cf6' },
  { name: 'Prof. S. Kulkarni', email: 'guide@trinity.edu', role: 'Reviewer', color: '#f59e0b' },
  { name: 'Om Jadhav', email: 'om@trinity.edu', role: 'Viewer', color: '#10b981' },
]

const ROLE_ICON: Record<string, typeof Crown> = { Owner: Crown, Editor: Pencil, Reviewer: MessageSquareWarning, Viewer: Eye }

const VERSIONS = [
  { v: 'v14', note: 'AI edit: references → IEEE', by: 'You', time: '40 min ago', current: true },
  { v: 'v13', note: 'Chapter 6 results updated', by: 'Rahul Patil', time: '3 hours ago', current: false },
  { v: 'v12', note: 'Abstract rewritten (AI)', by: 'You', time: 'Yesterday', current: false },
  { v: 'v11', note: 'Certificate page approved', by: 'Prof. S. Kulkarni', time: 'Yesterday', current: false },
]

export default function Collaboration() {
  const [versions, setVersions] = useState(VERSIONS)
  const [invited, setInvited] = useState(false)

  const restore = (v: string) => {
    setVersions((vs) => vs.map((x) => ({ ...x, current: x.v === v })))
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Collaboration"
        subtitle="Share projects, manage roles, comment, compare and restore versions"
        actions={
          <button onClick={() => setInvited(true)} className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110">
            <UserPlus className="h-4 w-4" /> {invited ? 'Invite sent ✓' : 'Invite members'}
          </button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
            <div className="text-sm font-bold text-slate-900">Project members — MailTrace AI</div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-200"><Share2 className="h-3.5 w-3.5" /> Share project</button>
          </div>
          <div className="divide-y divide-slate-50">
            {MEMBERS.map((m) => {
              const Icon = ROLE_ICON[m.role]
              return (
                <div key={m.email} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white" style={{ backgroundColor: m.color }}>
                    {m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-slate-800">{m.name}</div>
                    <div className="text-[11px] text-slate-400">{m.email}</div>
                  </div>
                  <span className={cn('ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    m.role === 'Owner' ? 'bg-amber-100 text-amber-700' : m.role === 'Editor' ? 'bg-indigo-100 text-indigo-700' : m.role === 'Reviewer' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600')}>
                    <Icon className="h-3 w-3" />{m.role}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="border-b border-slate-100 px-5 py-3.5 text-sm font-bold text-slate-900">Version history</div>
            <div className="divide-y divide-slate-50">
              {versions.map((v) => (
                <div key={v.v} className="flex items-center gap-3 px-5 py-3">
                  <span className={cn('rounded-lg px-2 py-1 font-mono text-[11px] font-bold', v.current ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600')}>{v.v}</span>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-medium text-slate-800">{v.note}</div>
                    <div className="text-[10.5px] text-slate-400">{v.by} · {v.time}</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <button className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-indigo-200 hover:text-indigo-600" title="Compare with current"><GitCompareArrows className="h-3.5 w-3.5" /></button>
                    {!v.current && (
                      <button onClick={() => restore(v.v)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[10.5px] font-semibold text-slate-500 hover:border-indigo-200 hover:text-indigo-600">
                        <RotateCcw className="h-3 w-3" /> Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-bold text-slate-900">Suggestions & mentions</div>
            <div className="mt-3 space-y-2.5">
              {[
                { by: 'Prof. S. Kulkarni', text: '@Aadesh — suggested rewording in §1.2 Problem Statement', tag: 'Suggestion' },
                { by: 'Rahul Patil', text: '@Om — please review the testing chapter tables', tag: 'Mention' },
              ].map((s, i) => (
                <div key={i} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3">
                  <div>
                    <div className="text-[12px] font-semibold text-slate-800">{s.by}</div>
                    <div className="mt-0.5 text-[12px] text-slate-600">{s.text}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">{s.tag}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

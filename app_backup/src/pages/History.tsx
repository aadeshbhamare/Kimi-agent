import { useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import { HISTORY } from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import { RotateCcw, Filter } from 'lucide-react'

const KINDS = ['All', 'AI Action', 'Version', 'Generation', 'Edit', 'Export', 'Validation', 'Bulk Job']
const KIND_COLOR: Record<string, string> = {
  'AI Action': 'bg-indigo-100 text-indigo-700', Version: 'bg-slate-100 text-slate-600', Generation: 'bg-violet-100 text-violet-700',
  Edit: 'bg-sky-100 text-sky-700', Export: 'bg-emerald-100 text-emerald-700', Validation: 'bg-amber-100 text-amber-700', 'Bulk Job': 'bg-fuchsia-100 text-fuchsia-700',
}

export default function History() {
  const { activity } = useApp()
  const [kind, setKind] = useState('All')
  const rows = HISTORY.filter((h) => kind === 'All' || h.kind === kind)

  return (
    <div className="animate-fade-up">
      <PageHeader title="History" subtitle="AI actions, versions, generations, exports and validation reports — with restore" />
      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3">
          <Filter className="h-4 w-4 text-slate-400" />
          {KINDS.map((k) => (
            <button key={k} onClick={() => setKind(k)} className={cn('rounded-full px-3 py-1 text-[11.5px] font-medium', kind === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>{k}</button>
          ))}
        </div>
        <div className="divide-y divide-slate-50">
          {rows.map((h) => (
            <div key={h.id} className="flex items-center gap-3 px-5 py-3.5">
              <span className={cn('rounded-full px-2.5 py-1 text-[10.5px] font-semibold', KIND_COLOR[h.kind])}>{h.kind}</span>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-slate-800">{h.action}</div>
                <div className="text-[11px] text-slate-400">{h.target}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-[11.5px] text-slate-500">{h.user}</div>
                <div className="text-[10.5px] text-slate-400">{h.time}</div>
              </div>
              {h.restorable && (
                <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:border-indigo-200 hover:text-indigo-600">
                  <RotateCcw className="h-3 w-3" /> Restore
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <div className="border-b border-slate-100 px-5 py-3.5 text-sm font-bold text-slate-900">Live session activity</div>
        <div className="divide-y divide-slate-50">
          {activity.slice(0, 6).map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="text-[13px] text-slate-700">{a.text}</span>
              <span className="ml-auto text-[11px] text-slate-400">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

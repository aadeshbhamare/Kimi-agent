import { useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Plus, Copy, Pencil, Share2, Trash2, Play, Layers } from 'lucide-react'

export default function Templates() {
  const { navigate, logActivity } = useApp()
  const [cat, setCat] = useState('All')
  const [created, setCreated] = useState<string[]>([])
  const rows = TEMPLATES.filter((t) => cat === 'All' || t.category === cat)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Templates"
        subtitle="College- and company-specific templates with pre-detected fields"
        actions={
          <button
            onClick={() => { setCreated((c) => [...c, `Custom Template ${c.length + 1}`]); logActivity('edit', 'New custom template created') }}
            className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Create Template
          </button>
        }
      />
      <div className="mb-4 flex flex-wrap gap-1.5">
        {TEMPLATE_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn('rounded-full px-3.5 py-1.5 text-xs font-medium transition', cat === c ? 'gradient-brand text-white shadow-lift' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200')}>{c}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((t) => (
          <Card key={t.id} className="group p-5 transition hover:shadow-lift">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50"><Layers className="h-5 w-5 text-indigo-600" /></div>
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">{t.engine}</span>
            </div>
            <div className="mt-3 text-sm font-bold text-slate-900">{t.name}</div>
            <div className="mt-0.5 text-xs text-slate-500">{t.category} · {t.fields} fields · used {t.used}×</div>
            <div className="mt-4 flex gap-1.5">
              <button onClick={() => navigate('workflow')} className="flex-1 rounded-lg gradient-brand py-1.5 text-[11.5px] font-semibold text-white hover:brightness-110 inline-flex items-center justify-center gap-1"><Play className="h-3 w-3" /> Use</button>
              {[Copy, Pencil, Share2, Trash2].map((Icon, i) => (
                <button key={i} className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-indigo-200 hover:text-indigo-600"><Icon className="h-3.5 w-3.5" /></button>
              ))}
            </div>
          </Card>
        ))}
        {created.map((c) => (
          <Card key={c} className="border-dashed p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50"><Plus className="h-5 w-5 text-violet-500" /></div>
            <div className="mt-3 text-sm font-bold text-slate-900">{c}</div>
            <div className="mt-0.5 text-xs text-slate-500">Custom · 0 fields · draft</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

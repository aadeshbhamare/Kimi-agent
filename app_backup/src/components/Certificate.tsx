import { CERT_FIELDS, type CertRecord, type FitResult } from '@/lib/data'
import { cn } from '@/lib/utils'

// CSS-drawn certificate. Field overlays show AI-detected areas during mapping.
export function CertificateView({
  record, fit, showOverlays, small,
}: {
  record?: Partial<CertRecord>
  fit?: FitResult
  showOverlays?: boolean
  small?: boolean
}) {
  const fontSize = fit ? fit.fontSize : 34
  const scaled = small ? fontSize * 0.32 : fontSize * 0.55
  return (
    <div className={cn('relative w-full overflow-hidden rounded-lg border-4 border-double border-violet-300 bg-gradient-to-br from-white via-indigo-50/40 to-violet-50/60 text-center', small ? 'p-3' : 'p-6 sm:p-8')} style={{ aspectRatio: '842/595' }}>
      {/* corner decorations */}
      <div className="absolute left-2 top-2 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-violet-400" />
      <div className="absolute right-2 top-2 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-violet-400" />
      <div className="absolute bottom-2 left-2 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-violet-400" />
      <div className="absolute bottom-2 right-2 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-violet-400" />

      <div className={cn('font-semibold uppercase tracking-[0.22em] text-violet-500', small ? 'text-[6px]' : 'text-[10px] sm:text-xs')}>
        {record?.college ?? 'Trinity College of Engineering'}
      </div>
      <div className={cn('font-bold text-slate-900', small ? 'mt-0.5 text-[10px]' : 'mt-1 text-lg sm:text-2xl')}>Certificate of Achievement</div>
      <div className={cn('text-slate-500', small ? 'text-[5.5px]' : 'mt-1 text-[10px] sm:text-xs')}>This certificate is proudly presented to</div>

      {/* Name area */}
      <div className={cn('relative mx-auto', small ? 'mt-1' : 'mt-2 sm:mt-3', showOverlays && 'rounded ring-2 ring-indigo-400 ring-offset-1 bg-indigo-50/50')}>
        <div className="font-serif font-bold text-indigo-800 underline decoration-indigo-200 underline-offset-4 leading-tight" style={{ fontSize: `${scaled}px` }}>
          {record?.name ?? 'Recipient Name'}
        </div>
        {showOverlays && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-indigo-600 px-1 text-[8px] font-bold text-white">Name</span>}
      </div>

      <div className={cn('mx-auto text-slate-600', small ? 'mt-0.5 max-w-[90%] text-[5.5px]' : 'mt-2 max-w-md text-[10px] sm:text-xs', showOverlays && 'rounded ring-2 ring-violet-400 bg-violet-50/50')}>
        {record?.achievement ?? 'Achievement title'}
      </div>

      <div className={cn('flex items-end justify-between text-slate-400', small ? 'mt-2 text-[5px]' : 'mt-6 text-[9px] sm:text-[11px]')}>
        <span className={cn(showOverlays && 'rounded ring-2 ring-amber-400 bg-amber-50 px-0.5')}>{record?.certNumber ?? 'TRINITY-2026-001'}</span>
        <span className={cn(showOverlays && 'rounded ring-2 ring-emerald-400 bg-emerald-50 px-0.5')}>Date: {record?.date ?? '25 May 2026'}</span>
      </div>
      {fit && fit.status !== 'normal' && (
        <div className={cn('absolute right-2 top-2 rounded-full px-1.5 py-0.5 font-bold', small ? 'text-[5px]' : 'text-[9px]',
          fit.status === 'adaptive' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700')}>
          {fit.status === 'adaptive' ? 'Adaptive fit' : 'Review'}
        </div>
      )}
    </div>
  )
}

export { CERT_FIELDS }

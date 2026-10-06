import { CERT_FIELDS, type CertRecord, type FitResult, CERT_TEMPLATES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Lock, Unlock, Award, CheckCircle, Image as ImageIcon, ShieldCheck } from 'lucide-react'

export interface CertificateViewProps {
  record?: Partial<CertRecord>
  fit?: FitResult
  showOverlays?: boolean
  showDesignLock?: boolean
  activeFieldHighlight?: string | null
  templateId?: string
  small?: boolean
  customImageUrl?: string | null
  nameYPercent?: number
  nameFontSizeScale?: number
}

export function CertificateView({
  record,
  fit,
  showOverlays,
  showDesignLock,
  activeFieldHighlight,
  templateId = 'academic',
  small,
  customImageUrl,
  nameYPercent = 41,
  nameFontSizeScale = 1,
}: CertificateViewProps) {
  const template = CERT_TEMPLATES.find((t) => t.id === templateId) ?? CERT_TEMPLATES[0]
  const fontSize = (fit ? fit.fontSize : 34) * nameFontSizeScale
  const scaled = small ? fontSize * 0.32 : fontSize * 0.55

  const isDark = template.id === 'hackathon' && !customImageUrl
  const isGold = template.id === 'executive' && !customImageUrl

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border-4 text-center transition-all select-none',
        customImageUrl
          ? 'border-indigo-400 bg-slate-900 shadow-xl'
          : template.id === 'academic' && 'border-double border-indigo-400 bg-gradient-to-br from-white via-indigo-50/40 to-violet-50/60 text-slate-900',
        !customImageUrl && template.id === 'hackathon' && 'border-cyan-500 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white shadow-2xl',
        !customImageUrl && template.id === 'executive' && 'border-amber-400 bg-gradient-to-br from-amber-50/60 via-white to-amber-100/40 text-slate-900',
        !customImageUrl && template.id === 'research' && 'border-emerald-500 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40 text-slate-900',
        small ? 'p-2' : 'p-6 sm:p-8'
      )}
      style={{ aspectRatio: '842/595' }}
    >
      {/* --------------------------------------------------------------------- */}
      {/* 100% ORIGINAL TEMPLATE IMAGE: Preserved completely untouched */}
      {/* --------------------------------------------------------------------- */}
      {customImageUrl ? (
        <>
          <img
            src={customImageUrl}
            alt="Original Uploaded Certificate Template"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none z-0"
          />
          {/* Subtle indicator tag */}
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-emerald-950/85 backdrop-blur-xs px-2 py-0.5 text-[8.5px] font-bold text-emerald-300 border border-emerald-500/40 shadow-xs">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>ORIGINAL TEMPLATE PRESERVED · 0% LOSS</span>
          </div>
        </>
      ) : (
        <>
          {/* Corner Ornaments (Design Lock: Frozen) */}
          <div className={cn('absolute left-2.5 top-2.5 h-6 w-6 rounded-tl-lg border-l-2 border-t-2', isDark ? 'border-cyan-400' : isGold ? 'border-amber-500' : 'border-indigo-400')} />
          <div className={cn('absolute right-2.5 top-2.5 h-6 w-6 rounded-tr-lg border-r-2 border-t-2', isDark ? 'border-cyan-400' : isGold ? 'border-amber-500' : 'border-indigo-400')} />
          <div className={cn('absolute bottom-2.5 left-2.5 h-6 w-6 rounded-bl-lg border-b-2 border-l-2', isDark ? 'border-cyan-400' : isGold ? 'border-amber-500' : 'border-indigo-400')} />
          <div className={cn('absolute bottom-2.5 right-2.5 h-6 w-6 rounded-br-lg border-b-2 border-r-2', isDark ? 'border-cyan-400' : isGold ? 'border-amber-500' : 'border-indigo-400')} />

          {/* Design Lock Indicator Banners */}
          {showDesignLock && (
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-violet-900/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white">
              <Lock className="h-3 w-3 text-emerald-400" />
              <span>DESIGN LOCKED · BORDER & LOGO IMMUTABLE</span>
            </div>
          )}

          {/* Institution / College */}
          <div
            className={cn(
              'relative mx-auto font-semibold uppercase tracking-[0.22em] transition-all',
              isDark ? 'text-cyan-400' : isGold ? 'text-amber-700' : 'text-indigo-600',
              small ? 'text-[6px]' : 'text-[10.5px] sm:text-xs',
              activeFieldHighlight === 'college' && 'ring-2 ring-sky-400 rounded bg-sky-50/70'
            )}
          >
            {record?.college ?? 'Trinity College of Engineering'}
            {showOverlays && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-sky-600 px-1 text-[7px] font-bold text-white">
                College
              </span>
            )}
          </div>

          {/* Header title (Locked) */}
          <div className={cn('font-bold tracking-tight', small ? 'mt-0.5 text-[10px]' : 'mt-1 text-lg sm:text-2xl', isDark ? 'text-white' : 'text-slate-900')}>
            {template.id === 'hackathon' ? 'CERTIFICATE OF EXCELLENCE' : 'Certificate of Achievement'}
          </div>

          <div className={cn('text-slate-500', isDark && 'text-slate-400', small ? 'text-[5.5px]' : 'mt-1 text-[10px] sm:text-xs')}>
            This certificate is proudly presented to
          </div>
        </>
      )}

      {/* Recipient Name Area (Dynamic / Adaptive) */}
      <div
        className={cn(
          'relative z-10 mx-auto max-w-[85%] transition-all',
          customImageUrl ? 'absolute left-1/2 -translate-x-1/2 w-[85%]' : small ? 'mt-1' : 'mt-2 sm:mt-3',
          showOverlays && 'rounded ring-2 ring-indigo-500 ring-offset-1 bg-indigo-50/60',
          showDesignLock && 'rounded border border-dashed border-indigo-400 bg-indigo-50/30'
        )}
        style={customImageUrl ? { top: `${nameYPercent}%` } : undefined}
      >
        {showDesignLock && (
          <span className="absolute -top-2.5 right-1 inline-flex items-center gap-0.5 rounded bg-indigo-600 px-1 py-0.2 text-[7px] font-semibold text-white">
            <Unlock className="h-2 w-2" /> DYNAMIC FIELD
          </span>
        )}
        <div
          className={cn(
            'font-serif font-bold leading-tight tracking-tight transition-all',
            customImageUrl
              ? 'text-indigo-950 underline decoration-indigo-400/60'
              : isDark
              ? 'text-cyan-200 decoration-cyan-500/40'
              : isGold
              ? 'text-amber-950 decoration-amber-300'
              : 'text-indigo-900 decoration-indigo-200 underline underline-offset-4'
          )}
          style={{
            fontSize: `${scaled}px`,
            letterSpacing: fit?.letterSpacing ? `${fit.letterSpacing}px` : undefined,
          }}
        >
          {fit?.lines && fit.lines > 1 ? (
            <div>
              <div>{record?.name?.split(' ').slice(0, Math.ceil((record.name?.split(' ').length || 2) / 2)).join(' ')}</div>
              <div>{record?.name?.split(' ').slice(Math.ceil((record.name?.split(' ').length || 2) / 2)).join(' ')}</div>
            </div>
          ) : (
            record?.name ?? 'Recipient Name'
          )}
        </div>
        {showOverlays && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-indigo-600 px-1 text-[8px] font-bold text-white">
            Name (Adaptive)
          </span>
        )}
      </div>

      {/* Achievement / Award */}
      <div
        className={cn(
          'relative z-10 mx-auto transition-all',
          customImageUrl ? 'absolute left-1/2 -translate-x-1/2 w-[85%] text-slate-800' : isDark ? 'text-slate-300' : 'text-slate-700',
          small ? 'mt-0.5 max-w-[90%] text-[5.5px]' : 'mt-2 max-w-md text-[10px] sm:text-xs',
          showOverlays && 'rounded ring-2 ring-violet-400 bg-violet-50/50',
          activeFieldHighlight === 'achievement' && 'ring-2 ring-violet-500 rounded bg-violet-50/70'
        )}
        style={customImageUrl ? { top: `${nameYPercent + 14}%` } : undefined}
      >
        {record?.achievement ?? 'First Rank — National Hackathon 2026'}
        {showOverlays && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-violet-600 px-1 text-[7px] font-bold text-white">
            Achievement
          </span>
        )}
      </div>

      {/* Rank distinction badge */}
      {record?.rank && (
        <div
          className={cn(
            'relative z-10 mx-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold',
            customImageUrl && 'absolute left-1/2 -translate-x-1/2 bg-indigo-900/80 text-white',
            small ? 'mt-0.5 text-[5px]' : 'mt-1.5 text-[9px] sm:text-[10px]',
            !customImageUrl && isDark ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700' : 'bg-indigo-100 text-indigo-700'
          )}
          style={customImageUrl ? { top: `${nameYPercent + 22}%` } : undefined}
        >
          <Award className="h-2.5 w-2.5" /> Rank: {record.rank}
        </div>
      )}

      {/* Default Signatures & Seal (Only when not using custom image) */}
      {!customImageUrl && !small && (
        <div className="mt-4 flex items-center justify-between px-6 text-slate-500">
          <div className="text-center">
            <div className="mx-auto h-0.5 w-24 bg-slate-300" />
            <div className="mt-1 text-[9px] font-semibold text-slate-700">Authorized Signature</div>
            <div className="text-[8px] text-slate-400">Program Director</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-400 bg-indigo-50/70 text-[8px] font-bold text-indigo-800 shadow-xs">
              SEAL
            </div>
          </div>

          <div className="text-center">
            <div className="mx-auto h-0.5 w-24 bg-slate-300" />
            <div className="mt-1 text-[9px] font-semibold text-slate-700">Principal / Dean</div>
            <div className="text-[8px] text-slate-400">Academic Council</div>
          </div>
        </div>
      )}

      {/* Metadata footer */}
      <div
        className={cn(
          'relative z-10 flex items-end justify-between font-mono',
          customImageUrl ? 'absolute bottom-2.5 left-4 right-4 text-[9px] text-slate-700 font-bold' : isDark ? 'text-slate-500' : 'text-slate-400',
          small ? 'mt-2 text-[5px]' : 'mt-4 text-[9px] sm:text-[11px]'
        )}
      >
        <span className={cn(showOverlays && 'rounded ring-2 ring-amber-400 bg-amber-50 px-0.5 text-slate-700')}>
          {record?.certNumber ?? 'TRINITY-2026-001'}
        </span>
        <span className={cn(showOverlays && 'rounded ring-2 ring-emerald-400 bg-emerald-50 px-0.5 text-slate-700')}>
          Date: {record?.date ?? '25 May 2026'}
        </span>
      </div>

      {/* Fit status badge */}
      {fit && fit.status !== 'normal' && (
        <div
          className={cn(
            'absolute right-2 top-2 z-20 rounded-full px-1.5 py-0.5 font-bold shadow-xs',
            small ? 'text-[5px]' : 'text-[9px]',
            fit.status === 'adaptive' ? 'bg-sky-100 text-sky-700 border border-sky-300' : 'bg-amber-100 text-amber-700 border border-amber-300'
          )}
        >
          {fit.status === 'adaptive' ? 'Adaptive fit' : 'Review'}
        </div>
      )}
    </div>
  )
}

export { CERT_FIELDS }

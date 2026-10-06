import { cn } from '@/lib/utils'
import { QrCode, Database, Smartphone, Sparkles, Undo2 } from 'lucide-react'

export interface FigureConfig {
  caption?: string
  border?: boolean
  scale?: number
  aiTransformed?: boolean // default: false (Original Uploaded Document Style)
}

export function DocumentFigure({
  kind,
  figNum,
  title,
  caption,
  config,
  onClick,
  onToggleAiTransform,
  isSelected,
}: {
  kind: 'usecase' | 'flowchart' | 'login_screens' | 'booking_grid' | 'booking_receipt' | 'firebase_store'
  figNum: string
  title: string
  caption: string
  config?: FigureConfig
  onClick?: () => void
  onToggleAiTransform?: (transformed: boolean) => void
  isSelected?: boolean
}) {
  const finalCaption = config?.caption ?? caption
  const hasBorder = config?.border ?? true
  const isAiTransformed = Boolean(config?.aiTransformed)

  return (
    <div
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
      className={cn(
        'group relative my-3 flex flex-col items-center justify-center transition-all',
        onClick && 'cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2 rounded-xl p-1.5',
        isSelected && 'ring-2 ring-indigo-600 ring-offset-2 bg-indigo-50/40 rounded-xl'
      )}
    >
      {/* Top Controls: Mode Status & Revert / Transform Toggle Button */}
      <div className="mb-1.5 flex w-full items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[8.5px] font-bold tracking-tight uppercase shadow-xs transition-colors',
              isAiTransformed
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-slate-100 text-slate-700 border border-slate-300'
            )}
          >
            {isAiTransformed ? (
              <>
                <Sparkles className="h-2.5 w-2.5 text-purple-600" />
                AI Image Style
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Original Document Image (As-Is)
              </>
            )}
          </span>
        </div>

        {/* Action Toggle / Revert Button */}
        <div className="flex items-center gap-1">
          {isAiTransformed ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleAiTransform?.(false)
              }}
              title="Revert back to original uploaded document image"
              className="inline-flex items-center gap-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 text-[9px] font-bold text-amber-800 transition shadow-xs active:scale-95"
            >
              <Undo2 className="h-2.5 w-2.5 text-amber-600" />
              <span>Revert to Original</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleAiTransform?.(true)
              }}
              title="Transform this image into AI modernized vector style"
              className="inline-flex items-center gap-1 rounded-md bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 text-[9px] font-semibold text-indigo-700 transition shadow-xs active:scale-95"
            >
              <Sparkles className="h-2.5 w-2.5 text-indigo-600" />
              <span>Transform AI Style</span>
            </button>
          )}
        </div>
      </div>

      {/* Figure Frame / Canvas */}
      <div
        className={cn(
          'w-full overflow-hidden rounded bg-white p-2 text-center transition-all',
          hasBorder && 'border border-slate-300 shadow-xs'
        )}
      >
        {isAiTransformed ? (
          // ── AI Transformed Visuals (Modernized Vector/Render)
          <>
            {kind === 'usecase' && <AiUseCaseDiagramVisual />}
            {kind === 'flowchart' && <AiFlowChartDiagramVisual />}
            {kind === 'login_screens' && <AiLoginScreensVisual />}
            {kind === 'booking_grid' && <AiBookingGridVisual />}
            {kind === 'booking_receipt' && <AiBookingReceiptVisual />}
            {kind === 'firebase_store' && <AiFirebaseStoreVisual />}
          </>
        ) : (
          // ── Original Document Image (Authentic Uploaded / As-Is Diagram Style)
          <>
            {kind === 'usecase' && <OriginalUseCaseDiagramVisual />}
            {kind === 'flowchart' && <OriginalFlowChartDiagramVisual />}
            {kind === 'login_screens' && <OriginalLoginScreensVisual />}
            {kind === 'booking_grid' && <OriginalBookingGridVisual />}
            {kind === 'booking_receipt' && <OriginalBookingReceiptVisual />}
            {kind === 'firebase_store' && <OriginalFirebaseStoreVisual />}
          </>
        )}
      </div>

      {/* Figure Caption */}
      <p className="mt-1.5 text-center text-[10px] font-semibold text-slate-800">
        <span className="font-bold">{figNum}:</span> {finalCaption || title}
      </p>
    </div>
  )
}

// ============================================================================
// 1. ORIGINAL UPLOADED DIAGRAM STYLES (Authentic Monochrome/Engineering Format)
// ============================================================================

function OriginalUseCaseDiagramVisual() {
  return (
    <div className="relative mx-auto my-1 max-w-[420px] border-2 border-slate-800 bg-white p-2.5 text-[8px] font-mono text-slate-900">
      <div className="mb-2 text-center font-bold tracking-tight uppercase border-b border-slate-800 pb-1">
        Figure 4.1: Use Case Diagram — Smart Parking System (Original Scan)
      </div>

      {/* UML Grid */}
      <div className="grid grid-cols-[80px_1fr_80px] gap-2 items-center">
        {/* Left Actor: Driver */}
        <div className="flex flex-col items-center justify-center p-1 border border-dashed border-slate-700 bg-slate-50">
          <svg className="h-8 w-6 stroke-slate-900" viewBox="0 0 24 36" fill="none" strokeWidth="2">
            <circle cx="12" cy="6" r="4" />
            <line x1="12" y1="10" x2="12" y2="24" />
            <line x1="2" y1="16" x2="22" y2="16" />
            <line x1="12" y1="24" x2="4" y2="34" />
            <line x1="12" y1="24" x2="20" y2="34" />
          </svg>
          <span className="mt-1 font-bold text-center text-[7.5px] leading-tight">Actor: Driver (User)</span>
        </div>

        {/* Center System Boundary Box with Ellipse Use Cases */}
        <div className="border border-slate-900 p-2 space-y-1 bg-white">
          <div className="text-[7px] text-center font-bold text-slate-600 uppercase border-b border-slate-300 pb-0.5">
            System Boundary: Smart Parking Management
          </div>
          <div className="rounded-full border border-slate-800 px-2 py-0.5 text-center text-[7.5px]">
            (UC1: User Login / Authentication)
          </div>
          <div className="rounded-full border border-slate-800 px-2 py-0.5 text-center text-[7.5px]">
            (UC2: View Real-Time Slot Matrix)
          </div>
          <div className="rounded-full border border-slate-800 px-2 py-0.5 text-center text-[7.5px]">
            (UC3: Reserve Slot & Generate Token)
          </div>
          <div className="rounded-full border border-slate-800 px-2 py-0.5 text-center text-[7.5px]">
            (UC4: Auto Cancellation on 15m Grace)
          </div>
          <div className="rounded-full border border-slate-800 px-2 py-0.5 text-center text-[7.5px]">
            (UC5: UPI Payment & Receipt)
          </div>
        </div>

        {/* Right Actor: Admin / Guard */}
        <div className="flex flex-col items-center justify-center p-1 border border-dashed border-slate-700 bg-slate-50">
          <svg className="h-8 w-6 stroke-slate-900" viewBox="0 0 24 36" fill="none" strokeWidth="2">
            <circle cx="12" cy="6" r="4" />
            <line x1="12" y1="10" x2="12" y2="24" />
            <line x1="2" y1="16" x2="22" y2="16" />
            <line x1="12" y1="24" x2="4" y2="34" />
            <line x1="12" y1="24" x2="20" y2="34" />
          </svg>
          <span className="mt-1 font-bold text-center text-[7.5px] leading-tight">Actor: Parking Guard</span>
        </div>
      </div>
      <div className="mt-2 text-center text-[7px] text-slate-500 italic">
        [Original scanned technical diagram preserved as uploaded without AI filtering]
      </div>
    </div>
  )
}

function OriginalFlowChartDiagramVisual() {
  return (
    <div className="mx-auto my-1 max-w-[400px] border border-slate-800 bg-white p-2.5 text-[8px] font-mono text-slate-900">
      <div className="mb-2 text-center font-bold uppercase border-b border-slate-300 pb-1">
        Figure 4.2: System Flowchart (Original Engineering Draft)
      </div>
      <div className="flex flex-col items-center space-y-1">
        {/* Terminal START */}
        <div className="rounded-full border-2 border-slate-900 px-4 py-0.5 font-bold uppercase">
          [ START ]
        </div>
        <div className="h-2 w-px bg-slate-900" />

        {/* Input Process */}
        <div className="border border-slate-900 px-3 py-1 text-center bg-slate-50">
          Input: Driver enters destination / mall area
        </div>
        <div className="h-2 w-px bg-slate-900" />

        {/* Decision Diamond */}
        <div className="relative flex h-14 w-28 items-center justify-center text-center text-[7px] font-bold">
          <div className="absolute inset-0 rotate-45 border-2 border-slate-900 bg-white" />
          <span className="relative z-10 px-2 leading-tight">Slot Free?</span>
        </div>
        <div className="flex w-full justify-around text-[7.5px] font-bold">
          <span>YES ↓</span>
          <span className="text-slate-500">NO → (Display Waitlist)</span>
        </div>

        {/* Allocate Token */}
        <div className="border border-slate-900 px-3 py-1 text-center bg-slate-50">
          Process: Allocate Slot ID + Generate QR Token + Start 15m Timer
        </div>
        <div className="h-2 w-px bg-slate-900" />

        {/* Terminal STOP */}
        <div className="rounded-full border-2 border-slate-900 px-4 py-0.5 font-bold uppercase">
          [ STOP / CHECK-IN COMPLETED ]
        </div>
      </div>
    </div>
  )
}

function OriginalLoginScreensVisual() {
  return (
    <div className="mx-auto my-1 flex max-w-[380px] justify-center gap-3 border border-slate-400 bg-slate-100 p-2 text-[7.5px]">
      {/* Screen 1 */}
      <div className="w-36 rounded-md border-2 border-slate-700 bg-white p-2 shadow-xs">
        <div className="mb-1 text-center font-bold text-slate-800 border-b border-slate-200 pb-0.5">
          Mobile App: User Login
        </div>
        <div className="my-1.5 space-y-1">
          <div className="border border-slate-400 bg-slate-50 px-1 py-0.5 text-slate-500">Username / Phone</div>
          <div className="border border-slate-400 bg-slate-50 px-1 py-0.5 text-slate-500">Password (••••••)</div>
          <div className="rounded bg-slate-800 py-1 text-center font-bold text-white uppercase text-[6.5px]">
            Login
          </div>
        </div>
        <div className="text-[6px] text-center text-slate-400">Version 1.0 (Android Build)</div>
      </div>

      {/* Screen 2 */}
      <div className="w-36 rounded-md border-2 border-slate-700 bg-white p-2 shadow-xs">
        <div className="mb-1 text-center font-bold text-slate-800 border-b border-slate-200 pb-0.5">
          Admin Portal Login
        </div>
        <div className="my-1.5 space-y-1">
          <div className="border border-slate-400 bg-slate-50 px-1 py-0.5 text-slate-500">Admin ID</div>
          <div className="border border-slate-400 bg-slate-50 px-1 py-0.5 text-slate-500">Security Key</div>
          <div className="rounded bg-slate-800 py-1 text-center font-bold text-white uppercase text-[6.5px]">
            Authenticate
          </div>
        </div>
        <div className="text-[6px] text-center text-slate-400">Security Console</div>
      </div>
    </div>
  )
}

function OriginalBookingGridVisual() {
  return (
    <div className="mx-auto my-1 max-w-[390px] border border-slate-800 bg-white p-2 text-[7.5px] font-mono">
      <div className="mb-1 text-center font-bold uppercase border-b border-slate-300 pb-0.5">
        Figure 6.3: Parking Slot Allocation Matrix (Original Capture)
      </div>
      <div className="grid grid-cols-6 gap-1 my-1.5 text-center">
        {Array.from({ length: 18 }).map((_, i) => {
          const occ = [2, 5, 8, 11, 14].includes(i)
          return (
            <div
              key={i}
              className={cn(
                'border border-slate-600 py-1 font-bold',
                occ ? 'bg-slate-300 text-slate-900 line-through' : 'bg-white text-slate-900'
              )}
            >
              K2-{i + 1}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[6.5px] text-slate-600 border-t border-slate-200 pt-0.5">
        <span>[White]: Available Slot</span>
        <span>[Strikethrough]: Occupied Vehicle</span>
      </div>
    </div>
  )
}

function OriginalBookingReceiptVisual() {
  return (
    <div className="mx-auto my-1 max-w-[350px] border border-slate-800 bg-white p-2 text-left font-mono text-[7.5px] leading-tight">
      <div className="border-b border-dashed border-slate-800 pb-1 text-center font-bold uppercase">
        === SMARTPARK SYSTEM TICKET ===
      </div>
      <div className="py-1 space-y-0.5">
        <div>BOOKING TOKEN: #SP-mhdot8r-B7X00</div>
        <div>VEHICLE NO   : MH 12 DE 3537</div>
        <div>ASSIGNED SLOT: K2-44, K2-45</div>
        <div>PARKING SITE : Kumar Pacific Mall</div>
        <div>TIME VALID   : 15 MIN GRACE PERIOD</div>
      </div>
      <div className="border-t border-dashed border-slate-800 pt-1 text-center text-[7px] text-slate-600">
        * PLEASE SCAN AT GATE ENTRANCE BARRIER *
      </div>
    </div>
  )
}

function OriginalFirebaseStoreVisual() {
  return (
    <div className="mx-auto my-1 max-w-[390px] border border-slate-800 bg-white p-2 font-mono text-[7px] text-left">
      <div className="border-b border-slate-400 pb-0.5 font-bold uppercase text-slate-800">
        Figure 6.5: Database Records Hierarchy (Original DB View)
      </div>
      <pre className="mt-1 text-slate-800 whitespace-pre">
{`root/
├── users/
│   └── 9822001122/
│       ├── name: "Aadesh Bhamare"
│       └── vehicle: "MH 12 DE 3537"
└── active_tokens/
    └── SP-mhdot8r-B7X00/
        ├── slot: "K2-44"
        ├── status: "ALLOCATED"
        └── timestamp: 1728182400`}
      </pre>
    </div>
  )
}

// ============================================================================
// 2. AI TRANSFORMED DIAGRAM STYLES (Modernized Vector / Gradient Render)
// ============================================================================

function AiUseCaseDiagramVisual() {
  return (
    <div className="relative mx-auto my-1 flex max-w-[420px] flex-col items-center border border-indigo-200 bg-gradient-to-b from-indigo-50/70 to-purple-50/40 p-3 text-[8.5px] rounded-lg shadow-sm">
      <div className="mb-2 font-bold text-indigo-900 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-indigo-600" />
        AI Architecture Vision · Use Case System
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        <div className="flex flex-col gap-1.5 rounded-lg border border-indigo-200 bg-white/90 p-2 text-left shadow-xs">
          <div className="flex items-center gap-1 font-bold text-indigo-800">
            <Smartphone className="h-3 w-3" /> Driver / User
          </div>
          <div className="rounded bg-indigo-50/80 px-1.5 py-0.5 text-[8px] text-indigo-950 font-medium">User Login / Register</div>
          <div className="rounded bg-indigo-50/80 px-1.5 py-0.5 text-[8px] text-indigo-950 font-medium">View Live Slot Grid</div>
          <div className="rounded bg-indigo-50/80 px-1.5 py-0.5 text-[8px] text-indigo-950 font-medium">Check Slot Availability</div>
          <div className="rounded bg-indigo-50/80 px-1.5 py-0.5 text-[8px] text-indigo-950 font-medium">Generate Provisional Token</div>
        </div>

        <div className="flex flex-col items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/70 p-2 shadow-xs">
          <div className="font-bold text-emerald-900">Parking Engine</div>
          <div className="my-1 flex w-full flex-col gap-1">
            <div className="rounded bg-white p-1 text-center font-semibold text-emerald-700 shadow-xs text-[7.5px]">
              QR Check-in & Barrier
            </div>
            <div className="rounded bg-white p-1 text-center font-semibold text-amber-700 shadow-xs text-[7.5px]">
              Auto-Cancel Timer
            </div>
            <div className="rounded bg-white p-1 text-center font-semibold text-blue-700 shadow-xs text-[7.5px]">
              Park & Pay / UPI
            </div>
          </div>
          <span className="text-[7px] text-emerald-700 font-bold">Cloud Synced</span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-purple-200 bg-white/90 p-2 text-left shadow-xs">
          <div className="font-bold text-purple-900">Admin & Barrier</div>
          <div className="rounded bg-purple-50/80 px-1.5 py-0.5 text-[8px] text-purple-950 font-medium">Authorize Driver Pass</div>
          <div className="rounded bg-purple-50/80 px-1.5 py-0.5 text-[8px] text-purple-950 font-medium">Camera LPR Recognition</div>
          <div className="rounded bg-purple-50/80 px-1.5 py-0.5 text-[8px] text-purple-950 font-medium">Analytics & Revenue</div>
        </div>
      </div>
    </div>
  )
}

function AiFlowChartDiagramVisual() {
  const steps = [
    { title: 'Driver Requests Slot', sub: 'GPS check-in', color: 'bg-indigo-500' },
    { title: 'Available Slot?', sub: 'Algorithm check', color: 'bg-amber-500', isCheck: true },
    { title: 'Provisional Token Issued', sub: '15m countdown begins', color: 'bg-sky-500' },
    { title: 'Arrival & QR Scan', sub: 'At entry boom barrier', color: 'bg-violet-500' },
    { title: 'Check-in Confirmed', sub: 'Real-time billing', color: 'bg-emerald-500' },
  ]

  return (
    <div className="mx-auto my-1 flex max-w-[420px] flex-col items-center rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
      <div className="flex w-full items-center justify-between gap-1 text-[7.5px]">
        {steps.map((st, i) => (
          <div key={i} className="flex flex-1 flex-col items-center">
            <div className={cn('flex h-6 w-full items-center justify-center rounded px-1 font-bold text-white shadow-xs text-center leading-tight', st.color)}>
              {st.title}
            </div>
            <span className="mt-1 text-[7px] text-slate-500 text-center">{st.sub}</span>
            {i < steps.length - 1 && <span className="text-[9px] text-slate-400 font-bold mt-0.5">↓</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function AiLoginScreensVisual() {
  return (
    <div className="mx-auto my-1 flex max-w-[340px] items-center justify-center gap-3 rounded-lg border border-indigo-100 bg-indigo-50/30 p-2">
      <div className="w-28 rounded-lg border border-slate-300 bg-white p-2 shadow-sm text-[7px]">
        <div className="mb-1 font-bold text-indigo-700">Customer App</div>
        <div className="h-4 rounded bg-slate-100 mb-1" />
        <div className="h-4 rounded bg-slate-100 mb-1.5" />
        <div className="rounded bg-indigo-600 py-1 text-center font-bold text-white text-[6.5px]">
          Sign In
        </div>
      </div>
      <div className="w-28 rounded-lg border border-slate-300 bg-white p-2 shadow-sm text-[7px]">
        <div className="mb-1 font-bold text-purple-700">Admin Control</div>
        <div className="h-4 rounded bg-slate-100 mb-1" />
        <div className="h-4 rounded bg-slate-100 mb-1.5" />
        <div className="rounded bg-purple-600 py-1 text-center font-bold text-white text-[6.5px]">
          Manager Pass
        </div>
      </div>
    </div>
  )
}

function AiBookingGridVisual() {
  return (
    <div className="mx-auto my-1 max-w-[390px] rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-[7.5px]">
      <div className="mb-1 text-center font-bold text-slate-700">Kumar Pacific Mall · Smart Slot Matrix</div>
      <div className="grid grid-cols-6 gap-1 my-1 text-center">
        {Array.from({ length: 18 }).map((_, i) => {
          const occupied = [3, 7, 12, 14].includes(i)
          const selected = [15, 16].includes(i)
          return (
            <div
              key={i}
              className={cn(
                'rounded py-0.5 text-white font-semibold',
                selected ? 'bg-indigo-600 ring-1 ring-indigo-400 font-bold'
                  : occupied ? 'bg-rose-500' : 'bg-emerald-500'
              )}
            >
              K2-{i + 1}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AiBookingReceiptVisual() {
  return (
    <div className="mx-auto flex max-w-[340px] items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-2.5 text-left text-[8px]">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded bg-white p-1 border border-slate-200 shadow-xs">
        <QrCode className="h-8 w-8 text-slate-900" />
        <span className="text-[5.5px] font-bold text-emerald-700">VERIFIED</span>
      </div>
      <div className="flex-1 space-y-0.5">
        <div className="font-bold text-emerald-900">SmartPark Digital Pass</div>
        <div className="text-[7.5px] text-slate-700">ID: <span className="font-mono font-semibold">SP-mhdot8r-B7X00</span></div>
        <div className="text-[7.5px] text-slate-700">Vehicle: <span className="font-semibold">MH 12 DE 3537</span></div>
      </div>
    </div>
  )
}

function AiFirebaseStoreVisual() {
  return (
    <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900 p-2 text-left text-[7.5px] font-mono text-slate-300">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-400">
        <span className="flex items-center gap-1 font-sans font-bold text-amber-400">
          <Database className="h-3 w-3" /> Cloud Firestore Live
        </span>
        <span className="text-[7px] text-emerald-400">● Real-time</span>
      </div>
      <div className="mt-1 space-y-0.5">
        <div><span className="text-purple-400">bookingId:</span> "SP-mhdot8r-B7X00"</div>
        <div><span className="text-purple-400">status:</span> <span className="text-emerald-400">"Occupied"</span></div>
      </div>
    </div>
  )
}

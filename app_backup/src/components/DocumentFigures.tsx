import { cn } from '@/lib/utils'
import { QrCode, Database, Shield, Smartphone, ArrowRight } from 'lucide-react'

export interface FigureConfig {
  caption?: string
  border?: boolean
  scale?: number
}

export function DocumentFigure({
  kind,
  figNum,
  title,
  caption,
  config,
  onClick,
  isSelected,
}: {
  kind: 'usecase' | 'flowchart' | 'login_screens' | 'booking_grid' | 'booking_receipt' | 'firebase_store'
  figNum: string
  title: string
  caption: string
  config?: FigureConfig
  onClick?: () => void
  isSelected?: boolean
}) {
  const finalCaption = config?.caption ?? caption
  const hasBorder = config?.border ?? true

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
        onClick && 'cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2 rounded-xl p-1',
        isSelected && 'ring-2 ring-indigo-600 ring-offset-2 bg-indigo-50/50 rounded-xl'
      )}
    >
      {/* Floating badge for visibility */}
      <span className="pointer-events-none absolute -top-2.5 right-2 hidden rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow group-hover:block z-10">
        🖼️ {figNum} · Click to Edit Figure
      </span>

      {/* Figure Frame / Canvas */}
      <div
        className={cn(
          'w-full overflow-hidden rounded bg-white p-2 text-center transition-all',
          hasBorder && 'border border-slate-300 shadow-xs'
        )}
      >
        {kind === 'usecase' && <UseCaseDiagramVisual />}
        {kind === 'flowchart' && <FlowChartDiagramVisual />}
        {kind === 'login_screens' && <LoginScreensVisual />}
        {kind === 'booking_grid' && <BookingGridVisual />}
        {kind === 'booking_receipt' && <BookingReceiptVisual />}
        {kind === 'firebase_store' && <FirebaseStoreVisual />}
      </div>

      {/* Figure Caption */}
      <p className="mt-1.5 text-center text-[10px] font-semibold text-slate-800">
        <span className="font-bold">{figNum}:</span> {finalCaption || title}
      </p>
    </div>
  )
}

// ── 1. Figure 4.1: Use Case Diagram ──────────────────────────────────────────
function UseCaseDiagramVisual() {
  return (
    <div className="relative mx-auto my-1 flex max-w-[420px] flex-col items-center border border-slate-200 bg-slate-50/50 p-3 text-[8.5px]">
      <div className="mb-2 font-semibold text-slate-700">Use Case Architecture · System Overview</div>
      <div className="grid w-full grid-cols-3 gap-2">
        {/* Left: User actor & actions */}
        <div className="flex flex-col gap-1.5 rounded border border-indigo-200 bg-indigo-50/60 p-2 text-left">
          <div className="flex items-center gap-1 font-bold text-indigo-800">
            <Smartphone className="h-3 w-3" /> Driver / User
          </div>
          <div className="rounded bg-white px-1.5 py-0.5 text-[8px] text-slate-700 shadow-xs">User Login / Register</div>
          <div className="rounded bg-white px-1.5 py-0.5 text-[8px] text-slate-700 shadow-xs">View Live Slot Grid</div>
          <div className="rounded bg-white px-1.5 py-0.5 text-[8px] text-slate-700 shadow-xs">Check Slot Availability</div>
          <div className="rounded bg-white px-1.5 py-0.5 text-[8px] text-slate-700 shadow-xs">Generate Provisional Token</div>
        </div>

        {/* Center: System & Engine */}
        <div className="flex flex-col items-center justify-between rounded border border-emerald-200 bg-emerald-50/60 p-2">
          <div className="font-bold text-emerald-800">Parking Engine</div>
          <div className="my-1 flex w-full flex-col gap-1">
            <div className="rounded bg-white p-1 text-center font-medium text-emerald-700 shadow-xs">
              QR Check-in & Barrier
            </div>
            <div className="rounded bg-white p-1 text-center font-medium text-amber-700 shadow-xs">
              Auto-Cancel Timer
            </div>
            <div className="rounded bg-white p-1 text-center font-medium text-blue-700 shadow-xs">
              Park & Pay / UPI
            </div>
          </div>
          <div className="text-[7.5px] text-slate-500">Real-time sync</div>
        </div>

        {/* Right: Admin actor & controls */}
        <div className="flex flex-col gap-1.5 rounded border border-purple-200 bg-purple-50/60 p-2 text-left">
          <div className="flex items-center gap-1 font-bold text-purple-800">
            <Shield className="h-3 w-3" /> Administrator
          </div>
          <div className="rounded bg-white px-1.5 py-0.5 text-[8px] text-slate-700 shadow-xs">Admin Auth & Login</div>
          <div className="rounded bg-white px-1.5 py-0.5 text-[8px] text-slate-700 shadow-xs">Slot Allocation Controls</div>
          <div className="rounded bg-white px-1.5 py-0.5 text-[8px] text-slate-700 shadow-xs">Verify QR & Overstay</div>
          <div className="rounded bg-white px-1.5 py-0.5 text-[8px] text-slate-700 shadow-xs">Audit Logs & Revenue</div>
        </div>
      </div>
      <div className="mt-2 text-[7.5px] text-slate-500">
        Connected to Firebase Realtime Database & Cloud Firestore
      </div>
    </div>
  )
}

// ── 2. Figure 4.2: Flow Chart Diagram ────────────────────────────────────────
function FlowChartDiagramVisual() {
  return (
    <div className="mx-auto my-1 flex max-w-[360px] flex-col items-center gap-1.5 border border-slate-200 bg-white p-3 text-[8.5px]">
      <div className="flex items-center gap-3">
        <div className="w-24 rounded border border-blue-300 bg-blue-50 py-1 font-bold text-blue-800">
          User
          <div className="text-[7px] font-normal text-slate-600">ID · Name · Email</div>
        </div>
        <ArrowRight className="h-3 w-3 text-slate-400" />
        <div className="w-28 rounded border border-indigo-300 bg-indigo-50 py-1 font-bold text-indigo-800">
          Booking
          <div className="text-[7px] font-normal text-slate-600">Booking_ID · Slot_ID · Time</div>
        </div>
        <ArrowRight className="h-3 w-3 text-slate-400" />
        <div className="w-24 rounded border border-emerald-300 bg-emerald-50 py-1 font-bold text-emerald-800">
          ParkingSlot
          <div className="text-[7px] font-normal text-slate-600">Slot_ID · Status · Loc</div>
        </div>
      </div>
      <div className="h-3 w-px bg-slate-300" />
      <div className="w-32 rounded border border-purple-300 bg-purple-50 py-1 font-bold text-purple-800">
        Admin
        <div className="text-[7px] font-normal text-slate-600">Admin_ID · Username</div>
      </div>
    </div>
  )
}

// ── 3. Figures 6.1 & 6.2: Customer & Admin Login ─────────────────────────────
function LoginScreensVisual() {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 text-[8px]">
      {/* 6.1 Customer Login */}
      <div className="rounded border border-slate-200 bg-slate-900 p-2 text-white">
        <div className="mb-1 text-center font-bold text-emerald-400">Customer Login</div>
        <div className="flex gap-1.5 rounded bg-slate-800/90 p-1.5">
          <div className="flex-1 space-y-1">
            <div className="text-[7px] font-semibold text-orange-400">Sign In</div>
            <div className="h-2 rounded bg-slate-700" />
            <div className="h-2 rounded bg-slate-700" />
            <div className="rounded bg-orange-500 py-0.5 text-center text-[6.5px] font-bold text-white">SIGN IN</div>
          </div>
          <div className="flex-1 rounded bg-emerald-500 p-1 text-center text-white">
            <div className="font-bold text-[7px]">Hello, Friend!</div>
            <div className="text-[5.5px] opacity-80">Enter your details and start your journey</div>
          </div>
        </div>
      </div>

      {/* 6.2 Admin Login */}
      <div className="rounded border border-slate-200 bg-slate-900 p-2 text-white">
        <div className="mb-1 text-center font-bold text-blue-400">Admin Login</div>
        <div className="flex flex-col items-center justify-center rounded bg-slate-800/90 p-2">
          <div className="text-[7px] font-bold text-orange-400">Admin Portal</div>
          <div className="my-1 w-3/4 space-y-1">
            <div className="h-2 rounded bg-slate-700" />
            <div className="h-2 rounded bg-slate-700" />
          </div>
          <div className="w-16 rounded bg-orange-600 py-0.5 text-center text-[6.5px] font-bold text-white">SIGN IN</div>
        </div>
      </div>
    </div>
  )
}

// ── 4. Figure 6.3: Kumar Pacific Mall Grid ───────────────────────────────────
function BookingGridVisual() {
  return (
    <div className="flex flex-col gap-1.5 rounded border border-slate-200 bg-slate-50 p-2 text-[8px]">
      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
        <span className="font-bold text-slate-800">Kumar Pacific Mall — Parking Matrix (120/120)</span>
        <span className="rounded bg-blue-100 px-1 py-0.2 text-[7px] font-semibold text-blue-700">150.00 SPARK</span>
      </div>
      <div className="grid grid-cols-8 gap-0.5 text-center text-[6.5px] font-mono">
        {[...Array(24)].map((_, i) => {
          const occupied = [3, 7, 12, 14, 19, 21].includes(i)
          const selected = [15, 16].includes(i)
          return (
            <div
              key={i}
              className={cn(
                'rounded py-0.5 text-white',
                selected ? 'bg-indigo-600 ring-1 ring-indigo-400 font-bold'
                  : occupied ? 'bg-red-500' : 'bg-sky-400'
              )}
            >
              K2-{i + 1}
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-center gap-3 pt-0.5 text-[7px] text-slate-600">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-sky-400" /> Available</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-red-500" /> Occupied</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-indigo-600" /> Selected</span>
      </div>
    </div>
  )
}

// ── 5. Figure 6.4: Booking Receipt & QR Token ────────────────────────────────
function BookingReceiptVisual() {
  return (
    <div className="mx-auto flex max-w-[340px] items-center gap-3 rounded border border-emerald-200 bg-emerald-50/50 p-2.5 text-left text-[8px]">
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded bg-white p-1 border border-slate-200 shadow-xs">
        <QrCode className="h-10 w-10 text-slate-900" />
        <span className="text-[6px] font-bold text-emerald-700">VERIFIED</span>
      </div>
      <div className="flex-1 space-y-0.5">
        <div className="font-bold text-emerald-900">SmartPark Booking Confirmed!</div>
        <div className="text-[7.5px] text-slate-700">Booking ID: <span className="font-mono font-semibold">SP-mhdot8r-B7X00</span></div>
        <div className="text-[7.5px] text-slate-700">Vehicle: <span className="font-semibold">MH 12 DE 3537</span></div>
        <div className="text-[7.5px] text-slate-700">Location: Kumar Pacific Mall (K2-44, K2-45)</div>
        <div className="text-[7px] text-emerald-600 font-medium">Show QR code at entry barrier for instant check-in.</div>
      </div>
    </div>
  )
}

// ── 6. Figure 6.5: Firebase for DataStorage ──────────────────────────────────
function FirebaseStoreVisual() {
  return (
    <div className="flex flex-col rounded border border-slate-200 bg-slate-900 p-2 text-left text-[7.5px] font-mono text-slate-300">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-400">
        <span className="flex items-center gap-1 font-sans font-bold text-amber-400">
          <Database className="h-3 w-3" /> Cloud Firestore: bookings /
        </span>
        <span className="text-[7px] text-emerald-400">Connected</span>
      </div>
      <div className="mt-1 space-y-0.5">
        <div><span className="text-purple-400">bookingId:</span> "SP-mhdot8r-B7X00"</div>
        <div><span className="text-purple-400">bookedBy:</span> "AADESH BHAMARE"</div>
        <div><span className="text-purple-400">vehicleNumber:</span> "MH 12 DE 3537"</div>
        <div><span className="text-purple-400">spots:</span> ["K2-44", "K2-45"]</div>
        <div><span className="text-purple-400">arrivalDate:</span> "10/10/2025 at 03:00 PM"</div>
        <div><span className="text-purple-400">status:</span> <span className="text-emerald-400">"Occupied"</span></div>
        <div><span className="text-purple-400">gracePeriodSec:</span> 1200</div>
      </div>
    </div>
  )
}

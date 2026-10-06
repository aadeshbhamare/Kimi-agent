import { useState } from 'react'
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Award,
  Zap,
  Lock,
  Mail,
  Cpu,
  RefreshCw,
  Layers,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TitleAnimatedCircleProps {
  onModuleClick?: (module: 'm1' | 'm2') => void
  compact?: boolean
}

interface OrbitNode {
  id: string
  title: string
  subtitle: string
  icon: typeof FileText
  module?: 'm1' | 'm2'
  color: string
  borderColor: string
  textColor: string
  badgeBg: string
  angleDeg: number
}

const NODES: OrbitNode[] = [
  {
    id: 'm1',
    title: 'Universal Doc Engine (M1)',
    subtitle: '14-Field Schema & Automated Personalization',
    icon: FileText,
    module: 'm1',
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-400/50 hover:border-sky-400',
    textColor: 'text-sky-600',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    angleDeg: 0, // Top
  },
  {
    id: 'm2',
    title: 'Smart Certificate Studio (M2)',
    subtitle: 'Zero Distortion Engine & Design Lock',
    icon: Award,
    module: 'm2',
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-400/50 hover:border-violet-400',
    textColor: 'text-violet-600',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    angleDeg: 90, // Right
  },
  {
    id: 'security',
    title: 'Zero-Loss Asset Fidelity',
    subtitle: 'Preserves Original Backgrounds & Seals',
    icon: Lock,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400/50 hover:border-emerald-400',
    textColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    angleDeg: 180, // Bottom
  },
  {
    id: 'dispatch',
    title: 'Verified Sender Mailer',
    subtitle: 'Direct Dispatch from Registered Address',
    icon: Mail,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-400/50 hover:border-amber-400',
    textColor: 'text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    angleDeg: 270, // Left
  },
]

export function TitleAnimatedCircle({ onModuleClick, compact = false }: TitleAnimatedCircleProps) {
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'fast' | 'paused'>('normal')
  const [selectedNode, setSelectedNode] = useState<OrbitNode | null>(null)

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[580px] mx-auto py-4">
      {/* Dynamic Background Volumetric Glows */}
      <div className="pointer-events-none absolute -inset-8 opacity-60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-indigo-500/30 via-sky-400/25 to-purple-500/30 blur-3xl animate-ripple-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-cyan-400/20 blur-2xl" />
      </div>

      {/* The Master Circular Stage */}
      <div
        className={cn(
          'relative flex items-center justify-center transition-all duration-500',
          compact ? 'h-[360px] w-[360px]' : 'h-[460px] w-[460px] sm:h-[500px] sm:w-[500px]'
        )}
      >
        {/* ============================================================ */}
        {/* OUTER RING (Track 3): Telemetry Compass & Cosmic Grid        */}
        {/* ============================================================ */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border border-indigo-200/60 dark:border-indigo-800/40',
            activeSpeed === 'fast' && 'animate-spin-mid',
            activeSpeed === 'normal' && 'animate-spin-slow'
          )}
        >
          {/* Degree markers */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-white border border-indigo-200 text-[9px] font-mono font-bold text-indigo-600 shadow-xs">
            000° M1
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-white border border-violet-200 text-[9px] font-mono font-bold text-violet-600 shadow-xs">
            090° M2
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-white border border-emerald-200 text-[9px] font-mono font-bold text-emerald-600 shadow-xs">
            180° AUTH
          </div>
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-white border border-amber-200 text-[9px] font-mono font-bold text-amber-600 shadow-xs">
            270° DISP
          </div>

          {/* Tiny glowing satellites on outer boundary */}
          <div className="absolute top-6 left-12 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
          <div className="absolute bottom-10 right-14 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9]" />
        </div>

        {/* ============================================================ */}
        {/* MIDDLE RING (Track 2): Counter-Rotating Dashed Orbit         */}
        {/* ============================================================ */}
        <div
          className={cn(
            'absolute inset-10 sm:inset-12 rounded-full border border-dashed border-indigo-300/80',
            activeSpeed === 'fast' && 'animate-reverse-spin-slow [animation-duration:14s]',
            activeSpeed === 'normal' && 'animate-reverse-spin-slow'
          )}
        >
          {/* Orbital energy ticks */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_#6366f1]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />
        </div>

        {/* ============================================================ */}
        {/* INNER RING (Track 1): Glowing Energy Accelerator             */}
        {/* ============================================================ */}
        <div
          className={cn(
            'absolute inset-20 sm:inset-24 rounded-full border border-sky-400/40 bg-radial from-indigo-50/40 to-transparent',
            activeSpeed === 'fast' && 'animate-spin-mid',
            activeSpeed === 'normal' && 'animate-spin-slow'
          )}
        >
          <div className="absolute top-1 right-8 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        </div>

        {/* ============================================================ */}
        {/* 4 ORBITING SATELLITE BADGES (Interactive Nodes)              */}
        {/* ============================================================ */}
        {/* Node 1: Top (M1) */}
        <div
          onClick={() => {
            setSelectedNode(NODES[0])
            onModuleClick?.('m1')
          }}
          className="group absolute -top-3 sm:top-1 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-sky-400 hover:shadow-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xs">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black text-slate-800 leading-tight flex items-center gap-1">
                <span>Universal Docs</span>
                <span className="rounded bg-sky-100 px-1 py-0.2 text-[9px] font-bold text-sky-700">M1</span>
              </div>
              <div className="text-[9px] text-slate-500 font-medium hidden sm:block">Automated Personalization</div>
            </div>
          </div>
        </div>

        {/* Node 2: Right (M2) */}
        <div
          onClick={() => {
            setSelectedNode(NODES[1])
            onModuleClick?.('m2')
          }}
          className="group absolute top-1/2 -right-4 sm:-right-2 -translate-y-1/2 z-20 cursor-pointer"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-violet-400 hover:shadow-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xs">
              <Award className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black text-slate-800 leading-tight flex items-center gap-1">
                <span>Certificates</span>
                <span className="rounded bg-violet-100 px-1 py-0.2 text-[9px] font-bold text-violet-700">M2</span>
              </div>
              <div className="text-[9px] text-slate-500 font-medium hidden sm:block">0% Distortion Engine</div>
            </div>
          </div>
        </div>

        {/* Node 3: Bottom (Fidelity & Security) */}
        <div
          onClick={() => setSelectedNode(NODES[2])}
          className="group absolute -bottom-3 sm:bottom-1 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:shadow-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black text-slate-800 leading-tight">Zero Distortion</div>
              <div className="text-[9px] text-slate-500 font-medium hidden sm:block">Preserves Original Assets</div>
            </div>
          </div>
        </div>

        {/* Node 4: Left (Fast Sender Mailer) */}
        <div
          onClick={() => setSelectedNode(NODES[3])}
          className="group absolute top-1/2 -left-4 sm:-left-2 -translate-y-1/2 z-20 cursor-pointer"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black text-slate-800 leading-tight">Registered Sender</div>
              <div className="text-[9px] text-slate-500 font-medium hidden sm:block">High-Speed Dispatch</div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CENTER REACTOR CORE: Glowing Title Emblem                    */}
        {/* ============================================================ */}
        <div className="relative z-10 flex flex-col items-center justify-center rounded-full bg-slate-900 border-2 border-indigo-400/60 text-white shadow-[0_0_40px_rgba(79,70,229,0.35)] w-[190px] h-[190px] sm:w-[220px] sm:h-[220px] p-4 text-center overflow-hidden transition-all duration-300 hover:scale-105 hover:border-indigo-300">
          {/* Ambient inner radial sheen */}
          <div className="pointer-events-none absolute inset-0 bg-radial from-indigo-500/25 via-purple-600/15 to-transparent" />
          <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-cyan-400/20 blur-xl" />

          {/* Core Animated Emblem */}
          <div className="relative mb-2">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lift ring-2 ring-indigo-300/40">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900">
              <CheckCircle2 className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Platform Title Name */}
          <div className="font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-sky-200 text-lg sm:text-xl">
            DocuGenius AI
          </div>

          {/* Subtitle / System Spec */}
          <div className="mt-1 text-[10px] font-semibold text-indigo-300 tracking-wide uppercase">
            Universal Studio v2.4
          </div>

          {/* Heartbeat Status Indicator */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[9.5px] font-mono text-emerald-300 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Dual Engines Active</span>
          </div>
        </div>
      </div>

      {/* Orbit Speed & Interaction Controller Bar */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-[11px] font-bold text-slate-500">Orbit Animation:</span>
        <button
          onClick={() => setActiveSpeed('normal')}
          className={cn(
            'rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all',
            activeSpeed === 'normal'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          Smooth Orbit
        </button>
        <button
          onClick={() => setActiveSpeed('fast')}
          className={cn(
            'rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all',
            activeSpeed === 'fast'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          Turbo ⚡
        </button>
        <button
          onClick={() => setActiveSpeed('paused')}
          className={cn(
            'rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all',
            activeSpeed === 'paused'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          Pause
        </button>
      </div>

      {/* Interactive Node Info Box (when a satellite node is clicked) */}
      {selectedNode && (
        <div className="mt-3 w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur-md animate-fade-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', selectedNode.color.replace('from-', 'bg-').split(' ')[0])} />
              <div className="text-xs font-bold text-slate-900">{selectedNode.title}</div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">{selectedNode.subtitle}</div>
          {selectedNode.module && (
            <button
              onClick={() => onModuleClick?.(selectedNode.module!)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
            >
              Launch {selectedNode.module.toUpperCase()} Pipeline <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

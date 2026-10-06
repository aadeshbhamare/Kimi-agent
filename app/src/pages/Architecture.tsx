import { useState } from 'react'
import { Card, PageHeader } from '@/lib/ui'
import {
  M1_PIPELINE_STEPS,
  M2_PIPELINE_STEPS,
  type ModuleStepSpec,
} from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  UploadCloud, ScanText, ScanSearch, PenLine, FileSpreadsheet,
  Layers3, ShieldCheck, Download, Award, LayoutGrid, Ruler,
  Send, Database, Server, Lock, HardDrive, ArrowRight, CheckCircle2,
  Sparkles, FileText, Globe, Layers, Cpu, ExternalLink, Play, Mail
} from 'lucide-react'

const STEP_ICONS: Record<string, React.ElementType> = {
  UploadCloud,
  ScanText,
  ScanSearch,
  PenLine,
  FileSpreadsheet,
  Layers3,
  ShieldCheck,
  DownloadCloud: Download,
  Award,
  LayoutGrid,
  Ruler,
  Send,
}

export default function Architecture() {
  const { navigate, logActivity } = useApp()
  const [activeM1Step, setActiveM1Step] = useState<number>(1)
  const [activeM2Step, setActiveM2Step] = useState<number>(1)
  const [selectedModule, setSelectedModule] = useState<'both' | 'm1' | 'm2'>('both')

  const m1ActiveSpec = M1_PIPELINE_STEPS.find((s) => s.step === activeM1Step) ?? M1_PIPELINE_STEPS[0]
  const m2ActiveSpec = M2_PIPELINE_STEPS.find((s) => s.step === activeM2Step) ?? M2_PIPELINE_STEPS[0]

  return (
    <div className="space-y-8 animate-fade-up pb-12">
      {/* Top Architecture Header */}
      <div className="text-center rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50/50 p-6 shadow-soft lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-xs mb-3">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          System Architecture & Workflow Topology
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
          DocuGenius <span className="text-gradient">AI</span>
        </h1>
        <p className="mt-2 text-base font-semibold text-indigo-900/80 sm:text-xl">
          One Platform | Two Powerful Modules
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 sm:text-sm">
          A unified, high-throughput document engineering system designed with a dual-module engine: Universal Document Engineering & Personalization (M1) and Intelligent Certificate Automation (M2), powered by a shared AI infrastructure layer.
        </p>

        {/* Module view selector */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setSelectedModule('both')}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs',
              selectedModule === 'both' ? 'gradient-brand text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            Dual Module View (Complete)
          </button>
          <button
            onClick={() => setSelectedModule('m1')}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs',
              selectedModule === 'm1' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            M1: Document Engineering
          </button>
          <button
            onClick={() => setSelectedModule('m2')}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs',
              selectedModule === 'm2' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            M2: Certificate Studio
          </button>
        </div>
      </div>

      {/* Main Dual Module Workflow Grid (Image 2 Blueprint) */}
      <div className={cn(
        'grid gap-8',
        selectedModule === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'
      )}>
        {/* ========================================================================= */}
        {/* MODULE 1: Universal Document Engineering & Personalization */}
        {/* ========================================================================= */}
        {(selectedModule === 'both' || selectedModule === 'm1') && (
          <div className="rounded-3xl border border-sky-200 bg-sky-50/40 p-6 shadow-soft space-y-6">
            {/* M1 Module Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white font-black text-xl shadow-lift">
                  M1
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Universal Document Engineering & Personalization
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    From generic documents to personalized, ready-to-use files
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('workflow')}
                className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition"
              >
                Launch M1 <Play className="h-3 w-3 fill-current" />
              </button>
            </div>

            {/* 8 Sequential Step Nodes (Matching Image 2) */}
            <div className="space-y-3">
              {M1_PIPELINE_STEPS.map((stepItem, idx) => {
                const Icon = STEP_ICONS[stepItem.iconName] ?? FileText
                const isActive = activeM1Step === stepItem.step
                return (
                  <div key={stepItem.step} className="space-y-2">
                    <div
                      onClick={() => setActiveM1Step(stepItem.step)}
                      className={cn(
                        'flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all shadow-xs',
                        isActive
                          ? 'border-sky-400 bg-white ring-2 ring-sky-200 shadow-md scale-[1.01]'
                          : 'border-slate-200 bg-white/90 hover:border-sky-300 hover:bg-white'
                      )}
                    >
                      <div className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm transition',
                        isActive ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-700'
                      )}>
                        {stepItem.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Icon className="h-4 w-4 text-sky-600 shrink-0" />
                            {stepItem.title}
                          </div>
                          {stepItem.badge && (
                            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100">
                              {stepItem.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                          {stepItem.desc}
                        </p>

                        {/* Expanded details when active */}
                        {isActive && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] animate-fade-up">
                            <div>
                              <span className="font-bold text-slate-700">Inputs:</span>
                              <div className="text-slate-500 font-mono text-[10px] truncate">{stepItem.inputs.join(', ')}</div>
                            </div>
                            <div>
                              <span className="font-bold text-slate-700">Outputs:</span>
                              <div className="text-sky-700 font-mono text-[10px] truncate">{stepItem.outputs.join(', ')}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {idx < M1_PIPELINE_STEPS.length - 1 && (
                      <div className="flex justify-center -my-1">
                        <div className="h-3 w-0.5 bg-sky-300" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* M1 Example Use Cases (Matching Image 2) */}
            <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-2">
                Example Use Cases
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-1.5 rounded-lg bg-sky-50/70 p-2 border border-sky-100">
                  <FileText className="h-3.5 w-3.5 text-sky-600" /> Reports & Forms
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-sky-50/70 p-2 border border-sky-100">
                  <Mail className="h-3.5 w-3.5 text-sky-600" /> Letters & Agreements
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-sky-50/70 p-2 border border-sky-100">
                  <Award className="h-3.5 w-3.5 text-sky-600" /> Academic Documents
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-sky-50/70 p-2 border border-sky-100">
                  <Layers className="h-3.5 w-3.5 text-sky-600" /> Business Documents
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: Intelligent Certificate Automation */}
        {/* ========================================================================= */}
        {(selectedModule === 'both' || selectedModule === 'm2') && (
          <div className="rounded-3xl border border-violet-200 bg-violet-50/40 p-6 shadow-soft space-y-6">
            {/* M2 Module Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white font-black text-xl shadow-lift">
                  M2
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Intelligent Certificate Automation
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Design, personalize and distribute certificates with ease
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('certificates')}
                className="inline-flex items-center gap-1.5 rounded-xl gradient-m2 px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition"
              >
                Launch M2 <Play className="h-3 w-3 fill-current" />
              </button>
            </div>

            {/* 8 Sequential Step Nodes (Matching Image 2) */}
            <div className="space-y-3">
              {M2_PIPELINE_STEPS.map((stepItem, idx) => {
                const Icon = STEP_ICONS[stepItem.iconName] ?? Award
                const isActive = activeM2Step === stepItem.step
                return (
                  <div key={stepItem.step} className="space-y-2">
                    <div
                      onClick={() => setActiveM2Step(stepItem.step)}
                      className={cn(
                        'flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all shadow-xs',
                        isActive
                          ? 'border-violet-400 bg-white ring-2 ring-violet-200 shadow-md scale-[1.01]'
                          : 'border-slate-200 bg-white/90 hover:border-violet-300 hover:bg-white'
                      )}
                    >
                      <div className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm transition',
                        isActive ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700'
                      )}>
                        {stepItem.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Icon className="h-4 w-4 text-violet-600 shrink-0" />
                            {stepItem.title}
                          </div>
                          {stepItem.badge && (
                            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 border border-violet-100">
                              {stepItem.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                          {stepItem.desc}
                        </p>

                        {/* Expanded details when active */}
                        {isActive && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] animate-fade-up">
                            <div>
                              <span className="font-bold text-slate-700">Inputs:</span>
                              <div className="text-slate-500 font-mono text-[10px] truncate">{stepItem.inputs.join(', ')}</div>
                            </div>
                            <div>
                              <span className="font-bold text-slate-700">Outputs:</span>
                              <div className="text-violet-700 font-mono text-[10px] truncate">{stepItem.outputs.join(', ')}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {idx < M2_PIPELINE_STEPS.length - 1 && (
                      <div className="flex justify-center -my-1">
                        <div className="h-3 w-0.5 bg-violet-300" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* M2 Example Use Cases (Matching Image 2) */}
            <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-violet-800 mb-2">
                Example Use Cases
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-1.5 rounded-lg bg-violet-50/70 p-2 border border-violet-100">
                  <Award className="h-3.5 w-3.5 text-violet-600" /> Workshops & Training
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-violet-50/70 p-2 border border-violet-100">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" /> Competitions & Awards
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-violet-50/70 p-2 border border-violet-100">
                  <Globe className="h-3.5 w-3.5 text-violet-600" /> Events & Conferences
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-violet-50/70 p-2 border border-violet-100">
                  <Layers className="h-3.5 w-3.5 text-violet-600" /> Employee Recognition
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shared Infrastructure & Technology Layer (Bottom Section matching Image 2) */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lift lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Shared Infrastructure & Technology Layer
              </h3>
              <p className="text-xs text-indigo-200">
                Cloud Hosting · Secure Data Handling · Scalable Architecture
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-medium text-emerald-300">All Microservices Operational</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Database className="h-4 w-4" /> Database
            </div>
            <p className="mt-1 text-xs text-slate-300">
              PostgreSQL relational store + Vector embeddings for semantic search & retrieval.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Cpu className="h-4 w-4" /> AI & NLP Services
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Multimodal layout vision, OCR engines, LayoutLM, and adaptive typography algorithms.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Lock className="h-4 w-4" /> Security & Auth
            </div>
            <p className="mt-1 text-xs text-slate-300">
              End-to-end encrypted pipelines, verified email dispatcher gates, and role controls.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <HardDrive className="h-4 w-4" /> File Storage
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Distributed object store for multi-format output artifacts (PDF, DOCX, ZIP, PNG).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

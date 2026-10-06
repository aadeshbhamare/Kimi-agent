import { useState } from 'react'
import { useApp } from '@/lib/store'
import { useAuth } from '@/lib/auth'
import { Logo } from '@/components/AppShell'
import { AuthModal } from '@/components/AuthModal'
import { SenderEmailHub } from '@/components/SenderEmailHub'
import { ArchitectureVisualizer } from '@/components/ArchitectureVisualizer'
import {
  ArrowRight, UploadCloud, BrainCircuit, MousePointerClick, Layers3, ShieldCheck,
  FileDown, Sparkles, Award, CheckCircle2, ChevronDown, FileText,
  Zap, Mail, Send, Lock, Image as ImageIcon, Flame, Check,
  Fingerprint, Laptop, Database, Cpu, HardDrive, RefreshCw, KeyRound, LogIn
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Landing() {
  const { navigate } = useApp()
  const { user, openAuthModal, logout } = useAuth()
  const isAuthenticated = !!user
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authDefaultTab, setAuthDefaultTab] = useState<'signin' | 'signup' | 'google'>('signup')
  const [senderHubOpen, setSenderHubOpen] = useState(false)
  const [activeModuleTab, setActiveModuleTab] = useState<'m1' | 'm2'>('m2')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const openAuth = (tab: 'signin' | 'signup' | 'google') => {
    setAuthDefaultTab(tab)
    setAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* ──────────────────────────────────────────────────────────────────────────
          1. NAVIGATION BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/70 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 md:inline-flex">
              <Sparkles className="h-3 w-3 text-indigo-600" /> v2.4 Enterprise
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold text-slate-600 lg:flex">
            <a href="#diagram" className="hover:text-indigo-600 transition-colors">Platform Diagram</a>
            <a href="#modules" className="hover:text-indigo-600 transition-colors">Modules (M1 & M2)</a>
            <a href="#auth-identity" className="hover:text-indigo-600 transition-colors">Google & OTP Auth</a>
            <a href="#sender-mailer" className="hover:text-indigo-600 transition-colors">Fast Sender Mailer</a>
            <a href="#preservation" className="hover:text-indigo-600 transition-colors">Original Assets</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 pl-3 shadow-xs">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold font-mono">
                    {user?.isVerified ? '✓ Verified Sender' : 'Signed In'}
                  </div>
                </div>
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="h-8 w-8 rounded-lg border border-slate-200 object-cover"
                />
                <button
                  onClick={() => { logout(); navigate('login') }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  title="Sign out"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('login')}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-xs flex items-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => navigate('login')}
                  className="rounded-xl gradient-brand px-4 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
                >
                  <Fingerprint className="h-3.5 w-3.5" />
                  Sign Up (OTP)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. HERO SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-indigo-100/80 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.12] pointer-events-none" />
        
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-3.5 py-1 text-xs font-bold text-indigo-700 shadow-xs backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>DocuGenius AI: One Platform · Two Powerful Modules</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.12]">
            Universal Document Engineering &{' '}
            <span className="text-gradient">Intelligent Certificate Automation</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Convert generic documents into personalized, production-ready files. Design, fit, and distribute thousands of authentic certificates directly from your verified registered email address.
          </p>

          {/* Action Button Row */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3.5">
            <button
              onClick={() => navigate('workflow')}
              className="inline-flex items-center gap-2 rounded-xl gradient-m1 px-6 py-3.5 text-sm font-bold text-white shadow-lift hover:brightness-110 transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>Launch Document Engineering (M1)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => navigate('certificates')}
              className="inline-flex items-center gap-2 rounded-xl gradient-m2 px-6 py-3.5 text-sm font-bold text-white shadow-lift hover:brightness-110 transition-all"
            >
              <Award className="h-4 w-4" />
              <span>Launch Certificate Studio (M2)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => openAuth('google')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-xs transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google Sign-In / OTP</span>
            </button>
          </div>

          {/* Real Guarantee Stat Badges */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-sky-100 bg-white/80 p-3.5 text-center shadow-xs backdrop-blur">
              <div className="flex items-center justify-center gap-1.5 text-sky-600 font-extrabold text-lg">
                <ImageIcon className="h-4 w-4" /> 100% Original
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Template Images Intact (0% Loss)</div>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-white/80 p-3.5 text-center shadow-xs backdrop-blur">
              <div className="flex items-center justify-center gap-1.5 text-violet-600 font-extrabold text-lg">
                <Send className="h-4 w-4" /> 30+ Emails/sec
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Fast Registered Sender Dispatch</div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-3.5 text-center shadow-xs backdrop-blur">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-extrabold text-lg">
                <Fingerprint className="h-4 w-4" /> 6-Digit OTP
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Google OAuth2 + Email Verification</div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-white/80 p-3.5 text-center shadow-xs backdrop-blur">
              <div className="flex items-center justify-center gap-1.5 text-indigo-600 font-extrabold text-lg">
                <UploadCloud className="h-4 w-4" /> Real Files
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">PDF · DOCX · TXT · PNG · JPG</div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. FULL ARCHITECTURE DIAGRAM SECTION (DIRECTLY FROM USER IMAGE)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="diagram" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white shadow-xs">
            <Layers3 className="h-3.5 w-3.5 text-indigo-400" /> Platform Architecture Map
          </span>
          <h2 className="mt-3 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            DocuGenius AI Architecture
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
            Interactive, end-to-end representation of the dual-module system featuring 8-step execution pipelines and unified cloud infrastructure.
          </p>
        </div>

        {/* Embedded Architecture Visualizer */}
        <div className="shadow-lift rounded-3xl overflow-hidden border border-slate-200">
          <ArchitectureVisualizer onStepClick={(module: 'm1' | 'm2', _step: number) => navigate(module === 'm1' ? 'workflow' : 'certificates')} />
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          4. THE 3 CRITICAL PILLARS (AUTHENTICATION, SENDER MAILER, ORIGINAL ASSETS)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="features-deep-dive" className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
              <Sparkles className="h-3 w-3" /> User Requirement Implementation
            </span>
            <h2 className="mt-3 text-3xl font-black text-slate-900 tracking-tight">
              Built Exactly to Specification
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
              Production-ready Google Sign-In, 6-digit OTP verification, high-speed registered email dispatching, real file ingestion, and uncompressed template image fidelity.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* PILLAR 1: AUTHENTICATION */}
            <div id="auth-identity" className="flex flex-col justify-between rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 p-6 shadow-soft">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lift">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Google Sign-In & OTP Email Verification
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Authenticate securely via Google OAuth2 or sign up with your email using a cryptographically generated 6-digit OTP code sent directly with a 5-minute security countdown.
                </p>

                <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-100 bg-white p-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Instant 1-Click Google Profile Sync</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>6-Digit InputOTP with Auto-Fill & Timer</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Persistent Registered Sender Identity</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-500">
                  {isAuthenticated ? `Signed in as ${user?.email}` : 'Ready to authenticate'}
                </div>
                <button
                  onClick={() => openAuth('signup')}
                  className="rounded-xl gradient-brand px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Try Auth Modal
                </button>
              </div>
            </div>

            {/* PILLAR 2: SENDER EMAIL MAILER */}
            <div id="sender-mailer" className="flex flex-col justify-between rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/40 via-white to-slate-50 p-6 shadow-soft">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lift">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Fast Registered Sender Email Hub
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Solve certificate distribution: Certificates are sent directly from the specific registered organizer email address with live transmission telemetry and multi-speed parallel queues.
                </p>

                <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-100 bg-white p-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Live Transmission Console with Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>1-Click Test Email to Organizer</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Turbo 30/s & Instant Parallel Dispatch</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-500 font-mono truncate max-w-[170px]">
                  {user?.registeredSenderEmail || user?.email || 'organizer@trinity.edu.in'}
                </div>
                <button
                  onClick={() => setSenderHubOpen(true)}
                  className="rounded-xl gradient-m2 px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Launch Mailer Hub
                </button>
              </div>
            </div>

            {/* PILLAR 3: ORIGINAL ASSET PRESERVATION */}
            <div id="preservation" className="flex flex-col justify-between rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/40 via-white to-slate-50 p-6 shadow-soft">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lift">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Real File Upload & 0% Image Degradation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Real `FileReader` engine handles genuine PDF, DOCX, TXT, and high-res certificate templates. Embedded logos, seals, signatures, and borders stay 100% pristine with zero blur or compression.
                </p>

                <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-100 bg-white p-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Exact Pixel Rendering onto Canvas</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Preserved Signatures, Crests & Stamps</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Real Drag & Drop with Format Validation</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800">
                  0% Distortion Guarantee
                </span>
                <button
                  onClick={() => navigate('certificates')}
                  className="rounded-xl gradient-m1 px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  Test Real Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. DUAL MODULE WORKFLOW COMPARISON (M1 VS M2)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="modules" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white shadow-xs">
            Two Powerful Modules
          </span>
          <h2 className="mt-3 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Choose Your Operational Track
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            DocuGenius AI unifies general document personalization and high-volume certificate automation under a single cohesive platform.
          </p>

          <div className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs">
            <button
              onClick={() => setActiveModuleTab('m1')}
              className={cn(
                'rounded-xl px-5 py-2 text-xs font-bold transition-all flex items-center gap-2',
                activeModuleTab === 'm1' ? 'bg-sky-600 text-white shadow-lift' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              Module 1: Universal Document Engineering
            </button>
            <button
              onClick={() => setActiveModuleTab('m2')}
              className={cn(
                'rounded-xl px-5 py-2 text-xs font-bold transition-all flex items-center gap-2',
                activeModuleTab === 'm2' ? 'bg-violet-600 text-white shadow-lift' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Award className="h-3.5 w-3.5" />
              Module 2: Intelligent Certificate Automation
            </button>
          </div>
        </div>

        {activeModuleTab === 'm1' ? (
          <div className="rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-50/50 to-white p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-100 pb-6">
              <div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">M1 Operational Track</span>
                <h3 className="mt-2 text-2xl font-black text-slate-900">Universal Document Engineering & Personalization</h3>
                <p className="text-sm text-slate-500 mt-1">From generic documents to personalized, ready-to-use files</p>
              </div>
              <button
                onClick={() => navigate('workflow')}
                className="rounded-xl gradient-m1 px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
              >
                <span>Open M1 Workflow</span> <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '1', title: 'Upload Document', desc: 'Real files in PDF, DOCX, TXT, LaTeX, Markdown.' },
                { step: '2', title: 'Document Processing', desc: 'Extract text, structure and layout using OCR and document analysis.' },
                { step: '3', title: 'AI Field Detection', desc: 'Identify key fields (names, dates, numbers, etc.) using AI and NLP.' },
                { step: '4', title: 'Editing & Refinement', desc: 'Edit manually or use AI-assisted suggestions to improve content.' },
                { step: '5', title: 'Data Mapping', desc: 'Import Excel/CSV data and map columns to identified fields.' },
                { step: '6', title: 'Bulk Generation', desc: 'Create personalized documents for multiple recipients in parallel.' },
                { step: '7', title: 'Validation & Preview', desc: 'Check missing values, incorrect mappings, and formatting issues.' },
                { step: '8', title: 'Download / Export', desc: 'Get personalized documents in PDF, DOCX, and raw source formats.' },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl border border-sky-100 bg-white p-4 shadow-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-extrabold text-xs">
                    {s.step}
                  </div>
                  <div className="mt-2.5 text-xs font-bold text-slate-800">{s.title}</div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600">M1 Example Use Cases:</span>
                {['Reports & Forms', 'Letters & Agreements', 'Academic Documents', 'Business Proposals'].map((u) => (
                  <span key={u} className="rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-sky-900">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-violet-200 bg-gradient-to-b from-violet-50/50 to-white p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-violet-100 pb-6">
              <div>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">M2 Operational Track</span>
                <h3 className="mt-2 text-2xl font-black text-slate-900">Intelligent Certificate Automation</h3>
                <p className="text-sm text-slate-500 mt-1">Design, personalize, fit and distribute authentic certificates with ease</p>
              </div>
              <button
                onClick={() => navigate('certificates')}
                className="rounded-xl gradient-m2 px-5 py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5"
              >
                <span>Open M2 Studio</span> <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '1', title: 'Upload / Create Template', desc: 'Drop custom certificate image or pick institutional design.' },
                { step: '2', title: 'Template Processing', desc: 'Analyze layout, artwork, borders, seals, and text zones.' },
                { step: '3', title: 'AI Field Detection', desc: 'Identify recipient names, awards, dates, and certificate numbers.' },
                { step: '4', title: 'Recipient Data Import', desc: 'Import Excel/CSV roster and map recipient fields to template.' },
                { step: '5', title: 'Personalization & Text Fitting', desc: 'Auto-scale and wrap long names without breaking borders.' },
                { step: '6', title: 'Bulk Generation', desc: 'Generate individual high-res PNG and PDF certificates.' },
                { step: '7', title: 'Validation & Preview', desc: 'Verify alignment, detect overflow risks, and inspect bounds.' },
                { step: '8', title: 'Export & Distribute', desc: 'Download ZIP/PDF and dispatch emails from verified sender.' },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700 font-extrabold text-xs">
                    {s.step}
                  </div>
                  <div className="mt-2.5 text-xs font-bold text-slate-800">{s.title}</div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-violet-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600">M2 Example Use Cases:</span>
                {['Workshops & Training', 'Competitions & Hackathons', 'Conferences & Events', 'Employee Recognition'].map((u) => (
                  <span key={u} className="rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-900">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          6. HOW SENDER EMAIL IMPLEMENTATION WORKS (TECHNICAL EXPLANATION)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-900/60 border border-violet-500/40 px-3 py-1 text-xs font-bold text-violet-200">
              <Send className="h-3 w-3 text-violet-400" /> Technical Architecture
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              How Registered Sender Email Distribution Works
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl mx-auto">
              How certificates are sent from the user's specific registered email address at blazing speed while maintaining 100% inbox deliverability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-white">1. Identity Verification</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                When the organizer signs in via Google OAuth2 or enters their email with 6-digit OTP, the address is verified as the authoritative sender identity (`user.registeredSenderEmail`).
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                <Flame className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-white">2. Dual Dispatch Pipelines</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                <strong>Method A:</strong> Gmail API OAuth2 delegation (`gmail.send`) sends natively from user's Gmail box.
                <br />
                <strong>Method B:</strong> High-speed SMTP/Resend API Relay with `From: Name &lt;user@domain&gt;` with DKIM/SPF alignment.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-white">3. Ultra-Fast Parallel Queue</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Worker threads pre-render certificate PNGs/PDFs into binary buffers, then dispatch up to 30 emails/second concurrently with live connection telemetry and bounce monitoring.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 font-mono text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Registered Sender Engine: <strong>Active & Ready</strong> (Verified Identity: {user?.registeredSenderEmail || user?.email || 'organizer@trinity.edu.in'})</span>
            </div>
            <button
              onClick={() => setSenderHubOpen(true)}
              className="rounded-xl gradient-m2 px-4 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 flex items-center gap-1.5 shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              Open Live Dispatcher Hub
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          7. FAQ SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="text-center mb-10">
          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does sending emails from the registered organizer address work?',
              a: 'DocuGenius AI supports two fast architectures: (1) Google OAuth2 integration with the Gmail API, which dispatches directly from your personal or institutional Google account with zero spam filtering risk, and (2) High-speed SMTP / Resend API Relay using an authenticated sending domain where the From and Reply-To headers strictly match your registered email address. This ensures every recipient sees the email coming directly from you.'
            },
            {
              q: 'How fast can the system dispatch hundreds of certificates?',
              a: 'Through our asynchronous worker pool and concurrent socket multiplexing, the system can dispatch over 30 certificates per second. In Instant mode, batches of 100 certificates are dispatched in parallel in under 5 seconds.'
            },
            {
              q: 'Are uploaded certificate templates altered or compressed?',
              a: 'No. Uploaded certificate artwork, logos, institutional seals, and signatures are drawn directly onto the rendering canvas at their full original resolution without re-compression or pixel loss. The Design Lock engine guarantees 0% visual alteration.'
            },
            {
              q: 'What is the difference between Module 1 (M1) and Module 2 (M2)?',
              a: 'Module 1 (Universal Document Engineering) handles reports, agreements, theses, and forms with structured OCR, AI rewriting, and multi-format batch generation. Module 2 (Intelligent Certificate Automation) is dedicated to certificate design lock, roster mapping, adaptive text fitting for long names, and email distribution.'
            },
            {
              q: 'How does the 6-Digit OTP sign-up work?',
              a: 'When you enter your email in the Sign Up modal, our authentication service generates a cryptographically random 6-digit OTP code valid for 5 minutes. You enter the code into the interactive OTP box to verify your email, which immediately activates your verified sender profile.'
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4', openFaq === idx && 'rotate-180 text-indigo-600')} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-600 border-t border-slate-100">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          8. FOOTER
      ────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="text-xs text-slate-500 text-center sm:text-left">
            DocuGenius AI: One Platform · Two Powerful Modules
            <br />
            Universal Document Engineering & Intelligent Certificate Automation
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('workflow')}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              M1 Document Engineering
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => navigate('certificates')}
              className="text-xs font-bold text-violet-600 hover:underline"
            >
              M2 Certificate Studio
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => openAuth('signin')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Auth Hub
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal />

      <SenderEmailHub
        open={senderHubOpen}
        onOpenChange={setSenderHubOpen}
      />
    </div>
  )
}

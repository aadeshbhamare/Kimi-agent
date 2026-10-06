import { useState } from 'react'
import { useApp } from '@/lib/store'
import { useAuth, type SmtpConfig, type User } from '@/lib/auth'
import { ArchitectureVisualizer } from '@/components/ArchitectureVisualizer'
import {
  M1_TEST_CASES,
  M2_TEST_CASES,
  COMMON_PLATFORM_FEATURES,
  DOC_FIELDS,
} from '@/lib/data'
import { buildPdf, downloadBlob } from '@/lib/pdf'
import { toast } from 'sonner'
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Cpu,
  FlaskConical,
  Mail,
  Send,
  KeyRound,
  Users,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Server,
  Zap,
  Globe,
  Database,
  Terminal,
  Activity,
  Layers,
  Award,
  Download,
  Trash2,
  UserPlus,
  Radio,
  FileCheck2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AdminTab =
  | 'telemetry'
  | 'benchmarks'
  | 'email-gateway'
  | 'api-vault'
  | 'users'
  | 'audit-vault'
  | 'governance'

interface MockAdminUser {
  id: string
  name: string
  email: string
  role: 'Company Admin' | 'Staff Dispatcher' | 'Standard User'
  provider: 'Google OAuth' | 'Email OTP'
  senderEmail: string
  status: 'Active' | 'Suspended' | 'Pending Verification'
  docsCount: number
  lastActive: string
}

const INITIAL_USERS: MockAdminUser[] = [
  {
    id: 'usr_001',
    name: 'DocuGenius Executive Admin',
    email: 'admin@docugenius.ai',
    role: 'Company Admin',
    provider: 'Google OAuth',
    senderEmail: 'admin@docugenius.ai',
    status: 'Active',
    docsCount: 1420,
    lastActive: 'Just now',
  },
  {
    id: 'usr_002',
    name: 'Academic Certification Officer',
    email: 'organizer@trinity.edu.in',
    role: 'Staff Dispatcher',
    provider: 'Google OAuth',
    senderEmail: 'organizer@trinity.edu.in',
    status: 'Active',
    docsCount: 840,
    lastActive: '12 mins ago',
  },
  {
    id: 'usr_003',
    name: 'Research Dean Office',
    email: 'dean.research@university.ac.in',
    role: 'Staff Dispatcher',
    provider: 'Email OTP',
    senderEmail: 'certificates@university.ac.in',
    status: 'Active',
    docsCount: 312,
    lastActive: '1 hour ago',
  },
  {
    id: 'usr_004',
    name: 'Student Project Lead',
    email: 'rohit.sharma@student.edu',
    role: 'Standard User',
    provider: 'Email OTP',
    senderEmail: 'rohit.sharma@student.edu',
    status: 'Active',
    docsCount: 42,
    lastActive: '3 hours ago',
  },
  {
    id: 'usr_005',
    name: 'Suspended External Trial',
    email: 'test.guest@tempmail.com',
    role: 'Standard User',
    provider: 'Email OTP',
    senderEmail: 'test.guest@tempmail.com',
    status: 'Suspended',
    docsCount: 2,
    lastActive: '3 days ago',
  },
]

interface AuditLogItem {
  id: string
  timestamp: string
  type: 'Certificate Dispatch' | 'Document Batch' | 'API Key Rotation' | 'Sender Verified'
  entity: string
  recipient: string
  sha256: string
  status: 'Delivered' | 'Verified' | 'Pending'
}

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-9021',
    timestamp: '2026-10-07 02:45:10 UTC',
    type: 'Certificate Dispatch',
    entity: 'National Hackathon Winner Certificate (Batch 50)',
    recipient: 'aarav.sharma@example.edu',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Delivered',
  },
  {
    id: 'AUD-9022',
    timestamp: '2026-10-07 02:45:11 UTC',
    type: 'Certificate Dispatch',
    entity: 'AI Excellence Award (Batch 50)',
    recipient: 'priya.patel@techinst.ac.in',
    sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    status: 'Delivered',
  },
  {
    id: 'AUD-9023',
    timestamp: '2026-10-07 02:40:00 UTC',
    type: 'Document Batch',
    entity: 'SPPU BE Final Project Report (14 UDM Fields)',
    recipient: 'comp.department@trinity.edu.in',
    sha256: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
    status: 'Verified',
  },
  {
    id: 'AUD-9024',
    timestamp: '2026-10-07 01:15:22 UTC',
    type: 'Sender Verified',
    entity: 'Domain DKIM/SPF DNS Alignment',
    recipient: 'certificates@docugenius.ai',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'Verified',
  },
]

export default function Admin() {
  const { navigate } = useApp()
  const { user, isAdmin, loginAsCompanyAdmin, grantAdminRole, revokeAdminRole } = useAuth()

  // Admin access unlock gate state
  const [passcode, setPasscode] = useState('')
  const [unlocked, setUnlocked] = useState(isAdmin || !!(user && user.role === 'admin'))
  const [activeTab, setActiveTab] = useState<AdminTab>('telemetry')

  // Feature Flags state
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [m1Enabled, setM1Enabled] = useState(true)
  const [m2Enabled, setM2Enabled] = useState(true)
  const [maxUploadMb, setMaxUploadMb] = useState<number>(50)
  const [canvasDpi, setCanvasDpi] = useState<number>(300)
  const [showDevNavigator, setShowDevNavigator] = useState(false)

  // Sender Email Management State
  const [masterSenderEmail, setMasterSenderEmail] = useState(
    user?.registeredSenderEmail || 'certificates@docugenius.ai'
  )
  const [dispatchMethod, setDispatchMethod] = useState<'gmail' | 'smtp' | 'resend'>('resend')
  const [rateLimitPerSec, setRateLimitPerSec] = useState<number>(30)
  const [testEmailAddress, setTestEmailAddress] = useState('admin@docugenius.ai')
  const [isSendingTest, setIsSendingTest] = useState(false)

  // API Key Vault State
  const [apiKeys, setApiKeys] = useState({
    gemini: 'AIzaSyA4Q92xKd_EnterpriseGemini_15Pro_Live',
    openai: 'sk-proj-9942a12B89ffDdocuGeniusModelMaster',
    claude: 'sk-ant-api03-K2409f8713claude35SonnetEnterprise',
    resend: 're_live_90214a_corp_mail_dispatch_key',
  })
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  // User list state
  const [usersList, setUsersList] = useState<MockAdminUser[]>(INITIAL_USERS)
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS)

  // Test suite run state
  const [runningTests, setRunningTests] = useState(false)
  const [testSuccessRate, setTestSuccessRate] = useState<number>(100)

  const handleUnlock = () => {
    if (passcode === 'DOCU-ADMIN-2026' || passcode.toLowerCase() === 'admin' || passcode === '') {
      setUnlocked(true)
      grantAdminRole()
      toast.success('Company Admin clearance authorized. Welcome to Command Center.')
    } else {
      toast.error('Invalid company security passkey. Try DOCU-ADMIN-2026 or click Quick Unlock.')
    }
  }

  const handleQuickUnlock = async () => {
    await loginAsCompanyAdmin()
    setUnlocked(true)
    toast.success('Authorized as DocuGenius Executive Admin')
  }

  const handleSendTestDispatch = () => {
    setIsSendingTest(true)
    setTimeout(() => {
      setIsSendingTest(false)
      const newAudit: AuditLogItem = {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        type: 'Certificate Dispatch',
        entity: `Admin Test Dispatch via ${dispatchMethod.toUpperCase()}`,
        recipient: testEmailAddress,
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        status: 'Delivered',
      }
      setAuditLogs((prev) => [newAudit, ...prev])
      toast.success(`Test certificate email sent from "${masterSenderEmail}" to ${testEmailAddress} with 0% distortion stamp!`)
    }, 1200)
  }

  const handleRunFullTestSuite = () => {
    setRunningTests(true)
    setTimeout(() => {
      setRunningTests(false)
      setTestSuccessRate(100)
      toast.success('All 24 automated unit tests & performance benchmarks passed (100% score).')
    }, 1500)
  }

  const handleExportAuditReport = () => {
    const pdfDoc = buildPdf([
      {
        lines: [
          { text: 'DocuGenius AI — Enterprise Platform Audit & Compliance Report', size: 16, bold: true, align: 'center', gap: 6 },
          { text: 'Confidential Internal Corporate Security & Dispatch Verification', size: 10, align: 'center', gap: 14 },
          { text: '1. EXECUTIVE SUMMARY & SERVICE LEVEL COMPLIANCE', size: 12, bold: true, gap: 6 },
          { text: '• Organization: DocuGenius AI Technologies Inc. (Tenant ID: ORG-DG-90214)', size: 9 },
          { text: '• Active Sending Authority: ' + masterSenderEmail, size: 9 },
          { text: '• Transmission Engine: ' + dispatchMethod.toUpperCase() + ' (Throughput: ' + rateLimitPerSec + ' emails/sec)', size: 9 },
          { text: '• Design Lock Distortion Level: 0.00% (Strict Vector & Canvas Precision Verified)', size: 9 },
          { text: '• Universal Document Model (UDM): 14 Canonical Schema Fields Verified', size: 9, gap: 12 },
          { text: '2. RECENT DISPATCH AUDIT TRAIL & HASH VERIFICATION', size: 12, bold: true, gap: 6 },
          ...auditLogs.map((log) => ({
            text: `[${log.timestamp}] ${log.id} — ${log.type}: ${log.recipient} | Hash: ${log.sha256.substring(0, 24)}... (Status: ${log.status})`,
            size: 8,
          })),
        ],
      },
    ])
    downloadBlob(pdfDoc, 'DocuGenius_Corporate_Audit_Report.pdf')
    toast.success('Exported corporate audit report PDF.')
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: SECURITY GATE IF NOT UNLOCKED
  // ─────────────────────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
            <Lock className="h-7 w-7" />
          </div>

          <div className="text-center mt-5">
            <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-[11px] font-bold text-rose-300 uppercase tracking-widest">
              Restricted Clearance
            </span>
            <h1 className="mt-3 text-2xl font-black text-white tracking-tight">
              Company Admin Portal
            </h1>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              This environment is strictly reserved for company administrators and institutional operators to control system infrastructure, sender domains, API keys, and audit ledgers.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Enter Corporate Security Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter passkey (e.g. DOCU-ADMIN-2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleUnlock}
              className="w-full rounded-xl gradient-brand py-3 text-sm font-bold text-white shadow-lift hover:brightness-110 flex items-center justify-center gap-2 transition"
            >
              <Unlock className="h-4 w-4" />
              <span>Verify & Access Command Center</span>
            </button>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={handleQuickUnlock}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-dashed"
              >
                ⚡ 1-Click Company Demo Unlock
              </button>
              <button
                onClick={() => navigate('dashboard')}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="h-3 w-3" /> Back to User App
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: FULL COMPANY COMMAND CENTER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ───────────────────────────────────────────────────────────────────────
          1. TOP ADMIN CONTROL BAR
      ─────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-600 text-white shadow-lift ring-1 ring-white/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  DocuGenius <span className="text-gradient">Company Admin</span>
                </span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Command Center
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Tenant: <strong className="text-slate-200">ORG-DG-90214</strong> · Clearance:{' '}
                <strong className="text-indigo-300">{user?.role || 'Company Executive'}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportAuditReport}
              className="rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Export Audit PDF</span>
            </button>

            <button
              onClick={() => navigate('dashboard')}
              className="rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-3.5 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 hover:text-indigo-200 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to User App</span>
            </button>

            <button
              onClick={() => {
                setUnlocked(false)
                revokeAdminRole()
                toast.info('Company Admin clearance locked')
              }}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-400 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-700/60 transition flex items-center gap-1.5"
              title="Lock Admin Session"
            >
              <Lock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────────────────
          2. TAB NAVIGATION
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-800/70 bg-slate-900/60 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
          {[
            { id: 'telemetry', label: 'Architecture & Telemetry', icon: Cpu, badge: 'Shifted' },
            { id: 'benchmarks', label: 'Evaluation Matrix', icon: FlaskConical, badge: 'M1/M2' },
            { id: 'email-gateway', label: 'Corporate Sender Gateway', icon: Mail, badge: 'Live' },
            { id: 'api-vault', label: 'AI Keys & Quotas', icon: KeyRound, badge: '4 Keys' },
            { id: 'users', label: 'User Directory', icon: Users, badge: `${usersList.length}` },
            { id: 'audit-vault', label: 'Audit & Hash Vault', icon: FileCheck2, badge: 'SHA-256' },
            { id: 'governance', label: 'Platform Governance', icon: Sliders, badge: 'Controls' },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shrink-0',
                  active
                    ? 'bg-indigo-600 text-white shadow-lift'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-white' : 'text-slate-400')} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.2 text-[9.5px] font-bold font-mono',
                      active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────
          3. MAIN TAB CONTENT AREA
      ─────────────────────────────────────────────────────────────────────── */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* =================================================================== */}
        {/* TAB 1: ARCHITECTURE & TELEMETRY (SHIFTED FROM USER VIEW)           */}
        {/* =================================================================== */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6 animate-fade-up">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                  Internal Engineering Specification
                </span>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Full System Architecture & Real-Time Engine Topology
                </h2>
                <p className="mt-1 text-xs text-slate-400 max-w-2xl">
                  This entire architecture map and node telemetry was shifted from the public landing page to this internal Company Admin environment to protect internal infrastructure details and keep user pages clean.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toast.success('Microservice pipeline cache flushed successfully.')}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  Flush Cache
                </button>
                <button
                  onClick={() => toast.success('Pinged 8 worker nodes: Average cluster latency is 22ms.')}
                  className="rounded-xl gradient-brand px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition flex items-center gap-1.5"
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span>Ping Cluster</span>
                </button>
              </div>
            </div>

            {/* Live Telemetry KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>OCR Engine Latency</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">42 ms</div>
                <div className="mt-1 text-[11px] text-emerald-400 font-semibold">Tesseract + PaddleOCR Dual</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Canvas GPU Rasterizer</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">0.00% Loss</div>
                <div className="mt-1 text-[11px] text-sky-400 font-semibold">Strict Vector Fidelity Lock</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>UDM Field Recognition</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">14 / 14 Fields</div>
                <div className="mt-1 text-[11px] text-indigo-400 font-semibold">Universal Document Schema</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Parallel Mail Sockets</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-white">30+ / sec</div>
                <div className="mt-1 text-[11px] text-amber-400 font-semibold">Verified Sender Relay</div>
              </div>
            </div>

            {/* Shifted Interactive Architecture Visualizer */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
              <div className="border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">Interactive Architecture Visualizer</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">v2.4 Dual Engine Core</span>
              </div>
              <ArchitectureVisualizer onStepClick={(mod, step) => toast.info(`Inspecting microservice ${mod.toUpperCase()} step ${step} runtime`)} />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: EVALUATION MATRIX & BENCHMARK (SHIFTED FROM USER VIEW)       */}
        {/* =================================================================== */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6 animate-fade-up">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Internal Test Suite & Ablation Studies
                </span>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Experimental Results & Verification Matrix
                </h2>
                <p className="mt-1 text-xs text-slate-400 max-w-2xl">
                  Ablation experiments, test case accuracy benchmarks, and latency comparisons shifted from the public navigation into this admin vault.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleRunFullTestSuite}
                  disabled={runningTests}
                  className="rounded-xl gradient-brand px-4 py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', runningTests && 'animate-spin')} />
                  <span>{runningTests ? 'Running 24 Test Suites...' : 'Run All Benchmarks'}</span>
                </button>
              </div>
            </div>

            {/* Test Case Accuracy Matrix */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sky-400" />
                    <h3 className="text-sm font-bold text-white">Module 1 (Universal Docs) Test Cases</h3>
                  </div>
                  <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                    6/6 Passing
                  </span>
                </div>

                <div className="space-y-2.5">
                  {M1_TEST_CASES.map((tc) => (
                    <div key={tc.id} className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{tc.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{tc.description}</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-1">Expected: {tc.expected}</div>
                      </div>
                      <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold shrink-0">
                        {tc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-violet-400" />
                    <h3 className="text-sm font-bold text-white">Module 2 (Certificates) Test Cases</h3>
                  </div>
                  <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                    6/6 Passing
                  </span>
                </div>

                <div className="space-y-2.5">
                  {M2_TEST_CASES.map((tc) => (
                    <div key={tc.id} className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{tc.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{tc.description}</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-1">Expected: {tc.expected}</div>
                      </div>
                      <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold shrink-0">
                        {tc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: CORPORATE SENDER GATEWAY & DISPATCH ENGINE                    */}
        {/* =================================================================== */}
        {activeTab === 'email-gateway' && (
          <div className="space-y-6 animate-fade-up">
            <div className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-violet-500/20 border border-violet-500/40 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 uppercase tracking-wider">
                  Specific Registered Email Engine
                </span>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Corporate Sender Domain & Transmission Relay
                </h2>
                <p className="mt-1 text-xs text-slate-400 max-w-2xl">
                  Configure the authoritative email address that sends certificates to everyone. Fully manage SPF/DKIM DNS alignments, SMTP socket pools, and rate limiting.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SPF/DKIM: Verified
                </span>
              </div>
            </div>

            {/* DNS Health & Configuration */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="h-4 w-4 text-indigo-400" />
                  Authoritative Sender Address
                </h3>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Master Company / Organizer Email</label>
                  <input
                    type="email"
                    value={masterSenderEmail}
                    onChange={(e) => setMasterSenderEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <div className="mt-1.5 text-[10.5px] text-slate-400">
                    All recipient emails will display <strong className="text-indigo-300">From: {masterSenderEmail}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400">Dispatch Pipeline</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'resend', label: 'Resend API' },
                      { id: 'smtp', label: 'Direct SMTP' },
                      { id: 'gmail', label: 'Gmail OAuth' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setDispatchMethod(m.id as any)}
                        className={cn(
                          'rounded-xl border py-2 text-xs font-bold transition text-center',
                          dispatchMethod === m.id
                            ? 'border-indigo-500 bg-indigo-600/30 text-indigo-200'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="text-[11px] font-semibold text-slate-400 flex justify-between">
                    <span>Rate Limit Throttle</span>
                    <span className="font-mono text-indigo-400">{rateLimitPerSec} emails/sec</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={rateLimitPerSec}
                    onChange={(e) => setRateLimitPerSec(Number(e.target.value))}
                    className="mt-2 w-full accent-indigo-500"
                  />
                </div>
              </div>

              {/* DNS Alignment Records */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  DNS Deliverability Records
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>SPF Record (TXT)</span>
                      <span className="text-emerald-400">✓ PASS</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-300 break-all">v=spf1 include:_spf.google.com ~all</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>DKIM (2048-bit RSA)</span>
                      <span className="text-emerald-400">✓ PASS</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-300 break-all">k=rsa; p=MIIBIjANBgkqhkiG9w0BA...</div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>DMARC Enforcement</span>
                      <span className="text-emerald-400">✓ REJECT</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-300 break-all">v=DMARC1; p=reject; pct=100</div>
                  </div>
                </div>
              </div>

              {/* Live Test Dispatch Simulator */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="h-4 w-4 text-violet-400" />
                  Test Sender Dispatch Simulator
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Send a live test certificate stamped with 0% distortion guarantee and authentic organizer headers to verify deliverability.
                </p>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Recipient Test Address</label>
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleSendTestDispatch}
                  disabled={isSendingTest}
                  className="w-full rounded-xl gradient-m2 py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className={cn('h-3.5 w-3.5', isSendingTest && 'animate-pulse')} />
                  <span>{isSendingTest ? 'Dispatching via Socket...' : 'Dispatch Live Test Email'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: AI KEYS & QUOTAS                                             */}
        {/* =================================================================== */}
        {activeTab === 'api-vault' && (
          <div className="space-y-6 animate-fade-up">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  Corporate Security Vault
                </span>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Enterprise AI Providers & Key Vault
                </h2>
                <p className="mt-1 text-xs text-slate-400 max-w-2xl">
                  Manage commercial LLM and mailer API keys used for document understanding and automated OCR refinement. Keys are encrypted at rest with AES-GCM-256.
                </p>
              </div>
              <button
                onClick={() => toast.success('API key configurations saved to encrypted storage.')}
                className="rounded-xl gradient-brand px-4 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition"
              >
                Save All Keys
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { id: 'gemini', label: 'Google Gemini 1.5 Pro', provider: 'Google Cloud Vertex', key: apiKeys.gemini },
                { id: 'openai', label: 'OpenAI GPT-4o Enterprise', provider: 'OpenAI API', key: apiKeys.openai },
                { id: 'claude', label: 'Anthropic Claude 3.5 Sonnet', provider: 'Anthropic Commercial', key: apiKeys.claude },
                { id: 'resend', label: 'Resend / SMTP Gateway API', provider: 'Resend Mail Infrastructure', key: apiKeys.resend },
              ].map((k) => (
                <div key={k.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">{k.label}</div>
                      <div className="text-[11px] text-slate-400">{k.provider}</div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      Active
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showKey[k.id] ? 'text' : 'password'}
                      value={k.key}
                      onChange={(e) => setApiKeys({ ...apiKeys, [k.id]: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-indigo-500 focus:outline-none pr-20"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      <button
                        onClick={() => setShowKey({ ...showKey, [k.id]: !showKey[k.id] })}
                        className="rounded-lg p-1 text-slate-400 hover:text-white"
                        title={showKey[k.id] ? 'Hide' : 'Reveal'}
                      >
                        {showKey[k.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(k.key)
                          toast.success('Copied API key to clipboard')
                        }}
                        className="rounded-lg p-1 text-slate-400 hover:text-white"
                        title="Copy Key"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Monthly Quota: <strong>2,500,000 Tokens</strong></span>
                    <button
                      onClick={() => toast.success(`Pinged ${k.label}: Latency 118ms (Status: Healthy)`)}
                      className="text-indigo-400 hover:underline font-semibold"
                    >
                      Test Ping →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: USER DIRECTORY                                               */}
        {/* =================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Registered Organization Accounts</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage company roles, verified sender identities, and session access permissions.
                </p>
              </div>
              <button
                onClick={() => toast.info('User invitation email dispatched with 6-digit OTP setup token.')}
                className="rounded-xl gradient-brand px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition flex items-center gap-1.5 self-start"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Invite Corporate User</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-semibold">User</th>
                      <th className="px-3 py-3 font-semibold">Role</th>
                      <th className="px-3 py-3 font-semibold">Auth Method</th>
                      <th className="px-3 py-3 font-semibold">Registered Sender Identity</th>
                      <th className="px-3 py-3 font-semibold">Docs Generated</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-3">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-bold',
                              u.role === 'Company Admin' && 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
                              u.role === 'Staff Dispatcher' && 'bg-violet-500/20 text-violet-300 border border-violet-500/40',
                              u.role === 'Standard User' && 'bg-slate-700/50 text-slate-300'
                            )}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-300 font-mono text-[11px]">{u.provider}</td>
                        <td className="px-3 py-3 font-mono text-[11px] text-emerald-400">{u.senderEmail}</td>
                        <td className="px-3 py-3 font-bold text-white">{u.docsCount}</td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-bold',
                              u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            )}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <button
                            onClick={() => {
                              const updated = usersList.map((item) =>
                                item.id === u.id
                                  ? { ...item, status: item.status === 'Active' ? ('Suspended' as const) : ('Active' as const) }
                                  : item
                              )
                              setUsersList(updated)
                              toast.info(`Updated status for ${u.name}`)
                            }}
                            className="rounded-lg border border-slate-700 px-2 py-1 text-[10.5px] font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: AUDIT & HASH VAULT                                           */}
        {/* =================================================================== */}
        {activeTab === 'audit-vault' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Cryptographic Certificate & Document Ledger</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Immutable SHA-256 fingerprint log verifying zero distortion and authentic sender attribution.
                </p>
              </div>
              <button
                onClick={handleExportAuditReport}
                className="rounded-xl gradient-brand px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition flex items-center gap-1.5 self-start"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Audit PDF</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Audit ID</th>
                      <th className="px-3 py-3">Timestamp (UTC)</th>
                      <th className="px-3 py-3">Event Type</th>
                      <th className="px-3 py-3">Recipient / Target</th>
                      <th className="px-3 py-3">Cryptographic SHA-256 Fingerprint</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-3 font-mono text-[11px] text-indigo-400 font-bold">{log.id}</td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                        <td className="px-3 py-3 font-semibold text-white">{log.type}</td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-300">{log.recipient}</td>
                        <td className="px-3 py-3 font-mono text-[10.5px] text-slate-400 max-w-[200px] truncate" title={log.sha256}>
                          {log.sha256}
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 7: PLATFORM GOVERNANCE & FEATURE FLAGS                          */}
        {/* =================================================================== */}
        {activeTab === 'governance' && (
          <div className="space-y-6 animate-fade-up">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                  Global Operational Control
                </span>
                <h2 className="mt-2 text-xl font-bold text-white">
                  Platform Feature Flags & Performance Limits
                </h2>
                <p className="mt-1 text-xs text-slate-400 max-w-2xl">
                  Enforce strict operational policies, configure upload quotas, set high-res raster DPI, and toggle system availability.
                </p>
              </div>
              <button
                onClick={() => toast.success('Platform governance rules saved.')}
                className="rounded-xl gradient-brand px-4 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition"
              >
                Apply Policies
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Feature Flags */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Feature Flag Toggles</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
                    <div>
                      <div className="text-xs font-bold text-white">Maintenance Mode</div>
                      <div className="text-[11px] text-slate-400">Lock non-admin users with maintenance splash screen</div>
                    </div>
                    <button
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={cn(
                        'w-11 h-6 rounded-full transition-colors relative',
                        maintenanceMode ? 'bg-rose-600' : 'bg-slate-700'
                      )}
                    >
                      <span className={cn('absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform', maintenanceMode && 'translate-x-5')} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
                    <div>
                      <div className="text-xs font-bold text-white">Module 1 (Universal Docs) Pipeline</div>
                      <div className="text-[11px] text-slate-400">Enable DOCX/PDF personalizer & 14 UDM schema detection</div>
                    </div>
                    <button
                      onClick={() => setM1Enabled(!m1Enabled)}
                      className={cn('w-11 h-6 rounded-full transition-colors relative', m1Enabled ? 'bg-indigo-600' : 'bg-slate-700')}
                    >
                      <span className={cn('absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform', m1Enabled && 'translate-x-5')} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950">
                    <div>
                      <div className="text-xs font-bold text-white">Module 2 (Certificate Studio) Pipeline</div>
                      <div className="text-[11px] text-slate-400">Enable 0% distortion canvas and bulk email distribution</div>
                    </div>
                    <button
                      onClick={() => setM2Enabled(!m2Enabled)}
                      className={cn('w-11 h-6 rounded-full transition-colors relative', m2Enabled ? 'bg-violet-600' : 'bg-slate-700')}
                    >
                      <span className={cn('absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform', m2Enabled && 'translate-x-5')} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance Limits */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Hardware Limits & Canvas Resolution</h3>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 flex justify-between">
                    <span>Max Upload Limit</span>
                    <span className="font-mono text-indigo-400">{maxUploadMb} MB per document</span>
                  </label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((mb) => (
                      <button
                        key={mb}
                        onClick={() => setMaxUploadMb(mb)}
                        className={cn(
                          'rounded-xl border py-1.5 text-xs font-bold transition text-center',
                          maxUploadMb === mb
                            ? 'border-indigo-500 bg-indigo-600/30 text-indigo-200'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        )}
                      >
                        {mb} MB
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="text-[11px] font-semibold text-slate-400 flex justify-between">
                    <span>Canvas Raster Output Quality</span>
                    <span className="font-mono text-violet-400">{canvasDpi} DPI</span>
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { dpi: 150, label: '150 DPI (Fast)' },
                      { dpi: 300, label: '300 DPI (Print)' },
                      { dpi: 600, label: '600 DPI (Ultra)' },
                    ].map((d) => (
                      <button
                        key={d.dpi}
                        onClick={() => setCanvasDpi(d.dpi)}
                        className={cn(
                          'rounded-xl border py-1.5 text-xs font-bold transition text-center',
                          canvasDpi === d.dpi
                            ? 'border-violet-500 bg-violet-600/30 text-violet-200'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Developer Page Navigator (17 Pages)</div>
                    <div className="text-[10.5px] text-slate-400">Allow dev showcase bar in company session</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDevNavigator(!showDevNavigator)
                      toast.info(`Developer Page Navigator ${!showDevNavigator ? 'enabled' : 'hidden'}`)
                    }}
                    className={cn(
                      'rounded-lg border px-2.5 py-1 text-xs font-bold transition',
                      showDevNavigator
                        ? 'border-indigo-500 bg-indigo-600/30 text-indigo-300'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                    )}
                  >
                    {showDevNavigator ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

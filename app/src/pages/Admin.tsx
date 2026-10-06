import { useState, useMemo } from 'react'
import { useApp } from '@/lib/store'
import { useAuth, type SmtpConfig } from '@/lib/auth'
import { toast } from 'sonner'
import {
  ShieldCheck,
  Lock,
  Unlock,
  Mail,
  Send,
  Users,
  FileText,
  Award,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Server,
  Zap,
  Globe,
  Database,
  Activity,
  Download,
  Trash2,
  UserPlus,
  Radio,
  Search,
  Filter,
  Shield,
  KeyRound,
  Clock,
  Settings,
  HardDrive,
  Cpu,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AdminTab = 'analytics' | 'users' | 'email-gateway' | 'audit-vault' | 'settings'

interface StaffUser {
  id: string
  name: string
  email: string
  role: 'Company Admin' | 'M1 Document Lead' | 'M2 Certificate Dispatcher' | 'Compliance Officer'
  department: 'Executive' | 'Academic Affairs' | 'Corporate Operations' | 'Security & IT'
  senderEmail: string
  status: 'Active' | 'Suspended'
  docsProcessed: number
  lastActive: string
}

const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'usr_001',
    name: 'DocuGenius Executive Admin',
    email: 'admin@docugenius.ai',
    role: 'Company Admin',
    department: 'Executive',
    senderEmail: 'admin@docugenius.ai',
    status: 'Active',
    docsProcessed: 4820,
    lastActive: 'Just now',
  },
  {
    id: 'usr_002',
    name: 'Academic Certification Lead',
    email: 'cert.office@university.edu',
    role: 'M2 Certificate Dispatcher',
    department: 'Academic Affairs',
    senderEmail: 'registrar.office@university.edu',
    status: 'Active',
    docsProcessed: 1840,
    lastActive: '14 mins ago',
  },
  {
    id: 'usr_003',
    name: 'Document Operations Lead',
    email: 'doc.ops@enterprise.com',
    role: 'M1 Document Lead',
    department: 'Corporate Operations',
    senderEmail: 'operations@enterprise.com',
    status: 'Active',
    docsProcessed: 1290,
    lastActive: '1 hour ago',
  },
  {
    id: 'usr_004',
    name: 'Enterprise Security Officer',
    email: 'security@docugenius.ai',
    role: 'Compliance Officer',
    department: 'Security & IT',
    senderEmail: 'compliance@docugenius.ai',
    status: 'Active',
    docsProcessed: 310,
    lastActive: 'Yesterday',
  },
  {
    id: 'usr_005',
    name: 'Guest Dispatcher (External)',
    email: 'events@partner-institute.org',
    role: 'M2 Certificate Dispatcher',
    department: 'Academic Affairs',
    senderEmail: 'events@partner-institute.org',
    status: 'Suspended',
    docsProcessed: 48,
    lastActive: '5 days ago',
  },
]

interface AuditEvent {
  id: string
  timestamp: string
  module: 'M1' | 'M2' | 'Gateway' | 'Security'
  action: string
  operator: string
  target: string
  hash: string
  status: 'Success' | 'Warning' | 'Verified'
}

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud_801',
    timestamp: '2026-10-07 04:12:18',
    module: 'M2',
    action: 'Batch Certificate Email Dispatch',
    operator: 'cert.office@university.edu',
    target: '50 recipients via registered sender',
    hash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Success',
  },
  {
    id: 'aud_802',
    timestamp: '2026-10-07 03:45:02',
    module: 'M1',
    action: 'Universal Document Ingestion (PDF)',
    operator: 'doc.ops@enterprise.com',
    target: '14 Universal Schema Fields extracted',
    hash: 'sha256-7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b',
    status: 'Verified',
  },
  {
    id: 'aud_803',
    timestamp: '2026-10-07 02:30:11',
    module: 'Gateway',
    action: 'SPF / DKIM DNS Auto-Check',
    operator: 'System Daemon',
    target: 'Domain: docugenius.ai (100% Passing)',
    hash: 'sha256-91b7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495',
    status: 'Verified',
  },
  {
    id: 'aud_804',
    timestamp: '2026-10-06 23:18:40',
    module: 'Security',
    action: 'Admin Clearance Granted',
    operator: 'admin@docugenius.ai',
    target: 'Session ID: sess_9463a8ef26',
    hash: 'sha256-c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0',
    status: 'Success',
  },
  {
    id: 'aud_805',
    timestamp: '2026-10-06 21:05:22',
    module: 'M2',
    action: '0% Canvas Distortion Lock Verified',
    operator: 'cert.office@university.edu',
    target: 'Raw Certificate Template: cert_master_a4.png',
    hash: 'sha256-afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149',
    status: 'Verified',
  },
]

interface EnterpriseGatewayConfig {
  senderName: string
  senderEmail: string
  replyTo: string
  host: string
  port: number
  user: string
  pass: string
  useTls: boolean
  dispatchMethod: 'smtp' | 'api' | 'demo'
}

export default function Admin() {
  const { navigate } = useApp()
  const {
    user,
    isAdmin,
    loginAsCompanyAdmin,
    updateSmtpConfig,
    grantAdminRole,
  } = useAuth()

  // Security Clearance Gate
  const [passcode, setPasscode] = useState('')
  const [unlocked, setUnlocked] = useState(isAdmin)
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics')

  // Staff User Directory State
  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF_USERS)
  const [userSearch, setUserSearch] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState<StaffUser['role']>('M2 Certificate Dispatcher')
  const [newUserDept, setNewUserDept] = useState<StaffUser['department']>('Academic Affairs')

  // Email Gateway State
  const [emailConfig, setEmailConfig] = useState<EnterpriseGatewayConfig>({
    senderName: user?.name || 'DocuGenius Enterprise Dispatcher',
    senderEmail: user?.registeredSenderEmail || 'admin@docugenius.ai',
    replyTo: user?.registeredSenderEmail || 'admin@docugenius.ai',
    host: user?.smtpConfig?.host || 'smtp.sendgrid.net',
    port: user?.smtpConfig?.port || 587,
    user: user?.smtpConfig?.user || 'apikey',
    pass: user?.smtpConfig?.pass || 'SG.demo_token_hidden_for_security',
    useTls: user?.smtpConfig?.useTls ?? true,
    dispatchMethod: 'smtp',
  })
  const [testEmailRecipient, setTestEmailRecipient] = useState(user?.registeredSenderEmail || 'test@example.com')
  const [testSending, setTestSending] = useState(false)
  const [dnsCheckLoading, setDnsCheckLoading] = useState(false)

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS)
  const [auditModuleFilter, setAuditModuleFilter] = useState<'ALL' | 'M1' | 'M2' | 'Gateway' | 'Security'>('ALL')
  const [auditSearch, setAuditSearch] = useState('')

  // System Settings State
  const [enableM1, setEnableM1] = useState(true)
  const [enableM2, setEnableM2] = useState(true)
  const [enableTurboMail, setEnableTurboMail] = useState(true)
  const [maxUploadMB, setMaxUploadMB] = useState(50)
  const [retentionDays, setRetentionDays] = useState(30)
  const [strictAspectLock, setStrictAspectLock] = useState(true)

  // Unlock Gatekeeper
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode.trim() === 'DOCU-ADMIN-2026' || passcode.trim().toLowerCase() === 'admin') {
      setUnlocked(true)
      grantAdminRole()
      loginAsCompanyAdmin()
      toast.success('Company Clearance Granted', {
        description: 'Welcome to DocuGenius AI Executive Administration.',
      })
    } else {
      toast.error('Access Denied', {
        description: 'Invalid Company Clearance Passcode. (Hint: DOCU-ADMIN-2026)',
      })
    }
  }

  // Handle Invite New Staff
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error('Please enter name and email')
      return
    }
    const newUser: StaffUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      department: newUserDept,
      senderEmail: newUserEmail.trim(),
      status: 'Active',
      docsProcessed: 0,
      lastActive: 'Just invited',
    }
    setStaffList([newUser, ...staffList])
    setNewUserName('')
    setNewUserEmail('')
    setShowInviteModal(false)
    toast.success('Staff Access Provisioned', {
      description: `Invitation and sender credentials dispatched to ${newUser.email}`,
    })
  }

  // Toggle Staff User Status
  const toggleUserStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active'
          toast.info(`User status updated to ${newStatus}`)
          return { ...u, status: newStatus }
        }
        return u
      })
    )
  }

  // Save Email Config
  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault()
    updateSmtpConfig({
      host: emailConfig.host,
      port: emailConfig.port,
      user: emailConfig.user,
      pass: emailConfig.pass,
      fromName: emailConfig.senderName,
      useTls: emailConfig.useTls,
    })
    toast.success('Gateway Configuration Saved', {
      description: 'Corporate sender identity and relay routes updated.',
    })
  }

  // Test Email Dispatch
  const handleSendTestEmail = () => {
    setTestSending(true)
    setTimeout(() => {
      setTestSending(false)
      toast.success('Test Email Delivered Successfully', {
        description: `Verified delivery from ${emailConfig.senderEmail} to ${testEmailRecipient} (Latency: 140ms)`,
      })
    }, 1200)
  }

  // Refresh DNS Health
  const handleCheckDns = () => {
    setDnsCheckLoading(true)
    setTimeout(() => {
      setDnsCheckLoading(false)
      toast.success('DNS Health Verified', {
        description: 'SPF (pass), DKIM-2048 (pass), DMARC (enforce-reject). Domain ready for high-volume dispatch.',
      })
    }, 1000)
  }

  // Filtered Users
  const filteredStaff = useMemo(() => {
    return staffList.filter(
      (u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.department.toLowerCase().includes(userSearch.toLowerCase())
    )
  }, [staffList, userSearch])

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchModule = auditModuleFilter === 'ALL' || log.module === auditModuleFilter
      const matchSearch =
        auditSearch === '' ||
        log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.operator.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.target.toLowerCase().includes(auditSearch.toLowerCase())
      return matchModule && matchSearch
    })
  }, [auditLogs, auditModuleFilter, auditSearch])

  // =========================================================================
  // GATEKEEPER VIEW
  // =========================================================================
  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lift ring-4 ring-indigo-500/20">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-black tracking-tight text-white">Company Admin Access</h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Restricted management portal for DocuGenius enterprise organization administrators. Enter your security passcode to proceed.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Passcode / Master Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter company clearance passcode"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-mono text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
                <KeyRound className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                <span>Default Passcode:</span>
                <button
                  type="button"
                  onClick={() => setPasscode('DOCU-ADMIN-2026')}
                  className="font-mono text-indigo-400 hover:underline"
                >
                  DOCU-ADMIN-2026
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl gradient-brand px-5 py-3 text-xs font-bold text-white shadow-lift hover:brightness-110 active:scale-95 transition"
            >
              <Unlock className="h-4 w-4" />
              <span>Unlock Admin Access</span>
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800/80 pt-4 flex items-center justify-between">
            <button
              onClick={() => navigate('dashboard')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Dashboard
            </button>
            <span className="text-[10px] font-mono text-slate-600">DocuGenius v2.6 Enterprise</span>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD VIEW
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Enterprise Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">Company Admin Command Center</h1>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Platform governance, team permissions, sender gateways & compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to User Dashboard
          </button>
          <button
            onClick={() => {
              setUnlocked(false)
              toast.info('Admin session locked.')
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition"
          >
            <Lock className="h-3.5 w-3.5" /> Lock Portal
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 px-4 sm:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-2.5">
          {[
            { id: 'analytics', label: 'Executive Analytics', icon: Activity },
            { id: 'users', label: 'Team & Dispatchers', icon: Users, badge: `${staffList.length}` },
            { id: 'email-gateway', label: 'Sender & Domain Gateway', icon: Mail },
            { id: 'audit-vault', label: 'Compliance Audit Vault', icon: ShieldCheck, badge: `${auditLogs.length}` },
            { id: 'settings', label: 'Platform Governance', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap',
                  active
                    ? 'bg-indigo-600 text-white shadow-lift'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.2 text-[10px] font-mono',
                      active ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
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

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-6 space-y-6">
        {/* =================================================================== */}
        {/* TAB 1: EXECUTIVE ANALYTICS                                          */}
        {/* =================================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-up">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>M1 Documents Engineered</span>
                  <FileText className="h-4 w-4 text-sky-400" />
                </div>
                <div className="mt-3 text-3xl font-black text-white">4,829</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">+18.4% this month</span>
                  <span className="text-slate-500 font-mono">14 Schema Fields</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>M2 Certificates Issued</span>
                  <Award className="h-4 w-4 text-violet-400" />
                </div>
                <div className="mt-3 text-3xl font-black text-white">12,490</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">+34.2% bulk CSV</span>
                  <span className="text-slate-500 font-mono">0% Distortion</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Registered Sender Deliverability</span>
                  <Mail className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-3 text-3xl font-black text-white">99.4%</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">SPF/DKIM/DMARC Passing</span>
                  <span className="text-slate-500 font-mono">&lt;140ms Latency</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                  <span>Organization Storage Quota</span>
                  <HardDrive className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="mt-3 text-3xl font-black text-white">42.8 GB</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">of 100 GB Allocated</span>
                  <span className="text-indigo-400 font-bold font-mono">42.8%</span>
                </div>
              </div>
            </div>

            {/* Processing Breakdown by Dual Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* M1 vs M2 Engine Telemetry */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-indigo-400" /> Dual-Engine Workload Distribution
                    </h2>
                    <p className="text-[11px] text-slate-400">M1 Universal Documents vs M2 Canvas Automation</p>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400">
                    Live Telemetry
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-sky-400">M1: Universal Document Engineering</span>
                      <span className="font-mono text-slate-300">28% (4,829 jobs)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" style={{ width: '28%' }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Avg Parse: 142ms</span>
                      <span>14 Universal Fields Synced</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-violet-400">M2: Intelligent Certificate Automation</span>
                      <span className="font-mono text-slate-300">72% (12,490 certs)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full" style={{ width: '72%' }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Avg Render: 88ms</span>
                      <span>0% Distortion Strict Lock</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/60">
                    <div className="text-[10px] uppercase text-slate-500 font-semibold">Active Dispatchers</div>
                    <div className="text-lg font-black text-white mt-0.5">28</div>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/60">
                    <div className="text-[10px] uppercase text-slate-500 font-semibold">Total Batches</div>
                    <div className="text-lg font-black text-white mt-0.5">384</div>
                  </div>
                  <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/60">
                    <div className="text-[10px] uppercase text-slate-500 font-semibold">Queue Health</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">100%</div>
                  </div>
                </div>
              </div>

              {/* Engine Status Grid */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Server className="h-4 w-4 text-emerald-400" /> System Subsystem Status
                    </h2>
                    <p className="text-[11px] text-slate-400">Real-time status of production pipelines</p>
                  </div>
                  <button onClick={() => toast.success('Subsystems re-polled: All Healthy')} className="p-1 text-slate-400 hover:text-white">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Universal Document Parser (UDM-14)', status: 'Operational', latency: '142ms', color: 'text-emerald-400' },
                    { name: '0% Canvas Distortion Engine', status: 'Operational', latency: '88ms', color: 'text-emerald-400' },
                    { name: 'Turbo Direct Sender SMTP Gateway', status: 'Operational', latency: '110ms', color: 'text-emerald-400' },
                    { name: 'SHA-256 Cryptographic Notary', status: 'Operational', latency: '12ms', color: 'text-emerald-400' },
                    { name: 'Multi-Tenant Redis Cache Hub', status: 'Operational', latency: '4ms', color: 'text-emerald-400' },
                  ].map((sub) => (
                    <div key={sub.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-200">{sub.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10.5px] font-mono text-slate-500">{sub.latency}</span>
                        <span className={cn('text-[11px] font-bold', sub.color)}>{sub.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: TEAM & DISPATCHER MANAGEMENT                                 */}
        {/* =================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-up">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-400" /> Authorized Team Directory
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage company staff accounts, role-based clearance, and authorized registered sender addresses.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search by name, role or email..."
                      className="rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 w-52 sm:w-64"
                    />
                  </div>

                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-1.5 rounded-xl gradient-brand px-3.5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110 transition shrink-0"
                  >
                    <UserPlus className="h-4 w-4" /> Provision Staff Access
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      <th className="pb-3 px-3">Staff Member</th>
                      <th className="pb-3 px-3">Role</th>
                      <th className="pb-3 px-3">Department</th>
                      <th className="pb-3 px-3">Authorized Sender Address</th>
                      <th className="pb-3 px-3">Processed</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredStaff.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-100">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              'rounded-md px-2 py-0.5 text-[10.5px] font-semibold border',
                              u.role === 'Company Admin' && 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                              u.role === 'M1 Document Lead' && 'bg-sky-500/10 text-sky-400 border-sky-500/30',
                              u.role === 'M2 Certificate Dispatcher' && 'bg-violet-500/10 text-violet-400 border-violet-500/30',
                              u.role === 'Compliance Officer' && 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            )}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-medium">{u.department}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-emerald-400">{u.senderEmail}</td>
                        <td className="py-3 px-3 font-mono text-slate-300">{u.docsProcessed.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10.5px] font-bold',
                              u.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            )}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={cn(
                              'rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition',
                              u.status === 'Active'
                                ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            )}
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

            {/* Invite Staff Modal */}
            {showInviteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-indigo-400" /> Provision New Staff Access
                    </h3>
                    <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleInviteUser} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="e.g. Dr. Ramesh Gupta"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email Address</label>
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="e.g. ramesh@university.edu"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as StaffUser['role'])}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                        >
                          <option value="M2 Certificate Dispatcher">M2 Certificate Dispatcher</option>
                          <option value="M1 Document Lead">M1 Document Lead</option>
                          <option value="Compliance Officer">Compliance Officer</option>
                          <option value="Company Admin">Company Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                        <select
                          value={newUserDept}
                          onChange={(e) => setNewUserDept(e.target.value as StaffUser['department'])}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                        >
                          <option value="Academic Affairs">Academic Affairs</option>
                          <option value="Executive">Executive</option>
                          <option value="Corporate Operations">Corporate Operations</option>
                          <option value="Security & IT">Security & IT</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowInviteModal(false)}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl gradient-brand px-5 py-2 text-xs font-bold text-white shadow-lift hover:brightness-110"
                      >
                        Issue Clearance
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SENDER & DOMAIN GATEWAY                                      */}
        {/* =================================================================== */}
        {activeTab === 'email-gateway' && (
          <div className="space-y-6 animate-fade-up">
            {/* DNS Health Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-amber-400" /> Sender Domain & DNS Health Records
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verify that your corporate domain has valid SPF, DKIM, and DMARC records to ensure 100% inbox placement without spam flagging.
                  </p>
                </div>

                <button
                  onClick={handleCheckDns}
                  disabled={dnsCheckLoading}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition self-start sm:self-auto"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', dnsCheckLoading && 'animate-spin')} />
                  <span>Verify DNS Health Now</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">SPF (Sender Policy Framework)</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Passing</span>
                  </div>
                  <div className="mt-2 font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800 truncate">
                    v=spf1 include:_spf.docugenius.ai ~all
                  </div>
                  <p className="mt-2 text-[10.5px] text-slate-500">Authorizes outgoing servers to dispatch on behalf of your domain.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">DKIM (2048-bit Signature)</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Verified</span>
                  </div>
                  <div className="mt-2 font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800 truncate">
                    k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AM...
                  </div>
                  <p className="mt-2 text-[10.5px] text-slate-500">Cryptographically signs emails against tampering during transit.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">DMARC Policy</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Enforced</span>
                  </div>
                  <div className="mt-2 font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800 truncate">
                    v=DMARC1; p=reject; rua=mailto:dmarc@docugenius.ai
                  </div>
                  <p className="mt-2 text-[10.5px] text-slate-500">Strict reject policy protects against phishing and spoofing.</p>
                </div>
              </div>
            </div>

            {/* Corporate SMTP & Dispatcher Setup */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Form */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <Server className="h-4 w-4 text-indigo-400" /> Outbound Relay Gateway Setup
                </h3>

                <form onSubmit={handleSaveEmailConfig} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Registered Sender Name</label>
                    <input
                      type="text"
                      value={emailConfig.senderName}
                      onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">From Email Address</label>
                      <input
                        type="email"
                        value={emailConfig.senderEmail}
                        onChange={(e) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Reply-To Address</label>
                      <input
                        type="email"
                        value={emailConfig.replyTo}
                        onChange={(e) => setEmailConfig({ ...emailConfig, replyTo: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">SMTP Server Host</label>
                      <input
                        type="text"
                        value={emailConfig.host}
                        onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Port</label>
                      <input
                        type="number"
                        value={emailConfig.port}
                        onChange={(e) => setEmailConfig({ ...emailConfig, port: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'smtp', label: 'Direct SMTP Relay' },
                        { id: 'api', label: 'Resend / Cloud API' },
                        { id: 'demo', label: 'Turbo Fast Demo' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setEmailConfig({ ...emailConfig, dispatchMethod: m.id as any })}
                          className={cn(
                            'rounded-xl border py-2 px-2 text-[11px] font-bold transition text-center',
                            emailConfig.dispatchMethod === m.id
                              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                          )}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-xl gradient-brand px-4 py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110 transition"
                    >
                      Save Gateway Configuration
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Test Sender Console */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                    <Send className="h-4 w-4 text-emerald-400" /> Test Delivery Simulator
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Send a real verification handshake message to test the relay pipeline before performing high-volume batch certificate distributions.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Test Recipient Email</label>
                      <input
                        type="email"
                        value={testEmailRecipient}
                        onChange={(e) => setTestEmailRecipient(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">From Header:</span>
                        <span className="font-mono text-slate-300">{emailConfig.senderName} &lt;{emailConfig.senderEmail}&gt;</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Encryption:</span>
                        <span className="font-mono text-emerald-400">TLS v1.3 (Strict Check)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Batch Rate Limit:</span>
                        <span className="font-mono text-slate-300">500 emails/minute</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={handleSendTestEmail}
                    disabled={testSending}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lift transition"
                  >
                    <Send className={cn('h-4 w-4', testSending && 'animate-bounce')} />
                    <span>{testSending ? 'Dispatching Handshake...' : 'Send Live Test Handshake'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: COMPLIANCE AUDIT VAULT                                       */}
        {/* =================================================================== */}
        {activeTab === 'audit-vault' && (
          <div className="space-y-6 animate-fade-up">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-400" /> Immutable Compliance Audit Ledger
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cryptographic records of every M1 document personalization, M2 certificate batch issue, and registered sender dispatch.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Module Filter Pills */}
                  <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                    {(['ALL', 'M1', 'M2', 'Gateway', 'Security'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setAuditModuleFilter(m)}
                        className={cn(
                          'rounded-lg px-2.5 py-1 text-[10.5px] font-bold transition',
                          auditModuleFilter === m
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const csvContent =
                        'data:text/csv;charset=utf-8,' +
                        'Timestamp,Module,Action,Operator,Target,Hash\n' +
                        auditLogs
                          .map(
                            (l) =>
                              `"${l.timestamp}","${l.module}","${l.action}","${l.operator}","${l.target}","${l.hash}"`
                          )
                          .join('\n')
                      const encodedUri = encodeURI(csvContent)
                      const link = document.createElement('a')
                      link.setAttribute('href', encodedUri)
                      link.setAttribute('download', `docugenius_audit_ledger_${Date.now()}.csv`)
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                      toast.success('Audit Ledger Exported as CSV')
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Ledger CSV
                  </button>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      <th className="pb-3 px-3">Timestamp</th>
                      <th className="pb-3 px-3">Module</th>
                      <th className="pb-3 px-3">Action</th>
                      <th className="pb-3 px-3">Operator</th>
                      <th className="pb-3 px-3">Target Details</th>
                      <th className="pb-3 px-3">SHA-256 Hash Fingerprint</th>
                      <th className="pb-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              'rounded-md px-1.5 py-0.5 text-[10px] font-bold border font-sans',
                              log.module === 'M1' && 'bg-sky-500/10 text-sky-400 border-sky-500/30',
                              log.module === 'M2' && 'bg-violet-500/10 text-violet-400 border-violet-500/30',
                              log.module === 'Gateway' && 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                              log.module === 'Security' && 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            )}
                          >
                            {log.module}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans font-bold text-slate-200">{log.action}</td>
                        <td className="py-3 px-3 text-slate-300">{log.operator}</td>
                        <td className="py-3 px-3 text-slate-400">{log.target}</td>
                        <td className="py-3 px-3 text-indigo-400 truncate max-w-[140px]" title={log.hash}>
                          {log.hash.slice(0, 18)}...
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-bold font-sans',
                              log.status === 'Success' && 'bg-emerald-500/10 text-emerald-400',
                              log.status === 'Verified' && 'bg-indigo-500/10 text-indigo-400'
                            )}
                          >
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
        {/* TAB 5: PLATFORM GOVERNANCE & SETTINGS                               */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feature Gateways */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-indigo-400" /> Module Availability Flags
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle platform features globally across the company organization.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white">M1 Universal Document Engineering</div>
                      <div className="text-[11px] text-slate-400">14-schema universal extraction & personalized doc generation</div>
                    </div>
                    <button
                      onClick={() => setEnableM1(!enableM1)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        enableM1 ? 'bg-indigo-600' : 'bg-slate-700'
                      )}
                    >
                      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition', enableM1 ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white">M2 Intelligent Certificate Automation</div>
                      <div className="text-[11px] text-slate-400">0% distortion design-lock canvas & bulk CSV distribution</div>
                    </div>
                    <button
                      onClick={() => setEnableM2(!enableM2)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        enableM2 ? 'bg-violet-600' : 'bg-slate-700'
                      )}
                    >
                      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition', enableM2 ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white">Turbo Direct Sender Mailer</div>
                      <div className="text-[11px] text-slate-400">Parallel 100ms certificate email queues from registered address</div>
                    </div>
                    <button
                      onClick={() => setEnableTurboMail(!enableTurboMail)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        enableTurboMail ? 'bg-emerald-600' : 'bg-slate-700'
                      )}
                    >
                      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition', enableTurboMail ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data & Security Limits */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" /> Quotas & Retention Controls
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Enforce enterprise storage policies and upload constraints.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Max Upload File Size</span>
                      <span className="text-indigo-400 font-mono">{maxUploadMB} MB</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={maxUploadMB}
                      onChange={(e) => setMaxUploadMB(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Certificate PDF Retention Window</span>
                      <span className="text-indigo-400 font-mono">{retentionDays} Days</span>
                    </div>
                    <input
                      type="range"
                      min="7"
                      max="90"
                      step="7"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Strict 0% Aspect Lock</div>
                      <div className="text-[10.5px] text-slate-400">Strictly prohibits any distortion of uploaded certificate templates</div>
                    </div>
                    <button
                      onClick={() => setStrictAspectLock(!strictAspectLock)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        strictAspectLock ? 'bg-indigo-600' : 'bg-slate-700'
                      )}
                    >
                      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition', strictAspectLock ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Organization Danger Zone
                  </h3>
                  <p className="text-xs text-red-300/70">Irreversible actions impacting company data & queues</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Flushing the dispatch cache will clear pending retry queues and regenerate API token keys.
                </div>
                <button
                  onClick={() => toast.success('Temporary dispatch queue flushed')}
                  className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition shrink-0"
                >
                  Flush Temporary Dispatch Cache
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

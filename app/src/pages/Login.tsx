import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useApp } from '@/lib/store'
import { TitleAnimatedCircle } from '@/components/TitleAnimatedCircle'
import { Logo } from '@/components/AppShell'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import {
  Sparkles,
  ShieldCheck,
  Mail,
  ArrowRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  LogOut,
  LogIn,
  KeyRound,
  FileText,
  Award,
  Zap,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function Login() {
  const {
    user,
    loginWithGoogle,
    loginAsGuestDemo,
    loginAsCompanyAdmin,
    startEmailOtpLogin,
    verifyOtp,
    resendOtp,
    logout,
  } = useAuth()
  const { navigate, logActivity } = useApp()

  // Authentication State
  const [authMethod, setAuthMethod] = useState<'google' | 'otp'>('google')
  const [googleAccountCustom, setGoogleAccountCustom] = useState(false)
  const [googleName, setGoogleName] = useState('Academic Administrator')
  const [googleEmail, setGoogleEmail] = useState('admin@trinity.edu.in')

  // OTP State
  const [otpEmail, setOtpEmail] = useState('organizer@trinity.edu.in')
  const [otpSent, setOtpSent] = useState(false)
  const [activeOtpCode, setActiveOtpCode] = useState('')
  const [enteredOtp, setEnteredOtp] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Countdown timer for OTP
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [otpSent, countdown])

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsVerifying(true)
    try {
      const signedInUser = await loginWithGoogle({
        name: googleName,
        email: googleEmail,
      })
      toast.success(`Welcome back, ${signedInUser.name}!`, {
        description: `Signed in via Google account: ${signedInUser.email}`,
      })
      logActivity('certificate', `Signed in via Google (${signedInUser.email})`)
      setTimeout(() => {
        navigate('landing')
      }, 500)
    } catch {
      toast.error('Google Sign-In failed')
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle Guest Demo Sign In
  const handleGuestDemoSignIn = async () => {
    setIsVerifying(true)
    try {
      const demoUser = await loginAsGuestDemo()
      toast.success(`Demo Session Initialized!`, {
        description: `Signed in as ${demoUser.name}`,
      })
      logActivity('certificate', `Entered demo session as ${demoUser.email}`)
      setTimeout(() => {
        navigate('landing')
      }, 400)
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle Send OTP
  const handleSendOtp = () => {
    if (!otpEmail || !otpEmail.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSending(true)
    setTimeout(() => {
      const result = startEmailOtpLogin(otpEmail)
      setActiveOtpCode(result.otp)
      setOtpSent(true)
      setCountdown(60)
      setIsSending(false)
      toast.success(`6-Digit Verification Code Sent!`, {
        description: `Check your inbox at ${otpEmail}. (Test OTP: ${result.otp})`,
      })
    }, 600)
  }

  // Handle Verify OTP
  const handleVerifyOtp = () => {
    if (enteredOtp.length !== 6) {
      toast.error('Please enter all 6 digits of the OTP code')
      return
    }

    setIsVerifying(true)
    setTimeout(() => {
      const success = verifyOtp(enteredOtp)
      if (success) {
        toast.success('Email Successfully Verified!', {
          description: `Access granted as ${otpEmail}`,
        })
        logActivity('certificate', `Verified & signed in via OTP (${otpEmail})`)
        setTimeout(() => {
          navigate('landing')
        }, 500)
      } else {
        toast.error('Invalid or Expired OTP', {
          description: `The OTP you entered is incorrect. Please check the code or resend.`,
        })
      }
      setIsVerifying(false)
    }, 500)
  }

  // Handle Resend OTP
  const handleResendOtp = () => {
    const code = resendOtp()
    if (code) {
      setActiveOtpCode(code)
      setCountdown(60)
      toast.success('New OTP Code Dispatched', {
        description: `Test code: ${code}`,
      })
    }
  }

  // Handle Sign Out
  const handleSignOut = () => {
    logout()
    setOtpSent(false)
    setEnteredOtp('')
    toast.info('Signed Out', {
      description: 'You have been signed out of DocuGenius AI. Sign in anytime.',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* ──────────────────────────────────────────────────────────────────────────
          1. TOP NAVIGATION / STATUS BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={() => navigate('landing')}>
              <Logo />
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300 md:inline-flex">
              <Sparkles className="h-3 w-3 text-indigo-400" /> Secure Identity Gateway
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
                  Signed in as <strong className="text-white">{user.name}</strong>
                </span>
                <button
                  onClick={() => navigate('landing')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lift"
                >
                  Enter Studio <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGuestDemoSignIn}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  Quick Demo Guest Access
                </button>
                <button
                  onClick={async () => {
                    await loginAsCompanyAdmin()
                    navigate('admin')
                    toast.success('Authorized as DocuGenius Executive Admin')
                  }}
                  className="rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-3 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Company Staff Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. MAIN STAGE: CIRCLE ANIMATED DESIGN + SIGN IN / OUT HUB
      ────────────────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* =================================================================== */}
          {/* LEFT COLUMN: TITLE CIRCLE ANIMATED DESIGN                           */}
          {/* =================================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center text-center lg:text-left order-2 lg:order-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3 py-1 text-xs font-bold text-indigo-300 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Universal Document & Certificate Automation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Sign In to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-fuchsia-400">DocuGenius AI</span>
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-lg">
              One unified platform for Universal Document Personalization (M1) and Intelligent Certificate Automation with zero distortion (M2).
            </p>

            {/* Circular Animated Showcase Component */}
            <div className="mt-6 w-full flex justify-center">
              <TitleAnimatedCircle
                onModuleClick={(m) => {
                  if (user) {
                    navigate(m === 'm1' ? 'workflow' : 'certificates')
                  } else {
                    toast.info(`Please sign in first to access Module ${m.toUpperCase()}`)
                  }
                }}
              />
            </div>
          </div>

          {/* =================================================================== */}
          {/* RIGHT COLUMN: SIGN IN / OUT INTERACTIVE HUB                         */}
          {/* =================================================================== */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto order-1 lg:order-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              {/* Subtle top neon border accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500" />

              {/* ──────────────────────────────────────────────────────────
                  STATE A: USER IS CURRENTLY SIGNED IN (SIGN OUT / MANAGE)
              ────────────────────────────────────────────────────────── */}
              {user ? (
                <div className="space-y-6 animate-fade-up">
                  <div className="text-center">
                    <div className="relative mx-auto mb-3 h-16 w-16">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-slate-900">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 mb-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Active Verified Session
                    </div>
                    <h2 className="text-xl font-black text-white">{user.name}</h2>
                    <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                  </div>

                  {/* Registered Sender Email Bind Info */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-indigo-400" /> Registered Sender Address
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold font-mono">Bound ✓</span>
                    </div>
                    <div className="mt-1 font-mono text-xs text-white truncate font-semibold">
                      {user.registeredSenderEmail}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      All generated certificates will be delivered directly from this verified email address.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('landing')}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 px-5 py-3 text-sm font-black text-white shadow-lift hover:brightness-110 transition active:scale-[0.98]"
                    >
                      <Sparkles className="h-4 w-4" /> Enter DocuGenius AI Studio
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate('certificates')}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                      >
                        <Award className="h-3.5 w-3.5 text-violet-400" /> Module 2 (Certs)
                      </button>
                      <button
                        onClick={() => navigate('workflow')}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                      >
                        <FileText className="h-3.5 w-3.5 text-sky-400" /> Module 1 (UDM)
                      </button>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:text-white transition"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out of This Account
                    </button>
                  </div>
                </div>
              ) : (
                /* ──────────────────────────────────────────────────────────
                    STATE B: USER IS NOT SIGNED IN (GOOGLE / OTP OPTIONS)
                ────────────────────────────────────────────────────────── */
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-white">Choose Login Option</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Access the full document personalization and certificate generation engine.
                    </p>
                  </div>

                  {/* Concise Circled Option Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('google')
                        setOtpSent(false)
                      }}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-2xl p-3 border-2 transition-all duration-300 select-none text-center',
                        authMethod === 'google'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-2 ring-indigo-400/40'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full mb-1.5 transition-transform duration-300',
                          authMethod === 'google' ? 'bg-white shadow-md scale-105' : 'bg-slate-800'
                        )}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold">Google</span>
                      <span className="text-[9px] text-slate-500 font-medium">1-Click</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthMethod('otp')}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-2xl p-3 border-2 transition-all duration-300 select-none text-center',
                        authMethod === 'otp'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-2 ring-indigo-400/40'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full mb-1.5 transition-transform duration-300 text-white',
                          authMethod === 'otp' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md scale-105' : 'bg-slate-800'
                        )}
                      >
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-bold">Email OTP</span>
                      <span className="text-[9px] text-slate-500 font-medium">6-Digit Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGuestDemoSignIn}
                      className="flex flex-col items-center justify-center rounded-2xl p-3 border-2 border-slate-800 bg-slate-950/50 text-slate-400 hover:border-amber-500/60 hover:text-amber-300 transition-all duration-300 select-none text-center hover:scale-105"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full mb-1.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-bold">Demo Mode</span>
                      <span className="text-[9px] text-slate-500 font-medium">Instant</span>
                    </button>
                  </div>

                  {/* ──────────────────────────────────────────────────────────
                      TAB 1: CONTINUE WITH GOOGLE
                  ────────────────────────────────────────────────────────── */}
                  {authMethod === 'google' && (
                    <div className="space-y-4 animate-fade-up">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-900 shadow-md">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Google OAuth 2.0 Sign In</div>
                            <div className="text-[11px] text-slate-400">
                              Instant single sign-on with verified academic credentials.
                            </div>
                          </div>
                        </div>

                        {/* Account Selector Option */}
                        <div className="mt-3 pt-3 border-t border-slate-800/80">
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            Google Account Details:
                          </label>
                          <div className="grid grid-cols-1 gap-2">
                            <input
                              type="text"
                              value={googleName}
                              onChange={(e) => setGoogleName(e.target.value)}
                              placeholder="Account Name"
                              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden"
                            />
                            <input
                              type="email"
                              value={googleEmail}
                              onChange={(e) => setGoogleEmail(e.target.value)}
                              placeholder="Google Email"
                              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:border-indigo-500 focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Continue with Google Primary Button */}
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isVerifying}
                        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-black shadow-lg hover:bg-slate-100 transition active:scale-[0.98] disabled:opacity-50"
                      >
                        {isVerifying ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-slate-600" />
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                        )}
                        <span>Continue with Google</span>
                      </button>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      TAB 2: CONTINUE WITH OTP (EMAIL VERIFICATION)
                  ────────────────────────────────────────────────────────── */}
                  {authMethod === 'otp' && (
                    <div className="space-y-4 animate-fade-up">
                      {!otpSent ? (
                        /* Step 1: Enter Email & Send OTP */
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                              Enter Your Registered / Academic Email:
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <input
                                type="email"
                                value={otpEmail}
                                onChange={(e) => setOtpEmail(e.target.value)}
                                placeholder="organizer@university.edu.in"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 pl-9 text-xs text-white placeholder-slate-500 font-mono focus:border-indigo-500 focus:outline-hidden"
                              />
                            </div>
                            <p className="mt-1.5 text-[11px] text-slate-400">
                              A 6-digit one-time verification password (OTP) will be dispatched to this address.
                            </p>
                          </div>

                          <button
                            onClick={handleSendOtp}
                            disabled={isSending}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-black text-white shadow-lift hover:bg-indigo-500 transition disabled:opacity-50"
                          >
                            {isSending ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                            <span>Send 6-Digit Verification OTP</span>
                          </button>
                        </div>
                      ) : (
                        /* Step 2: Enter & Verify 6-digit OTP */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Code sent to <strong className="text-white font-mono">{otpEmail}</strong></span>
                            <button
                              onClick={() => setOtpSent(false)}
                              className="text-indigo-400 hover:underline font-bold"
                            >
                              Edit
                            </button>
                          </div>

                          {/* Quick Demo Helper Hint */}
                          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-2.5 text-center">
                            <div className="text-[11px] font-semibold text-indigo-300">
                              Simulated Inbox Code: <span className="font-mono font-bold text-white tracking-widest text-sm">{activeOtpCode}</span>
                            </div>
                            <button
                              onClick={() => setEnteredOtp(activeOtpCode)}
                              className="mt-1 text-[10px] text-sky-400 hover:underline font-bold"
                            >
                              Click to Auto-Fill Code
                            </button>
                          </div>

                          {/* 6-digit input slots */}
                          <div className="flex justify-center py-2">
                            <InputOTP
                              maxLength={6}
                              value={enteredOtp}
                              onChange={(value) => setEnteredOtp(value)}
                            >
                              <InputOTPGroup className="gap-1.5 sm:gap-2">
                                <InputOTPSlot index={0} className="rounded-xl border-slate-700 bg-slate-950 text-white font-mono font-bold text-base h-11 w-11" />
                                <InputOTPSlot index={1} className="rounded-xl border-slate-700 bg-slate-950 text-white font-mono font-bold text-base h-11 w-11" />
                                <InputOTPSlot index={2} className="rounded-xl border-slate-700 bg-slate-950 text-white font-mono font-bold text-base h-11 w-11" />
                                <InputOTPSlot index={3} className="rounded-xl border-slate-700 bg-slate-950 text-white font-mono font-bold text-base h-11 w-11" />
                                <InputOTPSlot index={4} className="rounded-xl border-slate-700 bg-slate-950 text-white font-mono font-bold text-base h-11 w-11" />
                                <InputOTPSlot index={5} className="rounded-xl border-slate-700 bg-slate-950 text-white font-mono font-bold text-base h-11 w-11" />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                            <span>Expires in: <strong className="text-indigo-400 font-mono">{countdown}s</strong></span>
                            <button
                              onClick={handleResendOtp}
                              disabled={countdown > 0}
                              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-40"
                            >
                              Resend OTP
                            </button>
                          </div>

                          <button
                            onClick={handleVerifyOtp}
                            disabled={isVerifying || enteredOtp.length !== 6}
                            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-xs font-black text-white shadow-lift hover:brightness-110 transition disabled:opacity-40"
                          >
                            {isVerifying ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            <span>Verify OTP & Enter Studio</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback One-Click Demo Access */}
                  <div className="pt-3 border-t border-slate-800 text-center">
                    <button
                      onClick={handleGuestDemoSignIn}
                      className="text-xs font-bold text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1.5"
                    >
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span>Instant Academic Demo Mode (1-Click)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. FOOTER TRUST & ENTERPRISE SPEC BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> 256-Bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1 text-slate-400 font-semibold">
              <Lock className="h-4 w-4 text-indigo-400" /> 0% Distortion Preservation Guarantee
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('landing')}
              className="text-slate-400 hover:text-white transition"
            >
              Public Landing
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('admin')}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition inline-flex items-center gap-1"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              Company Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

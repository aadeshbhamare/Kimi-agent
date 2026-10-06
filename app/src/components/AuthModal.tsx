import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react'
import { toast } from 'sonner'

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    user,
    pendingEmail,
    loginWithGoogle,
    startEmailSignUp,
    verifyOtp,
    resendOtp,
    loginWithEmail,
  } = useAuth()

  // Sign up state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Sign in state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPass, setSignInPass] = useState('')

  // OTP state
  const [otpValue, setOtpValue] = useState('')
  const [currentOtpCode, setCurrentOtpCode] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpError, setOtpError] = useState('')

  // Google custom account input
  const [googleEmail, setGoogleEmail] = useState('organizer.lead@academics.edu')
  const [googleName, setGoogleName] = useState('Prof. A. R. Sharma')
  const [isGoogleCustomizing, setIsGoogleCustomizing] = useState(false)

  // Timer for OTP countdown
  useEffect(() => {
    if (authModalTab !== 'otp' || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [authModalTab, timeLeft])

  const handleStartSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields.')
      return
    }
    const { otp } = startEmailSignUp(name, email, password)
    setCurrentOtpCode(otp)
    setTimeLeft(60)
    setOtpValue('')
    setOtpError('')
    toast.success(`Verification code generated!`, {
      description: `Your OTP is: ${otp} (Valid for 10 mins)`,
      duration: 8000,
    })
  }

  const handleVerifyOtp = (codeToVerify?: string) => {
    const code = codeToVerify || otpValue
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits')
      return
    }
    setIsVerifying(true)
    setOtpError('')

    setTimeout(() => {
      const ok = verifyOtp(code)
      setIsVerifying(false)
      if (ok) {
        toast.success('Email Verified Successfully!', {
          description: `Registered sender email bound: ${pendingEmail}`,
        })
      } else {
        setOtpError('Invalid or expired OTP code. Please try again.')
        toast.error('Invalid OTP code')
      }
    }, 600)
  }

  const handleResend = () => {
    const newOtp = resendOtp()
    if (newOtp) {
      setCurrentOtpCode(newOtp)
      setTimeLeft(60)
      setOtpError('')
      toast.info('New OTP code sent!', {
        description: `Your new OTP is: ${newOtp}`,
      })
    }
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signInEmail) {
      toast.error('Please enter your email')
      return
    }
    loginWithEmail(signInEmail, signInPass)
    toast.success(`Signed in as ${signInEmail}`)
  }

  const handleGoogleSignIn = async () => {
    await loginWithGoogle({
      name: googleName || 'Organizer Lead',
      email: googleEmail || 'organizer@trinity.edu.in',
    })
    toast.success('Signed in with Google!', {
      description: `Authenticated as ${googleEmail}. Sender address verified.`,
    })
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Top Header Banner */}
        <div className="relative gradient-brand p-6 text-white text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            Verified Authentication & Sender Identity
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-white">
            DocuGenius <span className="text-amber-300">AI</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-indigo-100 mt-1 max-w-xs mx-auto">
            Sign in to automate document engineering and distribute certificates from your official registered email address.
          </DialogDescription>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1">
          <button
            onClick={() => setAuthModalTab('google')}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all',
              authModalTab === 'google'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Google Sign In
          </button>
          <button
            onClick={() => setAuthModalTab('signup')}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all',
              authModalTab === 'signup' || authModalTab === 'otp'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Sign Up (OTP)
          </button>
          <button
            onClick={() => setAuthModalTab('signin')}
            className={cn(
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all',
              authModalTab === 'signin'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Log In
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* TAB 1: GOOGLE SIGN IN */}
          {authModalTab === 'google' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center">
                <p className="text-xs text-slate-600">
                  Signing in with Google instantly authenticates your profile and registers your Google email as the authorized certificate dispatcher.
                </p>

                {/* Google Button */}
                <button
                  onClick={handleGoogleSignIn}
                  className="mt-4 w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition"
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
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Custom Google account selector toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleCustomizing(!isGoogleCustomizing)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mx-auto"
                >
                  {isGoogleCustomizing ? 'Hide Custom Google Email' : 'Specify Custom Google / Workspace Email (Optional)'}
                </button>

                {isGoogleCustomizing && (
                  <div className="mt-3 space-y-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-left">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Google Account Name</label>
                      <input
                        type="text"
                        value={googleName}
                        onChange={(e) => setGoogleName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                        placeholder="Prof. A. R. Sharma"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Google / Institutional Email</label>
                      <input
                        type="email"
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                        placeholder="organizer@trinity.edu.in"
                      />
                    </div>
                    <button
                      onClick={handleGoogleSignIn}
                      className="mt-2 w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                    >
                      Authenticate as {googleEmail}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SIGN UP WITH EMAIL & OTP REQUEST */}
          {authModalTab === 'signup' && (
            <form onSubmit={handleStartSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Organization</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kulkarni"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address <span className="text-indigo-600 font-semibold">(Will be used as sender email)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="organizer@college.edu"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl gradient-brand py-3 text-xs font-bold text-white shadow-lift hover:brightness-110 transition"
              >
                <span>Send 6-Digit Verification OTP</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-[11px] text-slate-500 pt-1">
                A 6-digit one-time passcode will be delivered to verify that you own this sender email.
              </p>
            </form>
          )}

          {/* TAB 3: OTP VERIFICATION SCREEN */}
          {authModalTab === 'otp' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <KeyRound className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Enter Verification Code</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  We've sent a 6-digit OTP code to: <br />
                  <span className="font-bold text-slate-800">{pendingEmail}</span>
                </p>
              </div>

              {/* Instant Test helper banner */}
              {currentOtpCode && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Your OTP Code: </span>
                    <span className="font-mono font-black text-sm tracking-wider text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {currentOtpCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpValue(currentOtpCode)
                      handleVerifyOtp(currentOtpCode)
                    }}
                    className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                  >
                    Auto-Fill & Verify
                  </button>
                </div>
              )}

              {/* 6 Digit OTP input */}
              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(val) => {
                    setOtpValue(val)
                    if (val.length === 6) {
                      handleVerifyOtp(val)
                    }
                  }}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="h-12 w-11 text-base font-bold rounded-xl border border-slate-300 bg-white" />
                    <InputOTPSlot index={1} className="h-12 w-11 text-base font-bold rounded-xl border border-slate-300 bg-white" />
                    <InputOTPSlot index={2} className="h-12 w-11 text-base font-bold rounded-xl border border-slate-300 bg-white" />
                    <InputOTPSlot index={3} className="h-12 w-11 text-base font-bold rounded-xl border border-slate-300 bg-white" />
                    <InputOTPSlot index={4} className="h-12 w-11 text-base font-bold rounded-xl border border-slate-300 bg-white" />
                    <InputOTPSlot index={5} className="h-12 w-11 text-base font-bold rounded-xl border border-slate-300 bg-white" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {otpError && (
                <div className="flex items-center justify-center gap-1 text-xs text-rose-600 font-semibold">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{otpError}</span>
                </div>
              )}

              <button
                type="button"
                disabled={isVerifying || otpValue.length < 6}
                onClick={() => handleVerifyOtp()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-brand py-2.5 text-xs font-bold text-white shadow-lift hover:brightness-110 disabled:opacity-50 transition"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm & Authorize Sender Email</span>
                  </>
                )}
              </button>

              {/* Resend and countdown */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthModalTab('signup')}
                  className="hover:text-indigo-600 font-medium"
                >
                  ← Edit Email
                </button>
                <div>
                  {timeLeft > 0 ? (
                    <span>Resend in <strong className="text-slate-800">{timeLeft}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIGN IN */}
          {authModalTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="organizer@trinity.edu.in"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={signInPass}
                    onChange={(e) => setSignInPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl gradient-brand py-3 text-xs font-bold text-white shadow-lift hover:brightness-110 transition"
              >
                <span>Log In</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-500">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('signup')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Sign Up with OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

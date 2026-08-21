import { useState } from "react"
import { Heart, Mail, Lock, Eye, EyeOff, Info } from "lucide-react"
import { toast } from "sonner"
import { authService } from "../services/authService"

export function AuthPage({ setPage, initialTab }: { setPage: (p: string) => void; initialTab: "login" | "register" }) {
  const [tab, setTab] = useState<"login" | "register">(initialTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authService.register(name, email, password)
      toast.success("Akun berhasil dibuat! Silakan login.")
      setTab("login")
    } catch (error: any) {
      toast.error(error.message || "Registrasi gagal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authService.login(email, password)
      toast.success("Login berhasil!")
      setPage("dashboard")
    } catch (error: any) {
      toast.error(error.message || "Login gagal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    toast.info("Fitur Google Auth akan terhubung ke backend NestJS")
  }

  return (
    <div className="min-h-screen bg-[#E9E2D9] flex flex-col items-center justify-center p-6 font-sans">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-8 h-8 text-[#B4894D] fill-[#B4894D]" />
          <span className="font-serif text-4xl font-semibold italic text-[#2A211B]">Invito</span>
        </div>
        <p className="text-[#8A7B6E] font-medium">Login untuk masuk ke Dashboard</p>
      </div>

      <div className="w-full max-w-[480px] bg-[#FAF8F6] rounded-2xl shadow-xl p-8 border border-white/50">
        <div className="flex bg-[#E9E2D9]/50 rounded-xl p-1 mb-8">
          <button 
            onClick={() => setTab("login")} 
            className={`flex-1 py-2.5 text-sm rounded-lg transition-all ${tab === "login" ? "bg-white shadow-sm font-semibold text-[#2A211B]" : "text-[#8A7B6E] font-medium hover:text-[#2A211B]"}`}
          >
            Masuk
          </button>
          <button 
            onClick={() => setTab("register")} 
            className={`flex-1 py-2.5 text-sm rounded-lg transition-all ${tab === "register" ? "bg-white shadow-sm font-semibold text-[#2A211B]" : "text-[#8A7B6E] font-medium hover:text-[#2A211B]"}`}
          >
            Daftar
          </button>
        </div>

        <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 py-3 border border-[#E9E2D9] bg-white rounded-xl mb-6 hover:bg-gray-50 transition-colors text-sm font-medium text-[#2A211B]">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          Lanjutkan dengan Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#E9E2D9]" />
          <span className="text-xs font-medium text-[#8A7B6E]">atau dengan email</span>
          <div className="flex-1 h-px bg-[#E9E2D9]" />
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7B6E]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full pl-11 pr-4 py-3 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] focus:ring-1 focus:ring-[#B4894D] transition-all" required />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-[#2A211B]">Password</label>
                <button type="button" className="text-xs font-medium text-[#B4894D] hover:text-[#9A743D]">Lupa password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7B6E]" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] focus:ring-1 focus:ring-[#B4894D] transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7B6E] hover:text-[#2A211B] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3.5 mt-2 bg-[#B4894D] text-white rounded-xl text-sm font-semibold hover:bg-[#9A743D] transition-colors disabled:opacity-50">
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Nama Lengkap</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7B6E] opacity-0" />
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama lengkap" className="w-full px-4 py-3 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] focus:ring-1 focus:ring-[#B4894D] transition-all" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7B6E]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full pl-11 pr-4 py-3 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] focus:ring-1 focus:ring-[#B4894D] transition-all" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7B6E]" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 8 karakter" className="w-full pl-11 pr-11 py-3 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] focus:ring-1 focus:ring-[#B4894D] transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7B6E] hover:text-[#2A211B] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3.5 mt-2 bg-[#B4894D] text-white rounded-xl text-sm font-semibold hover:bg-[#9A743D] transition-colors disabled:opacity-50">
              {isLoading ? "Memproses..." : "Buat Akun Gratis"}
            </button>
          </form>
        )}

        <div className="mt-8 p-4 bg-[#E9E2D9]/40 rounded-xl border border-[#E9E2D9] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#8A7B6E] shrink-0 mt-0.5" />
          <div className="text-xs text-[#8A7B6E]">
            <p className="font-semibold text-[#2A211B] mb-1">Demo login credentials:</p>
            <p>Email: <b>demo@invito.com</b></p>
            <p>Password: <b>demo123</b></p>
          </div>
        </div>
      </div>
    </div>
  )
}

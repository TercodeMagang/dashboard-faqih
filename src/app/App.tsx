import { useState, useEffect } from "react"
import { motion } from "motion/react"
import {
  Heart, Menu, Home, Layout, FileText, Edit3, Users, MessageCircle,
  Gift, QrCode, Globe, Receipt, Settings, Bell, Plus, TrendingUp,
  Check, LogOut, Search, User, CheckCircle2, XCircle, Clock, X
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Toaster, toast } from "sonner"

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Page = "login" | "register" | "dashboard" | "editor" | "profile" | "settings" | "invitation"

type UserData = {
  name: string
  email: string
}

// ─── AUTH SERVICE (Clean Interface for future NestJS Backend) ────────────────
const authService = {
  register: async (name: string, email: string, password: string) => {
    // TODO: Replace with actual NestJS API call: await api.post('/auth/register', { name, email, password })
    const users = JSON.parse(localStorage.getItem('app_users') || '[]')
    if (users.find((u: any) => u.email === email)) {
      throw new Error("Email sudah terdaftar")
    }
    // Store user (In production, password is hashed by backend)
    users.push({ name, email, password })
    localStorage.setItem('app_users', JSON.stringify(users))
    return { success: true }
  },

  login: async (email: string, password: string) => {
    // TODO: Replace with actual NestJS API call: const res = await api.post('/auth/login', { email, password })
    const users = JSON.parse(localStorage.getItem('app_users') || '[]')
    const user = users.find((u: any) => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error("Email atau password salah")
    }
    
    const { password: _, ...userData } = user
    localStorage.setItem('current_user', JSON.stringify(userData))
    return userData
  },

  logout: () => {
    // TODO: Replace with: await api.post('/auth/logout')
    localStorage.removeItem('current_user')
  },

  getUser: (): UserData | null => {
    const userStr = localStorage.getItem('current_user')
    return userStr ? JSON.parse(userStr) : null
  }
}

// ─── DASHBOARD DATA ──────────────────────────────────────────────────────────
const CHART_DATA = [
  { day: "Sen", views: 120 }, { day: "Sel", views: 185 }, { day: "Rab", views: 148 },
  { day: "Kam", views: 220 }, { day: "Jum", views: 390 }, { day: "Sab", views: 530 }, { day: "Min", views: 447 },
]

const SIDEBAR_NAV = [
  { icon: Home, label: "Dashboard", page: "dashboard" },
  { icon: Layout, label: "Template", page: "dashboard" },
  { icon: FileText, label: "Undangan Saya", page: "invitation" },
  { icon: Edit3, label: "Edit Undangan", page: "editor" },
  { icon: Users, label: "Data Tamu", page: "dashboard" },
  { icon: MessageCircle, label: "RSVP", page: "dashboard" },
  { icon: Gift, label: "Amplop Digital", page: "dashboard" },
  { icon: QrCode, label: "QR Check-In", page: "dashboard" },
  { icon: Globe, label: "Domain", page: "dashboard" },
  { icon: Receipt, label: "Transaksi", page: "dashboard" },
  { icon: Settings, label: "Pengaturan", page: "settings" },
]

const MOCK_TRANSACTIONS = [
  { id: "INV-20250112-001", date: "12 Jan 2025", package: "Premium", customer: "Anisa & Raka", method: "BCA Virtual Account", amount: 349000, status: "Paid" },
  { id: "INV-20250110-002", date: "10 Jan 2025", package: "Standard", customer: "Dewi & Fandi", method: "GoPay", amount: 199000, status: "Paid" },
  { id: "INV-20250108-003", date: "8 Jan 2025", package: "Basic", customer: "Rina & Ahmad", method: "QRIS", amount: 99000, status: "Expired" },
]

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

// ─── UTILITY COMPONENTS ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    Paid: "bg-green-50 text-green-600 border-green-200",
    Pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
    Expired: "bg-gray-100 text-gray-500 border-gray-200",
    Failed: "bg-red-50 text-red-500 border-red-200",
  }
  return <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${cfg[status] ?? cfg.Expired}`}>{status}</span>
}

// ─── AUTH PAGE (LOGIN / REGISTER) ────────────────────────────────────────────
function AuthPage({ setPage, initialTab }: { setPage: (p: Page) => void; initialTab: "login" | "register" }) {
  const [tab, setTab] = useState<"login" | "register">(initialTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authService.register(name, email, password)
      toast.success("Akun berhasil dibuat! Silakan login.")
      setTab("login") // Redirect to login, DO NOT auto-login
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
    <div className="min-h-screen bg-secondary flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/35 to-foreground/70 bg-zinc-800" />
        <div className="relative z-10 flex flex-col p-12 text-white justify-center">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="w-6 h-6 text-primary fill-primary/30" />
            <span className="font-serif text-2xl font-semibold italic">Invito Dashboard</span>
          </div>
          <blockquote className="font-serif text-3xl italic leading-relaxed mb-6">&ldquo;Kelola undangan pernikahan Anda dengan mudah dan profesional.&rdquo;</blockquote>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-semibold mb-1.5">{tab === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}</h2>
            <p className="text-muted-foreground text-sm">{tab === "login" ? "Masuk ke akun Invito Anda" : "Daftar untuk mulai membuat undangan"}</p>
          </div>
          
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button onClick={() => setTab("login")} className={`flex-1 py-2.5 text-sm rounded-lg transition-all ${tab === "login" ? "bg-card shadow-sm font-semibold" : "text-muted-foreground"}`}>Masuk</button>
            <button onClick={() => setTab("register")} className={`flex-1 py-2.5 text-sm rounded-lg transition-all ${tab === "register" ? "bg-card shadow-sm font-semibold" : "text-muted-foreground"}`}>Daftar</button>
          </div>

          <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 py-3.5 border border-border rounded-xl mb-5 hover:bg-muted transition-colors text-sm font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Lanjutkan dengan Google
          </button>

          <div className="flex items-center gap-3 mb-5"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">atau dengan email</span><div className="flex-1 h-px bg-border" /></div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <button type="button" className="text-xs text-primary hover:underline">Lupa password?</button>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nama Lengkap</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama lengkap" className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 8 karakter" className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
                {isLoading ? "Memproses..." : "Buat Akun Gratis"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PROTECTED ROUTE WRAPPER ─────────────────────────────────────────────────
function ProtectedRoute({ children, setPage }: { children: React.ReactNode; setPage: (p: Page) => void }) {
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    const user = authService.getUser()
    if (!user) {
      toast.error("Silakan login terlebih dahulu")
      setPage("login")
    } else {
      setIsChecking(false)
    }
  }, [setPage])

  if (isChecking) return <div className="min-h-screen flex items-center justify-center bg-muted"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  return <>{children}</>
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────
function DashboardPage({ setPage }: { setPage: (p: Page) => void }) {
  const user = authService.getUser()
  const [activeMenu, setActiveMenu] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    authService.logout()
    toast.success("Berhasil keluar")
    setPage("login")
  }

  return (
    <ProtectedRoute setPage={setPage}>
      <div className="flex h-screen bg-muted overflow-hidden font-sans">
        <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 w-60 h-full bg-sidebar flex flex-col transition-transform duration-300 flex-shrink-0`}>
          <div className="px-5 py-5 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary/25" />
              <span className="font-serif text-lg font-semibold italic text-sidebar-foreground">Invito</span>
            </div>
          </div>
          <nav className="flex-1 py-3 overflow-y-auto">
            {SIDEBAR_NAV.map(({ icon: Icon, label, page }) => (
              <button key={label} onClick={() => { setActiveMenu(label); setPage(page as Page); setSidebarOpen(false) }} className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all ${activeMenu === label ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />{label}
              </button>
            ))}
          </nav>
          <div className="px-5 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-primary" /></div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-sidebar-foreground/45 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground text-xs transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </aside>
        
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-foreground/40 z-30 lg:hidden" />}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 bg-card border-b border-border px-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"><Menu className="w-5 h-5" /></button>
              <div>
                <p className="text-sm font-semibold">{activeMenu}</p>
                <p className="text-[11px] text-muted-foreground hidden sm:block">Selamat datang, {user?.name.split(' ')[0]}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors"><Bell className="w-4 h-4" /><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" /></button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-all">
                <Plus className="w-3.5 h-3.5" /> Buat Undangan
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {[
                { label: "Total Kunjungan", value: "2.847", change: "+12%", icon: TrendingUp, colorCls: "text-blue-500 bg-blue-50" },
                { label: "Jumlah Tamu", value: "248", change: "+8 baru", icon: Users, colorCls: "text-primary bg-primary/10" },
                { label: "RSVP Masuk", value: "186", change: "75%", icon: Check, colorCls: "text-green-500 bg-green-50" },
                { label: "Amplop Digital", value: "Rp 12,4jt", change: "+450rb", icon: Gift, colorCls: "text-purple-500 bg-purple-50" },
              ].map(({ label, value, change, icon: Icon, colorCls }, i) => (
                <div key={i} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorCls}`}><Icon className="w-4 h-4" /></div>
                    <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{change}</span>
                  </div>
                  <p className="text-xl font-semibold mb-0.5">{value}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            
            <div className="grid lg:grid-cols-3 gap-4 mb-5">
              <div className="lg:col-span-2 bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-5">
                  <div><h3 className="text-sm font-semibold">Statistik Kunjungan</h3><p className="text-[11px] text-muted-foreground">7 hari terakhir</p></div>
                  <select className="text-xs border border-border rounded-lg px-2 py-1.5 bg-muted outline-none cursor-pointer"><option>7 hari</option><option>30 hari</option></select>
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C4954A" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#C4954A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8C7456" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#8C7456" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(196,149,74,0.2)", borderRadius: "0.75rem", fontSize: 12 }} cursor={{ stroke: "rgba(196,149,74,0.2)" }} />
                    <Area type="monotone" dataKey="views" stroke="#C4954A" strokeWidth={2} fill="url(#goldGrad)" dot={false} activeDot={{ r: 4, fill: "#C4954A" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">RSVP Terbaru</h3><button className="text-xs text-primary hover:underline">Lihat semua</button></div>
                <div className="space-y-3">
                  {[{ name: "Dewi Sartika", status: "Hadir", time: "5 mnt lalu" }, { name: "Ahmad Fauzi", status: "Hadir", time: "12 mnt lalu" }, { name: "Rina Kusuma", status: "Tidak Hadir", time: "1 jam lalu" }].map(({ name, status, time }, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-[11px] font-semibold text-primary flex-shrink-0">{name[0]}</div>
                        <div><p className="text-xs font-medium">{name}</p><p className="text-[10px] text-muted-foreground">{time}</p></div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${status === "Hadir" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// ─── EDITOR PAGE (Protected) ─────────────────────────────────────────────────
function EditorPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <ProtectedRoute setPage={setPage}>
      <div className="flex h-screen bg-muted overflow-hidden font-sans">
        <div className="flex-1 flex flex-col">
          <header className="h-12 bg-card border-b border-border px-4 flex items-center justify-between flex-shrink-0">
            <button onClick={() => setPage("dashboard")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-3.5 h-3.5" /> Kembali ke Dashboard
            </button>
            <div className="flex items-center gap-1.5">
              <button className="px-3.5 py-1.5 text-[11px] bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">Simpan Perubahan</button>
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Edit3 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Editor Undangan</h2>
              <p className="text-sm text-muted-foreground">Area kerja editor akan dimuat di sini.</p>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// ─── STUB PAGES (Protected) ──────────────────────────────────────────────────
function StubPage({ title, icon: Icon, setPage }: { title: string; icon: any; setPage: (p: Page) => void }) {
  return (
    <ProtectedRoute setPage={setPage}>
      <div className="flex h-screen bg-muted overflow-hidden font-sans">
        <div className="flex-1 flex flex-col">
          <header className="h-14 bg-card border-b border-border px-5 flex items-center justify-between">
            <button onClick={() => setPage("dashboard")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <Home className="w-3.5 h-3.5" /> Dashboard
            </button>
            <h1 className="text-sm font-semibold">{title}</h1>
          </header>
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground">Halaman ini siap diintegrasikan dengan fitur backend.</p>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function App() {
  // CRITICAL: Initial route is ALWAYS "login", never "dashboard"
  const [page, setPage] = useState<Page>("login")

  const render = () => {
    switch (page) {
      case "login":
        return <AuthPage setPage={setPage} initialTab="login" />
      case "register":
        return <AuthPage setPage={setPage} initialTab="register" />
      case "dashboard":
        return <DashboardPage setPage={setPage} />
      case "editor":
        return <EditorPage setPage={setPage} />
      case "profile":
        return <StubPage title="Profil Saya" icon={User} setPage={setPage} />
      case "settings":
        return <StubPage title="Pengaturan Akun" icon={Settings} setPage={setPage} />
      case "invitation":
        return <StubPage title="Daftar Undangan" icon={FileText} setPage={setPage} />
      default:
        return <AuthPage setPage={setPage} initialTab="login" />
    }
  }

  return (
    <>
      {render()}
      <Toaster position="top-center" richColors />
    </>
  )
}
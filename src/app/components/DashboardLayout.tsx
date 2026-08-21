import { useState, useEffect } from "react"
import { 
  Heart, Menu, Home, Layout, FileText, Edit3, Users, MessageCircle,
  Gift, QrCode, Globe, Receipt, Settings, Bell, Plus, LogOut, User,
  Shield, UserPlus
} from "lucide-react"
import { toast } from "sonner"
import { authService, UserData } from "../services/authService"

const SIDEBAR_NAV = [
  { icon: Home, label: "Dashboard", page: "dashboard" },
  { icon: Layout, label: "Template", page: "template" },
  { icon: FileText, label: "Undangan Saya", page: "undangan-saya" },
  { icon: Edit3, label: "Edit Undangan", page: "edit-undangan" },
  { icon: Users, label: "Data Tamu", page: "data-tamu" },
  { icon: MessageCircle, label: "RSVP", page: "rsvp" },
  { icon: Gift, label: "Amplop Digital", page: "amplop-digital" },
  { icon: QrCode, label: "QR Check-In", page: "qr-check-in" },
  { icon: Globe, label: "Domain", page: "domain" },
  { icon: Receipt, label: "Transaksi", page: "transaksi" },
  { icon: Settings, label: "Pengaturan", page: "pengaturan" },
  { icon: Shield, label: "Akses Admin", page: "akses-admin" },
  { icon: UserPlus, label: "Akses Pengguna", page: "akses-pengguna" },
]

export function DashboardLayout({ 
  children, 
  activePage, 
  setActivePage 
}: { 
  children: React.ReactNode; 
  activePage: string; 
  setActivePage: (p: string) => void;
}) {
  const [user, setUser] = useState<UserData | null>(authService.getUser())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleUserUpdate = () => setUser(authService.getUser())
    window.addEventListener('user-updated', handleUserUpdate)
    return () => window.removeEventListener('user-updated', handleUserUpdate)
  }, [])


  const handleLogout = () => {
    authService.logout()
    toast.success("Berhasil keluar")
    setActivePage("login")
  }

  const activeNav = SIDEBAR_NAV.find(n => n.page === activePage)
  const activeLabel = activeNav ? activeNav.label : "Dashboard"

  return (
    <div className="flex h-screen bg-[#E9E2D9] overflow-hidden font-sans">
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 w-[280px] h-full bg-[#241C16] flex flex-col transition-transform duration-300 flex-shrink-0`}>
        <div className="px-6 py-6 flex items-center gap-3">
          <Heart className="w-6 h-6 text-[#B4894D] fill-[#B4894D]" />
          <span className="font-serif text-2xl font-semibold italic text-[#FAF8F6]">Invito</span>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar px-3 space-y-1">
          {SIDEBAR_NAV.map(({ icon: Icon, label, page }) => {
            const isActive = activePage === page;
            return (
              <button 
                key={label} 
                onClick={() => { setActivePage(page); setSidebarOpen(false) }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#B4894D] text-white shadow-md shadow-[#B4894D]/20" 
                    : "text-[#FAF8F6]/70 hover:bg-[#FAF8F6]/10 hover:text-[#FAF8F6]"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-[#FAF8F6]/5 rounded-2xl p-4 border border-[#FAF8F6]/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#B4894D] rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="font-bold text-white text-lg">{user?.name ? user.name[0].toUpperCase() : <User className="w-5 h-5" />}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#FAF8F6] truncate">{user?.name || "User"}</p>
                <p className="text-xs text-[#FAF8F6]/60 truncate">{user?.email || "user@invito.id"}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[#FAF8F6]/70 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>
      </aside>
      
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-[#241C16]/60 backdrop-blur-sm z-30 lg:hidden" />}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-[72px] bg-[#FAF8F6] border-b border-[#E9E2D9] px-6 flex items-center justify-between flex-shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-[#8A7B6E] hover:bg-[#E9E2D9] rounded-xl transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-serif font-bold text-[#2A211B]">{activeLabel}</h1>
              <p className="text-xs text-[#8A7B6E] hidden sm:block font-medium">Selamat datang, {user?.name ? user.name.split(' ')[0] : 'User'}!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toast.info("Tidak ada notifikasi baru")} 
              className="relative p-2.5 text-[#8A7B6E] hover:bg-[#E9E2D9] rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FAF8F6]" />
            </button>
            <button 
              onClick={() => setActivePage("edit-undangan")}
              className="px-5 py-2.5 bg-[#B4894D] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#9A743D] shadow-md shadow-[#B4894D]/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Buat Undangan</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}

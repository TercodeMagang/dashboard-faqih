import { useState, useEffect } from "react"
import { Toaster, toast } from "sonner"
import { authService } from "./services/authService"

// New Pages
import { AuthPage } from "./pages/AuthPage"
import { DashboardLayout } from "./components/DashboardLayout"
import { DashboardHome } from "./pages/DashboardHome"
import { TemplatePage } from "./pages/TemplatePage"
import { UndanganSayaPage } from "./pages/UndanganSayaPage"
import { EditUndanganPage } from "./pages/EditUndanganPage"
import { DataTamuPage } from "./pages/DataTamuPage"
import { RSVPPage } from "./pages/RSVPPage"
import { QRCheckInPage } from "./pages/QRCheckInPage"
import { DomainPage } from "./pages/DomainPage"
import { TransaksiPage } from "./pages/TransaksiPage"
import { PengaturanPage } from "./pages/PengaturanPage"
import { AksesAdminPage } from "./pages/AksesAdminPage"
import { AksesPenggunaPage } from "./pages/AksesPenggunaPage"
import { AmplopDigitalPage } from "./pages/AmplopDigitalPage"

function StubPage({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#FAF8F6] rounded-2xl border border-black/[0.04] p-10 text-center shadow-sm">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2A211B] mb-2">{title}</h2>
        <p className="text-[#8A7B6E]">Halaman ini sedang dalam tahap pengembangan.</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, setPage }: { children: React.ReactNode; setPage: (p: string) => void }) {
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

  if (isChecking) return <div className="min-h-screen flex items-center justify-center bg-[#E9E2D9]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B4894D]"></div></div>
  return <>{children}</>
}

export default function App() {
  const [page, setPage] = useState<string>("login")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Elegant")

  const renderPageContent = () => {
    switch (page) {
      case "dashboard": return <DashboardHome setActivePage={setPage} />
      case "template": return <TemplatePage setActivePage={setPage} setSelectedTemplate={setSelectedTemplate} />
      case "undangan-saya": return <UndanganSayaPage setActivePage={setPage} />
      case "edit-undangan": return <EditUndanganPage setActivePage={setPage} selectedTemplate={selectedTemplate} />
      case "data-tamu": return <DataTamuPage />
      case "rsvp": return <RSVPPage />
      case "amplop-digital": return <AmplopDigitalPage />
      case "qr-check-in": return <QRCheckInPage />
      case "domain": return <DomainPage />
      case "transaksi": return <TransaksiPage />
      case "pengaturan": return <PengaturanPage />
      case "akses-admin": return <AksesAdminPage />
      case "akses-pengguna": return <AksesPenggunaPage />
      default: return <DashboardHome setActivePage={setPage} />
    }
  }

  return (
    <>
      {page === "login" || page === "register" ? (
        <AuthPage setPage={setPage} initialTab={page} />
      ) : (
        <ProtectedRoute setPage={setPage}>
          <DashboardLayout activePage={page} setActivePage={setPage}>
            {renderPageContent()}
          </DashboardLayout>
        </ProtectedRoute>
      )}
      <Toaster position="top-center" richColors />
    </>
  )
}
import { useState, useEffect } from "react"
import { Users, CheckCircle2, Clock, TrendingUp, QrCode, Search, ScanLine } from "lucide-react"
import { toast } from "sonner"
import { api } from "../../lib/api"

type GuestQR = {
  id: string
  name: string
  table: string
  status: "Sudah Check-In" | "Belum Check-In"
  time: string
}

export function QRCheckInPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"Semua" | "Sudah Check-In" | "Belum Check-In">("Semua")
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const res = await api.get('/checkins');
        // Map backend data to frontend format
        const formatted = res.data.map((c: any) => ({
          id: c.id,
          name: c.guest.name,
          table: c.guest.table,
          status: "Sudah Check-In", // CheckIns only return valid checkins
          time: new Date(c.scannedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }));
        setGuests(formatted);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Gagal memuat data check-in');
      } finally {
        setLoading(false);
      }
    };
    fetchCheckIns();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-[#8A7B6E]">Memuat data check-in...</div>;
  }

  const filtered = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) && 
    (filter === "Semua" || g.status === filter)
  )

  const handleScan = () => {
    toast.success("Kamera aktif! Silakan scan QR code tamu.")
  }

  const handleDetail = (name: string) => {
    toast.info(`Melihat detail tamu: ${name}`)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#2A211B] mb-2">QR Check-In</h2>
          <p className="text-[#8A7B6E]">Scan QR tamu di lokasi acara</p>
        </div>
        <button 
          onClick={handleScan}
          className="px-5 py-2.5 bg-[#B4894D] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#9A743D] shadow-md shadow-[#B4894D]/20 transition-all w-full sm:w-auto"
        >
          <ScanLine className="w-4 h-4" /> Scan QR
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Tamu", value: "5", icon: Users, colorCls: "text-[#2563EB] bg-[#EFF6FF]", valColor: "text-[#2A211B]" },
          { label: "Sudah Check-In", value: "3", icon: CheckCircle2, colorCls: "text-[#16A34A] bg-[#DCFCE7]", valColor: "text-[#16A34A]" },
          { label: "Belum Check-In", value: "2", icon: Clock, colorCls: "text-[#D97706] bg-[#FEF3C7]", valColor: "text-[#D97706]" },
          { label: "Persentase", value: "60%", icon: TrendingUp, colorCls: "text-[#9333EA] bg-[#F3E8FF]", valColor: "text-[#9333EA]" },
        ].map(({ label, value, icon: Icon, colorCls, valColor }, i) => (
          <div key={i} className="bg-[#FAF8F6] rounded-[16px] p-5 shadow-sm border border-black/[0.04]">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorCls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-sm text-[#8A7B6E] font-medium">{label}</p>
            </div>
            <p className={`text-3xl font-bold tracking-tight ${valColor}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FAF8F6] rounded-2xl shadow-sm border border-black/[0.04] overflow-hidden">
        <div className="p-5 border-b border-[#E9E2D9] flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7B6E]" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama tamu..." 
              className="w-full pl-11 pr-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all text-[#2A211B]" 
            />
          </div>
          <div className="flex bg-[#E9E2D9]/50 rounded-xl p-1 w-full lg:w-auto">
            {["Semua", "Sudah Check-In", "Belum Check-In"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)} 
                className={`flex-1 lg:flex-none px-4 py-2 text-sm rounded-lg transition-all whitespace-nowrap ${
                  filter === f 
                  ? "bg-[#B4894D] shadow-sm font-semibold text-white" 
                  : "text-[#8A7B6E] font-medium hover:text-[#2A211B]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E9E2D9]/30">
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Nama Tamu</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Meja</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider text-center">QR Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2D9]">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-[#E9E2D9]/10 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#2A211B]">{g.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#2A211B]">{g.table}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      g.status === "Sudah Check-In" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"
                    }`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8A7B6E]">{g.time}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-[#8A7B6E] hover:text-[#2A211B] hover:bg-[#E9E2D9] rounded-lg transition-colors inline-flex">
                      <QrCode className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDetail(g.name)}
                      className="text-sm font-semibold text-[#B4894D] hover:text-[#9A743D] hover:underline transition-colors"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8A7B6E]">
                    Tidak ada tamu yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { toast } from "sonner"
import { Users, CheckCircle2, XCircle, Clock, Search } from "lucide-react"

type Guest = {
  id: string
  name: string
  phone: string
  table: string
  rsvp: "Ya" | "Tidak"
  status: "Hadir" | "Tidak Hadir"
}

// Data fetched from backend API

export function DataTamuPage() {
  const [search, setSearch] = useState("")
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await api.get('/guests');
        setGuests(res.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Gagal memuat tamu');
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-[#8A6E]">Memuat tamu...</div>;
  }

  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) || g.phone.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#2A211B] mb-2">Data Tamu</h2>
        <p className="text-[#8A7B6E]">Kelola daftar tamu undangan Anda</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Tamu", value: "248", icon: Users, colorCls: "text-[#2563EB] bg-[#EFF6FF]", valColor: "text-[#2A211B]" },
          { label: "Hadir", value: "186", icon: CheckCircle2, colorCls: "text-[#16A34A] bg-[#DCFCE7]", valColor: "text-[#16A34A]" },
          { label: "Tidak Hadir", value: "42", icon: XCircle, colorCls: "text-[#DC2626] bg-[#FEE2E2]", valColor: "text-[#DC2626]" },
          { label: "Belum RSVP", value: "20", icon: Clock, colorCls: "text-[#D97706] bg-[#FEF3C7]", valColor: "text-[#D97706]" },
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
        <div className="p-5 border-b border-[#E9E2D9]">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7B6E]" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari tamu..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all text-[#2A211B]" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E9E2D9]/30">
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Nama</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">No. Telepon</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Meja</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">RSVP</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2D9]">
              {filtered.map((guest) => (
                <tr key={guest.id} className="hover:bg-[#E9E2D9]/10 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#2A211B]">{guest.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8A7B6E]">{guest.phone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#2A211B]">{guest.table}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      guest.rsvp === "Ya" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                    }`}>
                      {guest.rsvp}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      guest.status === "Hadir" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                    }`}>
                      {guest.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#8A7B6E]">
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

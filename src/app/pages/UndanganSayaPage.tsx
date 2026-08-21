import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { Plus, Search, Filter, Eye, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Invitation = {
  id: string
  name: string
  theme: string
  date: string
  status: "Published" | "Draft"
  views: string
}

// Mock data removed; invitations will be fetched from the backend API

export function UndanganSayaPage({ setActivePage }: { setActivePage: (p: string) => void }) {
  const [search, setSearch] = useState("")
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const res = await api.get('/invitations');
        setInvitations(res.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Gagal memuat undangan');
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, []);

// Duplicate useEffect removed

  if (loading) {
    return <div className="p-6 text-center text-[#8A7B6E]">Memuat undangan...</div>;
  }
  const filtered = invitations.filter(inv => 
    inv.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus undangan ${name}?`)) {
      setInvitations(invitations.filter(inv => inv.id !== id))
      toast.success("Undangan berhasil dihapus")
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#2A211B] mb-2">Undangan Saya</h2>
          <p className="text-[#8A7B6E]">Kelola semua undangan pernikahan Anda</p>
        </div>
        <button 
          onClick={() => setActivePage("edit-undangan")}
          className="px-5 py-2.5 bg-[#B4894D] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#9A743D] shadow-md shadow-[#B4894D]/20 transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Buat Undangan Baru
        </button>
      </div>

      <div className="bg-[#FAF8F6] rounded-2xl shadow-sm border border-black/[0.04] overflow-hidden">
        <div className="p-5 border-b border-[#E9E2D9] flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A7B6E]" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari undangan..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all text-[#2A211B]" 
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-[#E9E2D9] text-[#2A211B] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#E9E2D9]/50 transition-all">
            <Filter className="w-4 h-4 text-[#8A7B6E]" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E9E2D9]/30">
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Nama Undangan</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Tema</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider">Kunjungan</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A7B6E] uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2D9]">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#E9E2D9]/10 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#2A211B]">{inv.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#8A7B6E]">{inv.theme}</td>
                  <td className="px-6 py-4 text-sm text-[#8A7B6E]">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      inv.status === "Published" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#2A211B]">{inv.views}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toast.info(`Membuka preview untuk ${inv.name}`)}
                        className="p-2 text-[#8A7B6E] hover:text-[#B4894D] hover:bg-[#B4894D]/10 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setActivePage("edit-undangan")}
                        className="p-2 text-[#8A7B6E] hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(inv.id, inv.name)}
                        className="p-2 text-[#8A7B6E] hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8A7B6E]">
                    Tidak ada undangan ditemukan.
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

import { useState, useEffect } from "react"
import { ClipboardCopy, Globe, Settings, Shield, UserPlus, Save, Trash2, Edit, Plus, Camera, AlertCircle, CheckCircle, XCircle, Bell, BadgeCheck, BadgeX, CreditCard, Clipboard, DollarSign, Mail, Phone, User, Lock } from "lucide-react"
import { toast } from "sonner"
import { api } from "../../lib/api"

export function DomainPage() {
  const [customDomain, setCustomDomain] = useState("")
  const [activeDomain, setActiveDomain] = useState("https://anisa-raka.invito.id")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await api.get('/domains');
        if (res.data && res.data.length > 0) {
          setActiveDomain(res.data[0].domain);
        }
      } catch (error) {
        toast.error("Gagal memuat data domain");
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(message))
  }

  const handleAddDomain = () => {
    if (!customDomain.trim()) {
      toast.error("Masukkan domain kustom")
      return
    }
    // In real app, call API. Here just toast.
    toast.success(`Domain ${customDomain} ditambahkan!`)
    setCustomDomain("")
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-serif font-bold text-[#2A211B]">Pengaturan Domain</h1>
      <p className="text-[#8A7B6E] mb-6">Atur alamat website undangan Anda</p>

      {/* Card 1 */}
      <div className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#16A34A]" />
          </div>
          <div>
            <p className="font-medium text-[#8A7B6E]">Domain Aktif Saat Ini</p>
            <p className="text-sm text-[#8A7B6E] mt-1">Undangan Anda saat ini dapat diakses melalui alamat berikut:</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <code className="bg-[#F5F5F5] px-3 py-1 rounded-md text-sm">{activeDomain}</code>
          <span className="bg-[#DCFCE7] text-[#16A34A] text-xs font-medium px-2 py-0.5 rounded-full">Aktif</span>
          <button onClick={() => copyToClipboard(activeDomain, "Disalin!")} className="p-2 text-[#8A7B6E] hover:text-[#2A211B]">
            <ClipboardCopy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FDE68A] rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#D97706]" />
          </div>
          <div>
            <p className="font-medium text-[#8A7B6E]">Tambahkan Domain Kustom</p>
            <p className="text-sm text-[#8A7B6E] mt-1">Gunakan domain pribadi Anda (misal: anisadanraka.com)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Masukkan domain kustom Anda..."
            value={customDomain}
            onChange={e => setCustomDomain(e.target.value)}
            className="border border-[#E9E2D9] rounded-md px-3 py-1 text-sm focus:border-[#B4894D] outline-none"
          />
          <button onClick={handleAddDomain} className="px-4 py-1.5 bg-[#B4894D] text-white rounded-md text-sm font-medium hover:bg-[#9A743D]">
            Tambah Domain
          </button>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-[#E0F2FE] rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#2563EB]" />
          </div>
          <p className="font-medium text-[#8A7B6E]">Pengaturan DNS</p>
        </div>
        <p className="text-sm text-[#8A7B6E] mb-3">Tambahkan record berikut di panel DNS penyedia domain Anda:</p>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E9E2D9]/30">
              <th className="px-4 py-2 text-xs font-semibold text-[#8A7B6E]">Type</th>
              <th className="px-4 py-2 text-xs font-semibold text-[#8A7B6E]">Name / Host</th>
              <th className="px-4 py-2 text-xs font-semibold text-[#8A7B6E]">Value / Target</th>
              <th className="px-4 py-2 text-xs font-semibold text-[#8A7B6E]">TTL</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E2D9]">
            <tr className="hover:bg-[#E9E2D9]/10">
              <td className="px-4 py-2 text-sm text-[#2A211B]">CNAME</td>
              <td className="px-4 py-2 text-sm text-[#2A211B]">www</td>
              <td className="px-4 py-2 text-sm text-[#B4894D] font-mono">cname.invito.id</td>
              <td className="px-4 py-2 text-sm text-[#2A211B]">3600</td>
              <td className="px-4 py-2 text-center">
                <button onClick={() => copyToClipboard("cname.invito.id", "Disalin!")} className="p-2 text-[#8A7B6E] hover:text-[#2A211B]">
                  <ClipboardCopy className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

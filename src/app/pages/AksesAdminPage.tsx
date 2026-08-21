import { useState, useEffect } from "react"
import { Users, Shield, Check, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "../../lib/api"

export function AksesAdminPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await api.get('/admin-accounts');
        setAdmins(res.data);
      } catch (error) {
        toast.error("Gagal memuat admin");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-[#8A7B6E]">Memuat data admin...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-serif font-bold text-[#2A211B]">Akses Admin</h1>
      <p className="text-[#8A7B6E] mb-4">Kelola admin yang dapat mengakses dashboard.</p>
      <div className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
        <ul className="space-y-4">
          {admins.map(admin => (
            <li key={admin.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#B4894D]" />
                <div>
                  <p className="font-medium text-[#2A211B]">{admin.name}</p>
                  <p className="text-sm text-[#8A7B6E]">{admin.email}</p>
                </div>
              </div>
              <button
                onClick={() => toast.info(`Detail admin ${admin.name}`)}
                className="px-3 py-1 text-sm bg-[#B4894D] text-white rounded-md hover:bg-[#9A743D]"
              >
                Detail
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

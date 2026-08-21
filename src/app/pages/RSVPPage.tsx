import { Users, CheckCircle2, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { toast } from "sonner"

export function RSVPPage() {
  const [rsvps, setRsvps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const res = await api.get('/rsvp');
        setRsvps(res.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Gagal memuat RSVP');
      } finally {
        setLoading(false);
      }
    };
    fetchRsvps();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-[#8A7B6E]">Memuat RSVP...</div>;
  }

  const totalRSVP = rsvps.length;
  const hadir = rsvps.filter(r => r.attendance === true || r.status === "Hadir").length;
  const tidakHadir = rsvps.filter(r => r.attendance === false || r.status === "Tidak Hadir").length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#2A211B] mb-2">RSVP</h2>
        <p className="text-[#8A7B6E]">Konfirmasi kehadiran tamu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total RSVP", value: totalRSVP.toString(), icon: Users, colorCls: "text-[#2563EB] bg-[#EFF6FF]", valColor: "text-[#2A211B]" },
          { label: "Hadir", value: hadir.toString(), icon: CheckCircle2, colorCls: "text-[#16A34A] bg-[#DCFCE7]", valColor: "text-[#16A34A]" },
          { label: "Tidak Hadir", value: tidakHadir.toString(), icon: XCircle, colorCls: "text-[#DC2626] bg-[#FEE2E2]", valColor: "text-[#DC2626]" },
        ].map(({ label, value, icon: Icon, colorCls, valColor }, i) => (
          <div key={i} className="bg-[#FAF8F6] rounded-[16px] p-5 shadow-sm border border-black/[0.04]">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorCls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-sm text-[#8A7B6E] font-medium">{label}</p>
            </div>
            <p className={`text-4xl font-bold tracking-tight ${valColor}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
        <h3 className="text-lg font-bold text-[#2A211B] mb-5">RSVP Terbaru</h3>
        <div className="space-y-4">
          {rsvps.map(({ name, attendance, status, createdAt, message }, i) => {
            const isHadir = attendance === true || status === "Hadir";
            const time = new Date(createdAt).toLocaleDateString() || "Baru saja";
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#E9E2D9] hover:border-[#B4894D] transition-colors bg-white">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-[#FDF8F0] rounded-full flex items-center justify-center text-sm font-bold text-[#B4894D] flex-shrink-0 mt-1">
                    {name ? name[0] : "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-[#2A211B]">{name}</p>
                      <span className="text-xs text-[#8A7B6E] font-medium">• {time}</span>
                    </div>
                    <p className="text-sm text-[#8A7B6E] italic">"{message}"</p>
                  </div>
                </div>
                <span className={`self-start sm:self-center text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
                  isHadir ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                }`}>
                  {isHadir ? "Hadir" : "Tidak Hadir"}
                </span>
              </div>
            )
          })}
          {rsvps.length === 0 && (
            <div className="text-center text-[#8A7B6E] py-4">Belum ada RSVP.</div>
          )}
        </div>
      </div>
    </div>
  )
}

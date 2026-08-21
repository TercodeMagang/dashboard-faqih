import { useState, useEffect } from "react"
import { TrendingUp, Users, Check, Gift } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { api } from "../../lib/api"
import { toast } from "sonner"

export function DashboardHome({ setActivePage }: { setActivePage: (p: string) => void }) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/dashboard')
        setStats(res.data)
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Gagal memuat statistik")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-6 text-center text-[#8A7B6E]">Memuat data dashboard...</div>
  }

  if (!stats) return null

  const CHART_DATA = [
    { day: "Sen", views: stats.weeklyVisits[0] }, { day: "Sel", views: stats.weeklyVisits[1] }, { day: "Rab", views: stats.weeklyVisits[2] },
    { day: "Kam", views: stats.weeklyVisits[3] }, { day: "Jum", views: stats.weeklyVisits[4] }, { day: "Sab", views: stats.weeklyVisits[5] }, { day: "Min", views: stats.weeklyVisits[6] },
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}jt`
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)}rb`
    return `Rp ${amount}`
  }

  const getTimeAgo = (dateStr: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000)
    if (minutes < 60) return `${minutes} mnt lalu`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} jam lalu`
    return `${Math.floor(hours / 24)} hari lalu`
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { label: "Total Kunjungan", value: stats.totals.visits.toLocaleString('id-ID'), change: "+12%", icon: TrendingUp, colorCls: "text-[#2563EB] bg-[#EFF6FF]", changeCls: "text-[#16A34A] bg-[#DCFCE7]" },
          { label: "Jumlah Tamu", value: stats.totals.guests.toLocaleString('id-ID'), change: "+8 baru", icon: Users, colorCls: "text-[#B4894D] bg-[#FDF8F0]", changeCls: "text-[#16A34A] bg-[#DCFCE7]" },
          { label: "RSVP Masuk", value: stats.totals.rsvps.toLocaleString('id-ID'), change: "75%", icon: Check, colorCls: "text-[#16A34A] bg-[#DCFCE7]", changeCls: "text-[#16A34A] bg-[#DCFCE7]" },
          { label: "Amplop Digital", value: formatCurrency(stats.totals.giftsTotal), change: "+450rb", icon: Gift, colorCls: "text-[#9333EA] bg-[#F3E8FF]", changeCls: "text-[#16A34A] bg-[#DCFCE7]" },
        ].map(({ label, value, change, icon: Icon, colorCls, changeCls }, i) => (
          <div key={i} className="bg-[#FAF8F6] rounded-[16px] p-5 shadow-sm border border-black/[0.04]">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorCls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${changeCls}`}>{change}</span>
            </div>
            <p className="text-3xl font-bold text-[#2A211B] tracking-tight mb-1">{value}</p>
            <p className="text-sm text-[#8A7B6E] font-medium">{label}</p>
          </div>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2A211B]">Statistik Kunjungan</h3>
              <p className="text-sm text-[#8A7B6E]">7 hari terakhir</p>
            </div>
            <select className="text-sm font-medium border border-[#E9E2D9] rounded-xl px-3 py-2 bg-white outline-none cursor-pointer focus:border-[#B4894D] transition-colors text-[#2A211B]">
              <option>7 hari</option>
              <option>30 hari</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="goldBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B4894D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#C4954A" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E2D9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8A7B6E", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 12, fill: "#8A7B6E", fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#E9E2D9', opacity: 0.4 }} 
                contentStyle={{ background: "#FAF8F6", border: "none", borderRadius: "12px", fontSize: 13, fontWeight: 600, color: "#2A211B", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} 
              />
              <Bar dataKey="views" fill="url(#goldBarGrad)" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-[#2A211B]">RSVP Terbaru</h3>
            <button onClick={() => setActivePage('rsvp')} className="text-sm font-semibold text-[#B4894D] hover:text-[#9A743D] hover:underline transition-all">Lihat semua</button>
          </div>
          <div className="space-y-4">
            {stats.latestRsvps.map((rsvp: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#FDF8F0] rounded-full flex items-center justify-center text-sm font-bold text-[#B4894D] flex-shrink-0">
                    {rsvp.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2A211B]">{rsvp.name}</p>
                    <p className="text-xs font-medium text-[#8A7B6E]">{getTimeAgo(rsvp.createdAt)}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  rsvp.attendance ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                }`}>
                  {rsvp.attendance ? "Hadir" : "Tidak Hadir"}
                </span>
              </div>
            ))}
            {stats.latestRsvps.length === 0 && (
              <p className="text-sm text-[#8A7B6E] text-center py-4">Belum ada RSVP</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

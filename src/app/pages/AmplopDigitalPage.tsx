import React, { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { toast } from "sonner"

export function AmplopDigitalPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await api.get('/gifts');
        setHistory(res.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Gagal memuat data amplop');
      } finally {
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-[#8A7B6E]">Memuat data amplop...</div>;
  }

  const totalAmount = history.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
  const avgAmount = history.length > 0 ? Math.round(totalAmount / history.length) : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#2A211B] mb-2">Amplop Digital</h1>
        <p className="text-[#8A7B6E]">Kelola hadiah dan amplop digital dari tamu Anda</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#B4894D] to-[#9A743D] text-white rounded-[16px] p-6 shadow-sm">
          <p className="text-sm font-medium opacity-80">Total Terima</p>
          <h2 className="text-3xl font-bold mt-2">{formatRupiah(totalAmount)}</h2>
        </div>
        <div className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
          <p className="text-sm font-medium text-[#8A7B6E]">Jumlah Pemberi</p>
          <h2 className="text-3xl font-bold text-[#2A211B] mt-2">{history.length}</h2>
        </div>
        <div className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
          <p className="text-sm font-medium text-[#8A7B6E]">Rata-rata</p>
          <h2 className="text-3xl font-bold text-[#2A211B] mt-2">{formatRupiah(avgAmount)}</h2>
        </div>
      </div>

      {/* Riwayat Hadiah */}
      <div className="bg-[#FAF8F6] rounded-2xl p-6 shadow-sm border border-black/[0.04]">
        <h3 className="text-xl font-bold text-[#2A211B] mb-6">Riwayat Hadiah</h3>
        <div className="flex flex-col">
          {history.map((h, i) => {
            const time = new Date(h.createdAt).toLocaleDateString() || "Baru saja";
            return (
              <div key={i} className={`flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-4 py-4 ${i !== history.length - 1 ? 'border-b border-[#E9E2D9]' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#E9E2D9]/50 rounded-full flex items-center justify-center text-[#B4894D] font-bold shrink-0">
                    {h.sender ? h.sender.charAt(0) : "?"}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold text-[#2A211B]">{h.sender || 'Hamba Allah'}</p>
                      <p className="text-xs text-[#8A7B6E]">{time}</p>
                    </div>
                    <p className="italic text-sm text-[#8A7B6E] mt-1">"{h.message || ''}"</p>
                  </div>
                </div>
                <p className="font-bold text-[#B4894D] lg:text-right lg:w-32">{formatRupiah(h.amount)}</p>
              </div>
            )
          })}
          {history.length === 0 && (
            <div className="text-center text-[#8A7B6E] py-4">Belum ada riwayat hadiah.</div>
          )}
        </div>
      </div>
    </div>
  )
}

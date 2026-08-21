import { useState, useEffect } from "react"
import { api } from "../../lib/api"
import { toast } from "sonner"
import { CreditCard, Search, Filter, ArrowUpDown } from "lucide-react"

export function TransaksiPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Gagal memuat transaksi');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-[#8A7B6E]">Memuat transaksi...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-serif font-bold text-[#2A211B]">Riwayat Transaksi</h1>
      <p className="text-[#8A7B6E] mb-4">Daftar semua transaksi digital Anda</p>
      <div className="overflow-x-auto rounded-[16px] border border-black/[0.04] bg-[#FAF8F6] shadow-sm">
        <table className="w-full min-w-[600px] text-left">
          <thead className="bg-[#E9E2D9]/30">
            <tr>
              <th className="px-4 py-2 text-xs font-semibold text-[#8A7B6E]">ID</th>
              <th className="px-4 py-2 text-xs font-semibold text-[#8A7B6E]">Tanggal</th>
              <th className="px-4 py-2 text-xs font-semibold text-[#8A7B6E]">Jumlah</th>
              <th className="px-4 py-2 text-xs font-semibold text-[#8A7B6E]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E2D9]">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#E9E2D9]/10">
                <td className="px-4 py-2 text-sm text-[#2A211B]">{tx.id}</td>
                <td className="px-4 py-2 text-sm text-[#2A211B]">{tx.date}</td>
                <td className="px-4 py-2 text-sm text-[#B4894D] font-mono">{tx.amount}</td>
                <td className="px-4 py-2 text-sm text-[#2A211B]">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

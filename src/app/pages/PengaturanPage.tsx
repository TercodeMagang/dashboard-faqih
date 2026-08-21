import { useState, useEffect } from "react"
import { toast } from "sonner"
import { User, Lock, Bell, Save, CheckCircle, XCircle } from "lucide-react"
import { authService } from "../services/authService"
import { api } from "../../lib/api"

export function PengaturanPage() {
  const [profile, setProfile] = useState({ 
    name: authService.getUser()?.name || "", 
    email: authService.getUser()?.email || "" 
  })
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" })
  const [notifications, setNotifications] = useState({ email: true, push: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data) {
          setNotifications({ email: res.data.email, push: res.data.push });
        }
      } catch (error) {
        // fail silently or toast
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleProfileSave = async () => {
    if (!profile.name || !profile.email) {
      toast.error("Nama dan email harus diisi")
      return
    }
    try {
      await authService.updateProfile(profile.name)
      toast.success("Profil diperbarui")
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handlePasswordChange = async () => {
    if (!password.current || !password.new) {
      toast.error("Masukkan password lama dan baru")
      return
    }
    if (password.new.length < 8) {
      toast.error("Password baru minimal 8 karakter")
      return
    }
    if (password.new !== password.confirm) {
      toast.error("Konfirmasi password tidak sama")
      return
    }
    
    try {
      await authService.updatePassword(password.current, password.new)
      toast.success("Password berhasil diubah")
      setPassword({ current: "", new: "", confirm: "" })
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const toggleNotification = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications({ ...notifications, [key]: newValue })
    try {
      await api.patch('/notifications', { [key]: newValue });
      toast.success(`Notifikasi ${key} ${newValue ? "diaktifkan" : "dinonaktifkan"}`)
    } catch (e) {
      toast.error("Gagal menyimpan notifikasi");
      // revert
      setNotifications({ ...notifications, [key]: !newValue });
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-serif font-bold text-[#2A211B]">Pengaturan</h1>

      {/* Profile */}
      <section className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
        <div className="flex items-center gap-4 mb-4">
          <User className="w-6 h-6 text-[#B4894D]" />
          <h2 className="text-xl font-medium text-[#2A211B]">Profil</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Nama"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="border border-[#E9E2D9] rounded-md px-3 py-1.5 focus:border-[#B4894D] outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={profile.email}
            readOnly
            className="border border-[#E9E2D9] rounded-md px-3 py-1.5 focus:border-[#B4894D] outline-none"
          />
        </div>
        <button
          onClick={handleProfileSave}
          className="mt-4 px-4 py-2 bg-[#B4894D] text-white rounded-md hover:bg-[#9A743D]"
        >
          Simpan Profil
        </button>
      </section>

      {/* Security */}
      <section className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
        <div className="flex items-center gap-4 mb-4">
          <Lock className="w-6 h-6 text-[#B4894D]" />
          <h2 className="text-xl font-medium text-[#2A211B]">Keamanan</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="password"
            placeholder="Password lama"
            value={password.current}
            onChange={e => setPassword({ ...password, current: e.target.value })}
            className="border border-[#E9E2D9] rounded-md px-3 py-1.5 focus:border-[#B4894D] outline-none"
          />
          <input
            type="password"
            placeholder="Password baru"
            value={password.new}
            onChange={e => setPassword({ ...password, new: e.target.value })}
            className="border border-[#E9E2D9] rounded-md px-3 py-1.5 focus:border-[#B4894D] outline-none"
          />
          <input
            type="password"
            placeholder="Konfirmasi password"
            value={password.confirm}
            onChange={e => setPassword({ ...password, confirm: e.target.value })}
            className="border border-[#E9E2D9] rounded-md px-3 py-1.5 focus:border-[#B4894D] outline-none"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          className="mt-4 px-4 py-2 bg-[#B4894D] text-white rounded-md hover:bg-[#9A743D]"
        >
          Ganti Password
        </button>
      </section>

      {/* Notification */}
      <section className="bg-[#FAF8F6] rounded-[16px] p-6 shadow-sm border border-black/[0.04]">
        <div className="flex items-center gap-4 mb-4">
          <Bell className="w-6 h-6 text-[#B4894D]" />
          <h2 className="text-xl font-medium text-[#2A211B]">Notifikasi</h2>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => toggleNotification("email")}
              className="form-checkbox h-4 w-4 text-[#B4894D] border-gray-300 rounded"
            />
            Email
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={() => toggleNotification("push")}
              className="form-checkbox h-4 w-4 text-[#B4894D] border-gray-300 rounded"
            />
            Push
          </label>
        </div>
        <div className="mt-4 flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span>Pengaturan notifikasi disimpan</span>
        </div>
      </section>
    </div>
  )
}

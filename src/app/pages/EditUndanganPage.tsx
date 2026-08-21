import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Camera, Copy, Plus, X } from "lucide-react"
import { TEMPLATE_IMAGES } from "../templatesData"
import { api } from "../../lib/api"

// --- INITIAL STATE ---
const initialState = {
  woman: "Anisa",
  man: "Raka",
  parentWoman: "Putri dari Bapak Budi & Ibu Susanti",
  parentMan: "Putra dari Bapak Ahmad & Ibu Siti",
  date: "2025-01-12",
  akadTime: "08:00",
  resepsiTime: "11:00",
  akadLocation: "Masjid Raya Al-A'zhom",
  resepsiLocation: "Hotel Mulia, Senayan",
  fullAddress: "Jl. Jend. Sudirman No.Kav 10-11, Jakarta",
  description: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
  localTemplate: "Elegant",
  accentColor: "#B4894D",
  photoWoman: null as string | null,
  photoMan: null as string | null,
  gallery: [] as string[],
  features: { countdown: true, rsvp: true, amplop: true, gallery: true, music: false },
  banks: [
    { bank: "BCA", acc: "1234567890", name: "Anisa Fitri" },
    { bank: "Mandiri", acc: "0987654321", name: "Raka Pratama" }
  ],
  slug: "anisa-raka"
}

export function EditUndanganPage({ setActivePage, selectedTemplate }: { setActivePage: (p: string) => void, selectedTemplate: string }) {
  // Make sure template passed in gets set
  const startingState = { ...initialState, localTemplate: selectedTemplate || "Elegant" }
  const [savedState, setSavedState] = useState(startingState)
  const [formData, setFormData] = useState(startingState)
  const [loading, setLoading] = useState(true);
  const [invitationId, setInvitationId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        // Fetch first invitation for demo purposes since we don't have routing with IDs
        const resList = await api.get('/invitations');
        if (resList.data && resList.data.length > 0) {
          const inv = resList.data[0];
          setInvitationId(inv.id);
          const newState = {
            ...startingState,
            woman: inv.name.split(' & ')[0] || startingState.woman,
            man: inv.name.split(' & ')[1] || startingState.man,
            date: inv.date || startingState.date,
            localTemplate: inv.theme || startingState.localTemplate,
            slug: inv.slug || startingState.slug
          };
          setSavedState(newState);
          setFormData(newState);
        }
      } catch (error) {
        toast.error('Gagal memuat detail undangan');
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, []);

  const [ucapan, setUcapan] = useState<{name: string, hadir: boolean, message: string}[]>([])
  const [rsvpForm, setRsvpForm] = useState({ name: "", hadir: true, message: "" })

  // --- MOCK COUNTDOWN TICKER ---
  const [countdown, setCountdown] = useState({ days: 145, hours: 12, mins: 30, secs: 45 })
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => ({
        ...prev,
        secs: prev.secs > 0 ? prev.secs - 1 : 59
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // --- ACTIONS ---
  const handleSave = async () => {
    if (invitationId) {
      try {
        await api.patch(`/invitations/${invitationId}`, {
          name: `${formData.woman} & ${formData.man}`,
          date: formData.date,
          theme: formData.localTemplate,
          slug: formData.slug
        });
        setSavedState(formData)
        toast.success("Undangan berhasil disimpan!")
      } catch (e) {
        toast.error("Gagal menyimpan undangan");
      }
    } else {
      setSavedState(formData)
      toast.success("Undangan berhasil disimpan secara lokal!")
    }
  }

  const handleCancel = () => {
    setFormData(savedState)
    toast.info("Perubahan dibatalkan")
  }

  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const updateFeature = (key: keyof typeof formData.features) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [key]: !prev.features[key] }
    }))
  }

  const updateBank = (index: number, field: string, value: string) => {
    const newBanks = [...formData.banks]
    newBanks[index] = { ...newBanks[index], [field]: value }
    updateForm('banks', newBanks)
  }

  // --- UPLOADERS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoWoman' | 'photoMan') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        updateForm(field, ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (formData.gallery.length + files.length > 6) {
      toast.error("Maksimal 6 foto galeri")
      return
    }
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFormData(prev => {
            if (prev.gallery.length < 6) return { ...prev, gallery: [...prev.gallery, ev.target!.result as string] }
            return prev
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeGalleryPhoto = (index: number) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index)
    updateForm('gallery', newGallery)
  }

  // --- MISC HANDLERS ---
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://invito.id/${formData.slug}`)
    toast.success("Tautan disalin ke clipboard!")
  }

  const handleKirimUcapan = () => {
    if (!rsvpForm.name || !rsvpForm.message) {
      toast.error("Nama dan pesan wajib diisi")
      return
    }
    setUcapan([{ ...rsvpForm }, ...ucapan])
    setRsvpForm({ name: "", hadir: true, message: "" })
    toast.success("Ucapan berhasil dikirim!")
  }

  const smoothScrollToContent = () => {
    const contentDiv = document.getElementById("preview-pembuka")
    if (contentDiv) {
      contentDiv.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return "Tanggal belum dipilih"
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return dateString
    }
  }

  const backgroundImageUrl = TEMPLATE_IMAGES[formData.localTemplate] || TEMPLATE_IMAGES["Elegant"]

  const templateOptions = ["Elegant", "Floral", "Minimalist", "Modern", "Traditional", "Luxury"]
  const colorSwatches = [
    { name: "Gold", hex: "#B4894D" },
    { name: "Sage", hex: "#7C9070" },
    { name: "Dusty Rose", hex: "#C4888B" },
    { name: "Navy", hex: "#2C3E5C" }
  ]

  return (
    <div className="px-6 py-8 md:px-8 max-w-[1400px] mx-auto w-full relative z-0">
      
      {/* 1. HEADER (Normal document flow, stacking above phone) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#2A211B] mb-1">Edit Undangan</h1>
          <p className="text-[#8A7B6E]">Sesuaikan detail undangan pernikahan Anda</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleCancel}
            className="px-5 py-2.5 bg-transparent border border-[#E9E2D9] text-[#2A211B] rounded-xl text-sm font-semibold hover:bg-[#E9E2D9]/50 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#B4894D] text-white rounded-xl text-sm font-semibold hover:bg-[#9A743D] shadow-md shadow-[#B4894D]/20 transition-all"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* 2. MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-8 items-start w-full relative">
        
        {/* LEFT COLUMN: FORM */}
        <div className="flex flex-col gap-6 w-full relative z-0">
          
          {/* Card: Detail Undangan */}
          <div className="bg-[#FAF8F6] rounded-2xl p-6 shadow-sm border border-black/[0.04]">
            <h3 className="text-lg font-bold text-[#2A211B] mb-5">Detail Undangan</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Nama Mempelai Wanita</label>
                  <input type="text" value={formData.woman} onChange={e => updateForm('woman', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Nama Mempelai Pria</label>
                  <input type="text" value={formData.man} onChange={e => updateForm('man', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Nama Orang Tua Wanita</label>
                  <input type="text" value={formData.parentWoman} onChange={e => updateForm('parentWoman', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Nama Orang Tua Pria</label>
                  <input type="text" value={formData.parentMan} onChange={e => updateForm('parentMan', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Tanggal Pernikahan</label>
                <input type="date" value={formData.date} onChange={e => updateForm('date', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Jam Akad</label>
                  <input type="time" value={formData.akadTime} onChange={e => updateForm('akadTime', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Lokasi Akad</label>
                  <input type="text" value={formData.akadLocation} onChange={e => updateForm('akadLocation', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Jam Resepsi</label>
                  <input type="time" value={formData.resepsiTime} onChange={e => updateForm('resepsiTime', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Lokasi Resepsi</label>
                  <input type="text" value={formData.resepsiLocation} onChange={e => updateForm('resepsiLocation', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Alamat Lengkap Lokasi (Opsional)</label>
                <textarea rows={2} value={formData.fullAddress} onChange={e => updateForm('fullAddress', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all resize-none" />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#2A211B] mb-1.5 block">Deskripsi Acara</label>
                <textarea rows={3} value={formData.description} onChange={e => updateForm('description', e.target.value)} className="w-full px-4 py-2 bg-white border border-[#E9E2D9] rounded-xl text-sm outline-none focus:border-[#B4894D] transition-all resize-none" />
              </div>
            </div>
          </div>

          {/* Card: Tema & Gaya */}
          <div className="bg-[#FAF8F6] rounded-2xl p-6 shadow-sm border border-black/[0.04]">
            <h3 className="text-lg font-bold text-[#2A211B] mb-5">Tema & Gaya</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#2A211B] mb-2 block">Template Terpilih</label>
                <div className="flex flex-wrap gap-2">
                  {templateOptions.map(tpl => (
                    <button 
                      key={tpl} 
                      onClick={() => updateForm('localTemplate', tpl)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.localTemplate === tpl ? 'bg-[#B4894D] text-white' : 'bg-white border border-[#E9E2D9] text-[#8A7B6E] hover:border-[#B4894D]'}`}
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#2A211B] mb-2 block">Warna Aksen</label>
                <div className="flex flex-wrap gap-3">
                  {colorSwatches.map(swatch => (
                    <button
                      key={swatch.hex}
                      onClick={() => updateForm('accentColor', swatch.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${formData.accentColor === swatch.hex ? 'border-gray-200 ring-2 ring-[#B4894D] scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Foto & Galeri */}
          <div className="bg-[#FAF8F6] rounded-2xl p-6 shadow-sm border border-black/[0.04]">
            <h3 className="text-lg font-bold text-[#2A211B] mb-5">Foto & Galeri</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="border-2 border-dashed border-[#E9E2D9] hover:border-[#B4894D] bg-white rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group">
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'photoWoman')} />
                  {formData.photoWoman ? (
                    <img src={formData.photoWoman} alt="Wanita" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-[#8A7B6E] group-hover:text-[#B4894D] transition-colors mb-2" />
                      <span className="text-sm font-semibold text-[#8A7B6E] group-hover:text-[#B4894D] transition-colors">Upload Foto Wanita</span>
                    </>
                  )}
                </label>
                <label className="border-2 border-dashed border-[#E9E2D9] hover:border-[#B4894D] bg-white rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group">
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'photoMan')} />
                  {formData.photoMan ? (
                    <img src={formData.photoMan} alt="Pria" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-[#8A7B6E] group-hover:text-[#B4894D] transition-colors mb-2" />
                      <span className="text-sm font-semibold text-[#8A7B6E] group-hover:text-[#B4894D] transition-colors">Upload Foto Pria</span>
                    </>
                  )}
                </label>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-[#2A211B] mb-2 block">Galeri Foto (Max 6)</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {formData.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group border border-[#E9E2D9]">
                      <img src={img} className="w-full h-full object-cover" />
                      <button onClick={() => removeGalleryPhoto(i)} className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100 z-10">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.gallery.length < 6 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-[#E9E2D9] hover:border-[#B4894D] bg-white flex flex-col items-center justify-center cursor-pointer transition-colors text-[#8A7B6E] hover:text-[#B4894D]">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                      <Plus className="w-6 h-6 mb-1" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Fitur Undangan */}
          <div className="bg-[#FAF8F6] rounded-2xl p-6 shadow-sm border border-black/[0.04]">
            <h3 className="text-lg font-bold text-[#2A211B] mb-5">Fitur Undangan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'countdown', label: 'Hitung Mundur' },
                { key: 'rsvp', label: 'RSVP & Ucapan' },
                { key: 'amplop', label: 'Amplop Digital' },
                { key: 'gallery', label: 'Galeri' },
                { key: 'music', label: 'Musik Latar' },
              ].map(feat => {
                const isActive = formData.features[feat.key as keyof typeof formData.features];
                return (
                  <div key={feat.key} className="flex items-center justify-between p-3 bg-white border border-[#E9E2D9] rounded-xl">
                    <span className="text-sm font-semibold text-[#2A211B]">{feat.label}</span>
                    <button 
                      onClick={() => updateFeature(feat.key as keyof typeof formData.features)}
                      className={`w-11 h-6 rounded-full relative transition-colors ${isActive ? 'bg-[#B4894D]' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card: Amplop & Rekening */}
          {formData.features.amplop && (
            <div className="bg-[#FAF8F6] rounded-2xl p-6 shadow-sm border border-black/[0.04]">
              <h3 className="text-lg font-bold text-[#2A211B] mb-5">Amplop & Rekening</h3>
              <div className="space-y-4">
                {formData.banks.map((b, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-white border border-[#E9E2D9] rounded-xl">
                    <div className="w-full md:w-1/3">
                      <label className="text-xs font-semibold text-[#8A7B6E] mb-1 block">Nama Bank / Wallet</label>
                      <input type="text" value={b.bank} onChange={e => updateBank(i, 'bank', e.target.value)} className="w-full px-3 py-1.5 bg-[#FAF8F6] border border-[#E9E2D9] rounded-lg text-sm outline-none focus:border-[#B4894D]" />
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="text-xs font-semibold text-[#8A7B6E] mb-1 block">Nomor Rekening</label>
                      <input type="text" value={b.acc} onChange={e => updateBank(i, 'acc', e.target.value)} className="w-full px-3 py-1.5 bg-[#FAF8F6] border border-[#E9E2D9] rounded-lg text-sm outline-none focus:border-[#B4894D]" />
                    </div>
                    <div className="w-full md:w-1/3">
                      <label className="text-xs font-semibold text-[#8A7B6E] mb-1 block">Atas Nama</label>
                      <input type="text" value={b.name} onChange={e => updateBank(i, 'name', e.target.value)} className="w-full px-3 py-1.5 bg-[#FAF8F6] border border-[#E9E2D9] rounded-lg text-sm outline-none focus:border-[#B4894D]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card: Tautan Undangan */}
          <div className="bg-[#FAF8F6] rounded-2xl p-6 shadow-sm border border-black/[0.04]">
            <h3 className="text-lg font-bold text-[#2A211B] mb-5">Tautan Undangan</h3>
            <label className="text-sm font-semibold text-[#2A211B] mb-2 block">Custom URL Slug</label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center bg-white border border-[#E9E2D9] rounded-xl overflow-hidden px-3">
                <span className="text-[#8A7B6E] text-sm">invito.id/</span>
                <input type="text" value={formData.slug} onChange={e => updateForm('slug', e.target.value)} className="w-full py-2.5 bg-transparent text-sm outline-none text-[#2A211B] font-medium" />
              </div>
              <button onClick={handleCopyLink} className="px-4 py-2.5 bg-[#FAF8F6] border border-[#E9E2D9] hover:border-[#B4894D] text-[#B4894D] rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                <Copy className="w-4 h-4" /> Salin
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PREVIEW (Strict structure to prevent overlap, exact rules applied) */}
        <div style={{ position: 'sticky', top: '96px', height: 'calc(100vh - 120px)', maxHeight: '800px', zIndex: 1 }} className="hidden xl:flex justify-center w-full">
          {/* Phone container */}
          <div style={{ height: '100%', borderRadius: '40px', overflow: 'hidden', position: 'relative', border: '12px solid #111827', width: '360px', backgroundColor: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            {/* Notch */}
            <div style={{ position: 'absolute', top: 0, left: '25%', width: '50%', height: '24px', backgroundColor: '#111827', zIndex: 20, borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }} />
            
            {/* Live Preview Badge */}
            <span style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 20, backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold', color: '#B4894D', textTransform: 'uppercase', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              Live Preview
            </span>
            
            {/* Phone Screen Inner (Scrollable) */}
            <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#FAF8F6', position: 'relative', zIndex: 10 }} className="custom-scrollbar flex flex-col">
              
              {/* 1. COVER (100% height of phone) */}
              <div style={{ minHeight: '100%', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', flexShrink: 0 }}>
                 <div style={{ position: 'absolute', inset: 0 }}>
                   <img src={formData.photoWoman || backgroundImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cover" />
                 </div>
                 <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
                 
                 <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '48px 0', width: '100%' }}>
                    <div>
                      <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: '8px', marginTop: '16px' }}>The Wedding Of</p>
                      <h2 style={{ fontFamily: 'serif', fontSize: '48px', fontWeight: 'bold', fontStyle: 'italic', color: 'white', textShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '32px' }}>Wedding</h2>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' }}>
                      <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', lineHeight: 1.2, color: formData.accentColor, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {formData.woman}<br/>&<br/>{formData.man}
                      </h1>
                      <p style={{ fontSize: '14px', color: 'white', fontWeight: 600, marginBottom: '48px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{getFormattedDate(formData.date)}</p>
                      <button 
                        onClick={smoothScrollToContent}
                        style={{ backgroundColor: formData.accentColor, color: 'white', padding: '10px 24px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'opacity 0.2s', cursor: 'pointer' }}
                        onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                      >
                        Buka Undangan
                      </button>
                    </div>
                 </div>
              </div>
              
              {/* 2. PEMBUKA */}
              <div id="preview-pembuka" style={{ padding: '32px', textAlign: 'center', backgroundColor: 'white' }}>
                <p style={{ fontSize: '12px', color: '#8A7B6E', fontStyle: 'italic', lineHeight: 1.6 }}>"{formData.description}"</p>
              </div>

              {/* 3. MEMPELAI */}
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', marginBottom: '12px', border: `2px solid ${formData.accentColor}`, padding: '4px' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#E9E2D9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4894D', fontSize: '24px', fontFamily: 'serif' }}>
                      {formData.photoWoman ? (
                        <img src={formData.photoWoman} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Woman" />
                      ) : (
                        formData.woman.charAt(0)
                      )}
                    </div>
                  </div>
                  <h2 style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: formData.accentColor }}>{formData.woman}</h2>
                  <p style={{ fontSize: '10px', color: '#8A7B6E' }}>{formData.parentWoman}</p>
                </div>
                
                <div style={{ fontSize: '30px', fontFamily: 'serif', color: '#E9E2D9', margin: '16px 0' }}>&</div>
                
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', marginBottom: '12px', border: `2px solid ${formData.accentColor}`, padding: '4px' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#E9E2D9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4894D', fontSize: '24px', fontFamily: 'serif' }}>
                      {formData.photoMan ? (
                        <img src={formData.photoMan} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Man" />
                      ) : (
                        formData.man.charAt(0)
                      )}
                    </div>
                  </div>
                  <h2 style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: formData.accentColor }}>{formData.man}</h2>
                  <p style={{ fontSize: '10px', color: '#8A7B6E' }}>{formData.parentMan}</p>
                </div>
              </div>

              {/* 4. HITUNG MUNDUR */}
              {formData.features.countdown && (
                <div style={{ padding: '24px', backgroundColor: 'white', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 'bold', color: '#2A211B', marginBottom: '16px' }}>Menuju Hari Bahagia</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {[
                      { label: 'Hari', val: countdown.days },
                      { label: 'Jam', val: countdown.hours },
                      { label: 'Menit', val: countdown.mins },
                      { label: 'Detik', val: countdown.secs }
                    ].map(t => (
                      <div key={t.label} style={{ width: '48px', height: '56px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', backgroundColor: formData.accentColor, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1 }}>{t.val}</span>
                        <span style={{ fontSize: '8px', opacity: 0.9, marginTop: '4px' }}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. RANGKAIAN ACARA */}
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 'bold', color: '#2A211B', marginBottom: '16px' }}>Rangkaian Acara</h3>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: formData.accentColor }}>Akad Nikah</h4>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#2A211B' }}>{getFormattedDate(formData.date)}</p>
                  <p style={{ fontSize: '12px', color: '#2A211B', marginBottom: '8px' }}>{formData.akadTime} - Selesai</p>
                  <p style={{ fontSize: '11px', color: '#8A7B6E', marginBottom: '12px' }}>{formData.akadLocation}<br/>{formData.fullAddress}</p>
                  <button onClick={() => toast.success("Membuka peta...")} style={{ padding: '6px 16px', border: `1px solid ${formData.accentColor}`, borderRadius: '9999px', fontSize: '10px', fontWeight: 600, color: formData.accentColor, backgroundColor: 'white', cursor: 'pointer' }}>
                    Lihat Lokasi
                  </button>
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: formData.accentColor }}>Resepsi</h4>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#2A211B' }}>{getFormattedDate(formData.date)}</p>
                  <p style={{ fontSize: '12px', color: '#2A211B', marginBottom: '8px' }}>{formData.resepsiTime} - Selesai</p>
                  <p style={{ fontSize: '11px', color: '#8A7B6E', marginBottom: '12px' }}>{formData.resepsiLocation}<br/>{formData.fullAddress}</p>
                  <button onClick={() => toast.success("Membuka peta...")} style={{ padding: '6px 16px', border: `1px solid ${formData.accentColor}`, borderRadius: '9999px', fontSize: '10px', fontWeight: 600, color: formData.accentColor, backgroundColor: 'white', cursor: 'pointer' }}>
                    Lihat Lokasi
                  </button>
                </div>
              </div>

              {/* 6. GALERI */}
              {formData.features.gallery && formData.gallery.length > 0 && (
                <div style={{ padding: '24px', backgroundColor: 'white', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 'bold', color: '#2A211B', marginBottom: '16px' }}>Galeri</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} style={{ aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. AMPLOP DIGITAL */}
              {formData.features.amplop && (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 'bold', color: '#2A211B', marginBottom: '16px' }}>Amplop Digital</h3>
                  <p style={{ fontSize: '10px', color: '#8A7B6E', marginBottom: '16px' }}>Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika bermaksud memberikan tanda kasih, dapat melalui:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formData.banks.map((b, i) => (
                      <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', textAlign: 'left' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '64px', height: '64px', opacity: 0.03, backgroundColor: 'black', borderBottomLeftRadius: '9999px', pointerEvents: 'none' }} />
                        <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: formData.accentColor }}>{b.bank}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <p style={{ fontSize: '14px', fontFamily: 'monospace', letterSpacing: '0.05em', fontWeight: 600, color: '#2A211B' }}>{b.acc}</p>
                          <button onClick={() => toast.success("No rekening disalin")} style={{ color: '#8A7B6E', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                            <Copy style={{ width: '12px', height: '12px' }} />
                          </button>
                        </div>
                        <p style={{ fontSize: '10px', color: '#8A7B6E' }}>a.n {b.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. RSVP & UCAPAN */}
              {formData.features.rsvp && (
                <div style={{ padding: '24px', backgroundColor: 'white' }}>
                  <h3 style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 'bold', color: '#2A211B', marginBottom: '16px', textAlign: 'center' }}>RSVP & Ucapan</h3>
                  <div style={{ backgroundColor: '#FAF8F6', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <input type="text" placeholder="Nama Anda" value={rsvpForm.name} onChange={e => setRsvpForm(prev => ({...prev, name: e.target.value}))} style={{ width: '100%', padding: '8px 12px', fontSize: '11px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #E9E2D9', outline: 'none', backgroundColor: 'white' }} />
                    <select value={rsvpForm.hadir ? "hadir" : "tidak"} onChange={e => setRsvpForm(prev => ({...prev, hadir: e.target.value === "hadir"}))} style={{ width: '100%', padding: '8px 12px', fontSize: '11px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #E9E2D9', outline: 'none', backgroundColor: 'white' }}>
                      <option value="hadir">Hadir</option>
                      <option value="tidak">Tidak Hadir</option>
                    </select>
                    <textarea placeholder="Pesan untuk mempelai" value={rsvpForm.message} onChange={e => setRsvpForm(prev => ({...prev, message: e.target.value}))} style={{ width: '100%', padding: '8px 12px', fontSize: '11px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #E9E2D9', outline: 'none', resize: 'none', backgroundColor: 'white' }} rows={3} />
                    <button onClick={handleKirimUcapan} style={{ width: '100%', padding: '8px', color: 'white', fontSize: '11px', fontWeight: 600, borderRadius: '8px', backgroundColor: formData.accentColor, border: 'none', cursor: 'pointer' }}>Kirim Ucapan</button>
                  </div>
                  
                  {ucapan.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '192px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                      {ucapan.map((u, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#E9E2D9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', fontWeight: 'bold', color: formData.accentColor }}>
                            {u.name.charAt(0)}
                          </div>
                          <div style={{ backgroundColor: '#FAF8F6', borderRadius: '12px', borderTopLeftRadius: 0, padding: '12px', flex: 1, border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2A211B' }}>{u.name}</span>
                              <span style={{ fontSize: '8px', color: '#8A7B6E', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.05)' }}>{u.hadir ? 'Hadir' : 'Absen'}</span>
                            </div>
                            <p style={{ fontSize: '10px', color: '#8A7B6E', lineHeight: 1.6 }}>{u.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 9. FOOTER */}
              <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#FAF8F6' }}>
                <p style={{ fontSize: '10px', color: '#8A7B6E', fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.6 }}>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
                <h2 style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: formData.accentColor }}>{formData.woman} & {formData.man}</h2>
                <div style={{ width: '32px', height: '1px', backgroundColor: '#E9E2D9', margin: '0 auto 16px' }} />
                <p style={{ fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7B6E', fontWeight: 600 }}>Invito Dashboard</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

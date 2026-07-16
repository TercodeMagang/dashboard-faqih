$file = "c:\Users\user\Downloads\frontend-Faqih\src\app\App.tsx"
$allLines = [System.IO.File]::ReadAllLines($file)

# Find `| "blog"` in the Page type (should be around line 30)
$blogTypeIdx = -1
for ($i = 15; $i -lt 40; $i++) {
    if ($allLines[$i].Trim() -eq '| "blog"') { $blogTypeIdx = $i; break }
}

# Find `function FaqItem` line
$faqItemIdx = -1
for ($i = 1700; $i -lt 1760; $i++) {
    if ($allLines[$i] -match '^function FaqItem') { $faqItemIdx = $i; break }
}

Write-Host "blogTypeIdx=$blogTypeIdx  faqItemIdx=$faqItemIdx"

# Build header: lines 0..(faqItemIdx-1), inserting new Page types after "blog"
$kept = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $faqItemIdx; $i++) {
    $kept.Add($allLines[$i])
    if ($i -eq $blogTypeIdx) {
        $kept.Add('  | "tentang"')
        $kept.Add('  | "karir"')
        $kept.Add('  | "kontak"')
        $kept.Add('  | "panduan"')
        $kept.Add('  | "privasi"')
        $kept.Add('  | "syarat"')
        $kept.Add('  | "cookie"')
    }
}

$header = $kept -join "`r`n"

# ─── TAIL CONTENT ─────────────────────────────────────────────────────────────
$tail = @'

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="py-4">
      <button className="w-full text-left flex justify-between items-center text-sm font-semibold" onClick={() => setOpen(!open)}>
        {q}
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{a}</p>}
    </div>
  )
}

function SiteFooter({ setPage }: { setPage?: (p: Page) => void }) {
  const nav = setPage ?? (() => {})
  return (
    <footer className="py-16 px-6 bg-foreground text-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <Heart className="w-5 h-5 text-primary fill-primary/30" />
              <span className="font-serif text-xl font-semibold italic">Invito</span>
            </div>
            <p className="text-sm text-background/55 leading-relaxed max-w-xs">Platform undangan digital pernikahan terbaik di Indonesia. Jadikan momen spesial Anda semakin berkesan.</p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          {[
            { title: "Perusahaan", links: [{ label: "Tentang Kami", page: "tentang" }, { label: "Karir", page: "karir" }, { label: "Blog", page: "blog" }, { label: "Press Kit", page: "tentang" }] },
            { title: "Bantuan", links: [{ label: "FAQ", page: "panduan" }, { label: "Panduan", page: "panduan" }, { label: "Kontak", page: "kontak" }, { label: "WhatsApp Support", page: "kontak" }] },
            { title: "Legal", links: [{ label: "Kebijakan Privasi", page: "privasi" }, { label: "Syarat & Ketentuan", page: "syarat" }, { label: "Cookie Policy", page: "cookie" }] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, page }) => (
                  <li key={label}>
                    <button onClick={() => nav(page as Page)} className="text-sm text-background/55 hover:text-background transition-colors text-left">{label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-background/40">© 2025 Invito. Hak cipta dilindungi undang-undang.</p>
          <p className="text-xs text-background/40">Dibuat dengan ❤️ di Indonesia</p>
        </div>
      </div>
    </footer>
  )
}

// ─── FITUR PAGE ───────────────────────────────────────────────────────────────

function FiturPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><Sparkles className="w-3 h-3" />Semua yang Anda Butuhkan</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Fitur Invito</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Semua alat untuk membuat undangan digital premium yang modern dan mudah digunakan.</p>
        <button onClick={() => setPage("checkout")} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Mulai Gratis <ArrowRight className="w-4 h-4" /></button>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">Fitur Unggulan</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-12">8 Fitur Terbaik Invito</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageCircle, title: "RSVP Otomatis", desc: "Kelola konfirmasi kehadiran secara otomatis via WhatsApp dan email." },
              { icon: Users, title: "Buku Tamu Digital", desc: "Catat dan kelola tamu dengan mudah, lengkap dengan catatan khusus." },
              { icon: Clock, title: "Countdown", desc: "Hitung mundur acara dengan tampilan elegan di undangan." },
              { icon: Camera, title: "Galeri Foto", desc: "Unggah foto pre-wedding, galeri acara, dan video highlight." },
              { icon: Music, title: "Musik Latar", desc: "Tambahkan soundtrack khusus untuk menambah suasana romantis." },
              { icon: MapPin, title: "Google Maps", desc: "Tampilkan lokasi venue secara interaktif dengan peta terintegrasi." },
              { icon: Heart, title: "Love Story", desc: "Ceritakan kisah cinta Anda dalam bentuk timeline yang indah." },
              { icon: QrCode, title: "QR Check-in", desc: "Masuk ke acara hanya dengan scan QR, memudahkan seluruh tamu." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-primary" /></div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">Cara Kerja</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-12">Mudah dalam 3 Langkah</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Layout, num: "01", title: "Pilih Template", desc: "Pilih desain yang cocok dengan tema pernikahan Anda dari ratusan pilihan." },
              { icon: Edit3, num: "02", title: "Isi Data", desc: "Masukkan detail acara, foto, dan informasi tamu dengan mudah." },
              { icon: Share2, num: "03", title: "Bagikan Undangan", desc: "Bagikan tautan melalui WhatsApp, email, atau media sosial." },
            ].map(({ icon: Icon, num, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(196,149,74,0.4)]"><Icon className="w-7 h-7" /></div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-mono text-primary/60 bg-card border border-primary/20 rounded-full w-5 h-5 flex items-center justify-center">{num}</span>
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">FAQ</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-10">Pertanyaan Umum</h2>
          <div className="divide-y divide-border">
            {[
              { q: "Bagaimana cara membuat undangan?", a: "Pilih template, isi data acara dan tamu, lalu bagikan tautan undangan kepada tamu Anda." },
              { q: "Apakah ada biaya untuk fitur dasar?", a: "Tidak, semua fitur dasar tersedia secara gratis. Paket premium menawarkan fitur tambahan eksklusif." },
              { q: "Bisakah saya mengubah desain setelah dipublikasikan?", a: "Ya, Anda dapat mengedit konten kapan saja melalui dashboard tanpa batas." },
              { q: "Apakah undangan dapat diakses di semua perangkat?", a: "Undangan responsif dan dapat dibuka di desktop, tablet, maupun ponsel dengan tampilan optimal." },
              { q: "Bagaimana keamanan data tamu saya?", a: "Data disimpan dengan enkripsi SSL dan hanya dapat diakses oleh Anda sebagai pemilik akun." },
            ].map(({ q, a }, i) => <FaqItem key={i} q={q} a={a} />)}
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-10 h-10 text-primary fill-primary/15 mx-auto mb-5" />
          <h2 className="font-serif text-4xl font-semibold mb-4">Siap Membuat Undangan Impian?</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Bergabung dengan 10.000+ pasangan yang telah mempercayai Invito.</p>
          <button onClick={() => setPage("checkout")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Mulai Gratis <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── TEMA PAGE ────────────────────────────────────────────────────────────────

function TemaPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><Palette className="w-3 h-3" />Koleksi Eksklusif</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Pilihan Tema Invito</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Ratusan tema elegan dirancang khusus untuk membuat momen pernikahan Anda semakin berkesan.</p>
        <button onClick={() => setPage("checkout")} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Mulai Pakai Tema <ArrowRight className="w-4 h-4" /></button>
      </section>
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-semibold mb-8">Jelajahi Kategori Tema</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Semua", "Elegan", "Floral", "Minimalist", "Modern", "Traditional", "Luxury", "Rustic"].map((cat) => (
              <button key={cat} className="px-5 py-2 border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors">{cat}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {THEMES.map(({ name, img, badge }, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-${img}?w=600&h=400&fit=crop&auto=format`} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                  {badge && <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium">{badge}</div>}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div><h3 className="font-semibold text-sm">{name}</h3><p className="text-[11px] text-muted-foreground mt-0.5">24 variasi tersedia</p></div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-[11px] border border-border rounded-full hover:border-primary hover:text-primary transition-colors">Preview</button>
                    <button onClick={() => setPage("checkout")} className="px-3 py-1.5 text-[11px] bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Gunakan</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ value: "200+", label: "Tema Tersedia" }, { value: "10K+", label: "Pasangan Puas" }, { value: "50+", label: "Desainer Profesional" }, { value: "4.9★", label: "Rating Rata-rata" }].map(({ value, label }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-6"><p className="text-2xl font-bold text-primary mb-1">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
          ))}
        </div>
      </section>
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-10 h-10 text-primary fill-primary/15 mx-auto mb-5" />
          <h2 className="font-serif text-4xl font-semibold mb-4">Temukan Tema Sempurna Anda</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Setiap tema dapat dikustomisasi sesuai selera Anda.</p>
          <button onClick={() => setPage("checkout")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Mulai Gratis <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── HARGA PAGE ───────────────────────────────────────────────────────────────

function HargaPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><Package className="w-3 h-3" />Harga Transparan</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Harga Invito</h1>
        <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">Pilih paket yang sesuai kebutuhan Anda. Mulai gratis, upgrade kapan saja.</p>
        <p className="text-sm text-primary font-medium">Tanpa biaya tersembunyi</p>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative bg-card rounded-3xl p-7 border-2 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(196,149,74,0.12)] ${pkg.popular ? "border-primary" : "border-border"}`}>
                {pkg.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium whitespace-nowrap">PALING POPULER</div>}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${pkg.popular ? "bg-primary/15" : "bg-muted"}`}><Package className={`w-5 h-5 ${pkg.popular ? "text-primary" : "text-muted-foreground"}`} /></div>
                <h3 className="font-serif text-xl font-semibold mb-1">{pkg.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{pkg.subtitle}</p>
                <div className="mb-5">
                  {pkg.originalPrice && <p className="text-xs text-muted-foreground line-through mb-0.5">{fmt(pkg.originalPrice)}</p>}
                  <p className="text-3xl font-bold text-foreground">{fmt(pkg.price)}</p>
                </div>
                <ul className="space-y-2.5 mb-7">{pkg.features.map((f, j) => (<li key={j} className="flex items-start gap-2 text-xs"><Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${pkg.popular ? "text-primary" : "text-muted-foreground"}`} />{f}</li>))}</ul>
                <button onClick={() => setPage("checkout")} className={`w-full py-3 rounded-full text-sm transition-all ${pkg.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border hover:border-primary hover:text-primary"}`}>Pilih Paket {pkg.name}</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-10">Perbandingan Fitur</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left p-4 font-semibold">Fitur</th>{PACKAGES.map(p => <th key={p.id} className={`p-4 font-semibold text-center ${p.popular ? "text-primary" : ""}`}>{p.name}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {[
                  { label: "Link undangan digital", values: [true, true, true] },
                  { label: "RSVP & ucapan tamu", values: [true, true, true] },
                  { label: "Galeri foto", values: ["10 item", "Tak terbatas", "Tak terbatas"] },
                  { label: "Custom domain", values: [false, true, true] },
                  { label: "Musik latar", values: [false, true, true] },
                  { label: "Amplop digital", values: [false, true, true] },
                  { label: "QR Code Check-In", values: [false, false, true] },
                  { label: "Live streaming", values: [false, false, true] },
                  { label: "Support prioritas", values: [false, false, true] },
                ].map(({ label, values }) => (
                  <tr key={label} className="hover:bg-muted/50">
                    <td className="p-4 text-muted-foreground">{label}</td>
                    {values.map((v, i) => (<td key={i} className="p-4 text-center">{v === true ? <Check className="w-4 h-4 text-primary mx-auto" /> : v === false ? <span className="text-muted-foreground/40">—</span> : <span className="text-xs font-medium">{v}</span>}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-10">FAQ Seputar Harga</h2>
          <div className="divide-y divide-border">
            {[
              { q: "Apakah ada uji coba gratis?", a: "Ya, paket Basic tersedia gratis tanpa batas waktu." },
              { q: "Apa metode pembayaran yang diterima?", a: "Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA), QRIS, kartu kredit, dan gerai Alfamart/Indomaret." },
              { q: "Apakah harga sudah termasuk pajak?", a: "Harga yang ditampilkan sudah final dan tidak ada biaya tersembunyi." },
              { q: "Bisakah saya upgrade paket di tengah jalan?", a: "Ya, Anda bisa upgrade kapan saja dengan biaya dihitung secara prorata." },
              { q: "Apakah ada refund jika tidak puas?", a: "Kami menawarkan garansi 7 hari uang kembali jika Anda tidak puas." },
            ].map(({ q, a }, i) => <FaqItem key={i} q={q} a={a} />)}
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-10 h-10 text-primary fill-primary/15 mx-auto mb-5" />
          <h2 className="font-serif text-4xl font-semibold mb-4">Mulai Perjalanan Anda Hari Ini</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Bergabung gratis, tanpa kartu kredit diperlukan.</p>
          <button onClick={() => setPage("checkout")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Mulai Gratis <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────

function BlogPage({ setPage }: { setPage: (p: Page) => void }) {
  const POSTS = [
    { title: "10 Inspirasi Undangan Digital Pernikahan 2025", cat: "Inspirasi", date: "10 Jul 2025", read: "5 mnt", img: "1519225421980-715cb0215aed" },
    { title: "Cara Membuat RSVP Digital yang Efektif", cat: "Tips & Trik", date: "5 Jul 2025", read: "4 mnt", img: "1550005809-91ad75fb315f" },
    { title: "Tren Undangan Pernikahan Minimalis", cat: "Tren", date: "1 Jul 2025", read: "6 mnt", img: "1464366400600-7168b8af9bc3" },
    { title: "Panduan Lengkap Amplop Digital untuk Tamu", cat: "Panduan", date: "25 Jun 2025", read: "7 mnt", img: "1469371670807-013ccf25f16a" },
    { title: "Memilih Musik Latar yang Tepat untuk Undangan", cat: "Tips & Trik", date: "20 Jun 2025", read: "3 mnt", img: "1583939003579-730e3918a45a" },
  ]
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><FileText className="w-3 h-3" />Blog & Inspirasi</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Blog Invito</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Tips, inspirasi, dan panduan untuk membuat undangan pernikahan yang sempurna.</p>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-6">Artikel Pilihan</p>
          <div className="grid md:grid-cols-2 gap-0 bg-card border border-border rounded-3xl overflow-hidden">
            <div className="relative h-64 md:h-auto overflow-hidden"><img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&auto=format" alt="Featured" className="w-full h-full object-cover" /></div>
            <div className="p-8 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-4 w-fit">Inspirasi</span>
              <h2 className="font-serif text-2xl font-semibold mb-4">10 Inspirasi Undangan Digital Pernikahan 2025</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Temukan inspirasi terbaik untuk membuat undangan pernikahan digital yang memukau tamu Anda.</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6"><span>10 Jul 2025</span><span>•</span><span>5 menit baca</span></div>
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-all flex items-center gap-2 w-fit">Baca Selengkapnya <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {["Semua", "Inspirasi", "Tips & Trik", "Panduan", "Tren"].map((cat) => (
            <button key={cat} className="px-4 py-1.5 border border-border rounded-full text-xs hover:border-primary hover:text-primary transition-colors">{cat}</button>
          ))}
        </div>
      </section>
      <section className="py-10 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.slice(1).map(({ title, cat, date, read, img }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-44 overflow-hidden"><img src={`https://images.unsplash.com/photo-${img}?w=600&h=400&fit=crop&auto=format`} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full mb-3">{cat}</span>
                  <h3 className="font-semibold text-sm mb-3 leading-snug">{title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground"><span>{date}</span><span>•</span><span>{read} baca</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Bell className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-semibold mb-3">Langganan Newsletter</h2>
          <p className="text-muted-foreground text-sm mb-8">Dapatkan artikel terbaru, tips pernikahan, dan promo eksklusif langsung di inbox Anda.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Masukkan email Anda..." className="flex-1 px-4 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:border-primary transition-colors" />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-all whitespace-nowrap">Langganan</button>
          </div>
        </div>
      </section>
      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── TENTANG PAGE ─────────────────────────────────────────────────────────────

function TentangPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><Sparkles className="w-3 h-3" />Kisah Kami</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Tentang Invito</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Kami percaya setiap kisah cinta layak dirayakan dengan cara yang istimewa. Invito hadir untuk mewujudkan undangan pernikahan digital impian Anda.</p>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, value: "10.000+", label: "Pasangan Bahagia" },
            { icon: Palette, value: "200+", label: "Tema Tersedia" },
            { icon: Star, value: "4.9/5", label: "Rating Pengguna" },
            { icon: Globe, value: "50+", label: "Kota di Indonesia" },
          ].map(({ icon: Icon, value, label }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border border-border rounded-2xl p-6 hover:shadow-[0_8px_32px_rgba(196,149,74,0.08)] transition-all">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3"><Icon className="w-5 h-5 text-primary" /></div>
              <p className="text-2xl font-bold text-primary mb-1">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">Misi & Visi</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-12">Mengapa Kami Ada</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-3xl p-8 border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5"><Heart className="w-6 h-6 text-primary" /></div>
              <h3 className="font-serif text-2xl font-semibold mb-3">Misi Kami</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Mempermudah setiap pasangan di Indonesia untuk menciptakan undangan pernikahan digital yang indah, personal, dan berkesan — dengan teknologi yang sederhana dan harga yang terjangkau.</p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5"><Zap className="w-6 h-6 text-primary" /></div>
              <h3 className="font-serif text-2xl font-semibold mb-3">Visi Kami</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Menjadi platform undangan digital #1 di Asia Tenggara yang menghubungkan jutaan pasangan dengan teknologi modern, desain premium, dan pengalaman yang tak terlupakan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">Perjalanan Kami</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-14">Milestone Invito</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            {[
              { year: "2020", title: "Invito Didirikan", desc: "Berawal dari ide sederhana — membuat undangan pernikahan lebih mudah dan berkesan. Tim pertama kami terdiri dari 3 orang di Bandung.", icon: Sparkles },
              { year: "2021", title: "100 Pengguna Pertama", desc: "Milestone pertama kami! 100 pasangan mempercayai Invito untuk hari spesial mereka.", icon: Users },
              { year: "2022", title: "Peluncuran Versi Premium", desc: "Meluncurkan paket Standard dan Premium dengan fitur RSVP otomatis, amplop digital, dan Google Maps terintegrasi.", icon: Package },
              { year: "2023", title: "5.000+ Pasangan", desc: "Komunitas Invito berkembang pesat. Ratusan tema baru ditambahkan setiap bulan.", icon: TrendingUp },
              { year: "2024", title: "10.000+ Pasangan", desc: "Mencapai milestone 10.000 pasangan dan hadir di 50+ kota di seluruh Indonesia.", icon: Heart },
              { year: "2025", title: "Ekspansi Asia Tenggara", desc: "Mempersiapkan ekspansi ke Malaysia, Singapura, dan Thailand.", icon: Globe },
            ].map(({ year, title, desc, icon: Icon }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-12 pb-10 last:pb-0">
                <div className="absolute left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_0_4px_hsl(var(--background))]">
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xs text-primary font-medium tracking-wider">{year}</span>
                <h3 className="font-semibold text-base mt-1 mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">Nilai Kami</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-12">Yang Kami Percaya</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Inovasi", desc: "Kami terus berinovasi untuk menghadirkan fitur terbaik yang memudahkan hidup pengguna kami." },
              { icon: Shield, title: "Kepercayaan", desc: "Data dan privasi pengguna adalah prioritas utama kami. Keamanan tidak pernah kami kompromikan." },
              { icon: Heart, title: "Kepedulian", desc: "Setiap pasangan istimewa. Kami hadir untuk memastikan momen mereka dirayakan dengan sempurna." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-7 border border-border text-center hover:shadow-[0_8px_32px_rgba(196,149,74,0.08)] transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"><Icon className="w-6 h-6 text-primary" /></div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-10 h-10 text-primary fill-primary/15 mx-auto mb-5" />
          <h2 className="font-serif text-4xl font-semibold mb-4">Bergabunglah Bersama Kami</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Jadilah bagian dari keluarga besar Invito dan ciptakan momen yang tak terlupakan.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setPage("checkout")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2">Mulai Gratis <ArrowRight className="w-4 h-4" /></button>
            <button onClick={() => setPage("kontak")} className="px-8 py-3.5 border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-all">Hubungi Kami</button>
          </div>
        </div>
      </section>

      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── KARIR PAGE ───────────────────────────────────────────────────────────────

function KarirPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><Users className="w-3 h-3" />Kami Sedang Berkembang</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Karir di Invito</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Bergabunglah dengan tim kami yang bersemangat untuk mengubah cara orang merayakan momen spesial mereka.</p>
        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Lihat Posisi Terbuka <ArrowRight className="w-4 h-4" /></button>
      </section>

      {/* Why Join */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">Kenapa Invito?</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-12">Manfaat Bergabung</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Pertumbuhan Cepat", desc: "Kembangkan karir Anda di perusahaan yang tumbuh 300% per tahun." },
              { icon: Heart, title: "Tim yang Solid", desc: "Bekerja bersama orang-orang berbakat, suportif, dan penuh semangat." },
              { icon: Gift, title: "Kompensasi Kompetitif", desc: "Gaji kompetitif, bonus kinerja, dan equity untuk karyawan senior." },
              { icon: Monitor, title: "Remote Friendly", desc: "Fleksibilitas bekerja dari mana saja di seluruh Indonesia." },
              { icon: TrendingUp, title: "Pengembangan Diri", desc: "Budget khusus untuk pelatihan, kursus, dan konferensi profesional." },
              { icon: Headphones, title: "Kesehatan & Wellbeing", desc: "Asuransi kesehatan lengkap, akses gym, dan mental health support." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bg-card rounded-2xl p-6 border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] hover:-translate-y-1 transition-all">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-primary" /></div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">Posisi Terbuka</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-12">Bergabung Sekarang</h2>
          <div className="space-y-4">
            {[
              { title: "Senior Frontend Engineer", dept: "Engineering", type: "Full-time", loc: "Remote / Bandung" },
              { title: "UI/UX Designer", dept: "Design", type: "Full-time", loc: "Remote / Jakarta" },
              { title: "Product Manager", dept: "Product", type: "Full-time", loc: "Jakarta" },
              { title: "Digital Marketing Specialist", dept: "Marketing", type: "Full-time", loc: "Remote" },
              { title: "Customer Success Manager", dept: "Operations", type: "Full-time", loc: "Jakarta / Surabaya" },
            ].map(({ title, dept, type, loc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-[0_4px_20px_rgba(196,149,74,0.1)] transition-all group">
                <div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">{dept}</span>
                    <span className="text-[10px] px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full">{type}</span>
                    <span className="text-[10px] px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{loc}</span>
                  </div>
                </div>
                <button className="mt-4 sm:mt-0 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-medium hover:bg-primary/90 transition-all whitespace-nowrap">Lamar Sekarang</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-10">Budaya Kerja Kami</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Heart, title: "Passion First", desc: "Kami bekerja dengan penuh semangat karena kami peduli pada produk dan pengguna kami." },
              { icon: Users, title: "Team Work", desc: "Kolaborasi adalah kunci. Kami percaya hasil terbaik lahir dari kerja sama tim yang solid." },
              { icon: TrendingUp, title: "Grow Together", desc: "Pertumbuhan individu adalah pertumbuhan perusahaan. Kami tumbuh bersama." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="bg-card rounded-2xl p-7 border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"><Icon className="w-6 h-6 text-primary" /></div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-5" />
          <h2 className="font-serif text-4xl font-semibold mb-4">Tidak Menemukan Posisi yang Tepat?</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Kirimkan CV Anda dan ceritakan bagaimana Anda bisa berkontribusi untuk Invito.</p>
          <button onClick={() => setPage("kontak")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Kirim Lamaran <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>

      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── KONTAK PAGE ──────────────────────────────────────────────────────────────

function KontakPage({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); toast.success("Pesan berhasil dikirim! Kami akan menghubungi Anda segera.") }
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><MessageCircle className="w-3 h-3" />Kami Siap Membantu</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Hubungi Kami</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Ada pertanyaan atau butuh bantuan? Tim kami siap membantu Anda kapan saja.</p>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              { icon: Mail, title: "Email", value: "halo@invito.id", sub: "Balas dalam 1x24 jam" },
              { icon: Phone, title: "WhatsApp", value: "+62 812-3456-7890", sub: "Senin–Sabtu 08.00–21.00" },
              { icon: MapPin, title: "Kantor", value: "Jl. Sudirman No. 1, Bandung", sub: "Jawa Barat 40114" },
              { icon: Clock, title: "Jam Operasional", value: "08.00 – 21.00 WIB", sub: "Senin – Sabtu" },
            ].map(({ icon: Icon, title, value, sub }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-[0_8px_32px_rgba(196,149,74,0.08)] transition-all">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3"><Icon className="w-5 h-5 text-primary" /></div>
                <p className="font-semibold text-sm mb-1">{title}</p>
                <p className="text-sm text-foreground mb-1">{value}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>

          {/* Form + Social */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="font-serif text-3xl font-semibold mb-8">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Nama Lengkap</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nama Anda" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" required />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@Anda.com" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Nomor WhatsApp</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+62 8xx-xxxx-xxxx" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Subjek</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors">
                      <option value="">Pilih subjek...</option>
                      <option>Pertanyaan Umum</option>
                      <option>Masalah Teknis</option>
                      <option>Pembayaran</option>
                      <option>Kemitraan</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block">Pesan</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Ceritakan kebutuhan Anda..." rows={5} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none" required />
                </div>
                <button type="submit" className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_4px_16px_rgba(196,149,74,0.4)] flex items-center justify-center gap-2">
                  Kirim Pesan <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Social & Quick Links */}
            <div>
              <h3 className="font-semibold mb-5">Ikuti Kami</h3>
              <div className="space-y-3 mb-8">
                {[
                  { Icon: Instagram, label: "@invito.id", color: "hover:text-pink-500" },
                  { Icon: Facebook, label: "Invito Indonesia", color: "hover:text-blue-500" },
                  { Icon: Twitter, label: "@invitoid", color: "hover:text-sky-500" },
                ].map(({ Icon, label, color }) => (
                  <button key={label} className={`flex items-center gap-3 text-sm text-muted-foreground ${color} transition-colors w-full`}>
                    <div className="w-9 h-9 bg-card border border-border rounded-full flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4" /></div>
                    {label}
                  </button>
                ))}
              </div>
              <h3 className="font-semibold mb-4">Bantuan Cepat</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Panduan Penggunaan", page: "panduan" },
                  { label: "Kebijakan Privasi", page: "privasi" },
                  { label: "Syarat & Ketentuan", page: "syarat" },
                ].map(({ label, page }) => (
                  <button key={label} onClick={() => setPage(page as Page)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-full">
                    <ChevronRight className="w-4 h-4" />{label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-10">Pertanyaan yang Sering Diajukan</h2>
          <div className="divide-y divide-border">
            {[
              { q: "Berapa lama waktu respons tim Invito?", a: "Tim kami membalas pesan dalam 1x24 jam pada hari kerja. Untuk pertanyaan mendesak, hubungi kami via WhatsApp." },
              { q: "Apakah ada dukungan telepon?", a: "Saat ini kami melayani via WhatsApp, email, dan live chat di website. Dukungan via telepon tersedia untuk pengguna Premium." },
              { q: "Bagaimana cara melaporkan bug atau masalah teknis?", a: "Kirimkan detail masalah beserta screenshot melalui formulir di atas atau email ke support@invito.id." },
              { q: "Apakah ada biaya untuk menghubungi support?", a: "Tidak ada biaya untuk menghubungi tim support kami. Layanan bantuan tersedia untuk semua pengguna." },
            ].map(({ q, a }, i) => <FaqItem key={i} q={q} a={a} />)}
          </div>
        </div>
      </section>

      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── PANDUAN PAGE ─────────────────────────────────────────────────────────────

function PanduanPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />

      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><FileText className="w-3 h-3" />Dokumentasi Lengkap</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Panduan Invito</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Pelajari cara membuat, mengkustomisasi, dan membagikan undangan pernikahan digital Anda.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => setPage("checkout")} className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2">Mulai Sekarang <ArrowRight className="w-4 h-4" /></button>
          <button onClick={() => setPage("kontak")} className="px-6 py-3 border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-all">Hubungi Support</button>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-3 text-center">Mulai Cepat</p>
          <h2 className="font-serif text-4xl font-semibold text-center mb-12">Cara Membuat Undangan</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", icon: User, title: "Daftar Akun", desc: "Buat akun gratis dengan email atau Google. Tidak perlu kartu kredit." },
              { num: "2", icon: Layout, title: "Pilih Template", desc: "Pilih dari 200+ tema elegan. Filter berdasarkan gaya, warna, atau konsep." },
              { num: "3", icon: Edit3, title: "Edit Konten", desc: "Isi data pernikahan, foto, RSVP, dan informasi venue dengan mudah." },
              { num: "4", icon: Share2, title: "Bagikan", desc: "Salin link dan bagikan via WhatsApp, email, atau sosial media." },
            ].map(({ num, icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative bg-card rounded-2xl p-6 border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.08)] transition-all">
                <span className="absolute top-4 right-4 text-4xl font-bold text-primary/10">{num}</span>
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-primary" /></div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Guides */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-10">Panduan Fitur</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: MessageCircle, title: "Menggunakan RSVP", desc: "Aktifkan fitur RSVP dan konfirmasi otomatis via WhatsApp untuk mengelola daftar tamu Anda." },
              { icon: Camera, title: "Galeri Foto & Video", desc: "Unggah hingga 100 foto dan video pre-wedding langsung dari perangkat Anda." },
              { icon: Music, title: "Musik Latar", desc: "Pilih dari koleksi musik pernikahan atau unggah lagu favorit Anda sendiri." },
              { icon: MapPin, title: "Integrasi Google Maps", desc: "Tambahkan lokasi venue dengan peta interaktif agar tamu mudah menemukan venue." },
              { icon: Globe, title: "Custom Domain", desc: "Gunakan domain pribadi seperti pernikahan-namaanda.id untuk kesan lebih profesional." },
              { icon: QrCode, title: "QR Code Check-in", desc: "Sederhanakan proses registrasi tamu dengan sistem QR code check-in di venue." },
              { icon: Gift, title: "Amplop Digital", desc: "Terima hadiah digital dari tamu dengan berbagai metode pembayaran yang terintegrasi." },
              { icon: Settings, title: "Pengaturan Akun", desc: "Kelola profil, notifikasi, dan preferensi akun Anda kapan saja." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-[0_4px_16px_rgba(196,149,74,0.08)] transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"><Icon className="w-5 h-5 text-primary" /></div>
                <div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-10">FAQ Teknis</h2>
          <div className="divide-y divide-border">
            {[
              { q: "Browser apa yang didukung Invito?", a: "Invito mendukung semua browser modern termasuk Chrome, Firefox, Safari, dan Edge. Kami merekomendasikan Chrome untuk performa terbaik." },
              { q: "Apakah undangan bisa diedit setelah dipublikasikan?", a: "Ya, Anda bisa mengedit kapan saja. Perubahan akan langsung terlihat di link undangan tanpa perlu membagikan ulang." },
              { q: "Berapa ukuran foto yang bisa diunggah?", a: "Setiap foto maksimal 10MB dengan format JPG, PNG, atau WebP. Video maksimal 100MB." },
              { q: "Apakah ada batas jumlah tamu?", a: "Tidak ada batas jumlah tamu. Anda bisa mengelola ribuan tamu dalam satu undangan." },
              { q: "Bisakah saya mengunduh undangan sebagai PDF?", a: "Fitur unduh PDF tersedia di paket Premium. Anda bisa mengunduh versi cetak undangan Anda." },
            ].map(({ q, a }, i) => <FaqItem key={i} q={q} a={a} />)}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <Headphones className="w-10 h-10 text-primary mx-auto mb-5" />
          <h2 className="font-serif text-3xl font-semibold mb-4">Masih Butuh Bantuan?</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Tim support kami siap membantu Anda 6 hari seminggu.</p>
          <button onClick={() => setPage("kontak")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Hubungi Support <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>

      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── PRIVASI PAGE ─────────────────────────────────────────────────────────────

function PrivasiPage({ setPage }: { setPage: (p: Page) => void }) {
  const sections = [
    { icon: Shield, title: "Informasi yang Kami Kumpulkan", content: "Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, termasuk nama, alamat email, nomor telepon, dan informasi pembayaran saat Anda mendaftar atau melakukan transaksi. Kami juga mengumpulkan data penggunaan seperti halaman yang dikunjungi, waktu akses, dan preferensi fitur untuk meningkatkan layanan kami." },
    { icon: Eye, title: "Bagaimana Kami Menggunakan Data", content: "Data Anda digunakan untuk menyediakan dan meningkatkan layanan Invito, memproses pembayaran, mengirimkan notifikasi penting, dan memberikan dukungan pelanggan. Kami tidak menjual data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran." },
    { icon: Users, title: "Berbagi Informasi", content: "Kami dapat berbagi informasi dengan mitra bisnis terpercaya yang membantu kami menyediakan layanan (seperti pemroses pembayaran), otoritas hukum jika diwajibkan oleh hukum, atau dengan persetujuan eksplisit Anda. Semua mitra terikat oleh perjanjian kerahasiaan yang ketat." },
    { icon: Lock, title: "Keamanan Data", content: "Kami menggunakan enkripsi SSL/TLS untuk semua transmisi data, menyimpan kata sandi dengan hashing bcrypt, dan melakukan audit keamanan berkala. Server kami berlokasi di pusat data bersertifikasi ISO 27001 di Indonesia." },
    { icon: Settings, title: "Hak Anda", content: "Anda memiliki hak untuk mengakses, memperbarui, atau menghapus data pribadi Anda kapan saja melalui pengaturan akun. Anda juga dapat mengajukan permintaan penghapusan data lengkap dengan menghubungi tim kami di privasi@invito.id." },
    { icon: Bell, title: "Perubahan Kebijakan", content: "Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di aplikasi minimal 14 hari sebelum berlaku. Penggunaan layanan setelah perubahan berlaku menandakan persetujuan Anda." },
  ]
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><Shield className="w-3 h-3" />Privasi & Keamanan</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Kebijakan Privasi</h1>
        <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">Privasi Anda adalah prioritas utama kami. Pelajari bagaimana kami melindungi data Anda.</p>
        <p className="text-xs text-muted-foreground">Terakhir diperbarui: 1 Januari 2025</p>
      </section>
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[{ icon: Shield, label: "Enkripsi SSL" }, { icon: Lock, label: "Data Terenkripsi" }, { icon: CheckCircle2, label: "GDPR Compliant" }, { icon: Star, label: "ISO 27001" }].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
              <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map(({ icon: Icon, title, content }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-card rounded-2xl p-7 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-primary" /></div>
                <h2 className="font-semibold">{title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-semibold mb-4">Pertanyaan tentang Privasi?</h2>
          <p className="text-muted-foreground text-sm mb-6">Hubungi tim privasi kami di privasi@invito.id atau melalui formulir kontak.</p>
          <button onClick={() => setPage("kontak")} className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Hubungi Kami <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── SYARAT PAGE ──────────────────────────────────────────────────────────────

function SyaratPage({ setPage }: { setPage: (p: Page) => void }) {
  const terms = [
    { title: "Penerimaan Syarat", content: "Dengan menggunakan layanan Invito, Anda menyetujui syarat dan ketentuan ini. Jika Anda tidak setuju, harap tidak menggunakan layanan kami. Kami berhak memperbarui syarat ini sewaktu-waktu dengan pemberitahuan yang wajar." },
    { title: "Penggunaan Layanan", content: "Layanan Invito hanya boleh digunakan untuk tujuan yang sah dan sesuai dengan hukum yang berlaku di Indonesia. Anda bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda. Dilarang menggunakan layanan untuk kegiatan ilegal, penipuan, atau yang merugikan pihak lain." },
    { title: "Konten Pengguna", content: "Anda mempertahankan kepemilikan atas konten yang Anda unggah ke Invito. Dengan mengunggah konten, Anda memberikan kami lisensi non-eksklusif untuk menampilkan konten tersebut sebagai bagian dari layanan. Anda bertanggung jawab memastikan Anda memiliki hak atas semua konten yang diunggah." },
    { title: "Pembayaran dan Pengembalian Dana", content: "Semua harga yang tercantum adalah harga final dalam Rupiah. Pembayaran diproses melalui gateway pembayaran yang aman. Kami menawarkan garansi pengembalian dana 7 hari untuk paket berbayar jika Anda tidak puas dengan layanan kami." },
    { title: "Batasan Tanggung Jawab", content: "Invito tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan kami. Tanggung jawab kami dibatasi pada jumlah yang Anda bayarkan dalam 3 bulan terakhir sebelum klaim." },
    { title: "Pemutusan Layanan", content: "Kami berhak menangguhkan atau menghentikan akun Anda jika terbukti melanggar syarat ini. Anda juga dapat menghapus akun kapan saja. Data Anda akan dihapus secara permanen dalam 30 hari setelah pemutusan layanan." },
  ]
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><FileText className="w-3 h-3" />Dokumen Legal</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Syarat & Ketentuan</h1>
        <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">Harap baca syarat dan ketentuan ini dengan seksama sebelum menggunakan layanan Invito.</p>
        <p className="text-xs text-muted-foreground">Berlaku sejak: 1 Januari 2025</p>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {terms.map(({ title, content }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-card rounded-2xl p-7 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                <h2 className="font-semibold">{title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-10">{content}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-semibold mb-4">Ada Pertanyaan Hukum?</h2>
          <p className="text-muted-foreground text-sm mb-6">Tim hukum kami siap membantu menjawab pertanyaan Anda tentang syarat dan ketentuan ini.</p>
          <button onClick={() => setPage("kontak")} className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Hubungi Kami <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── COOKIE PAGE ──────────────────────────────────────────────────────────────

function CookiePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6"><Monitor className="w-3 h-3" />Transparansi Data</div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Kebijakan Cookie</h1>
        <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">Pelajari bagaimana kami menggunakan cookie untuk meningkatkan pengalaman Anda di Invito.</p>
        <p className="text-xs text-muted-foreground">Terakhir diperbarui: 1 Januari 2025</p>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-7 border border-border mb-8">
            <h2 className="font-semibold text-lg mb-3">Apa itu Cookie?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Cookie adalah file teks kecil yang disimpan di perangkat Anda saat mengunjungi website. Cookie membantu website mengingat preferensi Anda, memastikan keamanan sesi, dan memberikan pengalaman yang lebih personal. Cookie tidak dapat menjalankan program atau mengirimkan virus ke komputer Anda.</p>
          </div>
          <h2 className="font-serif text-3xl font-semibold mb-8">Jenis Cookie yang Kami Gunakan</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {[
              { icon: Shield, title: "Cookie Esensial", badge: "Selalu Aktif", desc: "Diperlukan untuk fungsi dasar website seperti autentikasi, keamanan sesi, dan navigasi. Cookie ini tidak dapat dinonaktifkan.", examples: ["Session token", "CSRF protection", "Login state"] },
              { icon: TrendingUp, title: "Cookie Analitik", badge: "Opsional", desc: "Membantu kami memahami bagaimana pengunjung berinteraksi dengan website untuk meningkatkan performa dan konten.", examples: ["Halaman yang dikunjungi", "Durasi sesi", "Sumber traffic"] },
              { icon: Palette, title: "Cookie Preferensi", badge: "Opsional", desc: "Mengingat pilihan Anda seperti bahasa, tema tampilan, dan pengaturan lainnya untuk pengalaman yang lebih personal.", examples: ["Pengaturan bahasa", "Preferensi tema", "Layout pilihan"] },
              { icon: MessageCircle, title: "Cookie Pemasaran", badge: "Opsional", desc: "Digunakan untuk menampilkan iklan yang relevan dengan minat Anda di platform lain. Anda dapat menonaktifkan cookie ini.", examples: ["Retargeting ads", "Konversi iklan", "Audience insights"] },
            ].map(({ icon: Icon, title, badge, desc, examples }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
                    <h3 className="font-semibold text-sm">{title}</h3>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${badge === "Selalu Aktif" ? "bg-green-50 text-green-600 border border-green-200" : "bg-muted text-muted-foreground border border-border"}`}>{badge}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{desc}</p>
                <div className="space-y-1">
                  {examples.map(ex => (<div key={ex} className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="w-3 h-3 text-primary flex-shrink-0" />{ex}</div>))}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="bg-card rounded-2xl p-7 border border-border">
            <h2 className="font-semibold text-lg mb-3">Cara Mengelola Cookie</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">Anda dapat mengontrol dan menghapus cookie melalui pengaturan browser. Perlu diketahui bahwa menonaktifkan cookie tertentu dapat memengaruhi fungsionalitas website.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { browser: "Google Chrome", path: "Pengaturan > Privasi & Keamanan > Cookie" },
                { browser: "Mozilla Firefox", path: "Preferensi > Privasi & Keamanan" },
                { browser: "Safari", path: "Preferensi > Privasi" },
                { browser: "Microsoft Edge", path: "Pengaturan > Cookie & Izin Situs" },
              ].map(({ browser, path }) => (
                <div key={browser} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Monitor className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div><p className="text-xs font-medium">{browser}</p><p className="text-[11px] text-muted-foreground">{path}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-semibold mb-4">Pertanyaan tentang Cookie?</h2>
          <p className="text-muted-foreground text-sm mb-6">Hubungi kami jika Anda ingin informasi lebih lanjut tentang penggunaan cookie di Invito.</p>
          <button onClick={() => setPage("kontak")} className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">Hubungi Kami <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
      <SiteFooter setPage={setPage} />
    </div>
  )
}

// ─── ROOT ────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing")
  const [authTab, setAuthTab] = useState<AuthTab>("login")

  const render = () => {
    switch (page) {
      case "login": return <AuthPage setPage={setPage} initialTab={authTab} />
      case "dashboard": return <DashboardPage setPage={setPage} />
      case "editor": return <EditorPage setPage={setPage} />
      case "checkout": return <CheckoutPage setPage={setPage} />
      case "payment-method": return <PaymentMethodPage setPage={setPage} />
      case "payment-waiting": return <PaymentWaitingPage setPage={setPage} />
      case "payment-success": return <PaymentSuccessPage setPage={setPage} />
      case "payment-failed": return <PaymentFailedPage setPage={setPage} />
      case "fitur": return <FiturPage setPage={setPage} />
      case "tema": return <TemaPage setPage={setPage} />
      case "harga": return <HargaPage setPage={setPage} />
      case "blog": return <BlogPage setPage={setPage} />
      case "tentang": return <TentangPage setPage={setPage} />
      case "karir": return <KarirPage setPage={setPage} />
      case "kontak": return <KontakPage setPage={setPage} />
      case "panduan": return <PanduanPage setPage={setPage} />
      case "privasi": return <PrivasiPage setPage={setPage} />
      case "syarat": return <SyaratPage setPage={setPage} />
      case "cookie": return <CookiePage setPage={setPage} />
      default: return <LandingPage setPage={setPage} setAuthTab={setAuthTab} />
    }
  }

  return (
    <>
      {render()}
      <Toaster position="top-center" richColors />
    </>
  )
}
'@

# Fix: replace React.useState with useState (not needed since we import useState directly)
$tail = $tail -replace 'React\.useState\b', 'useState'
# Also fix: Lock is not imported — replace with Shield
$tail = $tail -replace '\bLock\b', 'Shield'

$newContent = $header + "`r`n" + $tail
[System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)

Write-Host "Done! New line count: $((Get-Content $file).Count)"
Write-Host "Functions declared:"
Select-String -Path $file -Pattern "^(function|export default function)" | ForEach-Object { "  Line $($_.LineNumber): $($_.Line.Trim())" }

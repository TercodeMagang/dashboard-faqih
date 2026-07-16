# Read the file
$file = "c:\Users\user\Downloads\frontend-Faqih\src\app\App.tsx"
$lines = [System.IO.File]::ReadAllLines($file)

# Keep lines 1-1700 (0-indexed: 0-1699)
$kept = $lines[0..1699]

# The new tail content (from line 1701 onward)
$tail = @'
            <button onClick={() => setPage("payment-waiting")} className="w-full py-3.5 border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />Gunakan Metode Sama
            </button>
          </div>

          {/* CS contact */}
          <div className="p-5 bg-card rounded-2xl border border-border">
            <p className="text-xs font-semibold mb-3 flex items-center gap-2"><Headphones className="w-4 h-4 text-primary" />Butuh Bantuan?</p>
            <p className="text-xs text-muted-foreground mb-3">Hubungi tim customer service kami jika Anda mengalami masalah pembayaran.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border rounded-full text-xs hover:border-primary hover:text-primary transition-all">
                <MessageCircle className="w-3.5 h-3.5" />WhatsApp CS
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border rounded-full text-xs hover:border-primary hover:text-primary transition-all">
                <Mail className="w-3.5 h-3.5" />Email Support
              </button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-3">Tersedia Senin–Sabtu, 08.00–21.00 WIB</p>
          </div>

          <button onClick={() => setPage("landing")} className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-2">
            ← Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="py-4">
      <button
        className="w-full text-left flex justify-between items-center text-sm font-semibold"
        onClick={() => setOpen(!open)}
      >
        {q}
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{a}</p>}
    </div>
  )
}

function SiteFooter() {
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
            { title: "Perusahaan", links: ["Tentang Kami", "Karir", "Blog", "Press Kit"] },
            { title: "Bantuan", links: ["FAQ", "Panduan", "Kontak", "WhatsApp Support"] },
            { title: "Legal", links: ["Kebijakan Privasi", "Syarat & Ketentuan", "Cookie Policy"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}><button className="text-sm text-background/55 hover:text-background transition-colors">{link}</button></li>
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

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6">
          <Sparkles className="w-3 h-3" />
          Semua yang Anda Butuhkan
        </div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Fitur Invito</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Semua alat untuk membuat undangan digital premium yang modern dan mudah digunakan.
        </p>
        <button
          onClick={() => setPage("checkout")}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-[0_8px_28px_rgba(196,149,74,0.38)] flex items-center gap-2 mx-auto"
        >
          Mulai Gratis <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 8 Feature Cards */}
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-5">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(196,149,74,0.4)]">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-mono text-primary/60 bg-card border border-primary/20 rounded-full w-5 h-5 flex items-center justify-center">{num}</span>
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
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
            ].map(({ q, a }, i) => (
              <FaqItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary/8 via-secondary to-accent/20 rounded-3xl p-14 border border-primary/20 overflow-hidden text-center">
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <Heart className="w-10 h-10 text-primary fill-primary/15 mx-auto mb-5" />
              <h2 className="font-serif text-4xl font-semibold mb-4">Siap Membuat Undangan Impian?</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto leading-relaxed">Bergabung dengan 10.000+ pasangan yang telah mempercayai Invito untuk hari spesial mereka.</p>
              <button onClick={() => setPage("checkout")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
                Mulai Gratis <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

// ─── TEMA PAGE ────────────────────────────────────────────────────────────────

function TemaPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />

      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6">
          <Palette className="w-3 h-3" />
          Koleksi Eksklusif
        </div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Pilihan Tema Invito</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Ratusan tema elegan dirancang khusus untuk membuat momen pernikahan Anda semakin berkesan.
        </p>
        <button onClick={() => setPage("checkout")} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
          Mulai Pakai Tema <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-8">Jelajahi Kategori Tema</h2>
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
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-${img}?w=600&h=400&fit=crop&auto=format`} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                  {badge && <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium">{badge}</div>}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">24 variasi tersedia</p>
                  </div>
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
          {[
            { value: "200+", label: "Tema Tersedia" },
            { value: "10K+", label: "Pasangan Puas" },
            { value: "50+", label: "Desainer Profesional" },
            { value: "4.9★", label: "Rating Rata-rata" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-6">
              <p className="text-2xl font-bold text-primary mb-1">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-10 h-10 text-primary fill-primary/15 mx-auto mb-5" />
          <h2 className="font-serif text-4xl font-semibold mb-4">Temukan Tema Sempurna Anda</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Setiap tema dapat dikustomisasi sesuai selera Anda.</p>
          <button onClick={() => setPage("checkout")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
            Mulai Gratis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

// ─── HARGA PAGE ───────────────────────────────────────────────────────────────

function HargaPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar setPage={setPage} setAuthTab={() => {}} />

      <section className="pt-28 pb-20 px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6">
          <Package className="w-3 h-3" />
          Harga Transparan
        </div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Harga Invito</h1>
        <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">Pilih paket yang sesuai kebutuhan Anda. Mulai gratis, upgrade kapan saja.</p>
        <p className="text-sm text-primary font-medium">Tanpa biaya tersembunyi</p>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card rounded-3xl p-7 border-2 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(196,149,74,0.12)] ${pkg.popular ? "border-primary" : "border-border"}`}
              >
                {pkg.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-medium whitespace-nowrap">PALING POPULER</div>}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${pkg.popular ? "bg-primary/15" : "bg-muted"}`}>
                  <Package className={`w-5 h-5 ${pkg.popular ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-1">{pkg.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{pkg.subtitle}</p>
                <div className="mb-5">
                  {pkg.originalPrice && <p className="text-xs text-muted-foreground line-through mb-0.5">{fmt(pkg.originalPrice)}</p>}
                  <p className="text-3xl font-bold text-foreground">{fmt(pkg.price)}</p>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${pkg.popular ? "text-primary" : "text-muted-foreground"}`} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setPage("checkout")} className={`w-full py-3 rounded-full text-sm transition-all ${pkg.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border hover:border-primary hover:text-primary"}`}>
                  Pilih Paket {pkg.name}
                </button>
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
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Fitur</th>
                  {PACKAGES.map(p => <th key={p.id} className={`p-4 font-semibold text-center ${p.popular ? "text-primary" : ""}`}>{p.name}</th>)}
                </tr>
              </thead>
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
                    {values.map((v, i) => (
                      <td key={i} className="p-4 text-center">
                        {v === true ? <Check className="w-4 h-4 text-primary mx-auto" /> : v === false ? <span className="text-muted-foreground/40">-</span> : <span className="text-xs font-medium">{v}</span>}
                      </td>
                    ))}
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
              { q: "Apakah ada uji coba gratis?", a: "Ya, paket Basic tersedia gratis tanpa batas waktu. Upgrade ke Standard atau Premium kapan saja." },
              { q: "Apa metode pembayaran yang diterima?", a: "Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA), QRIS, kartu kredit, dan gerai Alfamart/Indomaret." },
              { q: "Apakah harga sudah termasuk pajak?", a: "Harga yang ditampilkan sudah final dan tidak ada biaya tersembunyi." },
              { q: "Bisakah saya upgrade paket di tengah jalan?", a: "Ya, Anda bisa upgrade kapan saja. Biaya akan dihitung secara prorata." },
              { q: "Apakah ada refund jika tidak puas?", a: "Kami menawarkan garansi 7 hari uang kembali jika Anda tidak puas dengan layanan kami." },
            ].map(({ q, a }, i) => (
              <FaqItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-10 h-10 text-primary fill-primary/15 mx-auto mb-5" />
          <h2 className="font-serif text-4xl font-semibold mb-4">Mulai Perjalanan Anda Hari Ini</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Bergabung gratis, tanpa kartu kredit diperlukan.</p>
          <button onClick={() => setPage("checkout")} className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
            Mulai Gratis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <SiteFooter />
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs tracking-wide mb-6">
          <FileText className="w-3 h-3" />
          Blog & Inspirasi
        </div>
        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Blog Invito</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Tips, inspirasi, dan panduan untuk membuat undangan pernikahan yang sempurna.</p>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary text-xs tracking-[0.2em] uppercase font-medium mb-6">Artikel Pilihan</p>
          <div className="grid md:grid-cols-2 gap-0 bg-card border border-border rounded-3xl overflow-hidden">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&auto=format" alt="Featured" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-4 w-fit">Inspirasi</span>
              <h2 className="font-serif text-2xl font-semibold mb-4">10 Inspirasi Undangan Digital Pernikahan 2025 yang Wajib Anda Coba</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Temukan inspirasi terbaik untuk membuat undangan pernikahan digital yang memukau tamu Anda.</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                <span>10 Jul 2025</span><span>•</span><span>5 menit baca</span>
              </div>
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-all flex items-center gap-2 w-fit">
                Baca Selengkapnya <ArrowRight className="w-4 h-4" />
              </button>
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[0_8px_32px_rgba(196,149,74,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-${img}?w=600&h=400&fit=crop&auto=format`} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full mb-3">{cat}</span>
                  <h3 className="font-semibold text-sm mb-3 leading-snug">{title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{date}</span><span>•</span><span>{read} baca</span>
                  </div>
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

      <SiteFooter />
    </div>
  )
}

// ─── ROOT ────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing")
  const [authTab, setAuthTab] = useState<AuthTab>("login")

  const render = () => {
    switch (page) {
      case "login":
        return <AuthPage setPage={setPage} initialTab={authTab} />

      case "dashboard":
        return <DashboardPage setPage={setPage} />

      case "editor":
        return <EditorPage setPage={setPage} />

      case "checkout":
        return <CheckoutPage setPage={setPage} />

      case "payment-method":
        return <PaymentMethodPage setPage={setPage} />

      case "payment-waiting":
        return <PaymentWaitingPage setPage={setPage} />

      case "payment-success":
        return <PaymentSuccessPage setPage={setPage} />

      case "payment-failed":
        return <PaymentFailedPage setPage={setPage} />

      case "fitur":
        return <FiturPage setPage={setPage} />

      case "tema":
        return <TemaPage setPage={setPage} />

      case "harga":
        return <HargaPage setPage={setPage} />

      case "blog":
        return <BlogPage setPage={setPage} />

      default:
        return <LandingPage setPage={setPage} setAuthTab={setAuthTab} />
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

# Also need to add React import for FaqItem that uses React.useState
# Actually, useState is already imported from "react" at the top, so FaqItem should use useState directly
# Fix: replace React.useState with useState in the tail
$tail = $tail -replace 'React\.useState', 'useState'

# Combine and write
$newContent = ($kept -join "`r`n") + "`r`n" + $tail

[System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)

Write-Host "Done. New line count:"
(Get-Content $file).Count

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { TEMPLATE_IMAGES } from "../templatesData";
import TemplatePreviewModal from "../components/TemplatePreviewModal";
import { api } from "../../lib/api";

const GRADIENTS = [
  { label: "Populer", labelColor: "bg-[#B4894D] text-white", gradient: "from-[#F3E8FF] to-[#E9D5FF]" },
  { label: null, gradient: "from-[#FEF3C7] to-[#FDE68A]" },
  { label: "Baru", labelColor: "bg-[#2563EB] text-white", gradient: "from-[#F0FDF4] to-[#BBF7D0]" },
  { label: null, gradient: "from-[#E0F2FE] to-[#BAE6FD]" },
  { label: null, gradient: "from-[#FFEDD5] to-[#FED7AA]" },
  { label: "Premium", labelColor: "bg-[#9333EA] text-white", gradient: "from-[#FCE7F3] to-[#FBCFE8]" },
];

export function TemplatePage({ setActivePage, setSelectedTemplate }: { setActivePage: (p: string) => void, setSelectedTemplate: (t: string) => void }) {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get('/templates');
        setTemplates(res.data);
      } catch (error) {
        toast.error("Gagal memuat template");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleSelect = (name: string) => {
    setSelectedTemplate(name);
    toast.success(`Template ${name} berhasil dipilih!`);
    setActivePage("edit-undangan");
  };

  const handlePreview = (name: string) => {
    setSelectedPreview(name);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#2A211B] mb-2">Template</h2>
        <p className="text-[#8A7B6E]">Pilih template undangan pernikahan Anda</p>
      </div>

      {loading ? (
        <div className="text-center text-[#8A7B6E]">Memuat template...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl, index) => {
            const style = GRADIENTS[index % GRADIENTS.length];
            return (
              <div key={tpl.id} className="bg-[#FAF8F6] rounded-2xl overflow-hidden shadow-sm border border-black/[0.04] group hover:shadow-md transition-shadow">
                <div className={`relative h-48 w-full bg-gradient-to-br ${style.gradient}`}>
                  {style.label && (
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${style.labelColor}`}>
                      {style.label}
                    </span>
                  )}
                  <img src={TEMPLATE_IMAGES[tpl.name as keyof typeof TEMPLATE_IMAGES] || tpl.thumbnail} alt={tpl.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#2A211B] mb-1">{tpl.name}</h3>
                  <p className="text-sm text-[#8A7B6E] mb-5">24 variasi tersedia</p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleSelect(tpl.name)}
                      className="flex-1 py-2.5 bg-[#B4894D] text-white rounded-xl text-sm font-semibold hover:bg-[#9A743D] transition-colors"
                    >
                      Pilih
                    </button>
                    <button 
                      onClick={() => handlePreview(tpl.name)}
                      className="flex-1 py-2.5 bg-transparent border border-[#E9E2D9] text-[#2A211B] rounded-xl text-sm font-semibold hover:bg-[#E9E2D9]/50 transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPreview && (
        <TemplatePreviewModal templateName={selectedPreview} onClose={() => setSelectedPreview(null)} />
      )}
    </div>
  )
}

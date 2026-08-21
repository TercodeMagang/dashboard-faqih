import React, { useEffect } from "react";
import { toast } from "sonner";
import { TEMPLATE_IMAGES } from "../templatesData";

interface TemplatePreviewModalProps {
  templateName: string;
  onClose: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ templateName, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose();
  };

  const backgroundImageUrl = TEMPLATE_IMAGES[templateName] || TEMPLATE_IMAGES["Elegant"];

  return (
    <div className="fixed inset-0 bg-black/55 z-[9999] flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-3xl p-6 relative max-w-[90vw] max-h-[95vh] flex flex-col items-center justify-center shadow-2xl">
        <button 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors z-50 text-xl font-bold" 
          onClick={onClose} 
          aria-label="Close preview"
        >
          &times;
        </button>
        
        {/* Phone Mockup */}
        <div className="w-[340px] max-w-full h-[760px] max-h-[78vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[12px] border-gray-900 relative">
          <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 z-20 rounded-b-2xl mx-auto w-1/2" /> {/* Notch */}
          
          {/* Invitation Preview Content */}
          <div className="relative w-full h-full bg-[#FAF8F6] flex flex-col overflow-y-auto custom-scrollbar">
            <div className="min-h-[45%] shrink-0 w-full bg-gradient-to-br from-[#F3E8FF] to-[#E9E2D9] relative overflow-hidden">
               {/* Mock Photo Background */}
               <div className="absolute inset-0">
                  <img src={backgroundImageUrl} className="w-full h-full object-cover" alt="Template Cover" />
               </div>
               <div className="absolute inset-0 bg-black/40" />
               
               <div className="absolute inset-0 flex items-center justify-center flex-col z-10 text-center p-6">
                  <span className="font-serif text-5xl font-bold italic text-white drop-shadow-lg mb-2">Wedding</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white font-semibold drop-shadow-md">The Wedding Of</span>
               </div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-start text-center bg-[#FAF8F6]">
              <h1 className="font-serif text-3xl font-bold text-[#B4894D] mb-4 leading-tight mt-6">
                Anisa<br/>&<br/>Raka
              </h1>
              
              <div className="mb-6">
                <p className="text-sm text-[#2A211B] font-semibold mb-1">Minggu, 12 Januari 2025</p>
                <p className="text-xs text-[#8A7B6E] max-w-[200px] mx-auto">Hotel Mulia, Jakarta</p>
              </div>
              
              <p className="text-[11px] text-[#8A7B6E] italic mb-8 px-4 leading-relaxed line-clamp-4">"Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu."</p>
              
              <button onClick={() => toast.info("Membuka undangan...")} className="px-6 py-2.5 bg-[#B4894D] text-white rounded-full text-xs font-semibold shadow-md shadow-[#B4894D]/30 w-full mb-4 mt-auto">
                Buka Undangan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;

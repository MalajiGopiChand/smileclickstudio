import React, { useEffect } from 'react';
import { GalleryItem } from '../types';
import { X, MessageCircle, Film } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

interface VideoModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleWhatsAppEnquiry = () => {
    const text = `Hello Smile Click Studio! I watched your video project: "${item.title}". I would like to get a cinematic video filmed/edited for our upcoming event.`;
    window.open(`https://wa.me/${BUSINESS_INFO.cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 animate-fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-[#062F3C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-black/40 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00A3D9]/20 text-[#00A3D9]">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-sm sm:text-base leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400">
                {item.category} {item.duration ? `• Duration ${item.duration}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {item.videoUrl ? (
            <video
              src={item.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-8 text-slate-300">
              <p>Video preview is currently loading.</p>
            </div>
          )}
        </div>

        {/* Footer info & WhatsApp CTA */}
        <div className="p-4 sm:p-5 bg-[#003B4A]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
            {item.description}
          </p>

          <button
            onClick={handleWhatsAppEnquiry}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enquire for Video Shoot</span>
          </button>
        </div>
      </div>
    </div>
  );
};

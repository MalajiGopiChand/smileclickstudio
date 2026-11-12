import React, { useEffect } from 'react';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, MapPin, Sparkles, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';

interface LightboxModalProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onBookShoot?: (category: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onBookShoot,
}) => {
  if (!isOpen || items.length === 0 || currentIndex < 0 || currentIndex >= items.length) {
    return null;
  }

  const currentItem = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, items.length]);

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % items.length);
  };

  const handleWhatsAppEnquiry = () => {
    const text = `Hello Smile Click Studio! I loved this photo from your portfolio: "${currentItem.title}" (${currentItem.category}). Can you share pricing and details?`;
    window.open(`https://wa.me/${BUSINESS_INFO.cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fade-in">
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#00A3D9]/20 text-[#00A3D9] border border-[#00A3D9]/40">
            {currentItem.category}
          </span>
          <span className="text-xs text-slate-400">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-[#0077A8] text-white transition-all transform hover:scale-110 focus:outline-none border border-white/10"
        aria-label="Previous Image"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-[#0077A8] text-white transition-all transform hover:scale-110 focus:outline-none border border-white/10"
        aria-label="Next Image"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[82vh] w-full flex flex-col items-center justify-center">
        <img
          src={currentItem.imageUrl}
          alt={currentItem.title}
          className="max-h-[68vh] max-w-full object-contain rounded-xl shadow-2xl shadow-black/80 select-none"
        />

        {/* Caption & Quick Action */}
        <div className="w-full max-w-3xl mt-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
              {currentItem.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
              {currentItem.location && (
                <span className="flex items-center gap-1 text-[#00A3D9]">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentItem.location}
                </span>
              )}
              <span className="line-clamp-1">{currentItem.description}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleWhatsAppEnquiry}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#20ba5a] text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </button>

            {onBookShoot && (
              <button
                onClick={() => {
                  onClose();
                  onBookShoot(currentItem.category);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0077A8] hover:bg-[#00A3D9] text-white transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book This</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

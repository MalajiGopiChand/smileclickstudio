import React from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

interface MobileActionBarProps {
  onOpenBooking: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#062F3C]/95 backdrop-blur-md border-t border-white/10 px-3 py-2.5 shadow-2xl">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          href={`tel:${BUSINESS_INFO.phone}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all text-xs font-semibold"
        >
          <Phone className="w-4 h-4 text-[#00A3D9]" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={BUSINESS_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/30 active:scale-95 transition-all text-xs font-semibold"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        {/* Book Shoot Button */}
        <button
          onClick={onOpenBooking}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#0077A8] to-[#00A3D9] text-white shadow-md active:scale-95 transition-all text-xs font-bold"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Shoot</span>
        </button>
      </div>
    </div>
  );
};

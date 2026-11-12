import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 z-40 flex items-end flex-col">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="relative mb-2.5 max-w-[220px] bg-white text-slate-800 text-xs py-2 px-3.5 rounded-2xl shadow-xl shadow-black/15 border border-slate-100 flex items-center justify-between gap-2 animate-bounce">
          <div>
            <span className="font-semibold block text-slate-900">Need instant help?</span>
            <span className="text-slate-500">Chat with Venkatesh</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-slate-100 transform rotate-45" />
        </div>
      )}

      {/* Button */}
      <a
        href={BUSINESS_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Smile Click Studio"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />

        <MessageCircle className="w-7 h-7 fill-white text-[#25D366] relative z-10" />

        <span className="sr-only">WhatsApp Chat</span>
      </a>
    </div>
  );
};

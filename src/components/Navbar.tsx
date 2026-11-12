import React, { useState, useEffect } from 'react';
import { PageType } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import { Phone, Menu, X, Calendar, MessageCircle, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType, serviceKey?: string) => void;
  onOpenBooking: (serviceKey?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Our Work', page: 'gallery' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || currentPage !== 'home'
            ? 'bg-[#062F3C]/95 backdrop-blur-md shadow-lg shadow-[#062F3C]/20 border-b border-white/10 py-3'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Link */}
            <button
              onClick={() => handleNavClick('home')}
              className="group flex items-center gap-3 text-left focus:outline-none transition-transform hover:scale-[1.02]"
              aria-label="Smile Click Studio Home"
            >
              <div className="relative p-1 rounded-xl bg-white/95 shadow-md shadow-black/20 group-hover:shadow-[#00A3D9]/40 transition-shadow">
                <img
                  src="/images/logo.png"
                  alt="Smile Click Studio Official Logo"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <span className="block font-serif text-lg font-bold tracking-wider text-white group-hover:text-[#00A3D9] transition-colors leading-tight">
                  SMILE CLICK
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-[#00A3D9] font-semibold uppercase">
                  STUDIO • VIJAYAWADA
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/10 font-semibold shadow-inner'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#00A3D9] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-[#00A3D9] transition-colors px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                title="Call Venkatesh"
              >
                <Phone className="w-3.5 h-3.5 text-[#00A3D9]" />
                <span>{BUSINESS_INFO.phone}</span>
              </a>

              <button
                onClick={() => onOpenBooking()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-lg shadow-[#0077A8]/30 hover:shadow-[#00A3D9]/50 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK NOW</span>
              </button>
            </div>

            {/* Mobile Hamburger & Quick Call */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="p-2 rounded-lg bg-white/10 text-white hover:text-[#00A3D9] transition-colors"
                aria-label="Call Studio"
              >
                <Phone className="w-5 h-5 text-[#00A3D9]" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-5/6 max-w-sm bg-[#062F3C] text-white p-6 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 border-l border-white/10 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-white">
                  <img
                    src="/images/logo.png"
                    alt="Smile Click Studio"
                    className="h-9 w-auto"
                  />
                </div>
                <div>
                  <div className="font-serif font-bold text-white tracking-wider text-sm">
                    SMILE CLICK
                  </div>
                  <div className="text-[9px] tracking-widest text-[#00A3D9] font-medium">
                    STUDIO
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav list */}
            <div className="py-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-base font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0077A8] to-[#00A3D9] text-white shadow-md'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-70" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] shadow-lg shadow-[#0077A8]/40"
            >
              <Calendar className="w-5 h-5" />
              <span>BOOK YOUR SHOOT</span>
            </button>

            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>WhatsApp Us Directly</span>
            </a>

            <div className="text-center text-xs text-slate-400 pt-2">
              📍 D.No: 53, Kandrika, Vijayawada – 15
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

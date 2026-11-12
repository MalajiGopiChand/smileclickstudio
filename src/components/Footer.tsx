import React from 'react';
import { PageType } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import { Phone, Mail, MapPin, MessageCircle, Heart, ArrowUp } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

interface FooterProps {
  onNavigate: (page: PageType, serviceKey?: string) => void;
  onOpenBooking: (serviceKey?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLink = (page: PageType, serviceKey?: string) => {
    onNavigate(page, serviceKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#062F3C] text-white border-t border-white/10 pt-16 pb-24 md:pb-12">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00A3D9]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block p-2 rounded-2xl bg-white shadow-xl shadow-black/30">
              <img
                src="/images/logo.png"
                alt="Smile Click Studio"
                className="h-14 w-auto object-contain"
              />
            </div>

            <div className="text-xs uppercase tracking-[0.25em] text-[#00A3D9] font-semibold">
              CAPTURE • CREATE • CHERISH
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Capturing moments. Creating memories. Preserving stories. Smile Click Studio is Vijayawada's premier photography, cinematic videography, and bespoke gifting studio.
            </p>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-600 hover:via-pink-600 hover:to-purple-600 hover:border-transparent transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={BUSINESS_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-transparent transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-transparent transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => handleLink('home')}
                  className="hover:text-[#00A3D9] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#00A3D9] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services')}
                  className="hover:text-[#00A3D9] transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('gallery')}
                  className="hover:text-[#00A3D9] transition-colors"
                >
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact')}
                  className="hover:text-[#00A3D9] transition-colors"
                >
                  Contact & Enquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking()}
                  className="text-[#00A3D9] font-medium hover:underline flex items-center gap-1"
                >
                  Book a Shoot →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => handleLink('services', 'Photo Shoot')}
                  className="hover:text-[#00A3D9] transition-colors text-left"
                >
                  Professional Photography
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services', 'Pre-Wedding Shoot')}
                  className="hover:text-[#00A3D9] transition-colors text-left"
                >
                  Pre-Wedding Shoots
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services', 'Pre-Birthday Shoot')}
                  className="hover:text-[#00A3D9] transition-colors text-left"
                >
                  Pre-Birthday & Kids Shoots
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services', 'Video Editing')}
                  className="hover:text-[#00A3D9] transition-colors text-left"
                >
                  Cinematic Video Editing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services', 'Album Design')}
                  className="hover:text-[#00A3D9] transition-colors text-left"
                >
                  Luxury Album Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services', 'Event Management')}
                  className="hover:text-[#00A3D9] transition-colors text-left"
                >
                  Event Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services', 'Magic Cup')}
                  className="hover:text-[#00A3D9] transition-colors text-left text-xs text-[#00A3D9]"
                >
                  Personalized Gifts & Magic Cups →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">
              Contact Details
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00A3D9] shrink-0 mt-1" />
                <span className="leading-snug">
                  {BUSINESS_INFO.address.doorNo},<br />
                  {BUSINESS_INFO.address.street},<br />
                  {BUSINESS_INFO.address.city},<br />
                  {BUSINESS_INFO.address.state}, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00A3D9] shrink-0" />
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="hover:text-[#00A3D9] transition-colors font-medium"
                >
                  {BUSINESS_INFO.displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00A3D9] shrink-0" />
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="hover:text-[#00A3D9] transition-colors break-all"
                >
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li className="pt-2">
                <div className="text-xs text-slate-400">Owner & Lead Artist</div>
                <div className="font-semibold text-white">{BUSINESS_INFO.owner}</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 <span className="text-white font-medium">Smile Click Studio</span>. All Rights Reserved.
          </div>

          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>in Vijayawada, Andhra Pradesh</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

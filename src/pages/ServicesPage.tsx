import React, { useState } from 'react';
import { PageType, ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import { BUSINESS_INFO } from '../data/businessInfo';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Camera,
  Film,
  BookOpen,
  Gift,
  Heart
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: PageType, serviceKey?: string) => void;
  onOpenBooking: (serviceKey?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, onOpenBooking }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filterOptions = [
    { label: 'All Services', key: 'ALL' },
    { label: 'Photography', key: 'Photography' },
    { label: 'Cinematography', key: 'Cinematography' },
    { label: 'Albums & Design', key: 'Albums & Design' },
    { label: 'Personalized Gifts', key: 'Personalized Gifts' },
    { label: 'Events', key: 'Events' },
  ];

  const filteredServices = selectedFilter === 'ALL'
    ? SERVICES_DATA
    : SERVICES_DATA.filter(s => s.category === selectedFilter);

  const handleEnquire = (serviceKey: string) => {
    // Navigate directly to contact page with pre-selected service
    onNavigate('contact', serviceKey);
  };

  const handleDirectWhatsApp = (serviceTitle: string) => {
    const text = `Hello Smile Click Studio! I am interested in your service: "${serviceTitle}". Please share pricing and availability.`;
    window.open(`https://wa.me/${BUSINESS_INFO.cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full pt-20">
      {/* ========================================================
          PAGE HEADER BANNER
          ======================================================== */}
      <section className="relative py-24 bg-[#062F3C] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop"
            alt="Services Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C] via-[#062F3C]/85 to-[#062F3C]/95" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00A3D9] text-xs font-semibold tracking-widest uppercase mb-4 shadow-glow">
            <Sparkles className="w-4 h-4 text-[#00A3D9]" />
            <span>FULL CREATIVE SUITE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            OUR SERVICES
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Everything you need to capture, create and celebrate your special moments.
          </p>

          {/* Filter Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedFilter(opt.key)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  selectedFilter === opt.key
                    ? 'bg-gradient-to-r from-[#0077A8] to-[#00A3D9] text-white shadow-lg shadow-[#0077A8]/40 scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          DETAILED SERVICE CARDS
          ======================================================== */}
      <section className="py-20 bg-studio-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {filteredServices.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-premium transition-all duration-300 overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    {/* Visual Media Column */}
                    <div
                      className={`lg:col-span-5 relative min-h-[300px] sm:min-h-[360px] lg:min-h-[440px] overflow-hidden ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-[#062F3C] shadow-md">
                          Service 0{index + 1}
                        </span>
                        {service.isPopular && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00A3D9] text-white shadow-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-xs uppercase tracking-widest text-[#00A3D9] font-semibold block mb-0.5">
                          {service.category}
                        </span>
                        <div className="font-serif text-lg sm:text-xl font-bold leading-tight">
                          {service.tagline}
                        </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div
                      className={`lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8]">
                            SMILE CLICK STUDIO • VIJAYAWADA
                          </span>
                          {service.deliveryTime && (
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#00A3D9]" />
                              Delivery: {service.deliveryTime}
                            </span>
                          )}
                        </div>

                        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#062F3C] mb-4">
                          {service.title}
                        </h2>

                        <p className="text-base text-slate-700 leading-relaxed font-medium mb-3">
                          {service.shortDescription}
                        </p>

                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                          {service.fullDescription}
                        </p>

                        {/* Features Bullet List */}
                        <div className="bg-studio-light p-5 rounded-2xl border border-slate-200/80 mb-6">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                            Key Highlights & Inclusions:
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#0077A8] shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                        {/* Primary ENQUIRE NOW button - takes user to contact form with this service auto-selected */}
                        <button
                          onClick={() => handleEnquire(service.serviceKey)}
                          className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-lg shadow-[#0077A8]/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span>ENQUIRE NOW</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDirectWhatsApp(service.title)}
                          className="w-full sm:w-auto px-5 py-3.5 rounded-full font-semibold text-xs sm:text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <span>WhatsApp Enquiry</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          CREATIVE GIFTS SPOTLIGHT
          ======================================================== */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#062F3C] via-[#003B4A] to-[#0077A8] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00A3D9]">
                  SPECIAL MEMORY GIFTS
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  Custom Magic Cups & Sequin Pillows in Vijayawada
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  Looking for an unforgettable gift for birthdays, anniversaries, or Valentine's Day? Send us your favorite photograph on WhatsApp, and we will craft a thermo-sensitive reveal mug or swipe-reversible sequin magic pillow with 24-48 hour delivery in Vijayawada!
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate('contact', 'Magic Cup')}
                    className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#00A3D9] hover:bg-[#20bbf0] text-white transition-all shadow-md"
                  >
                    Order Magic Cup
                  </button>
                  <button
                    onClick={() => onNavigate('contact', 'Magic Pillow')}
                    className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all"
                  >
                    Order Magic Pillow
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 flex items-center justify-center">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2">
                  <div className="text-3xl">☕✨🎁</div>
                  <div className="font-bold text-sm text-white">Fast 24-Hour Express</div>
                  <p className="text-xs text-slate-300">
                    Pickup available at Kandrika Studio or doorstep delivery across Vijayawada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW OUR PROCESS WORKS
          ======================================================== */}
      <section className="py-20 bg-studio-light border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8] block mb-2">
              SEAMLESS EXPERIENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#062F3C]">
              How We Work With You
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center font-serif font-bold text-lg">
                1
              </div>
              <h4 className="font-serif font-bold text-base text-[#062F3C]">
                Consultation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We listen to your vision, suggest creative themes, scout Vijayawada locations, and customize packages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center font-serif font-bold text-lg">
                2
              </div>
              <h4 className="font-serif font-bold text-base text-[#062F3C]">
                The Shoot
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Relax and enjoy the spotlight while our team guides natural poses with warm encouragement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center font-serif font-bold text-lg">
                3
              </div>
              <h4 className="font-serif font-bold text-base text-[#062F3C]">
                Artful Editing
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Masterful color grading, skin retouching, music scoring, and custom album layout design.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center font-serif font-bold text-lg">
                4
              </div>
              <h4 className="font-serif font-bold text-base text-[#062F3C]">
                Handcrafted Delivery
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive private cloud downloads, 4K video files, and your luxury keepsake albums or gifts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

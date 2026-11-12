import React from 'react';
import { PageType, GalleryItem } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import { GALLERY_ITEMS } from '../data/galleryData';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';
import { BUSINESS_INFO } from '../data/businessInfo';
import {
  Camera,
  Film,
  Heart,
  Sparkles,
  Calendar,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Eye,
  Play,
  Star,
  CheckCircle2,
  Award,
  Clock,
  ShieldCheck,
  Smile,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageType, serviceKey?: string) => void;
  onOpenBooking: (serviceKey?: string) => void;
  onOpenLightbox: (items: GalleryItem[], index: number) => void;
  onOpenVideo: (item: GalleryItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenLightbox,
  onOpenVideo,
}) => {
  // Select featured services for home preview
  const featuredServices = SERVICES_DATA.slice(0, 6);

  // Select featured gallery items
  const featuredPortfolio = GALLERY_ITEMS.filter((item) => item.featured).slice(0, 6);

  return (
    <div className="w-full">
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#062F3C] text-white">
        {/* Background Image with layered gradient overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
            alt="Smile Click Studio Hero Photography"
            className="w-full h-full object-cover object-center scale-105 animate-pulse-subtle"
          />
          {/* Subtle dark overlays for cinematic depth and readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C] via-[#062F3C]/60 to-[#062F3C]/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#062F3C]/40 to-[#062F3C]/95" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00A3D9] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-glow">
            <Sparkles className="w-4 h-4 text-[#00A3D9]" />
            <span>Vijayawada’s Premier Photography & Creative Studio</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.08] mb-6">
            YOUR MOMENTS.<br />
            <span className="gradient-text">OUR PASSION.</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-200 font-light leading-relaxed mb-10">
            Capturing beautiful memories and transforming special moments into timeless stories.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <button
              onClick={() => onNavigate('gallery')}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-xl shadow-[#0077A8]/40 hover:shadow-[#00A3D9]/60 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>EXPLORE OUR WORK</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>BOOK YOUR SHOOT</span>
            </button>
          </div>

          {/* Quick Stats Ribbon */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {BUSINESS_INFO.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-300 font-medium tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-400 text-[11px] tracking-widest uppercase">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#00A3D9]" />
        </div>
      </section>

      {/* ========================================================
          ABOUT PREVIEW SECTION
          ======================================================== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Collage */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#062F3C]/20 border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop"
                  alt="Smile Click Studio Moments"
                  className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#00A3D9] block mb-1">
                    Based in Vijayawada, AP
                  </span>
                  <div className="font-serif text-xl font-bold">
                    Preserving Smiles Across Generations
                  </div>
                </div>
              </div>

              {/* Floating Mini Badge */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#062F3C] text-white p-5 rounded-2xl shadow-xl border border-white/10 hidden sm:flex items-center gap-4 max-w-xs">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#0077A8] to-[#00A3D9] text-white">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold">Studio & Outdoor</div>
                  <div className="text-xs text-slate-300">Complete creative photography & videography</div>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0077A8]">
                <Smile className="w-4 h-4 text-[#00A3D9]" />
                <span>ABOUT SMILE CLICK STUDIO</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#062F3C] leading-tight">
                Every Moment Deserves to Be Remembered
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                At Smile Click Studio, we don't just capture photographs — we capture emotions, celebrations and memories that last forever. From professional photo shoots and cinematic videos to customized gifts and beautiful album designs, we transform your special moments into unforgettable experiences.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-studio-light border border-slate-200">
                  <div className="font-serif font-bold text-2xl text-[#0077A8]">8+ Years</div>
                  <div className="text-xs text-slate-600 font-medium">Of Visual Craftsmanship</div>
                </div>
                <div className="p-4 rounded-2xl bg-studio-light border border-slate-200">
                  <div className="font-serif font-bold text-2xl text-[#0077A8]">100%</div>
                  <div className="text-xs text-slate-600 font-medium">Bespoke Dedication</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-[#062F3C] hover:bg-[#003B4A] shadow-lg shadow-[#062F3C]/20 transition-all duration-300 hover:scale-105"
                >
                  <span>DISCOVER OUR STORY</span>
                  <ArrowRight className="w-4 h-4 text-[#00A3D9]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SERVICES PREVIEW
          ======================================================== */}
      <section className="py-24 bg-studio-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8] block mb-2">
              OUR EXPERTISE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#062F3C] mb-4">
              What We Create
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Full-spectrum photography, videography, heirloom album craftsmanship, and customized creative gifts.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#062F3C] shadow-sm">
                      {service.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#00A3D9] transition-colors leading-snug">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>

                  <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0077A8] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      onClick={() => onNavigate('services', service.serviceKey)}
                      className="text-xs font-bold uppercase tracking-wider text-[#0077A8] hover:text-[#00A3D9] flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenBooking(service.serviceKey)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#062F3C] hover:bg-[#0077A8] transition-colors shadow-sm"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Services Link */}
          <div className="mt-14 text-center">
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-lg shadow-[#0077A8]/30 hover:scale-105 transition-all"
            >
              <span>VIEW ALL SERVICES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED PORTFOLIO / OUR CREATIVE WORK
          ======================================================== */}
      <section className="py-24 bg-[#062F3C] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00A3D9] block mb-2">
                PORTFOLIO SHOWCASE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                Our Creative Work
              </h2>
              <p className="text-slate-300 text-base sm:text-lg">
                A collection of moments, memories and creativity.
              </p>
            </div>

            <button
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-[#00A3D9] hover:text-white transition-colors self-start md:self-auto"
            >
              <span>VIEW FULL GALLERY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Masonry / Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPortfolio.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.isVideo) {
                    onOpenVideo(item);
                  } else {
                    onOpenLightbox(featuredPortfolio, idx);
                  }
                }}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-white/10 shadow-lg"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C] via-[#062F3C]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#00A3D9] border border-[#00A3D9]/30">
                    {item.category}
                  </span>
                </div>

                {/* Center Action Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0077A8] to-[#00A3D9] text-white flex items-center justify-center shadow-xl shadow-black/50">
                    {item.isVideo ? (
                      <Play className="w-6 h-6 ml-0.5 fill-white" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-4 left-4 right-4 text-white transform transition-transform duration-300">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#00A3D9] transition-colors leading-tight mb-1">
                    {item.title}
                  </h3>
                  {item.location && (
                    <p className="text-xs text-slate-300 line-clamp-1">
                      📍 {item.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => onNavigate('gallery')}
              className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105"
            >
              EXPLORE ALL CATEGORIES & VIDEOS
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          WHY CHOOSE US
          ======================================================== */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8] block mb-2">
              THE SMILE CLICK DIFFERENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#062F3C] mb-4">
              Why Smile Click Studio?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              We bring boundless passion, technical precision, and heartfelt warmth to every celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 01 */}
            <div className="p-8 rounded-3xl bg-studio-light border border-slate-200/80 hover:border-[#0077A8]/40 hover:shadow-premium transition-all duration-300 group">
              <div className="font-serif text-3xl font-bold text-[#0077A8] mb-3 group-hover:translate-x-1 transition-transform">
                01
              </div>
              <h3 className="font-serif text-xl font-bold text-[#062F3C] mb-3">
                Creative Vision
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every project is approached with creativity, artistic storytelling, and meticulous attention to detail.
              </p>
            </div>

            {/* 02 */}
            <div className="p-8 rounded-3xl bg-studio-light border border-slate-200/80 hover:border-[#0077A8]/40 hover:shadow-premium transition-all duration-300 group">
              <div className="font-serif text-3xl font-bold text-[#0077A8] mb-3 group-hover:translate-x-1 transition-transform">
                02
              </div>
              <h3 className="font-serif text-xl font-bold text-[#062F3C] mb-3">
                Quality You Can Trust
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Professional-quality photography, high-end cinema equipment, calibrated editing, and archival personalized products.
              </p>
            </div>

            {/* 03 */}
            <div className="p-8 rounded-3xl bg-studio-light border border-slate-200/80 hover:border-[#0077A8]/40 hover:shadow-premium transition-all duration-300 group">
              <div className="font-serif text-3xl font-bold text-[#0077A8] mb-3 group-hover:translate-x-1 transition-transform">
                03
              </div>
              <h3 className="font-serif text-xl font-bold text-[#062F3C] mb-3">
                Memories That Last
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We help transform your important moments into lifelong memories that you and your family will cherish forever.
              </p>
            </div>

            {/* 04 */}
            <div className="p-8 rounded-3xl bg-studio-light border border-slate-200/80 hover:border-[#0077A8]/40 hover:shadow-premium transition-all duration-300 group">
              <div className="font-serif text-3xl font-bold text-[#0077A8] mb-3 group-hover:translate-x-1 transition-transform">
                04
              </div>
              <h3 className="font-serif text-xl font-bold text-[#062F3C] mb-3">
                Personalized Service
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every client and every celebration is unique. Venkatesh works closely with you to tailor every photo and deliverable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CLIENT REVIEWS / TESTIMONIALS
          ======================================================== */}
      <section className="py-24 bg-studio-light border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8] block mb-2">
              CLIENT EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#062F3C] mb-4">
              Loved by Families Across Vijayawada
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Here is what couples, parents, and families say about working with Smile Click Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS_DATA.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={t.avatarUrl}
                    alt={t.clientName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#062F3C]">
                      {t.clientName}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {t.serviceUsed}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          CTA SECTION
          ======================================================== */}
      <section className="py-24 bg-[#062F3C] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop"
            alt="Smile Click Studio CTA background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00A3D9] block mb-3">
            START YOUR STORY TODAY
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            LET'S CREATE SOMETHING UNFORGETTABLE
          </h2>

          <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Your memories deserve more than just a photograph. They deserve cinematic passion, artful framing, and eternal care.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-xl shadow-[#0077A8]/40 hover:scale-105 transition-all"
            >
              BOOK YOUR SHOOT
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105"
            >
              CONTACT US
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

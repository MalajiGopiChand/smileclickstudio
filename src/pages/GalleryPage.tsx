import React, { useState, useMemo } from 'react';
import { PageType, GalleryCategory, GalleryItem } from '../types';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../data/galleryData';
import { BUSINESS_INFO } from '../data/businessInfo';
import {
  Sparkles,
  Eye,
  Play,
  Film,
  MapPin,
  Filter,
  Camera,
  Layers,
  Info,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (page: PageType, serviceKey?: string) => void;
  onOpenBooking: (serviceKey?: string) => void;
  onOpenLightbox: (items: GalleryItem[], index: number) => void;
  onOpenVideo: (item: GalleryItem) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenLightbox,
  onOpenVideo,
}) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('ALL');
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  // Filtered items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') {
      return GALLERY_ITEMS;
    }
    return GALLERY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Item counts per category for the filter pills
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: GALLERY_ITEMS.length };
    GALLERY_CATEGORIES.forEach((cat) => {
      if (cat !== 'ALL') {
        counts[cat] = GALLERY_ITEMS.filter((item) => item.category === cat).length;
      }
    });
    return counts;
  }, []);

  const handleCardClick = (item: GalleryItem, index: number) => {
    if (item.isVideo) {
      onOpenVideo(item);
    } else {
      // Find the index in filteredItems or pass filteredItems
      onOpenLightbox(filteredItems, index);
    }
  };

  return (
    <div className="w-full pt-20">
      {/* ========================================================
          PAGE HEADER BANNER
          ======================================================== */}
      <section className="relative py-24 bg-[#062F3C] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2000&auto=format&fit=crop"
            alt="Smile Click Studio Gallery Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C] via-[#062F3C]/80 to-[#062F3C]/95" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00A3D9] text-xs font-semibold tracking-widest uppercase mb-4 shadow-glow">
            <Camera className="w-4 h-4 text-[#00A3D9]" />
            <span>PORTFOLIO ARCHIVE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            OUR WORK
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Every picture tells a story. Explore the moments we've captured and the memories we've created.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-xs text-slate-300">
              Showing <strong className="text-white">{filteredItems.length}</strong> creations
            </span>
            <span className="text-slate-500">•</span>
            <button
              onClick={() => setShowConfigHelp(!showConfigHelp)}
              className="text-xs text-[#00A3D9] hover:underline flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Easy Image Replacement Info</span>
            </button>
          </div>
        </div>
      </section>

      {/* Structured Configuration Info Banner (Expandable) */}
      {showConfigHelp && (
        <div className="bg-[#003B4A] text-white border-b border-[#00A3D9]/30 py-4 px-4 text-xs transition-all">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#00A3D9]">
                💡 How to add or update portfolio photos & videos:
              </p>
              <p className="text-slate-200 mt-0.5">
                All gallery items are organized in <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300 font-mono">src/data/galleryData.ts</code>. Simply add your photo URL, category, title, and location to automatically render here with instant filter and lightbox support!
              </p>
            </div>
            <button
              onClick={() => setShowConfigHelp(false)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY FILTERS BAR
          ======================================================== */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 scroll-smooth">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400 mr-2 shrink-0 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-[#0077A8]" />
              <span>Filter:</span>
            </div>

            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#062F3C] text-white shadow-md shadow-[#062F3C]/20 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#00A3D9] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          PORTFOLIO GALLERY GRID
          ======================================================== */}
      <section className="py-16 bg-studio-light min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
              <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-[#062F3C]">
                No items in this category yet
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Select another filter or view all categories.
              </p>
              <button
                onClick={() => setActiveCategory('ALL')}
                className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold bg-[#0077A8] text-white"
              >
                Show All Work
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item, index) => {
                const isVideo = item.isVideo;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item, index)}
                    className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-card hover:shadow-premium cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
                  >
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C] via-[#062F3C]/40 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#00A3D9] border border-[#00A3D9]/40 shadow-sm">
                          {item.category}
                        </span>

                        {isVideo && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-600 text-white flex items-center gap-1 shadow-md">
                            <Film className="w-3 h-3" />
                            {item.duration || 'Video'}
                          </span>
                        )}
                      </div>

                      {/* Center Play / View Button Hover Animation */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0077A8] to-[#00A3D9] text-white flex items-center justify-center shadow-xl shadow-black/50">
                          {isVideo ? (
                            <Play className="w-6 h-6 ml-0.5 fill-white" />
                          ) : (
                            <Eye className="w-6 h-6" />
                          )}
                        </div>
                      </div>

                      {/* Bottom Info inside image */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#00A3D9] transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        {item.location && (
                          <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#00A3D9] shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Description & Details Footer */}
                    <div className="p-4 sm:p-5 bg-white flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[#0077A8] font-semibold group-hover:underline flex items-center gap-1">
                          {isVideo ? 'Watch Reel' : 'View Full Image'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Smile Click Studio
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Book or Custom Order CTA Bar */}
          <div className="mt-16 bg-[#062F3C] text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00A3D9]">
                INSPIRED BY OUR WORK?
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Let's Capture Your Special Celebration
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Whether you need wedding cinematography, baby milestone portraits, or custom magic gifts, Venkatesh is ready to assist you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenBooking()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-lg shadow-[#0077A8]/30 transition-all hover:scale-105"
              >
                BOOK YOUR SHOOT
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                Contact Studio
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

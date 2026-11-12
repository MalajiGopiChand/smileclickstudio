import React from 'react';
import { PageType } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import {
  Sparkles,
  Heart,
  Eye,
  Camera,
  Film,
  Award,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageType, serviceKey?: string) => void;
  onOpenBooking: (serviceKey?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <div className="w-full pt-20">
      {/* ========================================================
          PAGE HEADER BANNER
          ======================================================== */}
      <section className="relative py-24 bg-[#062F3C] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000&auto=format&fit=crop"
            alt="Photography Studio Equipment Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C] via-[#062F3C]/80 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00A3D9] text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles className="w-4 h-4 text-[#00A3D9]" />
            <span>DISCOVER OUR STORY</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            ABOUT SMILE CLICK STUDIO
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Smile Click Studio is a creative photography and media studio based in Vijayawada, dedicated to capturing life's most meaningful moments.
          </p>
        </div>
      </section>

      {/* ========================================================
          MAIN INTRODUCTION & ESSENCE
          ======================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8]">
                WHO WE ARE
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#062F3C] leading-snug">
                Where Passion Meets Timeless Visual Storytelling
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                We combine creativity, professional photography, cinematic storytelling and personalized design to create memories that can be cherished forever.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Founded and directed by <strong>Venkatesh</strong>, Smile Click Studio was born out of a profound love for human connection. We believe that behind every smile, gentle touch, and family tear of joy lies a sacred story waiting to be preserved.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our comprehensive scope of work includes photography, pre-wedding shoots, pre-birthday shoots, cinematic video editing, custom heirloom album design, personalized magic gifts (thermal cups & sequin pillows), and complete event management.
              </p>

              <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                <span className="px-3.5 py-2 rounded-xl bg-studio-light border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0077A8]" />
                  <span>Cinematic 4K Equipment</span>
                </span>
                <span className="px-3.5 py-2 rounded-xl bg-studio-light border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0077A8]" />
                  <span>Vijayawada Local Scouting</span>
                </span>
                <span className="px-3.5 py-2 rounded-xl bg-studio-light border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0077A8]" />
                  <span>Archival Printing Quality</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=1000&auto=format&fit=crop"
                  alt="Smile Click Studio Photography in action"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C] via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs uppercase tracking-widest text-[#00A3D9] font-bold mb-1">
                    Creative Vision
                  </div>
                  <div className="font-serif text-lg font-bold">
                    "Every click is an opportunity to immortalize love."
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    — Venkatesh, Smile Click Studio
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          OUR STORY SECTION
          ======================================================== */}
      <section className="py-20 bg-studio-light border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8] block mb-2">
              THE JOURNEY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#062F3C]">
              Our Story
            </h2>
          </div>

          <div className="space-y-8 text-slate-700 leading-relaxed text-base sm:text-lg">
            <p>
              Smile Click Studio began with a single camera, an uncompromising obsession with natural light, and a dream: to give families in Vijayawada a photography studio that treats their memories not as transactional projects, but as irreplaceable works of art.
            </p>
            <p>
              Over the years, our studio at Kandrika, N.S.C Bose Nagar has blossomed into a full-fledged creative hub. From intimate half-birthday milestones and joyful cake-smashes to lavish Telugu wedding mandaps and scenic riverside pre-wedding productions, we have had the privilege of capturing over 1,500 life stories.
            </p>
            <p>
              Recognizing that modern couples and families want both digital convenience and tangible keepsakes, we expanded into custom album handcrafting, personalized thermal magic cups, and reversible sequin cushions. Today, when you walk into Smile Click Studio, you are met with creative energy, technical expertise, and a team that genuinely cares about your story.
            </p>
          </div>

          {/* Timeline Milestones */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="font-serif text-2xl font-bold text-[#0077A8] mb-2">
                The Foundation
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Started in Vijayawada with portraiture and candid celebration coverage driven by raw passion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="font-serif text-2xl font-bold text-[#0077A8] mb-2">
                Cinematography & Albums
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upgraded to 4K cinema rigs, aerial drone filmmaking, and panoramic lay-flat archival photobooks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="font-serif text-2xl font-bold text-[#0077A8] mb-2">
                Creative Gifts & Events
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pioneered customized thermo-sensitive magic mugs, sequin magic pillows, and full event management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          OUR MISSION & OUR VISION
          ======================================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* OUR MISSION */}
            <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#062F3C] to-[#003B4A] text-white shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00A3D9]/20 border border-[#00A3D9]/40 flex items-center justify-center text-[#00A3D9]">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#00A3D9]">
                  GUIDING PRINCIPLE
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Our Mission
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  To capture emotions, celebrate special moments and transform memories into timeless experiences through creativity, quality craftsmanship, and heartfelt dedication.
                </p>
              </div>
            </div>

            {/* OUR VISION */}
            <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#003B4A] to-[#0077A8] text-white shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Eye className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-200">
                  LOOKING FORWARD
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Our Vision
                </h3>
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                  To become a trusted and recognized creative studio known for exceptional photography, innovative designs, and unforgettable customer experiences across Andhra Pradesh and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          STUDIO ETHOS & STANDARDS
          ======================================================== */}
      <section className="py-20 bg-studio-light border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8] block mb-2">
              EXCELLENCE IN EVERY DETAIL
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#062F3C]">
              What Defines Our Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#062F3C]">
                Flawless Lighting & Composition
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether in our climate-controlled indoor studio or under the golden sun of the Krishna riverbank, we master light so every skin tone glows naturally.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center">
                <Film className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#062F3C]">
                Cinematic Color Grading
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every photograph and video reel is individually graded on color-calibrated monitors to ensure timeless tones that never look dated.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#062F3C]">
                Heirloom Material Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We select only archival non-yellowing photographic paper, durable dye-sublimation ceramic coatings, and premium hand-sewn bindings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          VISIT US CTA
          ======================================================== */}
      <section className="py-20 bg-[#062F3C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00A3D9]">
            <MapPin className="w-4 h-4" />
            <span>LOCATED IN KANDRIKA, VIJAYAWADA</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to Begin Your Creative Journey With Us?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Drop by our studio for a warm cup of coffee, browse through our sample luxury photobooks, and let's plan your upcoming session.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-lg shadow-[#0077A8]/40 transition-all hover:scale-105"
            >
              BOOK A CONSULTATION
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105"
            >
              GET IN TOUCH
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

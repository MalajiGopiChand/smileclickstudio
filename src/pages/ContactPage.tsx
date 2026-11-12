import React, { useState, useEffect } from 'react';
import { PageType, ContactFormData } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../components/SocialIcons';

interface ContactPageProps {
  onNavigate: (page: PageType) => void;
  preSelectedService?: string;
  onSuccess: (message: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  preSelectedService,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    phone: '',
    email: '',
    service: 'Photo Shoot',
    eventDate: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (preSelectedService) {
      setFormData((prev) => ({ ...prev, service: preSelectedService }));
    }
  }, [preSelectedService]);

  const serviceOptions = [
    'Photo Shoot',
    'Pre-Wedding Shoot',
    'Pre-Birthday Shoot',
    'Event Management',
    'Video Editing',
    'Album Design',
    'Photo Frame',
    'Photo Cup',
    'Magic Cup',
    'Magic Pillow',
    'Other',
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate real submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccess('Thank you! Your enquiry has been received. We will contact you soon.');
    }, 800);
  };

  const handleWhatsAppSend = () => {
    if (!validate()) return;

    const formattedMessage = `*New Website Enquiry - Smile Click Studio*
👤 *Full Name:* ${formData.fullName}
📞 *Phone:* ${formData.phone}
✉️ *Email:* ${formData.email || 'Not provided'}
📸 *Service:* ${formData.service}
📅 *Event Date:* ${formData.eventDate || 'Not specified'}
💬 *Message:* ${formData.message}`;

    window.open(
      `https://wa.me/${BUSINESS_INFO.cleanPhone}?text=${encodeURIComponent(formattedMessage)}`,
      '_blank'
    );
  };

  return (
    <div className="w-full pt-20">
      {/* ========================================================
          PAGE HEADER BANNER
          ======================================================== */}
      <section className="relative py-24 bg-[#062F3C] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
            alt="Contact Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#062F3C] via-[#062F3C]/80 to-[#062F3C]/95" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00A3D9] text-xs font-semibold tracking-widest uppercase mb-4 shadow-glow">
            <Sparkles className="w-4 h-4 text-[#00A3D9]" />
            <span>LET'S TALK</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            LET'S CREATE BEAUTIFUL MEMORIES
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Have a project, celebration or special moment in mind? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ========================================================
          MAIN CONTACT & FORM SECTION
          ======================================================== */}
      <section className="py-20 bg-studio-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* LEFT COLUMN: Official Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0077A8] block mb-2">
                  OFFICIAL DETAILS
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#062F3C]">
                  Contact Information
                </h2>
                <p className="text-slate-600 text-sm mt-2">
                  Reach out to Venkatesh and the Smile Click Studio team directly via phone, WhatsApp, email, or visit our studio in Vijayawada.
                </p>
              </div>

              {/* Information Cards */}
              <div className="space-y-4">
                {/* Phone Card */}
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0077A8]/40 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center shrink-0 group-hover:bg-[#0077A8] group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      CALL US
                    </span>
                    <span className="font-serif text-lg font-bold text-[#062F3C] group-hover:text-[#0077A8] transition-colors">
                      {BUSINESS_INFO.phone}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Direct line to Venkatesh • Tap to call
                    </span>
                  </div>
                </a>

                {/* Email Card */}
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0077A8]/40 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center shrink-0 group-hover:bg-[#0077A8] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      EMAIL
                    </span>
                    <span className="font-medium text-sm sm:text-base text-[#062F3C] group-hover:text-[#0077A8] transition-colors break-all">
                      {BUSINESS_INFO.email}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Send project briefs & queries
                    </span>
                  </div>
                </a>

                {/* Address Card */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      ADDRESS
                    </span>
                    <address className="not-italic font-medium text-sm text-[#062F3C] leading-snug mt-1">
                      {BUSINESS_INFO.address.doorNo},<br />
                      {BUSINESS_INFO.address.street},<br />
                      {BUSINESS_INFO.address.city},<br />
                      {BUSINESS_INFO.address.state}, India
                    </address>
                  </div>
                </div>

                {/* Studio Hours */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#0077A8]/10 text-[#0077A8] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      STUDIO HOURS
                    </span>
                    <span className="font-medium text-sm text-[#062F3C] block mt-1">
                      {BUSINESS_INFO.hours}
                    </span>
                    <span className="text-xs text-emerald-600 font-medium block mt-0.5">
                      Open all 7 days for consultations & shoots
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Connect */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  CONNECT ON SOCIAL MEDIA
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={BUSINESS_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-600" />
                    <span className="truncate">Smile_click_Studio</span>
                  </a>

                  <a
                    href={BUSINESS_INFO.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4 text-blue-600" />
                    <span className="truncate">Smile_click_Studio</span>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Contact & Booking Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card">
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0077A8] mb-1">
                  <Sparkles className="w-4 h-4 text-[#00A3D9]" />
                  <span>SEND SERVICE ENQUIRY</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#062F3C]">
                  Book or Inquire About a Shoot
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Fill in your details below and we will get back to you within a few hours.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-12 px-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-emerald-900">
                    Thank you! Your enquiry has been received.
                  </h4>
                  <p className="text-sm text-emerald-700 max-w-md mx-auto">
                    We will contact you soon on <strong className="font-bold">{formData.phone}</strong>.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleWhatsAppSend}
                      className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send directly via WhatsApp</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: '',
                          phone: '',
                          email: '',
                          service: 'Photo Shoot',
                          eventDate: '',
                          message: '',
                        });
                      }}
                      className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Venkatesh Rao"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.fullName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                      } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077A8]/30 focus:border-[#0077A8] text-sm transition-all`}
                    />
                    {errors.fullName && (
                      <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 95021 24495"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                          errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                        } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077A8]/30 focus:border-[#0077A8] text-sm transition-all`}
                      />
                      {errors.phone && (
                        <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@gmail.com"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                          errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                        } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077A8]/30 focus:border-[#0077A8] text-sm transition-all`}
                      />
                      {errors.email && (
                        <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Service & Event Date Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Service Interested In <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                          errors.service ? 'border-rose-500' : 'border-slate-200'
                        } text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077A8]/30 focus:border-[#0077A8] text-sm transition-all`}
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.service}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Event / Shoot Date <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077A8]/30 focus:border-[#0077A8] text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please share your shoot requirements, location details, preferred themes, or questions..."
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.message ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                      } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077A8]/30 focus:border-[#0077A8] text-sm transition-all`}
                    />
                    {errors.message && (
                      <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit CTAs */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-lg shadow-[#0077A8]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'SENDING...' : 'SEND ENQUIRY'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      className="flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-sm text-white bg-[#25D366] hover:bg-[#20ba5a] shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      title="Send directly to Venkatesh on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>SEND VIA WHATSAPP</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ========================================================
              MAP / LOCATION EMBED
              ======================================================== */}
          <div className="mt-16 rounded-3xl overflow-hidden border border-slate-200 shadow-card bg-white">
            <div className="p-6 bg-[#062F3C] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#00A3D9] font-semibold block mb-0.5">
                  VISIT OUR STUDIO
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-bold">
                  Smile Click Studio — Vijayawada
                </h4>
                <p className="text-xs text-slate-300">
                  D.No: 53, Kandrika, N.S.C Bose Nagar, Vijayawada – 15, Andhra Pradesh
                </p>
              </div>

              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#00A3D9] text-white hover:bg-[#1db9ee] transition-colors self-start sm:self-auto shrink-0 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            <div className="w-full h-80 bg-slate-100">
              <iframe
                title="Smile Click Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.786358172944!2d80.6482!3d16.5415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35e4dbbbbbbbbb%3A0x1234567890abcdef!2sKandrika%2C%20Vijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

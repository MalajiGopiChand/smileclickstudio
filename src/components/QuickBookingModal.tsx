import React, { useState, useEffect } from 'react';
import { SERVICES_DATA } from '../data/servicesData';
import { BUSINESS_INFO } from '../data/businessInfo';
import { X, Calendar, CheckCircle2, MessageCircle, Send, Sparkles } from 'lucide-react';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
  onSuccess: (message: string) => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedService,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Photo Shoot');
  const [eventDate, setEventDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (preSelectedService) {
      setService(preSelectedService);
    }
  }, [preSelectedService]);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your name';
    if (!phone.trim()) {
      errs.phone = 'Please enter your phone number';
    } else if (!/^[0-9+\-\s]{10,15}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!message.trim()) errs.message = 'Please provide details or questions';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccess(`Thank you ${fullName}! Your booking request for ${service} has been received.`);
    }, 800);
  };

  const handleWhatsAppSubmit = () => {
    if (!fullName.trim() || !phone.trim()) {
      validate();
      return;
    }
    const text = `Hello Smile Click Studio!
I would like to book a session:
• Name: ${fullName}
• Phone: ${phone}
• Email: ${email || 'N/A'}
• Service: ${service}
• Date: ${eventDate || 'Not specified'}
• Details: ${message || 'Looking for pricing and availability'}`;

    window.open(`https://wa.me/${BUSINESS_INFO.cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#062F3C] text-white border border-[#00A3D9]/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Glow Header */}
        <div className="p-6 bg-gradient-to-r from-[#003B4A] to-[#062F3C] border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#00A3D9] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Smile Click Studio Reservation</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-white">
            Book Your Shoot & Creative Session
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Connect with Venkatesh directly for customized dates & transparent packages.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif text-xl font-bold text-white">
                Booking Request Received!
              </h4>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                Thank you! Your enquiry has been received. Venkatesh from Smile Click Studio will contact you soon on <strong className="text-white">{phone}</strong>.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleWhatsAppSubmit}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20ba5a] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open in WhatsApp Now</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Full Name <span className="text-[#00A3D9]">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                    errors.fullName ? 'border-rose-500' : 'border-white/15'
                  } text-white placeholder-slate-400 focus:outline-none focus:border-[#00A3D9] text-sm`}
                />
                {errors.fullName && (
                  <p className="text-rose-400 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Phone Number <span className="text-[#00A3D9]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                      errors.phone ? 'border-rose-500' : 'border-white/15'
                    } text-white placeholder-slate-400 focus:outline-none focus:border-[#00A3D9] text-sm`}
                  />
                  {errors.phone && (
                    <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-[#00A3D9] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Service Interested In <span className="text-[#00A3D9]">*</span>
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#003B4A] border border-white/15 text-white focus:outline-none focus:border-[#00A3D9] text-sm"
                  >
                    {SERVICES_DATA.map((s) => (
                      <option key={s.id} value={s.serviceKey}>
                        {s.serviceKey}
                      </option>
                    ))}
                    <option value="Other">Other / Custom Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Event / Shoot Date <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#003B4A] border border-white/15 text-white focus:outline-none focus:border-[#00A3D9] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Message / Requirements <span className="text-[#00A3D9]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your event, location preference, or gift customization requirements..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                    errors.message ? 'border-rose-500' : 'border-white/15'
                  } text-white placeholder-slate-400 focus:outline-none focus:border-[#00A3D9] text-sm`}
                />
                {errors.message && (
                  <p className="text-rose-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0077A8] to-[#00A3D9] hover:from-[#0089c2] hover:to-[#00b8f5] shadow-lg shadow-[#0077A8]/30 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Enquiry...' : 'SEND ENQUIRY'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppSubmit}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#25D366] hover:bg-[#20ba5a] transition-all"
                  title="Send directly to Venkatesh on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

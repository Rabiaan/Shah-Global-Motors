import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useDealership } from '../../context/DealershipContext';

interface ContactUsPageProps {
  onNavigate: (page: 'new-cars' | 'used-cars' | 'car-details' | 'sell-your-car' | 'services' | 'about-us' | 'contact-us') => void;
}

export default function ContactUsPage({ onNavigate }: ContactUsPageProps) {
  const { submitCustomerEnquiry } = useDealership();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Vehicle Inquiry');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'email'>('phone');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) return;

    setSubmitting(true);
    try {
      await submitCustomerEnquiry({
        name,
        email,
        phone,
        preferredContact,
        subject,
        message,
        status: 'New'
      });
      setSubmitted(true);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const showroomLocations = [
    {
      city: 'Silicon Valley Flagship',
      address: '4200 Luxury Way, Palo Alto, CA 94304',
      phone: '+1 (800) 555-3968',
      email: 'paloalto@shahglobalexotics.com',
      hours: 'Mon - Sat: 9:00 AM – 8:00 PM | Sun: By Private Appointment'
    },
    {
      city: 'Miami Waterfront Gallery',
      address: '880 Ocean Drive, Suite 100, Miami Beach, FL 33139',
      phone: '+1 (305) 555-8921',
      email: 'miami@shahglobalexotics.com',
      hours: 'Mon - Sun: 10:00 AM – 9:00 PM EST'
    },
    {
      city: 'London Mayfair Liaison Desk',
      address: '14 Berkeley Square, Mayfair, London W1J 6BQ, UK',
      phone: '+44 20 7946 0912',
      email: 'london@shahglobalexotics.com',
      hours: 'Mon - Fri: 9:00 AM – 6:00 PM GMT'
    }
  ];

  const faqs = [
    {
      q: 'Do I need an appointment to visit the showroom?',
      a: 'While our main gallery is open to the public during business hours, private test drives, track evaluations, and vehicle configuration consultations require a reserved VIP time slot.'
    },
    {
      q: 'Do you arrange international export and customs clearance?',
      a: 'Yes. Our logistics desk regularly exports vehicles to Canada, the UK, Europe, the Middle East, and Asia with full door-to-door enclosed air/ocean freight and homologation support.'
    },
    {
      q: 'Can I purchase a vehicle entirely online?',
      a: 'Absolutely. We offer 4K video walk-throughs, paint-meter documentation, secure e-signatures for all contracts, and direct wire escrow payments.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* 1. Hero Header Banner */}
      <div className="relative bg-[#0d0f14] text-white py-16 sm:py-20 overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e63946_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 uppercase mb-4">
            <button onClick={() => onNavigate('new-cars')} className="hover:text-white transition-colors cursor-pointer">
              SHOWROOM
            </button>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-[#e63946] font-bold">CONTACT US</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 text-[#e63946] text-xs font-mono font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                PRIVATE CLIENT DESK &amp; SHOWROOM INQUIRIES
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white uppercase leading-none">
                CONNECT WITH <span className="text-[#e63946]">SHAHGLOBAL</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl">
                Whether you are seeking to acquire a new exotic supercar, inquire about global enclosed transport, or book a private VIP test drive, our senior specialists are at your disposal.
              </p>
            </div>

            {/* Direct Phone Box */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl backdrop-blur-sm shrink-0 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">DIRECT CONCIERGE HOTLINE</span>
              <a href="tel:+18005553968" className="text-xl sm:text-2xl font-extrabold font-heading text-white hover:text-[#e63946] transition-colors">
                +1 (800) 555-EXOTIC
              </a>
              <span className="text-[11px] font-mono text-emerald-400">● Specialists Online 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Form & Info Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm">
              <span className="text-xs font-mono font-bold text-[#e63946] uppercase tracking-widest">
                DIRECT TRANSMISSION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight mt-1 mb-6">
                SEND AN INQUIRY
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-950 my-6"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold font-heading uppercase">Inquiry Transmitted Successfully</h3>
                  <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                    Thank you, {name}. Your inquiry regarding "{subject}" has been assigned to a senior brand concierge. We will reach out via your preferred method ({preferredContact}) within 15 minutes.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                        YOUR FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Julian Sterling"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="julian@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2831"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                        INQUIRY TOPIC
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#e63946] cursor-pointer"
                      >
                        <option value="Vehicle Purchase">Vehicle Purchase &amp; Pricing</option>
                        <option value="Bespoke Factory Sourcing">Bespoke Factory Allocation / PTS</option>
                        <option value="VIP Test Drive">VIP Test Drive Reservation</option>
                        <option value="Selling or Consignment">Selling or Consigning a Vehicle</option>
                        <option value="Financing or Leasing">Financing &amp; Trust Lease Structures</option>
                        <option value="Service & Armor">Maintenance, Detailing &amp; PPF</option>
                        <option value="General Concierge">General Concierge Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-2">
                      PREFERRED CONTACT METHOD
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['phone', 'whatsapp', 'email'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPreferredContact(method)}
                          className={`py-2.5 rounded-xl text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                            preferredContact === method
                              ? 'bg-neutral-950 text-white shadow-sm'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {method === 'phone' && 'Direct Phone'}
                          {method === 'whatsapp' && 'WhatsApp'}
                          {method === 'email' && 'Email'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                      YOUR MESSAGE OR VEHICLE SPECIFICATION *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please mention specific vehicle VIN, target delivery dates, or any special requests..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#e63946]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#e63946] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'TRANSMITTING MESSAGE...' : 'SUBMIT DIRECT INQUIRY'}</span>
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center font-mono">
                    Strict privacy guaranteed. We never sell or share your contact details.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Showroom Locations & Hours (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Showroom Galleries */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm">
              <h3 className="text-base font-extrabold font-heading text-neutral-950 uppercase tracking-wide mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e63946]" />
                GLOBAL SHOWROOM GALLERIES
              </h3>

              <div className="space-y-6">
                {showroomLocations.map((loc, i) => (
                  <div key={i} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                    <div className="font-extrabold font-heading text-neutral-900 text-sm uppercase">
                      {loc.city}
                    </div>
                    <div className="text-xs text-neutral-600 font-sans flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#e63946] shrink-0 mt-0.5" />
                      <span>{loc.address}</span>
                    </div>
                    <div className="text-xs font-mono text-neutral-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <a href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#e63946]">
                        {loc.phone}
                      </a>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5 pt-1 border-t border-neutral-200/60">
                      <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-md">
              <h3 className="text-base font-extrabold font-heading uppercase tracking-wide mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#e63946]" />
                FREQUENTLY ASKED QUESTIONS
              </h3>

              <div className="space-y-4 text-xs">
                {faqs.map((faq, i) => (
                  <div key={i} className="pb-3 border-b border-neutral-800 last:border-b-0 last:pb-0">
                    <div className="font-bold text-white mb-1 font-heading">{faq.q}</div>
                    <p className="text-neutral-400 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

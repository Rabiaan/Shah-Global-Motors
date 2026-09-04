import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Navigation,
  Globe2,
  Building
} from 'lucide-react';
import { useDealership } from '../context/DealershipContext';
import type { Vehicle, ShowroomLocation } from '../types';

interface ContactModalProps {
  vehicle?: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ vehicle, isOpen, onClose }: ContactModalProps) {
  const { addEnquiry, vehicles } = useDealership();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'email'>('whatsapp');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicle ? vehicle.id : '');
  const [subject, setSubject] = useState(vehicle ? `Inquiry regarding ${vehicle.make} ${vehicle.model}` : 'General Showroom Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [activeLocationId, setActiveLocationId] = useState('sv');

  const showroomLocations: ShowroomLocation[] = [
    {
      id: 'sv',
      city: 'Silicon Valley HQ',
      title: 'Shahglobal Innovation Pavilion',
      address: '2800 Sand Hill Road, Menlo Park, CA 94025, United States',
      phone: '+1 (800) 555-0199',
      whatsapp: '+14158902104',
      email: 'siliconvalley@shahglobal.com',
      hoursWeekday: '8:30 AM – 8:00 PM PST',
      hoursSaturday: '9:00 AM – 7:00 PM PST',
      hoursSunday: '10:00 AM – 5:00 PM (By Appointment)',
      coordinates: { lat: 37.422, lng: -122.18 },
    },
    {
      id: 'geneva',
      city: 'Geneva Atelier',
      title: 'Shahglobal Swiss Private Lounge',
      address: 'Rue du Rhône 42, 1204 Genève, Switzerland',
      phone: '+41 22 790 4410',
      whatsapp: '+41227904410',
      email: 'geneva@shahglobal.com',
      hoursWeekday: '9:00 AM – 7:30 PM CET',
      hoursSaturday: '10:00 AM – 6:00 PM CET',
      hoursSunday: 'Closed (Private Track Days)',
      coordinates: { lat: 46.2044, lng: 6.1432 },
    },
    {
      id: 'munich',
      city: 'Munich High-Speed Center',
      title: 'Shahglobal Bavaria Performance Hub',
      address: 'Maximilianstraße 35, 80539 München, Germany',
      phone: '+49 89 2442 8800',
      whatsapp: '+498924428800',
      email: 'munich@shahglobal.com',
      hoursWeekday: '8:00 AM – 8:00 PM CET',
      hoursSaturday: '9:00 AM – 6:00 PM CET',
      hoursSunday: 'Autobahn Road Sessions Only',
      coordinates: { lat: 48.1391, lng: 11.5802 },
    },
    {
      id: 'tokyo',
      city: 'Tokyo Studio Experience',
      title: 'Shahglobal Ginza Atelier',
      address: '6-10-1 Ginza, Chuo City, Tokyo 104-0061, Japan',
      phone: '+81 3 5555 0190',
      whatsapp: '+81355550190',
      email: 'tokyo@shahglobal.com',
      hoursWeekday: '10:00 AM – 9:00 PM JST',
      hoursSaturday: '10:00 AM – 8:00 PM JST',
      hoursSunday: '10:00 AM – 7:00 PM JST',
      coordinates: { lat: 35.6696, lng: 139.7645 },
    },
  ];

  const currentLocation = showroomLocations.find((l) => l.id === activeLocationId) || showroomLocations[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const selVeh = vehicles.find((v) => v.id === selectedVehicleId);

    addEnquiry({
      name,
      email,
      phone,
      whatsapp: whatsapp || phone,
      preferredContact,
      subject,
      message,
      vehicleId: selectedVehicleId || undefined,
      vehicleName: selVeh ? `${selVeh.make} ${selVeh.model}` : undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="contact-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="contact-modal-card"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#0f1115] border border-neutral-800 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl text-white my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center text-[#e63946]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight">
                  GLOBAL CLIENT CONCIERGE &amp; LOCATIONS
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  24/7 VIP Assistance, Global Door-to-Door Delivery &amp; Showrooms
                </p>
              </div>
            </div>

            <button
              id="close-contact-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
            
            {/* Quick Contact Actions Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="tel:+18005550199"
                className="p-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">CALL NOW</span>
                  <span className="text-xs font-bold text-white font-heading">+1 (800) 555-0199</span>
                </div>
              </a>

              <a
                href="https://wa.me/14158902104"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">WHATSAPP DIRECT</span>
                  <span className="text-xs font-bold text-white font-heading">+1 (415) 890-2104</span>
                </div>
              </a>

              <a
                href="mailto:concierge@shahglobal.com"
                className="p-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800 flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e63946]/10 text-[#e63946] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">OFFICIAL EMAIL</span>
                  <span className="text-xs font-bold text-white font-heading">concierge@shahglobal.com</span>
                </div>
              </a>
            </div>

            {/* Main Grid: Contact Form (Left) & Locations + Map (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form */}
              <div className="lg:col-span-6 bg-neutral-900/50 p-6 rounded-3xl border border-neutral-800 space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#e63946]">
                  SEND AN ENQUIRY OR SCHEDULE PRIVATE VIEWING
                </div>

                {isSubmitted ? (
                  <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    <h4 className="text-lg font-bold font-heading">Inquiry Received</h4>
                    <p className="text-xs text-neutral-400 max-w-xs">
                      Our concierge manager will respond via your preferred contact method ({preferredContact.toUpperCase()}) shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Adrian Newey"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="adrian@formula1.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+1 (415) 555-0199"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Vehicle of Interest</label>
                        <select
                          value={selectedVehicleId}
                          onChange={(e) => setSelectedVehicleId(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                        >
                          <option value="">General Collection Inquiry</option>
                          {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.year} {v.make} {v.model}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Preferred Contact Method</label>
                        <div className="grid grid-cols-3 gap-1">
                          {(['whatsapp', 'phone', 'email'] as const).map((method) => (
                            <button
                              type="button"
                              key={method}
                              onClick={() => setPreferredContact(method)}
                              className={`py-2 rounded-lg text-[10px] font-bold uppercase font-mono transition-all cursor-pointer ${
                                preferredContact === method
                                  ? 'bg-[#e63946] text-white'
                                  : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Message / Requirements *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tell us about your requirements, bespoke color preference, or international shipping destination..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#e63946] hover:bg-[#d62839] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 font-heading text-xs uppercase tracking-wider shadow-lg shadow-red-900/30 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>SUBMIT CONFIDENTIAL INQUIRY</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Showroom Locations & Opening Hours & Interactive Map */}
              <div className="lg:col-span-6 flex flex-col space-y-4">
                
                {/* Location Hub Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                  {showroomLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setActiveLocationId(loc.id)}
                      className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                        activeLocationId === loc.id
                          ? 'bg-[#e63946] text-white shadow-md'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <span className="text-[11px] font-extrabold uppercase font-heading block truncate">{loc.city.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Location Card */}
                <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e63946] uppercase">
                      <Building className="w-4 h-4" />
                      <span>{currentLocation.city}</span>
                    </div>
                    <h4 className="text-base font-bold text-white font-heading mt-0.5">
                      {currentLocation.title}
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-[#e63946] flex-shrink-0 mt-0.5" />
                      <span>{currentLocation.address}</span>
                    </p>
                  </div>

                  {/* Hours */}
                  <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-400 font-mono font-bold text-[10px] uppercase">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>OPENING &amp; SHOWROOM HOURS</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                      <div>
                        <span className="text-neutral-500 block text-[9px]">MON – FRI</span>
                        <span className="text-white font-bold">{currentLocation.hoursWeekday}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px]">SATURDAY</span>
                        <span className="text-white font-bold">{currentLocation.hoursSaturday}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px]">SUNDAY</span>
                        <span className="text-white font-bold">{currentLocation.hoursSunday}</span>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps Visual Preview with Directions link */}
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-800 bg-[#161a22] flex items-center justify-center group">
                    {/* Stylized dark map grid pattern */}
                    <div 
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: `radial-gradient(#4f5b66 1px, transparent 1px), radial-gradient(#4f5b66 1px, #161a22 1px)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px'
                      }}
                    />

                    {/* Showroom Marker */}
                    <div className="relative z-10 flex flex-col items-center animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-[#e63946] text-white flex items-center justify-center shadow-lg shadow-red-900/50 border-2 border-white">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-extrabold bg-black/80 px-2 py-0.5 rounded mt-1 border border-white/20 text-white">
                        {currentLocation.title}
                      </span>
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(currentLocation.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white text-neutral-900 text-xs font-bold font-heading flex items-center gap-1.5 hover:bg-neutral-200 transition-colors shadow-lg"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#e63946]" />
                      <span>GET GPS DIRECTIONS</span>
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Calculator, 
  Wrench, 
  Globe, 
  KeyRound, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Clock, 
  ChevronRight,
  Send
} from 'lucide-react';
import { useDealership } from '../../context/DealershipContext';

interface ServicesPageProps {
  onNavigate: (page: 'new-cars' | 'used-cars' | 'car-details' | 'sell-your-car' | 'services' | 'about-us' | 'contact-us') => void;
  onOpenTestDrive: () => void;
  onOpenFinancing: () => void;
  onOpenContact: () => void;
}

export default function ServicesPage({
  onNavigate,
  onOpenTestDrive,
  onOpenFinancing,
  onOpenContact
}: ServicesPageProps) {
  const { submitCustomerEnquiry } = useDealership();

  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState('Worldwide Enclosed Delivery');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const servicesList = [
    {
      id: 'test-drives',
      icon: KeyRound,
      badge: 'EXCLUSIVE',
      title: 'VIP Test Drive & Track Experiences',
      subtitle: 'Dynamic closed-course and canyon evaluation routes.',
      description: 'Experience your prospective supercar under optimal driving conditions. We offer private track bookings, private airport runway high-speed testing, and scenic route evaluation with professional telemetry guidance.',
      highlights: [
        'Private closed-course dynamic handling',
        'Accompanied by professional racing instructors',
        'Zero high-pressure sales atmosphere',
        'Complimentary champagne concierge lounge'
      ],
      ctaText: 'Schedule VIP Drive',
      action: onOpenTestDrive
    },
    {
      id: 'financing',
      icon: Calculator,
      badge: 'TIER 1 RATES',
      title: 'Bespoke Exotic Financing & Leasing',
      subtitle: 'Structured capital solutions for high-net-worth clientele.',
      description: 'Custom lending architecture tailored for collectors, business entities, and private trusts. Access closed-end leases with low residual risk, balloon payment structures, and multi-car portfolio financing.',
      highlights: [
        'LLC & Trust ownership structuring',
        'Balloon note financing with low monthly capital drag',
        'Relationships with 15+ premier private banks',
        'Fast 2-hour credit decisions with minimal documentation'
      ],
      ctaText: 'Apply For Financing',
      action: onOpenFinancing
    },
    {
      id: 'transport',
      icon: Truck,
      badge: 'GLOBAL REACH',
      title: 'Worldwide Enclosed Freight & Delivery',
      subtitle: 'Air freight and air-ride climate-controlled logistics.',
      description: 'We deliver door-to-door anywhere across the globe. Our fleet of climate-controlled, air-ride enclosed transporters guarantees your exotic vehicle arrives in 100% factory pristine condition.',
      highlights: [
        'Fully insured $5M+ cargo protection per transport',
        'Live satellite GPS tracking with driver check-ins',
        'Customs clearance & international homologation handled',
        'White-glove unboxing and key handover ceremony'
      ],
      ctaText: 'Request Transport Quote',
      action: () => {
        setSelectedServiceForInquiry('Worldwide Enclosed Delivery');
        document.getElementById('service-consultation-form')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'sourcing',
      icon: Globe,
      badge: 'RARE BUILDS',
      title: 'Global Sourcing & Allocation Desk',
      subtitle: 'Securing off-market hypercars, PTS allocations, and rare VINs.',
      description: 'Can’t find your dream specification? Our acquisitions team leverages deep personal relationships with factory VIP directors, European private collectors, and international auction houses.',
      highlights: [
        'Exclusive access to sold-out manufacturer build slots',
        'Paint-to-Sample (PTS) and bespoke Atelier liaison',
        'Pre-purchase physical inspection & paint meter verification',
        'Discreet off-market acquisition services'
      ],
      ctaText: 'Bespoke Sourcing Request',
      action: () => {
        setSelectedServiceForInquiry('Global Vehicle Sourcing');
        document.getElementById('service-consultation-form')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'maintenance',
      icon: Wrench,
      badge: 'MASTER CERTIFIED',
      title: 'Master Technician Maintenance & Armor',
      subtitle: 'Factory diagnostic tooling, XPEL PPF, and ceramic coatings.',
      description: 'Our dedicated clean-room service center features OEM diagnostic equipment for Porsche, Ferrari, McLaren, and Lamborghini. We provide track prep, major interval servicing, and full XPEL self-healing PPF installation.',
      highlights: [
        'Factory-trained master diagnostic technicians',
        'State-of-the-art climate-controlled XPEL clean room',
        'Laser four-wheel alignment & corner weighting',
        'Official service history stamping and documentation'
      ],
      ctaText: 'Book Service Consultation',
      action: () => {
        setSelectedServiceForInquiry('Service & Detailing');
        document.getElementById('service-consultation-form')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'consignment',
      icon: Award,
      badge: 'MAX RETURN',
      title: 'White-Glove Consignment Program',
      subtitle: 'Maximize the net return on your rare luxury vehicle.',
      description: 'Let us showcase your vehicle to thousands of vetted high-net-worth buyers worldwide. We manage professional 4K studio photography, multi-platform international marketing, and escrow payment security.',
      highlights: [
        'HD 4K studio photography and cinematic video',
        'Displayed in our high-traffic Silicon Valley showroom',
        'Full insurance coverage while under our care',
        'We handle all test drives, inquiries, and title paperwork'
      ],
      ctaText: 'Consign Your Vehicle',
      action: () => onNavigate('sell-your-car')
    }
  ];

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    setSubmitting(true);
    try {
      await submitCustomerEnquiry({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        preferredContact: 'phone',
        subject: `Service Inquiry: ${selectedServiceForInquiry}`,
        message: inquiryNotes || `Interested in learning more about ${selectedServiceForInquiry}`,
        status: 'New'
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

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
            <span className="text-[#e63946] font-bold">CLIENT SERVICES</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 text-[#e63946] text-xs font-mono font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                BESPOKE EXOTIC MOTORING SERVICES
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white uppercase leading-none">
                CONCIERGE &amp; <span className="text-[#e63946]">SERVICES</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl">
                From worldwide enclosed delivery and bespoke trust financing to high-speed track testing and master technician maintenance, we cater to every facet of exotic car ownership.
              </p>
            </div>

            {/* Quick Pill */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl backdrop-blur-sm shrink-0 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e63946]/20 text-[#e63946] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold font-mono text-white">24/7 PRIVATE CLIENT DESK</div>
                <div className="text-xs text-neutral-400">Direct phone &amp; WhatsApp concierge</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Comprehensive Services Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((srv) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-neutral-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-md">
                      <Icon className="w-7 h-7 text-[#e63946]" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-mono font-extrabold uppercase tracking-wider">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight">
                    {srv.title}
                  </h3>

                  <p className="text-xs font-mono text-neutral-400 mt-1 mb-3">
                    {srv.subtitle}
                  </p>

                  <p className="text-xs text-neutral-600 leading-relaxed font-sans mb-6">
                    {srv.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 mb-8 pt-4 border-t border-neutral-100">
                    {srv.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={srv.action}
                  className="w-full py-3.5 bg-neutral-950 hover:bg-[#e63946] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{srv.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Direct Service Consultation Form Card */}
        <div id="service-consultation-form" className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-5">
              <span className="text-xs font-mono font-bold text-[#e63946] uppercase tracking-widest">
                DIRECT SERVICE INQUIRY
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-950 tracking-tight mt-2 uppercase">
                SPEAK TO A SPECIALIST
              </h3>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed font-sans">
                Tell us which service you require and our senior concierge director will respond with a tailored proposal, timeline, and logistics plan.
              </p>

              <div className="mt-8 space-y-3 text-xs font-mono">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="font-bold text-neutral-900">Direct Concierge Line:</div>
                  <a href="tel:+18005553968" className="text-[#e63946] font-bold text-sm">+1 (800) 555-EXOTIC</a>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="font-bold text-neutral-900">Showroom VIP Desk:</div>
                  <div className="text-neutral-600">concierge@shahglobalexotics.com</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-950">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-xl font-bold font-heading uppercase">Consultation Request Received</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you, {clientName}. An exotic specialist assigned to {selectedServiceForInquiry} will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                      SELECT SERVICE OF INTEREST
                    </label>
                    <select
                      value={selectedServiceForInquiry}
                      onChange={(e) => setSelectedServiceForInquiry(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#e63946] cursor-pointer"
                    >
                      <option value="Worldwide Enclosed Delivery">Worldwide Enclosed Delivery &amp; Air Freight</option>
                      <option value="Bespoke Financing & Leasing">Bespoke Exotic Financing &amp; Trust Leasing</option>
                      <option value="Global Vehicle Sourcing">Global Vehicle Sourcing &amp; Allocation Search</option>
                      <option value="VIP Track & Test Drive Experience">VIP Track &amp; Test Drive Experience</option>
                      <option value="XPEL Ceramic & Service Armor">XPEL Ceramic &amp; Service Armor</option>
                      <option value="Exotic Vehicle Consignment">Exotic Vehicle Consignment</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sebastian Cole"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sebastian@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2831"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1">
                      SPECIFIC REQUIREMENTS OR DETAILS
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Please include vehicle make/model, target delivery destination, or desired financing parameters..."
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#e63946]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#e63946] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'TRANSMITTING REQUEST...' : 'SUBMIT SERVICE INQUIRY'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Gauge, 
  Zap, 
  Fuel, 
  Calendar, 
  MapPin, 
  Clock, 
  FileCheck2, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Calculator, 
  ArrowRight,
  TrendingDown,
  Info,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { useDealership } from '../../context/DealershipContext';
import type { Vehicle } from '../../types';

interface CarDetailsPageProps {
  vehicle: Vehicle | null;
  onNavigate: (page: 'new-cars' | 'used-cars' | 'car-details' | 'sell-your-car' | 'services' | 'about-us' | 'contact-us') => void;
  onBookTestDrive: (vehicle: Vehicle) => void;
  onOpenFinancing: (vehicle: Vehicle) => void;
  onOpenContact: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export default function CarDetailsPage({
  vehicle,
  onNavigate,
  onBookTestDrive,
  onOpenFinancing,
  onOpenContact,
  onSelectVehicle
}: CarDetailsPageProps) {
  const { vehicles, submitTestDriveRequest, submitCustomerEnquiry } = useDealership();

  // If vehicle is null, pick the first featured vehicle or default
  const activeVehicle = vehicle || vehicles[0];

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // In-page Test Drive booking form state
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveTime, setTestDriveTime] = useState('11:00 AM');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [submittedBooking, setSubmittedBooking] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // In-page Quick Finance Estimator
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const interestRate = 5.9; // 5.9% APR

  if (!activeVehicle) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-8">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
          <h2 className="text-xl font-bold font-heading mb-2">No Vehicle Selected</h2>
          <p className="text-sm text-neutral-500 mb-6">Please select a car from our showroom catalog to view details.</p>
          <button
            onClick={() => onNavigate('new-cars')}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Explore Showroom
          </button>
        </div>
      </div>
    );
  }

  // Related vehicles
  const relatedVehicles = vehicles
    .filter(v => v.id !== activeVehicle.id && (v.make === activeVehicle.make || v.category === activeVehicle.category))
    .slice(0, 3);

  // Finance calculations
  const downPaymentAmount = (activeVehicle.price * downPaymentPercent) / 100;
  const loanPrincipal = activeVehicle.price - downPaymentAmount;
  const monthlyInterestRate = (interestRate / 100) / 12;
  const calculatedMonthly = Math.round(
    (loanPrincipal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleInPageTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !testDriveDate) return;

    setSubmittingBooking(true);
    try {
      await submitTestDriveRequest({
        vehicleId: activeVehicle.id,
        vehicleName: `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`,
        customerName: clientName,
        customerEmail: clientEmail,
        customerPhone: clientPhone,
        preferredDate: testDriveDate,
        preferredTime: testDriveTime,
        status: 'Pending',
        notes: `Direct detail page booking for ${activeVehicle.specs.vin}`
      });
      setSubmittedBooking(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* 1. Sticky Navigation & Breadcrumbs Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(activeVehicle.category === 'New' ? 'new-cars' : 'used-cars')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>BACK TO {activeVehicle.category === 'New' ? 'NEW CARS' : 'USED CARS'}</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>/</span>
              <span>{activeVehicle.make}</span>
              <span>/</span>
              <span className="text-neutral-900 font-bold">{activeVehicle.model}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 transition-colors relative cursor-pointer"
              title="Share Vehicle"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-neutral-950 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isSaved ? 'bg-red-50 text-[#e63946]' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950'
              }`}
              title="Save to Favorites"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#e63946]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 2. Main Vehicle Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-extrabold uppercase tracking-wider ${
                activeVehicle.category === 'New' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                {activeVehicle.category === 'New' ? 'BRAND NEW • 0 MILEAGE' : `${activeVehicle.condition.toUpperCase()} • ${activeVehicle.mileage.toLocaleString()} MI`}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-mono">
                VIN: {activeVehicle.specs.vin}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-mono">
                LOC: {activeVehicle.location}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight">
              {activeVehicle.year} {activeVehicle.make} <span className="text-[#e63946]">{activeVehicle.model}</span>
            </h1>

            <p className="mt-1 text-sm font-mono text-neutral-500">
              {activeVehicle.engine} • {activeVehicle.transmission} • {activeVehicle.color}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="flex items-baseline lg:flex-col lg:items-end gap-3 shrink-0 bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <div>
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                SHOWROOM CASH PRICE
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-950">
                ${activeVehicle.price.toLocaleString()}
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-500">
              Or <span className="font-bold text-neutral-900">${calculatedMonthly.toLocaleString()}/mo</span> ($0 down available)
            </div>
          </div>
        </div>

        {/* 3. Image Gallery & Live Interaction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Left Column: Image Showcase (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Primary High-Res Viewer */}
            <div className="relative h-[360px] sm:h-[480px] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-lg group">
              <img
                src={activeVehicle.images[selectedImageIndex] || activeVehicle.images[0]}
                alt={`${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Telemetry Pills on Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-[#e63946]" />
                    {activeVehicle.specs.horsepower} HORSEPOWER
                  </span>
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    {activeVehicle.specs.acceleration}
                  </span>
                </div>
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px]">
                  PHOTO {selectedImageIndex + 1} OF {activeVehicle.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel Switcher */}
            <div className="grid grid-cols-4 gap-3">
              {activeVehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`h-20 sm:h-24 rounded-xl overflow-hidden bg-neutral-900 border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx 
                      ? 'border-[#e63946] shadow-md scale-98' 
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            {/* Telemetry & Performance Matrix */}
            <div className="mt-4 bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <h3 className="text-base font-extrabold font-heading text-neutral-950 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e63946]" />
                PERFORMANCE &amp; CHASSIS MATRIX
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">HORSEPOWER</div>
                  <div className="text-xl font-extrabold font-heading text-neutral-900 mt-0.5">
                    {activeVehicle.specs.horsepower} HP
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">Factory Dyno</div>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">0 - 60 MPH</div>
                  <div className="text-xl font-extrabold font-heading text-neutral-900 mt-0.5">
                    {activeVehicle.specs.acceleration.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">Launch Control</div>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">TOP SPEED</div>
                  <div className="text-xl font-extrabold font-heading text-neutral-900 mt-0.5">
                    {activeVehicle.specs.topSpeed.split(' ')[0]} {activeVehicle.specs.topSpeed.split(' ')[1]}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">Track Verified</div>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase font-bold">DRIVETRAIN</div>
                  <div className="text-sm font-extrabold font-heading text-neutral-900 mt-1 truncate">
                    {activeVehicle.specs.drivetrain || 'All-Wheel Drive'}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">Torque Vectoring</div>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs">
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-mono">Engine Type</span>
                  <span className="font-bold text-neutral-900 text-right">{activeVehicle.engine}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-mono">Transmission</span>
                  <span className="font-bold text-neutral-900 text-right">{activeVehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-mono">Fuel System</span>
                  <span className="font-bold text-neutral-900 text-right">{activeVehicle.fuelType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-mono">Body Configuration</span>
                  <span className="font-bold text-neutral-900 text-right">{activeVehicle.bodyType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-mono">Exterior Finish</span>
                  <span className="font-bold text-neutral-900 text-right">{activeVehicle.color}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-mono">Odometer</span>
                  <span className="font-bold text-neutral-900 text-right">{activeVehicle.mileage.toLocaleString()} miles</span>
                </div>
              </div>
            </div>

            {/* Vehicle Narrative & Description */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <h3 className="text-base font-extrabold font-heading text-neutral-950 uppercase tracking-wide mb-3">
                VEHICLE OVERVIEW &amp; PROVENANCE
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                {activeVehicle.description}
              </p>

              <h4 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider mt-6 mb-3">
                INSTALLED FACTORY OPTIONS &amp; PACKAGES
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeVehicle.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-800 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 160-Point Inspection Assurance */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="text-base font-extrabold font-heading uppercase tracking-wide">
                  SHAHGLOBAL QUALITY &amp; AUTHENTICITY ASSURANCE
                </h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                This vehicle has been physically inspected by our factory-trained master technicians. We guarantee clean title verification, unrolled odometer integrity, and comprehensive diagnostic clearance.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                  <span className="text-emerald-400 font-bold">✓</span> Engine &amp; Compression: PASS
                </div>
                <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                  <span className="text-emerald-400 font-bold">✓</span> ECU &amp; Diagnostics: CLEAR
                </div>
                <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                  <span className="text-emerald-400 font-bold">✓</span> Brakes &amp; PCCB: 95%+
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Booking & Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 1. Schedule VIP Test Drive Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-[#e63946]/30 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e63946]/5 rounded-bl-full pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e63946]/10 text-[#e63946] text-xs font-mono font-bold uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                VIP SHOWROOM APPOINTMENT
              </div>

              <h3 className="text-xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight">
                BOOK TEST DRIVE OR PRIVATE VIEWING
              </h3>
              <p className="text-xs text-neutral-500 mt-1 mb-6 leading-relaxed">
                Experience this {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} with a dedicated brand specialist on our closed track or private highway route.
              </p>

              {submittedBooking ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-900"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-base font-bold font-heading">VIP Drive Request Received</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Our concierge team has reserved your preferred slot on {testDriveDate || 'your selected date'}. We will call you within 15 minutes to confirm.
                  </p>
                  <button
                    onClick={() => setSubmittedBooking(false)}
                    className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold font-mono uppercase cursor-pointer"
                  >
                    Modify Request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleInPageTestDriveSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-1">
                        PREFERRED DATE *
                      </label>
                      <input
                        type="date"
                        required
                        value={testDriveDate}
                        onChange={(e) => setTestDriveDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-1">
                        PREFERRED TIME
                      </label>
                      <select
                        value={testDriveTime}
                        onChange={(e) => setTestDriveTime(e.target.value)}
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#e63946] cursor-pointer"
                      >
                        <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                        <option value="11:30 AM">11:30 AM (Track Ready)</option>
                        <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                        <option value="04:30 PM">04:30 PM (Sunset Cruise)</option>
                        <option value="06:00 PM">06:00 PM (VIP Private Hour)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-1">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#e63946]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-1">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="marcus@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-1">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2831"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="w-full py-3.5 bg-[#e63946] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{submittingBooking ? 'RESERVING SLOT...' : 'CONFIRM VIP APPOINTMENT'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-[10px] text-neutral-400 text-center font-mono">
                    Valid driver's license required upon arrival. Zero obligation.
                  </div>
                </form>
              )}
            </div>

            {/* 2. Monthly Payment & Lease Estimator */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold font-heading text-neutral-950 uppercase tracking-wide flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  FINANCING &amp; PAYMENT CALCULATOR
                </h3>
                <span className="text-xs font-mono text-blue-600 font-bold">5.9% APR</span>
              </div>

              <div className="space-y-4">
                {/* Down Payment Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-neutral-500">Down Payment ({downPaymentPercent}%):</span>
                    <span className="font-bold text-neutral-900">${downPaymentAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Term Selector */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-1.5">
                    LOAN TERM (MONTHS)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[36, 48, 60, 72].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setLoanTermMonths(term)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          loanTermMonths === term
                            ? 'bg-neutral-950 text-white shadow-sm'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {term} MO
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result Display */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">EST. MONTHLY</span>
                    <div className="text-2xl font-extrabold font-heading text-neutral-950">
                      ${calculatedMonthly.toLocaleString()}<span className="text-xs font-normal text-neutral-400">/mo</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenFinancing(activeVehicle)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    APPLY NOW
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Direct Dealership Contact Desk */}
            <div className="bg-neutral-950 text-white rounded-2xl p-6 border border-neutral-800 shadow-md">
              <h3 className="text-sm font-extrabold font-heading uppercase tracking-wider mb-2">
                EXOTIC CAR SPECIALIST DIRECT LINE
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                Have specific questions about options, international export taxes, or wire transfers?
              </p>

              <div className="space-y-3">
                <a
                  href="tel:+18005553968"
                  className="flex items-center gap-3 p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 text-xs font-mono transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#e63946]" />
                  <div>
                    <div className="font-bold text-white">+1 (800) 555-EXOTIC</div>
                    <div className="text-[10px] text-neutral-500">Mon - Sat: 9am - 8pm PST</div>
                  </div>
                </a>

                <button
                  onClick={() => onOpenContact(activeVehicle)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-white/20 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>INQUIRE ABOUT THIS CAR</span>
                </button>
              </div>
            </div>

            {/* 4. Trade-In Quick Banner */}
            <div 
              onClick={() => onNavigate('sell-your-car')}
              className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-100 font-bold">
                    TRADE-IN OPPORTUNITY
                  </span>
                  <h4 className="text-base font-extrabold font-heading uppercase mt-0.5">
                    HAVE A LUXURY CAR TO TRADE?
                  </h4>
                  <p className="text-xs text-amber-100 mt-1">
                    Get an instant competitive cash offer or trade credit.
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>

        {/* 4. Related / Similar Vehicles Carousel */}
        {relatedVehicles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold text-[#e63946] uppercase tracking-widest">
                  CURATED RECOMMENDATIONS
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight mt-1">
                  SIMILAR EXOTIC VEHICLES
                </h3>
              </div>

              <button
                onClick={() => onNavigate(activeVehicle.category === 'New' ? 'new-cars' : 'used-cars')}
                className="text-xs font-mono font-bold text-neutral-600 hover:text-neutral-950 flex items-center gap-1 uppercase cursor-pointer"
              >
                <span>VIEW ALL</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVehicles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectVehicle(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-neutral-950 overflow-hidden">
                    <img
                      src={rel.images[0]}
                      alt={rel.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/60 backdrop-blur-md text-white">
                        {rel.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-[11px] font-mono text-neutral-400 uppercase">{rel.make}</div>
                    <h4 className="text-base font-extrabold font-heading text-neutral-900 group-hover:text-[#e63946] transition-colors truncate">
                      {rel.year} {rel.make} {rel.model}
                    </h4>
                    <div className="mt-3 flex items-baseline justify-between pt-3 border-t border-neutral-100">
                      <span className="text-lg font-extrabold font-heading text-neutral-950">
                        ${rel.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-mono text-[#e63946] font-bold group-hover:underline">
                        VIEW SPECS →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

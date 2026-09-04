import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Calculator, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  Fuel, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import type { Vehicle } from '../types';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: (vehicle: Vehicle) => void;
  onOpenFinancing: (vehicle: Vehicle) => void;
  onOpenContact: (vehicle: Vehicle) => void;
}

export default function VehicleDetailModal({
  vehicle,
  isOpen,
  onClose,
  onBookTestDrive,
  onOpenFinancing,
  onOpenContact,
}: VehicleDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !vehicle) return null;

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.images[0]];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.mileage);

  // Status color styles
  const availabilityStyles = {
    Available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    Reserved: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    Sold: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  }[vehicle.availability];

  return (
    <AnimatePresence>
      <div 
        id="vehicle-detail-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="vehicle-detail-card"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#0e1013] border border-neutral-800 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl text-white my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar / Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/60 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#e63946] uppercase bg-[#e63946]/10 border border-[#e63946]/30 px-2.5 py-1 rounded-md">
                {vehicle.category} VEHICLE
              </span>
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase border px-2.5 py-1 rounded-md ${availabilityStyles}`}>
                ● {vehicle.availability}
              </span>
            </div>

            <button
              id="close-vehicle-detail-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
            
            {/* Top Grid: Gallery & Main Title / Pricing */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Image Gallery */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                {/* Main Hero Image with arrows */}
                <div className="relative w-full h-[280px] sm:h-[360px] md:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 group shadow-lg">
                  <img
                    src={images[activeImageIndex]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Navigation Arrows if multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter Badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-neutral-300 border border-white/10">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails Row */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#e63946] scale-102 shadow-md shadow-red-900/30'
                            : 'border-neutral-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Key Vehicle Overview & Fast CTAs */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    <span>{vehicle.year}</span>
                    <span>•</span>
                    <span>{vehicle.bodyType}</span>
                    <span>•</span>
                    <span>{vehicle.condition}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase font-display tracking-tight text-white leading-tight">
                    {vehicle.make} {vehicle.model}
                  </h1>

                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
                      {formattedPrice}
                    </span>
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      MSRP / EXPORT READY
                    </span>
                  </div>
                </div>

                {/* Quick specs grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-[#e63946] flex-shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Power</span>
                      <span className="text-sm font-extrabold text-white font-heading">{vehicle.specs.horsepower} HP</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">0-60 MPH</span>
                      <span className="text-sm font-extrabold text-white font-heading">{vehicle.specs.acceleration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-cyan-400 flex-shrink-0">
                      <Fuel className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Mileage</span>
                      <span className="text-sm font-extrabold text-white font-heading">{formattedMileage} mi</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Location</span>
                      <span className="text-xs font-extrabold text-white font-heading truncate">{vehicle.location.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col space-y-2.5 pt-2">
                  <button
                    id="book-test-drive-detail-btn"
                    onClick={() => onBookTestDrive(vehicle)}
                    className="w-full h-12 bg-[#e63946] hover:bg-[#d62839] text-white font-extrabold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all font-heading cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>BOOK PRIVATE TEST DRIVE</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Call Now */}
                    <a
                      href="tel:+18005550199"
                      className="h-11 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all font-heading"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>CALL CONCIERGE</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/14158902104?text=${encodeURIComponent(`Hello Shahglobal, I am inquiring about the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${formattedPrice}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all font-heading"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WHATSAPP</span>
                    </a>
                  </div>

                  {/* Financing Calculator Shortcut */}
                  <button
                    onClick={() => onOpenFinancing(vehicle)}
                    className="w-full h-11 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all font-heading cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <span>ESTIMATE MONTHLY EMI FINANCING</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Middle Section: Complete Specifications Table */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/80">
              <h3 className="text-lg sm:text-xl font-extrabold uppercase text-white font-display tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e63946]" />
                <span>COMPLETE TECHNICAL SPECIFICATIONS</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Engine', value: vehicle.engine },
                  { label: 'Transmission', value: vehicle.transmission },
                  { label: 'Fuel Type', value: vehicle.fuelType },
                  { label: 'Horsepower', value: `${vehicle.specs.horsepower} HP` },
                  { label: 'Top Speed', value: vehicle.specs.topSpeed },
                  { label: 'Acceleration', value: vehicle.specs.acceleration },
                  { label: 'Torque', value: vehicle.specs.torque || 'N/A' },
                  { label: 'Drivetrain', value: vehicle.specs.drivetrain || 'All-Wheel Drive' },
                  { label: 'Exterior Finish', value: vehicle.color },
                  { label: 'Body Style', value: vehicle.bodyType },
                  { label: 'VIN Number', value: vehicle.specs.vin },
                  { label: 'Location Hub', value: vehicle.location },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">{item.label}</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white mt-1 truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/80">
              <h3 className="text-lg sm:text-xl font-extrabold uppercase text-white font-display tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>KEY EQUIPMENT &amp; FACTORY OPTIONS</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {vehicle.features.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs font-semibold text-neutral-200"
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Description */}
            <div className="space-y-3 pt-4 border-t border-neutral-800/80 pb-4">
              <h3 className="text-lg font-extrabold uppercase text-white font-display tracking-tight">
                VEHICLE OVERVIEW &amp; PROVENANCE
              </h3>
              <p className="text-xs sm:text-sm font-medium text-neutral-400 leading-relaxed max-w-4xl">
                {vehicle.description}
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

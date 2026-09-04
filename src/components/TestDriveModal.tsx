import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Zap, 
  ChevronsRight, 
  ShieldCheck
} from 'lucide-react';
import { useDealership } from '../context/DealershipContext';
import type { Vehicle } from '../types';

interface TestDriveModalProps {
  vehicle?: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TestDriveModal({ vehicle, isOpen, onClose }: TestDriveModalProps) {
  const { vehicles, addTestDrive } = useDealership();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicle ? vehicle.id : (vehicles[0]?.id || ''));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-09-08');
  const [preferredTime, setPreferredTime] = useState('14:00 PM');
  const [hubLocation, setHubLocation] = useState('Silicon Valley Showroom');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync selected vehicle if prop changes
  useEffect(() => {
    if (vehicle) {
      setSelectedVehicleId(vehicle.id);
    } else if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicle, vehicles, selectedVehicleId]);

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentVehicle) return;

    addTestDrive({
      vehicleId: currentVehicle.id,
      vehicleName: `${currentVehicle.make} ${currentVehicle.model}`,
      vehicleImage: currentVehicle.images[0],
      name,
      phone,
      email,
      preferredDate,
      preferredTime,
      hubLocation,
      notes,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="test-drive-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="test-drive-modal-card"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#0f1115] border border-neutral-800 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl text-white my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center text-[#e63946]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight">
                  BOOK VIP TEST DRIVE EXPERIENCE
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Complimentary track concierge and professional driving instructor
                </p>
              </div>
            </div>

            <button
              id="close-test-drive-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            {isSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center justify-center py-14 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center text-[#e63946] mb-2 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-2xl font-bold font-heading">Test Drive Scheduled</h4>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-md leading-relaxed">
                  Your VIP reservation for the <span className="text-white font-bold">{currentVehicle?.make} {currentVehicle?.model}</span> on <span className="text-white font-bold">{preferredDate} at {preferredTime}</span> has been confirmed. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Vehicle Selector Card */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase font-mono block">
                    1. SELECT VEHICLE MODEL
                  </label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-hidden focus:border-[#e63946]"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model} — {v.specs.horsepower} HP ({v.category})
                      </option>
                    ))}
                  </select>

                  {/* Selected Vehicle Preview Strip */}
                  {currentVehicle && (
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0">
                        <img 
                          src={currentVehicle.images[0]} 
                          alt={currentVehicle.model} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-[#e63946] uppercase font-bold block">
                          {currentVehicle.category} • {currentVehicle.condition}
                        </span>
                        <h4 className="text-xs font-extrabold text-white font-heading truncate">
                          {currentVehicle.make} {currentVehicle.model}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono mt-0.5">
                          <span className="flex items-center gap-1 text-white">
                            <Zap className="w-3 h-3 text-[#e63946]" /> {currentVehicle.specs.horsepower} HP
                          </span>
                          <span>0-60: {currentVehicle.specs.acceleration}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Driver Details */}
                <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase font-mono block">
                    2. DRIVER CREDENTIALS
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 block mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Charles Leclerc"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 block mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="+1 (415) 555-0199"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 block mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="charles@scuderia.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date, Time, & Location */}
                <div className="space-y-2 pt-3 border-t border-neutral-800/80">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase font-mono block">
                    3. APPOINTMENT TIME &amp; HUB
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 block mb-1">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 block mb-1">Time Slot *</label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      >
                        <option>10:00 AM (Morning Session)</option>
                        <option>11:30 AM (Midday Slot)</option>
                        <option>14:00 PM (Afternoon Track)</option>
                        <option>16:00 PM (Sunset Cruise)</option>
                        <option>18:00 PM (VIP Evening)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 block mb-1">Showroom Location *</label>
                      <select
                        value={hubLocation}
                        onChange={(e) => setHubLocation(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      >
                        <option>Silicon Valley Showroom</option>
                        <option>Geneva Track Facility</option>
                        <option>Munich High-Speed Center</option>
                        <option>Tokyo Studio Experience</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-bold text-neutral-500 block">Specific Driving Goals or Preferences</label>
                  <input
                    type="text"
                    placeholder="e.g. Test launch control, bring co-driver, compare vs 911 GT3..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-[#e63946] hover:bg-[#d62839] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 font-heading text-xs uppercase tracking-wider shadow-lg shadow-red-900/30 transition-all cursor-pointer"
                >
                  <span>CONFIRM VIP TEST DRIVE RESERVATION</span>
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

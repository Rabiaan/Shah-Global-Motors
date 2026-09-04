import { useState, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  DollarSign, 
  Car, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { useDealership } from '../context/DealershipContext';
import type { VehicleCondition } from '../types';
import heroCarImage from '../assets/images/hero_sports_car_1788175114586.jpg';
import porscheImage from '../assets/images/porsche_side_neon_1788184894615.jpg';
import amgImage from '../assets/images/amg_gt_desert_1788184924301.jpg';

interface SellCarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SellCarModal({ isOpen, onClose }: SellCarModalProps) {
  const { addSellRequest } = useDealership();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2023);
  const [mileage, setMileage] = useState<number>(5000);
  const [expectedPrice, setExpectedPrice] = useState<number>(150000);
  const [condition, setCondition] = useState<VehicleCondition>('Excellent');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([heroCarImage]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as File[];
      newFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addPresetImage = (img: string) => {
    if (!images.includes(img)) {
      setImages((prev) => [...prev, img]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addSellRequest({
      name,
      phone,
      whatsapp: whatsapp || phone,
      make,
      model,
      year: Number(year),
      mileage: Number(mileage),
      expectedPrice: Number(expectedPrice),
      condition,
      notes,
      images: images.length > 0 ? images : [heroCarImage],
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      // Reset form
      setName('');
      setPhone('');
      setWhatsapp('');
      setMake('');
      setModel('');
      setNotes('');
    }, 2400);
  };

  return (
    <AnimatePresence>
      <div
        id="sell-car-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="sell-car-modal-card"
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
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight">
                  SELL OR CONSIGN YOUR CAR
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Guaranteed Instant Cash Offer or Consignment Concierge
                </p>
              </div>
            </div>

            <button
              id="close-sell-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            {isSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center justify-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-2xl font-bold font-heading">Valuation Request Received</h4>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-md leading-relaxed">
                  Our senior procurement directors will review your <span className="text-white font-bold">{year} {make} {model}</span> and contact you via WhatsApp / Phone with an official valuation offer.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Contact Details */}
                <div className="space-y-3">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#e63946] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>1. YOUR CONTACT DETAILS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Christian Horner"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Phone Number *</label>
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
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">WhatsApp (Optional)</label>
                      <div className="relative">
                        <MessageCircle className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          placeholder="+14155550199"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car Details */}
                <div className="space-y-3 pt-3 border-t border-neutral-800/80">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#e63946] flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5" />
                    <span>2. VEHICLE SPECIFICATIONS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Make / Brand *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Porsche, Ferrari, McLaren"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Model &amp; Trim *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 911 GT3 RS, 720S"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Model Year *</label>
                      <input
                        type="number"
                        min="1980"
                        max="2027"
                        required
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Mileage (Miles) *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={mileage}
                        onChange={(e) => setMileage(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Expected Price ($ USD) *</label>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        required
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold text-amber-400 focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Vehicle Condition *</label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as VehicleCondition)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      >
                        <option value="Brand New">Brand New (Delivery Miles)</option>
                        <option value="Collector Grade">Collector Grade (Flawless)</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                        <option value="Good">Good</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Photo Uploads */}
                <div className="space-y-3 pt-3 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e63946] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>3. UPLOAD VEHICLE IMAGES</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {images.length} Image(s) Attached
                    </span>
                  </div>

                  {/* Image previews row */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-16 rounded-xl overflow-hidden border border-neutral-700 flex-shrink-0 group">
                        <img src={img} alt="Uploaded car" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}

                    {/* File upload input card */}
                    <label className="w-24 h-16 rounded-xl border border-dashed border-neutral-700 hover:border-[#e63946] flex flex-col items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors flex-shrink-0 bg-neutral-900/40">
                      <Upload className="w-4 h-4 mb-0.5 text-neutral-400" />
                      <span className="text-[9px] font-bold">ADD PHOTO</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preset quick picks */}
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    <span>Quick presets:</span>
                    <button
                      type="button"
                      onClick={() => addPresetImage(porscheImage)}
                      className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
                    >
                      + Porsche Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => addPresetImage(amgImage)}
                      className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
                    >
                      + AMG Photo
                    </button>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5 pt-3 border-t border-neutral-800/80">
                  <label className="text-[11px] font-bold text-neutral-400 block">
                    Modifications, Service History or Notable Factory Options
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Full PPF paint protection, fresh major service done at official dealer, carbon interior pack..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#e63946] hover:bg-[#d62839] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 font-heading text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <span>SUBMIT FOR DIRECT CASH VALUATION</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

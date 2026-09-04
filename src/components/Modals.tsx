import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ChevronsRight, Shield, Sparkles, Calendar, User, Mail, MapPin } from 'lucide-react';
import heroCarImage from '../assets/images/hero_sports_car_1788175114586.jpg';

interface ModalsProps {
  testDriveOpen: boolean;
  onCloseTestDrive: () => void;
  stayWithUsOpen: boolean;
  onCloseStayWithUs: () => void;
}

export default function Modals({
  testDriveOpen,
  onCloseTestDrive,
  stayWithUsOpen,
  onCloseStayWithUs,
}: ModalsProps) {
  // Test drive form state
  const [selectedColor, setSelectedColor] = useState<'silver' | 'onyx' | 'crimson'>('silver');
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);
  const [staySubmitted, setStaySubmitted] = useState(false);

  const colors = [
    { id: 'silver', name: 'Obsidian Silver', hex: '#d1d5db', bgClass: 'bg-neutral-300' },
    { id: 'onyx', name: 'Midnight Onyx', hex: '#171717', bgClass: 'bg-neutral-900' },
    { id: 'crimson', name: 'Crimson Rosso', hex: '#e63946', bgClass: 'bg-[#e63946]' },
  ] as const;

  const handleTestDriveSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTestDriveSubmitted(true);
    setTimeout(() => {
      setTestDriveSubmitted(false);
      onCloseTestDrive();
    }, 2200);
  };

  const handleStaySubmit = (e: FormEvent) => {
    e.preventDefault();
    setStaySubmitted(true);
    setTimeout(() => {
      setStaySubmitted(false);
      onCloseStayWithUs();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {/* Test Drive / Get Started Modal */}
      {testDriveOpen && (
        <div 
          id="test-drive-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onCloseTestDrive}
        >
          <motion.div
            id="test-drive-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-[#121316] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-white"
          >
            {/* Close button */}
            <button
              id="close-test-drive-btn"
              onClick={onCloseTestDrive}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header banner */}
            <div className="relative h-44 overflow-hidden bg-neutral-950">
              <img
                src={heroCarImage}
                alt="Shahglobal performance prototype"
                className="w-full h-full object-cover object-center opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="text-[10px] font-bold tracking-widest text-[#e63946] uppercase bg-black/60 px-2 py-0.5 rounded">
                  EXPERIENCE SHAHGLOBAL
                </span>
                <h3 className="text-2xl font-bold font-heading tracking-tight mt-1">
                  Book Your VIP Test Drive
                </h3>
              </div>
            </div>

            {testDriveSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center text-[#e63946] mb-4 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold font-heading">Reservation Confirmed</h4>
                <p className="text-neutral-400 text-sm mt-2 max-w-md">
                  Your private 640 HP track concierge will reach out within 15 minutes to finalize your schedule.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTestDriveSubmit} className="p-6 space-y-4">
                {/* Color selection */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                    Choose Prototype Finish
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {colors.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          selectedColor === c.id
                            ? 'border-[#e63946] bg-[#e63946]/10 text-white'
                            : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${c.bgClass} border border-white/20`} />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Mercer"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="date"
                        required
                        defaultValue="2026-09-15"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e63946]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">Location Hub</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <select className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#e63946]">
                        <option>Silicon Valley Showroom</option>
                        <option>Geneva Track Facility</option>
                        <option>Tokyo Studio Experience</option>
                        <option>Munich High-Speed Center</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#e63946] hover:bg-[#d62839] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#e63946]/20 transition-all font-heading"
                >
                  <span>CONFIRM TEST DRIVE</span>
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Stay With Us / VIP Community Modal */}
      {stayWithUsOpen && (
        <div 
          id="stay-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onCloseStayWithUs}
        >
          <motion.div
            id="stay-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#121316] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white text-center"
          >
            <button
              id="close-stay-btn"
              onClick={onCloseStayWithUs}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-[#e63946] flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            <h3 className="text-2xl font-bold font-heading">Join Shahglobal Club</h3>
            <p className="text-neutral-400 text-sm mt-1.5 mb-6">
              Get exclusive early access to performance telemetry, private track days, and delivery allocation drops.
            </p>

            {staySubmitted ? (
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-[#e63946] mx-auto mb-2" />
                <p className="text-sm font-semibold">Welcome to the Inner Circle.</p>
                <p className="text-xs text-neutral-400 mt-1">Check your inbox for your founding member badge.</p>
              </div>
            ) : (
              <form onSubmit={handleStaySubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your VIP email"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#e63946]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-heading text-sm"
                >
                  <span>STAY CONNECTED</span>
                  <ChevronsRight className="w-4 h-4 text-black" />
                </button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero spam. Strict member exclusivity.</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

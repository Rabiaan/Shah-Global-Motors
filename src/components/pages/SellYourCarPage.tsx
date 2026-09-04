import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Truck } from 'lucide-react';
import { useDealership } from '../../context/DealershipContext';

interface SellYourCarPageProps {
  onNavigate: (page: 'new-cars' | 'used-cars' | 'car-details' | 'sell-your-car' | 'services' | 'about-us' | 'contact-us') => void;
}

const STAGES = [
  { label: 'Your Vehicle' },
  { label: 'Condition' },
  { label: 'Your Details' },
] as const;

export default function SellYourCarPage({ onNavigate }: SellYourCarPageProps) {
  const { addSellRequest } = useDealership();

  const [stage, setStage] = useState(0);

  // Vehicle
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2022');
  const [mileage, setMileage] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');

  // Condition
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair'>('Excellent');
  const [sellType, setSellType] = useState<'Outright Cash' | 'Trade-In Credit' | 'VIP Consignment'>('Outright Cash');

  // Contact
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const numericMileage = parseInt(mileage) || 5000;
  const numericYear = parseInt(year) || 2022;
  const estimatedBaseValue = Math.max(50000, 180000 - ((2025 - numericYear) * 12000) - (numericMileage * 2));
  const estimatedRangeMin = Math.round(estimatedBaseValue * 0.95);
  const estimatedRangeMax = Math.round(estimatedBaseValue * 1.08);

  const vehicleFilled = make.trim() !== '' && model.trim() !== '' && mileage.trim() !== '';
  const contactFilled = name.trim() !== '' && email.trim() !== '' && phone.trim() !== '';

  const nextEnabled = stage === 0 ? vehicleFilled : stage === 1 ? true : contactFilled;

  const handleNext = () => {
    if (stage < 2) setStage((s) => s + 1);
  };
  const handleBack = () => setStage((s) => Math.max(0, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleFilled || !contactFilled) return;
    setSubmitting(true);
    try {
      await addSellRequest({
        make,
        model,
        year: numericYear,
        mileage: numericMileage,
        expectedPrice: expectedPrice ? parseInt(expectedPrice) : estimatedRangeMin,
        condition,
        name,
        phone,
        whatsapp: phone,
        email,
        notes: `Preference: ${sellType}. ${notes}`.trim(),
        images: [],
      });
      setSubmitted(true);
      window.scrollTo({ top: 60, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F4F2]">
      {/* ============ 01 / HERO — YOUR CAR. ITS VALUE. ============ */}
      <section className="relative bg-[#0C0D0F] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1800&q=80"
            alt="Your car, its value"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D0F] via-[#0C0D0F]/30 to-[#0C0D0F]/5" />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-8 pt-6 pb-0 min-h-[86vh] flex flex-col justify-end">
          <div className="flex items-center justify-between border border-white/15 rounded-full px-5 py-3 text-[11px] font-mono tracking-[0.25em] uppercase text-white/60 mb-8">
            <span className="text-[#E63946] font-bold">01 — Valuation</span>
            <span className="hidden sm:block">Acquisitions Desk</span>
            <span className="font-bold text-white/80">BINDING OFFERS</span>
          </div>

          <h1 className="font-display font-extrabold uppercase leading-[0.88] tracking-tighter" style={{ fontSize: 'clamp(3.5rem, 13vw, 12rem)' }}>
            Your car.<br />
            <span className="text-[#E63946]">Its value.</span>
          </h1>

          {/* CTA partly overlapping the image */}
          <div className="relative translate-y-14 sm:translate-y-20 max-w-2xl">
            <div className="bg-[#F4F4F2] text-[#0C0D0F] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500 mb-2">Institutional cash buyout or consignment</div>
                  <div className="text-2xl sm:text-3xl font-display font-bold uppercase leading-tight">How much is<br />your car worth?</div>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: document.getElementById('val-form')?.offsetTop || 900, behavior: 'smooth' })}
                  className="group shrink-0 bg-[#E63946] hover:bg-[#C9182B] text-white px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center gap-2"
                >
                  Start Valuation
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 / STAGED ASSESSMENT ============ */}
      <section id="val-form" className="relative bg-[#F4F4F2] pt-36 sm:pt-44 pb-24">
        {/* micro trust strip */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D8D8D2] border border-[#D8D8D2]">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, t: 'Manual appraisal, no algorithms', s: 'Every offer signed by a specialist' },
              { icon: <Truck className="w-5 h-5" />, t: 'Enclosed pickup anywhere', s: 'Complimentary insured transport' },
              { icon: <Check className="w-5 h-5" />, t: 'Same-day wire', s: 'Title & DMV handled for you' },
            ].map((b, i) => (
              <div key={i} className="bg-[#F4F4F2] px-6 py-6 flex items-start gap-4">
                <span className="text-[#E63946] mt-0.5">{b.icon}</span>
                <div>
                  <div className="font-heading font-bold uppercase text-sm text-[#0C0D0F] leading-tight">{b.t}</div>
                  <div className="text-xs text-neutral-500 mt-1 font-body">{b.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-[#0C0D0F]/15 bg-white p-10 sm:p-14 max-w-3xl"
            >
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500 mb-4">04 — Valuation</div>
              <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-tighter text-[#0C0D0F] text-3xl sm:text-5xl">
                Request received.
              </h2>
              <p className="mt-4 text-sm text-neutral-600 font-body max-w-lg leading-relaxed">
                Our acquisitions director is reviewing your <span className="font-bold text-[#0C0D0F]">{numericYear} {make} {model}</span> and will return a binding cash offer within 2 hours.
              </p>

              <div className="mt-8 border-t border-[#0C0D0F]/10 pt-6 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">Preliminary estimate</div>
                  <div className="font-display font-bold text-3xl text-[#C9182B]">
                    ${estimatedRangeMin.toLocaleString()} – ${estimatedRangeMax.toLocaleString()}
                  </div>
                  <div className="text-xs font-mono text-neutral-400 mt-1">Ref SHAH-APP-{Math.floor(100000 + Math.random() * 900000)}</div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setSubmitted(false); setStage(0); }}
                    className="px-5 py-3 bg-[#0C0D0F] hover:bg-[#201F22] text-white text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer"
                  >
                    Another Vehicle
                  </button>
                  <button
                    onClick={() => onNavigate('used-cars')}
                    className="px-5 py-3 border border-[#0C0D0F]/20 hover:border-[#0C0D0F] text-[#0C0D0F] text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer"
                  >
                    Browse Trade-Ins
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left: staged form */}
              <div className="lg:col-span-8">
                {/* stage header + progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-5">
                    {STAGES.map((s, i) => (
                      <button
                        type="button"
                        key={s.label}
                        onClick={() => i <= stage && setStage(i)}
                        className={`flex items-center gap-2 cursor-pointer ${i > stage ? 'opacity-40' : ''}`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                          i <= stage ? 'bg-[#0C0D0F] text-white' : 'bg-[#E0E0D9] text-neutral-400'
                        }`}>
                          {i + 1}
                        </span>
                        <span className="hidden sm:block text-[11px] font-mono tracking-[0.15em] uppercase text-[#0C0D0F]">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="h-[2px] bg-[#DEDED7] relative">
                    <div
                      className="absolute left-0 top-0 h-full bg-[#E63946] transition-all duration-500"
                      style={{ width: `${(stage / 2) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    {/* STAGE 0 — VEHICLE */}
                    {stage === 0 && (
                      <motion.div
                        key="s0"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.35 }}
                        className="border border-[#0C0D0F]/15 bg-white p-6 sm:p-10"
                      >
                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="font-display font-extrabold uppercase tracking-tighter text-3xl text-[#0C0D0F]">The machine</div>
                            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500 mt-1">01 — Your Vehicle</div>
                          </div>
                          <div className="font-mono text-4xl text-[#E63946] font-bold">01</div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field label="Make / Brand *" hint="Porsche, Ferrari, McLaren…">
                            <input type="text" required value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Porsche" className={inputCls} />
                          </Field>
                          <Field label="Model & Trim *" hint="GT3 RS, Roma, M4 Comp">
                            <input type="text" required value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. 911 GT3 RS" className={inputCls} />
                          </Field>
                          <Field label="Year *">
                            <select value={year} onChange={(e) => setYear(e.target.value)} className={inputCls + " cursor-pointer"}>
                              {Array.from({ length: 25 }, (_, i) => 2025 - i).map((y) => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Mileage (approx) *">
                            <input type="number" required value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="e.g. 4500" className={inputCls} />
                          </Field>
                          <Field label="Asking price (optional)">
                            <input type="number" value={expectedPrice} onChange={(e) => setExpectedPrice(e.target.value)} placeholder="Desired value" className={inputCls} />
                          </Field>
                          <Field label="Preferred path">
                            <select value={sellType} onChange={(e) => setSellType(e.target.value as any)} className={inputCls + " cursor-pointer"}>
                              <option>Outright Cash</option>
                              <option>Trade-In Credit</option>
                              <option>VIP Consignment</option>
                            </select>
                          </Field>
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 1 — CONDITION */}
                    {stage === 1 && (
                      <motion.div
                        key="s1"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.35 }}
                        className="border border-[#0C0D0F]/15 bg-white p-6 sm:p-10"
                      >
                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="font-display font-extrabold uppercase tracking-tighter text-3xl text-[#0C0D0F]">Honest condition</div>
                            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500 mt-1">02 — Assessment</div>
                          </div>
                          <div className="font-mono text-4xl text-[#E63946] font-bold">02</div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D8D8D2] border border-[#D8D8D2]">
                          {(['Excellent', 'Good', 'Fair'] as const).map((c) => (
                            <button
                              type="button"
                              key={c}
                              onClick={() => setCondition(c)}
                              className={`p-6 text-left transition-colors cursor-pointer ${
                                condition === c ? 'bg-[#0C0D0F] text-white' : 'bg-white text-[#0C0D0F] hover:bg-neutral-50'
                              }`}
                            >
                              <div className="font-heading font-bold uppercase tracking-tight text-lg">{c}</div>
                              <div className={`text-[11px] mt-2 font-body leading-relaxed ${condition === c ? 'text-white/60' : 'text-neutral-500'}`}>
                                {c === 'Excellent' && 'Flawless paint & interior, full service history.'}
                                {c === 'Good' && 'Minor wear, well maintained, complete records.'}
                                {c === 'Fair' && 'Needs minor servicing or detailing.'}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="mt-6">
                          <label className="block text-[11px] font-mono uppercase font-bold text-neutral-500 mb-2">Notes, options or paperwork</label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Mention PPF, carbon packages, loan payoffs, race history…"
                            className={inputCls}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STAGE 2 — CONTACT */}
                    {stage === 2 && (
                      <motion.div
                        key="s2"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.35 }}
                        className="border border-[#0C0D0F]/15 bg-white p-6 sm:p-10"
                      >
                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="font-display font-extrabold uppercase tracking-tighter text-3xl text-[#0C0D0F]">Where to reach you</div>
                            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500 mt-1">03 — Your Details</div>
                          </div>
                          <div className="font-mono text-4xl text-[#E63946] font-bold">03</div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <Field label="Full name *"><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} /></Field>
                          <Field label="Email *"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></Field>
                          <Field label="Phone *"><input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls} /></Field>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* nav + submit */}
                <div className="mt-6 flex items-center justify-between gap-4">
                  {stage > 0 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-3 border border-[#0C0D0F]/20 hover:border-[#0C0D0F] text-[#0C0D0F] text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  ) : <span />}
                  {stage < 2 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!nextEnabled}
                      className="group flex items-center gap-2 px-6 py-3 bg-[#0C0D0F] hover:bg-[#201F22] text-white text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting || !nextEnabled}
                      className="group flex items-center gap-2 px-7 py-4 bg-[#E63946] hover:bg-[#C9182B] text-white text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Generating…' : 'Request Binding Valuation'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
                <p className="mt-4 text-[11px] font-mono text-neutral-400">Zero obligation · No listing fees · Private client discretion.</p>
              </div>

              {/* Right: live valuation meter */}
              <div className="lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="sticky top-6 bg-[#0C0D0F] text-white p-8"
                >
                  <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#E63946] mb-2">Live estimate</div>
                  <div className="font-display font-extrabold uppercase leading-[0.9] tracking-tighter text-3xl">
                    {make || 'Your car'} {model || ''}
                  </div>
                  <div className="my-6 border-y border-white/10 py-6">
                    <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/40">Estimated range</div>
                    <div className="font-display font-bold text-2xl sm:text-3xl text-[#E63946] mt-1">
                      ${estimatedRangeMin.toLocaleString()}
                      <span className="text-white/30 mx-1">–</span>
                      ${estimatedRangeMax.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-white/50 leading-loose">
                    <div className="flex justify-between"><span>Year</span><span className="text-white/80">{numericYear}</span></div>
                    <div className="flex justify-between"><span>Mileage</span><span className="text-white/80">{numericMileage.toLocaleString()} mi</span></div>
                    <div className="flex justify-between"><span>Condition</span><span className="text-white/80">{condition}</span></div>
                  </div>
                </motion.div>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 bg-[#F4F4F2] border border-[#D8D8D2] focus:border-[#E63946] outline-none text-sm font-body text-[#0C0D0F] placeholder:text-neutral-400 transition-colors";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-mono uppercase font-bold text-neutral-600 mb-1.5">
        {label} <span className="text-[#E63946]"></span>
      </span>
      {children}
      {hint && <span className="block text-[10px] font-mono text-neutral-400 mt-1">{hint}</span>}
    </label>
  );
}

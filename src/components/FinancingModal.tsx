import { useState, useId, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calculator, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Percent, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  Send,
  CreditCard
} from 'lucide-react';
import { useDealership } from '../context/DealershipContext';
import type { Vehicle, BankPartner } from '../types';

interface FinancingModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FinancingModal({ vehicle, isOpen, onClose }: FinancingModalProps) {
  const { addEnquiry } = useDealership();

  // Calculator State
  const [vehiclePrice, setVehiclePrice] = useState<number>(vehicle ? vehicle.price : 180000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(48);
  const [interestRate, setInterestRate] = useState<number>(4.9);

  // Enquiry Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [employmentType, setEmploymentType] = useState('Employed / Corporate');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Math for loan
  const downPaymentAmount = (vehiclePrice * downPaymentPercent) / 100;
  const loanPrincipal = Math.max(0, vehiclePrice - downPaymentAmount);
  
  // Standard Amortization formula: M = P * [ r(1+r)^n ] / [ (1+r)^n – 1]
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment =
    monthlyInterestRate > 0 && loanTenureMonths > 0 && loanPrincipal > 0
      ? (loanPrincipal *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureMonths))) /
        (Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1)
      : loanPrincipal / (loanTenureMonths || 1);

  const totalPayment = monthlyPayment * loanTenureMonths;
  const totalInterest = Math.max(0, totalPayment - loanPrincipal);

  const bankPartners: BankPartner[] = [
    {
      id: 'jpm',
      name: 'J.P. Morgan Auto Premier',
      logo: 'JPM',
      minRate: '3.99% APR',
      maxTenure: 'Up to 84 Mos',
      badge: 'Preferred VIP Partner',
    },
    {
      id: 'santander',
      name: 'Santander Consumer USA',
      logo: 'SC',
      minRate: '4.49% APR',
      maxTenure: 'Up to 72 Mos',
      badge: 'Fast Instant Approval',
    },
    {
      id: 'bnp',
      name: 'BNP Paribas Private Banking',
      logo: 'BNP',
      minRate: '3.75% APR',
      maxTenure: 'Up to 96 Mos',
      badge: 'EU & Export Special',
    },
    {
      id: 'enbd',
      name: 'Emirates NBD Auto Finance',
      logo: 'ENBD',
      minRate: '3.50% APR',
      maxTenure: 'Up to 60 Mos',
      badge: 'Middle East Sharia-Compliant',
    },
  ];

  const requiredDocuments = [
    'Valid Passport or National Government ID',
    '3 Most Recent Months of Bank Statements',
    'Proof of Income (W2 / Tax Return / Corporate Audited P&L)',
    'Valid Driver\'s License (International or State)',
    'Proof of Residence / Utility Statement (< 60 days old)'
  ];

  const handleSubmitEnquiry = (e: FormEvent) => {
    e.preventDefault();
    addEnquiry({
      name: applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      preferredContact: 'phone',
      subject: `Financing Application: $${monthlyPayment.toFixed(0)}/mo for ${vehicle ? `${vehicle.make} ${vehicle.model}` : 'Selected Vehicle'}`,
      message: `Financing pre-approval request. Vehicle price: $${vehiclePrice.toLocaleString()}, Down payment: ${downPaymentPercent}% ($${downPaymentAmount.toLocaleString()}), Loan tenure: ${loanTenureMonths} months, Est interest: ${interestRate}%. Employment: ${employmentType}.`,
      vehicleId: vehicle?.id,
      vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="financing-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          id="financing-modal-card"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-[#0f1115] border border-neutral-800 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl text-white my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight">
                  VIP FINANCING &amp; LEASING CALCULATOR
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Bespoke global lending terms with zero prepayment penalties
                </p>
              </div>
            </div>

            <button
              id="close-financing-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
            
            {/* Top Grid: Interactive Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Sliders & Controls */}
              <div className="lg:col-span-7 flex flex-col space-y-5 bg-neutral-900/60 p-6 rounded-3xl border border-neutral-800">
                
                {/* Vehicle Price */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 font-mono">
                    <span>VEHICLE ASSET VALUE</span>
                    <span className="text-white font-heading font-extrabold text-sm">
                      ${vehiclePrice.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="450000"
                    step="5000"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="w-full accent-[#e63946] cursor-pointer"
                  />
                </div>

                {/* Down Payment % */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 font-mono">
                    <span>DOWN PAYMENT: {downPaymentPercent}%</span>
                    <span className="text-emerald-400 font-heading font-extrabold text-sm">
                      ${downPaymentAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                    <span>10% Min</span>
                    <span>30% Standard</span>
                    <span>60% Max</span>
                  </div>
                </div>

                {/* Loan Term in Months */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 font-mono">
                    <span>LOAN TENURE (MONTHS)</span>
                    <span className="text-amber-400 font-heading font-extrabold text-sm">
                      {loanTenureMonths} Months ({ (loanTenureMonths / 12).toFixed(1) } Yrs)
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[12, 24, 36, 48, 60, 72, 84].slice(0, 5).map((mos) => (
                      <button
                        type="button"
                        key={mos}
                        onClick={() => setLoanTenureMonths(mos)}
                        className={`py-2 rounded-xl text-xs font-extrabold uppercase font-heading transition-all cursor-pointer ${
                          loanTenureMonths === mos
                            ? 'bg-[#e63946] text-white shadow-md shadow-red-900/40'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400'
                        }`}
                      >
                        {mos}M
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300 font-mono">
                    <span>ESTIMATED INTEREST RATE (APR)</span>
                    <span className="text-cyan-400 font-heading font-extrabold text-sm">
                      {interestRate.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="10.0"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

              </div>

              {/* Right Column: Calculated Monthly EMI Display */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-black p-6 rounded-3xl border border-neutral-800 shadow-xl">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#e63946] uppercase">
                    ESTIMATED MONTHLY INSTALLMENT
                  </span>
                  
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight">
                      ${Math.round(monthlyPayment).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 uppercase font-mono">
                      / Month
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    *Excludes local road taxes &amp; bespoke delivery duties.
                  </p>
                </div>

                {/* Visual Ratio Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#e63946]" /> Principal
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Total Interest
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
                    <div 
                      className="h-full bg-[#e63946]" 
                      style={{ width: `${Math.round((loanPrincipal / (totalPayment || 1)) * 100)}%` }} 
                    />
                    <div 
                      className="h-full bg-amber-400" 
                      style={{ width: `${Math.round((totalInterest / (totalPayment || 1)) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Summary Figures */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Financed Amount</span>
                    <span className="text-sm font-extrabold text-white font-heading">${Math.round(loanPrincipal).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Total Interest</span>
                    <span className="text-sm font-extrabold text-amber-400 font-heading">${Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Total Financed Cost</span>
                    <span className="text-sm font-extrabold text-white font-heading">${Math.round(totalPayment).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Term Duration</span>
                    <span className="text-sm font-extrabold text-cyan-400 font-heading">{loanTenureMonths} Mos</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bank Partners Showcase */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/80">
              <h4 className="text-base font-bold uppercase text-white font-display tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#e63946]" />
                <span>OFFICIAL INSTITUTIONAL LENDING PARTNERS</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {bankPartners.map((bank) => (
                  <div 
                    key={bank.id}
                    className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-200 font-black text-xs flex items-center justify-center font-mono">
                        {bank.logo}
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {bank.badge}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-white font-heading truncate">{bank.name}</h5>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1 font-mono">
                        <span>{bank.minRate}</span>
                        <span>{bank.maxTenure}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements & Document Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800/80">
              
              {/* Requirements */}
              <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                <h5 className="text-xs font-mono font-bold uppercase text-[#e63946] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PRE-QUALIFICATION CRITERIA</span>
                </h5>
                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Minimum 680+ Credit Score (or international tier-1 equivalent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Minimum 10% cash down payment or trade-in asset equity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>21+ Years of Age with valid driving certification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Zero prepayment or early settlement exit penalties</span>
                  </li>
                </ul>
              </div>

              {/* Required Documents */}
              <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                <h5 className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>REQUIRED COMPLIANCE DOCUMENTS</span>
                </h5>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">●</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Quick Pre-Approval Application Form */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold uppercase text-white font-heading">
                    APPLY FOR INSTANT FINANCING PRE-APPROVAL
                  </h4>
                  <p className="text-xs text-neutral-400">
                    No impact on your credit score during preliminary quotation.
                  </p>
                </div>
              </div>

              {isSubmitted ? (
                <div className="p-6 text-center bg-neutral-950 rounded-2xl border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Pre-Approval File Created Successfully</p>
                  <p className="text-xs text-neutral-400 mt-1">Our finance underwriters will provide terms within 60 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Christian Horner"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="christian@redbull.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase font-mono block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (415) 555-0199"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#e63946] hover:bg-[#d62839] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 font-heading text-xs uppercase tracking-wider shadow-lg shadow-red-900/30 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>SUBMIT CONFIDENTIAL PRE-APPROVAL REQUEST</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

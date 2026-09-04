import type { FormEvent } from 'react';
import { useState } from 'react';
import { ChevronsRight, ArrowDown, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import bronzePorscheImage from '../assets/images/bronze_porsche_front_1788186462478.jpg';

interface FooterSectionProps {
  onOpenTestDrive?: () => void;
  onOpenAdmin?: () => void;
  onNavigate?: (page: 'new-cars' | 'used-cars' | 'car-details' | 'sell-your-car' | 'services' | 'about-us' | 'contact-us') => void;
  onOpenSellCar?: () => void;
  onOpenFinancing?: () => void;
  onOpenContact?: () => void;
}

export default function FooterSection({ 
  onOpenTestDrive, 
  onOpenAdmin,
  onNavigate,
  onOpenSellCar,
  onOpenFinancing,
  onOpenContact
}: FooterSectionProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <div id="cta-and-footer-container" className="w-full max-w-[1480px] mx-auto px-2 sm:px-4 md:px-6 py-12 lg:py-16 flex flex-col space-y-12 sm:space-y-16">
      
      {/* ================= 1. UPPER CTA HERO BANNER ================= */}
      <div 
        id="cta-car-banner"
        className="relative w-full rounded-[32px] sm:rounded-[40px] bg-[#07080a] overflow-hidden p-6 sm:p-10 lg:p-14 text-white border border-neutral-800/60 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Top-Right Notched Badge with Circular Text & Down Arrow */}
        <div className="absolute top-0 right-0 z-30 p-6 sm:p-8 flex items-center justify-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Spinning Circular Text */}
            <svg 
              className="w-full h-full animate-[spin_20s_linear_infinite]" 
              viewBox="0 0 120 120"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 60, 60 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                />
              </defs>
              <text className="text-[10.5px] font-extrabold uppercase tracking-[0.24em] fill-neutral-400">
                <textPath xlinkHref="#circlePath">
                  Shahglobal • Drive Your Dream Today •
                </textPath>
              </text>
            </svg>

            {/* Center Down Arrow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <ArrowDown className="w-5 h-5 text-neutral-300 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Large Headline */}
        <div className="relative z-10 max-w-2xl">
          <h2 
            id="cta-banner-headline"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white font-display leading-[1.08]"
          >
            LET'S FIND YOUR NEXT
            <br />
            CAR TOGETHER
          </h2>
        </div>

        {/* Center Porsche Image & Right Description with Button */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-6 sm:mt-8">
          
          {/* Bronze Porsche Hero Photo */}
          <div className="lg:col-span-7 relative w-full h-[240px] sm:h-[320px] md:h-[380px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={bronzePorscheImage}
              alt="Metallic Bronze Luxury Porsche"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Right Text & Slanted CTA Button */}
          <div className="lg:col-span-5 flex flex-col justify-end items-start space-y-6 pb-2">
            <p 
              id="cta-banner-desc"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400 leading-relaxed max-w-sm"
            >
              BROWSE OUR FULL COLLECTION, BOOK A TEST DRIVE, OR SIMPLY REACH OUT. WE ARE HERE AND READY TO HELP.
            </p>

            {/* Slanted Button Pair */}
            <div className="flex items-center gap-2">
              <button
                id="cta-get-started-btn"
                onClick={onOpenTestDrive}
                className="h-11 sm:h-12 pl-6 pr-7 bg-white hover:bg-neutral-100 text-neutral-950 font-extrabold text-xs tracking-[0.08em] uppercase rounded-xl shadow-md transition-all duration-200 -skew-x-12 flex items-center justify-center font-heading cursor-pointer"
              >
                <span className="pr-1">GET STARTED</span>
              </button>

              <button
                id="cta-chevron-btn"
                onClick={onOpenTestDrive}
                className="h-11 w-13 sm:h-12 sm:w-14 bg-[#c9182b] hover:bg-[#b01424] text-white -skew-x-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md shadow-red-900/30 group cursor-pointer"
                aria-label="Get Started"
              >
                <div className="skew-x-12">
                  <ChevronsRight className="w-5 h-5 text-white stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 2. MAIN FOOTER CONTAINER ================= */}
      <footer 
        id="main-site-footer"
        className="relative w-full rounded-[32px] sm:rounded-[40px] bg-[#07080a] overflow-hidden p-6 sm:p-10 lg:p-16 text-white border border-neutral-800/60 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Subtle mesh background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, rgba(40,45,55,0.3) 0%, rgba(7,8,10,0.95) 80%), 
              repeating-radial-gradient(circle at 80% 80%, transparent 0, transparent 15px, rgba(255,255,255,0.02) 16px, transparent 17px),
              repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.015) 36px, transparent 37px)`,
          }}
        />

        <div className="relative z-10 flex flex-col space-y-12 sm:space-y-16">
          
          {/* Top Grid: Brand Column + Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left Brand Column */}
            <div className="md:col-span-5 flex flex-col space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                  Shahglobal<span className="text-[#e63946]">.</span>
                </span>
              </div>

              {/* Tagline */}
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400 leading-relaxed max-w-sm">
                EVERY WEEK WE SHARE THE LATEST ARRIVALS, BEST DEALS, AND EXCLUSIVE OFFERS.
              </p>

              {/* Social Icons */}
              <div className="flex flex-col space-y-3 pt-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 font-heading">
                  FOLLOW US ON
                </span>
                <div className="flex items-center gap-2.5">
                  {[
                    { icon: <Instagram className="w-4 h-4 text-neutral-900" />, label: 'Instagram' },
                    { icon: <Facebook className="w-4 h-4 text-neutral-900" />, label: 'Facebook' },
                    { icon: <Linkedin className="w-4 h-4 text-neutral-900" />, label: 'LinkedIn' },
                    { icon: <Twitter className="w-4 h-4 text-neutral-900" />, label: 'X' },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href="#"
                      aria-label={social.label}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-200 flex items-center justify-center transition-colors shadow-xs"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Copyright */}
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 pt-6">
                2025 ©DESIGN MONKS. ALL RIGHTS RESERVED
              </p>
            </div>

            {/* Right Nav Links Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Column 1: SHOWROOM COLLECTIONS */}
              <div className="flex flex-col space-y-3">
                <h5 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
                  SHOWROOM
                </h5>
                <ul className="space-y-2.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-neutral-300">
                  <li>
                    <button 
                      onClick={() => onNavigate ? onNavigate('new-cars') : null}
                      className="hover:text-[#e63946] transition-colors cursor-pointer text-left uppercase"
                    >
                      NEW CARS (0 MI)
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate ? onNavigate('used-cars') : null}
                      className="hover:text-[#e63946] transition-colors cursor-pointer text-left uppercase"
                    >
                      USED CARS (CERTIFIED)
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate ? onNavigate('sell-your-car') : null}
                      className="hover:text-[#e63946] transition-colors cursor-pointer text-left uppercase"
                    >
                      SELL YOUR CAR
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: SERVICES & ABOUT */}
              <div className="flex flex-col space-y-3">
                <h5 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
                  SERVICES
                </h5>
                <ul className="space-y-2.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-neutral-300">
                  <li>
                    <button 
                      onClick={() => onNavigate ? onNavigate('services') : null}
                      className="hover:text-white transition-colors cursor-pointer text-left uppercase"
                    >
                      CLIENT SERVICES
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate ? onNavigate('about-us') : null}
                      className="hover:text-white transition-colors cursor-pointer text-left uppercase"
                    >
                      ABOUT US
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate ? onNavigate('contact-us') : null}
                      className="hover:text-white transition-colors cursor-pointer text-left uppercase"
                    >
                      CONTACT US
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: CLIENT CONCIERGE */}
              <div className="flex flex-col space-y-3">
                <h5 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
                  CONCIERGE
                </h5>
                <ul className="space-y-2.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-neutral-300">
                  <li>
                    <button 
                      onClick={onOpenTestDrive}
                      className="hover:text-[#e63946] transition-colors cursor-pointer text-left uppercase flex items-center gap-1"
                    >
                      <span>BOOK VIP TEST DRIVE</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={onOpenContact}
                      className="hover:text-white transition-colors cursor-pointer text-left uppercase"
                    >
                      DIRECT DEALERSHIP LINE
                    </button>
                  </li>
                  <li>
                    <a href="#brands-and-faq-section" className="hover:text-white transition-colors uppercase">
                      FAQ &amp; WARRANTY
                    </a>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Middle: Subscribe on Newsletter Block */}
          <div className="flex flex-col space-y-4 pt-4">
            <h4 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
              Subscribe on Newsletter
            </h4>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 max-w-xl leading-relaxed">
              GET THE LATEST AI INSIGHTS, UPDATES, AND INNOVATIONS DELIVERED STRAIGHT TO YOUR INBOX.
            </p>

            {/* Newsletter Input + Subscribe Button */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="TYPE E-MAIL HERE"
                  required
                  className="w-full h-12 sm:h-13 px-5 rounded-xl bg-black/50 border border-neutral-800 focus:border-neutral-500 focus:outline-hidden text-xs sm:text-sm font-bold uppercase tracking-wider text-white placeholder-neutral-600"
                />
              </div>

              {/* Custom Slanted Subscribe Button Pair */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="submit"
                  className="h-12 sm:h-13 pl-6 pr-7 bg-[#111215] hover:bg-neutral-800 text-white font-extrabold text-xs tracking-[0.08em] uppercase rounded-xl shadow-md transition-all duration-200 -skew-x-12 flex items-center justify-center font-heading cursor-pointer"
                >
                  <span>{subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE'}</span>
                </button>

                <button
                  type="submit"
                  className="h-12 w-12 sm:h-13 sm:w-14 bg-white hover:bg-neutral-100 text-neutral-950 -skew-x-12 rounded-xl flex items-center justify-center transition-all shadow-md group cursor-pointer"
                  aria-label="Submit newsletter"
                >
                  <div className="skew-x-12">
                    <ChevronsRight className="w-5 h-5 text-neutral-950 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Policy Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-wider text-neutral-400 pt-6">
            <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS &amp; CONDITIONS</a>
            <a href="#" className="hover:text-white transition-colors">COOKIES</a>
            <a href="#brands-and-faq-section" className="hover:text-white transition-colors">FAQ</a>
            {onOpenAdmin && (
              <button 
                onClick={onOpenAdmin}
                className="hover:text-[#e63946] text-neutral-400 font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#e63946]" />
                <span>STAFF ADMIN LOGIN</span>
              </button>
            )}
          </div>

          {/* Giant Hollow Outlined SHAHGLOBAL Watermark Text */}
          <div className="relative w-full pt-8 overflow-hidden select-none pointer-events-none text-center">
            <span 
              id="footer-watermark-text"
              className="text-[9vw] font-black tracking-widest uppercase font-display leading-none bg-gradient-to-b from-white via-neutral-400 to-[#1a1c22] bg-clip-text text-transparent"
              style={{
                WebkitTextStroke: '2px transparent',
                textShadow: '0 0 0 rgba(0,0,0,0)',
              }}
            >
              SHAH
              <br />
              GLOBAL
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}

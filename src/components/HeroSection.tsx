import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronsRight, ArrowDown, Menu, X, Shield } from 'lucide-react';
import heroCarImage from '../assets/images/hero_sports_car_1788175114586.jpg';
import FloatingCustomerCard from './FloatingCustomerCard';

interface HeroSectionProps {
  onOpenTestDrive: () => void;
  onOpenStayWithUs: () => void;
  onNavigateNewVehicles: () => void;
  onNavigateUsedVehicles: () => void;
  onNavigateServices?: () => void;
  onNavigateAboutUs?: () => void;
  onOpenSellCar?: () => void;
  onOpenContact?: () => void;
  onOpenAdmin?: () => void;
}

export default function HeroSection({ 
  onOpenTestDrive, 
  onOpenStayWithUs,
  onNavigateNewVehicles,
  onNavigateUsedVehicles,
  onNavigateServices,
  onNavigateAboutUs,
  onOpenSellCar,
  onOpenContact,
  onOpenAdmin,
}: HeroSectionProps) {
  const [activeNav, setActiveNav] = useState('HOME');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'NEW CARS', action: onNavigateNewVehicles },
    { label: 'USED CARS', action: onNavigateUsedVehicles },
    { label: 'SELL YOUR CAR', action: onOpenSellCar },
    { label: 'SERVICES', action: onNavigateServices },
    { label: 'ABOUT US', action: onNavigateAboutUs },
    { label: 'CONTACT US', action: onOpenContact },
  ];

  const handleNavClick = (nav: { label: string; action?: () => void }) => {
    setActiveNav(nav.label);
    if (nav.action) {
      nav.action();
    }
  };

  return (
    <div className="relative w-full max-w-[1480px] mx-auto px-2 sm:px-4 md:px-6 -mt-4 pb-16 lg:pb-24">
      {/* SVG Clip Path Definition with shallower, wider curved arch cutout */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="hero-custom-shape" clipPathUnits="objectBoundingBox">
            <path d="
              M 0,0.075 
              L 0.615,0.075 
              C 0.645,0.075 0.655,0.045 0.675,0.015 
              C 0.685,0 0.695,0 0.71,0 
              L 0.94,0 
              C 0.97,0 0.98,0.02 0.98,0.05 
              L 0.98,0.10 
              C 0.98,0.14 0.95,0.16 0.95,0.18 
              L 0.95,0.34 
              C 0.95,0.36 0.98,0.38 0.98,0.42 
              L 0.98,0.70 
              L 0.98,0.965 
              C 0.98,0.985 0.985,1 0.965,1 
              L 0.035,1 
              C 0.015,1 0,0.985 0,0.965 
              L 0,0.10 
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* Main Grid / Canvas Wrapper */}
      <div className="relative w-full min-h-[640px] md:min-h-[720px] lg:min-h-[780px]">

        {/* 1. TOP-LEFT NAVBAR (Positions over the shallower & wider top-left cutout area) */}
        <header className="relative z-30 flex items-center justify-between lg:justify-start gap-5 lg:gap-4 px-4 sm:px-6 pt-15 pb-2 h-[56px] sm:h-[60px] w-fit flex-wrap">
          {/* Logo */}
          <a 
            href="#" 
            id="brand-logo"
            className="flex items-center gap-1 group select-none flex-shrink-0"
          >
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-neutral-900 font-heading">
              Shahglobal<span className="text-[#e63946]">.</span>
            </span>
          </a>

          {/* Desktop Nav Links (Fitting HOME, NEW CARS, USED CARS, SELL YOUR CAR, SERVICES, ABOUT US, CONTACT US) */}
          <nav id="desktop-navbar" className="hidden lg:flex items-center gap-4 xl:gap-6 pl-2">
            {navLinks.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNavClick(item)}
                  className={`text-xs font-bold tracking-[0.12em] transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    isActive
                      ? 'text-neutral-900 border-b-2 border-neutral-900 pb-0.5'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Admin Portal quick switch button */}
          {onOpenAdmin && (
            <div className="hidden lg:flex items-center ml-auto pr-2">
              <button
                id="hero-admin-portal-btn"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer border border-neutral-700 shadow-sm"
              >
                <Shield className="w-3 h-3 text-[#e63946]" />
                <span>STAFF ADMIN</span>
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-[10px] font-mono font-bold uppercase"
              >
                ADMIN
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-800 shadow-sm"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-20 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-neutral-200 space-y-3"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    handleNavClick(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg text-xs font-bold tracking-wider ${
                    activeNav === item.label ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenTestDrive();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#e63946] text-white text-xs font-bold tracking-wider uppercase text-center"
              >
                Book VIP Test Drive
              </button>
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold tracking-wider uppercase text-center font-mono"
                >
                  Staff Admin Portal
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* 2. THE DARK ASYMMETRIC CLIPPED HERO CONTAINER */}
        <div 
          id="hero-dark-container"
          className="relative w-full h-[580px] sm:h-[640px] md:h-[680px] lg:h-[720px] bg-[#0c0d0f] rounded-3xl lg:rounded-none overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] lg:[clip-path:url(#hero-custom-shape)]"
        >
          {/* Sports Car Background Image with High Legibility Dark Gradients */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroCarImage}
              alt="White high-performance sports car in studio lighting"
              className="w-full h-full object-cover object-center lg:object-[68%_center] filter brightness-[0.92] contrast-[1.08] select-none"
              referrerPolicy="no-referrer"
            />
            {/* Multi-layered cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent lg:w-[65%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(0,0,0,0.9),transparent_60%)]" />
          </div>

          {/* Top-Right Action Buttons inside the Dark Container */}
          <div 
            id="hero-top-right-actions"
            className="absolute top-4 sm:top-5 right-4 sm:right-10 lg:right-16 z-20 hidden sm:flex items-center gap-2"
          >
            {/* STAY WITH US pill button */}
            <button
              id="stay-with-us-btn"
              onClick={onOpenStayWithUs}
              className="px-5 py-2.5 rounded-full border border-neutral-700 bg-black/40 hover:bg-white hover:text-black hover:border-white text-white text-[11px] font-bold tracking-[0.16em] uppercase backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg"
            >
              STAY WITH US
            </button>

            {/* Adjacent white button with chevron */}
            <button
              id="stay-with-us-chevron-btn"
              onClick={onOpenStayWithUs}
              className="w-10 h-10 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-lg group cursor-pointer"
              aria-label="Open stay with us modal"
            >
              <ChevronsRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 3. HERO CONTENT: Headline and Button Pair (Left-aligned, vertically centered-upper) */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 pb-12 sm:pb-8 pt-10 sm:pt-4 max-w-2xl">
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1 
                id="hero-main-headline"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold uppercase text-white tracking-tight leading-[1.02] font-display drop-shadow-md"
              >
                DRIVE YOUR
                <br />
                <span className="tracking-tight text-white">DREAM TODAY</span>
              </h1>
            </motion.div>

            {/* Horizontal Button Pair */}
            <motion.div 
              id="hero-cta-button-pair"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mt-8 sm:mt-10 flex items-center gap-3 -skew-x-12"
            >
              {/* Slanted button matching EXPLORE ALL CARS: GET STARTED */}
              <button
                id="get-started-btn"
                onClick={onOpenTestDrive}
                className="h-11 sm:h-12 pl-6 pr-7 bg-white hover:bg-neutral-100 text-neutral-950 font-extrabold text-xs tracking-[0.08em] uppercase rounded-xl shadow-md transition-all duration-200 -skew-x-12 flex items-center justify-center font-heading cursor-pointer"
              >
                <span className="pr-1 -skew-x-12">GET STARTED</span>
              </button>

              {/* Red Slanted Parallelogram Button */}
              <button
                id="get-started-chevron-btn"
                onClick={onOpenTestDrive}
                className="h-11 w-13 sm:h-12 sm:w-14 bg-[#c9182b] hover:bg-[#b01424] text-white -skew-x-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md shadow-red-900/30 group cursor-pointer"
                aria-label="Get Started"
              >
                <ChevronsRight className="w-5 h-5 text-white stroke-[2.5] skew-x-12 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* 4. STATS BLOCK (Right side, stacked vertically, white text) */}
          <motion.div 
            id="hero-stats-block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="absolute top-28 sm:top-36 md:top-40 right-6 sm:right-16 lg:right-28 z-20 flex flex-col gap-6 text-right sm:text-left select-none pointer-events-auto"
          >
            {/* Horsepower Stat */}
            <div id="stat-horsepower" className="group">
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading"
              >
                640 HP
              </motion.div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">
                Horsepower
              </div>
            </div>

            {/* Range Stat */}
            <div id="stat-range" className="group">
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading"
              >
                300 mi
              </motion.div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">
                Range
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. SCROLL INDICATOR (Far right edge inside the cutout slot) */}
        <div 
          id="scroll-down-indicator"
          className="absolute top-[124px] md:top-[128px] lg:top-[132px] h-[205px] md:h-[218px] lg:h-[230px] right-3 sm:right-6 lg:right-9 z-30 hidden sm:flex flex-col items-center justify-center gap-2 select-none"
        >
          <span className="writing-vertical text-[10px] lg:text-[11px] font-bold tracking-[0.25em] text-neutral-500 hover:text-neutral-800 uppercase transition-colors">
            SCROLL DOWN
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#e63946] stroke-[2.5]" />
          </motion.div>
        </div>

        {/* 6. BOTTOM-RIGHT FLOATING CARD OVERLAPPING HERO LOWER EDGE */}
        <div 
          id="hero-floating-customer-wrapper"
          className="relative lg:absolute -bottom-8 sm:-bottom-10 right-2 sm:right-6 lg:right-8 z-30 mt-4 lg:mt-0 flex justify-end"
        >
          <FloatingCustomerCard onOpenReviews={onOpenTestDrive} />
        </div>

      </div>
    </div>
  );
}
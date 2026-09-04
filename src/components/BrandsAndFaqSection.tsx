import type { FormEvent } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, ChevronsRight, ArrowUpRight } from 'lucide-react';

import ferrariBadge from '../assets/images/ferrari_badge_logo_1788191558177.jpg';
import porscheBadge from '../assets/images/porsche_crest_badge_1788191576503.jpg';
import lamboBadge from '../assets/images/lamborghini_badge_1788191595368.jpg';
import bmwBadge from '../assets/images/bmw_m_badge_1788191610642.jpg';
import mercedesBadge from '../assets/images/mercedes_badge_1788191625804.jpg';
import audiBadge from '../assets/images/audi_rings_badge_1788191639556.jpg';
import astonBadge from '../assets/images/aston_badge_1788191654626.jpg';
import mclarenBadge from '../assets/images/mclaren_badge_1788191669100.jpg';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface BrandsAndFaqSectionProps {
  onContactClick?: () => void;
}

export default function BrandsAndFaqSection({ onContactClick }: BrandsAndFaqSectionProps) {
  const [openFaqId, setOpenFaqId] = useState<string>('faq-2');
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  const brandList = [
    { id: 'ferrari', name: 'Ferrari', image: ferrariBadge, tagline: 'Maranello, Italy' },
    { id: 'porsche', name: 'Porsche', image: porscheBadge, tagline: 'Stuttgart, Germany' },
    { id: 'lamborghini', name: 'Lamborghini', image: lamboBadge, tagline: 'Sant\'Agata, Italy' },
    { id: 'bmw', name: 'BMW M', image: bmwBadge, tagline: 'Munich, Germany' },
    { id: 'mercedes', name: 'Mercedes-Benz', image: mercedesBadge, tagline: 'Affalterbach, Germany' },
    { id: 'audi', name: 'Audi Sport', image: audiBadge, tagline: 'Neckarsulm, Germany' },
    { id: 'aston-martin', name: 'Aston Martin', image: astonBadge, tagline: 'Gaydon, UK' },
    { id: 'mclaren', name: 'McLaren', image: mclarenBadge, tagline: 'Woking, UK' },
  ];

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'IS SHAHGLOBAL A TRUSTED DEALERSHIP?',
      answer: 'YES. WE ARE FULLY LICENSED, BONDED, AND CERTIFIED WITH OVER 12,000 VERIFIED DELIVERIES ACROSS JAPAN, THE UK, AND THE UAE.',
    },
    {
      id: 'faq-2',
      question: "WHAT IF I DON'T LIKE THE CAR AFTER BUYING?",
      answer: 'WE HAVE A TRANSPARENT RETURN POLICY. YOUR SATISFACTION COMES FIRST – NO QUESTIONS ASKED.',
    },
    {
      id: 'faq-3',
      question: 'CAN I NEGOTIATE THE PRICE?',
      answer: 'WE OPERATE ON FULL PRICE TRANSPARENCY WITH ZERO HIDDEN MARKUPS TO ENSURE YOU GET THE MOST COMPETITIVE RATE FROM DAY ONE.',
    },
    {
      id: 'faq-4',
      question: 'CAN I SEE THE CAR BEFORE BUYING?',
      answer: 'ABSOLUTELY. YOU CAN SCHEDULE A PRIVATE IN-PERSON SHOWROOM INSPECTION OR A 360-DEGREE LIVE VIRTUAL WALKTHROUGH WITH OUR SPECIALISTS.',
    },
  ];

  const teamAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  ];

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? '' : id);
  };

  const handleBrandClick = () => {
    const el = document.getElementById('showroom-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="brands-and-faq-section"
      className="relative w-full max-w-[1480px] mx-auto px-4 sm:px-8 md:px-12 py-16 sm:py-24"
    >
      {/* ================= 1. DREAM BRANDS ROW ================= */}
      <div className="flex flex-col items-center text-center space-y-8 sm:space-y-10">
        <h2 
          id="brands-headline"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase text-neutral-900 font-display tracking-tight max-w-2xl leading-tight"
        >
          THE BRANDS PEOPLE ACTUALLY DREAM
          <br />
          ABOUT – ALL IN ONE PLACE
        </h2>

        {/* Circular Brand Badges Row with Real Brand Images */}
        <div 
          id="brand-logos-container"
          className="flex items-center justify-center -space-x-3 sm:-space-x-5 md:-space-x-6 overflow-x-auto py-6 px-4 w-full no-scrollbar"
        >
          {brandList.map((brand, index) => {
            const zIndex = brandList.length - index + 10;
            const isHovered = hoveredBrand === brand.id;

            return (
              <div
                key={brand.id}
                id={`brand-badge-${brand.id}`}
                onClick={handleBrandClick}
                onMouseEnter={() => setHoveredBrand(brand.id)}
                onMouseLeave={() => setHoveredBrand(null)}
                style={{ zIndex: isHovered ? 50 : zIndex }}
                className="group relative cursor-pointer flex-shrink-0 transition-transform duration-300 hover:scale-115"
                title={`${brand.name} - Browse Inventory`}
              >
                {/* Brand Image Circle Container */}
                <div className="w-20 h-20 sm:w-26 sm:h-26 md:w-30 md:h-30 rounded-full bg-white p-1.5 sm:p-2 shadow-lg border-2 border-white ring-1 ring-neutral-200/80 group-hover:ring-[#e63946] group-hover:shadow-2xl transition-all duration-300 overflow-hidden flex items-center justify-center">
                  <img
                    src={brand.image}
                    alt={`${brand.name} Logo`}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Floating Brand Name Tooltip Tag */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap bg-neutral-950 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xl border border-neutral-700 z-50">
                  {brand.name}
                </div>
              </div>
            );
          })}

          {/* 12+ More Brands Circle */}
          <div 
            id="brand-badge-more"
            onClick={handleBrandClick}
            className="relative z-0 w-20 h-20 sm:w-26 sm:h-26 md:w-30 md:h-30 rounded-full bg-[#0f1115] hover:bg-[#e63946] flex flex-col items-center justify-center p-3 shadow-lg border-2 border-white ring-1 ring-neutral-200/80 hover:scale-110 transition-all duration-300 cursor-pointer flex-shrink-0 group"
            title="Browse All 12+ Brands"
          >
            <span className="text-sm sm:text-base md:text-lg font-black text-white font-heading tracking-tight group-hover:scale-110 transition-transform">
              12+
            </span>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase text-neutral-400 group-hover:text-white tracking-widest mt-0.5 text-center leading-none">
              MORE BRANDS
            </span>
          </div>
        </div>

        {/* Sub-label encouraging interaction */}
        <p className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
          [ CLICK ANY BRAND TO EXPLORE LIVE SHOWROOM INVENTORY ]
        </p>
      </div>

      {/* ================= 2. FAQ SECTION ================= */}
      <div className="mt-20 sm:mt-28 flex flex-col items-center w-full max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <span 
            id="faq-tag"
            className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase"
          >
            [ FAQ_ ]
          </span>

          <h3 
            id="faq-headline"
            className="text-3xl sm:text-4xl font-extrabold uppercase text-neutral-900 font-display tracking-tight"
          >
            LET US CLEAR THINGS UP
          </h3>

          <p 
            id="faq-subtext"
            className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400"
          >
            WE ARE ALWAYS HERE TO HELP. NO QUESTION IS TOO SMALL.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="w-full flex flex-col space-y-4">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <motion.div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                layout
                className={`w-full rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-[#f0f2f5] p-6 sm:p-7 shadow-xs' 
                    : 'bg-white border border-neutral-200/90 hover:border-neutral-300 p-5 sm:p-6 shadow-2xs'
                }`}
              >
                <div
                  onClick={() => toggleFaq(faq.id)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-neutral-900 font-heading pr-4">
                    {faq.question}
                  </h4>

                  {/* Toggle Button */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#c9182b] text-white shadow-md shadow-red-900/20'
                        : 'border border-neutral-300 text-neutral-600 group-hover:border-neutral-400'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                </div>

                {/* Expanded Answer */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden pt-4"
                    >
                      <p className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-neutral-500 leading-relaxed max-w-xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ================= 3. NEED MORE CLARITY BANNER ================= */}
        <div className="w-full mt-12 sm:mt-16">
          <div 
            id="clarity-banner"
            className="relative w-full rounded-3xl bg-[#f0f2f5] p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-xs"
          >
            {/* Top Row: 3 Avatars + "Need more clarity?" */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5 items-center">
                {teamAvatars.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="Support Specialist"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#f0f2f5] shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>

              <h4 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display tracking-tight">
                Need more clarity?
              </h4>
            </div>

            {/* Subtitle */}
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 max-w-md mt-4 leading-relaxed">
              STILL NOT SURE? OUR TEAM IS JUST ONE CALL AWAY — READY TO HELP YOU WITH ANYTHING YOU NEED.
            </p>

            {/* Bottom Row: Red Email Link + Contact Us Slanted Button Pair */}
            <div className="mt-8 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              {/* Red Email */}
              <a
                href="mailto:hello@neurofly.com"
                className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#c9182b] hover:text-[#a01222] transition-colors font-heading flex items-center gap-1 group"
              >
                <span>HELLO@NEUROFLY.COM</span>
                <span className="group-hover:translate-x-1 transition-transform">—</span>
              </a>

              {/* Slanted Button Pair: CONTACT US + Black Chevron */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* White button */}
                <button
                  id="clarity-contact-btn"
                  onClick={onContactClick}
                  className="h-11 sm:h-12 pl-6 pr-7 bg-white hover:bg-neutral-100 text-neutral-950 font-extrabold text-xs tracking-[0.08em] uppercase rounded-xl shadow-md transition-all duration-200 -skew-x-12 flex items-center justify-center font-heading cursor-pointer"
                >
                  <span>CONTACT US</span>
                </button>

                {/* Black slanted button */}
                <button
                  id="clarity-chevron-btn"
                  onClick={onContactClick}
                  className="h-11 w-12 sm:h-12 sm:w-14 bg-black hover:bg-neutral-800 text-white -skew-x-12 rounded-lg flex items-center justify-center transition-all shadow-md group cursor-pointer"
                  aria-label="Contact support"
                >
                  <div className="skew-x-12">
                    <ChevronsRight className="w-5 h-5 text-white stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

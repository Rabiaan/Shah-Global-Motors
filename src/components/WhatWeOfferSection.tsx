import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import fullCarTopDown from '../assets/images/supercar_full_topdown_1788185780996.jpg';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="relative flex flex-col w-full">
      {/* Top Header: Circular icon badge & Title */}
      <div className="flex items-center gap-4 pl-2 mb-2 z-10">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#17181c] text-white flex items-center justify-center shadow-lg border border-neutral-800 flex-shrink-0">
          {icon}
        </div>
        <h4 className="text-base sm:text-lg font-bold text-neutral-900 font-heading leading-tight max-w-[150px]">
          {title}
        </h4>
      </div>

      {/* Inner Card with arched notch matching the circular badge */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.06)] border border-neutral-100/80 min-h-[140px] sm:min-h-[160px] flex flex-col justify-end">
        <p className="text-[11px] sm:text-xs font-bold uppercase text-neutral-500 tracking-wider leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function WhatWeOfferSection() {
  return (
    <section 
      id="what-we-offer-section"
      className="relative w-full max-w-[1480px] mx-auto px-4 sm:px-8 md:px-12 py-16 sm:py-24 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* ================= LEFT SIDE: STAGGERED 2-COLUMN FEATURE CARDS ================= */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Column 1 */}
          <div className="flex flex-col space-y-8 sm:space-y-10">
            {/* Card 1: Competitive Pricing */}
            <div className="bg-[#f0f2f5] p-3 sm:p-4 rounded-[36px]">
              <FeatureCard
                icon={
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3" />
                    <path d="M4 7h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" />
                    <path d="M12 11v4" />
                    <path d="M10 12.5c0-.83.67-1.5 1.5-1.5h1a1.5 1.5 0 1 1 0 3h-1a1.5 1.5 0 1 0 0 3h1.5a1.5 1.5 0 0 0 1.5-1.5" />
                  </svg>
                }
                title="Competitive Pricing"
                description="NO HIDDEN CHARGES, NO MARKUPS. JUST FAIR AND HONEST PRICES EVERY TIME."
              />
            </div>

            {/* Card 2: Roadside Assistance */}
            <div className="bg-[#f0f2f5] p-3 sm:p-4 rounded-[36px]">
              <FeatureCard
                icon={<Headphones className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />}
                title="Roadside Assistance"
                description="STUCK ON THE ROAD? OUR SUPPORT TEAM IS JUST ONE CALL AWAY, ANYTIME."
              />
            </div>
          </div>

          {/* Column 2 (Staggered) */}
          <div className="flex flex-col space-y-8 sm:space-y-10 sm:pt-16">
            {/* Card 3: Certified Quality Guarantee */}
            <div className="bg-[#f0f2f5] p-3 sm:p-4 rounded-[36px]">
              <FeatureCard
                icon={<ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />}
                title="Certified Quality Guarantee"
                description="EVERY CAR PASSES OUR STRICT 150-POINT INSPECTION BEFORE IT REACHES YOU."
              />
            </div>

            {/* Card 4: Easy EMI and Financing */}
            <div className="bg-[#f0f2f5] p-3 sm:p-4 rounded-[36px]">
              <FeatureCard
                icon={<CreditCard className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />}
                title="Easy EMI and Financing"
                description="FLEXIBLE PAYMENT PLANS WITH LOW INTEREST RATES FROM 12+ TOP BANKS WORLDWIDE."
              />
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE: HEADER & INTERACTIVE TELEMETRY CAR ================= */}
        <div className="lg:col-span-6 flex flex-col space-y-8 lg:pl-6">
          
          {/* Header Title Block */}
          <div className="flex flex-col space-y-3">
            <span 
              id="what-we-offer-tag"
              className="text-xs sm:text-sm font-mono font-bold tracking-widest text-neutral-500 uppercase"
            >
              [ WHAT WE OFFER_ ]
            </span>

            <h2 
              id="what-we-offer-headline"
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold uppercase text-neutral-900 font-display tracking-tight leading-[1.08]"
            >
              EVERYTHING WE
              <br />
              DO IS BUILT
              <br />
              AROUND YOU
            </h2>

            <p 
              id="what-we-offer-subtitle"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500 max-w-lg leading-relaxed pt-1"
            >
              WE DON'T JUST SELL CARS. WE BUILD RELATIONSHIPS THAT LAST LONG AFTER DELIVERY.
            </p>
          </div>

          {/* Interactive Supercar Telemetry Showcase */}
          <div 
            id="supercar-telemetry-container"
            className="relative w-full max-w-md mx-auto flex items-center justify-center pt-4"
          >
            {/* Top-down vehicle photo */}
            <div className="relative w-[280px] sm:w-[320px] md:w-[340px] drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)]">
              <img
                src={fullCarTopDown}
                alt="Supercar top down precision telemetry"
                className="w-full h-auto object-contain select-none"
                referrerPolicy="no-referrer"
              />

              {/* Glowing Sensor Hotspots */}
              <div className="absolute top-[12%] left-[45%] w-2 h-2 rounded-full bg-[#e63946] shadow-[0_0_10px_3px_rgba(230,57,70,0.8)] animate-ping" />
              <div className="absolute top-[12%] left-[45%] w-2 h-2 rounded-full bg-[#e63946]" />

              <div className="absolute top-[32%] left-[10%] w-2 h-2 rounded-full bg-[#e63946] shadow-[0_0_10px_3px_rgba(230,57,70,0.8)]" />
              <div className="absolute bottom-[20%] left-[30%] w-2.5 h-2.5 rounded-full bg-[#e63946] shadow-[0_0_12px_4px_rgba(230,57,70,0.9)] animate-pulse" />
              <div className="absolute bottom-[10%] right-[18%] w-2 h-2 rounded-full bg-[#e63946] shadow-[0_0_10px_3px_rgba(230,57,70,0.8)]" />
            </div>

            {/* Floating Telemetry Tag 1: 330 km/h Top Speed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-[34%] right-0 sm:-right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] border border-neutral-100 flex flex-col"
            >
              <span className="text-base sm:text-lg font-extrabold text-neutral-900 font-heading tracking-tight">
                330 km/h
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Top Speed
              </span>
            </motion.div>

            {/* Floating Telemetry Tag 2: 650 HP Horsepower */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-[28%] left-0 sm:-left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] border border-neutral-100 flex flex-col"
            >
              <span className="text-base sm:text-lg font-extrabold text-[#e63946] font-heading tracking-tight">
                650 HP
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Horsepower
              </span>
            </motion.div>

            {/* Floating Telemetry Tag 3: 3,745 cc Displacement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-[10%] right-0 sm:-right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] border border-neutral-100 flex flex-col"
            >
              <span className="text-base sm:text-lg font-extrabold text-neutral-900 font-heading tracking-tight">
                3,745 cc
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Displacement
              </span>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}

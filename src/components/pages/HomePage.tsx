import { motion } from 'motion/react';
import HeroSection from '../HeroSection';
import InventorySection from '../InventorySection';
import ShowroomCatalog from '../ShowroomCatalog';
import WhatWeOfferSection from '../WhatWeOfferSection';
import AboutSection from '../AboutSection';
import TestimonialsSection from '../TestimonialsSection';
import BrandsAndFaqSection from '../BrandsAndFaqSection';
import type { Vehicle } from '../../types';
import type { PageRoute } from '../Navbar';
import { ArrowRight, Sparkles, PhoneCall } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookTestDrive: (vehicle?: Vehicle | null) => void;
  onOpenFinancing?: (vehicle?: Vehicle | null) => void;
  onOpenContact?: (vehicle?: Vehicle | null) => void;
  onOpenSellCar?: () => void;
  onOpenStayWithUs?: () => void;
}

export default function HomePage({
  onNavigate,
  onSelectVehicle,
  onBookTestDrive,
  onOpenFinancing,
  onOpenContact,
  onOpenSellCar,
  onOpenStayWithUs
}: HomePageProps) {
  return (
    <div className="w-full bg-[#f8f9fa] overflow-hidden">
      {/* 1. Cinematic Hero Section with Dynamic Spec Toggles & Test Drive CTA */}
      <HeroSection
        onOpenTestDrive={() => onBookTestDrive(null)}
        onOpenStayWithUs={onOpenStayWithUs || (() => onBookTestDrive(null))}
        onNavigateNewVehicles={() => onNavigate('new-cars')}
        onNavigateUsedVehicles={() => onNavigate('used-cars')}
        onNavigateServices={() => onNavigate('services')}
        onNavigateAboutUs={() => onNavigate('about-us')}
        onOpenSellCar={onOpenSellCar || (() => onNavigate('sell-your-car'))}
        onOpenContact={() => onNavigate('contact-us')}
      />

      {/* 3. Interactive Fast Accordion Inventory Showcase */}
      <InventorySection
        onNavigateToAllCars={() => onNavigate('new-cars')}
        onNavigateToNewVehicles={() => onNavigate('new-cars')}
        onNavigateToUsedVehicles={() => onNavigate('used-cars')}
        onOpenInventory={() => onNavigate('new-cars')}
      />

      {/* 4. Live Interactive Showroom Catalog with Real-time Filters */}
      <section className="w-full py-12 bg-[#f4f5f7] border-y border-neutral-200/80">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#e63946] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>LIVE INVENTORY CATALOG</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 font-heading uppercase tracking-tight">
              EXPLORE OUR FLEET
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('new-cars')}
              className="px-4 py-2 rounded-xl bg-[#0f1115] text-white hover:bg-neutral-800 text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>NEW CARS SHOWROOM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('used-cars')}
              className="px-4 py-2 rounded-xl bg-white text-neutral-900 border border-neutral-300 hover:border-neutral-400 text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>USED CARS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <ShowroomCatalog
          onSelectVehicle={onSelectVehicle}
          onBookTestDrive={(v) => onBookTestDrive(v)}
        />
      </section>

      {/* 5. What We Offer Architecture & Pillars */}
      <WhatWeOfferSection />

      {/* 6. High-Performance Metrics & Brand Heritage */}
      <AboutSection />

      {/* 7. Authenticated VIP Collector Testimonials */}
      <TestimonialsSection />

      {/* 8. Exotic Brands Marquee & Interactive FAQ Section */}
      <BrandsAndFaqSection />

      {/* 9. VIP Call to Action Banner */}
      <section className="w-full bg-[#0a0c10] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
        <div className="max-w-[1480px] mx-auto bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 rounded-3xl p-8 sm:p-12 lg:p-16 border border-neutral-800 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e63946] mb-3 block">
              EXPERIENCE PERFECTION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white uppercase leading-none mb-4">
              READY FOR THE DRIVER'S SEAT?
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
              Book a bespoke track test drive, request private financing estimates, or have our global concierge source your exact spec from world allocations.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onBookTestDrive(null)}
              className="px-8 py-4 rounded-xl bg-[#e63946] hover:bg-[#c92a37] text-white font-bold font-mono text-sm uppercase tracking-wider shadow-xl shadow-red-950/50 transition-all duration-200 cursor-pointer flex items-center gap-3 hover:scale-105"
            >
              <span>SCHEDULE TEST DRIVE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contact-us')}
              className="px-8 py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold font-mono text-sm uppercase tracking-wider border border-neutral-700 transition-all duration-200 cursor-pointer flex items-center gap-3"
            >
              <PhoneCall className="w-4 h-4 text-[#e63946]" />
              <span>CONTACT CONCIERGE</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

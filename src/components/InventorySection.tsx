import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, ChevronsRight } from 'lucide-react';
import { useDealership } from '../context/DealershipContext';

interface InventorySectionProps {
  onNavigateToAllCars?: () => void;
  onNavigateToNewVehicles?: () => void;
  onNavigateToUsedVehicles?: () => void;
  onOpenInventory?: () => void;
}

export default function InventorySection({ 
  onNavigateToAllCars, 
  onNavigateToNewVehicles, 
  onNavigateToUsedVehicles, 
  onOpenInventory 
}: InventorySectionProps) {
  const { landedCars } = useDealership();
  const handleBrowseAll = () => {
    if (onNavigateToAllCars) {
      onNavigateToAllCars();
    } else if (onOpenInventory) {
      onOpenInventory();
    }
  };
  // Default expanded item is the first featured car as shown in the mockup image
  const [activeItemId, setActiveItemId] = useState<string>(landedCars[0]?.id ?? '');

  const avatars = [
    {
      name: 'Alex Rivera',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sarah Lin',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Michael Scott',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const toggleItem = (id: string) => {
    setActiveItemId(activeItemId === id ? '' : id);
  };

  return (
    <section 
      id="inventory-section"
      className="relative w-full max-w-[1480px] mx-auto px-2 sm:px-4 md:px-6 py-12 lg:py-16"
    >
      {/* SVG clip-path defining a semicircular notch cut into the top edge 
          of the expanded feature card, where the floating white badge sits */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id="inventory-card-notch" clipPathUnits="objectBoundingBox">
            <path d="
              M 0,1 
              L 0,0.033 
              C 0,0.014 0.015,0 0.033,0 
              L 0.038,0 
              C 0.038,0.024 0.082,0.024 0.082,0 
              L 1,0 
              L 1,1 
              L 0,1 
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      {/* Dark Outer Container with rounded corners and carbon-mesh / subtle organic wireframe texture */}
      <div 
        id="inventory-card-container"
        className="relative w-full rounded-[32px] sm:rounded-[40px] bg-[#07080a] overflow-hidden p-6 sm:p-10 lg:p-16 text-white border border-neutral-800/60 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Subtle organic wireframe background mesh overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, rgba(40,45,55,0.4) 0%, rgba(7,8,10,0.95) 75%), 
              repeating-radial-gradient(circle at 75% 65%, transparent 0, transparent 15px, rgba(255,255,255,0.03) 16px, transparent 17px),
              repeating-linear-gradient(60deg, transparent, transparent 35px, rgba(255,255,255,0.015) 36px, transparent 37px)`,
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between min-h-[420px] lg:min-h-[560px]">
            
            {/* Top Left: Header & Call-to-action */}
            <div className="flex flex-col space-y-4">
              {/* Tag */}
              <span 
                id="inventory-tag"
                className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase"
              >
                [ INVENTORY_ ]
              </span>

              {/* Main Headline */}
              <h2 
                id="inventory-main-headline"
                className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold uppercase tracking-tight text-white font-display leading-[1.08]"
              >
                BROWSE
                <br />
                WHAT JUST
                <br />
                LANDED
              </h2>

              {/* Subtext */}
              <p 
                id="inventory-subtext"
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 max-w-xs leading-relaxed pt-1"
              >
                NEW CARS ADDED EVERY SINGLE DAY. DON'T MISS OUT.
              </p>

              {/* Custom Slanted Button Pair matching exact specification */}
              <div 
                id="inventory-cta-buttons"
                className="pt-6 flex items-center gap-2"
              >
                {/* White button: BROWSE MORE */}
                <button
                  id="browse-more-btn"
                  onClick={handleBrowseAll}
                  className="h-11 sm:h-12 pl-6 pr-7 bg-white hover:bg-neutral-100 text-neutral-950 font-extrabold text-xs tracking-[0.08em] uppercase rounded-xl shadow-md transition-all duration-200 -skew-x-12 flex items-center justify-center font-heading cursor-pointer"
                >
                  <span className="pr-1">EXPLORE ALL CARS</span>
                </button>

                {/* Red Slanted Parallelogram Button */}
                <button
                  id="browse-more-chevron-btn"
                  onClick={handleBrowseAll}
                  className="h-11 w-13 sm:h-12 sm:w-14 bg-[#c9182b] hover:bg-[#b01424] text-white -skew-x-12 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md shadow-red-900/30 group cursor-pointer"
                  aria-label="Browse Inventory"
                >
                  <div className="skew-x-12">
                    <ChevronsRight className="w-5 h-5 text-white stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Left: Wireframe Globe & Happy Customer Counter */}
            <div id="inventory-customer-stats" className="pt-10 lg:pt-0 flex flex-col items-start">
              {/* Wireframe Globe Icon in White/Grey lines */}
              <div className="mb-3">
                <svg 
                  id="inventory-globe-icon"
                  className="w-10 h-10 text-neutral-300"
                  viewBox="0 0 100 100" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="8" y1="30" x2="92" y2="30" stroke="currentColor" strokeWidth="2" />
                  <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="8" y1="70" x2="92" y2="70" stroke="currentColor" strokeWidth="2" />
                  <ellipse cx="50" cy="50" rx="18" ry="46" stroke="currentColor" strokeWidth="2" />
                  <ellipse cx="50" cy="50" rx="34" ry="46" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Label */}
              <div className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase font-heading">
                HAPPY CUSTOMER
              </div>

              {/* 95K+ & overlapping avatars */}
              <div className="flex items-center gap-3 mt-1">
                <span 
                  id="inventory-customer-count"
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading"
                >
                  95K+
                </span>
                <div className="flex -space-x-2 items-center">
                  {avatars.map((avatar, idx) => (
                    <img
                      key={avatar.name}
                      id={`inv-avatar-${idx}`}
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-7 h-7 rounded-full object-cover border-2 border-neutral-900 shadow-sm ring-1 ring-neutral-700"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: ACCORDION LIST ================= */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {landedCars.length === 0 ? (
              <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-10 text-center">
                <div className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                  No featured cars yet
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Add vehicles from the Staff Admin dashboard to showcase them here.
                </p>
              </div>
            ) : landedCars.map((item) => {
              const isExpanded = activeItemId === item.id;

              return (
                <div
                  key={item.id}
                  id={`inventory-row-${item.id}`}
                  className="border-b border-neutral-800/80 last:border-b-0 pb-4 transition-colors"
                >
                  {/* Collapsed / Row Header */}
                  <div
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center justify-between py-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Small square preview thumbnail when collapsed */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-800 shadow-inner group-hover:border-neutral-700 transition-colors">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Car Name & Number */}
                      <span className="text-base sm:text-xl font-bold tracking-tight text-white font-heading group-hover:text-neutral-200 transition-colors">
                        {item.number} – {item.name}
                      </span>
                    </div>

                    {/* Expand/Collapse Chevron Icon */}
                    <div className="text-neutral-400 group-hover:text-white transition-colors p-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content with Preview Card & Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden pt-2 pb-4"
                      >
                        {/* Large Featured Card with Circular Floating Badge */}
                        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl group">
                          
                          {/* Circular Floating Badge Button (top-left of the card) */}
                          <div className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-lg">
                            <ChevronsRight className="w-4 h-4 stroke-[2.5]" />
                          </div>

                          {/* Large Image Showcase */}
                          <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] overflow-hidden bg-[#e5e6e8]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </div>
                        </div>

                        {/* Title & Description under the large image */}
                        <div className="mt-5 space-y-2">
                          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-heading">
                            {item.number} – {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-400 max-w-xl leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}

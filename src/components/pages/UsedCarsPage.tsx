import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useDealership } from '../../context/DealershipContext';
import type { Vehicle } from '../../types';

interface UsedCarsPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookTestDrive: (vehicle: Vehicle) => void;
  onOpenFinancing: (vehicle: Vehicle) => void;
  onOpenContact?: (vehicle: Vehicle) => void;
  onNavigate: (page: 'new-cars' | 'used-cars' | 'car-details' | 'sell-your-car' | 'services' | 'about-us' | 'contact-us') => void;
}

const INSPECTED = ['MECHANICAL', 'BODY & PAINT', 'INTERIOR', 'DOCUMENTATION'];

export default function UsedCarsPage({
  onSelectVehicle,
  onBookTestDrive,
  onOpenFinancing,
  onOpenContact,
  onNavigate
}: UsedCarsPageProps) {
  const { vehicles } = useDealership();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'featured' | 'mileage-asc' | 'price-desc'>('featured');

  const usedVehicles = useMemo(() => {
    return vehicles.filter(v => v.category === 'Used');
  }, [vehicles]);

  const uniqueMakes = useMemo(() => {
    const makes = Array.from(new Set(usedVehicles.map(v => v.make)));
    return ['all', ...makes];
  }, [usedVehicles]);

  const filteredVehicles = useMemo(() => {
    return usedVehicles
      .filter((vehicle) => {
        const matchesSearch =
          searchQuery.trim() === '' ||
          `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.engine}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesMake = selectedMake === 'all' || vehicle.make === selectedMake;
        return matchesSearch && matchesMake;
      })
      .sort((a, b) => {
        if (sortOption === 'mileage-asc') return a.mileage - b.mileage;
        if (sortOption === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [usedVehicles, searchQuery, selectedMake, sortOption]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMake('all');
    setSortOption('featured');
  };

  const hasFilters = searchQuery !== '' || selectedMake !== 'all' || sortOption !== 'featured';
  const hero = usedVehicles[0];

  return (
    <div className="bg-[#0C0D0F]">
      {/* ============ 01 / CINEMATIC HERO — PRE-OWNED. NOT ORDINARY. ============ */}
      <section className="relative text-white overflow-hidden">
        <div className="absolute inset-0">
          {hero && (
            <img
              src={hero.images[1] || hero.images[0]}
              alt="Pre-owned collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D0F] via-[#0C0D0F]/55 to-[#0C0D0F]/20" />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-8 pt-6 pb-28 sm:pb-36 min-h-[88vh] flex flex-col justify-end">
          <div className="flex items-center justify-between border border-white/15 rounded-full px-5 py-3 text-[11px] font-mono tracking-[0.25em] uppercase text-white/60 mb-10">
            <span className="text-[#E63946] font-bold">01 — Pre-Owned</span>
            <span className="hidden sm:block">Historics / Provenance</span>
            <span className="font-bold text-white/80">{String(usedVehicles.length).padStart(2, '0')} CARS</span>
          </div>

          <h1 className="font-display font-extrabold uppercase leading-[0.9] tracking-tighter" style={{ fontSize: 'clamp(3rem, 11vw, 10rem)' }}>
            Pre-owned.<br />
            <span className="text-[#E63946]">Not ordinary.</span>
          </h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-white/15 pt-6">
            <p className="max-w-lg text-sm text-white/70 font-body leading-relaxed">
              Three decades of provenance, verified historians, and a 160-point inspection on every machine that enters our pre-owned hall.
            </p>
            <div className="flex items-stretch gap-px bg-white/15">
              {INSPECTED.map((label, i) => (
                <div key={label} className="bg-[#0C0D0F]/80 px-3 py-2 text-center">
                  <div className="text-[#E63946] font-mono text-xs font-bold">0{i + 1}</div>
                  <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/60">{label.split(' &')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 / THE USED COLLECTION — horizontal editorial catalogue ============ */}
      <section className="relative bg-[#F4F4F2]">
        <div className="absolute left-0 top-0 h-[2px] w-full bg-[#E63946]" />
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 pt-20 sm:pt-24 pb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-500 mb-4">02 / The Collection</div>
              <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-tighter text-[#0C0D0F]" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>
                The used<br />collection
              </h2>
            </div>
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-500 text-right leading-relaxed">
              Every unit inspected,<br />photographed & documented.
            </div>
          </div>

          {/* integrated horizontal filter strip */}
          <div className="mt-12 border-y border-[#D8D8D2]">
            <div className="flex flex-col xl:flex-row xl:items-center gap-4 py-5">
              <div className="flex items-center gap-2 text-[#0C0D0F]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#E63946]" />
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase font-bold">Filter</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the pre-owned hall…"
                className="flex-1 min-w-[220px] bg-transparent border-b border-[#B9B9B1] focus:border-[#E63946] outline-none pb-1 text-sm placeholder:text-neutral-400 font-body"
              />
              <div className="flex flex-wrap items-center gap-1.5">
                {uniqueMakes.map((make) => (
                  <button
                    key={make}
                    onClick={() => setSelectedMake(make === selectedMake ? 'all' : make)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer ${
                      selectedMake === make
                        ? 'bg-[#0C0D0F] text-white'
                        : 'border border-[#C9C9C2] text-neutral-600 hover:border-[#0C0D0F]'
                    }`}
                  >
                    {make === 'all' ? 'All' : make}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-500">Sort</span>
                <div className="flex rounded-full border border-[#C9C9C2] overflow-hidden">
                  {(['featured', 'mileage-asc', 'price-desc'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortOption(s)}
                      className={`px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors cursor-pointer ${
                        sortOption === s ? 'bg-[#0C0D0F] text-white' : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {s === 'featured' ? 'Featured' : s === 'mileage-asc' ? 'Mileage' : 'Price'}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-[11px] font-mono tracking-[0.2em] uppercase text-[#E63946] hover:text-[#C9182B] font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* horizontal editorial catalogue — full-width vehicle plates */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 pb-28">
          {filteredVehicles.length === 0 ? (
            <div className="py-20 border-t border-[#D8D8D2]">
              <div className="font-display font-extrabold uppercase text-3xl sm:text-4xl text-[#0C0D0F]">Nothing on the floor.</div>
              <p className="text-sm text-neutral-500 mt-3 max-w-md font-body">Adjust the filters, or commission us to find your exact pre-owned unit.</p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-3 bg-[#0C0D0F] hover:bg-[#201F22] text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div>
              {filteredVehicles.map((vehicle, idx) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5 }}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-[#0C0D0F]/15 hover:border-[#0C0D0F] transition-colors py-8 lg:py-10"
                >
                  {/* big index */}
                  <div className="lg:col-span-1 flex items-start justify-between lg:block">
                    <div className="font-mono text-xs tracking-[0.2em] text-neutral-500">0{idx + 1}</div>
                    <div className="lg:hidden font-mono text-[10px] tracking-[0.2em] text-[#E63946] uppercase">Inspected</div>
                  </div>

                  {/* image */}
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className="lg:col-span-4 block cursor-pointer overflow-hidden"
                  >
                    <motion.img
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.8 }}
                      src={vehicle.images[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-56 sm:h-64 lg:h-48 object-cover"
                    />
                  </button>

                  {/* identity */}
                  <div className="lg:col-span-4 px-0 lg:px-8 mt-4 lg:mt-0">
                    <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400">{vehicle.make} / {vehicle.condition}</div>
                    <h3
                      onClick={() => onSelectVehicle(vehicle)}
                      className="mt-1 font-heading font-bold uppercase tracking-tight leading-tight text-[#0C0D0F] text-xl sm:text-2xl cursor-pointer hover:text-[#E63946] transition-colors"
                    >
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-500 font-body leading-relaxed line-clamp-2">{vehicle.description}</p>
                  </div>

                  {/* spec + price */}
                  <div className="lg:col-span-3 flex lg:flex-col lg:items-end lg:justify-between mt-4 lg:mt-0 border-t lg:border-t-0 border-[#0C0D0F]/10 pt-3 lg:pt-0">
                    <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] tracking-wide text-neutral-600">
                      <span>{vehicle.mileage.toLocaleString()} MI</span>
                      <span>{vehicle.specs.horsepower} HP</span>
                      <span>{vehicle.specs.acceleration.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-4 mt-2 lg:mt-4">
                      <div className="font-display font-bold text-xl text-[#0C0D0F]">${vehicle.price.toLocaleString()}</div>
                      <button
                        onClick={() => onSelectVehicle(vehicle)}
                        className="w-9 h-9 border border-[#0C0D0F]/20 hover:bg-[#0C0D0F] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="View vehicle"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ 03 / INSPECTED — inspection language around a hero image ============ */}
      <section className="relative bg-[#0C0D0F] text-white overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none select-none absolute -right-6 top-6 font-display font-extrabold leading-none text-[#16181C] tracking-tighter" style={{ fontSize: 'clamp(6rem, 18vw, 17rem)' }}>
          OK
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-8">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#E63946] mb-6">03 / Provenance & Inspection</div>
          <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 8vw, 7.5rem)' }}>
            Inspected.<br />Documented.
          </h2>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* the four inspection blocks — around the image, offset */}
            <div className="lg:col-span-3 space-y-px bg-white/10">
              {INSPECTED.map((label, i) => (
                <div key={label} className="group cursor-pointer bg-[#0C0D0F] hover:bg-[#16181C] px-6 py-6 transition-colors border-l-2 border-transparent hover:border-[#E63946]">
                  <div className="flex items-baseline justify-between">
                    <div className="text-[#E63946] font-mono text-sm font-bold">0{i + 1}</div>
                    <div className="text-[10px] font-mono tracking-[0.15em] text-white/40">VERIFIED</div>
                  </div>
                  <div className="mt-2 font-heading font-bold uppercase tracking-tight">{label}</div>
                </div>
              ))}
            </div>

            {/* large cinematic image */}
            <div className="lg:col-span-6">
              {hero && (
                <motion.img
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  src={hero.images[0]}
                  alt="Certified pre-owned inspection"
                  referrerPolicy="no-referrer"
                  className="w-full h-[40vh] sm:h-[60vh] object-cover"
                />
              )}
            </div>

            {/* offset caption */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                {[
                  'Full provenance dossier',
                  'Photographic condition record',
                  'Mechanic-signed 160-point sheet',
                ].map((t, i) => (
                  <div key={t} className="flex items-start gap-3 border-b border-white/10 pb-3">
                    <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center rounded-full bg-[#E63946] text-[9px] font-bold text-white">✓</span>
                    <span className="text-xs text-white/70 font-body">{t}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/40">Every pre-owned purchase</div>
                <div className="font-display font-bold text-lg">Peace of mind, on paper.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 04 / TRADE-IN — full bleed ============ */}
      <section className="relative bg-[#F4F4F2] text-[#0C0D0F] py-24 sm:py-32 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-500 mb-5">04 / Trade or Upgrade</div>
            <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>
              Move your<br />machine on.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-neutral-600 font-body leading-relaxed">
              Apply your current car's value directly toward any certified pre-owned or new vehicle. Above-market appraisals, title transfers handled.
            </p>
            <button
              onClick={() => onNavigate('sell-your-car')}
              className="group mt-6 flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase bg-[#0C0D0F] hover:bg-[#E63946] text-white px-6 py-4 transition-colors cursor-pointer"
            >
              Value My Car
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

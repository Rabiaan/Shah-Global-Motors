import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, ChevronRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useDealership } from '../../context/DealershipContext';
import type { Vehicle } from '../../types';

interface NewCarsPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookTestDrive: (vehicle: Vehicle) => void;
  onOpenFinancing: (vehicle: Vehicle) => void;
  onOpenContact?: (vehicle: Vehicle) => void;
  onNavigate: (page: 'new-cars' | 'used-cars' | 'car-details' | 'sell-your-car' | 'services' | 'about-us' | 'contact-us') => void;
}

export default function NewCarsPage({
  onSelectVehicle,
  onBookTestDrive,
  onOpenFinancing,
  onOpenContact,
  onNavigate
}: NewCarsPageProps) {
  const { vehicles } = useDealership();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'price-desc' | 'power-desc' | 'featured'>('featured');

  const newVehicles = useMemo(() => {
    return vehicles.filter(v => v.category === 'New');
  }, [vehicles]);

  const featured = newVehicles[0];

  const uniqueMakes = useMemo(() => {
    const makes = Array.from(new Set(newVehicles.map(v => v.make)));
    return ['all', ...makes];
  }, [newVehicles]);

  const filteredVehicles = useMemo(() => {
    return newVehicles
      .filter((vehicle) => {
        if (vehicle.id === featured?.id) return false;
        const matchesSearch =
          searchQuery.trim() === '' ||
          `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.engine}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesMake = selectedMake === 'all' || vehicle.make === selectedMake;
        return matchesSearch && matchesMake;
      })
      .sort((a, b) => {
        if (priceSort === 'price-desc') return b.price - a.price;
        if (priceSort === 'power-desc') return b.specs.horsepower - a.specs.horsepower;
        return 0;
      });
  }, [newVehicles, searchQuery, selectedMake, priceSort, featured]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMake('all');
    setPriceSort('featured');
  };

  const hasFilters = searchQuery !== '' || selectedMake !== 'all' || priceSort !== 'featured';

  return (
    <div className="bg-[#F4F4F2]">
      {/* ============ 01 / CINEMATIC INTRO ============ */}
      <section className="relative bg-[#0C0D0F] text-white overflow-hidden">
        {/* oversized ghost word */}
        <div className="pointer-events-none select-none absolute -right-6 top-8 font-display font-extrabold leading-none text-[#16181C] tracking-tighter" style={{ fontSize: 'clamp(6rem, 18vw, 18rem)' }}>
          NEW
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-8 pt-6 pb-32 sm:pb-40">
          {/* micro label row */}
          <div className="flex items-center justify-between border border-[#22242A] rounded-full px-5 py-3 text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-500">
            <span className="text-[#E63946] font-bold">01 — NEW COLLECTION</span>
            <span className="hidden sm:block">SHOWROOM / MUNICH LAB</span>
            <span className="font-bold text-neutral-300">{String(newVehicles.length).padStart(2, '0')} MACHINES</span>
          </div>

          {/* display heading */}
          <div className="mt-16 sm:mt-20">
            <h1 className="font-display font-extrabold uppercase leading-[0.9] tracking-tighter" style={{ fontSize: 'clamp(3rem, 10vw, 9.5rem)' }}>
              The<br />
              Next<br />
              <span className="text-[#E63946]">Machine.</span>
            </h1>
          </div>

          {/* large hero image dominates the composition */}
          {featured && (
            <div className="relative mt-2 sm:mt-6">
              <button
                onClick={() => onSelectVehicle(featured)}
                className="group block w-full cursor-pointer"
              >
                <div className="overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.12 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    src={featured.images[0]}
                    alt={`${featured.make} ${featured.model}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-[52vh] sm:h-[68vh] object-cover object-center group-hover:scale-[1.03] transition-transform duration-[1.2s]"
                  />
                </div>
              </button>

              {/* floating spec annotation */}
              <div className="absolute left-4 sm:left-8 top-6 border-l-2 border-[#E63946] pl-3">
                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400">Power</div>
                <div className="font-display font-bold text-2xl sm:text-4xl">{featured.specs.horsepower} <span className="text-sm text-neutral-400">HP</span></div>
              </div>
              <div className="absolute right-4 sm:right-8 bottom-6 text-right border-r-2 border-[#E63946] pr-3">
                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400">0—60</div>
                <div className="font-display font-bold text-2xl sm:text-4xl">{featured.specs.acceleration.split(' ')[0]}</div>
              </div>
              <div className="absolute left-4 sm:left-8 bottom-6">
                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400">Drive</div>
                <div className="font-heading font-bold text-sm sm:text-base">{featured.specs.drivetrain?.split('(')[0]}</div>
              </div>
            </div>
          )}

          {/* featured machine caption bar */}
          {featured && (
            <div className="mt-1 border-t border-[#22242A] pt-5 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500 mb-2">Flagship — {featured.make}</div>
                <div className="font-heading font-bold text-2xl sm:text-3xl uppercase tracking-tight">
                  {featured.year} {featured.make} {featured.model}
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">From</div>
                  <div className="font-display font-bold text-2xl">${featured.price.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onSelectVehicle(featured)}
                  className="group flex items-center gap-3 bg-[#E63946] hover:bg-[#C9182B] px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                >
                  Explore Machine
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ 02 / EXPLORE THE COLLECTION ============ */}
      <section className="relative bg-[#F4F4F2]">
        {/* section header — asymmetric editorial */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 pt-20 sm:pt-28 pb-10">
          {/* red divider that "connects" from dark section */}
          <div className="absolute left-0 top-0 h-[2px] w-full bg-[#E63946]" />
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-500 mb-4">02 / The Line-up</div>
              <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-tighter text-[#0C0D0F]" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>
                Explore<br />the collection
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:pb-3"
            >
              <div className="text-right text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-500 leading-relaxed">
                Every machine hand-delivered,<br />zero kilometres, full warranty.
              </div>
            </motion.div>
          </div>

          {/* integrated horizontal filter strip — not a card */}
          <div className="mt-12 border-y border-[#D8D8D2]">
            <div className="flex flex-col xl:flex-row xl:items-center gap-4 py-5">
              <div className="flex items-center gap-2 text-[#0C0D0F]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#E63946]" />
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase font-bold">Filter</span>
              </div>

              {/* search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search make, model, engine…"
                className="flex-1 min-w-[220px] bg-transparent border-b border-[#B9B9B1] focus:border-[#E63946] outline-none pb-1 text-sm placeholder:text-neutral-400 font-body"
              />

              {/* make buttons */}
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

              {/* sort */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-500">Sort</span>
                <div className="flex rounded-full border border-[#C9C9C2] overflow-hidden">
                  {(['featured', 'price-desc', 'power-desc'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPriceSort(s)}
                      className={`px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors cursor-pointer ${
                        priceSort === s ? 'bg-[#0C0D0F] text-white' : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {s === 'featured' ? 'Featured' : s === 'price-desc' ? 'Price' : 'Power'}
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

        {/* asymmetric inventory grid — large featured + smaller, not identical cards */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 pb-24">
          {filteredVehicles.length === 0 ? (
            <div className="py-24 border-t border-[#D8D8D2] flex flex-col items-start gap-6">
              <div className="font-display font-extrabold uppercase text-3xl sm:text-4xl text-[#0C0D0F]">Nothing in the line-up.</div>
              <p className="text-sm text-neutral-500 max-w-md font-body">Adjust the filters, or let us source your exact machine direct from the factory.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-[#0C0D0F] hover:bg-[#201F22] text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-[#D8D8D2] border border-[#D8D8D2]">
              {filteredVehicles.map((vehicle, idx) => {
                // editorial asymmetric rhythm: first is wide
                const isWide = idx % 3 === 0;
                return (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: (idx % 3) * 0.05 }}
                    className={`group relative bg-[#0C0D0F] overflow-hidden ${
                      isWide ? 'md:col-span-8' : 'md:col-span-4'
                    } ${(idx + 1) % 3 === 0 ? 'md:col-span-7' : ''} ${(idx + 2) % 3 === 0 ? 'md:col-span-5' : ''}`}
                  >
                    {/* index number */}
                    <div className="absolute top-4 left-4 z-20 font-mono text-xs tracking-[0.2em] text-white/70 mix-blend-difference">
                      {String(idx + 2).padStart(2, '0')}
                    </div>

                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="block w-full cursor-pointer"
                    >
                      {/* image container — variable height for editorial rhythm */}
                      <div className={`relative ${isWide ? 'h-[46vh] md:h-[52vh]' : 'h-[46vh] md:h-[36vh]'}`}>
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.06] ${isWide ? 'object-center' : 'object-top'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D0F] via-[#0C0D0F]/10 to-transparent" />

                        {/* make label */}
                        <div className="absolute top-4 right-4 font-heading font-bold text-white/40 uppercase tracking-[0.2em] text-xs">
                          {vehicle.make}
                        </div>

                        {/* price — editorial, positioned center on wide cells */}
                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                          <div className="font-display font-bold text-3xl sm:text-4xl text-white">
                            ${vehicle.price.toLocaleString()}
                          </div>
                          <div className="w-10 h-10 bg-white text-[#0C0D0F] flex items-center justify-center group-hover:bg-[#E63946] group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* vehicle meta bar */}
                    <div className="relative z-10 -mt-2 px-5 pb-8 pt-1 bg-transparent">
                      <div className="flex items-end justify-between gap-4">
                        <h3 className="font-heading font-bold uppercase leading-tight tracking-tight text-white">
                          {vehicle.year} {vehicle.make}<br />{vehicle.model}
                        </h3>
                        <div className="text-right font-mono text-[10px] tracking-[0.15em] uppercase text-white/60 shrink-0">
                          <div>{vehicle.specs.horsepower} HP</div>
                          <div>{vehicle.bodyType}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ 03 / BESPOKE SOURCING — full bleed ============ */}
      <section className="relative bg-[#0C0D0F] text-white overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none select-none absolute -left-4 bottom-0 font-display font-extrabold leading-none text-[#16181C] tracking-tighter" style={{ fontSize: 'clamp(5rem, 16vw, 16rem)' }}>
          0%
        </div>
        <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div>
              <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#E63946] mb-5">03 / Bespoke Allocation</div>
              <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>
                Want it<br />exactly yours?
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm text-neutral-400 font-body leading-relaxed">
                Priority access to exclusive build slots, limited releases and paint-to-sample orders. Tell us the spec — we deliver it to the millimetre.
              </p>
              <button
                onClick={() => onNavigate('contact-us')}
                className="group mt-6 flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase bg-white text-[#0C0D0F] hover:bg-[#E63946] hover:text-white px-6 py-4 transition-colors cursor-pointer"
              >
                Request a Build Slot
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

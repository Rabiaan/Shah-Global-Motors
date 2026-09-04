import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCcw, 
  Eye, 
  Calendar, 
  Zap, 
  Fuel, 
  Gauge, 
  Sparkles,
  X,
  Car,
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { useDealership } from '../context/DealershipContext';
import type { Vehicle, FilterState } from '../types';

interface ShowroomCatalogProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookTestDrive: (vehicle: Vehicle) => void;
}

export default function ShowroomCatalog({ onSelectVehicle, onBookTestDrive }: ShowroomCatalogProps) {
  const { vehicles } = useDealership();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initial Filter State
  const initialFilters: FilterState = {
    searchQuery: '',
    make: 'All',
    model: '',
    category: 'All',
    availability: 'All',
    bodyType: 'All',
    fuelType: 'All',
    transmission: 'All',
    minPrice: 0,
    maxPrice: 400000,
    minYear: 2020,
    maxYear: 2026,
    maxMileage: 15000,
    sortBy: 'newest',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Extract unique filter options from vehicles
  const makeOptions: string[] = ['All', ...Array.from(new Set<string>(vehicles.map((v) => v.make)))];
  const bodyTypeOptions = ['All', 'Coupe', 'Sedan', 'SUV', 'Convertible', 'Supercar'];
  const fuelTypeOptions = ['All', 'Petrol', 'Electric', 'Hybrid', 'Diesel'];
  const transmissionOptions = ['All', 'Automatic', 'Manual', 'Dual-Clutch PDK', 'Single-Speed Fixed'];

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Filtered & Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search query match (make, model, color, description, features)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matches =
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.color.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q) ||
            v.features?.some((f) => f.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Make
        if (filters.make !== 'All' && v.make !== filters.make) return false;

        // Category (New / Used)
        if (filters.category !== 'All' && v.category !== filters.category) return false;

        // Availability
        if (filters.availability !== 'All' && v.availability !== filters.availability) return false;

        // Body type
        if (filters.bodyType !== 'All' && v.bodyType !== filters.bodyType) return false;

        // Fuel type
        if (filters.fuelType !== 'All' && v.fuelType !== filters.fuelType) return false;

        // Transmission
        if (filters.transmission !== 'All' && v.transmission !== filters.transmission) return false;

        // Price range
        if (v.price < filters.minPrice || v.price > filters.maxPrice) return false;

        // Year range
        if (v.year < filters.minYear || v.year > filters.maxYear) return false;

        // Mileage
        if (v.mileage > filters.maxMileage) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'year-desc') return b.year - a.year;
        if (filters.sortBy === 'mileage-asc') return a.mileage - b.mileage;
        // Default newest added
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      });
  }, [vehicles, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.make !== 'All') count++;
    if (filters.category !== 'All') count++;
    if (filters.availability !== 'All') count++;
    if (filters.bodyType !== 'All') count++;
    if (filters.fuelType !== 'All') count++;
    if (filters.transmission !== 'All') count++;
    if (filters.maxPrice < 400000) count++;
    if (filters.maxMileage < 15000) count++;
    if (filters.minYear > 2020) count++;
    return count;
  }, [filters]);

  return (
    <section 
      id="showroom-catalog-section"
      className="relative w-full max-w-[1480px] mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-20"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200">
        <div>
          <span 
            id="showroom-tag"
            className="text-xs font-mono font-bold tracking-widest text-[#e63946] uppercase flex items-center gap-1.5"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[#e63946] animate-pulse" />
            [ VEHICLE INVENTORY &amp; SHOWROOM_ ]
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-neutral-900 font-display tracking-tight mt-1 leading-tight">
            EXPLORE THE CURATED
            <br />
            GLOBAL COLLECTION
          </h2>
        </div>

        {/* Category Pill Switcher & Mobile Filters trigger */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-[#eef0f3] p-1 rounded-xl border border-neutral-200 shadow-inner">
            {['All', 'New', 'Used'].map((cat) => (
              <button
                key={cat}
                id={`catalog-category-${cat.toLowerCase()}-btn`}
                onClick={() => setFilters({ ...filters, category: cat })}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider font-heading transition-all cursor-pointer ${
                  filters.category === cat
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {cat === 'All' ? 'ALL CARS' : `${cat} VEHICLES`}
              </button>
            ))}
          </div>

          <button
            id="toggle-mobile-filters-btn"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-extrabold font-heading text-neutral-800 shadow-xs cursor-pointer hover:bg-neutral-50"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#e63946]" />
            <span>FILTERS {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Quick Brand Quick-Selector Chips */}
      <div className="py-4 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 shrink-0 mr-1">
          QUICK BRAND:
        </span>
        {makeOptions.map((make) => {
          const isSelected = filters.make === make;
          return (
            <button
              key={make}
              id={`quick-brand-chip-${make.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setFilters({ ...filters, make })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-xs border border-neutral-900'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {make}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Filters Sidebar (4 cols) + Vehicles List (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8">
        
        {/* ================= FILTERS SIDEBAR ================= */}
        <aside
          id="showroom-filters-sidebar"
          className={`lg:col-span-4 flex flex-col space-y-6 ${
            mobileFilterOpen ? 'fixed inset-x-4 top-20 bottom-8 z-50 overflow-y-auto bg-white shadow-2xl p-6 rounded-3xl border-2 border-neutral-800' : 'hidden lg:flex bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#e63946]" />
              <span className="text-sm font-extrabold uppercase text-neutral-900 font-heading">
                SEARCH &amp; SPEC FILTERS
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  id="reset-filters-btn"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-[#e63946] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              )}
              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="lg:hidden p-1.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Keyword Search Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
              SEARCH KEYWORD
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                id="filter-search-input"
                type="text"
                placeholder="Search Porsche, V8, PDK, AWD..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-xl pl-10 pr-9 py-2 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#e63946]"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters({ ...filters, searchQuery: '' })}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Manufacturer Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
              MANUFACTURER
            </label>
            <select
              id="filter-make-select"
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 focus:outline-hidden focus:border-[#e63946] cursor-pointer"
            >
              {makeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Manufacturers' : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Body Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
              BODY TYPE
            </label>
            <select
              id="filter-body-type-select"
              value={filters.bodyType}
              onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
              className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 focus:outline-hidden focus:border-[#e63946] cursor-pointer"
            >
              {bodyTypeOptions.map((bt) => (
                <option key={bt} value={bt}>
                  {bt === 'All' ? 'All Body Types' : bt}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel & Powertrain */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
              FUEL &amp; POWERTRAIN
            </label>
            <select
              id="filter-fuel-select"
              value={filters.fuelType}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
              className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 focus:outline-hidden focus:border-[#e63946] cursor-pointer"
            >
              {fuelTypeOptions.map((ft) => (
                <option key={ft} value={ft}>
                  {ft === 'All' ? 'All Powertrains' : ft}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
              TRANSMISSION
            </label>
            <select
              id="filter-transmission-select"
              value={filters.transmission}
              onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
              className="w-full bg-[#f8f9fa] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 focus:outline-hidden focus:border-[#e63946] cursor-pointer"
            >
              {transmissionOptions.map((tr) => (
                <option key={tr} value={tr}>
                  {tr === 'All' ? 'All Transmissions' : tr}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
              AVAILABILITY STATUS
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['All', 'Available', 'Reserved'].map((st) => (
                <button
                  key={st}
                  id={`filter-availability-${st.toLowerCase()}-btn`}
                  onClick={() => setFilters({ ...filters, availability: st })}
                  className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wider font-heading transition-all cursor-pointer ${
                    filters.availability === st
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-[#f0f2f5] text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
              <span className="uppercase font-mono text-[10px] text-neutral-500">MAX PRICE CAP</span>
              <span className="text-[#e63946] font-heading font-extrabold text-sm">
                ${(filters.maxPrice / 1000).toFixed(0)}K
              </span>
            </div>
            <input
              id="filter-price-slider"
              type="range"
              min="50000"
              max="400000"
              step="5000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-[#e63946] cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>$50K</span>
              <span>$400K+</span>
            </div>
          </div>

          {/* Mileage Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
              <span className="uppercase font-mono text-[10px] text-neutral-500">MAX MILEAGE</span>
              <span className="text-neutral-900 font-heading font-extrabold">
                {new Intl.NumberFormat('en-US').format(filters.maxMileage)} mi
              </span>
            </div>
            <input
              id="filter-mileage-slider"
              type="range"
              min="500"
              max="15000"
              step="500"
              value={filters.maxMileage}
              onChange={(e) => setFilters({ ...filters, maxMileage: Number(e.target.value) })}
              className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
            />
          </div>

          {/* Mobile close button inside sheet */}
          {mobileFilterOpen && (
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#e63946] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Apply &amp; View Results ({filteredVehicles.length})
            </button>
          )}
        </aside>

        {/* Backdrop for mobile filters */}
        {mobileFilterOpen && (
          <div 
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* ================= VEHICLES LIST & SORTING (8 cols) ================= */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Results Count & Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono flex items-center gap-2">
              <Car className="w-4 h-4 text-neutral-700" />
              <span>SHOWING <strong className="text-neutral-900 font-extrabold font-heading text-sm">{filteredVehicles.length}</strong> VEHICLES IN STOCK</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase font-mono">SORT:</span>
              <select
                id="catalog-sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                className="bg-[#f0f2f5] border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-bold text-neutral-800 focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest</option>
                <option value="mileage-asc">Mileage: Lowest</option>
              </select>
            </div>
          </div>

          {/* Vehicles Grid */}
          {filteredVehicles.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 flex flex-col items-center justify-center space-y-3 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-800 font-heading uppercase">No Vehicles Match Your Filters</h3>
              <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                Try widening your price range, clearing specific filters, or resetting to browse our entire luxury collection.
              </p>
              <button
                onClick={resetFilters}
                className="mt-3 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl uppercase font-heading transition-colors cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVehicles.map((vehicle) => {
                const formattedPrice = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(vehicle.price);

                const estimatedMonthly = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(Math.round((vehicle.price * 0.8 * 1.05) / 60));

                const availabilityBadge = {
                  Available: 'bg-emerald-500/20 text-emerald-800 border-emerald-500/40',
                  Reserved: 'bg-amber-500/20 text-amber-900 border-amber-500/40',
                  Sold: 'bg-neutral-300 text-neutral-700 border-neutral-400',
                }[vehicle.availability];

                return (
                  <motion.div
                    key={vehicle.id}
                    id={`vehicle-card-${vehicle.id}`}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group relative bg-white rounded-3xl border border-neutral-200 hover:border-neutral-400/80 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Header Area */}
                    <div 
                      onClick={() => onSelectVehicle(vehicle)}
                      className="relative h-60 w-full bg-neutral-950 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase bg-black/80 text-white backdrop-blur-md border border-white/10 shadow-sm">
                          {vehicle.category}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase border backdrop-blur-md shadow-sm ${availabilityBadge}`}>
                          ● {vehicle.availability}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold text-white bg-black/70 backdrop-blur-md border border-white/10 shadow-sm">
                        {vehicle.year}
                      </div>

                      {/* Location Badge */}
                      <div className="absolute top-12 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold text-neutral-300 bg-black/60 backdrop-blur-md">
                        <MapPin className="w-2.5 h-2.5 text-[#e63946]" />
                        <span>{vehicle.location?.split(' ')[0] || 'Showroom'}</span>
                      </div>

                      {/* Bottom Overlay Image Stats */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-bold text-[11px] font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                            <Zap className="w-3.5 h-3.5 text-[#e63946]" />
                            {vehicle.specs.horsepower} HP
                          </span>
                          <span className="flex items-center gap-1 font-bold text-[11px] font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                            <Gauge className="w-3.5 h-3.5 text-amber-400" />
                            {vehicle.specs.acceleration}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-neutral-200 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                          {new Intl.NumberFormat('en-US').format(vehicle.mileage)} mi
                        </span>
                      </div>
                    </div>

                    {/* Content & Specs Area */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            {vehicle.make} • {vehicle.bodyType}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                            {vehicle.fuelType}
                          </span>
                        </div>
                        
                        <h3 
                          onClick={() => onSelectVehicle(vehicle)}
                          className="text-lg sm:text-xl font-extrabold text-neutral-900 uppercase font-heading tracking-tight mt-1 group-hover:text-[#e63946] transition-colors cursor-pointer line-clamp-1"
                          title={`${vehicle.make} ${vehicle.model}`}
                        >
                          {vehicle.model}
                        </h3>
                        
                        <p className="text-xs text-neutral-500 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                          {vehicle.description}
                        </p>
                      </div>

                      {/* Price, Monthly Estimate & Action Buttons */}
                      <div className="pt-3 border-t border-neutral-100 flex flex-col space-y-3">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-xl sm:text-2xl font-black text-neutral-950 font-heading tracking-tight">
                              {formattedPrice}
                            </span>
                            <span className="ml-2 text-[10px] font-mono font-bold text-neutral-400">
                              (Est. {estimatedMonthly}/mo)
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase font-mono border border-emerald-200">
                            {vehicle.condition}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            id={`view-specs-btn-${vehicle.id}`}
                            onClick={() => onSelectVehicle(vehicle)}
                            className="h-10 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 font-heading transition-all cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>DETAILS</span>
                          </button>

                          <button
                            id={`test-drive-card-btn-${vehicle.id}`}
                            onClick={() => onBookTestDrive(vehicle)}
                            className="h-10 px-3 bg-[#e63946] hover:bg-[#d62839] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 font-heading transition-all shadow-xs cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>TEST DRIVE</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

import { useState, useMemo, useEffect } from 'react';
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
  MapPin, 
  LayoutGrid, 
  List, 
  Phone, 
  MessageCircle, 
  Calculator,
  ArrowLeft,
  CheckCircle2,
  Award,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useDealership } from '../context/DealershipContext';
import type { Vehicle, FilterState } from '../types';
import type { PageRoute } from './Navbar';

interface VehiclesPageProps {
  pageType: string;
  onNavigate: (page: PageRoute) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookTestDrive: (vehicle: Vehicle) => void;
  onOpenFinancing: (vehicle: Vehicle) => void;
  onOpenContact: (vehicle: Vehicle) => void;
  onOpenSellCar: () => void;
}

export default function VehiclesPage({
  pageType,
  onNavigate,
  onSelectVehicle,
  onBookTestDrive,
  onOpenFinancing,
  onOpenContact,
  onOpenSellCar,
}: VehiclesPageProps) {
  const { vehicles } = useDealership();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initial category based on pageType
  const defaultCategory = pageType === 'new-vehicles' ? 'New' : pageType === 'used-vehicles' ? 'Used' : 'All';

  // Filters State
  const initialFilters: FilterState = {
    searchQuery: '',
    make: 'All',
    model: '',
    category: defaultCategory,
    availability: 'All',
    bodyType: 'All',
    fuelType: 'All',
    transmission: 'All',
    minPrice: 0,
    maxPrice: 600000,
    minYear: 2020,
    maxYear: 2026,
    maxMileage: 30000,
    sortBy: 'newest',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync category when pageType changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: pageType === 'new-vehicles' ? 'New' : pageType === 'used-vehicles' ? 'Used' : 'All'
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageType]);

  // Extract unique filter options
  const makeOptions: string[] = ['All', ...Array.from(new Set<string>(vehicles.map((v) => v.make)))];
  const bodyTypeOptions = ['All', 'Coupe', 'Sedan', 'SUV', 'Convertible', 'Supercar'];
  const fuelTypeOptions = ['All', 'Petrol', 'Electric', 'Hybrid'];
  const transmissionOptions = ['All', 'Dual-Clutch PDK', 'Automatic', 'Manual', 'Single-Speed Fixed'];

  const resetFilters = () => {
    setFilters({
      ...initialFilters,
      category: defaultCategory
    });
  };

  // Filtered & Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search query match
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matches =
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.color.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q) ||
            v.specs?.vin?.toLowerCase().includes(q) ||
            v.features?.some((f) => f.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Make
        if (filters.make !== 'All' && v.make !== filters.make) return false;

        // Category filter
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

        // Max Mileage
        if (v.mileage > filters.maxMileage) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'year-desc') return b.year - a.year;
        if (filters.sortBy === 'mileage-asc') return a.mileage - b.mileage;
        if (filters.sortBy === 'power-desc') return (b.specs?.horsepower || 0) - (a.specs?.horsepower || 0);
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      });
  }, [vehicles, filters]);

  // Page Specific Meta & Content
  const pageMeta = useMemo(() => {
    switch (pageType) {
      case 'new-vehicles':
        return {
          badge: 'FACTORY DIRECT & ZERO MILEAGE',
          title: 'Brand New Vehicle Collection',
          description: 'Factory-allocated exotic supercars and luxury GTs with zero mileage, full manufacturer warranties, and bespoke delivery customization.',
          highlightTag: '4-Year Factory Warranty • Direct Allocations',
          availableCount: vehicles.filter(v => v.category === 'New').length,
          stats: [
            { label: 'AVERAGE HP', value: '620+ HP' },
            { label: 'ODOMETER', value: '0 MILES' },
            { label: 'WARRANTY', value: '4 YRS FACTORY' },
            { label: 'CUSTOM ORDERS', value: 'AVAILABLE' },
          ]
        };
      case 'used-vehicles':
        return {
          badge: '150-POINT CERTIFIED PRE-OWNED',
          title: 'Certified Used & Pre-Owned Fleet',
          description: 'Meticulously inspected luxury motorcars with verified service histories, multi-point mechanical audits, clean CarFax records, and comprehensive warranty coverage.',
          highlightTag: '150-Point Inspection • Verified Provenance',
          availableCount: vehicles.filter(v => v.category === 'Used').length,
          stats: [
            { label: 'AUDIT', value: '150-POINT' },
            { label: 'PROVENANCE', value: 'VERIFIED' },
            { label: 'CARFAX', value: '100% CLEAN' },
            { label: 'TRADE-IN', value: 'INSTANT OFFER' },
          ]
        };
      case 'all-cars':
      default:
        return {
          badge: 'SHAHGLOBAL COMPLETE SHOWROOM',
          title: 'All Luxury Vehicles & Supercars',
          description: 'Browse the complete inventory of brand-new allocations, limited-production track editions, and certified pre-owned exotic grand tourers.',
          highlightTag: 'Complete Dealership Fleet • Instant Delivery',
          availableCount: vehicles.length,
          stats: [
            { label: 'TOTAL FLEET', value: `${vehicles.length} VEHICLES` },
            { label: 'AVAILABLE NOW', value: `${vehicles.filter(v => v.availability === 'Available').length} READY` },
            { label: 'SHOWROOMS', value: '4 LOCATIONS' },
            { label: 'GLOBAL DELIVERY', value: 'WORLDWIDE' },
          ]
        };
    }
  }, [pageType, vehicles]);

  // Counts for quick tabs
  const allCount = vehicles.length;
  const newCount = vehicles.filter(v => v.category === 'New').length;
  const usedCount = vehicles.filter(v => v.category === 'Used').length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 pb-20">
      
      {/* 1. HERO HEADER BANNER (Luxury Dark Atmosphere) */}
      <div className="relative w-full bg-[#07080a] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 overflow-hidden shadow-2xl">
        {/* Subtle mesh background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(230,57,70,0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, rgba(40,50,70,0.3) 0%, transparent 70%)`
          }}
        />

        <div className="max-w-[1480px] mx-auto relative z-10 space-y-6">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-400">
            <button 
              onClick={() => onNavigate('new-cars')}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>SHOWROOM</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[#e63946] uppercase">{pageMeta.title}</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e63946]/15 border border-[#e63946]/30 text-[#e63946] text-[10px] font-mono font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>{pageMeta.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-display">
                {pageMeta.title}
              </h1>

              <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
                {pageMeta.description}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              {pageMeta.stats.map((stat, i) => (
                <div 
                  key={i} 
                  className="bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-2xl backdrop-blur-xs"
                >
                  <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                    {stat.label}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-white font-heading mt-0.5">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Page Switcher Tabs */}
          <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-neutral-800/80">
            <span className="text-[11px] font-mono uppercase text-neutral-400 font-bold mr-2 hidden sm:inline">
              SELECT COLLECTION:
            </span>

            <button
              id="tab-new-vehicles"
              onClick={() => onNavigate('new-cars')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                pageType === 'new-cars' || pageType === 'new-vehicles'
                  ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/30'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>NEW VEHICLES</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                pageType === 'new-cars' || pageType === 'new-vehicles' ? 'bg-black/40 text-white' : 'bg-neutral-800 text-neutral-300'
              }`}>
                {newCount}
              </span>
            </button>

            <button
              id="tab-used-vehicles"
              onClick={() => onNavigate('used-cars')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                pageType === 'used-cars' || pageType === 'used-vehicles'
                  ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-900/30'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>USED VEHICLES</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                pageType === 'used-cars' || pageType === 'used-vehicles' ? 'bg-neutral-900 text-white' : 'bg-neutral-800 text-neutral-300'
              }`}>
                {usedCount}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN CATALOG BODY */}
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Control Bar: Search, View Mode, Filter Trigger, Sort */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by Make, Model, VIN, Color..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-10 pr-10 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#e63946] focus:bg-white transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Middle: Active Count & Brand Badges */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-mono font-bold text-neutral-500 whitespace-nowrap">
              SHOWING <strong className="text-neutral-900">{filteredVehicles.length}</strong> OF {vehicles.length} VEHICLES
            </span>
          </div>

          {/* Right Controls: Sort & Layout Toggles */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>FILTERS</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase hidden sm:inline">
                SORT:
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-800 focus:outline-hidden focus:border-[#e63946] cursor-pointer"
              >
                <option value="newest">Newest Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="power-desc">Horsepower: Highest First</option>
                <option value="mileage-asc">Mileage: Lowest First</option>
              </select>
            </div>

            {/* Grid / List View Switcher */}
            <div className="hidden sm:flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Vehicle Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= FILTER SIDEBAR (DESKTOP) ================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#e63946]" />
                <span className="font-extrabold font-heading text-xs uppercase tracking-wider text-neutral-900">
                  REFINE SEARCH
                </span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] font-mono text-neutral-400 hover:text-[#e63946] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET</span>
              </button>
            </div>

            {/* Filter 1: Make */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                MANUFACTURER
              </label>
              <div className="flex flex-wrap gap-1.5">
                {makeOptions.map((make) => (
                  <button
                    key={make}
                    onClick={() => setFilters({ ...filters, make })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                      filters.make === make
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {make}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 2: Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-neutral-500">
                <span>MAX PRICE</span>
                <span className="text-neutral-900 font-extrabold text-xs">
                  ${filters.maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={500000}
                step={10000}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-[#e63946] bg-neutral-200 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>$50k</span>
                <span>$250k</span>
                <span>$500k+</span>
              </div>
            </div>

            {/* Filter 3: Body Type */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                BODY STYLE
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {bodyTypeOptions.map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setFilters({ ...filters, bodyType: bt })}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                      filters.bodyType === bt
                        ? 'bg-[#e63946] text-white font-extrabold'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 4: Fuel Type */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                POWERTRAIN
              </label>
              <div className="flex flex-wrap gap-1.5">
                {fuelTypeOptions.map((ft) => (
                  <button
                    key={ft}
                    onClick={() => setFilters({ ...filters, fuelType: ft })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      filters.fuelType === ft
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {ft}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 5: Availability */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                STATUS
              </label>
              <div className="grid grid-cols-3 gap-1">
                {['All', 'Available', 'Reserved'].map((av) => (
                  <button
                    key={av}
                    onClick={() => setFilters({ ...filters, availability: av })}
                    className={`py-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                      filters.availability === av
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Sell Car Trade-in Teaser */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 text-white space-y-2">
              <div className="text-[10px] font-mono font-bold text-[#e63946] uppercase">
                TRADE-IN VALUATION
              </div>
              <div className="text-xs font-bold font-heading">
                Selling your exotic car?
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Receive instant cash valuation and top-market trade equity in under 24 hours.
              </p>
              <button
                onClick={onOpenSellCar}
                className="w-full mt-2 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 text-[11px] font-extrabold uppercase tracking-wider font-heading transition-colors cursor-pointer"
              >
                VALUE MY CAR
              </button>
            </div>
          </aside>

          {/* ================= VEHICLE RESULTS GRID / LIST ================= */}
          <div className="lg:col-span-9 space-y-6">
            
            {filteredVehicles.length === 0 ? (
              /* Empty State */
              <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <Car className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-xl font-bold font-heading uppercase text-neutral-900">
                  No Matching Vehicles Found
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  We could not find any vehicles matching your current filter criteria. Try adjusting the price range, manufacturer, or clearing your search term.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider font-heading hover:bg-[#e63946] transition-colors cursor-pointer"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => {
                  const isNew = vehicle.category === 'New';
                  const monthlyEstimate = Math.round((vehicle.price * 0.85 * 0.065) / 12 + vehicle.price / 60);

                  return (
                    <motion.div
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Top Image & Badges */}
                      <div className="relative aspect-16/10 overflow-hidden bg-neutral-950">
                        <img
                          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80'}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded shadow-md ${
                            isNew 
                              ? 'bg-emerald-500 text-neutral-950' 
                              : 'bg-amber-400 text-neutral-950'
                          }`}>
                            {isNew ? 'BRAND NEW' : 'CERTIFIED PRE-OWNED'}
                          </span>

                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded backdrop-blur-md ${
                            vehicle.availability === 'Available'
                              ? 'bg-black/70 text-emerald-400 border border-emerald-500/30'
                              : 'bg-black/70 text-neutral-300'
                          }`}>
                            {vehicle.availability}
                          </span>
                        </div>

                        {/* Location Pill */}
                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-neutral-300 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-[#e63946]" />
                          <span>{vehicle.location?.split(' ')[0] || 'Showroom'}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        
                        {/* Title & Price */}
                        <div>
                          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono font-semibold">
                            <span>{vehicle.year} • {vehicle.bodyType}</span>
                            <span>{vehicle.mileage === 0 ? 'Zero Mileage' : `${vehicle.mileage.toLocaleString()} mi`}</span>
                          </div>

                          <h3 
                            onClick={() => onSelectVehicle(vehicle)}
                            className="text-base font-extrabold text-neutral-900 font-heading tracking-tight mt-1 hover:text-[#e63946] transition-colors cursor-pointer line-clamp-1"
                          >
                            {vehicle.make} {vehicle.model}
                          </h3>

                          {/* Price Tag */}
                          <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-xl font-black text-neutral-950 font-display">
                              ${vehicle.price.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500">
                              ~${monthlyEstimate.toLocaleString()}/mo
                            </div>
                          </div>
                        </div>

                        {/* Quick Specs 3-Column */}
                        <div className="grid grid-cols-3 gap-1.5 py-2.5 border-y border-neutral-100 text-center font-mono">
                          <div className="bg-neutral-50 p-1.5 rounded-xl">
                            <span className="text-[9px] text-neutral-400 block">POWER</span>
                            <span className="text-xs font-bold text-neutral-900">{vehicle.specs?.horsepower || 500} HP</span>
                          </div>
                          <div className="bg-neutral-50 p-1.5 rounded-xl">
                            <span className="text-[9px] text-neutral-400 block">0-60 MPH</span>
                            <span className="text-xs font-bold text-neutral-900">{vehicle.specs?.acceleration || '3.2s'}</span>
                          </div>
                          <div className="bg-neutral-50 p-1.5 rounded-xl">
                            <span className="text-[9px] text-neutral-400 block">GEARBOX</span>
                            <span className="text-xs font-bold text-neutral-900 truncate block">{vehicle.transmission.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => onSelectVehicle(vehicle)}
                            className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-extrabold uppercase tracking-wider font-heading transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>DETAILS</span>
                          </button>

                          <button
                            onClick={() => onBookTestDrive(vehicle)}
                            className="py-2.5 px-3 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-[11px] font-extrabold uppercase tracking-wider font-heading shadow-sm shadow-red-900/20 transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>TEST DRIVE</span>
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {filteredVehicles.map((vehicle) => {
                  const isNew = vehicle.category === 'New';
                  const monthlyEstimate = Math.round((vehicle.price * 0.85 * 0.065) / 12 + vehicle.price / 60);

                  return (
                    <motion.div
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm hover:shadow-lg transition-all p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6 group"
                    >
                      {/* Left: Thumbnail & Badges */}
                      <div className="relative w-full md:w-56 h-40 rounded-2xl overflow-hidden bg-neutral-950 shrink-0">
                        <img
                          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80'}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className={`absolute top-2 left-2 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                          isNew ? 'bg-emerald-500 text-neutral-950' : 'bg-amber-400 text-neutral-950'
                        }`}>
                          {isNew ? 'NEW' : 'USED'}
                        </span>
                      </div>

                      {/* Middle: Details & Specs */}
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                          <span>{vehicle.year}</span>
                          <span>•</span>
                          <span>{vehicle.bodyType}</span>
                          <span>•</span>
                          <span>{vehicle.mileage === 0 ? '0 Miles' : `${vehicle.mileage.toLocaleString()} mi`}</span>
                        </div>

                        <h3 
                          onClick={() => onSelectVehicle(vehicle)}
                          className="text-lg font-extrabold text-neutral-900 font-heading hover:text-[#e63946] transition-colors cursor-pointer"
                        >
                          {vehicle.make} {vehicle.model}
                        </h3>

                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {vehicle.description}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-1 text-xs font-mono">
                          <span className="text-neutral-700"><strong>Engine:</strong> {vehicle.engine}</span>
                          <span className="text-neutral-700"><strong>Power:</strong> {vehicle.specs?.horsepower || 500} HP</span>
                          <span className="text-neutral-700"><strong>0-60:</strong> {vehicle.specs?.acceleration || '3.2s'}</span>
                        </div>
                      </div>

                      {/* Right: Price & Buttons */}
                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
                        <div className="text-left md:text-right">
                          <div className="text-2xl font-black text-neutral-950 font-display">
                            ${vehicle.price.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-mono text-neutral-500">
                            Est. ${monthlyEstimate.toLocaleString()}/mo
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectVehicle(vehicle)}
                            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-extrabold font-heading uppercase transition-colors cursor-pointer"
                          >
                            SPECS
                          </button>
                          <button
                            onClick={() => onBookTestDrive(vehicle)}
                            className="px-4 py-2 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-extrabold font-heading uppercase transition-colors cursor-pointer"
                          >
                            TEST DRIVE
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* 3. MOBILE FILTER MODAL DRAWER */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#e63946]" />
                    <span className="font-extrabold font-heading text-sm uppercase">FILTER INVENTORY</span>
                  </div>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Make */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-neutral-500">MAKE</label>
                  <div className="flex flex-wrap gap-1.5">
                    {makeOptions.map((make) => (
                      <button
                        key={make}
                        onClick={() => setFilters({ ...filters, make })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          filters.make === make ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {make}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span>MAX PRICE</span>
                    <span>${filters.maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={500000}
                    step={10000}
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full accent-[#e63946]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold uppercase"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#e63946] text-white text-xs font-bold uppercase"
                >
                  Apply ({filteredVehicles.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

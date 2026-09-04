import { useState, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Mail, 
  DollarSign, 
  Search, 
  Filter, 
  X, 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  TrendingUp, 
  Gauge, 
  Zap, 
  Upload, 
  Check, 
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Server,
  Download,
  Database,
  Copy,
  FileCode
} from 'lucide-react';
import { useDealership } from '../context/DealershipContext';
import type { 
  Vehicle, 
  VehicleCategory, 
  VehicleAvailability, 
  VehicleBodyType, 
  FuelType, 
  TransmissionType, 
  VehicleCondition,
  EnquiryStatus,
  TestDriveStatus,
  SellCarStatus
} from '../types';

import heroCarImage from '../assets/images/hero_sports_car_1788175114586.jpg';
import porscheImage from '../assets/images/porsche_side_neon_1788184894615.jpg';
import amgImage from '../assets/images/amg_gt_desert_1788184924301.jpg';
import bmwImage from '../assets/images/bmw_m4_front_1788184910389.jpg';
import ferrariImage from '../assets/images/ferrari_roma_red_1788184938857.jpg';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout?: () => void;
  currentUser?: { username: string; email: string; role: string } | null;
}

export default function AdminDashboard({ onClose, onLogout, currentUser }: AdminDashboardProps) {
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setVehicleAvailability,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    testDrives,
    updateTestDriveStatus,
    deleteTestDrive,
    sellRequests,
    updateSellRequestStatus,
    deleteSellRequest,
    resetAllData,
    landedCars,
    addLandedCar,
    updateLandedCar,
    deleteLandedCar,
  } = useDealership();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'landed-cars' | 'test-drives' | 'enquiries' | 'sell-requests' | 'system'>('inventory');

  // Inventory Table Search & Filters
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<'All' | 'New' | 'Used'>('All');
  const [inventoryAvailabilityFilter, setInventoryAvailabilityFilter] = useState<'All' | 'Available' | 'Sold' | 'Reserved'>('All');

  // Add / Edit Vehicle Modal State
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Form fields for Add/Edit Vehicle
  const [formMake, setFormMake] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formYear, setFormYear] = useState<number>(2025);
  const [formPrice, setFormPrice] = useState<number>(185000);
  const [formMileage, setFormMileage] = useState<number>(500);
  const [formEngine, setFormEngine] = useState('4.0L Twin-Turbocharged V8');
  const [formTransmission, setFormTransmission] = useState<TransmissionType>('Dual-Clutch PDK');
  const [formFuelType, setFormFuelType] = useState<FuelType>('Petrol');
  const [formBodyType, setFormBodyType] = useState<VehicleBodyType>('Coupe');
  const [formColor, setFormColor] = useState('Obsidian Black');
  const [formCategory, setFormCategory] = useState<VehicleCategory>('New');
  const [formAvailability, setFormAvailability] = useState<VehicleAvailability>('Available');
  const [formCondition, setFormCondition] = useState<VehicleCondition>('Brand New');
  const [formLocation, setFormLocation] = useState('Silicon Valley Showroom');
  const [formDescription, setFormDescription] = useState('');
  const [formHp, setFormHp] = useState<number>(650);
  const [formTopSpeed, setFormTopSpeed] = useState('205 mph');
  const [formAcceleration, setFormAcceleration] = useState('2.8s');
  const [formVin, setFormVin] = useState('WP0AB2A99PS190001');
  const [formFeatures, setFormFeatures] = useState('Ceramic Brakes, Carbon Bucket Seats, Sport Exhaust, 3D Sound, Track Telemetry');
  const [formImages, setFormImages] = useState<string[]>([porscheImage]);

  // Sell Car Valuation Modal
  const [valuationOfferAmount, setValuationOfferAmount] = useState<number>(200000);
  const [selectedSellReqId, setSelectedSellReqId] = useState<string | null>(null);

  // Landed / Featured Car (BROWSE WHAT JUST LANDED) management state
  const [landedModalOpen, setLandedModalOpen] = useState(false);
  const [landedEditingId, setLandedEditingId] = useState<string | null>(null);
  const [landedName, setLandedName] = useState('');
  const [landedNumber, setLandedNumber] = useState('');
  const [landedDescription, setLandedDescription] = useState('');
  const [landedImage, setLandedImage] = useState('');

  // Stats
  const totalInventoryValue = vehicles.reduce((acc, v) => acc + (v.availability !== 'Sold' ? v.price : 0), 0);
  const availableCount = vehicles.filter((v) => v.availability === 'Available').length;
  const reservedCount = vehicles.filter((v) => v.availability === 'Reserved').length;
  const soldCount = vehicles.filter((v) => v.availability === 'Sold').length;
  const pendingTestDrivesCount = testDrives.filter((td) => td.status === 'Pending').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const pendingSellRequestsCount = sellRequests.filter((sr) => sr.status === 'Pending' || sr.status === 'Under Review').length;

  // Filtered inventory
  const filteredVehicles = vehicles.filter((v) => {
    if (inventoryCategoryFilter !== 'All' && v.category !== inventoryCategoryFilter) return false;
    if (inventoryAvailabilityFilter !== 'All' && v.availability !== inventoryAvailabilityFilter) return false;
    if (inventorySearch) {
      const q = inventorySearch.toLowerCase();
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.color.toLowerCase().includes(q) ||
        v.specs.vin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingVehicleId(null);
    setFormMake('');
    setFormModel('');
    setFormYear(2025);
    setFormPrice(185000);
    setFormMileage(250);
    setFormEngine('4.0L Twin-Turbocharged V8');
    setFormTransmission('Dual-Clutch PDK');
    setFormFuelType('Petrol');
    setFormBodyType('Coupe');
    setFormColor('Obsidian Black');
    setFormCategory(inventoryCategoryFilter === 'Used' ? 'Used' : 'New');
    setFormAvailability('Available');
    setFormCondition('Brand New');
    setFormLocation('Silicon Valley Showroom');
    setFormDescription('Exclusive supercar tailored for unrivaled track dynamics and street presence.');
    setFormHp(650);
    setFormTopSpeed('205 mph');
    setFormAcceleration('2.8s');
    setFormVin(`VIN${Date.now().toString(36).toUpperCase()}`);
    setFormFeatures('Ceramic Brakes, Carbon Bucket Seats, Sport Exhaust, 3D Sound, Track Telemetry');
    setFormImages([heroCarImage]);
    setIsVehicleModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setFormMake(v.make);
    setFormModel(v.model);
    setFormYear(v.year);
    setFormPrice(v.price);
    setFormMileage(v.mileage);
    setFormEngine(v.engine);
    setFormTransmission(v.transmission);
    setFormFuelType(v.fuelType);
    setFormBodyType(v.bodyType);
    setFormColor(v.color);
    setFormCategory(v.category);
    setFormAvailability(v.availability);
    setFormCondition(v.condition);
    setFormLocation(v.location);
    setFormDescription(v.description);
    setFormHp(v.specs.horsepower);
    setFormTopSpeed(v.specs.topSpeed);
    setFormAcceleration(v.specs.acceleration);
    setFormVin(v.specs.vin);
    setFormFeatures(v.features.join(', '));
    setFormImages(v.images.length > 0 ? v.images : [heroCarImage]);
    setIsVehicleModalOpen(true);
  };

  // Save Vehicle
  const handleSaveVehicle = (e: FormEvent) => {
    e.preventDefault();
    const featuresArray = formFeatures
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, {
        make: formMake,
        model: formModel,
        year: Number(formYear),
        price: Number(formPrice),
        mileage: Number(formMileage),
        engine: formEngine,
        transmission: formTransmission,
        fuelType: formFuelType,
        bodyType: formBodyType,
        color: formColor,
        category: formCategory,
        availability: formAvailability,
        condition: formCondition,
        location: formLocation,
        description: formDescription,
        features: featuresArray,
        images: formImages.length > 0 ? formImages : [heroCarImage],
        specs: {
          horsepower: Number(formHp),
          topSpeed: formTopSpeed,
          acceleration: formAcceleration,
          vin: formVin,
        },
      });
    } else {
      addVehicle({
        make: formMake,
        model: formModel,
        year: Number(formYear),
        price: Number(formPrice),
        mileage: Number(formMileage),
        engine: formEngine,
        transmission: formTransmission,
        fuelType: formFuelType,
        bodyType: formBodyType,
        color: formColor,
        category: formCategory,
        availability: formAvailability,
        condition: formCondition,
        location: formLocation,
        description: formDescription,
        features: featuresArray,
        images: formImages.length > 0 ? formImages : [heroCarImage],
        specs: {
          horsepower: Number(formHp),
          topSpeed: formTopSpeed,
          acceleration: formAcceleration,
          vin: formVin,
        },
      });
    }

    setIsVehicleModalOpen(false);
  };

  // Open Add Landed Car Modal
  const handleOpenAddLanded = () => {
    setLandedEditingId(null);
    setLandedName('');
    setLandedNumber('');
    setLandedDescription('');
    setLandedImage('');
    setLandedModalOpen(true);
  };

  // Open Edit Landed Car Modal
  const handleOpenEditLanded = (car: { id: string; number: string; name: string; description: string; image: string }) => {
    setLandedEditingId(car.id);
    setLandedName(car.name);
    setLandedNumber(car.number);
    setLandedDescription(car.description);
    setLandedImage(car.image);
    setLandedModalOpen(true);
  };

  // Save Landed Car
  const handleSaveLanded = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      number: landedNumber || String(landedCars.length + 1).padStart(2, '0'),
      name: landedName,
      description: landedDescription,
      image: landedImage || heroCarImage,
    };
    if (landedEditingId) {
      updateLandedCar(landedEditingId, payload);
    } else {
      addLandedCar(payload);
    }
    setLandedModalOpen(false);
  };

  // Convert accepted customer car to dealership inventory
  const handleConvertSellRequestToInventory = (req: (typeof sellRequests)[0]) => {
    addVehicle({
      make: req.make,
      model: req.model,
      year: req.year,
      price: req.offerAmount ? Math.round(req.offerAmount * 1.15) : req.expectedPrice,
      mileage: req.mileage,
      engine: 'High-Performance Powertrain',
      transmission: 'Dual-Clutch PDK',
      fuelType: 'Petrol',
      bodyType: 'Coupe',
      color: 'Custom Specified Finish',
      category: 'Used',
      availability: 'Available',
      condition: req.condition,
      location: 'Silicon Valley Showroom',
      description: req.notes || `Purchased directly from private collector ${req.name}. Complete service records verified.`,
      features: ['Full Dealership Inspection', 'Clear Title', 'Factory Warranty', 'Ceramic Protection'],
      images: req.images.length > 0 ? req.images : [heroCarImage],
      specs: {
        horsepower: 600,
        topSpeed: '195 mph',
        acceleration: '3.1s',
        vin: `VIN${Date.now().toString(36).toUpperCase()}`,
      },
    });

    updateSellRequestStatus(req.id, 'Accepted');
    setActiveTab('inventory');
  };

  return (
    <div 
      id="admin-dashboard-container"
      className="fixed inset-0 z-50 bg-[#08090b] text-white flex flex-col overflow-hidden"
    >
      {/* Top Navbar */}
      <header className="h-16 px-4 sm:px-8 border-b border-neutral-800 bg-[#0c0e12] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tighter text-white font-heading">
              Shahglobal<span className="text-[#e63946]">.</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase bg-[#e63946]/20 border border-[#e63946]/40 text-[#e63946] px-2 py-0.5 rounded ml-2">
              STAFF PORTAL
            </span>
          </div>
        </div>

        {/* Action / User Session / Return to client preview */}
        <div className="flex items-center gap-2.5">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-[11px] text-neutral-300 font-bold">
                {currentUser.username}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                ({currentUser.role || 'Admin'})
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-neutral-950 hover:bg-neutral-200 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">VIEW CLIENT SHOWROOM</span>
            <span className="sm:hidden">SHOWROOM</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-colors cursor-pointer"
              title="Sign out of Admin Session"
            >
              <span>LOGOUT</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Layout: Left Tabs Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-neutral-800 bg-[#0c0e12] p-4 flex flex-col justify-between flex-shrink-0 hidden md:flex">
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold uppercase text-neutral-500 tracking-wider px-3 py-2">
              MANAGEMENT MODULES
            </div>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4" />
                <span>Vehicle Inventory</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === 'inventory' ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                {vehicles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('landed-cars')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                activeTab === 'landed-cars'
                  ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Landed / Featured</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === 'landed-cars' ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                {landedCars.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('test-drives')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                activeTab === 'test-drives'
                  ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Test Drives</span>
              </div>
              {pendingTestDrivesCount > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold animate-pulse">
                  {pendingTestDrivesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Customer Enquiries</span>
              </div>
              {newEnquiriesCount > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400 text-black font-extrabold">
                  {newEnquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sell-requests')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                activeTab === 'sell-requests'
                  ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>Sell Car Requests</span>
              </div>
              {pendingSellRequestsCount > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-400 text-black font-extrabold">
                  {pendingSellRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>cPanel &amp; MySQL DB</span>
              </div>
            </button>
          </div>

          {/* Quick Staff Info */}
          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white">cPanel MySQL Ready</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1 font-mono">
              Auto-sync + schema.sql export
            </div>
          </div>
        </aside>

        {/* Mobile Tab Navigation Strip */}
        <div className="md:hidden flex overflow-x-auto border-b border-neutral-800 bg-[#0c0e12] p-2 gap-2 flex-shrink-0 no-scrollbar">
          {[
            { id: 'inventory', label: 'Inventory', count: vehicles.length },
            { id: 'landed-cars', label: 'Landed', count: landedCars.length },
            { id: 'test-drives', label: 'Test Drives', count: pendingTestDrivesCount },
            { id: 'enquiries', label: 'Enquiries', count: newEnquiriesCount },
            { id: 'sell-requests', label: 'Sell Requests', count: pendingSellRequestsCount },
            { id: 'system', label: 'cPanel & DB', count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-heading whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#e63946] text-white'
                  : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 custom-scrollbar">
          
          {/* Key Metrics Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-[#0f1115] border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono font-bold uppercase">TOTAL INVENTORY VALUE</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-black text-white font-heading">
                  ${(totalInventoryValue / 1000000).toFixed(2)}M
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  Across {vehicles.length} Units
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1115] border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono font-bold uppercase">AVAILABILITY BREAKDOWN</span>
                <Car className="w-4 h-4 text-[#e63946]" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">{availableCount} Avail</span>
                <span className="text-xs font-bold text-amber-400">{reservedCount} Resv</span>
                <span className="text-xs font-bold text-neutral-500">{soldCount} Sold</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1115] border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono font-bold uppercase">PENDING TEST DRIVES</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-heading">
                  {pendingTestDrivesCount}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  {testDrives.length} Total Bookings
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1115] border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono font-bold uppercase">SELL CAR LEADS</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-black text-cyan-400 font-heading">
                  {pendingSellRequestsCount}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  {sellRequests.length} Total Valuations
                </div>
              </div>
            </div>

          </div>

          {/* ================= TAB 1: INVENTORY MANAGEMENT ================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">

              {/* Inventory Sub-Tabs: All / New Cars / Used Cars */}
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#0f1115] border border-neutral-800">
                {([
                  { id: 'All' as const, label: 'ALL VEHICLES', icon: Layers },
                  { id: 'New' as const, label: 'NEW CARS', icon: Sparkles },
                  { id: 'Used' as const, label: 'USED CARS', icon: Car },
                ]).map((st) => {
                  const Icon = st.icon;
                  const count = st.id === 'All'
                    ? vehicles.length
                    : vehicles.filter((v) => v.category === st.id).length;
                  const isActive = inventoryCategoryFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setInventoryCategoryFilter(st.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#e63946] text-white shadow-lg shadow-red-900/30'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{st.label}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f1115] border border-neutral-800">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search inventory by make, model, VIN..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Availability Filter */}
                  <select
                    value={inventoryAvailabilityFilter}
                    onChange={(e) => setInventoryAvailabilityFilter(e.target.value as any)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>

                  {/* Add New Vehicle Button */}
                  <button
                    id="add-vehicle-admin-btn"
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-[#e63946] hover:bg-[#d62839] text-white rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-colors shadow-md shadow-red-900/30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD VEHICLE</span>
                  </button>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="rounded-2xl bg-[#0f1115] border border-neutral-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/40">
                  <div className="text-xs font-bold uppercase text-neutral-300 font-heading flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#e63946]" />
                    <span>
                      {inventoryCategoryFilter === 'All'
                        ? 'FULL VEHICLE INVENTORY'
                        : inventoryCategoryFilter === 'New'
                        ? 'NEW CARS INVENTORY'
                        : 'USED CARS INVENTORY'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">
                    SHOWING {filteredVehicles.length} OF {vehicles.length} UNITS
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-900/80 text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-4">Vehicle</th>
                        <th className="p-4">Specs &amp; Category</th>
                        <th className="p-4">Price ($)</th>
                        <th className="p-4">Mileage</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-medium">
                      {filteredVehicles.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-neutral-500 font-mono">
                            No vehicles found matching search parameters.
                          </td>
                        </tr>
                      ) : (
                        filteredVehicles.map((vehicle) => {
                          const formattedPrice = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                          }).format(vehicle.price);

                          return (
                            <tr key={vehicle.id} className="hover:bg-neutral-900/40 transition-colors">
                              {/* Vehicle Image & Title */}
                              <td className="p-4 flex items-center gap-3">
                                <div className="w-16 h-11 rounded-lg overflow-hidden bg-neutral-950 flex-shrink-0 border border-neutral-800">
                                  <img
                                    src={vehicle.images[0]}
                                    alt={vehicle.model}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div>
                                  <div className="font-extrabold text-white font-heading text-sm">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                  </div>
                                  <div className="text-[10px] text-neutral-500 font-mono">
                                    VIN: {vehicle.specs.vin}
                                  </div>
                                </div>
                              </td>

                              {/* Specs & Category */}
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-neutral-200 mr-2">
                                  {vehicle.category}
                                </span>
                                <span className="text-neutral-400">
                                  {vehicle.specs.horsepower} HP • {vehicle.transmission.split(' ')[0]}
                                </span>
                              </td>

                              {/* Price */}
                              <td className="p-4 font-bold text-white font-heading text-sm">
                                {formattedPrice}
                              </td>

                              {/* Mileage */}
                              <td className="p-4 font-mono text-neutral-300">
                                {new Intl.NumberFormat('en-US').format(vehicle.mileage)} mi
                              </td>

                              {/* Location */}
                              <td className="p-4 text-neutral-400 truncate max-w-[140px]">
                                {vehicle.location.split(' ')[0]}
                              </td>

                              {/* Availability Switcher */}
                              <td className="p-4">
                                <select
                                  value={vehicle.availability}
                                  onChange={(e) => setVehicleAvailability(vehicle.id, e.target.value as VehicleAvailability)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border focus:outline-hidden cursor-pointer ${
                                    vehicle.availability === 'Available'
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                      : vehicle.availability === 'Reserved'
                                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                  }`}
                                >
                                  <option value="Available" className="bg-neutral-900 text-white">● Available</option>
                                  <option value="Reserved" className="bg-neutral-900 text-white">● Reserved</option>
                                  <option value="Sold" className="bg-neutral-900 text-white">● Sold</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(vehicle)}
                                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                    title="Edit vehicle"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) {
                                        deleteVehicle(vehicle.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white transition-colors cursor-pointer"
                                    title="Delete vehicle"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================= LANDED / FEATURED CARS (BROWSE WHAT JUST LANDED) ================= */}
          {activeTab === 'landed-cars' && (
            <div className="space-y-4">

              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f1115] border border-neutral-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold uppercase font-heading text-white">
                      FEATURED CARS — "BROWSE WHAT JUST LANDED"
                    </h3>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 max-w-xl">
                    These luxury cars display in the featured accordion on the home page. Managed separately from the main showroom inventory.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddLanded}
                  className="flex items-center gap-2 px-4 py-2 bg-[#e63946] hover:bg-[#d62839] text-white rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-colors shadow-md shadow-red-900/30 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD FEATURED CAR</span>
                </button>
              </div>

              {/* Landed Cars Grid */}
              {landedCars.length === 0 ? (
                <div className="rounded-2xl bg-[#0f1115] border border-neutral-800 p-12 text-center">
                  <div className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                    No featured cars yet
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Click "ADD FEATURED CAR" to showcase a car in the home page section.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {landedCars.map((car) => (
                    <div
                      key={car.id}
                      className="rounded-2xl bg-[#0f1115] border border-neutral-800 overflow-hidden flex flex-col"
                    >
                      <div className="relative h-40 overflow-hidden bg-neutral-950">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center text-xs font-extrabold shadow">
                          {car.number}
                        </span>
                      </div>
                      <div className="p-4 flex-1 space-y-1.5">
                        <div className="font-extrabold text-white font-heading text-sm">
                          {car.name}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
                          {car.description}
                        </p>
                      </div>
                      <div className="p-4 pt-2 flex items-center justify-between border-t border-neutral-800/80">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditLanded(car)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit featured car"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${car.name}" from the featured "BROWSE WHAT JUST LANDED" section?`)) {
                                deleteLandedCar(car.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white transition-colors cursor-pointer"
                            title="Remove featured car"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Added {car.dateAdded}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: TEST DRIVES ================= */}
          {activeTab === 'test-drives' && (
            <div className="space-y-4">              <div className="p-4 rounded-2xl bg-[#0f1115] border border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase font-heading text-white">
                  CUSTOMER TEST DRIVE BOOKINGS ({testDrives.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testDrives.map((td) => (
                  <div 
                    key={td.id}
                    className="p-5 rounded-2xl bg-[#0f1115] border border-neutral-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-11 rounded-lg overflow-hidden bg-neutral-950 flex-shrink-0 border border-neutral-800">
                          <img src={td.vehicleImage} alt={td.vehicleName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">REQUESTED ASSET</span>
                          <h4 className="text-sm font-bold text-white font-heading">{td.vehicleName}</h4>
                        </div>
                      </div>

                      <select
                        value={td.status}
                        onChange={(e) => updateTestDriveStatus(td.id, e.target.value as TestDriveStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border focus:outline-hidden cursor-pointer ${
                          td.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : td.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : td.status === 'Completed'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}
                      >
                        <option value="Pending" className="bg-neutral-900 text-white">Pending Review</option>
                        <option value="Approved" className="bg-neutral-900 text-white">Approved / Scheduled</option>
                        <option value="Completed" className="bg-neutral-900 text-white">Completed</option>
                        <option value="Cancelled" className="bg-neutral-900 text-white">Cancelled</option>
                      </select>
                    </div>

                    {/* Customer & Appointment Details */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-mono block">Customer Name</span>
                        <span className="font-bold text-white">{td.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-mono block">Appointment</span>
                        <span className="font-bold text-amber-400">{td.preferredDate} @ {td.preferredTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-mono block">Phone</span>
                        <span className="font-mono text-neutral-300">{td.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-mono block">Location Hub</span>
                        <span className="text-neutral-300 truncate block">{td.hubLocation}</span>
                      </div>
                    </div>

                    {td.notes && (
                      <p className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                        <span className="font-bold text-neutral-300">Driver Notes: </span>{td.notes}
                      </p>
                    )}

                    {/* Quick outreach buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${td.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase font-heading flex items-center gap-1.5"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>CALL</span>
                        </a>
                        <a
                          href={`https://wa.me/${td.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase font-heading flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WHATSAPP</span>
                        </a>
                      </div>

                      <button
                        onClick={() => deleteTestDrive(td.id)}
                        className="text-neutral-500 hover:text-red-400 text-xs p-1"
                        title="Delete request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: ENQUIRIES & LEADS ================= */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0f1115] border border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase font-heading text-white">
                  CLIENT ENQUIRIES &amp; SALES LEADS ({enquiries.length})
                </h3>
              </div>

              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div 
                    key={enq.id}
                    className="p-5 rounded-2xl bg-[#0f1115] border border-neutral-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#e63946] uppercase font-bold mr-2">
                          PREF: {enq.preferredContact.toUpperCase()}
                        </span>
                        <span className="text-sm font-bold text-white font-heading">
                          {enq.name} ({enq.email})
                        </span>
                      </div>

                      <select
                        value={enq.status}
                        onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border focus:outline-hidden cursor-pointer ${
                          enq.status === 'New'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                            : enq.status === 'In Progress'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : enq.status === 'Contacted'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}
                      >
                        <option value="New" className="bg-neutral-900 text-white">New Lead</option>
                        <option value="In Progress" className="bg-neutral-900 text-white">In Progress</option>
                        <option value="Contacted" className="bg-neutral-900 text-white">Contacted</option>
                        <option value="Closed" className="bg-neutral-900 text-white">Closed</option>
                      </select>
                    </div>

                    <div className="text-xs font-bold text-neutral-200">
                      Subject: <span className="text-white">{enq.subject}</span>
                      {enq.vehicleName && <span className="text-[#e63946] ml-2">[{enq.vehicleName}]</span>}
                    </div>

                    <p className="text-xs text-neutral-400 bg-neutral-900/70 p-3 rounded-xl border border-neutral-800 leading-relaxed">
                      {enq.message}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${enq.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase font-heading flex items-center gap-1.5"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{enq.phone}</span>
                        </a>
                        <a
                          href={`mailto:${enq.email}`}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase font-heading flex items-center gap-1.5"
                        >
                          <Mail className="w-3 h-3 text-[#e63946]" />
                          <span>EMAIL</span>
                        </a>
                      </div>

                      <button
                        onClick={() => deleteEnquiry(enq.id)}
                        className="text-neutral-500 hover:text-red-400 text-xs p-1"
                        title="Delete enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: SELL CAR REQUESTS ================= */}
          {activeTab === 'sell-requests' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0f1115] border border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase font-heading text-white">
                  CUSTOMER SELL &amp; CONSIGNMENT PROPOSALS ({sellRequests.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sellRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-[#0f1115] border border-neutral-800 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                            SELLER: {req.name} ({req.phone})
                          </span>
                          <h4 className="text-base font-bold text-white font-heading mt-0.5">
                            {req.year} {req.make} {req.model}
                          </h4>
                        </div>

                        <select
                          value={req.status}
                          onChange={(e) => updateSellRequestStatus(req.id, e.target.value as SellCarStatus)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border focus:outline-hidden cursor-pointer ${
                            req.status === 'Accepted'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : req.status === 'Offer Made'
                              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                              : req.status === 'Under Review'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}
                        >
                          <option value="Pending" className="bg-neutral-900 text-white">Pending Review</option>
                          <option value="Under Review" className="bg-neutral-900 text-white">Under Valuation Review</option>
                          <option value="Offer Made" className="bg-neutral-900 text-white">Offer Made</option>
                          <option value="Accepted" className="bg-neutral-900 text-white">Accepted &amp; Bought</option>
                          <option value="Rejected" className="bg-neutral-900 text-white">Rejected</option>
                        </select>
                      </div>

                      {/* Photo preview */}
                      {req.images && req.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto my-3 pb-1">
                          {req.images.map((img, i) => (
                            <div key={i} className="w-20 h-14 rounded-lg overflow-hidden border border-neutral-800 flex-shrink-0">
                              <img src={img} alt="Car" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Specs card */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase font-mono block">Expected Price</span>
                          <span className="font-extrabold text-amber-400 font-heading">
                            ${req.expectedPrice.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase font-mono block">Mileage</span>
                          <span className="font-mono text-white">{req.mileage.toLocaleString()} mi</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase font-mono block">Condition</span>
                          <span className="font-bold text-neutral-300">{req.condition}</span>
                        </div>
                      </div>

                      {req.notes && (
                        <p className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 mt-2">
                          <span className="font-bold text-neutral-300">Seller Notes: </span>{req.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions & Convert to Inventory */}
                    <div className="pt-3 border-t border-neutral-800 flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${req.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-[10px] font-bold uppercase font-heading flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WHATSAPP OFFER</span>
                          </a>
                        </div>

                        <button
                          onClick={() => deleteSellRequest(req.id)}
                          className="text-neutral-500 hover:text-red-400 text-xs p-1"
                          title="Delete request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Convert to Inventory Button */}
                      <button
                        onClick={() => handleConvertSellRequestToInventory(req)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-2 rounded-xl text-xs uppercase tracking-wider font-heading flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>APPROVE &amp; CONVERT TO SHOWROOM INVENTORY</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: cPanel MySQL DATABASE & SYSTEM ================= */}
          {activeTab === 'system' && (
            <div className="space-y-6 max-w-4xl">
              
              {/* Option B: cPanel Architecture Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e121a] to-[#0a0c10] border border-neutral-800 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Server className="w-3.5 h-3.5" />
                      <span>SELECTED: CPANEL OPTION B (NATIVE MYSQL + PHP API)</span>
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white">
                      cPanel Hosting &amp; MySQL Database Suite
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-xl">
                      Your application includes production-ready PHP REST endpoints and SQL schema files configured for native cPanel MariaDB/MySQL servers.
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-col gap-2">
                    <a
                      href="/api/schema.sql"
                      download="shahglobal_schema.sql"
                      className="px-4 py-2.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD SCHEMA.SQL</span>
                    </a>
                    <a
                      href="/api/config.php"
                      download="config.php"
                      className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-heading uppercase tracking-wider flex items-center justify-center gap-2 border border-neutral-700 transition-all cursor-pointer"
                    >
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>DOWNLOAD CONFIG.PHP</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Step-by-step cPanel Deployment Guide */}
              <div className="p-6 rounded-3xl bg-[#0f1115] border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase font-heading text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>4-STEP CPANEL DEPLOYMENT GUIDE</span>
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-500">PHP 7.4 - 8.3+ COMPATIBLE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#e63946]">
                      <span className="w-5 h-5 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center text-[10px]">1</span>
                      <span>CREATE MYSQL DATABASE IN CPANEL</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Log into your cPanel &gt; open <strong>MySQL Database Wizard</strong> &gt; create database (e.g. <code className="text-neutral-300 bg-black/50 px-1.5 py-0.5 rounded">user_shahglobal</code>), create a user with all privileges, and note the password.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#e63946]">
                      <span className="w-5 h-5 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center text-[10px]">2</span>
                      <span>IMPORT SCHEMA.SQL IN PHPMYADMIN</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      In cPanel, click <strong>phpMyAdmin</strong> &gt; select your database &gt; click <strong>Import</strong> tab &gt; choose the downloaded <code className="text-neutral-300 bg-black/50 px-1.5 py-0.5 rounded">schema.sql</code> file and click Go.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#e63946]">
                      <span className="w-5 h-5 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center text-[10px]">3</span>
                      <span>CONFIGURE API/CONFIG.PHP</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Open <code className="text-neutral-300 bg-black/50 px-1.5 py-0.5 rounded">public_html/api/config.php</code> in cPanel File Manager and enter your DB name, username, and password.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#e63946]">
                      <span className="w-5 h-5 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center text-[10px]">4</span>
                      <span>UPLOAD BUILD FILES TO PUBLIC_HTML</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Upload the contents of the compiled <code className="text-neutral-300 bg-black/50 px-1.5 py-0.5 rounded">dist/</code> directory straight into your cPanel <code className="text-neutral-300 bg-black/50 px-1.5 py-0.5 rounded">public_html/</code> directory.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Export & Reset Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Backup / Export Current Inventory */}
                <div className="p-6 rounded-3xl bg-[#0f1115] border border-neutral-800 space-y-3">
                  <h4 className="text-sm font-bold uppercase font-heading text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>BACKUP / EXPORT DATA</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Export all current active showroom inventory ({vehicles.length} vehicles), test drives ({testDrives.length}), and enquiries ({enquiries.length}).
                  </p>
                  <button
                    onClick={() => {
                      const exportPayload = {
                        dealership: 'Shahglobal Luxury Dealership',
                        exportedAt: new Date().toISOString(),
                        vehicles,
                        testDrives,
                        enquiries,
                        sellRequests,
                      };
                      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `shahglobal_backup_${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-extrabold uppercase font-heading flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <span>DOWNLOAD JSON BACKUP</span>
                  </button>
                </div>

                {/* Reset to Default */}
                <div className="p-6 rounded-3xl bg-[#0f1115] border border-neutral-800 space-y-3">
                  <h4 className="text-sm font-bold uppercase font-heading text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#e63946]" />
                    <span>DATABASE RESEEDING</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Restore all showroom inventory, specs, and test records to the factory luxury vehicle collection.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Reset entire dealership inventory and enquiries to factory seed data?')) {
                        resetAllData();
                        alert('Dealership inventory has been reset to default luxury collection.');
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-red-950/80 border border-neutral-700 hover:border-red-600 text-white text-xs font-extrabold uppercase font-heading flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-[#e63946]" />
                    <span>RESET TO DEFAULT SEED DATA</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ================= ADD / EDIT VEHICLE MODAL ================= */}
      <AnimatePresence>
        {isVehicleModalOpen && (
          <div
            id="vehicle-form-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setIsVehicleModalOpen(false)}
          >
            <motion.div
              id="vehicle-form-card"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#0f1115] border border-neutral-800 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl text-white my-auto max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#e63946]" />
                  <h3 className="text-base font-bold font-heading uppercase">
                    {editingVehicleId ? 'EDIT VEHICLE INVENTORY ASSET' : 'ADD NEW VEHICLE TO SHOWROOM'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form */}
              <form onSubmit={handleSaveVehicle} className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                
                {/* Basic Identity */}
                <div className="space-y-3">
                  <div className="text-xs font-mono font-bold uppercase text-[#e63946]">
                    1. MAKE, MODEL &amp; PRICING
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Make / Brand *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Porsche"
                        value={formMake}
                        onChange={(e) => setFormMake(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Model &amp; Edition *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 911 GT3 RS"
                        value={formModel}
                        onChange={(e) => setFormModel(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Model Year *</label>
                      <input
                        type="number"
                        required
                        value={formYear}
                        onChange={(e) => setFormYear(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Price ($ USD) *</label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Mileage (Miles) *</label>
                      <input
                        type="number"
                        required
                        value={formMileage}
                        onChange={(e) => setFormMileage(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Exterior Finish *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chalk White"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>
                  </div>
                </div>

                {/* Categorization & Status */}
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="text-xs font-mono font-bold uppercase text-[#e63946]">
                    2. CATEGORY, BODY &amp; STATUS
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Category *</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as VehicleCategory)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      >
                        <option value="New">New Vehicle</option>
                        <option value="Used">Used Vehicle</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Availability *</label>
                      <select
                        value={formAvailability}
                        onChange={(e) => setFormAvailability(e.target.value as VehicleAvailability)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Body Type *</label>
                      <select
                        value={formBodyType}
                        onChange={(e) => setFormBodyType(e.target.value as VehicleBodyType)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      >
                        <option value="Coupe">Coupe</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Supercar">Supercar</option>
                        <option value="Hypercar">Hypercar</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Condition *</label>
                      <select
                        value={formCondition}
                        onChange={(e) => setFormCondition(e.target.value as VehicleCondition)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      >
                        <option value="Brand New">Brand New</option>
                        <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                        <option value="Collector Grade">Collector Grade</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="text-xs font-mono font-bold uppercase text-[#e63946]">
                    3. ENGINE, POWERTRAIN &amp; PERFORMANCE
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Engine *</label>
                      <input
                        type="text"
                        required
                        value={formEngine}
                        onChange={(e) => setFormEngine(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Transmission *</label>
                      <select
                        value={formTransmission}
                        onChange={(e) => setFormTransmission(e.target.value as TransmissionType)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      >
                        <option value="Dual-Clutch PDK">Dual-Clutch PDK</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                        <option value="Single-Speed Fixed">Single-Speed Fixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Fuel / Powertrain *</label>
                      <select
                        value={formFuelType}
                        onChange={(e) => setFormFuelType(e.target.value as FuelType)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                        <option value="Diesel">Diesel</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Horsepower (HP) *</label>
                      <input
                        type="number"
                        required
                        value={formHp}
                        onChange={(e) => setFormHp(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">0-60 MPH Time *</label>
                      <input
                        type="text"
                        required
                        value={formAcceleration}
                        onChange={(e) => setFormAcceleration(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Top Speed *</label>
                      <input
                        type="text"
                        required
                        value={formTopSpeed}
                        onChange={(e) => setFormTopSpeed(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">VIN Number *</label>
                      <input
                        type="text"
                        required
                        value={formVin}
                        onChange={(e) => setFormVin(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Location, Description & Features */}
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="text-xs font-mono font-bold uppercase text-[#e63946]">
                    4. LOCATION, DESCRIPTION &amp; FEATURES
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">Showroom Location *</label>
                    <select
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                    >
                      <option>Silicon Valley Showroom</option>
                      <option>Geneva Track Facility</option>
                      <option>Munich High-Speed Center</option>
                      <option>Tokyo Studio Experience</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">Vehicle Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                      Key Equipment &amp; Features (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={formFeatures}
                      onChange={(e) => setFormFeatures(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsVehicleModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold font-heading uppercase text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold font-heading uppercase tracking-wider shadow-md shadow-red-900/30"
                  >
                    {editingVehicleId ? 'UPDATE VEHICLE ASSET' : 'PUBLISH TO SHOWROOM'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADD / EDIT LANDED FEATURED CAR MODAL ================= */}
      <AnimatePresence>
        {landedModalOpen && (
          <div
            id="landed-car-form-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setLandedModalOpen(false)}
          >
            <motion.div
              id="landed-car-form-card"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#0f1115] border border-neutral-800 rounded-[28px] overflow-hidden shadow-2xl text-white my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold font-heading uppercase">
                    {landedEditingId ? 'EDIT FEATURED CAR' : 'ADD FEATURED CAR'}
                  </h3>
                </div>
                <button
                  onClick={() => setLandedModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveLanded} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">Display Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 01"
                      value={landedNumber}
                      onChange={(e) => setLandedNumber(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-neutral-400 block mb-1">Car Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Porsche 911 Turbo S"
                      value={landedName}
                      onChange={(e) => setLandedName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Featured Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /src/assets/..."
                    value={landedImage}
                    onChange={(e) => setLandedImage(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-[#e63946]"
                  />
                  {landedImage && (
                    <div className="mt-2 h-28 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                      <img src={landedImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = '0.3')} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Short Description</label>
                  <textarea
                    rows={3}
                    value={landedDescription}
                    onChange={(e) => setLandedDescription(e.target.value)}
                    placeholder="UPPERCASE one-liner shown when expanded..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setLandedModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold font-heading uppercase text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold font-heading uppercase tracking-wider shadow-md shadow-red-900/30"
                  >
                    {landedEditingId ? 'UPDATE FEATURED CAR' : 'ADD TO "JUST LANDED"'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

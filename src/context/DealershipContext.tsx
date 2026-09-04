import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Vehicle, 
  CustomerEnquiry, 
  TestDriveRequest, 
  SellCarRequest,
  LandedCar,
  VehicleAvailability,
  EnquiryStatus,
  TestDriveStatus,
  SellCarStatus
} from '../types';

import porscheImage from '../assets/images/porsche_side_neon_1788184894615.jpg';
import bmwImage from '../assets/images/bmw_m4_front_1788184910389.jpg';
import amgImage from '../assets/images/amg_gt_desert_1788184924301.jpg';
import ferrariImage from '../assets/images/ferrari_roma_red_1788184938857.jpg';
import heroCarImage from '../assets/images/hero_sports_car_1788175114586.jpg';
import blueCarImage from '../assets/images/blue_sports_car_rear_1788186462478.jpg';
import bronzePorscheImage from '../assets/images/bronze_porsche_front_1788186462478.jpg';
import silverCarImage from '../assets/images/silver_car_reflection_1788185679713.jpg';

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    make: 'Porsche',
    model: '911 Turbo S',
    year: 2024,
    price: 230000,
    mileage: 1200,
    engine: '3.8L Twin-Turbocharged Boxer 6',
    transmission: 'Dual-Clutch PDK',
    fuelType: 'Petrol',
    bodyType: 'Coupe',
    color: 'Chalk White / Carbon Accent',
    category: 'New',
    availability: 'Available',
    description: 'The pinnacle of Porsche everyday supercar engineering. Equipped with ceramic composite brakes (PCCB), front axle lift system, Burmester high-end surround sound, and sport exhaust system.',
    condition: 'Brand New',
    location: 'Silicon Valley Showroom',
    features: [
      'PCCB Ceramic Brakes',
      'Front Axle Lift System',
      'Burmester 3D Surround Audio',
      'Sport Chrono Package',
      'Full Carbon Bucket Seats',
      'Matrix LED Headlights in Glacier Ice',
      'Porsche Dynamic Chassis Control (PDCC)',
      'Night Vision Assist'
    ],
    images: [
      porscheImage,
      bronzePorscheImage,
      heroCarImage,
      silverCarImage
    ],
    specs: {
      horsepower: 640,
      topSpeed: '205 mph (330 km/h)',
      acceleration: '2.6s (0-60 mph)',
      torque: '590 lb-ft @ 2,500 rpm',
      drivetrain: 'All-Wheel Drive (AWD)',
      vin: 'WP0AD2A99PS198421'
    },
    dateAdded: '2026-08-20'
  },
  {
    id: 'veh-02',
    make: 'BMW',
    model: 'M4 Competition M xDrive',
    year: 2024,
    price: 96500,
    mileage: 3400,
    engine: '3.0L BMW M TwinPower Turbo Inline-6',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Coupe',
    color: 'Isle of Man Green Metallic',
    category: 'Used',
    availability: 'Available',
    description: 'High-revving M TwinPower powerhouse pushing 503 hp. Featuring M Carbon Exterior Package, M Drive Professional with drift analyzer, laser headlights, and head-up display.',
    condition: 'Certified Pre-Owned',
    location: 'Munich High-Speed Center',
    features: [
      'M xDrive with 2WD RWD Drift Mode',
      'M Carbon Bucket Seats',
      'Harman Kardon Premium Sound',
      'BMW Laserlight Headlamps',
      'Carbon Fiber Aero Roof',
      'Wireless Apple CarPlay & Android Auto',
      'Head-Up Display with Track HUD',
      'Active Blind Spot & Lane Assist'
    ],
    images: [
      bmwImage,
      heroCarImage,
      silverCarImage
    ],
    specs: {
      horsepower: 503,
      topSpeed: '180 mph (290 km/h)',
      acceleration: '3.4s (0-60 mph)',
      torque: '479 lb-ft @ 2,750 rpm',
      drivetrain: 'Rear-Biased All-Wheel Drive',
      vin: 'WBA33AY07PFP91204'
    },
    dateAdded: '2026-08-18'
  },
  {
    id: 'veh-03',
    make: 'Mercedes-Benz',
    model: 'AMG GT Coupe 63 S E Performance',
    year: 2025,
    price: 198000,
    mileage: 450,
    engine: '4.0L Handcrafted AMG V8 Biturbo + Electric Motor',
    transmission: 'Dual-Clutch PDK',
    fuelType: 'Hybrid',
    bodyType: 'Coupe',
    color: 'Magno Selenite Matte Grey',
    category: 'New',
    availability: 'Available',
    description: 'Formula 1 hybrid powertrain technology on the open road. With combined 805 hp and unbelievable instant torque response, AMG active ride control, and rear-axle steering.',
    condition: 'Brand New',
    location: 'Geneva Track Facility',
    features: [
      'AMG Performance 4MATIC+ AWD',
      'Active Rear-Axle Steering',
      'AMG Ceramic High-Performance Brakes',
      'Nappa Leather Exclusive Interior',
      'Burmester High-End 3D Audio',
      'Aerodynamics Package with Active Spoiler',
      'AMG Track Pace Telemetry Logger',
      '360-Degree Surround Vision Camera'
    ],
    images: [
      amgImage,
      bronzePorscheImage,
      heroCarImage
    ],
    specs: {
      horsepower: 805,
      topSpeed: '199 mph (320 km/h)',
      acceleration: '2.7s (0-60 mph)',
      torque: '1,047 lb-ft Combined',
      drivetrain: 'AMG Performance 4MATIC+',
      vin: 'W1K1923881A004819'
    },
    dateAdded: '2026-08-25'
  },
  {
    id: 'veh-04',
    make: 'Ferrari',
    model: 'Roma Spider V8',
    year: 2024,
    price: 278000,
    mileage: 820,
    engine: '3.9L Twin-Turbocharged 90° V8',
    transmission: 'Dual-Clutch PDK',
    fuelType: 'Petrol',
    bodyType: 'Convertible',
    color: 'Rosso Corsa Red / Cuoio Leather',
    category: 'New',
    availability: 'Reserved',
    description: 'The contemporary embodiment of carefree 1950s and 60s Rome. Features an innovative soft-top fabric roof that deploys in 13.5 seconds at speeds up to 37 mph.',
    condition: 'Collector Grade',
    location: 'Tokyo Studio Experience',
    features: [
      'Tailored Bespoke Soft Top',
      'Ferrari Dynamic Enhancer (FDE)',
      'Manettino 5-Position Drive Mode Dial',
      'Full Electric Daytona Heated Seats',
      'Passenger Display Infotainment',
      'Carbon Fiber Driver Zone with LEDs',
      'JBL Professional Sound System',
      '20" Forged Diamond Finish Rims'
    ],
    images: [
      ferrariImage,
      heroCarImage,
      bronzePorscheImage
    ],
    specs: {
      horsepower: 612,
      topSpeed: '199 mph (320 km/h)',
      acceleration: '3.1s (0-60 mph)',
      torque: '561 lb-ft @ 3,000 rpm',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      vin: 'ZFF89VFA5P0281944'
    },
    dateAdded: '2026-08-15'
  },
  {
    id: 'veh-05',
    make: 'Lamborghini',
    model: 'Huracán Tecnica',
    year: 2023,
    price: 310000,
    mileage: 4800,
    engine: '5.2L Naturally Aspirated V10',
    transmission: 'Dual-Clutch PDK',
    fuelType: 'Petrol',
    bodyType: 'Supercar',
    color: 'Verde Selvans Pearl Green',
    category: 'Used',
    availability: 'Available',
    description: 'The purest emotional sports car bridge between street refinement and circuit ferocity. The heart of the STO packaged in an everyday usable aerodynamic profile.',
    condition: 'Excellent',
    location: 'Silicon Valley Showroom',
    features: [
      'Naturally Aspirated 5.2L V10 Symphony',
      'Rear-Wheel Steering & Torque Vectoring',
      'Carbon Ceramic Brakes (CCB)',
      'Titanium Exhaust System',
      'Alcantara Sportivo Interior with Contrast Stitching',
      'Sensory LDVI Super-Brain Dynamic Controller',
      'Front Lifting System',
      'Telemetry App System'
    ],
    images: [
      heroCarImage,
      porscheImage,
      silverCarImage
    ],
    specs: {
      horsepower: 631,
      topSpeed: '202 mph (325 km/h)',
      acceleration: '2.9s (0-60 mph)',
      torque: '417 lb-ft @ 6,500 rpm',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      vin: 'ZHWUB1ZF8PLA08912'
    },
    dateAdded: '2026-08-10'
  },
  {
    id: 'veh-06',
    make: 'Porsche',
    model: 'Taycan Turbo GT',
    year: 2025,
    price: 245000,
    mileage: 180,
    engine: 'Dual Permanent-Magnet Synchronous Motors',
    transmission: 'Single-Speed Fixed',
    fuelType: 'Electric',
    bodyType: 'Sedan',
    color: 'Frozen Blue Metallic',
    category: 'New',
    availability: 'Sold',
    description: 'The fastest four-door electric production car ever created. Silicon carbide inverter technology delivering 1,019 hp with Attack Mode boost for track dominance.',
    condition: 'Brand New',
    location: 'Munich High-Speed Center',
    features: [
      'Active Ride Suspension System',
      'Attack Mode 10-Second Peak Overboost (1,019 HP)',
      'Porsche Ceramic Composite Brakes (PCCB)',
      '21" Lightweight Forged Wheels',
      'Passenger Touchscreen Display',
      '320 kW DC Ultra-Fast Charging (10-80% in 18 min)',
      'Panoramic Glass Fixed Sunroof',
      'Rear Seat Entertainment Displays'
    ],
    images: [
      bronzePorscheImage,
      porscheImage,
      heroCarImage
    ],
    specs: {
      horsepower: 1019,
      topSpeed: '190 mph (305 km/h)',
      acceleration: '2.1s (0-60 mph)',
      torque: '988 lb-ft Instant',
      drivetrain: 'All-Wheel Drive (AWD)',
      vin: 'WP0BB2Y14PSA19042'
    },
    dateAdded: '2026-08-05'
  }
];

// Default cars featured in the "BROWSE WHAT JUST LANDED" home section
const INITIAL_LANDED_CARS: LandedCar[] = [
  {
    id: 'landed-01',
    number: '01',
    name: 'BMW M4 Competition',
    description: 'TWIN-TURBOCHARGED INLINE-6 DELIVERING RAZOR SHARP DYNAMICS AND TRACK-BRED AGILITY.',
    image: bmwImage,
    dateAdded: '2026-08-30',
  },
  {
    id: 'landed-03',
    number: '03',
    name: 'Porsche 911 Turbo S',
    description: 'BREATHTAKING SPEED AND PRECISION HANDLING WRAPPED IN TRULY ICONIC DESIGN.',
    image: porscheImage,
    dateAdded: '2026-08-29',
  },
  {
    id: 'landed-04',
    number: '04',
    name: 'Mercedes-Benz AMG GT',
    description: 'HANDCRAFTED AMG 4.0L V8 BITURBO WITH AWE-INSPIRING MUSCLE AND UNRIVALED PRESENCE.',
    image: amgImage,
    dateAdded: '2026-08-28',
  },
  {
    id: 'landed-02',
    number: '02',
    name: 'Ferrari Roma Spider',
    description: 'TIMELESS LA DOLCE VITA ELEGANCE WITH FRONT-MID V8 PERFORMANCE AND OPEN-TOP THRILLS.',
    image: ferrariImage,
    dateAdded: '2026-08-27',
  },
];

const INITIAL_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: 'enq-01',
    name: 'Marcus Vance',
    email: 'm.vance@vancetech.io',
    phone: '+1 (415) 890-2104',
    whatsapp: '+14158902104',
    preferredContact: 'whatsapp',
    subject: 'Porsche 911 Turbo S In-Person Viewing',
    message: 'Hello, I would like to arrange a private viewing for the 2024 Chalk White Turbo S this coming Thursday afternoon. Is home delivery possible to Marin County?',
    vehicleId: 'veh-01',
    vehicleName: 'Porsche 911 Turbo S',
    status: 'New',
    createdAt: '2026-08-30T14:20:00Z'
  },
  {
    id: 'enq-02',
    name: 'Elena Rostova',
    email: 'elena.rostova@genevafunds.ch',
    phone: '+41 22 790 4410',
    preferredContact: 'phone',
    subject: 'Financing terms for AMG GT 63 S',
    message: 'We are looking to finance the AMG GT 63 through BNP Paribas for corporate fleet registration. Please provide the amortisation schedule and tax deductible documents.',
    vehicleId: 'veh-03',
    vehicleName: 'Mercedes-Benz AMG GT Coupe 63 S',
    status: 'In Progress',
    createdAt: '2026-08-29T10:15:00Z'
  },
  {
    id: 'enq-03',
    name: 'Kenji Takahashi',
    email: 'k.takahashi@tokyodesign.co.jp',
    phone: '+81 3 5555 0192',
    whatsapp: '+81355550192',
    preferredContact: 'whatsapp',
    subject: 'Ferrari Roma Spider reservation confirmation',
    message: 'Confirming down payment deposit for the reserved Ferrari Roma Spider. When can we schedule export customs clearance?',
    vehicleId: 'veh-04',
    vehicleName: 'Ferrari Roma Spider V8',
    status: 'Contacted',
    createdAt: '2026-08-28T08:30:00Z'
  }
];

const INITIAL_TEST_DRIVES: TestDriveRequest[] = [
  {
    id: 'td-01',
    vehicleId: 'veh-01',
    vehicleName: 'Porsche 911 Turbo S',
    vehicleImage: porscheImage,
    name: 'Julian Sterling',
    phone: '+1 (650) 334-9021',
    email: 'j.sterling@sterlingcapital.com',
    preferredDate: '2026-09-04',
    preferredTime: '14:00 PM',
    hubLocation: 'Silicon Valley Showroom',
    notes: 'Interested in track dynamics and ceramic brake feel.',
    status: 'Pending',
    createdAt: '2026-08-31T06:10:00Z'
  },
  {
    id: 'td-02',
    vehicleId: 'veh-02',
    vehicleName: 'BMW M4 Competition M xDrive',
    vehicleImage: bmwImage,
    name: 'Oliver Thorne',
    phone: '+49 89 2442 8801',
    email: 'oliver.t@autoworks.de',
    preferredDate: '2026-09-02',
    preferredTime: '11:00 AM',
    hubLocation: 'Munich High-Speed Center',
    notes: 'Testing Autobahn acceleration stability.',
    status: 'Approved',
    createdAt: '2026-08-30T11:45:00Z'
  },
  {
    id: 'td-03',
    vehicleId: 'veh-05',
    vehicleName: 'Lamborghini Huracán Tecnica',
    vehicleImage: heroCarImage,
    name: 'Siddharth Rao',
    phone: '+971 50 918 2234',
    email: 'siddharth.r@emiratesventures.ae',
    preferredDate: '2026-08-29',
    preferredTime: '16:30 PM',
    hubLocation: 'Tokyo Studio Experience',
    notes: 'Completed session. Customer is considering final allocation.',
    status: 'Completed',
    createdAt: '2026-08-27T16:00:00Z'
  }
];

const INITIAL_SELL_REQUESTS: SellCarRequest[] = [
  {
    id: 'sell-01',
    name: 'Alexander Wright',
    phone: '+1 (408) 555-0182',
    whatsapp: '+14085550182',
    make: 'Aston Martin',
    model: 'DBS Superleggera V12',
    year: 2022,
    mileage: 6200,
    expectedPrice: 240000,
    condition: 'Excellent',
    notes: 'One owner, full Aston Martin dealership service history, protected with XPEL Stealth PPF from day one.',
    images: [
      heroCarImage,
      silverCarImage
    ],
    status: 'Under Review',
    offerAmount: 232000,
    createdAt: '2026-08-30T09:12:00Z'
  },
  {
    id: 'sell-02',
    name: 'Claire Beauchamp',
    phone: '+33 6 42 19 88 00',
    whatsapp: '+33642198800',
    make: 'Porsche',
    model: '911 GT3 Touring (992)',
    year: 2023,
    mileage: 3100,
    expectedPrice: 225000,
    condition: 'Collector Grade',
    notes: 'Manual 6-speed gearbox, carbon ceramic brakes, Shark Blue with full leather interior.',
    images: [
      porscheImage
    ],
    status: 'Offer Made',
    offerAmount: 218000,
    createdAt: '2026-08-28T15:40:00Z'
  }
];

interface SubmitEnquiryData {
  name: string;
  email: string;
  phone: string;
  preferredContact: 'phone' | 'whatsapp' | 'email';
  subject: string;
  message: string;
}

interface SubmitTestDriveData {
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

interface DealershipContextType {
  // Vehicles
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'dateAdded'>) => void;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  setVehicleAvailability: (id: string, status: VehicleAvailability) => void;
  getVehicleById: (id: string) => Vehicle | undefined;

  // Landed / Featured Cars (BROWSE WHAT JUST LANDED section)
  landedCars: LandedCar[];
  addLandedCar: (car: Omit<LandedCar, 'id' | 'dateAdded'>) => void;
  updateLandedCar: (id: string, updated: Partial<LandedCar>) => void;
  deleteLandedCar: (id: string) => void;

  // Enquiries
  enquiries: CustomerEnquiry[];
  addEnquiry: (enquiry: Omit<CustomerEnquiry, 'id' | 'status' | 'createdAt'>) => void;
  submitCustomerEnquiry: (data: SubmitEnquiryData) => Promise<void>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  deleteEnquiry: (id: string) => void;

  // Test Drives
  testDrives: TestDriveRequest[];
  addTestDrive: (booking: Omit<TestDriveRequest, 'id' | 'status' | 'createdAt'>) => void;
  submitTestDriveRequest: (data: SubmitTestDriveData) => Promise<void>;
  updateTestDriveStatus: (id: string, status: TestDriveStatus) => void;
  deleteTestDrive: (id: string) => void;

  // Sell Car
  sellRequests: SellCarRequest[];
  addSellRequest: (request: Omit<SellCarRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateSellRequestStatus: (id: string, status: SellCarStatus, offerAmount?: number) => void;
  deleteSellRequest: (id: string) => void;

  // State Management / Navigation Helpers
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  activeView: 'home' | 'catalog' | 'detail' | 'sell' | 'financing' | 'contact' | 'admin';
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'sell' | 'financing' | 'contact' | 'admin') => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  resetAllData: () => void;
}

const DealershipContext = createContext<DealershipContextType | null>(null);

const STORAGE_KEYS = {
  VEHICLES: 'shahglobal_vehicles_v1',
  ENQUIRIES: 'shahglobal_enquiries_v1',
  TEST_DRIVES: 'shahglobal_test_drives_v1',
  SELL_REQUESTS: 'shahglobal_sell_requests_v1',
  LANDED_CARS: 'shahglobal_landed_cars_v1',
};

export const DealershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [testDrives, setTestDrives] = useState<TestDriveRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEST_DRIVES);
      return saved ? JSON.parse(saved) : INITIAL_TEST_DRIVES;
    } catch {
      return INITIAL_TEST_DRIVES;
    }
  });

  const [sellRequests, setSellRequests] = useState<SellCarRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELL_REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_SELL_REQUESTS;
    } catch {
      return INITIAL_SELL_REQUESTS;
    }
  });

  const [landedCars, setLandedCars] = useState<LandedCar[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANDED_CARS);
      return saved ? JSON.parse(saved) : INITIAL_LANDED_CARS;
    } catch {
      return INITIAL_LANDED_CARS;
    }
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'detail' | 'sell' | 'financing' | 'contact' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEST_DRIVES, JSON.stringify(testDrives));
  }, [testDrives]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELL_REQUESTS, JSON.stringify(sellRequests));
  }, [sellRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANDED_CARS, JSON.stringify(landedCars));
  }, [landedCars]);

  // Vehicle CRUD
  const addVehicle = (newVeh: Omit<Vehicle, 'id' | 'dateAdded'>) => {
    const vehicle: Vehicle = {
      ...newVeh,
      id: `veh-${Date.now().toString(36)}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setVehicles((prev) => [vehicle, ...prev]);
  };

  const updateVehicle = (id: string, updated: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
    if (selectedVehicle?.id === id) {
      setSelectedVehicle((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(null);
    }
  };

  const setVehicleAvailability = (id: string, status: VehicleAvailability) => {
    updateVehicle(id, { availability: status });
  };

  const getVehicleById = (id: string) => {
    return vehicles.find((v) => v.id === id);
  };

  // Landed / Featured Cars CRUD
  const addLandedCar = (car: Omit<LandedCar, 'id' | 'dateAdded'>) => {
    const newCar: LandedCar = {
      ...car,
      id: `landed-${Date.now().toString(36)}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setLandedCars((prev) => [newCar, ...prev]);
  };

  const updateLandedCar = (id: string, updated: Partial<LandedCar>) => {
    setLandedCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteLandedCar = (id: string) => {
    setLandedCars((prev) => prev.filter((c) => c.id !== id));
  };

  // Submit Enquiry (component-friendly wrapper)
  const submitCustomerEnquiry = async (data: SubmitEnquiryData) => {
    const newEnq: CustomerEnquiry = {
      ...data,
      id: `enq-${Date.now().toString(36)}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setEnquiries((prev) => [newEnq, ...prev]);
  };

  // Enquiries
  const addEnquiry = (enquiryData: Omit<CustomerEnquiry, 'id' | 'status' | 'createdAt'>) => {
    const newEnq: CustomerEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now().toString(36)}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setEnquiries((prev) => [newEnq, ...prev]);
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  // Submit Test Drive (component-friendly wrapper)
  const submitTestDriveRequest = async (data: SubmitTestDriveData) => {
    const vehicle = vehicles.find(v => v.id === data.vehicleId);
    const newBooking: TestDriveRequest = {
      id: `td-${Date.now().toString(36)}`,
      vehicleId: data.vehicleId,
      vehicleName: data.vehicleName,
      vehicleImage: vehicle?.images[0] || '',
      name: data.customerName,
      phone: data.customerPhone,
      email: data.customerEmail,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      hubLocation: vehicle?.location || 'Silicon Valley Showroom',
      notes: data.notes,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setTestDrives((prev) => [newBooking, ...prev]);
  };

  // Test Drives
  const addTestDrive = (booking: Omit<TestDriveRequest, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: TestDriveRequest = {
      ...booking,
      id: `td-${Date.now().toString(36)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setTestDrives((prev) => [newBooking, ...prev]);
  };

  const updateTestDriveStatus = (id: string, status: TestDriveStatus) => {
    setTestDrives((prev) =>
      prev.map((td) => (td.id === id ? { ...td, status } : td))
    );
  };

  const deleteTestDrive = (id: string) => {
    setTestDrives((prev) => prev.filter((td) => td.id !== id));
  };

  // Sell Car
  const addSellRequest = (req: Omit<SellCarRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: SellCarRequest = {
      ...req,
      id: `sell-${Date.now().toString(36)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setSellRequests((prev) => [newReq, ...prev]);
  };

  const updateSellRequestStatus = (id: string, status: SellCarStatus, offerAmount?: number) => {
    setSellRequests((prev) =>
      prev.map((sr) => (sr.id === id ? { ...sr, status, ...(offerAmount !== undefined ? { offerAmount } : {}) } : sr))
    );
  };

  const deleteSellRequest = (id: string) => {
    setSellRequests((prev) => prev.filter((sr) => sr.id !== id));
  };

  const resetAllData = () => {
    setVehicles(INITIAL_VEHICLES);
    setEnquiries(INITIAL_ENQUIRIES);
    setTestDrives(INITIAL_TEST_DRIVES);
    setSellRequests(INITIAL_SELL_REQUESTS);
    setLandedCars(INITIAL_LANDED_CARS);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.TEST_DRIVES);
    localStorage.removeItem(STORAGE_KEYS.SELL_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.LANDED_CARS);
  };

  return (
    <DealershipContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        setVehicleAvailability,
        getVehicleById,
        landedCars,
        addLandedCar,
        updateLandedCar,
        deleteLandedCar,
        enquiries,
        addEnquiry,
        submitCustomerEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        testDrives,
        addTestDrive,
        submitTestDriveRequest,
        updateTestDriveStatus,
        deleteTestDrive,
        sellRequests,
        addSellRequest,
        updateSellRequestStatus,
        deleteSellRequest,
        selectedVehicle,
        setSelectedVehicle,
        activeView,
        setActiveView,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        resetAllData,
      }}
    >
      {children}
    </DealershipContext.Provider>
  );
};

export const useDealership = () => {
  const context = useContext(DealershipContext);
  if (!context) {
    throw new Error('useDealership must be used within a DealershipProvider');
  }
  return context;
};

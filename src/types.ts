export type VehicleCategory = 'New' | 'Used';
export type VehicleAvailability = 'Available' | 'Sold' | 'Reserved';export type VehicleBodyType = 'Coupe' | 'Sedan' | 'SUV' | 'Convertible' | 'Supercar' | 'Hypercar';
export type FuelType = 'Petrol' | 'Electric' | 'Hybrid' | 'Diesel';
export type TransmissionType = 'Automatic' | 'Manual' | 'Dual-Clutch PDK' | 'Single-Speed Fixed';
export type VehicleCondition = 'Brand New' | 'Certified Pre-Owned' | 'Excellent' | 'Collector Grade' | 'Good';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number; // in miles
  engine: string;
  transmission: TransmissionType;
  fuelType: FuelType;
  bodyType: VehicleBodyType;
  color: string;
  category: VehicleCategory;
  availability: VehicleAvailability;
  description: string;
  condition: VehicleCondition;
  location: string;
  features: string[];
  images: string[];
  specs: {
    horsepower: number;
    topSpeed: string;
    acceleration: string; // e.g. "2.7s 0-60 mph"
    torque?: string;
    drivetrain?: string;
    vin: string;
  };
  dateAdded: string;
}

// A car featured in the "BROWSE WHAT JUST LANDED" home section.
// Managed separately from the main showroom Vehicle inventory.
export interface LandedCar {
  id: string;
  number: string;   // e.g. "01", "02"
  name: string;     // e.g. "BMW M4 Competition"
  description: string;
  image: string;
  dateAdded: string;
}

export type EnquiryStatus = 'New' | 'In Progress' | 'Contacted' | 'Closed';

export interface CustomerEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  preferredContact: 'phone' | 'whatsapp' | 'email';
  subject: string;
  message: string;
  vehicleId?: string;
  vehicleName?: string;
  status: EnquiryStatus;
  createdAt: string;
}

export type TestDriveStatus = 'Pending' | 'Approved' | 'Completed' | 'Cancelled';

export interface TestDriveRequest {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  hubLocation: string;
  notes?: string;
  status: TestDriveStatus;
  createdAt: string;
}

export type SellCarStatus = 'Pending' | 'Under Review' | 'Offer Made' | 'Accepted' | 'Rejected';

export interface SellCarRequest {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  expectedPrice: number;
  condition: VehicleCondition;
  notes?: string;
  images: string[];
  status: SellCarStatus;
  offerAmount?: number;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  make: string;
  model: string;
  category: string; // 'All' | 'New' | 'Used'
  availability: string; // 'All' | 'Available' | 'Sold' | 'Reserved'
  bodyType: string;
  fuelType: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  maxMileage: number;
  sortBy: 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc' | 'newest';
}

export interface BankPartner {
  id: string;
  name: string;
  logo: string;
  minRate: string;
  maxTenure: string;
  badge: string;
}

export interface ShowroomLocation {
  id: string;
  city: string;
  title: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
  coordinates: { lat: number; lng: number };
}


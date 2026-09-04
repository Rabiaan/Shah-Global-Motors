import { useState, useEffect } from 'react';
import Navbar, { type PageRoute } from './components/Navbar';
import FooterSection from './components/FooterSection';

// Dedicated Page Views
import HomePage from './components/pages/HomePage';
import NewCarsPage from './components/pages/NewCarsPage';
import UsedCarsPage from './components/pages/UsedCarsPage';
import CarDetailsPage from './components/pages/CarDetailsPage';
import SellYourCarPage from './components/pages/SellYourCarPage';
import ServicesPage from './components/pages/ServicesPage';
import AboutUsPage from './components/pages/AboutUsPage';
import ContactUsPage from './components/pages/ContactUsPage';

// Modals & Admin
import VehicleDetailModal from './components/VehicleDetailModal';
import TestDriveModal from './components/TestDriveModal';
import SellCarModal from './components/SellCarModal';
import FinancingModal from './components/FinancingModal';
import ContactModal from './components/ContactModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import Modals from './components/Modals';

import { DealershipProvider, useDealership } from './context/DealershipContext';
import type { Vehicle } from './types';
import { Shield } from 'lucide-react';

interface AdminSession {
  username: string;
  email: string;
  role: string;
  token?: string;
}

function DealershipApp() {
  const { vehicles } = useDealership();

  // Page Routing State (Default to 'home' flagship landing page)
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  // Currently viewed vehicle for Car Details page & Detail modal
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);

  // Modal & View States
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState<Vehicle | null>(null);
  const [testDriveVehicle, setTestDriveVehicle] = useState<Vehicle | null>(null);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);

  const [financingVehicle, setFinancingVehicle] = useState<Vehicle | null>(null);
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);

  const [contactVehicle, setContactVehicle] = useState<Vehicle | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [isSellCarOpen, setIsSellCarOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = localStorage.getItem('shahglobal_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [stayWithUsOpen, setStayWithUsOpen] = useState(false);

  // Sync path routing: /, /new-cars, /used-cars, /car-details, /sell-your-car, /services, /about-us, /contact-us, /admin
  useEffect(() => {
    const applyPath = () => {
      const raw = window.location.pathname.toLowerCase();
      const path = raw.endsWith('/') && raw !== '/' ? raw.slice(0, -1) : raw;

      if (path === '/admin') {
        setIsAdminOpen(true);
      } else if (path === '/' || path === '/home') {
        setCurrentPage('home');
        setIsAdminOpen(false);
      } else if (path === '/new-cars' || path === '/new-vehicles' || path === '/new') {
        setCurrentPage('new-cars');
        setIsAdminOpen(false);
      } else if (path === '/used-cars' || path === '/used-vehicles' || path === '/used') {
        setCurrentPage('used-cars');
        setIsAdminOpen(false);
      } else if (path.startsWith('/car-details') || path.startsWith('/details')) {
        setCurrentPage('car-details');
        setIsAdminOpen(false);
      } else if (path === '/sell-your-car' || path === '/sell-car' || path === '/sell') {
        setCurrentPage('sell-your-car');
        setIsAdminOpen(false);
      } else if (path === '/services') {
        setCurrentPage('services');
        setIsAdminOpen(false);
      } else if (path === '/about-us' || path === '/about') {
        setCurrentPage('about-us');
        setIsAdminOpen(false);
      } else if (path === '/contact-us' || path === '/contact') {
        setCurrentPage('contact-us');
        setIsAdminOpen(false);
      } else {
        // Default to home page
        setCurrentPage('home');
        setIsAdminOpen(false);
      }
    };

    applyPath();
    window.addEventListener('popstate', applyPath);
    return () => window.removeEventListener('popstate', applyPath);
  }, []);

  const pathForPage = (page: PageRoute) => (page === 'home' ? '/' : `/${page}`);

  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    setIsAdminOpen(false);
    window.history.pushState(null, '', pathForPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setCurrentPage('car-details');
    window.history.pushState(null, '', '/car-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    window.history.pushState(null, '', '/admin');
    setIsAdminOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    window.history.pushState(null, '', pathForPage(currentPage));
  };

  const handleLoginSuccess = (user: AdminSession) => {
    setAdminSession(user);
    setIsAdminOpen(true);
    window.history.pushState(null, '', '/admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('shahglobal_admin_session');
    setAdminSession(null);
  };

  const handleOpenTestDrive = (v?: Vehicle | null) => {
    setTestDriveVehicle(v || activeVehicle || null);
    setIsTestDriveOpen(true);
  };

  const handleOpenFinancing = (v?: Vehicle | null) => {
    setFinancingVehicle(v || activeVehicle || null);
    setIsFinancingOpen(true);
  };

  const handleOpenContact = (v?: Vehicle | null) => {
    setContactVehicle(v || activeVehicle || null);
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between overflow-x-hidden relative">
      {/* Floating Quick Admin Toggle Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-admin-launcher-btn"
          onClick={handleOpenAdmin}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0f1115] hover:bg-neutral-900 text-white border border-neutral-700 shadow-2xl hover:border-[#e63946] transition-all duration-200 cursor-pointer group hover:scale-105"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#e63946] group-hover:animate-ping" />
          <Shield className="w-4 h-4 text-[#e63946]" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider">
            {adminSession ? 'ADMIN DASHBOARD' : 'ADMIN PORTAL'}
          </span>
        </button>
      </div>

      {/* 2. Global Top Navbar (hidden on home page, which has its own hero navbar) */}
      {currentPage !== 'home' && (
        <Navbar
          activePage={currentPage}
          onNavigate={handleNavigate}
          onOpenTestDrive={() => handleOpenTestDrive()}
          variant="solid"
        />
      )}

      {/* 3. Main Page Routing Body */}
      <main className="flex-1">
        {/* Page 0: Flagship Home Landing Page */}
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectVehicle={handleSelectVehicle}
            onBookTestDrive={handleOpenTestDrive}
            onOpenFinancing={handleOpenFinancing}
            onOpenContact={handleOpenContact}
            onOpenSellCar={() => handleNavigate('sell-your-car')}
            onOpenStayWithUs={() => setStayWithUsOpen(true)}
          />
        )}

        {/* Page 1: New Cars */}
        {currentPage === 'new-cars' && (
          <NewCarsPage
            onNavigate={handleNavigate}
            onSelectVehicle={handleSelectVehicle}
            onBookTestDrive={handleOpenTestDrive}
            onOpenFinancing={handleOpenFinancing}
            onOpenContact={handleOpenContact}
          />
        )}

        {/* Page 2: Used Cars */}
        {currentPage === 'used-cars' && (
          <UsedCarsPage
            onNavigate={handleNavigate}
            onSelectVehicle={handleSelectVehicle}
            onBookTestDrive={handleOpenTestDrive}
            onOpenFinancing={handleOpenFinancing}
            onOpenContact={handleOpenContact}
          />
        )}

        {/* Page 3: Car Details Individual Listing Page */}
        {currentPage === 'car-details' && (
          <CarDetailsPage
            vehicle={activeVehicle || vehicles[0]}
            onNavigate={handleNavigate}
            onSelectVehicle={handleSelectVehicle}
            onBookTestDrive={handleOpenTestDrive}
            onOpenFinancing={handleOpenFinancing}
            onOpenContact={handleOpenContact}
          />
        )}

        {/* Page 4: Sell Your Car */}
        {currentPage === 'sell-your-car' && (
          <SellYourCarPage
            onNavigate={handleNavigate}
          />
        )}

        {/* Page 5: Services */}
        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onOpenTestDrive={() => handleOpenTestDrive()}
            onOpenFinancing={() => handleOpenFinancing()}
            onOpenContact={() => handleOpenContact()}
          />
        )}

        {/* Page 6: About Us */}
        {currentPage === 'about-us' && (
          <AboutUsPage
            onNavigate={handleNavigate}
          />
        )}

        {/* Page 7: Contact Us */}
        {currentPage === 'contact-us' && (
          <ContactUsPage
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 4. Global High-Performance Footer */}
      <FooterSection
        onOpenTestDrive={() => handleOpenTestDrive()}
        onOpenAdmin={handleOpenAdmin}
        onNavigate={handleNavigate}
        onOpenSellCar={() => handleNavigate('sell-your-car')}
        onOpenFinancing={() => handleOpenFinancing()}
        onOpenContact={() => handleNavigate('contact-us')}
      />

      {/* ================= MODAL LAYERS ================= */}

      {/* 1. Vehicle Detail Page Modal (For quick overlay preview if triggered) */}
      {selectedVehicleForDetail && (
        <VehicleDetailModal
          vehicle={selectedVehicleForDetail}
          isOpen={!!selectedVehicleForDetail}
          onClose={() => setSelectedVehicleForDetail(null)}
          onBookTestDrive={(v) => handleOpenTestDrive(v)}
          onOpenFinancing={(v) => handleOpenFinancing(v)}
          onOpenContact={(v) => handleOpenContact(v)}
        />
      )}

      {/* 2. VIP Test Drive Booking Modal */}
      <TestDriveModal
        vehicle={testDriveVehicle}
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
      />

      {/* 3. Sell Your Car / Valuation Modal */}
      <SellCarModal
        isOpen={isSellCarOpen}
        onClose={() => setIsSellCarOpen(false)}
      />

      {/* 4. Financing & Lease Calculator Modal */}
      <FinancingModal
        vehicle={financingVehicle}
        isOpen={isFinancingOpen}
        onClose={() => setIsFinancingOpen(false)}
      />

      {/* 5. Contact / Enquiry Modal */}
      <ContactModal
        vehicle={contactVehicle}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* 6. Admin Authentication & Dashboard Portal */}
      {isAdminOpen && !adminSession && (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToShowroom={handleCloseAdmin}
        />
      )}

      {isAdminOpen && adminSession && (
        <AdminDashboard
          currentUser={adminSession}
          onLogout={handleAdminLogout}
          onClose={handleCloseAdmin}
        />
      )}

      {/* 7. Newsletter / Stay With Us Prompt */}
      <Modals
        testDriveOpen={false}
        onCloseTestDrive={() => {}}
        stayWithUsOpen={stayWithUsOpen}
        onCloseStayWithUs={() => setStayWithUsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <DealershipProvider>
      <DealershipApp />
    </DealershipProvider>
  );
}

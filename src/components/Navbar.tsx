import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles } from 'lucide-react';

export type PageRoute = 
  | 'home'
  | 'new-cars' 
  | 'used-cars' 
  | 'car-details' 
  | 'sell-your-car' 
  | 'services' 
  | 'about-us' 
  | 'contact-us';

interface NavbarProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenSellCar?: () => void;
  onOpenFinancing?: () => void;
  onOpenContact?: () => void;
  onOpenTestDrive?: () => void;
  onOpenAdmin?: () => void;
  variant?: 'transparent' | 'solid';
}

export default function Navbar({
  activePage,
  onNavigate,
  onOpenSellCar,
  onOpenFinancing,
  onOpenContact,
  onOpenTestDrive,
  onOpenAdmin,
  variant = 'solid'
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: PageRoute }[] = [
    { label: 'HOME', page: 'home' },
    { label: 'NEW CARS', page: 'new-cars' },
    { label: 'USED CARS', page: 'used-cars' },
    { label: 'SELL YOUR CAR', page: 'sell-your-car' },
    { label: 'SERVICES', page: 'services' },
    { label: 'ABOUT US', page: 'about-us' },
    { label: 'CONTACT US', page: 'contact-us' },
  ];

  const handleItemClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full z-40 relative flex justify-center px-4 pt-4 sm:pt-5">
      <div className="w-full max-w-[1100px] flex items-center justify-between gap-4 rounded-full bg-white border border-neutral-200 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] px-4 sm:px-8 py-3">
        
        {/* Brand Logo */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 group select-none text-left cursor-pointer shrink-0 pl-2"
        >
          <span className="text-xl sm:text-2xl font-extrabold tracking-tighter font-heading text-neutral-950">
            Shahglobal<span className="text-[#e63946]">.</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500 border border-neutral-300 px-1.5 py-0.5 rounded ml-2">
            EXOTICS
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-1 2xl:gap-2">
          {navItems.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => handleItemClick(item.page)}
                className={`relative px-3 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 rounded-lg ${
                  isActive
                    ? 'text-neutral-950 bg-neutral-100 font-extrabold'
                    : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#e63946]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right CTA Action: VIP Test Drive */}
        <div className="hidden lg:flex items-center">
          {onOpenTestDrive && (
            <button
              onClick={onOpenTestDrive}
              className="px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider font-heading transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e63946]" />
              <span>BOOK TEST DRIVE</span>
            </button>
          )}
        </div>

        {/* Mobile Menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border border-neutral-200 px-5 py-5 space-y-3 shadow-2xl overflow-hidden rounded-2xl mt-2"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = activePage === item.page;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleItemClick(item.page)}
                    className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-neutral-950 text-white font-extrabold'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#e63946]" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-neutral-200">
              {onOpenTestDrive && (
                <button
                  onClick={() => {
                    onOpenTestDrive();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-neutral-950 text-white text-xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#e63946]" />
                  <span>BOOK TEST DRIVE</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

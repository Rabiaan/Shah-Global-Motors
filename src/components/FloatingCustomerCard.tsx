import { motion } from 'motion/react';
import rearCarImage from '../assets/images/rear_concept_car_1788175129972.jpg';

interface FloatingCustomerCardProps {
  onOpenReviews?: () => void;
}

export default function FloatingCustomerCard({ onOpenReviews }: FloatingCustomerCardProps) {
  const avatars = [
    {
      name: 'Marcus Vance',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Rostova',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'David Chen',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <motion.div
      id="floating-customer-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] border border-neutral-100 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] transition-all duration-300 group"
    >
      {/* Rear 3/4 concept car mini showcase card */}
      <div 
        id="rear-car-preview-card"
        className="relative overflow-hidden rounded-2xl w-40 h-24 sm:w-48 sm:h-28 bg-neutral-900 flex-shrink-0 shadow-inner group/img"
      >
        <img
          src={rearCarImage}
          alt="Shahglobal sports car rear 3/4 view"
          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
        <span className="absolute bottom-1.5 left-2 text-[9px] font-bold uppercase tracking-widest text-white/80 bg-black/50 backdrop-blur-xs px-1.5 py-0.5 rounded">
          AERO SPEC
        </span>
      </div>

      {/* Customer stats & globe */}
      <div className="flex flex-col justify-between py-1 pr-2">
        {/* Wireframe red globe icon */}
        <div className="flex items-center gap-2 mb-2">
          <svg 
            id="wireframe-globe-icon"
            className="w-6 h-6 text-[#e63946] flex-shrink-0"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
            <path d="M4.5 7.5h15" />
            <path d="M4.5 16.5h15" />
          </svg>
        </div>

        {/* Happy Customer label */}
        <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase font-heading">
          HAPPY CUSTOMER
        </div>

        {/* 95K+ and overlapping avatar stack */}
        <div className="flex items-center gap-4 mt-0.5">
          <span 
            id="happy-customer-count"
            className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-heading"
          >
            95K+
          </span>

          {/* Overlapping customer avatar portraits */}
          <div 
            id="customer-avatars-cluster"
            className="flex -space-x-2.5 items-center cursor-pointer"
            onClick={onOpenReviews}
            title="View verified customer reviews"
          >
            {avatars.map((avatar, idx) => (
              <img
                key={avatar.name}
                id={`customer-avatar-${idx}`}
                src={avatar.url}
                alt={avatar.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-neutral-200 hover:scale-110 hover:z-30 transition-transform duration-200"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

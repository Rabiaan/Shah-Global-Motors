import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import suvImage from '../assets/images/suv_salt_flat_1788184141833.jpg';
import whiteTopDownImage from '../assets/images/topdown_white_car_1788184155835.jpg';
import redTopDownImage from '../assets/images/topdown_red_car_1788184168220.jpg';
import blurSpeedImage from '../assets/images/speed_blur_car_1788184181985.jpg';

export default function AboutSection() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Spec carousel cards data
  const specCards = [
    {
      id: 'speed',
      label: 'TOP SPEED',
      value: '320 km/h',
      image: whiteTopDownImage,
      bg: 'bg-white border border-neutral-200/80 shadow-sm',
    },
    {
      id: 'torque',
      label: 'TORQUE',
      value: '800 Nm',
      image: redTopDownImage,
      bg: 'bg-[#edeef0] shadow-sm',
    },
    {
      id: 'acceleration',
      label: '0-100 KM/H',
      value: '2.7 s',
      image: whiteTopDownImage,
      bg: 'bg-white border border-neutral-200/80 shadow-sm',
    },
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % specCards.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + specCards.length) % specCards.length);
  };

  return (
    <section 
      id="about-section"
      className="relative w-full max-w-[1480px] mx-auto px-4 sm:px-8 md:px-12 py-16 sm:py-24 border-t border-neutral-100"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-12 sm:space-y-16">
          
          {/* Top-Left: SUV Video Thumbnail Card */}
          <div className="flex flex-col">
            <div className="relative group">
              {/* Main image container */}
              <div 
                id="reels-video-thumbnail"
                onClick={() => setVideoModalOpen(true)}
                className="relative w-full sm:w-[380px] h-[200px] sm:h-[220px] rounded-2xl overflow-hidden shadow-md cursor-pointer bg-neutral-100"
              >
                <img
                  src={suvImage}
                  alt="Luxury SUV on white salt flat"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Unique bottom-right protruding play tab */}
              <button
                id="play-reels-btn"
                onClick={() => setVideoModalOpen(true)}
                className="absolute -bottom-3 right-0 sm:right-12 z-10 w-12 h-10 sm:w-14 sm:h-12 bg-slate-400/90 hover:bg-slate-500 text-white rounded-xl shadow-lg flex items-center justify-center backdrop-blur-xs transition-all duration-200 group-hover:scale-110 cursor-pointer"
                aria-label="Play feature reel"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white ml-0.5" />
              </button>
            </div>

            {/* Label below SUV Card */}
            <h4 
              id="reels-caption"
              className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-neutral-900 mt-5 font-heading"
            >
              PAY REELS BY FEATURES
            </h4>
          </div>

          {/* Bottom-Left: Global Sourcing Block */}
          <div id="global-sourcing-block" className="pt-4 sm:pt-8 flex flex-col items-start">
            {/* Red Wireframe Globe Icon */}
            <div className="mb-4">
              <svg 
                id="global-sourcing-globe-icon"
                className="w-12 h-12 text-[#e63946]"
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer circle */}
                <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
                {/* Horizontal latitude lines */}
                <line x1="8" y1="30" x2="92" y2="30" stroke="currentColor" strokeWidth="2.5" />
                <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="3" />
                <line x1="8" y1="70" x2="92" y2="70" stroke="currentColor" strokeWidth="2.5" />
                {/* Vertical longitude curves */}
                <ellipse cx="50" cy="50" rx="18" ry="46" stroke="currentColor" strokeWidth="2.5" />
                <ellipse cx="50" cy="50" rx="34" ry="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>

            {/* Global Sourcing Heading */}
            <h3 
              id="global-sourcing-title"
              className="text-2xl sm:text-3xl font-extrabold uppercase text-neutral-900 font-display tracking-tight"
            >
              GLOBAL SOURCING
            </h3>

            {/* Subtext */}
            <p 
              id="global-sourcing-desc"
              className="text-xs sm:text-sm font-semibold uppercase text-neutral-500 tracking-wide mt-3 max-w-sm leading-relaxed"
            >
              HAND-PICKED FROM JAPAN, UK &amp; UAE – QUALITY WITHOUT COMPROMISE.
            </p>
          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-12 sm:space-y-16">
          
          {/* Top-Right: About Us Headline & Subtext */}
          <div className="flex flex-col space-y-4">
            {/* Red Eyebrow Tag */}
            <span 
              id="about-us-tag"
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#e63946] font-heading"
            >
              [ ABOUT US_ ]
            </span>

            {/* Large Bold Headline */}
            <h2 
              id="about-main-headline"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-neutral-900 font-display tracking-tight leading-[1.08]"
            >
              BUILT FOR THOSE
              <br />
              WHO CHOOSE DIFFERENTLY
            </h2>

            {/* Descriptive sentence */}
            <p 
              id="about-main-desc"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-500 max-w-xl leading-relaxed pt-2"
            >
              WORLD-CLASS VEHICLES, TOTAL TRANSPARENCY, AND ABSOLUTELY ZERO COMPROMISE ON QUALITY.
            </p>
          </div>

          {/* Bottom-Right: Slanted Navigation Buttons & Spec Cards */}
          <div className="flex flex-col space-y-4 pt-4">
            
            {/* Top Bar with Slanted Parallelogram Arrows */}
            <div className="flex justify-end items-center gap-2 pr-2 sm:pr-6">
              {/* Left Prev Button (White with border & red/dark chevron) */}
              <button
                id="spec-carousel-prev"
                onClick={handlePrev}
                className="w-10 h-8 sm:w-11 sm:h-9 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 flex items-center justify-center -skew-x-12 rounded-sm shadow-xs transition-all hover:bg-neutral-50 cursor-pointer"
                aria-label="Previous specification"
              >
                <div className="skew-x-12">
                  <ChevronsLeft className="w-4 h-4 text-neutral-800" />
                </div>
              </button>

              {/* Right Next Button (Solid Red with white chevron) */}
              <button
                id="spec-carousel-next"
                onClick={handleNext}
                className="w-10 h-8 sm:w-11 sm:h-9 bg-[#e63946] hover:bg-[#d62839] text-white flex items-center justify-center -skew-x-12 rounded-sm shadow-md shadow-[#e63946]/20 transition-all cursor-pointer"
                aria-label="Next specification"
              >
                <div className="skew-x-12">
                  <ChevronsRight className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>

            {/* Spec Cards & Motion Blur Thumbnail Row */}
            <div 
              id="spec-cards-row"
              className="flex items-end gap-3 sm:gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar"
            >
              {/* Card 1: TOP SPEED */}
              <motion.div
                id="card-top-speed"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="w-[150px] sm:w-[170px] md:w-[185px] h-[260px] sm:h-[290px] rounded-2xl bg-white border border-neutral-200/90 shadow-sm p-4 flex flex-col justify-between items-center flex-shrink-0 relative overflow-hidden"
              >
                <div className="text-center pt-1">
                  <div className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    TOP SPEED
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-neutral-900 font-heading tracking-tight mt-1">
                    320 km/h
                  </div>
                </div>

                <div className="w-full h-36 sm:h-40 flex items-end justify-center overflow-hidden">
                  <img
                    src={whiteTopDownImage}
                    alt="Top-down white supercar hood"
                    className="w-full object-cover object-top scale-110 translate-y-3"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>

              {/* Card 2: TORQUE */}
              <motion.div
                id="card-torque"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="w-[150px] sm:w-[170px] md:w-[185px] h-[260px] sm:h-[290px] rounded-2xl bg-[#edeef0] shadow-sm p-4 flex flex-col justify-between items-center flex-shrink-0 relative overflow-hidden"
              >
                <div className="text-center pt-1">
                  <div className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    TORQUE
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-neutral-900 font-heading tracking-tight mt-1">
                    800 Nm
                  </div>
                </div>

                <div className="w-full h-36 sm:h-40 flex items-end justify-center overflow-hidden">
                  <img
                    src={redTopDownImage}
                    alt="Top-down red supercar hood"
                    className="w-full object-cover object-top scale-110 translate-y-3"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>

              {/* Card 3: Motion Blur Car Image */}
              <motion.div
                id="card-speed-blur"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="w-[160px] sm:w-[200px] md:w-[220px] h-[130px] sm:h-[150px] rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-neutral-900"
              >
                <img
                  src={blurSpeedImage}
                  alt="High speed supercar light trails"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

            </div>

          </div>

        </div>

      </div>

      {/* Feature Reel Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <div 
            id="video-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              id="video-modal-dialog"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 text-white"
            >
              <button
                id="close-video-modal"
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-neutral-800 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video bg-neutral-900 flex items-center justify-center">
                <img
                  src={suvImage}
                  alt="Shahglobal feature presentation"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#e63946] text-white flex items-center justify-center shadow-xl shadow-[#e63946]/40 mb-4 animate-pulse">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading">
                    Shahglobal Performance Architecture
                  </h3>
                  <p className="text-neutral-300 text-xs sm:text-sm mt-1 max-w-md">
                    Global precision engineering, wind tunnel telemetry, and bespoke craftsmanship.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

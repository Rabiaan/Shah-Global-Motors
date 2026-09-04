import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronsLeft, ChevronsRight, Star, Quote } from 'lucide-react';
import blueCarImage from '../assets/images/blue_sports_car_rear_1788185660976.jpg';
import silverCarImage from '../assets/images/silver_car_reflection_1788185679713.jpg';

function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  const isK = end >= 1000;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(end * eased);
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  const display = isK ? `${Math.round(value / 1000)}K+` : `${Math.round(value)}${suffix}`;

  return <span ref={ref}>{display}</span>;
}

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const testimonials = [
    {
      id: 'esther',
      name: 'Esther Howard',
      role: 'BUSINESSMAN',
      review: 'BOUGHT MY FIRST LUXURY CAR FROM SHAHGLOBAL AND HONESTLY THE EXPERIENCE WAS NOTHING LIKE I EXPECTED.',
      rating: '4.9/5',
      type: 'image',
      image: blueCarImage,
    },
    {
      id: 'robert',
      name: 'Robert Fox',
      role: 'ARCHITECT',
      review: 'THE AFTER-SALES SUPPORT ALONE IS WORTH IT. THREE MONTHS AFTER BUYING MY CAR I HAD A SMALL ISSUE AND THEY SORTED IT OUT THE SAME DAY.',
      rating: '4.9/5',
      type: 'dark',
    },
    {
      id: 'jacob',
      name: 'Jacob Jones',
      role: 'DOCTOR',
      review: 'BEST CAR BUYING EXPERIENCE I HAVE EVER HAD. THE PROCESS WAS FAST AND COMPLETELY TRANSPARENT.',
      rating: '4.9/5',
      type: 'image',
      image: silverCarImage,
    },
    {
      id: 'amelia',
      name: 'Amelia Clarke',
      role: 'DESIGNER',
      review: 'THE TEAM WENT ABOVE AND BEYOND TO FIND ME THE PERFECT CAR. THE FINANCING WAS HANDLED SEAMLESSLY.',
      rating: '5/5',
      type: 'dark',
    },
    {
      id: 'liam',
      name: 'Liam Bennett',
      role: 'ENGINEER',
      review: 'INCREDIBLE SELECTION AND HONEST PRICING. THEY MADE TRADING IN MY OLD CAR EFFORTLESS AND STRESS-FREE.',
      rating: '4.8/5',
      type: 'image',
      image: blueCarImage,
    },
    {
      id: 'sophia',
      name: 'Sophia Nguyen',
      role: 'ATTORNEY',
      review: 'FROM TEST DRIVE TO DELIVERY, EVERYTHING WAS FIRST-CLASS. I COULD NOT RECOMMEND SHAHGLOBAL MORE HIGHLY.',
      rating: '5/5',
      type: 'dark',
    },
    {
      id: 'noah',
      name: 'Noah Williams',
      role: 'REAL ESTATE',
      review: 'A GEM OF A SHOWROOM. THE STAFF ARE KNOWLEDGEABLE AND THE AFTER-SALES CARE IS SECOND TO NONE.',
      rating: '4.9/5',
      type: 'image',
      image: silverCarImage,
    },
  ];

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(testimonials.length - 1, index));
    const slides = track.querySelectorAll<HTMLElement>('[data-testimonial-slide]');
    const target = slides[clamped];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft - (track.clientWidth - target.clientWidth) / 2, behavior: 'smooth' });
  };

  const handlePrev = () => {
    const track = trackRef.current;
    const slides = track ? track.querySelectorAll<HTMLElement>('[data-testimonial-slide]') : [];
    let current = 0;
    slides.forEach((s, i) => {
      const center = s.offsetLeft - (track!.clientWidth - s.clientWidth) / 2;
      if (center <= track!.scrollLeft) current = i;
    });
    scrollToCard(current - 1);
  };

  const handleNext = () => {
    const track = trackRef.current;
    const slides = track ? track.querySelectorAll<HTMLElement>('[data-testimonial-slide]') : [];
    let current = 0;
    slides.forEach((s, i) => {
      const center = s.offsetLeft - (track!.clientWidth - s.clientWidth) / 2;
      if (center <= track!.scrollLeft) current = i;
    });
    scrollToCard(current + 1);
  };

  return (
    <section 
      id="testimonials-section"
      className="relative w-full max-w-[1480px] mx-auto px-2 sm:px-4 md:px-6 py-12 lg:py-16"
    >
      {/* Dark Outer Container */}
      <div 
        id="testimonials-container"
        className="relative w-full rounded-[32px] sm:rounded-[40px] bg-[#07080a] overflow-hidden p-6 sm:p-10 lg:p-16 text-white border border-neutral-800/60 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Subtle wireframe pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(40,45,55,0.4) 0%, rgba(7,8,10,0.95) 75%), 
              repeating-radial-gradient(circle at 25% 75%, transparent 0, transparent 15px, rgba(255,255,255,0.03) 16px, transparent 17px),
              repeating-linear-gradient(120deg, transparent, transparent 35px, rgba(255,255,255,0.015) 36px, transparent 37px)`,
          }}
        />

        <div className="relative z-10 flex flex-col space-y-12 sm:space-y-16">
          
          {/* ================= HEADER ROW ================= */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="flex flex-col space-y-3">
              <span 
                id="testimonial-tag"
                className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase"
              >
                [ TESTIMONIAL_ ]
              </span>

              <h2 
                id="testimonial-main-headline"
                className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold uppercase tracking-tight text-white font-display leading-[1.08]"
              >
                EVERY REVIEW IS A STORY
                <br />
                WE ARE PROUD OF
              </h2>

              <p 
                id="testimonial-subtext"
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 max-w-md leading-relaxed pt-1"
              >
                NEW CARS ADDED EVERY SINGLE DAY. DON'T MISS OUT.
              </p>
            </div>

            {/* Slanted Parallelogram Chevron Navigation Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                id="testimonials-prev-btn"
                onClick={handlePrev}
                className="w-11 h-9 sm:w-12 sm:h-10 bg-white hover:bg-neutral-100 text-neutral-900 flex items-center justify-center -skew-x-12 rounded-sm shadow-md transition-all cursor-pointer"
                aria-label="Previous review"
              >
                <div className="skew-x-12">
                  <ChevronsLeft className="w-5 h-5 text-neutral-900 stroke-[2.5]" />
                </div>
              </button>

              <button
                id="testimonials-next-btn"
                onClick={handleNext}
                className="w-11 h-9 sm:w-12 sm:h-10 bg-[#c9182b] hover:bg-[#b01424] text-white flex items-center justify-center -skew-x-12 rounded-sm shadow-md shadow-red-900/40 transition-all cursor-pointer"
                aria-label="Next review"
              >
                <div className="skew-x-12">
                  <ChevronsRight className="w-5 h-5 text-white stroke-[2.5]" />
                </div>
              </button>
            </div>
          </div>

          {/* ================= TESTIMONIAL CARDS CAROUSEL ================= */}
          <div 
            ref={trackRef}
            id="testimonial-cards-track"
            className="relative flex gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2"
          >
            {testimonials.map((t, i) => (
              <article
                key={t.id}
                data-testimonial-slide
                className="relative flex-[0_0_85%] sm:flex-[0_0_75%] md:flex-[0_0_45%] lg:flex-[0_0_30%] snap-center lg:snap-start flex flex-col shrink-0"
              >
                {/* Person Meta Top */}
                <div className="mb-3 flex flex-col items-start gap-1 w-auto">
                  <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                    {t.name}
                  </h4>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    {t.role}
                  </p>
                </div>

                {/* Main Solid Card (center style) */}
                <div className="relative flex-1 min-h-[360px] sm:min-h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800/90 flex flex-col justify-end p-6 sm:p-8 bg-[#18191d] group">
                  {/* Subtle dark gradient / texture for solid cards, or image for image cards */}
                  {t.type === 'image' && t.image ? (
                    <>
                      <img
                        src={t.image}
                        alt={`${t.name} vehicle`}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#18191d]/95 via-[#18191d]/40 to-[#18191d]/20" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#202228] to-[#121316] opacity-90" />
                  )}

                  {/* Review Text */}
                  <div className="relative z-10 space-y-4 pr-6">
                    <p className="text-xs sm:text-sm font-extrabold uppercase text-white tracking-wider leading-relaxed">
                      {t.review}
                    </p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-neutral-300 ml-1">
                        {t.rating}
                      </span>
                    </div>
                  </div>

                  {/* Quote Icon Badge on Bottom Right */}
                  <div className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-xl bg-white text-neutral-950 flex items-center justify-center shadow-lg">
                    <Quote className="w-5 h-5 fill-neutral-950 stroke-none rotate-180" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ================= BOTTOM STATS COUNTER ROW ================= */}
          <div 
            id="testimonial-stats-row"
            className="pt-6 sm:pt-10 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 justify-center"
          >
            {/* Stat 1: 12K+ */}
            <div id="stat-happy-customers" className="grid justify-center justify-items-center text-center">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight">
                <CountUp end={12000} duration={2200} />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase text-neutral-400 tracking-wider mt-2 font-heading">
                HAPPY CUSTOMERS SERVED
              </span>
            </div>

            {/* Stat 2: 98%+ */}
            <div id="stat-satisfaction-rate" className="grid justify-center justify-items-center text-center">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight">
                <CountUp end={98} suffix="%+" duration={2200} />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase text-neutral-400 tracking-wider mt-2 font-heading">
                CLIENT SATISFACTION RATE
              </span>
            </div>

            {/* Stat 3: 1500+ */}
            <div id="stat-cars-delivered" className="grid justify-center justify-items-center text-center">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight">
                <CountUp end={1500} suffix="+" duration={2200} />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase text-neutral-400 tracking-wider mt-2 font-heading">
                CARS DELIVERED
              </span>
            </div>

            {/* Stat 4: 15+ */}
            <div id="stat-years-excellence" className="grid justify-center justify-items-center text-center">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight">
                <CountUp end={15} suffix="+" duration={2200} />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase text-neutral-400 tracking-wider mt-2 font-heading">
                YEARS OF EXCELLENCE
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

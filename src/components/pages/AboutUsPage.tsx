import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Globe, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Star, 
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import heroCarImage from '../../assets/images/hero_sports_car_1788175114586.jpg';
import bronzePorscheImage from '../../assets/images/bronze_porsche_front_1788186462478.jpg';
import silverCarImage from '../../assets/images/silver_car_reflection_1788185679713.jpg';

interface AboutUsPageProps {
  onNavigate: (page: 'new-cars' | 'used-cars' | 'car-details' | 'sell-your-car' | 'services' | 'about-us' | 'contact-us') => void;
}

export default function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  const leadershipTeam = [
    {
      name: 'Syed Rabiaan',
      role: 'Founder & Chief Executive Officer',
      bio: 'Lifelong automotive purist with over 15 years cultivating direct relationships with European supercar ateliers and bespoke coachbuilders.',
      specialty: 'Hypercar Allocations & Private Collections'
    },
    {
      name: 'Julian Vance',
      role: 'Managing Director of Acquisitions',
      bio: 'Former track telemetry engineer specializing in classic Porsche air-cooled provenance and modern GT race homologations.',
      specialty: 'Provenance Verification & Valuations'
    },
    {
      name: 'Elena Rostova',
      role: 'Head of Private Client Services',
      bio: 'Coordinates closed-door VIP track events, custom trust leasing architecture, and intercontinental enclosed logistics.',
      specialty: 'Global Logistics & Bespoke Finance'
    }
  ];

  const milestones = [
    { year: '2012', title: 'The Genesis', desc: 'Founded as a boutique private sourcing consultancy for rare European GT vehicles.' },
    { year: '2016', title: 'Silicon Valley Flagship', desc: 'Opened our 35,000 sq ft climate-controlled gallery and master technical center.' },
    { year: '2020', title: 'Worldwide Air-Freight', desc: 'Launched proprietary enclosed delivery logistics serving over 42 international territories.' },
    { year: '2024', title: 'Tier 1 Atelier Status', desc: 'Officially recognized by premier collector syndicates as the benchmark for luxury provenance.' }
  ];

  const testimonials = [
    {
      quote: "Shahglobal sourced my Paint-to-Sample Porsche 911 GT3 RS with zero hassle. The car was delivered in an enclosed transporter straight to my driveway within 48 hours.",
      author: "Arthur Vance",
      title: "Venture Partner, Silicon Valley",
      car: "2024 Porsche 911 GT3 RS"
    },
    {
      quote: "The transparency is unmatched in the luxury space. The 160-point mechanical dossier, paint-meter readings, and title clearance gave me 100% confidence.",
      author: "Camille D'Souza",
      title: "Collector & Private Client",
      car: "2024 Ferrari Roma"
    },
    {
      quote: "Traded in my AMG GT and acquired a factory-new McLaren. Their finance desk handled all trust paperwork in a single afternoon.",
      author: "David Sterling",
      title: "Managing Director, Global Capital",
      car: "2023 McLaren 720S Spider"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* 1. Hero Header Banner */}
      <div className="relative bg-[#0d0f14] text-white py-16 sm:py-24 overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e63946_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 uppercase mb-4">
            <button onClick={() => onNavigate('new-cars')} className="hover:text-white transition-colors cursor-pointer">
              SHOWROOM
            </button>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-[#e63946] font-bold">ABOUT US</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e63946]/20 border border-[#e63946]/40 text-[#e63946] text-xs font-mono font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              THE PURSUIT OF AUTOMOTIVE PERFECTION SINCE 2012
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white uppercase leading-none">
              DEFINING THE ART OF <span className="text-[#e63946]">EXOTIC MOTORING</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 font-sans leading-relaxed">
              Shahglobal Exotics was established to transcend conventional dealership paradigms. We provide discerning collectors with unfiltered access to the world’s most celebrated automobiles through uncompromising provenance, mechanical perfection, and white-glove private client care.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-neutral-800">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white">$150M+</div>
              <div className="text-xs font-mono text-neutral-400 uppercase mt-1">Exotic Inventory Transacted</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[#e63946]">100%</div>
              <div className="text-xs font-mono text-neutral-400 uppercase mt-1">Clean Title &amp; Provenance</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white">42+</div>
              <div className="text-xs font-mono text-neutral-400 uppercase mt-1">Countries Served Globally</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white">160-PT</div>
              <div className="text-xs font-mono text-neutral-400 uppercase mt-1">Rigorous Inspection Protocol</div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Narrative & Core Pillars */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-bold text-[#e63946] uppercase tracking-widest">
              OUR FOUNDING HERITAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight">
              BUILT BY ENTHUSIASTS, FOR THE WORLD'S MOST DISCERNING DRIVERS
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed">
              Every vehicle in our showroom is curated not merely as machinery, but as kinetic art. From naturally aspirated high-revving V12 masterpieces to twin-turbocharged track weapons and modern hybrid hypercars, we select only specimens with unimpeachable provenance and flawless mechanical health.
            </p>
            <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed">
              Our 35,000 sq ft Silicon Valley showroom is engineered as an enthusiast sanctuary. We maintain an in-house clean-room detailing studio with XPEL ceramic certification, dedicated chassis dyno diagnostics, and a private VIP lounge for bespoke consultations.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('new-cars')}
                className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
              >
                EXPLORE SHOWROOM
              </button>
              <button
                onClick={() => onNavigate('contact-us')}
                className="px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                VISIT THE GALLERY
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-lg h-72 bg-neutral-900">
              <img
                src={heroCarImage}
                alt="Showroom display"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg h-72 bg-neutral-900 mt-6">
              <img
                src={bronzePorscheImage}
                alt="Exotic car detail"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* 3. The 3 Immutable Pillars */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-[#e63946] uppercase tracking-widest">
              THE SHAHGLOBAL PROMISE
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight mt-1">
              OUR THREE CORE PILLARS OF TRUST
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#e63946] flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold font-heading text-neutral-950 uppercase">
                1. UNCOMPROMISING PROVENANCE
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mt-3">
                Zero accidents. Zero unverified odometers. Every vehicle undergoes a 160-point electronic diagnostic evaluation and paint-meter depth test to ensure factory original panels.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold font-heading text-neutral-950 uppercase">
                2. TRANSPARENT PRICING
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mt-3">
                No artificial dealer preparation markups, mandatory accessory fees, or deceptive pricing tricks. What you see is our firm cash or lease commitment.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold font-heading text-neutral-950 uppercase">
                3. SEAMLESS GLOBAL TRANSIT
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mt-3">
                Whether you reside in Miami, London, Tokyo, or Dubai, our enclosed logistics network delivers your vehicle straight to your private garage fully registered and detailed.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Chronological Timeline */}
        <div className="mt-24 bg-neutral-950 text-white rounded-3xl p-8 sm:p-14 border border-neutral-800 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-[#e63946] uppercase tracking-widest">
              OUR JOURNEY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading uppercase tracking-tight mt-1">
              CHRONICLE OF EXCELLENCE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
                <div className="text-3xl font-extrabold font-heading text-[#e63946]">{m.year}</div>
                <h4 className="text-base font-bold font-heading uppercase text-white mt-2">{m.title}</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Executive Leadership */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-[#e63946] uppercase tracking-widest">
              EXOTIC SPECIALISTS
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight mt-1">
              EXECUTIVE LEADERSHIP TEAM
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((leader, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold font-heading mb-4">
                    {leader.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-extrabold font-heading text-neutral-900 uppercase">
                    {leader.name}
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#e63946] uppercase mt-0.5 mb-3">
                    {leader.role}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans mb-4">
                    {leader.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 text-[11px] font-mono text-neutral-500">
                  <span className="font-bold text-neutral-900">Focus:</span> {leader.specialty}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Client Testimonials */}
        <div className="mt-24 bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-[#e63946] uppercase tracking-widest">
              CLIENT EXPERIENCES
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-neutral-950 uppercase tracking-tight mt-1">
              WHAT OUR COLLECTORS SAY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed font-sans">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <div className="text-xs font-bold text-neutral-950 uppercase font-heading">{t.author}</div>
                  <div className="text-[11px] text-neutral-500 font-mono">{t.title}</div>
                  <div className="text-[10px] text-[#e63946] font-mono font-bold mt-1">Acquired: {t.car}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

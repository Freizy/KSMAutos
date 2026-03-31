import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Zap, Activity, ShieldCheck, TrendingUp } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-bg">
      {/* Background Image with Blur and Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2000" 
          alt="" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg" />
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            Premium Sales & Acquisitions
          </div>
          
          <div className="relative">
            <h1 className="text-[15vw] md:text-[12vw] font-black tracking-tighter uppercase leading-[0.75] animate-slam text-ink mix-blend-difference">
              KSM<br />
              <span className="text-accent">Autos</span>
            </h1>
            <div className="absolute -top-4 -right-8 hidden md:block">
              <div className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.5em] [writing-mode:vertical-rl] rotate-180">
                EST. 2026
              </div>
            </div>
          </div>

          <p className="max-w-2xl text-muted text-sm md:text-lg font-medium tracking-tight mt-4 leading-relaxed">
            The ultimate destination for high-performance vehicle sales. <br className="hidden md:block" />
            Discover a curated inventory of hypercars, customs, and vintage masterpieces.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <button 
            onClick={onExplore}
            className="group relative flex items-center gap-3 px-10 py-5 bg-accent text-bg font-bold text-sm uppercase tracking-widest rounded-sm hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <span className="relative z-10">Browse Sales</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button 
            onClick={onExplore}
            className="flex items-center gap-3 px-10 py-5 bg-white/5 text-ink border border-line font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
          >
            Learn More
          </button>
        </motion.div>

        {/* Stats Bar - Positioned below buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-line bg-white/5 backdrop-blur-sm rounded-sm mt-8"
        >
          <StatItem icon={<Activity className="w-4 h-4" />} label="Top Speed" value="531 KM/H" />
          <StatItem icon={<Zap className="w-4 h-4" />} label="Acceleration" value="2.5S 0-100" />
          <StatItem icon={<ShieldCheck className="w-4 h-4" />} label="Verified" value="100% AUTHENTIC" />
          <StatItem icon={<TrendingUp className="w-4 h-4" />} label="Market Value" value="+12.4% YOY" />
        </motion.div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 text-muted text-[10px] uppercase tracking-widest font-bold">
        {icon}
        {label}
      </div>
      <div className="font-mono text-xl font-bold tracking-tighter">{value}</div>
    </div>
  );
}

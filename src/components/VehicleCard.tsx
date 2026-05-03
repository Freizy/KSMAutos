import React from 'react';
import { Vehicle } from '../types';
import { motion } from 'motion/react';
import { Gauge, Zap, Activity, ChevronRight, Car, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  onInquire: (vehicle: Vehicle) => void;
  onCompare: (vehicle: Vehicle) => void;
  onViewDetails: (vehicle: Vehicle) => void;
  onToggleWishlist?: (vehicleId: string) => void;
  isComparing?: boolean;
  isWishlisted?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onInquire, 
  onCompare, 
  onViewDetails, 
  onToggleWishlist,
  isComparing,
  isWishlisted
}) => {
  return (
    <motion.div
      layout
      whileHover={{ y: -12, scale: 1.02 }}
      onClick={() => onViewDetails(vehicle)}
      className="group relative flex flex-col bg-white/[0.03] border border-white/5 rounded-[32px] overflow-hidden hover:border-accent/40 transition-all duration-700 cursor-pointer shadow-2xl backdrop-blur-md"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <img 
          src={vehicle.imageUrl} 
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-80" />
        
        {/* Status Badge */}
        <div className="absolute top-6 left-6 flex gap-3">
          <span className={cn(
            "px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md border",
            vehicle.status === 'available' ? "bg-green-500/20 text-green-400 border-green-500/30" :
            vehicle.status === 'sold' ? "bg-red-500/20 text-red-400 border-red-500/30" :
            "bg-accent/20 text-accent border-accent/30"
          )}>
            {vehicle.status}
          </span>
          {vehicle.isFeatured && (
            <span className="px-4 py-1.5 bg-white text-bg text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
              Elite Selection
            </span>
          )}
        </div>

        {/* Compare Toggle */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); onCompare(vehicle); }}
            className={cn(
              "p-3 rounded-full transition-all duration-500 backdrop-blur-xl border",
              isComparing ? "bg-accent text-bg border-accent shadow-[0_0_20px_rgba(209,222,57,0.4)]" : "bg-black/40 text-white/40 hover:text-accent border-white/10 hover:border-accent/50"
            )}
            title="Add to Comparison"
          >
            <Car className="w-5 h-5" />
          </button>

          {onToggleWishlist && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(vehicle.id); }}
              className={cn(
                "p-3 rounded-full transition-all duration-500 backdrop-blur-xl border",
                isWishlisted ? "bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-black/40 text-white/40 hover:text-red-500 border-white/10 hover:border-red-500/50"
              )}
              title={isWishlisted ? "Remove from Vault" : "Secure in Vault"}
            >
              <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
            </button>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-6 left-6">
          <span className="px-4 py-1.5 bg-black/40 backdrop-blur-xl text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10 text-white/70">
            {vehicle.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-accent uppercase tracking-[0.3em] font-black mb-1">{vehicle.year} {vehicle.make}</span>
            <h3 className="text-4xl font-black tracking-tighter uppercase leading-none group-hover:translate-x-2 transition-transform duration-500 ease-out">{vehicle.model}</h3>
          </div>
          <div className="text-3xl font-mono font-black tracking-tighter text-white mt-2 flex items-center gap-2">
            <span className="text-accent opacity-50 text-xl">$</span>
            {vehicle.price ? vehicle.price.toLocaleString() : 'N/A'}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/5 bg-white/[0.01] px-4 -mx-4">
          <Spec icon={<Gauge className="w-4 h-4 text-accent" />} label="V-MAX" value={`${vehicle.topSpeed} KM/H`} />
          <Spec icon={<Zap className="w-4 h-4 text-accent" />} label="STRIKE" value={`${vehicle.acceleration}S`} />
          <Spec icon={<Activity className="w-4 h-4 text-accent" />} label="ENERGY" value={`${vehicle.horsepower} BHP`} />
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onInquire(vehicle);
            }}
            className="w-full py-5 bg-accent text-bg font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(209,222,57,0.2)]"
          >
            Digital Inquiry
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(vehicle);
            }}
            className="flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-all duration-500 w-full group/details py-2"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-accent">Telemetry Data</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function Spec({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[8px] text-muted uppercase tracking-widest font-bold">
        {icon}
        {label}
      </div>
      <div className="text-xs font-mono font-bold tracking-tighter">{value}</div>
    </div>
  );
}

export default VehicleCard;

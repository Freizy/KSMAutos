import React from "react";
import { Vehicle } from "../types";
import { motion } from "motion/react";
import { Gauge, Zap, Activity, ChevronRight, Car, Info } from "lucide-react";
import { cn } from "../lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  onInquire: (vehicle: Vehicle) => void;
  onCompare: (vehicle: Vehicle) => void;
  isComparing?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onInquire,
  onCompare,
  isComparing,
}) => {
  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-white/5 border border-line rounded-sm overflow-hidden hover:border-accent transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-60" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={cn(
              "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full",
              vehicle.status === "available"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : vehicle.status === "sold"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-accent/20 text-accent border border-accent/30",
            )}
          >
            {vehicle.status}
          </span>
          {vehicle.isFeatured && (
            <span className="px-3 py-1 bg-white text-bg text-[10px] font-bold uppercase tracking-widest rounded-full border border-white">
              Featured
            </span>
          )}
        </div>

        {/* Compare Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompare(vehicle);
          }}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full transition-all z-10",
            isComparing
              ? "bg-accent text-bg"
              : "bg-bg/60 backdrop-blur-md text-muted hover:text-accent border border-line",
          )}
          title="Add to Comparison"
        >
          <Car className="w-4 h-4" />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-bg/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest rounded-full border border-line">
            {vehicle.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted uppercase tracking-widest font-bold">
              {vehicle.year} {vehicle.make}
            </span>
            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none group-hover:text-accent transition-colors">
              {vehicle.model}
            </h3>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted uppercase tracking-widest font-bold">
              Price
            </span>
            <div className="text-xl font-mono font-bold tracking-tighter text-accent">
              {vehicle.price ? `$${vehicle.price.toLocaleString()}` : "N/A"}
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-line">
          <Spec
            icon={<Gauge className="w-3 h-3" />}
            label="Top Speed"
            value={`${vehicle.topSpeed} KM/H`}
          />
          <Spec
            icon={<Zap className="w-3 h-3" />}
            label="0-100"
            value={`${vehicle.acceleration}S`}
          />
          <Spec
            icon={<Activity className="w-3 h-3" />}
            label="Power"
            value={`${vehicle.horsepower} BHP`}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInquire(vehicle);
            }}
            className="w-full py-3 bg-accent text-bg font-bold text-[10px] uppercase tracking-widest rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Inquire Now
          </button>

          <div className="flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-bold uppercase tracking-widest">
              Technical Data
            </span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[8px] text-muted uppercase tracking-widest font-bold">
        {icon}
        {label}
      </div>
      <div className="text-xs font-mono font-bold tracking-tighter">
        {value}
      </div>
    </div>
  );
}

export default VehicleCard;

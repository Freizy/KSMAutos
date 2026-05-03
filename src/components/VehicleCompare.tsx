import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Car, Zap, Gauge, Settings, Info, Trash2, Activity } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleCompareProps {
  vehicles: Vehicle[];
  selectedIds: string[];
  onToggleVehicle: (id: string) => void;
}

export const VehicleCompare: React.FC<VehicleCompareProps> = ({ vehicles, selectedIds, onToggleVehicle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedVehicles = vehicles.filter(v => selectedIds.includes(v.id));

  return (
    <>
      {/* Comparison Drawer Trigger */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 z-[60]"
          >
            <button 
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-4 px-8 py-5 bg-accent text-bg font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_20px_50px_rgba(209,222,57,0.3)] hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Car className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Compare Fleet ({selectedIds.length})</span>
              <div className="w-6 h-6 bg-bg text-accent flex items-center justify-center rounded-full text-[10px] font-black relative z-10">
                {selectedIds.length}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-bg/95 backdrop-blur-2xl"
            />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 150 }}
              className="relative w-full max-w-[1600px] glass-premium bg-bg/50 border-t border-white/10 p-12 flex flex-col gap-12 max-h-[90vh] overflow-y-auto mb-4 mx-4 shadow-2xl"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
                    <Activity className="w-3 h-3" />
                    Analytical Comparison Engine
                  </div>
                  <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">Side-by-Side<br />Analysis</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-muted hover:text-ink transition-all border border-white/5 hover:rotate-90"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {selectedVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted gap-6 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                  <Car className="w-16 h-16 opacity-10" />
                  <p className="text-xs uppercase tracking-[0.2em] font-black opacity-40">Zero telemetry data detected</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-10 py-4 bg-accent text-bg font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all rounded-full"
                  >
                    Select Vehicles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {selectedVehicles.map((vehicle, idx) => (
                    <motion.div 
                      key={vehicle.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col gap-8 relative group glass p-6 rounded-3xl border-accent/20 hover:border-accent/50 transition-colors"
                    >
                      <button 
                        onClick={() => onToggleVehicle(vehicle.id)}
                        className="absolute top-4 right-4 p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white backdrop-blur-md rounded-full transition-all z-20 border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="aspect-[16/10] overflow-hidden rounded-2xl relative shadow-2xl">
                        <img src={vehicle.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                      </div>

                      <div className="flex flex-col gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-accent/20 text-accent text-[9px] font-black uppercase tracking-widest rounded-sm">{vehicle.year}</span>
                            <span className="text-[10px] text-muted uppercase tracking-widest font-black">{vehicle.make}</span>
                          </div>
                          <div className="text-3xl font-black tracking-tighter uppercase leading-none mb-2">{vehicle.model}</div>
                          <div className="text-2xl font-mono font-black text-accent">${vehicle.price?.toLocaleString()}</div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[9px] uppercase tracking-[0.3em] font-black text-muted flex items-center gap-2">
                            <div className="w-1 h-1 bg-accent rounded-full" />
                            Performance Telemetry
                          </label>
                          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                            <SpecItem icon={<Zap className="w-3 h-3 text-accent" />} label="Output" value={`${vehicle.horsepower} BHP`} />
                            <SpecItem icon={<Gauge className="w-3 h-3 text-accent" />} label="V-Max" value={`${vehicle.topSpeed} KM/H`} />
                            <SpecItem icon={<Activity className="w-3 h-3 text-accent" />} label="0-100" value={`${vehicle.acceleration}s`} />
                            <SpecItem icon={<Settings className="w-3 h-3 text-accent" />} label="Unit" value={vehicle.engine ? vehicle.engine.split(' ')[0] : 'N/A'} />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-[0.3em] font-black text-muted flex items-center gap-2">
                            <div className="w-1 h-1 bg-accent rounded-full" />
                            Elite Specifications
                          </label>
                          <div className="flex flex-col gap-2">
                            {vehicle.features?.slice(0, 3).map((f, i) => (
                              <div key={i} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-ink py-2 border-b border-white/5 last:border-0">
                                <span className="text-muted">{f}</span>
                                <Info className="w-3 h-3 text-accent opacity-50" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {selectedVehicles.length < 3 && (
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setIsOpen(false)}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-12 text-muted gap-6 hover:bg-white/[0.05] hover:border-accent/40 transition-all group"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/10 transition-all">
                        <Plus className="w-8 h-8 group-hover:text-accent transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black group-hover:text-ink transition-colors">Add Fleet Member</p>
                        <p className="text-[8px] uppercase tracking-widest mt-2 opacity-50">Slot {selectedVehicles.length + 1} of 3 Available</p>
                      </div>
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Selection Preview */}
      <AnimatePresence>
        {!isOpen && selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-32 right-8 z-[60] flex flex-col gap-3 items-end"
          >
            {selectedVehicles.map((v, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={v.id}
                className="glass-premium px-5 py-3 flex items-center gap-4 border border-accent/20 hover:border-accent shadow-2xl backdrop-blur-3xl group/item"
              >
                <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-accent/30 p-0.5">
                  <img src={v.imageUrl} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="flex flex-col">
                  <div className="text-[7px] text-accent uppercase tracking-widest font-black leading-none mb-1">Fleet Member</div>
                  <div className="text-[9px] uppercase tracking-widest font-black whitespace-nowrap">{v.make} {v.model}</div>
                </div>
                <button 
                  onClick={() => onToggleVehicle(v.id)} 
                  className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all opacity-0 group-hover/item:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SpecItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="flex flex-col gap-1 p-4 bg-white/5 border-line hover:bg-accent/5 transition-colors">
    <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] font-black text-muted">
      {icon}
      {label}
    </div>
    <div className="text-[11px] font-black uppercase tracking-widest text-ink">{value}</div>
  </div>
);

export default VehicleCompare;

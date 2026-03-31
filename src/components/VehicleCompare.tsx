import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Car, Zap, Gauge, Settings, Info } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleCompareProps {
  vehicles: Vehicle[];
}

export const VehicleCompare: React.FC<VehicleCompareProps> = ({ vehicles }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const selectedVehicles = vehicles.filter(v => selectedIds.includes(v.id));

  const toggleVehicle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <>
      {/* Comparison Drawer Trigger */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-accent text-bg font-black text-xs uppercase tracking-widest rounded-sm shadow-2xl hover:scale-105 transition-all relative"
        >
          <Car className="w-4 h-4" />
          Compare ({selectedIds.length})
          {selectedIds.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-bg flex items-center justify-center rounded-full text-[10px] font-bold">
              {selectedIds.length}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-bg/95 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-7xl bg-bg border-t border-line p-8 flex flex-col gap-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Vehicle Comparison</h2>
                  <p className="text-muted text-[10px] uppercase tracking-widest font-bold mt-2">Compare up to 3 vehicles side-by-side</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-muted hover:text-ink transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted gap-4 border-2 border-dashed border-line rounded-sm">
                  <Car className="w-12 h-12 opacity-20" />
                  <p className="text-[10px] uppercase tracking-widest font-bold">Select vehicles from the showroom to compare</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 border border-line text-ink font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Back to Showroom
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {selectedVehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex flex-col gap-6 relative group">
                      <button 
                        onClick={() => toggleVehicle(vehicle.id)}
                        className="absolute top-2 right-2 p-2 bg-bg/80 backdrop-blur-sm rounded-full text-muted hover:text-red-500 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="aspect-video overflow-hidden rounded-sm">
                        <img src={vehicle.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="text-[10px] text-accent uppercase tracking-widest font-bold">{vehicle.year} {vehicle.make}</div>
                          <div className="text-2xl font-black tracking-tighter uppercase leading-none">{vehicle.model}</div>
                          <div className="text-xl font-mono font-bold text-ink mt-1">${vehicle.price?.toLocaleString()}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <SpecItem icon={<Zap />} label="Power" value={`${vehicle.horsepower} BHP`} />
                          <SpecItem icon={<Gauge />} label="Speed" value={`${vehicle.topSpeed} KM/H`} />
                          <SpecItem icon={<Gauge />} label="0-100" value={`${vehicle.acceleration}s`} />
                          <SpecItem icon={<Settings />} label="Engine" value={vehicle.engine || 'N/A'} />
                        </div>

                        <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-sm border border-white/10">
                          <div className="text-[10px] uppercase tracking-widest font-bold text-muted">Key Features</div>
                          <ul className="flex flex-col gap-1">
                            {vehicle.features?.slice(0, 4).map((f, i) => (
                              <li key={i} className="text-[10px] font-bold uppercase tracking-widest text-ink flex items-center gap-2">
                                <div className="w-1 h-1 bg-accent rounded-full" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted">
                            <span>Exterior</span>
                            <span className="text-ink">{vehicle.exteriorColor || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted">
                            <span>Interior</span>
                            <span className="text-ink">{vehicle.interiorColor || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedVehicles.length < 3 && (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-line rounded-sm p-8 text-muted gap-4">
                      <Plus className="w-8 h-8 opacity-20" />
                      <p className="text-[10px] uppercase tracking-widest font-bold">Add another vehicle</p>
                      <button 
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 border border-line text-ink font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                      >
                        Browse
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Showroom Selection Helper */}
      {!isOpen && selectedIds.length > 0 && (
        <div className="fixed bottom-28 right-8 z-50 flex flex-col gap-2 items-end">
          {selectedVehicles.map(v => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={v.id}
              className="glass px-4 py-2 flex items-center gap-3 border border-accent/20"
            >
              <img src={v.imageUrl} alt="" className="w-8 h-8 object-cover rounded-sm" />
              <div className="text-[8px] uppercase tracking-widest font-bold">{v.make} {v.model}</div>
              <button onClick={() => toggleVehicle(v.id)} className="text-muted hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

const SpecItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest font-bold text-muted">
      {icon}
      {label}
    </div>
    <div className="text-xs font-bold uppercase tracking-widest text-ink">{value}</div>
  </div>
);

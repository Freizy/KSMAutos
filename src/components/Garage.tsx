import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, onSnapshot, addDoc, doc, setDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { Vehicle } from '../types';
import VehicleCard from './VehicleCard';
import { Plus, Car, ShieldCheck, Activity, Zap, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GarageProps {
  user: User;
}

export default function Garage({ user }: GarageProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users', user.uid, 'garage'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
      setVehicles(items);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/garage`);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVehicle: Omit<Vehicle, 'id'> = {
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      year: parseInt(formData.get('year') as string),
      price: parseFloat(formData.get('price') as string) || 0,
      topSpeed: parseFloat(formData.get('topSpeed') as string) || 0,
      acceleration: parseFloat(formData.get('acceleration') as string) || 0,
      horsepower: parseFloat(formData.get('horsepower') as string) || 0,
      imageUrl: formData.get('imageUrl') as string || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000',
      category: formData.get('category') as any || 'Customs',
      status: 'available',
      ownerUid: user.uid,
      vin: formData.get('vin') as string,
      mileage: parseFloat(formData.get('mileage') as string) || 0,
    };

    try {
      await addDoc(collection(db, 'users', user.uid, 'garage'), newVehicle);
      setShowAddModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/garage`);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <Gauge className="w-12 h-12 text-accent animate-pulse" />
        <p className="font-mono text-xs tracking-widest uppercase opacity-50">Accessing Private Garage...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            Verified Collection
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">My Private<br />Garage</h2>
          <p className="text-muted text-sm max-w-md mt-2">Manage your high-performance collection, track technical specifications, and monitor market valuation.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-4 bg-accent text-bg font-bold text-xs uppercase tracking-widest rounded-sm hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Collection Value" value={`$${vehicles.reduce((acc, v) => acc + (v.price || 0), 0).toLocaleString()}`} icon={<TrendingUpIcon />} />
        <StatCard label="Total Horsepower" value={`${vehicles.reduce((acc, v) => acc + (v.horsepower || 0), 0).toLocaleString()} BHP`} icon={<ZapIcon />} />
        <StatCard label="Vehicles Owned" value={vehicles.length.toString()} icon={<CarIcon />} />
      </div>

      {/* Vehicle Grid */}
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onClick={() => console.log('Edit vehicle', vehicle.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="py-24 glass flex flex-col items-center justify-center text-center gap-6 border-dashed">
          <div className="w-20 h-20 bg-accent/10 flex items-center justify-center rounded-full">
            <Car className="w-10 h-10 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tighter uppercase">Garage Empty</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-2">You haven't added any vehicles to your collection yet. Start by adding your first high-performance machine.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-white/5 border border-line text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
          >
            Register First Vehicle
          </button>
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold tracking-tighter uppercase">Register Vehicle</h2>
                <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-ink">×</button>
              </div>

              <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Make</label>
                  <input name="make" required className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none" placeholder="e.g., Ferrari" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Model</label>
                  <input name="model" required className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none" placeholder="e.g., SF90 Stradale" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Year</label>
                  <input name="year" type="number" required className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none" placeholder="2024" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Price ($)</label>
                  <input name="price" type="number" className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none" placeholder="500000" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Top Speed (KM/H)</label>
                  <input name="topSpeed" type="number" className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none" placeholder="340" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">0-100 KM/H (S)</label>
                  <input name="acceleration" type="number" step="0.1" className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none" placeholder="2.5" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Horsepower (BHP)</label>
                  <input name="horsepower" type="number" className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none" placeholder="986" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Category</label>
                  <select name="category" className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none">
                    <option value="Hypercars">Hypercars</option>
                    <option value="Customs">Customs</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Prototype">Prototype</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Image URL</label>
                  <input name="imageUrl" className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none" placeholder="https://..." />
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <button type="submit" className="w-full py-4 bg-accent text-bg font-bold uppercase tracking-widest rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Confirm Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted uppercase tracking-widest font-bold">{label}</span>
        <div className="text-accent">{icon}</div>
      </div>
      <div className="text-3xl font-mono font-bold tracking-tighter">{value}</div>
    </div>
  );
}

function TrendingUpIcon() {
  return <Activity className="w-5 h-5" />;
}

function ZapIcon() {
  return <Zap className="w-5 h-5" />;
}

function CarIcon() {
  return <Car className="w-5 h-5" />;
}

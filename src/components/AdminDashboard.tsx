import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  Car, 
  TrendingUp, 
  DollarSign, 
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Vehicle, Inquiry } from '../types';

interface AdminDashboardProps {
  user: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [inventory, setInventory] = useState<Vehicle[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeView, setActiveView] = useState<'inventory' | 'inquiries' | 'stats'>('inventory');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Vehicle | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch data
  useEffect(() => {
    const inventoryQuery = query(collection(db, 'inventory'), orderBy('year', 'desc'));
    const inquiriesQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));

    const unsubInventory = onSnapshot(inventoryQuery, (snapshot) => {
      setInventory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle)));
      setIsLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inventory'));

    const unsubInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'inquiries'));

    return () => {
      unsubInventory();
      unsubInquiries();
    };
  }, []);

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to remove this vehicle from inventory?')) return;
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inventory/${id}`);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const stats = {
    totalValue: inventory.reduce((acc, v) => acc + (v.price || 0), 0),
    availableCount: inventory.filter(v => v.status === 'available').length,
    pendingInquiries: inquiries.filter(i => i.status === 'pending').length,
    soldCount: inventory.filter(v => v.status === 'sold').length
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Admin Control</h1>
          <p className="text-muted text-[10px] uppercase tracking-widest font-bold mt-2">KSM Autos Management System</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-bg font-bold text-xs uppercase tracking-widest rounded-sm hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign />} label="Inventory Value" value={`$${(stats.totalValue / 1000000).toFixed(1)}M`} />
        <StatCard icon={<Car />} label="Available Units" value={stats.availableCount} />
        <StatCard icon={<MessageSquare />} label="Pending Inquiries" value={stats.pendingInquiries} />
        <StatCard icon={<TrendingUp />} label="Sold Units" value={stats.soldCount} />
      </div>

      {/* View Switcher */}
      <div className="flex border-b border-line">
        <ViewTab active={activeView === 'inventory'} onClick={() => setActiveView('inventory')} label="Inventory" />
        <ViewTab active={activeView === 'inquiries'} onClick={() => setActiveView('inquiries')} label="Inquiries" />
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : activeView === 'inventory' ? (
          <InventoryList inventory={inventory} onDelete={handleDeleteVehicle} onEdit={setIsEditing} />
        ) : (
          <InquiriesList inquiries={inquiries} onUpdateStatus={handleUpdateInquiryStatus} />
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || isEditing) && (
          <VehicleFormModal 
            vehicle={isEditing} 
            onClose={() => { setShowAddModal(false); setIsEditing(null); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="glass p-6 flex items-center gap-4">
    <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-sm text-accent">
      {icon}
    </div>
    <div>
      <div className="text-[10px] text-muted uppercase tracking-widest font-bold">{label}</div>
      <div className="text-2xl font-black tracking-tighter uppercase">{value}</div>
    </div>
  </div>
);

const ViewTab = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-4 text-[10px] uppercase tracking-widest font-bold transition-all relative ${active ? 'text-accent' : 'text-muted hover:text-ink'}`}
  >
    {label}
    {active && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
  </button>
);

const InventoryList = ({ inventory, onDelete, onEdit }: { inventory: Vehicle[], onDelete: (id: string) => void, onEdit: (v: Vehicle) => void }) => (
  <div className="flex flex-col gap-2">
    {inventory.map(vehicle => (
      <div key={vehicle.id} className="glass p-4 flex items-center justify-between gap-4 group">
        <div className="flex items-center gap-4">
          <img src={vehicle.imageUrl} alt="" className="w-16 h-16 object-cover rounded-sm" />
          <div>
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">{vehicle.year} {vehicle.make}</div>
            <div className="text-lg font-black tracking-tighter uppercase leading-none">{vehicle.model}</div>
            <div className="flex gap-2 mt-1">
              <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${vehicle.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {vehicle.status}
              </span>
              <span className="text-[8px] uppercase tracking-widest font-bold text-muted px-2 py-0.5 bg-white/5 rounded-full">
                {vehicle.category}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Price</div>
            <div className="text-lg font-mono font-bold tracking-tighter">${vehicle.price?.toLocaleString()}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(vehicle)} className="p-2 hover:bg-white/5 rounded-sm text-muted hover:text-accent transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(vehicle.id)} className="p-2 hover:bg-white/5 rounded-sm text-muted hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const InquiriesList = ({ inquiries, onUpdateStatus }: { inquiries: Inquiry[], onUpdateStatus: (id: string, status: Inquiry['status']) => void }) => (
  <div className="flex flex-col gap-2">
    {inquiries.map(inquiry => (
      <div key={inquiry.id} className="glass p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${inquiry.status === 'pending' ? 'bg-yellow-500' : inquiry.status === 'contacted' ? 'bg-blue-500' : 'bg-green-500'}`} />
            <div>
              <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Inquiry for {inquiry.vehicleName}</div>
              <div className="text-lg font-black tracking-tighter uppercase leading-none">{inquiry.userName}</div>
              <div className="text-xs text-accent font-medium mt-1">{inquiry.userEmail}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Date</div>
            <div className="text-xs font-mono">{new Date(inquiry.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        
        <p className="text-sm text-muted bg-white/5 p-4 rounded-sm italic border-l-2 border-accent">
          "{inquiry.message}"
        </p>

        <div className="flex justify-end gap-2">
          <button 
            onClick={() => onUpdateStatus(inquiry.id, 'contacted')}
            className={`px-4 py-2 text-[8px] uppercase tracking-widest font-bold rounded-sm border transition-all ${inquiry.status === 'contacted' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'border-line text-muted hover:text-ink'}`}
          >
            Mark Contacted
          </button>
          <button 
            onClick={() => onUpdateStatus(inquiry.id, 'closed')}
            className={`px-4 py-2 text-[8px] uppercase tracking-widest font-bold rounded-sm border transition-all ${inquiry.status === 'closed' ? 'bg-green-500/20 border-green-500 text-green-500' : 'border-line text-muted hover:text-ink'}`}
          >
            Close Inquiry
          </button>
        </div>
      </div>
    ))}
    {inquiries.length === 0 && (
      <div className="flex flex-col items-center justify-center h-64 text-muted gap-2">
        <MessageSquare className="w-12 h-12 opacity-20" />
        <p className="text-[10px] uppercase tracking-widest font-bold">No inquiries yet</p>
      </div>
    )}
  </div>
);

const VehicleFormModal = ({ vehicle, onClose }: { vehicle: Vehicle | null, onClose: () => void }) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>(vehicle || {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    status: 'available',
    category: 'Hypercars',
    imageUrl: '',
    horsepower: 0,
    topSpeed: 0,
    acceleration: 0,
    transmission: '',
    engine: '',
    vin: '',
    mileage: 0,
    isFeatured: false,
    description: '',
    exteriorColor: '',
    interiorColor: '',
    features: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (vehicle) {
        await updateDoc(doc(db, 'inventory', vehicle.id), formData);
      } else {
        await addDoc(collection(db, 'inventory'), {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString()
        });
      }
      onClose();
    } catch (err) {
      handleFirestoreError(err, vehicle ? OperationType.UPDATE : OperationType.CREATE, 'inventory');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl glass p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter uppercase leading-none">
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <p className="text-muted text-[10px] uppercase tracking-widest font-bold mt-1">Inventory Control</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink">×</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <FormInput label="Make" value={formData.make} onChange={v => setFormData({...formData, make: v})} required />
            <FormInput label="Model" value={formData.model} onChange={v => setFormData({...formData, model: v})} required />
            <FormInput label="Year" type="number" value={formData.year} onChange={v => setFormData({...formData, year: parseInt(v)})} required />
            <FormInput label="Price ($)" type="number" value={formData.price} onChange={v => setFormData({...formData, price: parseInt(v)})} required />
            <FormInput label="Image URL" value={formData.imageUrl} onChange={v => setFormData({...formData, imageUrl: v})} required />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Status</label>
              <select 
                className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="pre-order">Pre-order</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="featured"
                checked={formData.isFeatured}
                onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                className="w-4 h-4 accent-accent"
              />
              <label htmlFor="featured" className="text-[10px] uppercase tracking-widest font-bold text-muted cursor-pointer">Featured Vehicle</label>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <FormInput label="Horsepower (BHP)" type="number" value={formData.horsepower} onChange={v => setFormData({...formData, horsepower: parseInt(v)})} />
            <FormInput label="Top Speed (KM/H)" type="number" value={formData.topSpeed} onChange={v => setFormData({...formData, topSpeed: parseInt(v)})} />
            <FormInput label="0-100 KM/H (Sec)" type="number" step="0.1" value={formData.acceleration} onChange={v => setFormData({...formData, acceleration: parseFloat(v)})} />
            <FormInput label="Transmission" value={formData.transmission} onChange={v => setFormData({...formData, transmission: v})} />
            <FormInput label="Engine" value={formData.engine} onChange={v => setFormData({...formData, engine: v})} />
            <FormInput label="VIN" value={formData.vin} onChange={v => setFormData({...formData, vin: v})} />
          </div>

          <div className="flex flex-col gap-4">
            <FormInput label="Exterior Color" value={formData.exteriorColor} onChange={v => setFormData({...formData, exteriorColor: v})} />
            <FormInput label="Interior Color" value={formData.interiorColor} onChange={v => setFormData({...formData, interiorColor: v})} />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Description</label>
              <textarea 
                className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none h-32 resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Detailed vehicle description..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Key Features (Comma separated)</label>
              <textarea 
                className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none h-24 resize-none"
                value={formData.features?.join(', ')}
                onChange={e => setFormData({...formData, features: e.target.value.split(',').map(s => s.trim())})}
                placeholder="Carbon Fiber, Ceramic Brakes, etc."
              />
            </div>
          </div>

          <div className="md:col-span-3 flex gap-4 mt-4">
            <button type="submit" className="flex-1 py-4 bg-accent text-bg font-bold uppercase tracking-widest rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              {vehicle ? 'Update Vehicle' : 'Add to Inventory'}
            </button>
            <button type="button" onClick={onClose} className="px-8 py-4 border border-line text-muted font-bold uppercase tracking-widest rounded-sm hover:bg-white/5 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const FormInput = ({ label, value, onChange, type = "text", required = false, step }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] uppercase tracking-widest font-bold text-muted">{label}</label>
    <input 
      type={type}
      step={step}
      required={required}
      className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

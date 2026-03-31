import React, { useState } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { Search, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryProps {
  vehicles: Vehicle[];
  onInquire: (vehicle: Vehicle) => void;
  onCompare: (vehicle: Vehicle) => void;
  comparingIds: string[];
}

export default function Inventory({ vehicles, onInquire, onCompare, comparingIds }: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<'price-asc' | 'price-desc' | 'year-desc' | 'horsepower-desc' | 'speed-desc'>('price-desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Hypercars', 'Customs', 'Vintage', 'Prototype'];

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || v.category === categoryFilter;
    const matchesPrice = (v.price || 0) >= priceRange[0] && (v.price || 0) <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'year-desc':
        return b.year - a.year;
      case 'horsepower-desc':
        return (b.horsepower || 0) - (a.horsepower || 0);
      case 'speed-desc':
        return (b.topSpeed || 0) - (a.topSpeed || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Filters & Search */}
      <div className="flex flex-col gap-6 py-6 border-b border-line">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search Inventory (e.g., Koenigsegg, Hypercars)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-line rounded-sm text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto md:flex-row md:items-center md:gap-4">
            <div className="flex items-center bg-white/5 border border-line rounded-sm p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-accent text-bg' : 'text-muted hover:text-ink'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-accent text-bg' : 'text-muted hover:text-ink'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted">
              <label htmlFor="sort" className="hidden md:inline">Sort:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-white/5 border border-line text-[10px] uppercase tracking-widest font-bold p-3 rounded-sm outline-none focus:border-accent"
              >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="year-desc">Newest First</option>
                <option value="horsepower-desc">Most Power</option>
                <option value="speed-desc">Fastest Top Speed</option>
              </select>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-sm text-xs font-bold uppercase tracking-widest transition-colors ${showFilters ? 'bg-accent text-bg border-accent' : 'bg-white/5 border-line text-muted hover:bg-white/10'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-white/5 border border-line rounded-sm">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-accent text-bg' : 'bg-white/5 text-muted hover:bg-white/10'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">Price Range</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full bg-white/5 border border-line p-2 rounded-sm text-xs focus:border-accent outline-none"
                    />
                    <span className="text-muted text-xs">to</span>
                    <input 
                      type="number" 
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                      className="w-full bg-white/5 border border-line p-2 rounded-sm text-xs focus:border-accent outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <button 
                    onClick={() => {
                      setCategoryFilter('All');
                      setPriceRange([0, 10000000]);
                      setSearchQuery('');
                    }}
                    className="text-[10px] uppercase tracking-widest font-bold text-accent hover:underline text-left"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vehicle List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedVehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onInquire={onInquire}
              onCompare={onCompare}
              isComparing={comparingIds.includes(vehicle.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col border border-line rounded-sm overflow-hidden">
          <div className="data-row bg-white/5 hover:bg-white/5 cursor-default">
            <div className="col-header">ID</div>
            <div className="col-header">Vehicle</div>
            <div className="col-header">Performance</div>
            <div className="col-header text-right">Price</div>
          </div>
          {sortedVehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="data-row"
              onClick={() => onInquire(vehicle)}
            >
              <div className="data-value opacity-30 text-[10px]">{vehicle.id.slice(0, 4)}</div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tighter uppercase">{vehicle.make} {vehicle.model}</span>
                <span className="text-[10px] text-muted uppercase tracking-widest">{vehicle.category} • {vehicle.year}</span>
              </div>
              <div className="flex flex-col">
                <span className="data-value text-accent">{vehicle.topSpeed} KM/H</span>
                <span className="text-[10px] text-muted uppercase tracking-widest">{vehicle.acceleration}S 0-100</span>
              </div>
              <div className="data-value text-right">
                {vehicle.price ? `$${vehicle.price.toLocaleString()}` : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredVehicles.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-full">
            <Search className="w-8 h-8 text-muted" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tighter uppercase">No Vehicles Found</h3>
            <p className="text-muted text-sm">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        </div>
      )}
    </div>
  );
}

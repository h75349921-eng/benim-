import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, Info, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { RentalCard } from '../components/RentalCard';
import { mockRentals } from '../data/mockRentals';

export default function RentalMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRentals = mockRentals.filter(car => 
    car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Header */}
      <div className="relative rounded-[3rem] bg-slate-900 overflow-hidden mb-12 p-8 lg:p-16 text-white min-h-[400px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none translate-x-20">
          <img 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop" 
            alt="" 
            className="w-full h-full object-cover rounded-l-full"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-xs uppercase tracking-widest">
              <Calendar className="h-3 w-3" />
              Premium Car Rentals
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 backdrop-blur-md rounded-full text-rose-300 font-extrabold text-xs uppercase tracking-widest border border-rose-500/30">
              <MapPin className="h-3 w-3 text-rose-400" />
              Pune Exclusive
            </div>
          </motion.div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Drive the Future, <br />
            <span className="text-primary-500">Rent a Hybrid.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium mb-10 leading-relaxed">
            Experience premium mobility with our curated fleet of top-tier hybrid and luxury vehicles. Flexible rentals for business or pleasure in Pune.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 rounded-2xl">
              <MapPin className="h-5 w-5 text-primary-500" />
              <span className="font-bold">Pune Deliveries Only</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 rounded-2xl">
              <ShieldCheck className="h-5 w-5 text-primary-500" />
              <span className="font-bold">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 rounded-2xl">
              <Clock className="h-5 w-5 text-primary-500" />
              <span className="font-bold">Daily Basis Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-6 mb-12 sticky top-20 z-30 bg-slate-50/80 backdrop-blur-md p-4 rounded-[2rem] border border-white">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by vehicle model..."
            className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-[2rem] shadow-sm focus:ring-2 focus:ring-primary-500 transition-all font-bold text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Results */}
      {filteredRentals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredRentals.map((car) => (
            <RentalCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No rentals found</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}

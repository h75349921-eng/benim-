import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Zap, ChevronRight, Fuel, Gauge } from 'lucide-react';
import { RentalCar } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface RentalCardProps {
  car: RentalCar;
}

export const RentalCard: React.FC<RentalCardProps> = ({ car }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 group hover:shadow-2xl transition-all"
    >
      <Link to={`/rentals/${car.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img 
            src={car.images[0]} 
            alt={car.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
              <Zap className="h-3.5 w-3.5 text-primary-500 fill-primary-500" />
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Premium Hybrid</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-lg">
            ₹{car.dailyRate.toLocaleString()}/day
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 line-clamp-1">{car.title}</h3>
              <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">{car.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl group-hover:bg-primary-50 transition-colors">
              <Fuel className="h-4 w-4 text-primary-500 mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hybrid</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl group-hover:bg-primary-50 transition-colors">
              <Gauge className="h-4 w-4 text-primary-500 mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Automatic</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl group-hover:bg-primary-50 transition-colors">
              <Calendar className="h-4 w-4 text-primary-500 mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">{car.year}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                  <img src={`https://i.pravatar.cc/50?img=${i + 10}`} alt="" />
                </div>
              ))}
              <div className="px-2 h-6 flex items-center bg-slate-50 rounded-full border-2 border-white">
                <span className="text-[8px] font-bold text-slate-400">12+ Rented</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-black text-primary-500 group-hover:gap-2 transition-all">
              Rent Now <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

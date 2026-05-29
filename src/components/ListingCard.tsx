import { Link } from 'react-router-dom';
import { Heart, MapPin, ShieldCheck, Zap, Fuel, Settings2 } from 'lucide-react';
import { Car } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useCars } from '../context/CarContext';

interface ListingCardProps {
  car: Car;
  key?: string | number;
}

const luxuryFallbacks = [
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=800&auto=format&fit=crop', // Lamborghini
  'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=800&auto=format&fit=crop', // Ferrari
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop', // Porsche
  'https://images.unsplash.com/photo-1549611016-3a70d82b5040?q=80&w=800&auto=format&fit=crop', // Jaguar
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop', // Porsche 911
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format&fit=crop', // Land Rover
  'https://images.unsplash.com/photo-1566367576585-051277d52997?q=80&w=800&auto=format&fit=crop', // Range Rover
  'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?q=80&w=800&auto=format&fit=crop'  // Maserati
];

export default function ListingCard({ car }: ListingCardProps) {
  const { toggleFavorite, isFavorite } = useCars();
  const favorite = isFavorite(car.id);

  const displayImage = (!car.description || car.description.trim().length < 5)
    ? luxuryFallbacks[Math.abs(car.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % luxuryFallbacks.length]
    : car.images[0];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/vehicle/${car.id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={car.title}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('placehold.co')) {
                target.src = `https://placehold.co/800x600/f8fafc/64748b?text=${encodeURIComponent(car.brand + ' ' + car.model)}`;
              }
            }}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {car.isVerified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg shadow-green-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          )}
          {car.isPremium && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white rounded-full text-xs font-bold shadow-lg shadow-primary-500/20">
              <Zap className="h-3.5 w-3.5" />
              Prime
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(car.id);
          }}
          className={cn(
            "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg z-10",
            favorite ? "bg-pink-500 text-white" : "bg-white/90 text-slate-400 hover:text-pink-500"
          )}
        >
          <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
        </button>

        <div className="absolute bottom-4 left-4 right-4 flex gap-2 pointer-events-none">
          <div className="flex-1 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1">
            <Fuel className="h-3 w-3" /> {car.fuelType}
          </div>
          <div className="flex-1 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1">
            <Settings2 className="h-3 w-3" /> {car.transmission}
          </div>
        </div>
      </div>

      <div className="p-6 pb-4">
        <Link to={`/vehicle/${car.id}`} className="block mb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-black text-slate-900 group-hover:text-primary-500 transition-colors line-clamp-1">
              {car.title}
            </h3>
          </div>
        </Link>
        
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {(car.location || 'Unknown').split(',')[0]}
          </span>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <span>{car.mileage.toLocaleString()} km</span>
        </div>

        <Link to={`/vehicle/${car.id}`} className="flex items-end justify-between hover:opacity-80 transition-opacity">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Price</p>
            <p className="text-2xl font-extrabold text-slate-900">
              ₹{(car.price / 100000).toFixed(1)} <span className="text-sm font-bold text-slate-400">Lakh</span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
            <Zap className="h-5 w-5 text-slate-400 group-hover:text-white" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

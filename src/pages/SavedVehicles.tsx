import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Search, ChevronLeft } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { useCars } from '../context/CarContext';

export default function SavedVehicles() {
  const navigate = useNavigate();
  const { favorites, cars } = useCars();
  const savedCars = cars.filter(car => favorites.includes(car.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Saved Vehicles</h1>
        <p className="text-slate-500 font-medium">Your collection of bookmarked hybrids and premium finds.</p>
      </div>

      {savedCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedCars.map((car) => (
            <ListingCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-xl"
        >
          <div className="w-16 h-16 bg-brand-pink/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary-500">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Find the perfect hybrid and tap the heart icon to save it for later.</p>
          <Link 
            to="/browse" 
            className="px-8 py-3 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all inline-flex items-center gap-2"
          >
            <Search className="h-5 w-5" /> Browse Marketplace
          </Link>
        </motion.div>
      )}
    </div>
  );
}

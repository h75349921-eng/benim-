import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Car, User, Menu, X, MessageSquare, Calendar, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?q=${searchQuery}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100 h-[80px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
        <div className="flex justify-between items-center gap-8">
          <div className="flex items-center gap-4 shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-primary-500/20">
                <Car className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                benim<span className="text-primary-500">cars</span>
              </span>
            </Link>

            {/* Global Back Button */}
            {location.pathname !== '/' && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-100 hover:border-slate-200 cursor-pointer shadow-sm ml-2"
                title="Go Back"
              >
                <ChevronLeft className="h-4 w-4 text-slate-500 shrink-0" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-3xl bg-slate-50 rounded-2xl p-1 border border-slate-100">
            <form onSubmit={handleSearch} className="flex-1 relative group">
              <input
                type="text"
                placeholder="Search for Brand, Model, Year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 font-bold"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <Link to="/rentals" className="flex items-center gap-2 text-sm font-black text-slate-600 hover:text-primary-500 transition-colors uppercase tracking-widest">
              <Calendar className="h-4 w-4" /> Rentals
            </Link>
            <Link to="/sell" className="px-6 py-3 bg-secondary-500 text-white rounded-[2rem] text-sm font-black shadow-lg shadow-secondary-500/20 hover:brightness-105 transition-all uppercase tracking-widest">
              + Sell Car
            </Link>
            
            <div className="h-8 w-px bg-slate-100 mx-2" />

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/inbox" className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary-500 rounded-xl transition-all relative">
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
                </Link>
                <Link to="/profile" className="w-10 h-10 rounded-[1.25rem] overflow-hidden border-2 border-slate-100 shadow-sm hover:scale-105 transition-all">
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </Link>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-3 bg-slate-900 text-white rounded-[2rem] text-sm font-black hover:bg-slate-800 transition-all uppercase tracking-widest">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-2xl bg-slate-50 text-slate-900 shadow-sm"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-[80px] bg-white z-[100] p-6 lg:hidden"
          >
            <div className="space-y-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search cars..."
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </form>
              
              <div className="grid grid-cols-1 gap-4">
                <Link to="/browse?loc=Current" className="flex items-center gap-4 p-5 bg-primary-50 rounded-[2rem] text-primary-900 font-black uppercase tracking-widest">
                  <MapPin className="h-6 w-6 text-primary-500" /> Buy Vehicles
                </Link>
                <Link to="/rentals" className="flex items-center gap-4 p-5 bg-secondary-50 rounded-[2rem] text-secondary-900 font-black uppercase tracking-widest">
                  <Calendar className="h-6 w-6 text-secondary-500" /> Rent a Car
                </Link>
                <Link to="/sell" className="flex items-center gap-4 p-5 bg-slate-900 rounded-[2rem] text-white font-black uppercase tracking-widest">
                  <Car className="h-6 w-6 text-primary-500" /> Sell Your Car
                </Link>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <Link to="/inbox" className="flex items-center gap-4 text-slate-600 font-black uppercase tracking-widest text-lg">
                  <MessageSquare className="h-6 w-6" /> Inbox
                </Link>
                <Link to="/profile" className="flex items-center gap-4 text-slate-600 font-black uppercase tracking-widest text-lg">
                  <User className="h-6 w-6" /> Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


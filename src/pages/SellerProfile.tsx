import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, ShieldCheck, Zap, MessageCircle, 
  Star, Calendar, Car as CarIcon, ArrowRight,
  Shield, Award, Clock
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';

export default function SellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, isLoading: carsLoading } = useCars();
  const { startChat } = useChat();
  const { user } = useAuth();

  // Find the seller from existing cars or mock if needed
  // In a real app, we'd fetch the user document from Firestore
  const sellerCars = cars.filter(c => c.seller.id === id);
  const car = cars.find(c => c.seller.id === id);
  
  if (carsLoading) return <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  if (!car) return <div className="p-20 text-center font-black text-slate-900 uppercase">Seller not found.</div>;

  const seller = car.seller;

  const handleMessageSeller = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (seller.id === user.id) {
       alert("This is your profile.");
       return;
    }

    try {
      await startChat(
        seller.id,
        seller.name,
        seller.id.startsWith('u') ? `https://i.pravatar.cc/150?u=${seller.id}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
        `${seller.type} Seller`,
        `Hi ${seller.name}, I saw your listings on Benimcars and would like to connect!`
      );
      navigate('/inbox');
    } catch (error) {
      console.error('Chat error:', error);
      alert("Failed to start chat.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] bg-secondary-100 flex items-center justify-center text-secondary-600 font-black text-5xl shadow-inner uppercase overflow-hidden border-4 border-white shadow-xl">
                 {seller.id.startsWith('u') ? (
                   <img src={`https://i.pravatar.cc/300?u=${seller.id}`} className="w-full h-full object-cover" alt="" />
                 ) : (
                   seller.name.charAt(0)
                 )}
              </div>
              {seller.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 border-4 border-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{seller.type} Seller</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-black text-slate-900">4.9</span>
                      <span className="text-xs text-slate-400 font-bold">(128 reviews)</span>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{seller.name}</h1>
                  <div className="flex flex-wrap gap-6 text-slate-400 font-bold">
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Mumbai, Maharashtra</span>
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Joined Oct 2023</span>
                    <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" /> ID Verified</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleMessageSeller}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3"
                  >
                    <MessageCircle className="h-5 w-5" /> Message Seller
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                {[
                  { icon: CarIcon, label: 'Active Listings', value: sellerCars.length },
                  { icon: Award, label: 'Successful Deals', value: '84+' },
                  { icon: Clock, label: 'Response Time', value: '< 2 hours' },
                  { icon: ShieldCheck, label: 'Trust Score', value: '98%' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                      <p className="font-black text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
           <div className="flex items-center justify-between mb-10">
             <h2 className="text-3xl font-extrabold text-slate-900">Seller's <span className="text-primary-500">Inventory</span></h2>
             <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl font-bold text-sm">Active ({sellerCars.length})</button>
                <button className="px-4 py-2 text-slate-400 hover:text-slate-600 font-bold text-sm">Sold</button>
             </div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {sellerCars.map(car => (
               <ListingCard key={car.id} car={car} />
             ))}
           </div>

           {sellerCars.length === 0 && (
             <div className="text-center py-20">
               <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                 <CarIcon className="h-10 w-10" />
               </div>
               <h3 className="text-2xl font-black text-slate-900">No active listings</h3>
               <p className="text-slate-400 font-bold">This seller has no cars for sale at the moment.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

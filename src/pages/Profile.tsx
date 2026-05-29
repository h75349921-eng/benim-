import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, ShieldCheck, Settings, LogOut, ChevronRight, X, Save, LayoutDashboard, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCars } from '../context/CarContext';
import { useNavigate, Link } from 'react-router-dom';

// Add these icons if missing from lucide-react imports
import { Heart, IndianRupee, Car as CarIcon } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { cars, favorites, addServicePayment } = useCars();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });

  if (!user) {
    navigate('/login');
    return null;
  }

  const myListings = cars.filter(car => car.seller.id === user.id);
  const totalViews = myListings.length * 125; // Simulated views
  const totalLeads = myListings.length * 8; // Simulated leads

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const startEditing = () => {
    setEditData({ 
      name: user.name, 
      email: user.email, 
      phone: user.phone || '+91 98765 43210' 
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: User Card */}
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100/50 text-center sticky top-24"
          >
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary-500 rounded-2xl p-2 border-4 border-white shadow-lg">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-1">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              {user.isVerified && (
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified {user.role === 'buyer' ? 'Buyer' : 'Seller'}
                </span>
              )}
              <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">{user.role}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-2xl font-black text-slate-900">{totalViews}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-2xl font-black text-slate-900">{totalLeads}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leads</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link 
                to={user.role === 'admin' ? '/dashboard/admin' : user.role === 'dealer' ? '/dashboard/dealer' : '/dashboard/buyer'}
                className="w-full py-4 bg-primary-500 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/10"
              >
                <LayoutDashboard className="h-5 w-5" /> Go to Dashboard
              </Link>
              <button 
                id="profile-settings-btn"
                onClick={startEditing}
                className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
              >
                <Settings className="h-5 w-5" /> Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Account Management */}
        <div className="lg:col-span-8 space-y-8">
          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900">Contact Details</h3>
              <button onClick={startEditing} className="text-xs font-black text-primary-500 uppercase tracking-widest hover:underline">Manage</button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                </div>
                <p className="font-extrabold text-slate-900">{user.email}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Phone</span>
                </div>
                <p className="font-extrabold text-slate-900">{user.phone || '+91 98765 43210'}</p>
              </div>
            </div>
          </motion.div>

          {/* Account Subscriptions */}
          <div className="grid md:grid-cols-2 gap-8">
            {!user.isVerified && (
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[3rem] border border-green-100 shadow-xl shadow-green-500/5 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl" />
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Get Verified Badge</h4>
                <p className="text-sm font-bold text-slate-400 mb-6 italic">Build 10x trust with buyers & sellers</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-slate-900">₹200<span className="text-xs text-slate-400 font-bold ml-1">/3mo</span></p>
                  <button 
                    onClick={async () => {
                      try {
                        const verifiedExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
                        await updateProfile({ isVerified: true, verifiedExpiry });
                        await addServicePayment('Verification', 'Verified Badge Subscription', 200);
                        alert("Successfully subscribed to Verified Badge for ₹200!");
                      } catch (err) {
                        console.error("Verification sub failed:", err);
                        alert("Payment successful but verification failed to log. Please contact support.");
                      }
                    }}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                  >
                    Subscribe
                  </button>
                </div>
              </motion.div>
            )}

            {!user.isPremiumBuyer && user.role === 'buyer' && (
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[3rem] border border-brand-pink/30 shadow-xl shadow-brand-pink/5 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/10 blur-3xl" />
                <div className="w-14 h-14 bg-brand-pink text-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 fill-secondary-500" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Premium Buyer</h4>
                <p className="text-sm font-bold text-slate-400 mb-6 italic">Unlimited contacts & chats</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-slate-900">₹500<span className="text-xs text-slate-400 font-bold ml-1">/3mo</span></p>
                  <button 
                    onClick={async () => {
                      try {
                        const premiumExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
                        await updateProfile({ isPremiumBuyer: true, premiumExpiry });
                        await addServicePayment('Premium', 'Premium Buyer Plan Upgrade', 500);
                        alert("Successfully upgraded to Premium Buyer for ₹500!");
                      } catch (err) {
                        console.error("Premium upgrade failed:", err);
                        alert("Payment successful but premium plan failed to log. Please contact support.");
                      }
                    }}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                  >
                    Upgrade
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <Link 
              to="/profile/listings"
              className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CarIcon className="h-7 w-7" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-xl font-black text-slate-900">My Listings</h4>
                  <p className="text-sm font-bold text-slate-400">Manage your vehicles</p>
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{myListings.length} Items</div>
              </div>
            </Link>

            <Link 
              to="/profile/saved"
              className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="w-14 h-14 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-xl font-black text-slate-900">Saved Ads</h4>
                  <p className="text-sm font-bold text-slate-400">Your favorites list</p>
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{favorites.length} Items</div>
              </div>
            </Link>
          </div>

          <Link 
            to="/profile/payments"
            className="flex items-center justify-between p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-[60px]" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <IndianRupee className="h-8 w-8 text-primary-500" />
              </div>
              <div>
                <h4 className="text-2xl font-black">Transaction History</h4>
                <p className="text-slate-400 font-bold">Payments and boosts summary</p>
              </div>
            </div>
            <ChevronRight className="h-8 w-8 text-slate-700 group-hover:text-primary-500 transition-colors group-hover:translate-x-2" />
          </Link>
        </div>
      </div>

      {/* Edit Profile Sidebar/Drawer */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-black text-slate-900">Account <span className="text-primary-500">Settings</span></h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-8 flex-1">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                  <input 
                    type="email" 
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
                    placeholder="+91 00000 00000"
                    required
                  />
                </div>
                
                <div className="pt-8">
                  <button 
                    type="submit"
                    className="w-full py-5 bg-primary-500 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center justify-center gap-3"
                  >
                    <Save className="h-6 w-6" /> Save Changes
                  </button>
                </div>
              </form>
              
              <div className="mt-auto pt-8 border-t border-slate-100">
                <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-widest">Member since April 2026</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


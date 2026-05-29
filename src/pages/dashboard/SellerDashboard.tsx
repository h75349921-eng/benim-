import DashboardLayout from './DashboardLayout';
import { LayoutGrid, AlertTriangle, ShieldCheck, ChevronRight, TrendingUp, Sparkles, Plus, MessageSquare, Zap } from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Link, Navigate } from 'react-router-dom';

export default function SellerDashboard() {
  const { cars, bookings, isLoading } = useCars();
  const { user } = useAuth();

  if (isLoading) {
    return <DashboardLayout userType="Seller"><div className="p-20 text-center font-black">Loading DashboardData...</div></DashboardLayout>;
  }

  if (!user || user.role === 'dealer') {
    return <Navigate to="/dashboard/dealer" replace />;
  }

  // Filter listings where current user is the owner
  const myListings = cars.filter(car => car.seller.id === user?.id);

  const activeAds = myListings.map(car => {
    // Real data from context
    const leadsCount = bookings.filter(b => b.carId === car.id).length;
    
    return {
      ...car,
      views: Math.floor(Math.random() * 50) + 10, // In real app we'd fetch interaction count
      inquiries: leadsCount,
      health: car.images.length >= 5 ? 85 : 45,
      photos: car.images.length
    };
  });

  return (
    <DashboardLayout userType="Seller">
      <div className="space-y-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Seller Overview</h1>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">Manage your listings & health</p>
          </div>
          <Link to="/sell" className="px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/30">
            <Plus className="h-5 w-5" /> Create New Ad
          </Link>
        </div>

        {/* Listing Health Focus */}
        <div className="grid lg:grid-cols-2 gap-8">
          {activeAds.length > 0 ? activeAds.map(ad => {
            // Calculate Boost Expiration properties
            const boostExpiresAt = ad.boostExpiresAt || ad.premiumUntil;
            const boostPlanName = ad.boostPlanName || (ad.isPremium ? 'Prime Plus' : null);

            let hasActiveBoost = false;
            let hasExpiredBoost = false;
            let expiresText = '';
            let daysRemaining = 0;

            if (boostExpiresAt) {
              const expiryDate = new Date(boostExpiresAt);
              const now = new Date();
              if (expiryDate > now) {
                hasActiveBoost = true;
                const diffTime = expiryDate.getTime() - now.getTime();
                daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                expiresText = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              } else {
                hasExpiredBoost = true;
                expiresText = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              }
            } else if (ad.isPremium) {
              // Standard active boost if isPremium is true but dates aren't saved
              hasActiveBoost = true;
              expiresText = 'Active (Indefinite)';
              daysRemaining = 30;
            }

            return (
              <div key={ad.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all p-8 flex flex-col justify-between">
                <div>
                  {/* Clickable Header taking them to vehicle detail page */}
                  <Link to={`/vehicle/${ad.id}`} className="flex items-center gap-6 mb-8 cursor-pointer group/link block">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 border border-slate-150 shadow-sm">
                      <img src={ad.images[0]} className="w-full h-full object-cover group-hover/link:scale-105 transition-all duration-300" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover/link:text-primary-500 transition-colors truncate flex items-center gap-1.5 uppercase tracking-tight">
                        {ad.title}
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover/link:text-primary-500 transition-all transform group-hover/link:translate-x-1 shrink-0" />
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-primary-500 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded">Active Ad</span>
                        <span className="w-1 h-1 bg-slate-250 rounded-full" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{ad.location.split(',')[0]}</span>
                      </div>
                    </div>
                  </Link>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Views</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-slate-900">{ad.views}</span>
                        <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                      </div>
                    </div>
                    <Link to={`/inbox?carId=${ad.id}`} className="p-4 bg-slate-50 rounded-2xl flex flex-col hover:bg-primary-50 transition-all group/leads">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover/leads:text-primary-500 transition-colors">Total Leads</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900 group-hover/leads:text-primary-600 transition-colors">{ad.inquiries}</span>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover/leads:text-primary-500 transition-all transform group-hover/leads:translate-x-1" />
                      </div>
                    </Link>
                  </div>

                  {/* Health Meter */}
                  <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className={cn("h-5 w-5", ad.health > 80 ? "text-green-500" : "text-yellow-500")} />
                        <span className="text-sm font-bold text-slate-900">Listing Health</span>
                      </div>
                      <span className={cn("text-lg font-black", ad.health > 80 ? "text-green-500" : "text-yellow-500")}>{ad.health}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", ad.health > 80 ? "bg-green-500" : "bg-yellow-500")}
                        style={{ width: `${ad.health}%` }}
                      />
                    </div>
                    {ad.health < 80 && (
                      <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-yellow-100">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-900 font-bold mb-1">Boost Your Response Rate!</p>
                          <button className="text-xs text-primary-500 font-black flex items-center gap-1 hover:underline">
                            Upload {Math.max(0, 5 - ad.photos)} more photos to get Verified <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Boost Package Expiration Details Section */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  {hasActiveBoost ? (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                      <Zap className="h-5 w-5 text-emerald-500 fill-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-emerald-800 uppercase tracking-wide">Boost Status: ACTIVE</p>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-md uppercase tracking-wider">
                            {daysRemaining} Days Left
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1">
                          Package "{boostPlanName || 'Prime Plus'}" is active. Expires on {expiresText}.
                        </p>
                      </div>
                    </div>
                  ) : hasExpiredBoost ? (
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-rose-800 uppercase tracking-wide">Boost Status: EXPIRED</p>
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-black rounded-md uppercase tracking-wider">
                            Expired
                          </span>
                        </div>
                        <p className="text-[10px] text-rose-600 font-bold mt-1 mb-2">
                          Package "{boostPlanName || 'Prime Upgrade'}" expired on {expiresText}.
                        </p>
                        <Link 
                          to={`/profile/boost/${ad.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all shadow-md shadow-rose-500/10 cursor-pointer"
                        >
                          <Zap className="h-3 w-3" /> Re-Boost Ad
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/30 flex items-start gap-3">
                      <Zap className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-indigo-800 uppercase tracking-wide font-sans">Boosting Status: None</p>
                          <span className="text-[9px] font-black text-slate-400 uppercase">Standard Placement</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 mb-2">
                          Boost now to reach up to 15x more hybrid car buyers.
                        </p>
                        <Link 
                          to={`/profile/boost/${ad.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
                        >
                          <Zap className="h-3 w-3" /> Boost Listing
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="lg:col-span-2 py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <Sparkles className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Listings</h3>
              <p className="text-slate-400 font-medium mb-8">Start your journey by creating your first hybrid car ad.</p>
              <Link to="/sell" className="px-8 py-4 bg-primary-500 text-white rounded-[2rem] font-black shadow-xl shadow-primary-500/20 hover:scale-105 transition-all inline-flex items-center gap-2">
                <Plus className="h-5 w-5" /> Create My First Ad
              </Link>
            </div>
          )}
        </div>

        {/* Recent Leads Section */}
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black text-slate-900">Recent Customer Leads</h2>
            <Link to="/inbox" className="text-sm font-black text-primary-500 uppercase tracking-widest hover:underline">View All Messages</Link>
          </div>
          
          <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
            {activeAds.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {activeAds.flatMap(ad => 
                  bookings.filter(b => b.carId === ad.id).map(lead => (
                    <Link 
                      key={lead.id}
                      to={`/inbox?carId=${ad.id}`}
                      className="p-8 flex items-center gap-6 hover:bg-slate-50 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                        <img src={ad.images[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{ad.brand} {ad.model}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lead.timestamp?.toDate ? lead.timestamp.toDate().toLocaleDateString() : 'New Lead'}</span>
                          {lead.type === 'PhoneView' && (
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Phone View</span>
                          )}
                          {lead.type === 'Chat' && (
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Chat Inquiry</span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-lg">
                          {lead.type === 'PhoneView' ? `Phone viewed by ${lead.userName}` : 
                           lead.type === 'Chat' ? `New chat from ${lead.userName}` : 
                           `Inquiry from ${lead.userName}`}
                        </h4>
                        <p className="text-sm text-slate-400 font-medium truncate italic">
                          {lead.type === 'PhoneView' ? `Buyer revealed your contact number for ${ad.title}` : 
                           lead.type === 'Chat' ? `Buyer started a conversation about your car` :
                           `"Hi, I am interested in viewing this vehicle..."`}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-all">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                    </Link>
                  ))
                ).slice(0, 5)}
                
                {activeAds.every(ad => bookings.filter(b => b.carId === ad.id).length === 0) && (
                  <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No leads yet</h3>
                    <p className="text-slate-400 font-medium">Wait for buyers to inquire about your hybrid listings.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active ads to receive lead from</p>
              </div>
            )}
          </div>
        </div>

        {/* Prime Promotion */}
        <div className="bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden text-center lg:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 blur-[120px] opacity-40 -z-0" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-6">
                <Sparkles className="h-3 w-3 text-yellow-400" /> Professional Boost
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Sell 3x Faster with <span className="text-primary-400">Prime Plus</span></h2>
              <p className="text-slate-400 font-medium mb-0">Get top slot visibility, professional photoshoot, and a dedicated sales manager for your premium hybrid car.</p>
            </div>
            <button className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-xl">
              Upgrade Listing
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Trash2, 
  ShieldCheck, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  TrendingUp,
  Filter,
  MessageSquare,
  Sparkles,
  Lock,
  ChevronRight,
  Shield,
  Star
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Navigate, Link } from 'react-router-dom';

interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'dealer' | 'admin';
  avatar: string;
  phone?: string;
  isPremiumBuyer?: boolean;
  isVerified?: boolean;
}

export default function AdminDashboard() {
  const { cars, bookings, isLoading: carsLoading, toggleFavorite } = useCars();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'activity'>('listings');
  const [userList, setUserList] = useState<FirebaseUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  
  // Search and filter states
  const [listingSearch, setListingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [listingFilter, setListingFilter] = useState<'all' | 'premium' | 'verified' | 'normal'>('all');
  const [userFilter, setUserFilter] = useState<'all' | 'admin' | 'dealer' | 'seller' | 'buyer'>('all');

  // Fetch all users on mount
  useEffect(() => {
    async function fetchUsers() {
      if (!user || user.role !== 'admin') return;
      try {
        setUsersLoading(true);
        const usersSnap = await getDocs(collection(db, 'users'));
        const fetchedUsers: FirebaseUser[] = [];
        usersSnap.forEach((d) => {
          fetchedUsers.push({ id: d.id, ...d.data() } as FirebaseUser);
        });
        setUserList(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setUsersLoading(false);
      }
    }
    fetchUsers();
  }, [user]);

  if (carsLoading || (usersLoading && user?.role === 'admin')) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Loading Admin Command Center...</h2>
        </div>
      </div>
    );
  }

  // Double-check authentication and administrative authorization
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 border border-slate-100 text-center shadow-xl">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Access Restricted</h2>
          <p className="text-slate-400 font-semibold mb-8 italic">This terminal is restricted to Benim Cars administrators only. Please sign in with an authorized account.</p>
          <Link to="/" className="w-full inline-block py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Filter listings
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(listingSearch.toLowerCase()) || 
                          car.brand.toLowerCase().includes(listingSearch.toLowerCase()) || 
                          car.model.toLowerCase().includes(listingSearch.toLowerCase()) ||
                          car.location.toLowerCase().includes(listingSearch.toLowerCase());
    
    if (!matchesSearch) return false;
    if (listingFilter === 'premium') return car.isPremium || car.status === 'Prime';
    if (listingFilter === 'verified') return car.isVerified;
    if (listingFilter === 'normal') return !car.isPremium && !car.isVerified;
    return true;
  });

  // Filter users
  const filteredUsers = userList.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.phone || '').toLowerCase().includes(userSearch.toLowerCase());
    
    if (!matchesSearch) return false;
    if (userFilter !== 'all' && u.role !== userFilter) return false;
    return true;
  });

  // Calculate stats
  const totalCars = cars.length;
  const premiumCars = cars.filter(c => c.isPremium || c.status === 'Prime').length;
  const verifiedCars = cars.filter(c => c.isVerified).length;
  const pendingVerificationCount = cars.filter(c => c.isVerificationPending).length;
  const totalUsers = userList.length;
  const totalInquiries = bookings.length;

  // Actions on Cars
  const handleToggleCarVerification = async (carId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'cars', carId), { 
        isVerified: !currentStatus,
        isVerificationPending: false,
        verificationStatus: !currentStatus ? 'approved' : 'none'
      });
      // In a real database scenario, context syncs automatically or manually refetched.
      // We also display an alert for visual feedback.
      alert(`Car verification set to: ${!currentStatus ? 'VERIFIED' : 'UNVERIFIED'}`);
      window.location.reload(); // Quick refresh to update CarContext state
    } catch (error) {
      console.error('Error toggling car verification:', error);
    }
  };

  const handleApproveFreeVerification = async (carId: string) => {
    try {
      await updateDoc(doc(db, 'cars', carId), { 
        isVerified: true,
        isVerificationPending: false,
        verificationStatus: 'approved'
      });
      alert('Verification request APPROVED! This vehicle has received its free verified badge.');
      window.location.reload();
    } catch (error) {
      console.error('Error approving verification:', error);
    }
  };

  const handleMarkInspectionCompleted = async (carId: string) => {
    try {
      await updateDoc(doc(db, 'cars', carId), { 
        verificationStatus: 'inspection_completed'
      });
      alert('Physical inspection status set to SUCCESSFUL/COMPLETED! Now you can grant the final Verified Badge.');
      window.location.reload();
    } catch (error) {
      console.error('Error marking inspection completed:', error);
    }
  };

  const handleRejectFreeVerification = async (carId: string) => {
    if (!window.confirm('Are you sure you want to decline verification for this listing?')) return;
    try {
      await updateDoc(doc(db, 'cars', carId), { 
        isVerified: false,
        isVerificationPending: false,
        verificationStatus: 'rejected'
      });
      alert('Verification request DECLINED.');
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting verification:', error);
    }
  };

  const handleToggleCarPremium = async (carId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'cars', carId), { 
        isPremium: !currentStatus,
        status: !currentStatus ? 'Prime' : 'Standard'
      });
      alert(`Car Premium flag set to: ${!currentStatus ? 'PREMIUM (Prime)' : 'NORMAL'}`);
      window.location.reload();
    } catch (error) {
      console.error('Error toggling car premium:', error);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this listing from the marketplace? This action is irreversible.')) return;
    try {
      await deleteDoc(doc(db, 'cars', carId));
      alert('Listing successfully removed from Benim Cars.');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  // Actions on Users
  const handleToggleUserVerification = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isVerified: !currentStatus });
      setUserList(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !currentStatus } : u));
      alert(`User verification badge set to: ${!currentStatus ? 'ACTIVE' : 'INACTIVE'}`);
    } catch (error) {
      console.error('Error toggling user verification:', error);
    }
  };

  const handleToggleUserPremium = async (userId: string, currentPremium: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isPremiumBuyer: !currentPremium });
      setUserList(prev => prev.map(u => u.id === userId ? { ...u, isPremiumBuyer: !currentPremium } : u));
      alert(`User premium subscription set to: ${!currentPremium ? 'SUBSCRIBED' : 'UNSUBSCRIBED'}`);
    } catch (error) {
      console.error('Error toggling user premium:', error);
    }
  };

  const handleUserRoleChange = async (userId: string, newRole: 'buyer' | 'seller' | 'dealer' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUserList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert(`User role successfully updated to: ${newRole.toUpperCase()}`);
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-red-100 animate-pulse">
                <Shield className="h-3 w-3 fill-red-500" /> Authorized Admin Terminal
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Benim Cars India</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-none">Command Center</h1>
            <p className="text-slate-400 font-medium mt-1">Manage hybrid vehicles, user accounts, and customer activity logs</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Operator</p>
              <p className="font-extrabold text-slate-900">{user.name}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <img src={user.avatar} className="w-full h-full object-cover" alt="" />
            </div>
          </div>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{totalCars}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Cars</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
              <Star className="h-6 w-6 fill-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-amber-500">{premiumCars}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Premium Ads</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4 relative">
              <ShieldCheck className="h-6 w-6" />
              {pendingVerificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-550 text-[9px] text-white font-black items-center justify-center">{pendingVerificationCount}</span>
                </span>
              )}
            </div>
            <div>
              <p className="text-3xl font-black text-amber-600">{pendingVerificationCount}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pending Verif.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-green-500">{verifiedCars}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verified Ads</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{totalUsers || 'Loading...'}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Users</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{totalInquiries}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Leads Logged</p>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('listings')}
            className={cn(
              "px-8 py-4 font-black text-sm uppercase tracking-wider border-b-4 transition-all flex items-center gap-2",
              activeTab === 'listings' ? "border-primary-500 text-primary-500" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <Car className="h-4 w-4" /> Vehicles Inventory ({totalCars})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-8 py-4 font-black text-sm uppercase tracking-wider border-b-4 transition-all flex items-center gap-2",
              activeTab === 'users' ? "border-primary-500 text-primary-500" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <Users className="h-4 w-4" /> Users List ({totalUsers || '...'})
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={cn(
              "px-8 py-4 font-black text-sm uppercase tracking-wider border-b-4 transition-all flex items-center gap-2",
              activeTab === 'activity' ? "border-primary-500 text-primary-500" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <MessageSquare className="h-4 w-4" /> CRM Inquiries Activity ({totalInquiries})
          </button>
        </div>

        {/* Tab 1: Listings Inventory Manager */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            {/* Special Section: Pending Pune Free Verification Requests */}
            {cars.filter(car => car.isVerificationPending).length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[2.5rem] border border-amber-200 p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-amber-900 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-amber-500" /> Pune Free Verification Requests
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold mt-1">These Pune, Maharashtra first-owner cars (&lt; 60,000 km) are waiting for your approval to get a Free Verified Batch.</p>
                  </div>
                  <span className="px-3.5 py-1.5 bg-amber-500 text-white text-xs font-black rounded-xl uppercase tracking-wider animate-pulse">
                    Action Required
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.filter(car => car.isVerificationPending).map((car) => (
                    <div key={car.id} className="bg-white rounded-3xl border border-amber-200/50 overflow-hidden shadow-sm flex flex-col justify-between p-5 space-y-4 hover:shadow-md transition-all relative">
                      {/* Flag badges */}
                      <div className="absolute top-3 right-3 z-10">
                        {car.verificationStatus === 'inspection_completed' ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider rounded-lg">
                            Inspection Passed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[8px] font-black uppercase tracking-wider rounded-lg animate-pulse">
                            Scheduled
                          </span>
                        )}
                      </div>

                      <div className="flex gap-4 pr-16 mt-2">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                          <img src={car.images[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">{car.title}</h4>
                          <p className="text-[10px] text-slate-400 font-black tracking-wider uppercase mt-1">₹{car.price.toLocaleString()} • {car.year}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[8px] font-extrabold rounded uppercase">{car.location}</span>
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-extrabold rounded uppercase">{car.kmDriven ?? car.mileage ?? 0} KM</span>
                          </div>
                        </div>
                      </div>

                      {/* Status / Stages Block */}
                      <div className="p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2 text-left">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inspection & Verification Status</p>
                        
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            (car.verificationStatus === 'inspection_pending' || car.verificationStatus === 'inspection_completed') ? "bg-emerald-500" : "bg-slate-300"
                          )} />
                          <span className="text-[10px] font-bold text-slate-600">1. User Requested Benim Cars Inspection</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            car.verificationStatus === 'inspection_completed' ? "bg-emerald-500" : "bg-slate-300"
                          )} />
                          <span className="text-[10px] font-bold text-slate-600">2. Physical Inspection Passed Successfully</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100/50">
                        {car.verificationStatus !== 'inspection_completed' ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleMarkInspectionCompleted(car.id)}
                              className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                            >
                              Confirm Inspection Passed
                            </button>
                            <button 
                              onClick={() => handleApproveFreeVerification(car.id)}
                              className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-emerald-100/50 cursor-pointer"
                            >
                              Verify Direct
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleApproveFreeVerification(car.id)}
                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                          >
                            Approve & Grant Verified Badge
                          </button>
                        )}
                        <button 
                          onClick={() => handleRejectFreeVerification(car.id)}
                          className="w-full py-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all border border-rose-100/40 cursor-pointer"
                        >
                          Reject Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:max-w-md bg-white rounded-2xl border border-slate-100 px-4 py-3 flex items-center gap-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  placeholder="Search brand, model, title..." 
                  className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-900 w-full placeholder:text-slate-400"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <select 
                  value={listingFilter}
                  onChange={(e) => setListingFilter(e.target.value as any)}
                  className="bg-white border border-slate-100 rounded-2xl px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 focus:ring-primary-500"
                >
                  <option value="all">All Vehicles</option>
                  <option value="premium">Premium Ads</option>
                  <option value="verified">Verified Ads</option>
                  <option value="normal">Standard Ads</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car) => (
                <div key={car.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img src={car.images[0]} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {car.isPremium && (
                        <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Zap className="h-3 w-3 fill-white" /> Premium
                        </span>
                      )}
                      {car.isVerified && (
                        <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 line-clamp-1">{car.title}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-300" /> {car.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-b border-slate-50 py-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</p>
                        <p className="text-lg font-black text-slate-900">₹{car.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year</p>
                        <p className="font-extrabold text-slate-900">{car.year}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleCarVerification(car.id, car.isVerified)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all text-center",
                            car.isVerified 
                              ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100" 
                              : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-slate-600"
                          )}
                        >
                          {car.isVerified ? 'Unverify Listing' : 'Verify Listing'}
                        </button>
                        <button 
                          onClick={() => handleToggleCarPremium(car.id, car.isPremium)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all text-center",
                            car.isPremium 
                              ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100" 
                              : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-slate-600"
                          )}
                        >
                          {car.isPremium ? 'Remove Prime' : 'Upgrade Prime'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/vehicle/${car.id}`}
                          className="flex-1 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all"
                        >
                          View Live
                        </Link>
                        <button 
                          onClick={() => handleDeleteCar(car.id)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all flex items-center justify-center border border-red-100/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Users Accounts Manager */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:max-w-md bg-white rounded-2xl border border-slate-100 px-4 py-3 flex items-center gap-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..." 
                  className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-900 w-full placeholder:text-slate-400"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <select 
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as any)}
                  className="bg-white border border-slate-100 rounded-2xl px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-500 focus:ring-primary-500"
                >
                  <option value="all">All Roles</option>
                  <option value="seller">Sellers Only</option>
                  <option value="buyer">Buyers Only</option>
                  <option value="dealer">Dealers Only</option>
                  <option value="admin">Administrators Only</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Status</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions / Privileges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm bg-slate-50">
                              <img src={item.avatar} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">{item.name || 'Anonymous User'}</p>
                              <p className="text-xs text-slate-400 font-medium">{item.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <select 
                            value={item.role}
                            onChange={(e) => handleUserRoleChange(item.id, e.target.value as any)}
                            className="bg-slate-50 border-none rounded-xl px-3 py-1.5 font-bold text-xs uppercase tracking-tight text-slate-700"
                          >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="dealer">Dealer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                item.isVerified ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                              )}>
                                {item.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                item.isPremiumBuyer ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"
                              )}>
                                {item.isPremiumBuyer ? 'PREMIUM ACCESS' : 'STANDARD'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleToggleUserVerification(item.id, !!item.isVerified)}
                              className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                item.isVerified 
                                  ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-slate-600"
                              )}
                            >
                              Verification
                            </button>
                            <button 
                              onClick={() => handleToggleUserPremium(item.id, !!item.isPremiumBuyer)}
                              className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                item.isPremiumBuyer 
                                  ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-slate-600"
                              )}
                            >
                              Premium
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: activity CRM Log */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary-500" /> Unified Customer Leads
                </h3>
                <span className="px-4 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                  Total Captured: {totalInquiries}
                </span>
              </div>

              {bookings.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {bookings.map((lead) => (
                    <div key={lead.id} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-50/50 transition-all rounded-3xl p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider",
                            lead.type === 'PhoneView' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {lead.type === 'PhoneView' ? 'Revealed Contact' : lead.type || 'Inquiry'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                            {lead.timestamp?.toDate ? lead.timestamp.toDate().toLocaleString() : 'Just Now'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          {lead.userName} <span className="font-normal text-slate-400">interacted with</span> {lead.carTitle}
                        </h4>
                        <p className="text-xs text-slate-400 italic">
                          {lead.type === 'PhoneView' 
                            ? "Viewed seller's phone number and detailed contact details." 
                            : "Initiated deep conversation with the owner."}
                        </p>
                      </div>
                      <Link 
                        to={`/vehicle/${lead.carId}`}
                        className="self-start md:self-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2"
                      >
                        Inspection Details <ChevronRight className="h-4 w-4" strokeWidth={3} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center select-none">
                  <Sparkles className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold italic">No inquiry activities found on the system database.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Car, ChevronRight, Plus, Zap, ChevronLeft, ShieldCheck, ExternalLink, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function MyListings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cars } = useCars();
  
  // Filter cars where current user is the owner
  const myCars = cars.filter(car => car.seller.id === user?.id);

  const handleStartInspectionRedirect = async (carId: string) => {
    try {
      await updateDoc(doc(db, 'cars', carId), {
        verificationStatus: 'inspection_pending',
        isVerificationPending: true
      });
      window.open('https://benimcars.com/', '_blank');
    } catch (error) {
      console.error('Error starting inspection redirect:', error);
    }
  };

  const calculateDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">My Listings</h1>
          <p className="text-slate-500 font-medium">Manage and track your active vehicle advertisements.</p>
        </div>
        <Link 
          to="/sell" 
          className="px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all"
        >
          <Plus className="h-5 w-5" /> Create New Listing
        </Link>
      </div>

      {myCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myCars.map((car) => {
            const isEligibleForFreeVerification = 
              car.location?.toLowerCase().includes('pune') && 
              (car.kmDriven ?? car.mileage ?? 0) < 60000 && 
              car.ownerType === 'First Owner';
            const daysRemaining = car.boostExpiresAt ? calculateDaysRemaining(car.boostExpiresAt) : null;
            const boostExpiresDate = car.boostExpiresAt ? new Date(car.boostExpiresAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : null;

            return (
              <div key={car.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col">
                <ListingCard car={car} />
                
                {/* Boost Expiry Display */}
                {car.boostPlanName && (
                  <div className="px-6 pb-2 text-[10px] font-black text-primary-600 uppercase tracking-widest">
                    Boost Active: {car.boostPlanName} {daysRemaining !== null ? `(${daysRemaining} days left - Expires: ${boostExpiresDate})` : 'Calculating...'}
                  </div>
                )}

                {/* Pune Free Verification Banner */}
                {!car.isVerified && isEligibleForFreeVerification && (
                  <div className="px-6 pb-4">
                    <div className="p-4 bg-slate-50 border border-emerald-150 rounded-2xl flex flex-col gap-2.5 bg-gradient-to-br from-emerald-50/40 to-teal-50/40">
                      <div className="flex gap-2 items-start">
                        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Free Verified Badge</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-relaxed font-sans">
                            Your Pune first-owner car with &lt;60k km is qualified for a FREE verified badge!
                          </p>
                        </div>
                      </div>

                      {car.verificationStatus === 'inspection_pending' ? (
                        <div className="space-y-2 mt-0.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-black uppercase tracking-wider rounded-md">
                            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                            Inspection Requested
                          </span>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">
                            We recorded that you requested a Benim Cars inspection. Attend the appointment at your local Pune hub to complete verification.
                          </p>
                          <button 
                            type="button"
                            onClick={() => window.open('https://benimcars.com/', '_blank')}
                            className="w-full py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            Re-open Benim Cars <ExternalLink className="h-3 w-3 text-slate-400" />
                          </button>
                        </div>
                      ) : car.verificationStatus === 'inspection_completed' ? (
                        <div className="space-y-1 mt-0.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider rounded-md">
                            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                            Inspection Done
                          </span>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">
                            Physical inspection marked as successful by Benim Cars! Administration is reviewing and will confirm your verified badge shortly.
                          </p>
                        </div>
                      ) : car.verificationStatus === 'rejected' ? (
                        <div className="space-y-1 mt-0.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-100 text-rose-800 text-[8px] font-black uppercase tracking-wider rounded-md">
                            Verification Declined
                          </span>
                          <p className="text-[10px] text-rose-500 font-medium">Please contact admin support to re-submit inspection requests.</p>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => handleStartInspectionRedirect(car.id)}
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-500/15 cursor-pointer"
                        >
                          Book Free Inspection <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-6 pt-0 mt-auto grid grid-cols-2 gap-3">
                  <Link 
                    to={`/profile/edit/${car.id}`}
                    className="py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm text-center hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    Edit Details
                  </Link>
                  <Link 
                    to={`/profile/boost/${car.id}`}
                    className="py-3 bg-brand-pink/50 text-secondary-500 rounded-xl font-bold text-sm text-center hover:brightness-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="h-4 w-4" /> Boost
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Car className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Listings</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Start selling your hybrid car today and reach thousands of buyers.</p>
          <Link to="/sell" className="text-primary-500 font-bold hover:underline"> Create Your First Listing &rarr;</Link>
        </motion.div>
      )}
    </div>
  );
}

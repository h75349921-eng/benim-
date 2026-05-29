import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, TrendingUp, ChevronLeft, CreditCard, CheckCircle } from 'lucide-react';
import { useCars } from '../context/CarContext';

const BOOST_PACKAGES = [
  {
    id: 'standard',
    name: 'Prime Batch',
    priceLabel: '₹300',
    price: 300,
    duration: '1 Month',
    features: ['Prime Batch', 'Priority Support', '5x More Views'],
    color: 'bg-brand-purple/10 border-brand-purple/30',
    icon: Zap,
    iconColor: 'text-primary-500'
  },
  {
    id: 'prime',
    name: 'Prime Boost',
    priceLabel: '₹500',
    price: 500,
    duration: '3 Months',
    features: ['Top of Search Results', 'Prime Dealer Badge', '15x More Views', 'Social Media Feature'],
    color: 'bg-brand-pink/20 border-brand-pink/50',
    popular: true,
    icon: Zap,
    iconColor: 'text-secondary-500'
  },
  {
    id: 'elite',
    name: 'Elite Dealer',
    priceLabel: '₹2,000',
    price: 2000,
    duration: '30 Days',
    features: ['Infinite Refresh', 'Featured Homepage Slot', 'Personalized Support', 'Premium Analytics'],
    color: 'bg-brand-blue/10 border-brand-blue/30',
    icon: TrendingUp,
    iconColor: 'text-blue-500'
  }
];

export default function BoostListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { boostListing, cars } = useCars();
  const [selectedPackage, setSelectedPackage] = useState('prime');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const car = cars.find(c => c.id === id);

  if (!car) return <div>Listing not found.</div>;

  const handlePayment = () => {
    setIsProcessing(true);
    const pkg = BOOST_PACKAGES.find(p => p.id === selectedPackage);
    
    setTimeout(() => {
      if (pkg && id) {
        boostListing(id, { name: pkg.name, price: pkg.price });
      }
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl"
        >
          <Zap className="h-12 w-12 text-white" />
        </motion.div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Listing Boosted!</h1>
        <p className="text-slate-500 mb-10 font-medium text-lg">
          Your {car.year} {car.brand} {car.model} is now reaching 15x more potential buyers.
        </p>
        <Link 
          to="/profile/listings" 
          className="px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all inline-block"
        >
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/profile/listings" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors mb-8">
        <ChevronLeft className="h-5 w-5" /> Back to Listings
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-slate-900 mb-6">Boost Your Listing</h1>
          <p className="text-slate-500 font-medium mb-10 text-lg">
            Reach thousands of serious hybrid buyers instantly. Pick a package that fits your goal.
          </p>

          <div className="grid gap-4">
            {BOOST_PACKAGES.map((pkg) => (
              <label 
                key={pkg.id}
                className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedPackage === pkg.id ? 'ring-2 ring-primary-500 ' + pkg.color : 'bg-white border-slate-100 hover:border-slate-200'}`}
              >
                <input 
                  type="radio" 
                  name="boost" 
                  className="hidden" 
                  checked={selectedPackage === pkg.id}
                  onChange={() => setSelectedPackage(pkg.id)}
                />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pkg.iconColor} bg-white shadow-sm`}>
                  <pkg.icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-xl text-slate-900">{pkg.name}</h3>
                    {pkg.popular && (
                      <span className="bg-secondary-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Popular</span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {pkg.features.map((f, i) => (
                      <span key={i} className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900">{pkg.priceLabel}</p>
                  <p className="text-xs font-bold text-slate-400">{pkg.duration}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="lg:w-96">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 sticky top-24">
            <h3 className="text-xl font-black text-slate-900 mb-6">Summary</h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
              <img src={car.images[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
              <div>
                <p className="font-bold text-slate-900 text-sm truncate">{car.year} {car.brand} {car.model}</p>
                <p className="text-xs text-slate-500 font-medium">₹{car.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3 mb-8 border-t border-slate-100 pt-6">
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Selected Plan</span>
                <span className="text-slate-900">{BOOST_PACKAGES.find(p => p.id === selectedPackage)?.name}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Tax (GST 18%)</span>
                <span className="text-slate-900">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 pt-3 border-t border-dashed border-slate-200">
                <span>Total</span>
                <span>{BOOST_PACKAGES.find(p => p.id === selectedPackage)?.priceLabel}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><CreditCard className="h-5 w-5" /> Pay Now</>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 font-medium mt-4">Secure payment powered by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}

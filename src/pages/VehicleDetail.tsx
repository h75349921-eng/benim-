import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { 
  ChevronLeft, Heart, Share2, MapPin, Calendar, 
  Fuel, Settings2, Gauge, ShieldCheck, Zap, 
  ChevronRight, Phone, MessageCircle, AlertCircle, Eye,
  CheckCircle2
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ListingCard from '../components/ListingCard';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, toggleFavorite, isFavorite, bookCar, logInteraction, isLoading: carsLoading } = useCars();
  const { startChat } = useChat();
  const { user, trackPhoneNumberView, trackChatStart } = useAuth();
  
  const car = cars.find(c => c.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [showBuyerPremiumModal, setShowBuyerPremiumModal] = useState(false);
  const favorite = isFavorite(car?.id || '');

  if (carsLoading) return <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mr-2" /></div>;

  if (!car) return <div className="p-20 text-center font-black text-slate-900 uppercase">Vehicle not found.</div>;

  const handleViewPhone = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const success = await trackPhoneNumberView(car.id);
    if (!success) {
      setShowBuyerPremiumModal(true);
      return;
    }

    setShowPhone(true);
    setShowNotification(true);
    await logInteraction(car.id, 'PhoneView');
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleMessageSeller = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Don't chat with self
    if (car.seller.id === user.id) {
      alert("This is your listing.");
      return;
    }

    const success = await trackChatStart(car.seller.id);
    if (!success) {
      setShowBuyerPremiumModal(true);
      return;
    }

    setIsStartingChat(true);
    console.log('Message Seller process started');
    try {
      const initialMsg = `Hi! I'm interested in your ${car.title}. Is it still available?`;
      
      const chatId = await startChat(
        car.seller.id, 
        car.seller.name, 
        car.seller.id.startsWith('u') ? `https://i.pravatar.cc/150?u=${car.seller.id}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
        `${car.seller.type} Seller`,
        initialMsg,
        car.id,
        {
          title: car.title || `${car.brand} ${car.model}`,
          image: car.images[0],
          price: car.price.toLocaleString()
        }
      );
      
      console.log('Chat started successfully, navigating to inbox with chatId:', chatId);
      await logInteraction(car.id, 'Chat');
      navigate('/inbox');
    } catch (error) {
      console.error('Chat error:', error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setIsStartingChat(false);
    }
  };

  const images = car.images.length > 0 ? car.images : [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop'
  ];

  const similarListings = cars.filter(c => c.id !== car.id).slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Buyer Premium Modal */}
      <AnimatePresence>
        {showBuyerPremiumModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowBuyerPremiumModal(false)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 rotate-180" />
              </button>

              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-brand-pink rounded-3xl flex items-center justify-center text-secondary-500 shadow-xl shadow-brand-pink/20 mx-auto mb-8">
                  <Zap className="h-10 w-10 fill-secondary-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Unlock <span className="text-secondary-500">Premium Buy</span></h2>
                <p className="text-slate-500 font-bold mb-10 leading-relaxed">
                  You've reached the limit for free connections. Subscribe to the Premium Buyer Pack to view unlimited contact numbers and chat with more sellers.
                </p>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Exclusive Offer</p>
                  <p className="text-4xl font-black text-slate-900 mb-2">₹500<span className="text-sm text-slate-400 font-bold">/3 Months</span></p>
                  <ul className="text-left space-y-3 mt-6">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-secondary-500" /> Unlimited Phone Number Views</li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-secondary-500" /> Unlimited Chats with Sellers</li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-secondary-500" /> Premium Buyer Badge</li>
                  </ul>
                </div>

                <button 
                  onClick={() => {
                    // In a real app, this would trigger payment
                    alert("Redirecting to secure payment...");
                    setShowBuyerPremiumModal(false);
                  }}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all"
                >
                  Upgrade to Premium
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-slate-700"
          >
            <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest">Notification Sent</p>
              <p className="text-slate-400 text-xs font-bold">Seller has been notified that you viewed their contact.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-500 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" /> Back
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              onClick={() => toggleFavorite(car.id)}
              className={cn(
                "p-2.5 rounded-xl border border-slate-100 transition-all",
                favorite ? "bg-pink-50 text-pink-500 border-pink-100" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Title & Badge Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{car.ownerType}</span>
                  {car.isVerified && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">{car.title}</h1>
                <div className="flex items-center gap-4 mt-4 text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {car.location}, {car.state}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span>Added 2 days ago</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-white shadow-xl shadow-slate-200/50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('placehold.co')) {
                        target.src = `https://placehold.co/1200x800/f8fafc/64748b?text=${encodeURIComponent(car.title)}`;
                      }
                    }}
                  />
                </AnimatePresence>
                
                {images.length > 1 && (
                  <>
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                      <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)} className="p-4 rounded-3xl bg-white/50 backdrop-blur-md text-slate-900 pointer-events-auto hover:bg-white transition-all shadow-xl">
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)} className="p-4 rounded-3xl bg-white/50 backdrop-blur-md text-slate-900 pointer-events-auto hover:bg-white transition-all shadow-xl">
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setActiveImage(i)} className={cn("w-2 h-2 rounded-full transition-all", activeImage === i ? "w-8 bg-white" : "bg-white/50")} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={cn("aspect-video rounded-2xl overflow-hidden border-2 transition-all", activeImage === i ? "border-primary-500 scale-[0.98]" : "border-transparent opacity-60 hover:opacity-100")}>
                    <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" crossOrigin="anonymous" onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('placehold.co')) {
                        target.src = `https://placehold.co/400x300/f8fafc/64748b?text=Image+${i + 1}`;
                      }
                    }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Specs Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Gauge, label: 'KM Driven', value: `${(car.kmDriven ?? car.mileage ?? 0).toLocaleString()} km` },
                { icon: Calendar, label: 'Reg. Year', value: car.year },
                { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
                { icon: Settings2, label: 'Transmission', value: car.transmission },
              ].map((spec, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-slate-50 text-secondary-500 rounded-xl flex items-center justify-center mb-3">
                    <spec.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{spec.label}</p>
                  <p className="font-extrabold text-slate-900 text-sm leading-none">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Detailed Specs */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                Vehicle Overview
              </h2>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { label: 'Brand', value: car.brand },
                  { label: 'Model', value: car.model },
                  { label: 'Reg. State', value: car.state },
                  { label: 'Ownership', value: car.ownerType },
                  { label: 'Color', value: car.specs.color || 'Not Specified' },
                  { label: 'Insurance', value: car.specs.insuranceStatus || 'Valid' },
                  { label: 'Engine', value: car.specs.engine },
                  { label: 'Power', value: car.specs.power },
                  { label: 'Steering', value: car.specs.steeringType || (car.specs.adjustableSteering ? 'Adjustable' : 'Fixed') },
                  { label: 'Accident Hist.', value: car.specs.accidentHistory || 'None' },
                  { label: 'Bluetooth', value: car.specs.bluetooth ? 'Yes' : 'No' },
                  { label: 'Body Type', value: car.specs.bodyType || 'Sedan' },
                  { label: 'Seating', value: `${car.specs.seatingCapacity || 5} Seater` },
                  { label: 'Drivetrain', value: car.specs.driveTrain || 'FWD' },
                  { label: 'Service Hist.', value: car.specs.serviceHistory || 'Not Provided' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-xl">
                    <span className="text-slate-400 font-extrabold text-xs uppercase tracking-wider">{item.label}</span>
                    <span className="text-slate-900 font-black text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Description */}
            {car.description && (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary-500 rounded-full" />
                  Seller's Description
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                    {car.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (Right) */}
          <div className="space-y-8">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="mb-8">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Exclusive Deal</p>
                  <h3 className="text-5xl font-black text-slate-900 italic">
                    ₹{(car.price / 100000).toFixed(1)}<span className="text-xl not-italic ml-2 text-slate-300 font-bold tracking-tighter">Lakh</span>
                  </h3>
                </div>

                {user?.id !== car.seller.id && (
                  <div className="mt-8 space-y-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMessageSeller}
                      disabled={isStartingChat}
                      className="w-full py-6 px-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {isStartingChat ? (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="uppercase tracking-widest text-sm">Initiating Chat...</span>
                        </div>
                      ) : (
                        <>
                          <MessageCircle className="h-7 w-7 text-primary-500 group-hover:scale-110 transition-transform" /> 
                          <span className="uppercase tracking-widest">Chat with Seller</span>
                        </>
                      )}
                    </motion.button>

                    <div className="relative group">
                      <button 
                        onClick={handleViewPhone}
                        className={cn(
                          "w-full py-5 px-6 bg-slate-100 text-slate-900 rounded-[2rem] font-black text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-inner",
                          showPhone && "bg-green-500 text-white shadow-green-500/20"
                        )}
                      >
                        {showPhone ? <><span className="text-2xl font-black">+91 98765 43210</span></> : <><Phone className="h-6 w-6 text-slate-400" /> View Phone Number</>}
                      </button>
                      {showPhone && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full whitespace-nowrap shadow-xl">
                          CONTACT REVEALED
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {user?.id === car.seller.id && (
                  <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">You are the seller of this vehicle.</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-slate-100">
                  {car.isVerified && (
                    <div className="p-6 bg-green-50/50 border border-green-100 rounded-[2rem] mb-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <h5 className="font-black text-green-900 text-sm mb-1 uppercase tracking-tight">Verified Listing</h5>
                          <p className="text-xs text-green-600 font-bold leading-relaxed">
                            Passed 150+ point quality inspection by experts. Guaranteed single owner.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Seller Card */}
                  <Link to={`/seller/${car.seller.id}`} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                      <img 
                        src={car.seller.id.startsWith('u') ? `https://i.pravatar.cc/150?u=${car.seller.id}` : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150'} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                        alt={car.seller.name} 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{car.seller.type} Seller</p>
                      <h4 className="font-black text-slate-900 truncate group-hover:text-primary-500 transition-colors">{car.seller.name}</h4>
                      {car.seller.isVerified && (
                        <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                          <ShieldCheck className="h-3 w-3" /> Verified Dealer
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings Same as before ... */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">Similar <span className="text-primary-500">Listings</span></h2>
            <Link to="/browse" className="text-primary-500 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Browse More <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarListings.map(item => (
              <ListingCard key={item.id} car={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

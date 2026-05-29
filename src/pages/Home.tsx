import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck, Sparkles, Car as CarIcon, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { useCars } from '../context/CarContext';
import { cn } from '../lib/utils';

export default function Home() {
  const { cars } = useCars();
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple/50 rounded-full text-primary-500 font-bold text-xs uppercase tracking-widest mb-6">
                <Sparkles className="h-3 w-3" />
                Premium Car Marketplace
              </div>
              <h1 className="text-6xl lg:text-7xl font-extrabold text-bento-text leading-[1.05] mb-8 tracking-tighter">
                Find your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">perfect drive</span>
              </h1>
              <p className="text-lg text-bento-muted max-w-lg mb-10 leading-relaxed font-medium">
                Browse {cars.length > 0 ? cars.length : '1,240'}+ verified listings. The most trusted destination for eco-conscious performance in India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/browse" className="px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/30 hover:bg-primary-600 transition-all flex items-center gap-2">
                  Explore Listings <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/sell" className="px-8 py-4 bg-brand-pink text-secondary-500 rounded-2xl font-bold text-lg hover:brightness-95 transition-all">
                  Sell Your Car
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-base font-bold text-bento-text leading-tight">Joined by 10k+ Buyers</p>
                  <p className="text-sm text-bento-muted font-medium">Across Mumbai, Delhi & Bangalore</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-brand-purple/40 via-transparent to-brand-blue/40 blur-[120px] -z-10" />
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/50">
                <img
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2000&auto=format&fit=crop"
                  alt="Featured Hybrid Car"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 p-5 bg-white rounded-3xl shadow-xl border border-bento-border flex items-center gap-4"
              >
                <div className="w-11 h-11 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-bento-text">Verified Ads Only</p>
                  <p className="text-[11px] font-medium text-bento-muted leading-tight">Strict Quality Policy</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, label: 'Hybrid Expert', value: '100%', color: 'bg-brand-yellow/50 text-yellow-600' },
              { icon: TrendingUp, label: 'Resale Value', value: 'Prime', color: 'bg-brand-blue/50 text-blue-600' },
              { icon: CarIcon, label: 'Active Ads', value: `${cars.length > 0 ? cars.length : '1,240'}+`, color: 'bg-brand-purple/50 text-purple-600' },
              { icon: Sparkles, label: 'Quality Check', value: 'Verified', color: 'bg-brand-pink/50 text-pink-600' },
            ].map((stat, i) => (
              <div key={i} className="bento-card flex flex-col items-center text-center group">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.color)}>
                   <stat.icon className="h-7 w-7" />
                </div>
                <p className="text-2xl font-black text-bento-text mb-1">{stat.value}</p>
                <p className="text-bento-light font-bold text-[10px] uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dealer Section */}
      <section className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 font-bold text-[10px] uppercase tracking-widest mb-6 border border-primary-500/20">
                <ShieldCheck className="h-4 w-4" /> Trusted Partner
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                Premium <br />
                <span className="text-primary-500">Autos</span>
              </h2>
              <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                Experience Pune's finest selection of luxury vehicles, including pristine petrols, diesels, hybrids, and electrics. Every vehicle undergoes a 200-point inspection.
              </p>
              <Link 
                to="/browse?brand=Porsche" 
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-black/20"
              >
                View Collection
              </Link>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {cars.filter(c => c.seller.id === 'dealer_dummy').slice(0, 2).map((car) => (
                <div key={car.id} className="relative group rounded-[2.5rem] overflow-hidden bg-slate-800 border border-slate-700">
                  <div className="aspect-video overflow-hidden">
                    <img src={car.images[0]} alt={car.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Premium</span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-4">{car.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-white">₹{(car.price / 100000).toFixed(1)}L</p>
                      <Link to={`/vehicle/${car.id}`} className="p-3 bg-white/5 rounded-xl text-white hover:bg-primary-500 transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Recommended <span className="text-primary-500">For You</span></h2>
              <p className="text-slate-500 font-medium">Curated selection of {cars.length} verified premium listings across all fuel types.</p>
            </div>
            <Link to="/browse" className="text-primary-500 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {cars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.slice(0, 6).map((car) => (
                <ListingCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">No verified listings available at the moment.</p>
              <Link to="/browse" className="mt-4 inline-block text-primary-500 font-black uppercase tracking-widest text-xs underline">Browse All Instead</Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Banner */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/40 via-transparent to-transparent" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Why Choose a <br />Hybrid Car?</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Save up to 40% on fuel costs, contribute to a cleaner environment, and enjoy a smoother, quieter drive.
              </p>
              <ul className="space-y-4 mb-8">
                {['Zero Tax Benefits in many states', 'Low Maintenance Costs', 'Higher Resale Value'].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-bold">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px]">✓</div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div 
                  className="h-48 relative overflow-hidden bg-cover bg-center rounded-3xl border border-white/10 p-6 flex flex-col justify-end group cursor-pointer"
                  style={{ backgroundImage: "url('https://i.pinimg.com/736x/18/ea/42/18ea425bdcf5c27d1a90abad5c476601.jpg')" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/50 transition-all duration-300" />
                  <div className="relative z-10">
                    <p className="text-white text-xl font-bold">Sedans</p>
                    <p className="text-slate-300 text-sm font-semibold">340+ Ads</p>
                  </div>
                </div>
                <div 
                  className="h-64 relative overflow-hidden bg-cover bg-center rounded-3xl border border-white/10 p-6 flex flex-col justify-end group cursor-pointer"
                  style={{ backgroundImage: "url('https://i.pinimg.com/736x/b0/21/ca/b021caf9b56fccc9a1398fe52c35ffba.jpg')" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/50 transition-all duration-300" />
                  <div className="relative z-10">
                    <p className="text-white text-xl font-bold">Premium</p>
                    <p className="text-slate-300 text-sm font-semibold">120+ Ads</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div 
                  className="h-64 relative overflow-hidden bg-cover bg-center rounded-3xl border border-white/10 p-6 flex flex-col justify-end group cursor-pointer"
                  style={{ backgroundImage: "url('https://i.pinimg.com/736x/25/b9/45/25b945a8d0fdde8462f533cbcff8c52b.jpg')" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/50 transition-all duration-300" />
                  <div className="relative z-10">
                    <p className="text-white text-xl font-bold">SUVs</p>
                    <p className="text-slate-300 text-sm font-semibold">450+ Ads</p>
                  </div>
                </div>
                <div 
                  className="h-48 relative overflow-hidden bg-cover bg-center rounded-3xl border border-white/10 p-6 flex flex-col justify-end group cursor-pointer"
                  style={{ backgroundImage: "url('https://i.pinimg.com/1200x/70/10/d7/7010d7d90d89cd113caff53ecb5d7aa9.jpg')" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/50 transition-all duration-300" />
                  <div className="relative z-10">
                    <p className="text-white text-xl font-bold">City Hatch</p>
                    <p className="text-slate-300 text-sm font-semibold">210+ Ads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

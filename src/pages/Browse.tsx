import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Check, X, RotateCcw, MapPin } from 'lucide-react';
import { useCars } from '../context/CarContext';
import ListingCard from '../components/ListingCard';
import { FuelType, Transmission } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG'];
const TRANSMISSIONS: Transmission[] = ['Manual', 'Automatic'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Gurugram', 'Lucknow'];
const BRANDS = [
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'Kia', 'Skoda',
  'Volkswagen', 'MG Motors', 'Renault', 'Ford', 'BMW', 'Lexus', 'Audi', 'Mercedes-Benz', 
  'Porsche', 'Tesla', 'Jaguar', 'Maserati', 'Land Rover', 'Jeep', 'Volvo'
];
const OWNERS = ['First Owner', 'Second Hand', 'Third Owner'];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cars, isLoading } = useCars();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'premium');

  // Filters state
  const query = searchParams.get('q') || '';
  const fuelFilter = searchParams.get('fuel') || '';
  const transFilter = searchParams.get('trans') || '';
  const locationFilter = searchParams.get('loc') || '';
  const brandFilter = searchParams.get('brand') || '';
  const ownersFilter = searchParams.get('owners') || '';
  const verifiedOnly = searchParams.get('verified') === 'true';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 50000000;
  const maxKmDriven = Number(searchParams.get('kmDriven')) || 300000;
  const yearFilter = searchParams.get('year') || '';

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'false') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const filteredCars = useMemo(() => {
    let results = cars.filter(car => {
      if (!car) return false;
      
      const carTitle = (car.title || '').toLowerCase();
      const carBrand = (car.brand || '').toLowerCase();
      const carModel = (car.model || '').toLowerCase();
      const carLocation = (car.location || '').toLowerCase();
      
      const matchesSearch = carTitle.includes(query.toLowerCase()) || 
                           carBrand.includes(query.toLowerCase()) ||
                           carModel.includes(query.toLowerCase());
      const matchesFuel = !fuelFilter || car.fuelType === fuelFilter;
      const matchesTrans = !transFilter || car.transmission === transFilter;
      const matchesLoc = !locationFilter || carLocation.includes(locationFilter.toLowerCase());
      const matchesBrand = !brandFilter || car.brand === brandFilter;
      const matchesOwners = !ownersFilter || car.ownerType === ownersFilter;
      const matchesVerified = !verifiedOnly || car.isVerified === true;
      const isPrime = car.status === 'Prime' || car.isPremium === true;
      const matchesOnlyPrime = sortBy !== 'only-prime' || isPrime;
      const matchesPrice = (car.price || 0) >= minPrice && (car.price || 0) <= maxPrice;
      const matchesKmDriven = (car.kmDriven || 0) <= maxKmDriven;
      const matchesYear = !yearFilter || (car.year || '').toString() === yearFilter;
      
      return matchesSearch && matchesFuel && matchesTrans && matchesPrice && matchesLoc && 
             matchesBrand && matchesOwners && matchesVerified && matchesOnlyPrime && matchesKmDriven && matchesYear;
    });

    // Sorting Logic
    const sorted = results.sort((a, b) => {
      const aPrime = a.status === 'Prime' || a.isPremium === true;
      const bPrime = b.status === 'Prime' || b.isPremium === true;
      
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': return b.year - a.year;
        case 'oldest': return a.year - b.year;
        case 'premium':
          const getSeconds = (ts: any) => {
            if (!ts) return 0;
            if (typeof ts.seconds === 'number') return ts.seconds;
            if (ts instanceof Date) return ts.getTime() / 1000;
            if (typeof ts === 'number') return ts / 1000;
            const parsed = Date.parse(ts);
            if (!isNaN(parsed)) return parsed / 1000;
            return 0;
          };

          const getRawScore = (car: any) => {
            let baseScore = 0;
            const nowMs = Date.now();
            const createdAtSeconds = getSeconds(car.createdAt);
            const carTimeMs = createdAtSeconds * 1000;

            const isPrime = car.status === 'Prime' || car.isPremium === true;
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;
            const isLatest = carTimeMs > 0 && (nowMs - carTimeMs) <= ONE_DAY_MS;
            const isVerified = car.isVerified === true || car.status === 'Verified';

            // Establish the robust requested tiered boundaries with additive scoring
            if (isPrime) {
              baseScore += 500000;
            }
            if (isLatest) {
              baseScore += 300000;
            }
            if (isVerified) {
              baseScore += 150000;
            }

            // Down-prioritize unverified, non-prime listings that are older than 3 days to keep them at the bottom
            const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
            const isOldUnverifiedNonPrime = !isPrime && !isVerified && carTimeMs > 0 && (nowMs - carTimeMs) > THREE_DAYS_MS;
            if (isOldUnverifiedNonPrime) {
              baseScore -= 1000000;
            }

            // Calculate intra-tier quality bonus to make high-value listings bubble up within their tier
            let qualityBonus = 0;

            // Recency weighting within the tier (fresher listings bubble to top of their tier)
            if (createdAtSeconds > 0) {
              qualityBonus += (createdAtSeconds / 20000); 
            }

            // Premium start boost timestamp weighting
            if (isPrime && car.boostStartDate) {
              const parsed = Date.parse(car.boostStartDate);
              if (!isNaN(parsed)) {
                qualityBonus += (parsed / 20000000);
              }
            }

            // Photos completeness (visual criteria)
            if (car.images && car.images.length > 0) {
              qualityBonus += 1000;
              qualityBonus += Math.min(car.images.length, 5) * 200;
            } else {
              qualityBonus -= 2000; // Penalty for lack of photos
            }

            // Description length & detail quality
            if (car.description) {
              if (car.description.length > 150) {
                qualityBonus += 500;
              } else if (car.description.length > 50) {
                qualityBonus += 250;
              }
            }

            // Specifications completeness (engine, color, service history, etc)
            if (car.specs) {
              let specCount = 0;
              if (car.specs.engine) specCount++;
              if (car.specs.power || car.specs.maxPower) specCount++;
              if (car.specs.color) specCount++;
              if (car.specs.insuranceStatus) specCount++;
              if (car.specs.serviceHistory) specCount++;
              qualityBonus += specCount * 200;
            }

            return baseScore + qualityBonus;
          };

          return getRawScore(b) - getRawScore(a);
        case 'prime-first':
          if (aPrime && !bPrime) return -1;
          if (!aPrime && bPrime) return 1;
          return 0;
        case 'only-prime':
          return 0;
        case 'verified':
          if (a.isVerified && !b.isVerified) return -1;
          if (!a.isVerified && b.isVerified) return 1;
          return 0;
        default: return 0;
      }
    });

    if (sortBy === 'premium') {
      const paid: any[] = [];
      const organic: any[] = [];
      const bottomListings: any[] = [];
      const activeListings: any[] = [];

      const getSeconds = (ts: any) => {
        if (!ts) return 0;
        if (typeof ts.seconds === 'number') return ts.seconds;
        if (ts instanceof Date) return ts.getTime() / 1000;
        if (typeof ts === 'number') return ts / 1000;
        const parsed = Date.parse(ts);
        if (!isNaN(parsed)) return parsed / 1000;
        return 0;
      };

      for (const car of sorted) {
        const isPrime = car.status === 'Prime' || car.isPremium === true || !!car.boostPlanName;
        const isVerified = car.isVerified === true || car.status === 'Verified';
        const createdAtSeconds = getSeconds(car.createdAt);
        const carTimeMs = createdAtSeconds * 1000;
        const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
        const isOlderThan3Days = carTimeMs > 0 && (Date.now() - carTimeMs) > THREE_DAYS_MS;

        // If a listing has NO prime batch AND NO verified batch, AND is older than 3 days (or has no post date),
        // it is classified as low priority and goes to the bottom.
        const goesToBottom = (!isPrime && !isVerified) && (isOlderThan3Days || carTimeMs === 0);

        if (goesToBottom) {
          bottomListings.push(car);
        } else {
          activeListings.push(car);
        }
      }

      for (const car of activeListings) {
        const isPrime = car.status === 'Prime' || car.isPremium === true || !!car.boostPlanName;
        if (isPrime) {
          paid.push(car);
        } else {
          organic.push(car);
        }
      }

      const interleaved: any[] = [];
      let pIdx = 0;
      let oIdx = 0;
      while (pIdx < paid.length || oIdx < organic.length) {
        if (pIdx < paid.length) {
          interleaved.push(paid[pIdx]);
          pIdx++;
        }
        for (let i = 0; i < 3; i++) {
          if (oIdx < organic.length) {
            interleaved.push(organic[oIdx]);
            oIdx++;
          }
        }
      }

      // Append bottom listings at the absolute end of the interleaved/recommended list
      return [...interleaved, ...bottomListings];
    }

    return sorted;
  }, [cars, query, fuelFilter, transFilter, minPrice, maxPrice, locationFilter, brandFilter, ownersFilter, verifiedOnly, maxKmDriven, yearFilter, sortBy]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center font-black">Finding best deals...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filter */}
        <aside className="lg:w-72 flex-shrink-0 lg:h-[calc(100vh-6rem)] lg:sticky lg:top-24 lg:overflow-y-auto pr-2">
          <div className="space-y-8">
            <div className="flex items-center justify-between lg:mb-0 mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary-500" /> Filters
              </h3>
              <button 
                onClick={() => setSearchParams({})}
                className="text-xs font-bold text-slate-400 hover:text-primary-500 flex items-center gap-1 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Search Within */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Search Keywords</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="E.g. Toyota, SUV"
                    value={query}
                    onChange={(e) => updateFilters('q', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary-500/10 transition-all font-bold placeholder:text-slate-300"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                </div>
              </div>

              {/* Brand Selection */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Brand</label>
                <div className="relative">
                  <select 
                    value={brandFilter}
                    onChange={(e) => updateFilters('brand', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-primary-500/10 transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="">All Brands</option>
                    {BRANDS.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 pointer-events-none" />
                </div>
              </div>

              {/* Inspection Status */}
              <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200">
                <div>
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Verified Only</p>
                  <p className="text-[10px] font-bold text-slate-400">Inspected by Benimcars</p>
                </div>
                <button 
                  onClick={() => updateFilters('verified', (!verifiedOnly).toString())}
                  className={cn(
                    "w-12 h-7 rounded-full transition-all relative p-1.5",
                    verifiedOnly ? "bg-primary-500" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                    verifiedOnly ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Year Filter */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Manufacturing Year</label>
                <div className="relative">
                  <select 
                    value={yearFilter}
                    onChange={(e) => updateFilters('year', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-primary-500/10 transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Any Year</option>
                    {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 pointer-events-none" />
                </div>
              </div>

              {/* Location Selector */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Location</label>
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search Location..."
                    value={locationFilter}
                    onChange={(e) => updateFilters('loc', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 transition-all font-bold"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {LOCATIONS.slice(0, 5).map(loc => (
                    <button
                      key={loc}
                      onClick={() => updateFilters('loc', locationFilter === loc ? '' : loc)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight border transition-all",
                        locationFilter === loc ? "bg-primary-500 border-primary-500 text-white" : "bg-white border-slate-100 text-slate-500"
                      )}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Price Range</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold mb-1">MIN</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => updateFilters('minPrice', e.target.value)}
                      className="w-full font-bold text-sm bg-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold mb-1">MAX</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => updateFilters('maxPrice', e.target.value)}
                      className="w-full font-bold text-sm bg-transparent outline-none"
                      placeholder="50000000"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="500000"
                  value={maxPrice}
                  onChange={(e) => updateFilters('maxPrice', e.target.value)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                  {FUEL_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => updateFilters('fuel', fuelFilter === type ? '' : type)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        fuelFilter === type 
                          ? "bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-primary-500"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* KM Driven */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">KM Driven (Max)</label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">0 km</span>
                  <span className="text-xs font-bold text-primary-500">{maxKmDriven.toLocaleString()} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300000"
                  step="10000"
                  value={maxKmDriven}
                  onChange={(e) => updateFilters('kmDriven', e.target.value)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              {/* No. of Owners */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">No. of Owners</label>
                <div className="space-y-2">
                  {OWNERS.map(owner => (
                    <button
                      key={owner}
                      onClick={() => updateFilters('owners', ownersFilter === owner ? '' : owner)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                        ownersFilter === owner ? "border-primary-500 bg-primary-50" : "border-slate-100 bg-white"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                        ownersFilter === owner ? "bg-primary-500 border-primary-500" : "bg-white border-slate-300"
                      )}>
                        {ownersFilter === owner && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{owner}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Transmission</label>
                <div className="grid grid-cols-2 gap-2">
                  {TRANSMISSIONS.map(trans => (
                    <button
                      key={trans}
                      onClick={() => updateFilters('trans', transFilter === trans ? '' : trans)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1",
                        transFilter === trans 
                          ? "bg-secondary-500 border-secondary-500 text-white shadow-lg shadow-secondary-500/20" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-secondary-500"
                      )}
                    >
                      {trans}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {filteredCars.length} <span className="text-slate-400 font-bold">Results Found</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400 whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none cursor-pointer"
              >
                <option value="premium">Recommended (Smart Match)</option>
                <option value="prime-first">Prime First</option>
                <option value="only-prime">Only Prime</option>
                <option value="verified">Verified First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ListingCard car={car} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <Search className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No matching cars found</h3>
                  <p className="text-slate-500 max-w-sm mb-8 font-medium">Try adjusting your filters or search query to find what you're looking for.</p>
                  <button 
                    onClick={() => setSearchParams({})}
                    className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

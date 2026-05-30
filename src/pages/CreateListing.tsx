import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car as CarIcon, Image as ImageIcon, IndianRupee, 
  CheckCircle2, ChevronRight, ChevronLeft, 
  ShieldCheck, AlertCircle, Camera, Trash2, Plus, Zap, Star,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import { INDIAN_LOCATIONS, STATES } from '../constants/locations';
import { CAR_BRANDS, BRAND_NAMES } from '../constants/brands';
import { GoogleGenAI } from "@google/genai";

const STEPS = [
  { id: 1, label: 'Vehicle Details', icon: CarIcon },
  { id: 2, label: 'Photo Upload', icon: ImageIcon },
  { id: 3, label: 'Price & Location', icon: IndianRupee },
  { id: 4, label: 'Review', icon: CheckCircle2 },
];

export default function CreateListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();
  const { addListing } = useCars();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    kmDriven: '',
    mileage: '',
    owners: 'First Owner',
    vin: '',
    title: '',
    description: '',
    price: '',
    location: '',
    state: 'Maharashtra',
    color: '',
    engine: '',
    steeringType: 'Power Steering',
    bluetooth: 'Yes',
    bodyType: 'Sedan',
    seating: '5',
    driveTrain: 'FWD',
    accidentHistory: 'No',
    power: '',
    insurance: 'Comprehensive',
    serviceHistory: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.kmDriven) newErrors.kmDriven = 'KM Driven is required';
    
    // Check if numbers
    if (formData.year && (parseInt(formData.year) < 1990 || parseInt(formData.year) > 2026)) {
      newErrors.year = 'Please enter a valid year (1990-2026)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.location) newErrors.location = 'City is required';
    if (!formData.description) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIDescription = async () => {
    if (!formData.brand || !formData.model) {
      alert("Please enter Brand and Model first.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Write a professional and compelling car listing description for a ${formData.year} ${formData.brand} ${formData.model} with ${formData.kmDriven} KM driven and ${formData.mileage} km/l mileage. The car is powered by a ${formData.fuel} engine/motor. Highlight its performance, fuel/energy efficiency, smooth driving experience, and maintenance history. Keep it concise but attractive to buyers.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response.text) {
        setFormData(prev => ({ ...prev, description: response.text }));
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    }
    if (currentStep === 3) {
      if (!validateStep3()) return;
    }
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };
  
  const handleBack = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      if (photos.length >= 25) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addPhoto = () => {
    const input = document.getElementById('photo-upload-input') as HTMLInputElement;
    if (input) input.click();
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const addDummyPhotos = () => {
    const dummyPhotos = [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617469767053-d3b508a0d84e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
    ];
    setPhotos(prev => {
      const remainingSlots = 25 - prev.length;
      return [...prev, ...dummyPhotos.slice(0, remainingSlots)];
    });
  };

  const [isPublishing, setIsPublishing] = useState(false);
  const isPublishingRef = React.useRef(false);

  const isVerifiedEligible = 
    formData.state && formData.state.toLowerCase() === 'maharashtra' && 
    formData.location && formData.location.toLowerCase() === 'pune' && 
    formData.kmDriven && parseInt(formData.kmDriven) < 60000 && 
    formData.owners === 'First Owner';

  const handlePublishListing = async (isPremium = false) => {
    if (!user || isPublishingRef.current) return;
    
    isPublishingRef.current = true;
    setIsPublishing(true);
    try {
      await addListing({
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseInt(formData.price),
        kmDriven: parseInt(formData.kmDriven),
        fuelEfficiency: parseInt(formData.mileage),
        location: `${formData.location}, ${formData.state}`,
        fuelType: formData.fuel as any,
        transmission: formData.transmission as any,
        ownerType: formData.owners as any,
        description: formData.description,
        images: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop'],
        isPremium: isPremium,
        isVerificationPending: false,
        verificationStatus: isVerifiedEligible ? 'eligible' : 'none',
        specs: {
          engine: formData.engine || 'Not Specified',
          power: formData.power || 'Not Specified',
          torque: 'Not Specified',
          bodyType: formData.bodyType,
          seatingCapacity: parseInt(formData.seating),
          driveTrain: formData.driveTrain,
          color: formData.color,
          insuranceStatus: formData.insurance,
          accidentHistory: formData.accidentHistory as any,
          steeringType: formData.steeringType,
          bluetooth: formData.bluetooth === 'Yes',
          serviceHistory: formData.serviceHistory
        }
      }, {
        name: user.name,
        id: user.id
      });

      navigate('/profile/listings');
    } catch (error) {
      console.error('Publish Error:', error);
      alert('Failed to publish listing. Check your connection or permissions.');
      isPublishingRef.current = false;
      setIsPublishing(false);
    }
  };

  const handlePublish = () => {
    setShowPremiumModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pb-32">
      {/* Premium Upgrade Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-brand-pink rounded-[1.5rem] flex items-center justify-center text-secondary-500 shadow-lg shadow-brand-pink/20">
                    <Zap className="h-8 w-8 fill-secondary-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">Featured <span className="text-secondary-500">Listing</span></h2>
                    <p className="text-slate-500 font-bold">Get 15x more visibility and stay on top!</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPublishing) handlePublishListing(true);
                    }}
                    className={cn(
                      "p-6 rounded-[2rem] border-2 border-slate-100 transition-all cursor-pointer group",
                      !isPublishing && "hover:border-primary-500",
                      isPublishing && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">Prime Batch</span>
                      <p className="text-2xl font-black text-slate-900">₹300<span className="text-sm text-slate-400 font-bold">/mo</span></p>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-primary-500" /> Top of Search</li>
                      <li className="flex items-center gap-2 text-sm font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-primary-500" /> Priority Support</li>
                    </ul>
                    <button disabled={isPublishing} className="w-full py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-bold group-hover:bg-slate-900 group-hover:text-white transition-all">Select Plan</button>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPublishing) handlePublishListing(true);
                    }}
                    className={cn(
                      "p-6 rounded-[2rem] border-2 border-secondary-500 bg-secondary-50 shadow-xl shadow-secondary-500/10 cursor-pointer relative overflow-hidden",
                      isPublishing && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="absolute top-0 right-0 p-3 bg-secondary-500 text-white rounded-bl-2xl">
                      <Star className="h-4 w-4 fill-white" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-secondary-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Prime Boost</span>
                      <p className="text-2xl font-black text-slate-900">₹500<span className="text-sm text-slate-400 font-bold">/3mo</span></p>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-secondary-500" /> Top for 3 Months</li>
                      <li className="flex items-center gap-2 text-sm font-bold text-slate-600"><CheckCircle2 className="h-4 w-4 text-secondary-500" /> 15x More Views</li>
                    </ul>
                    <button disabled={isPublishing} className="w-full py-3 bg-secondary-500 text-white rounded-xl font-bold hover:brightness-95 transition-all">Select Plan</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => handlePublishListing(false)} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-all text-sm uppercase tracking-widest">Skip for now</button>
                  <button onClick={() => handlePublishListing(true)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20">Upgrade Now</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4">
        {/* ... Progress Header same as before ... */}
        <div className="bg-white rounded-[3rem] p-10 mb-10 border border-slate-100 shadow-sm">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Sell Your <span className="text-primary-500">Vehicle</span></h1>
            <p className="text-slate-400 font-medium">List your vehicle in 4 simple steps and reach 1M+ active buyers.</p>
          </div>
          
          <div className="relative flex justify-between">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 mb-3",
                  currentStep >= step.id ? "bg-primary-500 text-white shadow-xl shadow-primary-500/30 scale-110" : "bg-white border-4 border-slate-100 text-slate-300"
                )}>
                  <step.icon className="h-6 w-6" />
                </div>
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  currentStep >= step.id ? "text-primary-500" : "text-slate-300"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-[400px]"
            >
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={cn("text-xs font-extrabold uppercase tracking-widest", errors.brand ? "text-red-500" : "text-slate-400")}>Brand *</label>
                      <select 
                        required
                        className={cn("w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2", errors.brand ? "ring-2 ring-red-500/20" : "focus:ring-primary-500/20")}
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value, model: ''})}
                      >
                        <option value="">Select Brand</option>
                        {BRAND_NAMES.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      {errors.brand && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.brand}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className={cn("text-xs font-extrabold uppercase tracking-widest", errors.model ? "text-red-500" : "text-slate-400")}>Model *</label>
                      <select 
                        required
                        className={cn("w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2", errors.model ? "ring-2 ring-red-500/20" : "focus:ring-primary-500/20")}
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        disabled={!formData.brand}
                      >
                        <option value="">{formData.brand ? "Select Model" : "Select Brand First"}</option>
                        {formData.brand && (CAR_BRANDS[formData.brand] || []).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      {errors.model && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.model}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className={cn("text-xs font-extrabold uppercase tracking-widest", errors.year ? "text-red-500" : "text-slate-400")}>Year *</label>
                      <input 
                        type="number" 
                        placeholder="2024" 
                        className={cn("w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2", errors.year ? "ring-2 ring-red-500/20" : "")}
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                      />
                      {errors.year && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.year}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Fuel *</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                        value={formData.fuel}
                        onChange={(e) => setFormData({...formData, fuel: e.target.value})}
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                        <option value="Electric">Electric</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG</option>
                        <option value="LPG">LPG</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Transmission *</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                        value={formData.transmission}
                        onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                      >
                        <option>Automatic</option>
                        <option>Manual</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={cn("text-xs font-extrabold uppercase tracking-widest", errors.kmDriven ? "text-red-500" : "text-slate-400")}>KM Driven *</label>
                      <input 
                        type="number" 
                        placeholder="KM" 
                        className={cn("w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2", errors.kmDriven ? "ring-2 ring-red-500/20" : "")}
                        value={formData.kmDriven}
                        onChange={(e) => setFormData({...formData, kmDriven: e.target.value})}
                      />
                      {errors.kmDriven && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.kmDriven}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Mileage (km/l) *</label>
                      <input 
                        type="number" 
                        placeholder="km/l" 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2"
                        value={formData.mileage}
                        onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Ownership *</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                        value={formData.owners}
                        onChange={(e) => setFormData({...formData, owners: e.target.value})}
                      >
                        <option>First Owner</option>
                        <option>Second Hand</option>
                        <option>Third Owner</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">VIN Number (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="17-digit VIN" 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" 
                        value={formData.vin}
                        onChange={(e) => setFormData({...formData, vin: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Technical Specifications Section */}
                  <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary-500" /> Technical Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Engine *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 2.0L VVT-i" 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.engine}
                          onChange={(e) => setFormData({...formData, engine: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Power (hp) *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 150" 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.power}
                          onChange={(e) => setFormData({...formData, power: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Drive Train *</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.driveTrain}
                          onChange={(e) => setFormData({...formData, driveTrain: e.target.value})}
                        >
                          <option>FWD</option>
                          <option>RWD</option>
                          <option>AWD</option>
                          <option>4WD</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Body Type *</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.bodyType}
                          onChange={(e) => setFormData({...formData, bodyType: e.target.value})}
                        >
                          <option>Sedan</option>
                          <option>SUV</option>
                          <option>Hatchback</option>
                          <option>Coupe</option>
                          <option>Convertible</option>
                          <option>Luxury</option>
                          <option>MUV</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Color *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Alpine White" 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.color}
                          onChange={(e) => setFormData({...formData, color: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Seating *</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.seating}
                          onChange={(e) => setFormData({...formData, seating: e.target.value})}
                        >
                          <option>2</option>
                          <option>4</option>
                          <option>5</option>
                          <option>7</option>
                          <option>8</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Steering *</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.steeringType}
                          onChange={(e) => setFormData({...formData, steeringType: e.target.value})}
                        >
                          <option>Power Steering</option>
                          <option>Manual Steering</option>
                          <option>Electronic Steering</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Bluetooth *</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.bluetooth}
                          onChange={(e) => setFormData({...formData, bluetooth: e.target.value})}
                        >
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Insurance *</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.insurance}
                          onChange={(e) => setFormData({...formData, insurance: e.target.value})}
                        >
                          <option>Comprehensive</option>
                          <option>Third Party</option>
                          <option>Zero Dep</option>
                          <option>Expired</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Accident History *</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.accidentHistory}
                          onChange={(e) => setFormData({...formData, accidentHistory: e.target.value})}
                        >
                          <option value="No">No Accidents</option>
                          <option value="Minor">Minor Scratches/Dents</option>
                          <option value="Major">Major Accident</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Service History</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Full Authorized History" 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.serviceHistory}
                          onChange={(e) => setFormData({...formData, serviceHistory: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className={cn(
                    "p-6 rounded-3xl flex items-center gap-4 border-2 transition-colors",
                    isVerifiedEligible ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                  )}>
                    {isVerifiedEligible ? (
                      <>
                        <ShieldCheck className="h-10 w-10 text-green-600" />
                        <div>
                          <h4 className="font-extrabold text-green-900">Verified Badge Eligible!</h4>
                          <p className="text-sm text-green-600 font-medium">Single owner & low mileage detected. Your ad will get a free verification badge!</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-10 w-10 text-yellow-600" />
                        <div>
                          <h4 className="font-extrabold text-yellow-900">Boost Trust with Verification</h4>
                          <p className="text-sm text-yellow-600 font-medium">Upload at least 5 crystal clear photos. Minimum criteria: single-owner car under 60k km.</p>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Photo upload grid ... same as before ... */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {photos.map((url, i) => (
                      <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <button onClick={() => removePhoto(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <input 
                      id="photo-upload-input"
                      type="file" 
                      multiple 
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    {photos.length < 25 && (
                      <div className="flex flex-col gap-4">
                        <button onClick={addPhoto} className="aspect-square rounded-2xl border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-primary-500/30 hover:bg-slate-50 transition-all">
                          <Camera className="h-8 w-8" />
                          <span className="text-[10px] uppercase font-black text-center px-2">Upload From Device</span>
                        </button>
                        <button 
                          onClick={addDummyPhotos}
                          className="py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-50 hover:text-primary-600 transition-all"
                        >
                          Load Dummy Photos
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className={cn("text-xs font-extrabold uppercase tracking-widest", errors.title ? "text-red-500" : "text-slate-400")}>Ad Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Pristine 2023 Honda Accord Sport" 
                      className={cn("w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2", errors.title ? "ring-2 ring-red-500/20" : "")}
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    {errors.title && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.title}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={cn("text-xs font-extrabold uppercase tracking-widest", errors.price ? "text-red-500" : "text-slate-400")}>Expected Price *</label>
                      <input 
                        type="number" 
                        placeholder="₹ Amount" 
                        className={cn("w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2", errors.price ? "ring-2 ring-red-500/20" : "")}
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                      {errors.price && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.price}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">State *</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value, location: ''})}
                        >
                          {STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                      <label className={cn("text-xs font-extrabold uppercase tracking-widest", errors.location ? "text-red-500" : "text-slate-400")}>City *</label>
                      <select 
                        className={cn("w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2", errors.location ? "ring-2 ring-red-500/20" : "")}
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      >
                        <option value="">Select City</option>
                        {INDIAN_LOCATIONS[formData.state as keyof typeof INDIAN_LOCATIONS]?.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.location && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.location}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className={cn("text-xs font-extrabold uppercase tracking-widest", errors.description ? "text-red-500" : "text-slate-400")}>Additional Description *</label>
                      <button 
                        type="button"
                        onClick={generateAIDescription}
                        disabled={isGenerating}
                        className="flex items-center gap-2 text-[10px] font-black text-secondary-500 bg-secondary-50 px-3 py-1.5 rounded-lg hover:bg-secondary-100 transition-all disabled:opacity-50"
                      >
                        <Sparkles className={cn("h-3 w-3", isGenerating && "animate-spin")} />
                        {isGenerating ? 'WRITING...' : 'GENERATE WITH AI'}
                      </button>
                    </div>
                    <textarea 
                      rows={4} 
                      className={cn("w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2", errors.description ? "ring-2 ring-red-500/20" : "")}
                      placeholder="Mention insurance status, maintenance history, any accidents, etc."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    {errors.description && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.description}</p>}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Final Review</h3>
                  <div className="bg-slate-50 rounded-[3rem] p-8 text-left grid grid-cols-2 gap-8 mb-4">
                    <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Vehicle</p><p className="font-extrabold">{formData.brand} {formData.model} ({formData.year})</p></div>
                    <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Owner</p><p className="font-extrabold">{formData.owners}</p></div>
                    <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Price</p><p className="font-extrabold">₹{formData.price}</p></div>
                    <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Verification</p><p className={cn("font-extrabold", isVerifiedEligible ? "text-green-500" : "text-slate-400")}>{isVerifiedEligible ? 'QUALIFIED (PUNE FREE)' : 'NOT ELIGIBLE'}</p></div>
                  </div>
                  {isVerifiedEligible && (
                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-[2rem] text-left flex gap-3 mb-10">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Pune Free Verification</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                          Since this car is registered in Pune, Maharashtra, has driven under 60k km, and is first-owner, it is eligible for a FREE verified badge! Admin will approve it from the administrative dashboard.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 py-6 z-50">
          <div className="max-w-4xl mx-auto px-4 flex justify-between">
            <button onClick={handleBack} disabled={currentStep === 1} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-[2rem] font-bold disabled:opacity-0 transition-all flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" /> Back
            </button>
            <button 
              onClick={currentStep === 4 ? handlePublish : handleNext}
              disabled={isPublishing}
              className="px-10 py-4 bg-primary-500 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-primary-500/30 hover:bg-primary-600 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isPublishing ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{currentStep === 4 ? 'Confirm & Publish' : 'Continue'} <ChevronRight className="h-5 w-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

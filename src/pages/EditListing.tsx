import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Car as CarIcon, MapPin, Camera, Zap, ChevronLeft, Save, Trash2, Loader2, Sparkles } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { INDIAN_LOCATIONS, STATES } from '../constants/locations';
import { CAR_BRANDS, BRAND_NAMES } from '../constants/brands';
import { cn } from '../lib/utils';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useCars();
  const car = cars.find(c => c.id === id);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    kmDriven: '',
    fuelEfficiency: '',
    fuel: 'Hybrid',
    location: '',
    state: 'Maharashtra',
    description: '',
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
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateAIDescription = async () => {
    if (!formData.brand || !formData.model) {
      alert("Please enter Brand and Model first.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          kmDriven: formData.kmDriven,
          mileage: formData.fuelEfficiency,
          fuel: formData.fuel
        })
      });
      
      const data = await response.json();
      if (data.description) {
        setFormData(prev => ({ ...prev, description: data.description }));
      } else {
        throw new Error(data.error || 'Failed to generate');
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title || '',
        brand: car.brand,
        model: car.model,
        year: car.year.toString(),
        price: car.price.toString(),
        kmDriven: car.kmDriven?.toString() || '',
        fuelEfficiency: car.fuelEfficiency?.toString() || '',
        fuel: car.fuelType || 'Hybrid',
        location: car.location.split(',')[0],
        state: car.location.split(',')[1]?.trim() || 'Maharashtra',
        description: car.description || '',
        color: car.specs?.color || '',
        engine: car.specs?.engine || '',
        steeringType: car.specs?.steeringType || 'Power Steering',
        bluetooth: car.specs?.bluetooth ? 'Yes' : 'No',
        bodyType: car.specs?.bodyType || 'Sedan',
        seating: car.specs?.seatingCapacity?.toString() || '5',
        driveTrain: car.specs?.driveTrain || 'FWD',
        accidentHistory: car.specs?.accidentHistory || 'No',
        power: car.specs?.power || '',
        insurance: car.specs?.insuranceStatus || 'Comprehensive',
        serviceHistory: car.specs?.serviceHistory || '',
      });
      setPhotos(car.images || []);
    }
  }, [car]);

  if (!car) return <div className="p-20 text-center font-bold">Listing not found.</div>;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Required';
    if (!formData.brand) newErrors.brand = 'Required';
    if (!formData.model) newErrors.model = 'Required';
    if (!formData.price) newErrors.price = 'Required';
    if (!formData.location) newErrors.location = 'Required';
    if (photos.length === 0) newErrors.photos = 'At least one photo is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSaving(true);
    try {
      const isEligible = 
        formData.state && formData.state.toLowerCase() === 'maharashtra' && 
        formData.location && formData.location.toLowerCase() === 'pune' && 
        formData.mileage && parseInt(formData.mileage) < 60000 && 
        car.ownerType === 'First Owner';

      const carRef = doc(db, 'cars', car.id);
      await updateDoc(carRef, {
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseInt(formData.price),
        kmDriven: parseInt(formData.kmDriven),
        fuelEfficiency: parseInt(formData.fuelEfficiency),
        fuelType: formData.fuel as any,
        images: photos,
        location: `${formData.location}, ${formData.state}`,
        description: formData.description,
        ...(!car.isVerified ? {
          isVerificationPending: car.isVerificationPending || false,
          verificationStatus: (car.verificationStatus === 'inspection_pending' || car.verificationStatus === 'inspection_completed' || car.verificationStatus === 'rejected') 
            ? car.verificationStatus 
            : (isEligible ? 'eligible' : 'none')
        } : {}),
        specs: {
          ...car.specs,
          engine: formData.engine,
          power: formData.power,
          bodyType: formData.bodyType,
          seatingCapacity: parseInt(formData.seating),
          driveTrain: formData.driveTrain,
          color: formData.color,
          insuranceStatus: formData.insurance,
          accidentHistory: formData.accidentHistory as any,
          steeringType: formData.steeringType,
          bluetooth: formData.bluetooth === 'Yes',
          serviceHistory: formData.serviceHistory
        },
        updatedAt: new Date().toISOString()
      });
      navigate('/profile/listings');
    } catch (error) {
      console.error('Update Error:', error);
      alert('Failed to update listing.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await deleteDoc(doc(db, 'cars', car.id));
      navigate('/profile/listings');
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete listing.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Edit <span className="text-primary-500">Listing</span></h1>
          <p className="text-slate-500 font-bold">Update details for your {car.year} {car.brand} {car.model}</p>
        </div>
        <button 
          onClick={handleDelete}
          className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-100 transition-all"
        >
          <Trash2 className="h-4 w-4" /> Delete Ad
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-10 border-b border-slate-50 pb-6 flex items-center gap-3">
            <Camera className="h-6 w-6 text-primary-500" /> Vehicle Photos
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((url, i) => (
              <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img src={url} className="w-full h-full object-cover" alt="" />
                <button 
                  type="button"
                  onClick={() => removePhoto(i)} 
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {photos.length < 25 && (
              <label className="aspect-square rounded-2xl border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-primary-500/30 hover:bg-slate-50 transition-all cursor-pointer">
                <Camera className="h-8 w-8" />
                <span className="text-[10px] uppercase font-black text-center px-2">Add Photo</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            )}
          </div>
          {errors.photos && <p className="text-xs text-red-500 font-bold mt-4">{errors.photos}</p>}
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-10 border-b border-slate-50 pb-6 flex items-center gap-3">
            <CarIcon className="h-6 w-6 text-primary-500" /> Vehicle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Listing Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
                placeholder="e.g. 2022 BMW M4 Competition - Mint Condition"
              />
              {errors.title && <p className="text-xs text-red-500 font-bold ml-1">{errors.title}</p>}
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Brand</label>
              <select 
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value, model: ''})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option value="">Select Brand</option>
                {BRAND_NAMES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Model</label>
              <select 
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                disabled={!formData.brand}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option value="">{formData.brand ? "Select Model" : "Select Brand First"}</option>
                {formData.brand && (CAR_BRANDS[formData.brand] || []).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Year</label>
              <input 
                type="number" 
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Price (₹)</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">KM Driven</label>
              <input 
                type="number" 
                value={formData.kmDriven}
                onChange={(e) => setFormData({...formData, kmDriven: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mileage (km/l)</label>
              <input 
                type="number" 
                value={formData.fuelEfficiency}
                onChange={(e) => setFormData({...formData, fuelEfficiency: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Fuel Type</label>
              <select 
                value={formData.fuel}
                onChange={(e) => setFormData({...formData, fuel: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
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
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">STATE</label>
              <select 
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value, location: ''})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                {STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
              <select 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option value="">Select City</option>
                {INDIAN_LOCATIONS[formData.state as keyof typeof INDIAN_LOCATIONS]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-900 mt-12 mb-10 border-b border-slate-50 pb-6 flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary-500" /> Technical Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Engine</label>
              <input 
                type="text" 
                value={formData.engine}
                onChange={(e) => setFormData({...formData, engine: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Power (hp)</label>
              <input 
                type="text" 
                value={formData.power}
                onChange={(e) => setFormData({...formData, power: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Body Type</label>
              <select 
                value={formData.bodyType}
                onChange={(e) => setFormData({...formData, bodyType: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
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
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Drive Train</label>
              <select 
                value={formData.driveTrain}
                onChange={(e) => setFormData({...formData, driveTrain: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option>FWD</option>
                <option>RWD</option>
                <option>AWD</option>
                <option>4WD</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Color</label>
              <input 
                type="text" 
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Seating</label>
              <select 
                value={formData.seating}
                onChange={(e) => setFormData({...formData, seating: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option>2</option>
                <option>4</option>
                <option>5</option>
                <option>7</option>
                <option>8</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Steering</label>
              <select 
                value={formData.steeringType}
                onChange={(e) => setFormData({...formData, steeringType: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option>Power Steering</option>
                <option>Manual Steering</option>
                <option>Electronic Steering</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bluetooth</label>
              <select 
                value={formData.bluetooth}
                onChange={(e) => setFormData({...formData, bluetooth: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Insurance</label>
              <select 
                value={formData.insurance}
                onChange={(e) => setFormData({...formData, insurance: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option>Comprehensive</option>
                <option>Third Party</option>
                <option>Zero Dep</option>
                <option>Expired</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Accident History</label>
              <select 
                value={formData.accidentHistory}
                onChange={(e) => setFormData({...formData, accidentHistory: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option value="No">No Accidents</option>
                <option value="Minor">Minor Scratches/Dents</option>
                <option value="Major">Major Accident</option>
              </select>
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Service History</label>
              <input 
                type="text" 
                value={formData.serviceHistory}
                onChange={(e) => setFormData({...formData, serviceHistory: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
                placeholder="e.g. Authorized dealer service every 10k km"
              />
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
            </div>
            <textarea 
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex-1 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/30 hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isSaving ? 'SAVING...' : 'Save Changes'}
          </button>
          <Link 
            to={`/profile/boost/${id}`}
            className="flex-1 py-4 bg-brand-pink text-secondary-500 rounded-2xl font-bold text-lg shadow-xl shadow-brand-pink/30 hover:brightness-95 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="h-5 w-5" /> Boost Listing
          </Link>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ShieldCheck, Zap, Info, Calendar, Users, 
  Fuel, Gauge, MapPin, CheckCircle, ArrowRight, Star, Clock, 
  MessageCircle, CreditCard, ChevronRight, AlertCircle
} from 'lucide-react';
import { mockRentals } from '../data/mockRentals';
import { cn } from '../lib/utils';
import emailjs from '@emailjs/browser';

// ==========================================
// EMAILJS DIRECT CONFIGURATION (No .env files needed)
// Paste your EmailJS keys inside these quotes as plain strings:
// ==========================================
const EMAILJS_SERVICE_ID = "service_bf3h5lw";
const EMAILJS_TEMPLATE_ID = "template_4m4i7e3";
const EMAILJS_PUBLIC_KEY = "1Ngumk8Q3ietcIvyO";

export default function RentalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rental = mockRentals.find(r => r.id === id);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  if (!rental) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Rental Listing Not Found</h2>
        <Link to="/rentals" className="text-primary-500 font-bold hover:underline">Back to Rentals</Link>
      </div>
    );
  }

  const unavailableDays = [4, 5, 12, 13, 20, 21]; // Mocked unavailable days

  const checkAvailability = (start: string, end: string) => {
    if (!start || !end) return true;
    const s = new Date(start);
    const e = new Date(end);
    
    // For mock logic, we only look at May 2026 as per calendar
    if (s.getFullYear() !== 2026 || s.getMonth() !== 4) return true;

    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      if (unavailableDays.includes(d.getDate())) {
        return false;
      }
    }
    return true;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateError(null);
    
    // Enforce Pune-only restriction
    const isPune = /pune/i.test(userLocation);
    if (!isPune) {
      setDateError('Rental bookings are only available in Pune. Please specify a Pune address.');
      return;
    }

    if (!checkAvailability(startDate, endDate)) {
      setDateError('Selected dates overlap with booked days. Please check the calendar.');
      return;
    }

    if (phone.length !== 10) {
      setDateError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsBooking(true);

    try {
      const isConfigured = 
        EMAILJS_SERVICE_ID && 
        EMAILJS_TEMPLATE_ID && 
        EMAILJS_PUBLIC_KEY && 
        !EMAILJS_SERVICE_ID.includes('YOUR_') &&
        !EMAILJS_TEMPLATE_ID.includes('YOUR_') &&
        !EMAILJS_PUBLIC_KEY.includes('YOUR_');

      if (isConfigured) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_name: 'Benim Cars Rentals',
            from_name: name,
            client_name: name,
            phone_number: phone,
            client_email: email,
            pickup_date: startDate,
            dropoff_date: endDate,
            user_location: userLocation,
            vehicle_title: rental.title,
            vehicle_id: rental.id,
            estimated_total: `₹${totalPrice.toLocaleString()}`,
            daily_rate: `₹${rental.dailyRate.toLocaleString()}`,
            security_deposit: `₹${rental.securityDeposit.toLocaleString()}`,
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log('Email sent successfully via EmailJS!');
      } else {
        console.warn(
          'EmailJS credentials have not been modified inside RentalDetail.tsx. Simulating successful booking:',
          { name, phone, email, userLocation, startDate, endDate, vehicle: rental.title, totalPrice }
        );
      }
      setIsBooking(false);
      setBookingSuccess(true);
    } catch (err: any) {
      console.error('EmailJS Sender Error Layout:', err);
      setIsBooking(false);
      setDateError(err?.text || err?.message || 'Failed to transmit rental request via EmailJS. Please check inline credentials.');
    }
  };

  const calculateTotal = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const days = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? (days * rental.dailyRate + rental.securityDeposit) : 0;
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setTotalPrice(calculateTotal(start, end));
    
    if (start && end) {
      if (!checkAvailability(start, end)) {
        setDateError('These dates are not available.');
      } else {
        setDateError(null);
      }
    } else {
      setDateError(null);
    }
  };

  // Mock Calendar Data
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/rentals" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors mb-8">
        <ChevronLeft className="h-5 w-5" /> Back to Rentals
      </Link>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-8">
          <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl mb-8 group bg-slate-200">
            <img 
              src={rental.images[0]} 
              alt={rental.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 flex gap-3">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Available Now</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {rental.images.map((img, i) => (
              <div key={i} className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer">
                <img src={img} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-start mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-50 text-primary-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Premium Rental</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{rental.fuelType}</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 mb-4">{rental.title}</h1>
                <div className="flex items-center gap-4 text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {rental.location}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500 fill-current" /> 4.9 <span className="text-xs font-medium">(24 Reviews)</span></span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-primary-500">₹{rental.dailyRate.toLocaleString()}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-2">Daily Pricing</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Transmission', value: rental.transmission, icon: Gauge },
                { label: 'Fuel Type', value: rental.fuelType, icon: Fuel },
                { label: 'Seating', value: '5 Seater', icon: Users },
                { label: 'Year', value: rental.year, icon: Calendar },
              ].map((spec, i) => (
                <div key={i} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-slate-50 text-secondary-500 rounded-xl flex items-center justify-center mb-3">
                    <spec.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                  <p className="text-sm font-black text-slate-900 leading-none">{spec.value}</p>
                </div>
              ))}
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-6 underline decoration-secondary-500 decoration-4 underline-offset-8">Vehicle Specifications</h3>
            <p className="text-slate-500 font-bold leading-relaxed mb-10 text-lg">
              {rental.description}
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary-500" /> Key Features
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {rental.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 italic font-bold text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
                <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                  <Info className="h-5 w-5 text-secondary-500" /> Quick Rules
                </h4>
                <ul className="space-y-4">
                  {[
                    'Security Deposit: ₹' + rental.securityDeposit.toLocaleString(),
                    'Daily Basis Only: No hourly renting',
                    'Minimum rental period: 2 days',
                    '24/7 Roadside Assistance included',
                    'Fuel policy: Full to Full'
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-3 text-xs font-bold text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 mt-1.5 shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-black text-slate-900 mb-6 underline decoration-primary-500 decoration-4 underline-offset-8">Rental Policies</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Booking & Duration', content: 'All bookings are processed on a daily (24-hour) basis. We do not offer hourly rentals. Minimum booking duration is 2 days.' },
                  { title: 'Cancellation', content: 'Free cancellation up to 48 hours before pickup. 50% charge applies for late cancellations. No-shows are charged 100%.' },
                  { title: 'Usage Restrictions', content: 'Vehicles must remain on paved roads. Off-roading, racing, or using the car for commercial transport is strictly prohibited.' },
                  { title: 'Damage & Liability', content: 'The user is responsible for any minor damages. Major damages are covered by insurance with a specific deductible amount payable by the user.' }
                ].map((policy, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">{policy.title}</h4>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed italic">{policy.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Calendar Widget */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Availability <span className="text-primary-500">Calendar</span></h3>
                  <p className="text-slate-400 font-bold text-sm mt-1">May 2026</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[10px] font-black text-slate-400 uppercase">Available</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-200" /><span className="text-[10px] font-black text-slate-400 uppercase">Booked</span></div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">{d}</div>
                ))}
                {daysInMonth.map(day => (
                  <div 
                    key={day}
                    className={cn(
                      "aspect-square rounded-2xl flex items-center justify-center font-black text-sm transition-all border-2",
                      unavailableDays.includes(day) 
                        ? "bg-slate-50 border-slate-50 text-slate-200 cursor-not-allowed" 
                        : "bg-white border-slate-50 text-slate-900 hover:border-primary-200 cursor-pointer"
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                <Clock className="h-5 w-5 text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 font-bold leading-relaxed italic">
                  Bookings are filling fast for this vehicle! Last booked 2 hours ago for Pune trip.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-8">
              {!bookingSuccess ? (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-sm"
                          value={phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setPhone(value);
                          }}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                        <input 
                          type="email" 
                          required
                          placeholder="john@example.com"
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-sm"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Location *</label>
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">Pune City Only</span>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          placeholder="Pune (e.g., Baner, Koregaon Park)"
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-sm pl-12"
                          value={userLocation}
                          onChange={(e) => setUserLocation(e.target.value)}
                        />
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase pl-1">📍 Deliveries and rentals are restricted to Pune city boundaries.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pick up Date</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            required
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-sm pr-12"
                            value={startDate}
                            onChange={(e) => handleDateChange(e.target.value, endDate)}
                          />
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Drop off Date</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            required
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold text-sm pr-12"
                            value={endDate}
                            onChange={(e) => handleDateChange(startDate, e.target.value)}
                          />
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {dateError && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 border border-red-100">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{dateError}</span>
                      </div>
                    )}
                    <div className="px-4 py-3 bg-secondary-50 text-secondary-600 rounded-2xl flex items-center gap-3 border border-secondary-100">
                      <Info className="h-4 w-4 shrink-0" />
                      <p className="text-[9px] font-black uppercase tracking-tight leading-tight">Note: Rentals are daily basis only. No hourly bookings available.</p>
                    </div>
                  </div>

                  {totalPrice > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-slate-900 rounded-[2rem] space-y-4"
                    >
                      <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>Daily Rental Rate</span>
                        <span className="text-white">₹{rental.dailyRate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>Refundable Security</span>
                        <span className="text-white">₹{rental.securityDeposit.toLocaleString()}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex justify-between text-sm font-black text-white">
                          <span>Est. Total</span>
                          <span className="text-xl text-primary-500">₹{totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    disabled={isBooking || !startDate || !endDate || !!dateError}
                    className="w-full py-5 bg-primary-500 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isBooking ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Reserve Vehicle <ArrowRight className="h-5 w-5" /></>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase">No payment required now</p>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-3">Inquiry Sent!</h4>
                  <p className="text-slate-500 font-bold mb-10 leading-relaxed px-4">Our team will verify your details and connect for documentation within 24 business hours.</p>
                  <button 
                    onClick={() => navigate('/rentals')}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl"
                  >
                    Keep Browsing
                  </button>
                </motion.div>
              )}
            </div>
            
            <div className="p-8 bg-slate-50 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xl">
                  {rental.seller.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Host</p>
                  <p className="font-black text-slate-900">{rental.seller.name}</p>
                </div>
              </div>
              <button className="p-3 bg-white text-primary-500 rounded-xl border border-slate-100 shadow-sm hover:scale-110 transition-transform">
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

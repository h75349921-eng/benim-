import React from 'react';
import { ShieldCheck, Target, Award, Users, HeartHandshake, Sparkles, Zap, Leaf, CheckCircle2, Car } from 'lucide-react';

export default function AboutUs() {
  return (
    <div id="about-us-page" className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="bg-slate-900 rounded-[3rem] px-8 py-16 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="px-4 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-xs font-black uppercase tracking-wider border border-primary-500/30">
              About Benim Cars
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Building Trust and Delivering <span className="text-primary-500">Excellence</span> in Pune
            </h1>
            <p className="text-slate-300 font-medium text-lg leading-relaxed">
              At Benimcars, we're not just in the business of buying and selling cars; we're in the business of building trust and delivering excellence.
            </p>
          </div>
        </div>

        {/* Dynamic Stats Grid (20cr removed as requested!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-2">
            <h3 className="text-4xl font-black text-primary-500">100+</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cars Sold Across Pune</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-2">
            <h3 className="text-4xl font-black text-slate-900">150+</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Inspection Points Certification</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-2">
            <h3 className="text-4xl font-black text-secondary-500">100%</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Single-Owner Pre-Owned Cars</p>
          </div>
        </div>

        {/* About Benim Car Content Section */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-3xl font-black text-slate-900 leading-tight">About Benim Car</h2>
          <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
            <p>
              At Benimcars, we're not just in the business of buying and selling cars; we're in the business of building trust and delivering excellence. Our motto is simple yet powerful: when it comes to buying a high-quality pre-owned car or selling your vehicle in Pune, Benimcars should be the first and only name that comes to mind. We strive to offer a level of service that sets us apart and keeps our customers coming back.
            </p>
            <p>
              By introducing our verified cars catalog, we offer our unique verified selling point: we exclusively buy and sell single-owner cars with less than 60,000 kilometers driven, accident-free, flood-free, and with unrepaired engines. We also ensure untampered odometers, offer free RC transfer, provide a one-year engine warranty, and offer a 7-day return policy. We offer direct customer and seller-buyer deals without any third party.
            </p>
          </div>
        </div>

        {/* Why Choose Us - Splits into Buying and Selling */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900">Why Choose Us!</h2>
            <p className="text-slate-400 font-medium">Clear advantages for both buyers and sellers with zero hassles.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Buying Verified Cars card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Buying Verified Cars Includes</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "We are the only company who is selling cars which are single owner and less than 60,000/- kms driven in India.",
                  "All our cars are certified with 150+ inspection points.",
                  "We only deal in cars which are non-accidental, non-flooded, non-repaired engine, untampered odometer.",
                  "Free RC transfer.",
                  "Comprehensive Insurance.",
                  "7-day money-back guarantee."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selling Cars card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary-50 text-secondary-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Selling Your Car Made Simple</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Free doorstep inspection.",
                  "We guarantee to purchase your car within 30 minutes.",
                  "Maintain your privacy at all stages.",
                  "Fast and secure instant payment.",
                  "Hassle-free RC Transfer.",
                  "No marketing cost for ads on classifieds.",
                  "No appointments with numerous potential buyers.",
                  "No paperwork and title transfer process hassle."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 text-center">
            <p className="text-sm font-semibold text-slate-700 leading-relaxed max-w-3xl mx-auto">
              "Buying a car on classifieds or from local dealers can be nerve-racking, especially when it concerns the car’s inspection, paperwork, payments, getting the right value for your money, etc. With Benim Cars, we have taken care of everything for you, quite literally!"
            </p>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Our Team</h2>
          </div>
          <p className="text-slate-600 font-medium text-base leading-relaxed">
            At Benimcars, our team lives and breathes trust, excellence, and customer satisfaction. From our forward-thinking founders to our knowledgeable sales and service teams, friendly customer support staff, and efficient administrators, each member plays a crucial part in providing top-notch service. With our shared dedication to honesty and quality, we're on a mission to revolutionize the car buying and selling journey in Pune, making sure every interaction leaves our customers feeling satisfied and confident.
          </p>
        </div>

        {/* Banner with Call-to-action */}
        <div className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Ready to find your next car?</h3>
            <p className="text-slate-400 font-medium mt-1">Browse our verified Pune cars catalog or sell your pre-owned car hassle-free</p>
          </div>
          <div className="flex gap-4">
            <a href="/browse" className="px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all">
              Explore Collection
            </a>
            <a href="/sell" className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all">
              List Your Car
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

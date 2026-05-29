import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';

type Tab = 'terms' | 'privacy' | 'seller' | 'buyer';

export default function LegalInfo() {
  const [activeTab, setActiveTab] = useState<Tab>('terms');

  return (
    <div id="legal-info-page" className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-xs font-black uppercase tracking-wider">
            Policy & Security
          </span>
          <h1 className="text-4xl font-black text-slate-900 leading-none">Legal & Compliance Hub</h1>
          <p className="text-slate-400 font-medium">
            Review the transparency guidelines, listing standards, and cookie privacy frameworks of Benim Cars India.
          </p>
        </div>

        {/* Sidebar & content container split */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Action Navigation Tabs Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'terms', label: 'Terms of Service', icon: <FileText className="h-4 w-4" /> },
              { id: 'privacy', label: 'Privacy Policy', icon: <Lock className="h-4 w-4" /> },
              { id: 'seller', label: 'Listing Standards', icon: <AlertOctagon className="h-4 w-4" /> },
              { id: 'buyer', label: 'Buyer Protections', icon: <ShieldCheck className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-left flex items-center gap-3 ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-slate-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content area */}
          <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
            
            {activeTab === 'terms' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 leading-none pb-4 border-b border-slate-100">Terms of Service</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest font-mono">Last updated: May 15, 2026</p>
                <div className="space-y-4 text-sm font-medium text-slate-500 leading-relaxed">
                  <p>
                    Welcome to Benim Cars. By accessing or utilizing this website, associated databases, API routes, and messaging protocols, you agree to be bound legally under these Terms of Use and all regulatory laws governing digital trade in India.
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-6">1. Marketplace Platform Operations</h3>
                  <p>
                    Benim Cars operates as a specialized digital bulletin board linking buyers and sellers of hybrid, low-electric, and renewable passenger vehicles. Unless specifically designated, Benim Cars does not assume physical ownership, storage, inventory custody, or title transfer responsibility for the vehicles traded on our marketplace.
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-6">2. Subscription Payments & Fees</h3>
                  <p>
                    Optional marketplace actions, including subscribing for account verification badges (₹200) and promoting listings via Prime Ads (₹500), are logged securely. All charges are final and inclusive of applicable service taxes. Refusal of service is preserved for accounts found to manipulate specifications.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 leading-none pb-4 border-b border-slate-100">Privacy Policy</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest font-mono">Last updated: May 15, 2026</p>
                <div className="space-y-4 text-sm font-medium text-slate-500 leading-relaxed">
                  <p>
                    We protect your digital footprints. This policy delineates how we securely accumulate, store, and share information on our portal.
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-6">1. Information Accumulations</h3>
                  <p>
                    When logging in with Google Authentication, we safely access your profile username, email, and email avatar. When listing vehicles, configuration details, price metrics, region coordinates, and vehicle photos are recorded in our Firestore secure databases.
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-6">2. Sharing with Partners</h3>
                  <p>
                    We do not sell, rent, or distribute your email database or active contact information to third-party marketing entities. Phone numbers are only revealed when prospective buyers click to view on your listing page.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 leading-none pb-4 border-b border-slate-100">Automotive Listing Standards</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest font-mono">Marketplace Integrity Rules</p>
                <div className="space-y-4 text-sm font-medium text-slate-500 leading-relaxed">
                  <p>
                    To maintain our position as India's most trusted eco-friendly portal, all listings must adhere to the following standards of integrity.
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-6">1. Accurate Battery & OBD Metrics</h3>
                  <p>
                    Sellers must not misrepresent high-voltage battery SOH (State of Health) parameters. Using manual cell bypassing to temporarily conceal warning codes will lead to immediate, permanent account termination.
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-6">2. Real Photographic Evidence</h3>
                  <p>
                    Listed cars must showcase authentic, high-resolution original photographs showing key angles, dashboard meters, in-cabin details, and exterior panels. Using generic brochures or stock images of other cars is prohibited.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'buyer' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 leading-none pb-4 border-b border-slate-100">Buyer Protections & Warranty</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest font-mono">Drive with Complete Safety</p>
                <div className="space-y-4 text-sm font-medium text-slate-500 leading-relaxed">
                  <p>
                    Benim Cars advocates for buyer transparency at every point of the vehicle acquisition process.
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-6">1. Verification Audits</h3>
                  <p>
                    We suggest checking for our verified and green badge markers. When buying, ensure you request our field diagnostic teams to conduct battery chemical tests and physical inspections prior to transferring values.
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-6">2. Secure Messaging Protocol</h3>
                  <p>
                    Coordinate inspections and discuss transaction terms within our secure Inbox interface. Avoid transferring any deposits or listing holds outside the physical vehicle inspection process.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

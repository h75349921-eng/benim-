import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Search, 
  MapPin, 
  User, 
  Compass, 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Mail, 
  Briefcase 
} from 'lucide-react';

export default function Sitemap() {
  const sections = [
    {
      title: "Marketplace Portals",
      icon: <Car className="h-5 w-5 text-primary-500" />,
      description: "Direct access to our buying networks and rentals",
      links: [
        { to: "/", label: "Home Page (Premium Hub)" },
        { to: "/browse", label: "Browse Hybrid Inventory" },
        { to: "/rentals", label: "Rental Marketplace Hub" },
        { to: "/sell", label: "Sell Your Vehicle / Create Listing" }
      ]
    },
    {
      title: "User Management & CRM",
      icon: <User className="h-5 w-5 text-indigo-500" />,
      description: "Manage accounts, saved configurations, and custom boards",
      links: [
        { to: "/profile", label: "User Profile Panel" },
        { to: "/profile/listings", label: "My Listings Hub" },
        { to: "/profile/saved", label: "Saved Vehicles" },
        { to: "/profile/payments", label: "Payment & Subscription Log" },
        { to: "/inbox", label: "Real-time Messaging Inbox" },
        { to: "/login", label: "Login & Signup Page" }
      ]
    },
    {
      title: "Authorized Control Panels",
      icon: <LayoutDashboard className="h-5 w-5 text-amber-500" />,
      description: "Interactive system status terminal logs",
      links: [
        { to: "/dashboard/buyer", label: "Buyer Control Dashboard" },
        { to: "/dashboard/seller", label: "Seller Control Dashboard" },
        { to: "/dashboard/dealer", label: "Dealer Sales Dashboard" }
      ]
    },
    {
      title: "About & Community Insights",
      icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
      description: "Visionaries and stories of sustainable movement",
      links: [
        { to: "/about", label: "About Benim Cars India" },
        { to: "/careers", label: "Careers - Join Our Team" },
        { to: "/blogs", label: "Hybrid Intelligence Blog Hub" }
      ]
    },
    {
      title: "Customer Protection & Help",
      icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
      description: "Legal documentation and help desks",
      links: [
        { to: "/help", label: "Helpdesk & FAQ Directory" },
        { to: "/legal", label: "Legal Info & Safety Rules" },
        { to: "/contact", label: "Contact Us / Support Lines" }
      ]
    }
  ];

  return (
    <div id="sitemap-page" className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-xs font-black uppercase tracking-wider">
            Directory Index
          </span>
          <h1 className="text-4xl font-black text-slate-900 leading-none">Website Sitemap</h1>
          <p className="text-slate-400 font-medium">
            Explore the complete visual layout, functional portals, and administrative terminals of Benim Cars India.
          </p>
        </div>

        {/* Map Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-slate-50 rounded-2xl shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{section.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-0.5">{section.description}</p>
                  </div>
                </div>

                <div className="h-px bg-slate-50 my-4" />

                <ul className="space-y-3 font-semibold text-sm">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link 
                        to={link.to} 
                        className="text-slate-400 hover:text-primary-500 flex items-center gap-2 group transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-primary-500 transition-colors shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-right">
                {section.links.length} Active Indexes
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Shield,
  Briefcase,
  HelpCircle,
  FileText,
  Compass,
  FileSpreadsheet
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top bar with Branding and Social Connect */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Identity Page Block */}
          <div className="space-y-6">
            <Link to="/" id="footer-logo-link" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-primary-500/20">
                <Car className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                benim<span className="text-primary-500">cars</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              India's premier digital marketplace dedicated exclusively to high-performance, eco-friendly hybrid and electric vehicles. Drive sustainable luxury with absolute trust.
            </p>
            
            {/* Social Media Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Follow our journey</h4>
              <div className="flex items-center gap-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  id="footer-social-facebook"
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  id="footer-social-instagram"
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  id="footer-social-youtube"
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  id="footer-social-twitter"
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigations */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest border-l-2 border-primary-500 pl-3">Company</h4>
            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <Link to="/about" id="footer-link-about" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 text-primary-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" id="footer-link-careers" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 text-primary-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Careers <span className="ml-1 px-2 py-0.5 text-[9px] bg-primary-500/10 text-primary-400 rounded-md">We're hiring</span>
                </Link>
              </li>
              <li>
                <Link to="/blogs" id="footer-link-blogs" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 text-primary-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Blogs & Articles
                </Link>
              </li>
              <li>
                <Link to="/sitemap" id="footer-link-sitemap" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 text-primary-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Supports & Trust */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest border-l-2 border-secondary-500 pl-3">Support</h4>
            <ul className="space-y-3 font-semibold text-sm">
              <li>
                <Link to="/help" id="footer-link-help" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 text-secondary-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link to="/legal" id="footer-link-legal" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 text-secondary-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Legal Info & Rules
                </Link>
              </li>
              <li>
                <Link to="/contact" id="footer-link-contact" className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
                  <ArrowRight className="h-3 w-3 text-secondary-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-5">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest border-l-2 border-emerald-500 pl-3">Contact us</h4>
            <div className="space-y-3 text-sm font-semibold">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-relaxed text-xs">
                  <strong>Parking:</strong> Royal Heritage Mall, Dorabjee Paradise, B1 Parking, NIBM Rd, Pune 411060.<br />
                  <strong>Regd Office:</strong> 301, Manish Plaza, SN 16, NIBM Road, Kondhwa Khurd, Pune 411048.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-500" />
                <span className="text-slate-400">+91 846 881 7758 (10 AM - 6 PM)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-500" />
                <span className="text-slate-400">contact@benimcars.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom copyright and warning message */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-wider">
          <p>© {currentYear} Benim Cars India. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <Shield className="h-3.5 w-3.5" /> Encrypted Secure Hybrid Vehicle Trading Protocol
          </p>
        </div>
      </div>
    </footer>
  );
}

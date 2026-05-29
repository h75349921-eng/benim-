import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Heart, MessageSquare, LayoutDashboard, Settings, LogOut, ChevronRight, BarChart3, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'Buyer' | 'Seller' | 'Dealer';
  userName?: string;
  userAvatar?: string;
}

export default function DashboardLayout({ children, userType, userName: propUserName }: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  
  const userName = propUserName || user?.name || 'Guest User';

  const menuItems = {
    Buyer: [
      { id: '1', label: 'My Dashboard', icon: LayoutDashboard, path: '/dashboard/buyer' },
      { id: '2', label: 'Saved Cars', icon: Heart, path: '/dashboard/buyer/saved' },
      { id: '3', label: 'Inquiries', icon: MessageSquare, path: '/dashboard/buyer/inquiries' },
    ],
    Seller: [
      { id: '1', label: 'Overview', icon: LayoutDashboard, path: '/dashboard/seller' },
      { id: '2', label: 'Active Ads', icon: BarChart3, path: '/dashboard/seller/ads' },
      { id: '3', label: 'Leads', icon: MessageSquare, path: '/dashboard/seller/leads' },
      { id: '4', label: 'Listing Health', icon: ShieldCheck, path: '/dashboard/seller/health' },
    ],
    Dealer: [
      { id: '1', label: 'Dealer Hub', icon: LayoutDashboard, path: '/dashboard/dealer' },
      { id: '2', label: 'Inventory', icon: BarChart3, path: '/dashboard/dealer/inventory' },
      { id: '3', label: 'CRM & Leads', icon: MessageSquare, path: '/dashboard/dealer/crm' },
      { id: '4', label: 'Analytics', icon: BarChart3, path: '/dashboard/dealer/analytics' },
    ],
  };

  const currentMenu = menuItems[userType];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar - Only for Dealer */}
        {userType === 'Dealer' && (
          <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-5rem)]">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-purple rounded-2xl flex items-center justify-center text-primary-500 font-bold text-xl uppercase">
                  {userName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{userName}</h3>
                  <p className="text-xs text-slate-400 font-medium">{userType} Account</p>
                </div>
              </div>

              <nav className="space-y-1">
                {currentMenu.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-2xl transition-all group",
                        isActive 
                          ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-primary-500"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto p-8 border-t border-slate-50">
              <button 
                onClick={logout}
                className="flex items-center gap-3 p-3 w-full text-slate-400 hover:text-red-500 transition-colors font-bold text-sm"
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={cn("flex-1 p-6 lg:p-10", userType !== 'Dealer' && "max-w-7xl mx-auto w-full")}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {user?.role !== 'dealer' && userType !== 'Dealer' && (
              <div className="flex justify-center mb-10">
                <div className="inline-flex flex-wrap justify-center bg-slate-200/50 p-1.5 rounded-2xl backdrop-blur-sm border border-slate-200 gap-1">
                  <Link 
                    to="/dashboard/buyer"
                    className={cn(
                      "px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
                      userType === 'Buyer' 
                        ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Buyer Dashboard
                  </Link>
                  <Link 
                    to="/dashboard/seller"
                    className={cn(
                      "px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
                      userType === 'Seller' 
                        ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Seller Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/dashboard/admin"
                      className="px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase text-red-500 hover:text-red-600 bg-red-50/50"
                    >
                      Admin Panel ⚙️
                    </Link>
                  )}
                </div>
              </div>
            )}
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

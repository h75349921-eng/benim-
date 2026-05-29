import DashboardLayout from './DashboardLayout';
import { 
  Users, TrendingUp, BarChart3, ArrowUpRight, 
  Car, MessageSquare, CreditCard, Filter, ChevronRight,
  TrendingDown, Search, Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockCars } from '../../data/mockCars';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const data = [
  { name: 'Mon', views: 4000, leads: 240 },
  { name: 'Tue', views: 3000, leads: 139 },
  { name: 'Wed', views: 2000, leads: 980 },
  { name: 'Thu', views: 2780, leads: 390 },
  { name: 'Fri', views: 1890, leads: 480 },
  { name: 'Sat', views: 2390, leads: 380 },
  { name: 'Sun', views: 3490, leads: 430 },
];

export default function DealerDashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <DashboardLayout userType="Dealer" userName="Loading..."><div className="p-20 text-center font-black">Loading DashboardData...</div></DashboardLayout>;
  }

  if (!user || user.role !== 'dealer') {
    return <Navigate to="/dashboard/buyer" replace />;
  }

  return (
    <DashboardLayout userType="Dealer" userName={user.name}>
      <div className="space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Dealership Hub</h1>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">Performance & Inventory Analytics</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Prime Credits</p>
                <p className="text-xl font-black text-slate-900">4,250</p>
              </div>
              <button className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-yellow-600 hover:scale-110 transition-transform">
                <CreditCard className="h-5 w-5" />
              </button>
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5" /> Bulk Upload
            </button>
          </div>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Inventory', value: '48', meta: '+3 this month', icon: Car, color: 'text-blue-500 bg-blue-50' },
            { label: 'Active Leads', value: '822', meta: '+12% vs last week', icon: Users, color: 'text-purple-500 bg-purple-50' },
            { label: 'Prime Listings', value: '14', meta: '8 slots left', icon: BarChart3, color: 'text-orange-500 bg-orange-50' },
            { label: 'Total Revenue', value: '₹4.2Cr', meta: 'Average Price: ₹18L', icon: TrendingUp, color: 'text-green-500 bg-green-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" /> {stat.meta}
              </p>
            </div>
          ))}
        </div>

        {/* Charts & CRM */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Analytics Chart */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Views vs Leads</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Listing Performance (Weekly)</p>
              </div>
              <select className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-2">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#94A3B8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#94A3B8' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CRM Quick View */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500 blur-[80px] opacity-40 scroll-py-8" />
            <h3 className="text-xl font-extrabold mb-2 relative z-10">Leads CRM</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 relative z-10">Recent Actions</p>

            <div className="space-y-6 flex-1 relative z-10 overflow-y-auto no-scrollbar">
              {[
                { name: 'Kushal Parekh', car: 'Toyata Camry', time: '10m ago', type: 'WhatsApp' },
                { name: 'Neha Sharma', car: 'Lexus ES', time: '42m ago', type: 'Call' },
                { name: 'Rohan Gupta', car: 'Honda City', time: '2h ago', type: 'Booking' },
                { name: 'Amit Jain', car: 'Grand Vitara', time: '4h ago', type: 'Finance' },
              ].map((lead, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-bold text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{lead.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold truncate tracking-wide">Interested in {lead.car}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold">{lead.time}</p>
                    <p className="text-[10px] text-primary-400 font-black">{lead.type}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full py-4 bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              View CRM Platform <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

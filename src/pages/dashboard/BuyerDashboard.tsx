import DashboardLayout from './DashboardLayout';
import { Heart, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import ListingCard from '../../components/ListingCard';
import { Link, Navigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function BuyerDashboard() {
  const { cars, favorites, bookings, isLoading } = useCars();
  const { user } = useAuth();
  
  if (isLoading) {
    return <DashboardLayout userType="Buyer"><div className="p-20 text-center font-black">Loading DashboardData...</div></DashboardLayout>;
  }

  if (!user || user.role === 'dealer') {
    return <Navigate to="/dashboard/dealer" replace />;
  }

  const savedCars = cars.filter(c => favorites.includes(c.id)).slice(0, 2);
  const myBookings = bookings.filter(b => b.userId === user?.id);
  
  const inquiries = myBookings.map(b => ({
    id: b.id,
    car: cars.find(c => c.id === b.carId) || { title: b.carTitle, images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop'], id: b.carId },
    date: b.timestamp?.toDate ? b.timestamp.toDate().toLocaleDateString() : 'Just now',
    status: b.status,
    type: b.type
  }));

  return (
    <DashboardLayout userType="Buyer">
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Hello, {user?.name?.split(' ')[0] || 'Member'}!</h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">Buyer Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-blue/30 rounded-[2rem] p-8 border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Saved Cars</p>
              <h3 className="text-4xl font-black text-blue-600">{favorites.length.toString().padStart(2, '0')}</h3>
            </div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
              <Heart className="h-6 w-6" />
            </div>
          </div>
          <div className="bg-brand-purple/30 rounded-[2rem] p-8 border border-purple-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Inquiries</p>
              <h3 className="text-4xl font-black text-purple-600">{myBookings.length.toString().padStart(2, '0')}</h3>
            </div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-500 shadow-sm">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
          <div className="bg-brand-yellow/30 rounded-[2rem] p-8 border border-yellow-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Viewed</p>
              <h3 className="text-4xl font-black text-yellow-600">12</h3>
            </div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Saved Cars Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">Recently Saved</h2>
            <Link to="/dashboard/buyer/saved" className="text-sm font-bold text-primary-500 flex items-center gap-2">
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {savedCars.map(car => (
              <ListingCard key={car.id} car={car} />
            ))}
          </div>
        </div>

        {/* Inquiry History */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-8 px-2">Recent Inquiries</h2>
          <div className="space-y-4">
            {inquiries.map(item => (
              <Link 
                key={item.id} 
                to={`/inbox?carId=${item.car.id}`}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/5 transition-all"
              >
                <div className="w-24 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-1 bg-slate-50">
                  <img src={item.car.images[0]} className="w-full h-full object-cover rounded-xl" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-extrabold text-slate-900 group-hover:text-primary-500 transition-colors truncate">{item.car.title}</h4>
                    {item.type === 'PhoneView' && (
                      <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Phone Viewed</span>
                    )}
                    {item.type === 'Chat' && (
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Chat Started</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.date}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] text-primary-500 font-black uppercase tracking-widest">
                      {item.type === 'PhoneView' ? 'Contact Captured' : 
                       item.type === 'Chat' ? 'Conversation Active' :
                       'Chat with Seller'}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                  item.status === 'Completed' ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-500"
                )}>
                  {item.status}
                </div>
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </Link>
            ))}
            {inquiries.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Inquiries Found</h3>
                <p className="text-slate-400 font-medium mb-8">You haven't inquired about any hybrid cars yet.</p>
                <Link to="/browse" className="px-8 py-4 bg-primary-500 text-white rounded-[2rem] font-black shadow-xl shadow-primary-500/20 hover:scale-105 transition-all inline-flex items-center gap-2">
                  Browse Vehicles
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

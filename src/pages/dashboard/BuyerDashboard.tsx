import DashboardLayout from './DashboardLayout';
import { Heart, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ListingCard from '../../components/ListingCard';
import { Link, Navigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function BuyerDashboard() {
  const { cars, favorites, bookings, isLoading: carsLoading } = useCars();
  const { user } = useAuth();
  const { chats, isLoading: chatsLoading } = useChat();
  
  const isLoading = carsLoading || chatsLoading;

  if (isLoading) {
    return <DashboardLayout userType="Buyer"><div className="p-20 text-center font-black">Loading DashboardData...</div></DashboardLayout>;
  }

  if (!user || user.role === 'dealer') {
    return <Navigate to="/dashboard/dealer" replace />;
  }

  const savedCars = cars.filter(c => favorites.includes(c.id)).slice(0, 2);
  
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
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Messages</p>
              <h3 className="text-4xl font-black text-purple-600">{chats.length.toString().padStart(2, '0')}</h3>
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
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-yellow-600 shadow-sm">
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

        {/* Recent Messages */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-8 px-2">Recent Messages</h2>
          <div className="space-y-4">
            {chats.slice(0, 3).map(chat => (
              <Link 
                key={chat.id} 
                to={`/inbox`}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/5 transition-all"
              >
                {chat.carInfo && (
                  <div className="w-24 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-1 bg-slate-50">
                    <img src={chat.carInfo.image} className="w-full h-full object-cover rounded-xl" alt="" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-extrabold text-slate-900 group-hover:text-primary-500 transition-colors truncate">
                      {chat.recipient?.name || 'Seller'}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-500 font-medium truncate">{chat.lastMessage}</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </Link>
            ))}
            {chats.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Messages Yet</h3>
                <p className="text-slate-400 font-medium mb-8">Start a conversation with a seller.</p>
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

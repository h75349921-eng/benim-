import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, History, Search, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useCars } from '../context/CarContext';

export default function PaymentHistory() {
  const navigate = useNavigate();
  const { payments } = useCars();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Payment History</h1>
        <p className="text-slate-500 font-medium">Review your transaction history and subscription status.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {payments.length > 0 ? (
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {payments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                              <History className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{pay.type}</p>
                              <p className="text-[10px] font-medium text-slate-400">{pay.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{pay.listingTitle}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-500">{new Date(pay.date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-black text-slate-900">₹{pay.amount.toLocaleString()}</p>
                          <p className="text-[10px] font-black text-green-500 uppercase">{pay.status}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-xl text-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                <History className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Transactions Yet</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Once you complete a purchase or promote a listing, your records will appear here.</p>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-brand-blue/30 rounded-[2.5rem] p-8 border border-brand-blue/50">
            <CreditCard className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Payment Methods</h3>
            <p className="text-sm text-slate-600 mb-6">Manage your saved credit cards and UPI IDs for seamless checkout.</p>
            <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
              Add New Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

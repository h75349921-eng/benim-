import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function ContactUs() {
  const [ticketSent, setTicketSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', reason: 'general', text: '' });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.text) return;
    setSending(true);

    try {
      await emailjs.send(
        'service_bf3h5lw',
        'template_vgwg0ib',
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          reason: formData.reason,
          message: formData.text,
        },
        '1Ngumk8Q3ietcIvyO'
      );
      
      setTicketSent(true);
      setFormData({ name: '', email: '', phone: '', reason: 'general', text: '' });
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="contact-us-page" className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16">
        
        {/* Page Top */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="px-3 py-1 bg-primary-50 text-primary-500 rounded-lg text-xs font-black uppercase tracking-wider border border-primary-100">
            Get in touch
          </span>
          <h1 className="text-4xl font-black text-slate-900 leading-none">Connect with Our Team</h1>
          <p className="text-slate-400 font-medium">
            Have questions about battery diagnostic reviews, listing credentials, or dealer integrations? We are happy to help.
          </p>
        </div>

        {/* Contacts Grid */}
        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* Support Channels details */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Support Channels</h2>
            
            <div className="space-y-6">
              {/* Box 1 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 shadow-sm">
                <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">Direct Hotline Support</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-none">+91 846 881 7758</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">Available Daily, 10:00 AM to 6:00 PM IST.</p>
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 shadow-sm">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">Automotive Inquiries Support</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-none">contact@benimcars.com</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">We aim to reply to all email threads within 2 hours.</p>
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex gap-4 shadow-sm">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">Addresses</h4>
                  <p className="text-xs text-slate-500 font-bold mt-1">Parking Address:</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Royal Heritage Mall, Dorabjee Paradise, B1 Parking, NIBM Rd, Pune, MH 411060.
                  </p>
                  <p className="text-xs text-slate-500 font-bold mt-2">Registered Address:</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    301, Manish Plaza, SN 16, NIBM Road, Kondhwa Khurd, Pune 411048.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick trust message */}
            <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-3">
              <ShieldCheck className="text-primary-500 h-8 w-8" />
              <h4 className="font-black text-sm uppercase tracking-widest leading-none">Certified Safe Space</h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Every vehicle listed is subject to thorough diagnostics. Rest assured your privacy and consumer communications are fully encrypted.
              </p>
            </div>
          </div>

          {/* Form container */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 text-left">
              <h3 className="text-xl font-black text-slate-900">Transmit a Secure Message</h3>
              
              {ticketSent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Message Dispatched!</h3>
                  <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                    Your inquiry has been logged securely in our support queues. Our hybrid vehicle concierge team will reach out to you shortly.
                  </p>
                  <button 
                    onClick={() => setTicketSent(false)}
                    className="px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-md"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Your Email *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mobile Number</label>
                      <input 
                        type="tel" 
                        placeholder="" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Reason for Contact</label>
                      <select 
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-semibold text-slate-500 focus:ring-primary-500"
                      >
                        <option value="selling">Selling my vehicle</option>
                        <option value="buying">Buying / Car Viewing</option>
                        <option value="dealer">Dealer Partnership</option>
                        <option value="premium">Premium/Subscription Inquiry</option>
                        <option value="general">General Marketplace Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Message Description *</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Type your questions or specify package issues detail here..." 
                      value={formData.text}
                      onChange={(e) => setFormData({...formData, text: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                  >
                    {sending ? 'Transmitting Message...' : 'Transmit Message Securely'} <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

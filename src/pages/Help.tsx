import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, ShieldCheck, Mail, Sparkles, Send } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: 'buy' | 'sell' | 'battery' | 'payments';
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'buy' | 'sell' | 'battery' | 'payments'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Ticket form
  const [submittedTicket, setSubmittedTicket] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState({ name: '', email: '', subject: '', message: '' });

  const faqs: FAQ[] = [
    {
      category: 'battery',
      question: "What does the hybrid 'Battery Health Badge' represent?",
      answer: "The Battery Health Badge is our exclusive certification representing the high-voltage battery's current Capacity and State of Health (SOH). It's extracted directly via professional OBD-II telematics tools and computed based on load testing, cell delta voltages, and charging efficiency. A badge above 80% represents an optimal battery that does not require any cells replaced."
    },
    {
      category: 'buy',
      question: "Can I transfer the remainder of a hybrid battery warranty?",
      answer: "Yes, in India policies vary, but manufacturers like Toyota and Honda tie their standard 8-year/1,60,000 km hybrid battery warranty directly to the car's VIN chassis number. When you purchase through Benim Cars, we assist in consolidating warranty manuals to ensure a seamless official transfer at the authorized service center."
    },
    {
      category: 'sell',
      question: "How do I make my listing stand out with the 'Prime' badge?",
      answer: "You can upgrade any standard listing to a 'Prime Ad' from your Seller Dashboard or Profile Listings tab. A Prime Ad moves your car to the top of browse search queries and incorporates highlighted orange badges, increasing user clicks and views by up to 5x. The upgrade costs ₹500 and lasts for 90 days."
    },
    {
      category: 'payments',
      question: "What is the ₹200 'Verified Badge' fee utilized for?",
      answer: "The ₹200 fee is a licensing verification transaction. Once subscribed, our automated system validates your user account parameters and credentials to ensure listing integrity. This builds immense trust among prospective buyers, verifying that you are a genuine resident dealer/home-owner."
    },
    {
      category: 'buy',
      question: "Are strong hybrids exempted from road tax in Delhi/NCR or UP?",
      answer: "Yes! Under recent regional green initiatives, several Indian states (notably Uttar Pradesh) offer 100% road tax exemptions for strong self-charging hybrid vehicles. Other states offer custom registration rebates. We list all policy benefits on the vehicle detail page under state taxes."
    },
    {
      category: 'sell',
      question: "How do I communicate with potential buyers on the platform?",
      answer: "Benim Cars implements a fully integrated real-time secure Inbox. Buyers can initiate direct conversations with you from any car page. Once they initiate, you will see their message instantly in your '/inbox' portal, allowing you to discuss inspect details, price targets, and arrange visual meetups."
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketData.name || !ticketData.email || !ticketData.message) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmittedTicket(true);
      setTicketData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="help-faqs-page" className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16">
        
        {/* Banner with search */}
        <div className="bg-slate-900 rounded-[3rem] px-8 py-16 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-xs font-black uppercase tracking-wider border border-primary-500/30">
                Support Center
              </span>
              <h1 className="text-4xl font-black tracking-tight leading-none">How can we assist you today?</h1>
              <p className="text-slate-300 font-medium">Explore guides on battery health checks, green registrations, and account badges</p>
            </div>

            {/* Search FAQ */}
            <div className="relative max-w-xl mx-auto bg-white rounded-2xl p-1.5 flex items-center shadow-lg">
              <Search className="h-5 w-5 text-slate-400 ml-4 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries, questions, terms..." 
                className="w-full bg-transparent border-none py-3 px-3 text-sm text-slate-900 font-bold placeholder:text-slate-400 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Categories Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { id: 'all', label: 'All FAQs' },
            { id: 'buy', label: 'Buying Hybrids' },
            { id: 'sell', label: 'Selling & Prime Ads' },
            { id: 'battery', label: 'Battery diagnostics' },
            { id: 'payments', label: 'Badges & payments' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id as any); setOpenIndex(null); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-100 hover:text-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs list & Ticket Submission split */}
        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* FAQs Accordion */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary-500" /> Frequently Asked Questions
            </h2>

            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div 
                      key={index} 
                      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4"
                      >
                        <span className="font-extrabold text-slate-900 text-sm md:text-base leading-snug">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[2.5rem] border border-slate-100 text-center text-slate-400 italic font-bold">
                No articles matching "{searchQuery}" found. Try searching for "battery" or "FAME".
              </div>
            )}
          </div>

          {/* Ticket submission */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 sticky top-24">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-500 animate-pulse" /> Live Ticket Desk
                </h3>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cannot find your answer?</p>
                <p className="text-xs text-slate-400 font-medium">Submit a direct inquiry to our technical helpdesks in Haryana.</p>
              </div>

              {submittedTicket ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-3">
                  <Sparkles className="h-10 w-10 text-emerald-500 mx-auto" />
                  <h4 className="font-extrabold text-emerald-800">Inquiry Logged</h4>
                  <p className="text-xs text-emerald-600 font-medium">Your support ticket has been created successfully. One of our hybrid automotive experts will reply to you within 2-4 business hours.</p>
                  <button 
                    onClick={() => setSubmittedTicket(false)}
                    className="text-[10px] uppercase tracking-widest text-emerald-700 font-black hover:underline"
                  >
                    Open another ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4 text-left">
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name" 
                      value={ticketData.name}
                      onChange={(e) => setTicketData({...ticketData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="Email Address" 
                      value={ticketData.email}
                      onChange={(e) => setTicketData({...ticketData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                    />
                    <input 
                      type="text" 
                      required
                      placeholder="Subject (e.g., Battery Inspection Request)" 
                      value={ticketData.subject}
                      onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                    />
                    <textarea 
                      required
                      placeholder="Please delineate your question or vehicle details..." 
                      rows={4}
                      value={ticketData.message}
                      onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10"
                  >
                    {submitting ? 'Generating Ticket...' : 'File Secure Support Ticket'} <Send className="h-3.5 w-3.5" />
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

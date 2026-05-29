import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ArrowLeft, Heart, MessageSquare, Share2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: 'Tech' | 'Guides' | 'Market' | 'Policy';
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  likes: number;
}

export default function Blogs() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Tech' | 'Guides' | 'Market' | 'Policy'>('All');
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>({});

  const articles: Article[] = [
    {
      id: "blog-soh-battery",
      title: "Understanding Battery State of Health (SOH) in Pre-Owned Hybrids",
      category: 'Tech',
      date: "May 18, 2026",
      readTime: "6 min read",
      author: "Er. Vikram Sen, Chief Diagnostician",
      excerpt: "Buying a pre-owned hybrid? Understanding Battery SOH is the margin between driving premium luxury and facing expensive cell replacements. Here is what to inspect.",
      image: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=800",
      content: "The heart of any hybrid powertrain is the high-voltage battery. Unlike conventional internal combustion engine cars, a hybrid relies on lithium-ion or nickel-metal hydride packs working in parallel with the combustion system. Over time, battery packs naturally degrade due to temperature cycles, charging stress, and age. State of Health (SOH) is a standard diagnostic metric representing the current battery capacity relative to its nominal factory rating. For instance, an SOH of 90% implies the battery retains 90% of its original charge storage capacity. This guide walks you through analyzing cell delta voltage variations, cooling fan maintenance requirements, and how the Benim Cars Team utilizes active OBD-II telematics mapping to certify every premium hybrid listed on our marketplace.",
      likes: 42
    },
    {
      id: "blog-luxury-hybrid",
      title: "Top 5 Premium Hybrid Sedans in India for Ultra-Smooth City Commutes",
      category: 'Market',
      date: "May 10, 2026",
      readTime: "5 min read",
      author: "Aditi Roy, Automotive Editor",
      excerpt: "From Toyota Camry's unmatched reliability to Lexus ES 300h’s immaculate craftsmanship, explore the finest elite eco-luxury rides available today.",
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
      content: "In the context of growing dense metropolitan traffic jams in cities like Delhi NCR, Mumbai, and Bengaluru, premium drivers are shifting rapidly towards self-charging hybrid systems. A self-charging layout enables pure-electric silent propulsion during low-speed crawling traffic, meaning zero tailpipe emissions and spectacular combustion mileage of up to 22 km/l. We rank the absolute leaders in pre-owned and new categories, assessing criteria such as dynamic rear executive seating comfort, active lane keeping systems, battery warranty transfer options, and overall ride quietness.",
      likes: 56
    },
    {
      id: "blog-fame-subsidy",
      title: "Deciphering Union FAME-III Guidelines & Hybrid Registration Exemptions",
      category: 'Policy',
      date: "April 28, 2026",
      readTime: "8 min read",
      author: "Rajan Sharma, Regulatory Analyst",
      excerpt: "Navigate state road tax waivers, registration rebates, and green license plate protocols for mild, strong, and plug-in hybrid electric platforms.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
      content: "Indian regulatory structures around electric and hybrid drivetrains are evolving rapidly, with policies differing significantly across individual states. This policy deep dive analyzes Uttar Pradesh's historic road tax waivers on strong hybrids, Haryana's electric subsidy incentives, and Delhi's green registration criteria. We explain how you can legally maximize your tax and toll savings by configuring green license plates and completing hybrid certification correctly.",
      likes: 29
    }
  ];

  const handleLike = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticleLikes(prev => ({
      ...prev,
      [articleId]: (prev[articleId] || articles.find(a => a.id === articleId)?.likes || 0) + 1
    }));
  };

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  return (
    <div id="blog-hub-page" className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 bg-primary-50 text-primary-500 rounded-lg text-xs font-black uppercase tracking-wider border border-primary-100">
            Insights & Guides
          </span>
          <h1 className="text-4xl font-black text-slate-900 leading-none">Hybrid Intelligence Hub</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            Stay ahead of India’s sustainable locomotion revolution. Quality analysis, vehicle maintenance guides, and market updates compiled directly by Benim Cars diagnostics engineers.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['All', 'Tech', 'Guides', 'Market', 'Policy'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat as any); setSelectedArticle(null); }}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                (cat === 'All' && activeCategory === 'All') || activeCategory === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-100'
              }`}
            >
              {cat === 'All' ? 'All Articles' : `${cat}`}
            </button>
          ))}
        </div>

        {/* Main Section */}
        {selectedArticle ? (
          /* Reader View */
          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="relative aspect-[21/9] overflow-hidden bg-slate-100">
              <img src={selectedArticle.image} className="w-full h-full object-cover" alt="" />
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 left-6 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-sm transition-all shadow-lg"
              >
                <ArrowLeft className="h-4 w-4" /> Go Back
              </button>
            </div>

            <div className="p-8 md:p-12 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                <span className="px-2.5 py-1 bg-primary-100/50 text-primary-500 rounded-lg">
                  {selectedArticle.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {selectedArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {selectedArticle.readTime}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-3 py-4 border-t border-b border-slate-50">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 font-bold text-sm shrink-0">
                  {selectedArticle.author.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm leading-tight">{selectedArticle.author}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Benim Cars Contributor</p>
                </div>
              </div>

              <p className="text-slate-600 font-medium text-base leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button 
                  onClick={(e) => handleLike(selectedArticle.id, e)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <Heart className="h-4 w-4 fill-red-500" /> Like ({articleLikes[selectedArticle.id] || selectedArticle.likes})
                </button>
                <button 
                  onClick={() => alert("Link copied to clipboard for easy sharing!")}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <Share2 className="h-4 w-4" /> Share Article
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((item) => (
              <div 
                key={item.id} 
                id={`article-card-${item.id}`}
                onClick={() => setSelectedArticle(item)}
                className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col cursor-pointer group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-primary-500 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read Article <BookOpen className="h-3.5 w-3.5" />
                    </span>
                    <button 
                      onClick={(e) => handleLike(item.id, e)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500"
                    >
                      <Heart className="h-3.5 w-3.5" /> {articleLikes[item.id] || item.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

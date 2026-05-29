import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  responsibilities: string[];
}

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', portfolio: '', note: '' });

  const jobs: Job[] = [
    {
      id: "hybrid-battery-eng",
      title: "Senior Hybrid Battery Diagnostics Engineer",
      department: "Automotive Assessment & Quality",
      location: "Pune, Maharashtra (On-site)",
      type: "Full-Time",
      salary: "₹18,00,000 - ₹24,00,000 / year",
      description: "We are seeking an expert who understands high-voltage battery architecture, cell chemical degradation, state-of-charge calculation, and regenerative motor parameters to lead our diagnostic inspection services.",
      responsibilities: [
        "Evaluate battery pack health across Prius, Accord, Camry Hybrid, and luxury EV entries.",
        "Refine battery degradation algorithms used to calculate car 'Health Badges' on the platform.",
        "Train field technicians on safe high-voltage inspection parameters and procedures.",
        "Collaborate with software engineers to feed Diagnostic API reports directly into marketplace listing data."
      ]
    },
    {
      id: "full-stack-dev",
      title: "Full-Stack Engineer - React / Express",
      department: "Engineering & Digital Product",
      location: "Pune, Maharashtra (Hybrid) / Remote",
      type: "Full-Time",
      salary: "₹14,0,000 - ₹22,00,000 / year",
      description: "Help build the ultimate digital hybrid vehicle portal. You will construct highly interactive React SPAs, live booking systems, real-time messaging, and high-performance server integrations in Node.js.",
      responsibilities: [
        "Develop beautifully crafted, high-performance web experiences using React and Tailwind CSS.",
        "Refine Express API endpoints, image optimization grids, and Firestore query security policies.",
        "Incorporate third-party financial interfaces and OAuth single sign-on mechanisms.",
        "Ensure lightning-fast mobile rendering and optimize loading parameters for slow internet zones."
      ]
    },
    {
      id: "hybrid-sales-expert",
      title: "Automotive Hybrid Concierge",
      department: "Customer Relations & Advisory",
      location: "Pune, NIBM Road Office",
      type: "Full-Time",
      salary: "₹8,00,000 - ₹12,00,000 / year",
      description: "Directly advise premier buyers looking to transition into hybrid technology. You will serve as an objective tech expert assisting buyers on which electric powertrain matches their commute pattern.",
      responsibilities: [
        "Respond to premium buyers inquiring about Toyota, Honda, and Lexus hybrid powertrains.",
        "Guide buyers on state tax benefits, premium buyer registration processes, and charger setups.",
        "Build deep, lasting, trustworthy relationships with regional premium dealerships.",
        "Actively manage active inquiries CRM board to facilitate optimal user deal-closures."
      ]
    }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setApplied(true);
      setFormData({ name: '', email: '', portfolio: '', note: '' });
    }, 1500);
  };

  return (
    <div id="careers-page" className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 bg-amber-50 text-amber-500 rounded-lg text-xs font-black uppercase tracking-wider border border-amber-100">
            Work with Us
          </span>
          <h1 className="text-4xl font-black text-slate-900 leading-none">Assemble the Future</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            We are a tight-knit collective of technologists, car collectors, and green-energy advocates rebuilding automotive commerce in India. If you are passionate about hybrids, EVs, and sleek software, let's talk.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <span className="text-3xl">🔋</span>
            <h3 className="font-extrabold text-slate-900 text-lg">Clean Energy First</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              We focus purely on green carbon-saving technologies. Play a direct, measurable role in reducing commuter emissions.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <span className="text-3xl">🏢</span>
            <h3 className="font-extrabold text-slate-900 text-lg">Hybrid Work Culture</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Work from Pune, your couch, or a scenic spot. We evaluate results, impact, and clarity of thought, not strict hour tallies.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <span className="text-3xl">🚗</span>
            <h3 className="font-extrabold text-slate-900 text-lg">Automotive Perks</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Get hands-on test drive access to state-of-the-art hybrid drivetrains, EV platforms, and premium maintenance support.
            </p>
          </div>
        </div>

        {/* Jobs & Interaction Block */}
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Jobs List */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">Open Positions</h2>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  id={`job-card-${job.id}`}
                  onClick={() => { setSelectedJob(job); setApplied(false); }}
                  className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-4 ${
                    selectedJob?.id === job.id 
                      ? 'border-primary-500 shadow-lg ring-1 ring-primary-500' 
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded">
                      {job.department}
                    </span>
                    <h3 className="text-lg font-black text-slate-900">{job.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-300" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-slate-300" /> {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Detail Column */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 sticky top-24">
                <div className="space-y-2 pb-6 border-b border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 leading-snug">{selectedJob.title}</h3>
                  <p className="text-xs font-bold text-primary-500">{selectedJob.salary}</p>
                </div>

                <div className="space-y-4 text-sm font-medium text-slate-500 leading-relaxed">
                  <p>{selectedJob.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Active Responsibilities</h4>
                    <ul className="space-y-2 list-disc list-inside text-xs">
                      {selectedJob.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Application Form */}
                <div className="pt-6 border-t border-slate-100 block">
                  {applied ? (
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center space-y-3">
                      <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                      <h4 className="font-extrabold text-green-800">Application Received!</h4>
                      <p className="text-xs text-green-600 font-medium">Our recruitment team will review your profile and reach out within 3 business days.</p>
                      <button 
                        onClick={() => setApplied(false)}
                        className="text-[10px] uppercase tracking-widest text-green-700 font-black hover:underline"
                      >
                        Submit another response
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4 text-left">
                      <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-2">Apply in 1-Click</h4>
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          required
                          placeholder="Your Full Name" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                        />
                        <input 
                          type="email" 
                          required
                          placeholder="Email Address" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                        />
                        <input 
                          type="url" 
                          placeholder="GitHub / LinkedIn / Portfolio URL" 
                          value={formData.portfolio}
                          onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                        />
                        <textarea 
                          placeholder="Why do you want to join Benim Cars?" 
                          rows={3}
                          value={formData.note}
                          onChange={(e) => setFormData({...formData, note: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold placeholder:text-slate-400 focus:ring-primary-500"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        {submitting ? 'Submitting Profile...' : 'Submit Application'} <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center py-16 sticky top-24">
                <span className="text-4xl">💼</span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-3">Select a listing</h3>
                <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto mt-1 leading-relaxed">
                  Click on an active position in the list to inspect responsibilities, salary range, and submit your application.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

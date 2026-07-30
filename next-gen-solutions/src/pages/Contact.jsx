import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Contact() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    phone: '',
    projectScope: 'General Inquiry',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      // Submit to backend API endpoint
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ clientName: '', clientEmail: '', phone: '', projectScope: 'General Inquiry', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      // Fallback for frontend-only prototyping
      setSubmitStatus('success');
      setFormData({ clientName: '', clientEmail: '', phone: '', projectScope: 'General Inquiry', message: '' });
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 lg:px-12 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded inline-block">
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight font-sans">
            Contact Our Architect Team
          </h1>
          <p className="text-lg text-brand-slate leading-relaxed">
            Inquire about system scaling, UI/UX designs, or DevOps migrations. We respond to scoping requests within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Body: Details & Form */}
      <section className="py-20 px-6 lg:px-12 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Office info & channels */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-navy">ITNEXUS Channels</h2>
              <p className="text-brand-slate leading-relaxed text-sm">
                Connect with our technical support or regional sales coordinators via these secure channels.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">Email Support</h4>
                  <p className="text-xs font-bold text-brand-blue mt-1">contact@itnexus.com</p>
                  <p className="text-xs text-brand-slate mt-0.5">Checked continuously throughout business hours.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">Phone Channel</h4>
                  <p className="text-xs font-bold text-brand-blue mt-1">+92 (300) 123-4567</p>
                  <p className="text-xs text-brand-slate mt-0.5">Available Mon-Fri, 9:00 AM - 6:00 PM PKT.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">Regional Office</h4>
                  <p className="text-xs text-brand-slate mt-1 font-semibold">ITNEXUS HQ, Software Park, PK</p>
                  <p className="text-xs text-brand-slate mt-0.5">Visitor appointments require 24h pre-clearance.</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="border border-slate-200/60 rounded-2xl p-6 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-mono flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-cyan" />
                HQ Coordinates
              </h4>
              <div className="h-40 rounded-xl bg-slate-200/60 flex items-center justify-center border border-slate-300/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                <div className="z-10 text-center space-y-1 p-4">
                  <div className="text-xs font-bold text-brand-navy">ITNEXUS HQ Portal</div>
                  <div className="text-[10px] text-brand-slate font-mono">31.5204° N, 74.3587° E</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-3xl p-8 sm:p-12 shadow-sm">
            <h3 className="text-xl font-bold text-brand-navy mb-2">Scope Your Project</h3>
            <p className="text-sm text-brand-slate mb-8">Fill out the detailed form to initiate technical discussion.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Your Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Email Address</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92 (300) 123-4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Project Area</label>
                  <select
                    name="projectScope"
                    value={formData.projectScope}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm bg-white font-medium"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Custom Web Application">Custom Web Application</option>
                    <option value="UI/UX & Brand Design">UI/UX & Brand Design</option>
                    <option value="Cloud & DevOps Architecture">Cloud & DevOps Architecture</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Project Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  placeholder="Tell us about the project goals, requirements, and estimated launch dates..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-brand-cyan/10 text-brand-navy text-sm p-4 rounded-xl border border-brand-cyan/25">
                  🚀 Message sent successfully! Our team will contact you shortly.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-brand-navy/5 text-brand-navy text-sm p-4 rounded-xl border border-brand-navy/15">
                  ❌ Sending failed. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-bold py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Support FAQ */}
      <section className="py-20 px-6 lg:px-12 bg-slate-50/30 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-10 w-10 rounded-lg bg-cyan-50 text-brand-cyan flex items-center justify-center mx-auto border border-cyan-100 mb-2">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy">Require immediate technical help?</h2>
          <p className="text-brand-slate leading-relaxed text-sm max-w-lg mx-auto">
            Existing clients can reach their designated architect directly via Slack channels or project Jira boards for SLA-bounded emergency support.
          </p>
        </div>
      </section>
    </div>
  );
}

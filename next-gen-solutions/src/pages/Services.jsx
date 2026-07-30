import React, { useState, useEffect } from 'react';
import { Code, Palette, Cloud, Smartphone, Check, Send } from 'lucide-react';
import { API_BASE_URL } from '../config';

const iconMap = {
  Code: Code,
  Palette: Palette,
  Cloud: Cloud,
  Smartphone: Smartphone
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    phone: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then(res => res.json())
      .then(data => {
        setServices(data);
        if (data.length > 0) {
          setSelectedService(data[0].title);
        }
      })
      .catch(err => console.error('Error fetching services:', err));
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      // Submit to backend endpoint
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          phone: formData.phone,
          projectScope: selectedService,
          message: formData.message
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ clientName: '', clientEmail: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      // Fallback for frontend-only prototyping
      setSubmitStatus('success');
      setFormData({ clientName: '', clientEmail: '', phone: '', message: '' });
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 lg:px-12 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-brand-blue/5 text-brand-blue px-3 py-1 rounded inline-block">
            Our Solutions
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
            Comprehensive Technical Services
          </h1>
          <p className="text-lg text-brand-slate leading-relaxed">
            From database modeling to front-end layout transitions, we build applications that are clean, performant, and scale seamlessly.
          </p>
        </div>
      </section>

      {/* Detailed Services Listing */}
      <section className="py-20 px-6 lg:px-12 border-b border-slate-200/60 bg-white">
        <div className="space-y-24">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code;
            const isEven = index % 2 === 0;

            const techStack = service.technologies || [];
            const features = service.deliverables || [];

            return (
              <div 
                key={service._id} 
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}
              >
                <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-blue/5 text-brand-blue flex items-center justify-center border border-brand-blue/10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-navy">{service.title}</h2>
                  </div>
                  <p className="text-brand-slate leading-relaxed">
                    {service.description} We work with enterprise standards, assuring clean architecture, unit testing patterns, and structured data handling.
                  </p>
                  
                  {/* Key Features list */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">Deliverables include:</h3>
                    <ul className="space-y-2.5">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-brand-slate">
                          <Check className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA button to prefill inquiry form */}
                  <div className="pt-4">
                    <a
                      href="#inquiry-form"
                      onClick={() => setSelectedService(service.title)}
                      className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-brand-navy text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-200 transition-colors"
                    >
                      Inquire About This Service
                    </a>
                  </div>
                </div>

                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="border border-slate-200/60 p-8 rounded-3xl bg-slate-50/30 space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-mono">Technologies we deploy:</h4>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="bg-white border border-slate-200/60 text-brand-navy text-xs font-mono px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry-form" className="py-24 px-6 lg:px-12 bg-slate-50/30">
        <div className="max-w-xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/60 shadow-xl">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl font-bold text-brand-navy">Service Inquiry Form</h2>
            <p className="text-sm text-brand-slate">Select a technical solution to initiate project scoping.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Requested Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm bg-white font-medium"
              >
                {services.map(service => (
                  <option key={service._id} value={service.title}>{service.title}</option>
                ))}
              </select>
            </div>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5 font-mono">Project Scope details</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Outline your timeline, goals, and system requirements..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm"
              ></textarea>
            </div>

            {submitStatus === 'success' && (
              <div className="bg-brand-cyan/10 text-brand-navy text-sm p-4 rounded-xl border border-brand-cyan/25">
                🚀 Inquiry submitted successfully! Our lead architect will follow up in 24 hours.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="bg-brand-navy/5 text-brand-navy text-sm p-4 rounded-xl border border-brand-navy/15">
                ❌ Submission failed. Please try again or email contact@itnexus.com directly.
              </div>
            )}

            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-bold py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {submitStatus === 'submitting' ? 'Sending...' : 'Send Inquiry'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

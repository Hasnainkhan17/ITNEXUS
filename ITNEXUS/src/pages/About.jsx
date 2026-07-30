import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Shield, Zap, Target } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Compass,
      title: "Integrity-Driven Engineering",
      description: "We write clean, documented, and secure code built to withstand audits and long-term scaling challenges."
    },
    {
      icon: Zap,
      title: "Extreme Performance",
      description: "We optimize load times, telemetry pathways, and databases to deliver sub-second interactions everywhere."
    },
    {
      icon: Shield,
      title: "Zero-Trust Architecture",
      description: "Security is baked into our foundation, protecting user records, database assets, and APIs from day one."
    },
    {
      icon: Target,
      title: "Business-First Alignment",
      description: "We don't build technology for technology's sake. Every feature we construct serves a business metric."
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 lg:px-12 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded inline-block">
            About ITNEXUS
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
            Our Mission & Core Capability
          </h1>
          <p className="text-lg text-brand-slate leading-relaxed">
            ITNEXUS is an elite team of full-stack engineers, cloud architects, and UI/UX designers specialized in building high-throughput systems and dynamic corporate applications.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 px-6 lg:px-12 border-b border-slate-200/60 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">
              Crafting premium solutions for global digital transformations
            </h2>
            <p className="text-brand-slate leading-relaxed">
              Founded in 2021, ITNEXUS emerged from a simple observation: mid-to-large scale businesses often struggle with fragmented technologies that stall deployment speeds and compromise data security.
            </p>
            <p className="text-brand-slate leading-relaxed">
              Our engineering philosophy is rooted in modularity and performance. By unifying database systems, serverless Cloud architecture, and beautiful responsive interfaces under standard design systems, we help our clients deploy features faster and operate with maximum security.
            </p>
          </div>
          <div className="border border-slate-200/60 rounded-3xl p-8 bg-slate-50/30 space-y-6">
            <h3 className="text-xl font-bold text-brand-navy">Operational Metrics</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-4xl font-extrabold text-brand-blue">5+</div>
                <div className="text-xs font-semibold text-brand-slate uppercase tracking-wider">Countries Served</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-extrabold text-brand-cyan">50+</div>
                <div className="text-xs font-semibold text-brand-slate uppercase tracking-wider">Clients Worldwide</div>
              </div>
              <div className="space-y-1 col-span-2 pt-4 border-t border-slate-200/40">
                <div className="text-4xl font-extrabold text-brand-navy">24/7/365</div>
                <div className="text-xs font-semibold text-brand-slate uppercase tracking-wider">Continuous Deployment Telemetry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 lg:px-12 bg-slate-50/30 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-brand-navy">Our Core Values</h2>
          <p className="text-brand-slate">The principles that guide our everyday technical decisions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy">{value.title}</h3>
                <p className="text-sm text-brand-slate leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-24 px-6 lg:px-12 bg-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">
            "Software engineering is not about typing code, it's about solving enterprise challenges with absolute reliability."
          </h2>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Award } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { resolveAssetUrl } from '../utils/assetLoader';
import useSeo from '../utils/useSeo';

export default function Team() {
  useSeo({
    title: 'Team',
    description: 'Meet the architects, principal engineers, and designers building enterprise solutions at ITNEXUS.'
  });

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/team`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch team');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTeam(data);
        } else {
          setTeam([]);
        }
      })
      .catch(err => console.error('Error fetching team:', err))
      .finally(() => setLoading(false));
  }, []);



  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 lg:px-12 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded inline-block">
            Our Architects
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight font-sans">
            Meet the ITNEXUS Team
          </h1>
          <p className="text-lg text-brand-slate leading-relaxed">
            The technical professionals, architects, and designers committed to delivering pristine software solutions.
          </p>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="py-20 px-6 lg:px-12 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto space-y-16">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue" />
            </div>
          ) : Array.isArray(team) && team.length > 0 ? (
            team.map((member) => (
              <div 
                key={member._id} 
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border border-slate-200/60 p-5 sm:p-6 rounded-3xl bg-slate-50/30 shadow-sm"
              >
                {/* Left Column: Photo & Basic Details */}
                <div className="lg:col-span-4 text-center lg:text-left space-y-4">
                  <div className="w-full max-w-[170px] aspect-[4/5] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden mx-auto lg:mx-0 shadow-sm">
                    <img
                      src={resolveAssetUrl(member.imageUrl)}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.warn(`[Image Load Warning] ${member.name} image failed to load from:`, e.target.src);
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-navy">{member.name}</h2>
                    <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider mt-1">{member.role}</p>
                  </div>
                </div>

                {/* Right Column: Bio */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Bio block */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-mono flex items-center gap-2">
                      <Award className="w-4 h-4 text-brand-cyan" />
                      Professional Biography
                    </h3>
                    <p className="text-brand-slate leading-relaxed text-sm">
                      {member.fullBio || member.shortBio}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 py-10">No team profiles available.</div>
          )}
        </div>
      </section>

      {/* Advisory Section */}
      <section className="py-20 px-6 lg:px-12 bg-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-12 w-12 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center mx-auto border border-brand-blue/10 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-brand-navy">Advisory & Security Protocols</h2>
          <p className="text-brand-slate leading-relaxed text-sm max-w-xl mx-auto">
            All team architects hold industry-recognized cloud architecture and secure systems certifications. We perform periodic reviews on deployment pipelines and internal databases to assure absolute security compliance.
          </p>
        </div>
      </section>
    </div>
  );
}

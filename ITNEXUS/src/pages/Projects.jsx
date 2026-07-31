import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ExternalLink, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { resolveAssetUrl } from '../utils/assetLoader';
import useSeo from '../utils/useSeo';

export default function Projects() {
  useSeo({
    title: 'Projects',
    description: 'Explore our portfolio of shipped digital products, real-time vital telemetry platforms, and cloud migrations.'
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  const categories = ['All', 'Web Apps', 'Mobile Apps', 'Cloud Architecture', 'UI/UX Design'];

  const categoryMap = {
    'All': 'All',
    'Web Apps': 'Custom Web App',
    'Mobile Apps': 'Mobile App',
    'Cloud Architecture': 'Cloud & Devops',
    'UI/UX Design': 'UI/UX & Brand Design'
  };

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === categoryMap[activeCategory]);

  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 lg:px-12 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-brand-blue/5 text-brand-blue px-3 py-1 rounded inline-block">
            Portfolio
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
            Our Portfolio & Case Studies
          </h1>
          <p className="text-lg text-brand-slate leading-relaxed">
            Discover how we apply software architecture and DevOps pipelines to deliver secure, highly-scalable enterprise assets.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-slate-200/60 bg-slate-50/30 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === category
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/15'
                  : 'bg-white border border-slate-200 text-brand-slate hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-video bg-slate-100">
                  <img
                    src={resolveAssetUrl(project.thumbnailUrl)}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200/50 text-[10px] font-bold font-mono tracking-wider text-brand-blue uppercase px-2.5 py-1 rounded-md">
                    {project.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-blue transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-brand-slate text-sm leading-relaxed mb-4">
                      {project.shortDescription}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-blue">
                    <span>Read Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop glass */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 z-10 max-h-[85vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white/95 border border-slate-200 p-2 rounded-full text-brand-navy hover:bg-slate-50 transition-colors z-20 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto flex-grow">
                {/* Banner Image */}
                <div className="relative h-64 md:h-80 bg-slate-100">
                  <img
                    src={resolveAssetUrl(selectedProject.thumbnailUrl)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 md:left-10 text-white space-y-2">
                    <span className="bg-brand-blue text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-1.5 rounded-md border border-brand-blue/20">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black">{selectedProject.title}</h2>
                  </div>
                </div>

                {/* Case Study Details */}
                <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Full narrative */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-2 font-mono">Case Overview</h3>
                      <p className="text-brand-slate leading-relaxed">{selectedProject.fullDescription}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/40 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-brand-navy">
                        <ShieldCheck className="w-5 h-5 text-brand-cyan" />
                        <span>Security & Performance Audit Verified</span>
                      </div>
                      <p className="text-xs text-brand-slate leading-relaxed">
                        This deployment successfully passes compliance scanning, features TLS encryption protocols, and is deployed via secure CI/CD pipelines.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Meta details */}
                  <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-150 pt-6 lg:pt-0 lg:pl-8 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3 font-mono flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-blue" />
                        Timeline
                      </h4>
                      <span className="text-sm font-semibold text-brand-slate">{selectedProject.timeline || '4-6 Months'}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3 font-mono flex items-center gap-2">
                        <Tag className="w-4 h-4 text-brand-blue" />
                        Key Capabilities
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.technologies && selectedProject.technologies.length > 0 ? (
                          selectedProject.technologies.map((tech, idx) => (
                            <span key={idx} className="bg-slate-50 border border-slate-200 text-brand-navy text-[10px] font-mono px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="bg-slate-50 border border-slate-200 text-brand-navy text-[10px] font-mono px-2 py-1 rounded">MERN Stack</span>
                        )}
                      </div>
                    </div>

                    {selectedProject.projectUrl && (
                      <div className="pt-4 border-t border-slate-100">
                        <a
                          href={selectedProject.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 text-sm transition-colors"
                        >
                          Go to Project
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, Layers, Newspaper } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { resolveAssetUrl } from '../utils/assetLoader';
import useSeo from '../utils/useSeo';

export default function BlogHub() {
  useSeo({
    title: 'Blog',
    description: 'Technical deep-dives, scalability tutorials, Express API optimization strategies, and cybersecurity guidelines.'
  });

  const [blogs, setBlogs] = useState([]);
  const [activeType, setActiveType] = useState('All');

  useEffect(() => {
    fetch(`${API_BASE_URL}/blogs`)
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Error fetching blogs:', err));
  }, []);

  const filteredBlogs = activeType === 'All'
    ? blogs
    : blogs.filter(blog => blog.type === activeType);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full bg-[#FAFAFC] pb-24">
      {/* Hero Header */}
      <section className="pt-36 pb-20 px-6 lg:px-12 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded inline-block">
            Publications
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight leading-none">
            ITNEXUS Knowledge Base
          </h1>
          <p className="text-lg text-brand-slate leading-relaxed">
            Read corporate research, cloud whitepapers, tech guides, and architectural case studies.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 px-6 lg:px-12 flex justify-center border-b border-slate-200/40 bg-white">
        <div className="flex gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/40">
          {['All', 'Blog', 'Case Study'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeType === type
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-brand-slate hover:text-brand-navy'
              }`}
            >
              {type === 'All' ? 'Show All' : `${type}s`}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/60 rounded-3xl space-y-4">
            <BookOpen className="w-12 h-12 text-slate-350 mx-auto" />
            <h3 className="text-lg font-bold text-brand-navy">No publications found</h3>
            <p className="text-sm text-brand-slate">Stay tuned! We are drafting new architectural breakdowns.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog) => (
                <motion.div
                  layout
                  key={blog._id}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeInUp}
                  className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                >
                  {/* Article Thumbnail */}
                  <div className="relative overflow-hidden aspect-video bg-slate-100 flex items-center justify-center border-b border-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                      {blog.type === 'Case Study' ? (
                        <Layers className="w-12 h-12 text-brand-cyan/25 group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <Newspaper className="w-12 h-12 text-brand-blue/20 group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                    
                    {blog.imageUrl && (
                      <img 
                        src={resolveAssetUrl(blog.imageUrl)} 
                        alt={blog.title} 
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Badge */}
                    <div className={`absolute top-4 left-4 border text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-1 rounded-md z-20 ${
                      blog.type === 'Case Study'
                        ? 'bg-brand-cyan/10 text-brand-blue border-brand-cyan/20'
                        : 'bg-brand-blue/5 text-brand-blue border-brand-blue/10'
                    }`}>
                      {blog.type}
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-brand-navy border border-slate-200/40 z-20">
                      {blog.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-[10px] font-bold font-mono text-brand-slate">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                          {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-blue" />
                          {blog.readTime || '5 min read'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-blue transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-brand-slate text-sm leading-relaxed line-clamp-3">
                        {blog.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-[10px] flex items-center justify-center font-mono">
                          {blog.author ? blog.author.split(' ').map(n => n[0]).join('') : 'IT'}
                        </div>
                        <span className="text-[10px] font-bold text-brand-navy">{blog.author || 'ITNEXUS Team'}</span>
                      </div>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-blue-600 transition-colors"
                      >
                        Read Article
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}

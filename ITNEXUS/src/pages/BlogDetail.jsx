import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, ShieldCheck, Layers, Newspaper } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { resolveAssetUrl } from '../utils/assetLoader';
import useSeo from '../utils/useSeo';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useSeo({
    title: blog ? blog.title : 'Blog Article',
    description: blog ? blog.shortDescription : 'Read technical article from ITNEXUS developers.',
    keywords: blog ? blog.category : null
  });

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/blogs/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  // Mini-markdown parser helper to render long-form body content beautifully
  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').map((para, idx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;
      
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-base font-bold text-brand-navy mt-6 mb-3 font-sans uppercase tracking-wider">
            {trimmed.replace('###', '').trim()}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={idx} className="text-xl font-extrabold text-brand-navy mt-8 mb-4 font-sans">
            {trimmed.replace('##', '').trim()}
          </h3>
        );
      }
      if (trimmed.startsWith('#')) {
        return (
          <h2 key={idx} className="text-2xl font-black text-brand-navy mt-10 mb-6 font-sans border-b pb-2 border-slate-100">
            {trimmed.replace('#', '').trim()}
          </h2>
        );
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return (
          <li key={idx} className="text-brand-slate text-sm leading-relaxed ml-6 list-disc pl-1.5 my-1.5">
            {trimmed.substring(1).trim()}
          </li>
        );
      }
      // Ordered lists starting with numbers (e.g. 1. Node)
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="text-brand-slate text-sm leading-relaxed ml-6 list-decimal pl-1.5 my-1.5 font-sans">
            {trimmed.replace(/^\d+\.\s/, '').trim()}
          </li>
        );
      }
      return (
        <p key={idx} className="text-brand-slate text-sm leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-slate font-mono">Loading dynamic article...</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full border border-slate-200/60 rounded-3xl p-8 text-center space-y-6 bg-slate-50/20 shadow-xl">
          <h2 className="text-2xl font-bold text-brand-navy">Article Not Found</h2>
          <p className="text-sm text-brand-slate">The requested article could not be resolved or does not exist in our database.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-24">
      {/* Article Navigation & Header */}
      <section className="pt-36 pb-12 px-6 lg:px-12 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-slate hover:text-brand-blue transition-colors font-mono uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Articles
          </Link>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-1 rounded-md border ${
              blog.type === 'Case Study'
                ? 'bg-brand-cyan/10 text-brand-blue border-brand-cyan/20'
                : 'bg-brand-blue/5 text-brand-blue border-brand-blue/10'
            }`}>
              {blog.type}
            </span>
            <span className="bg-slate-100 text-brand-navy text-[10px] font-bold font-mono px-2.5 py-1 rounded-md">
              {blog.category}
            </span>
          </div>
 
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-base text-brand-slate font-medium leading-relaxed border-l-2 border-brand-blue pl-4 py-1">
            {blog.shortDescription}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs flex items-center justify-center font-mono border border-brand-blue/20">
                {blog.author ? blog.author.split(' ').map(n => n[0]).join('') : 'IT'}
              </div>
              <div>
                <span className="block text-xs font-bold text-brand-navy leading-none">{blog.author || 'ITNEXUS Team'}</span>
                <span className="text-[10px] text-brand-slate leading-none">Author, ITNEXUS</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-[10px] font-bold font-mono text-brand-slate">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-blue" />
                {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-blue" />
                {blog.readTime || '5 min read'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Narrative Area */}
      <section className="px-6 lg:px-12 pt-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main article core */}
          <div className="lg:col-span-12 space-y-6">
            
            {/* Visual Cover Asset Banner */}
            <div className="w-full aspect-video rounded-3xl bg-slate-50 border border-slate-200/60 overflow-hidden flex items-center justify-center relative shadow-sm mb-10">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 flex items-center justify-center">
                {blog.type === 'Case Study' ? (
                  <Layers className="w-24 h-24 text-brand-cyan/20 animate-pulse" />
                ) : (
                  <Newspaper className="w-24 h-24 text-brand-blue/15 animate-pulse" />
                )}
              </div>

              {blog.imageUrl && (
                <img 
                  src={resolveAssetUrl(blog.imageUrl)} 
                  alt={blog.title} 
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              )}
            </div>

            {/* Render formatted body paragraphs */}
            <div className="prose max-w-none text-brand-slate font-sans">
              {renderContent(blog.content)}
            </div>

            {/* Bottom Section Card */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/40 space-y-4 mt-12">
              <div className="flex items-center gap-2 text-base font-bold text-brand-navy">
                <ShieldCheck className="w-6 h-6 text-brand-cyan" />
                <span>Verified System Integrity & Design Standards</span>
              </div>
              <p className="text-xs text-brand-slate leading-relaxed">
                This document relates to verified architectural blueprints designed, deployed, and monitored under modern standards. All references correspond to enterprise MERN, DevOps, and cloud compliance patterns.
              </p>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}

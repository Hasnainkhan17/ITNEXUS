import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { footerCategories } from '../data/mockdata';
import logoUrl from '../assets/itnexus-mark-reversed-256px.png';
import { API_BASE_URL } from '../config';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const [pageContent, setPageContent] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/page-contents`)
            .then(res => res.json())
            .then(data => setPageContent(data))
            .catch(err => console.error('Error fetching footer content:', err));
    }, []);

    // Dynamically update contact info in footer categories if loaded
    const dynamicCategories = footerCategories.map(col => {
        if (col.title === 'Contact Info' && pageContent) {
            return {
                ...col,
                links: [
                    { 
                        label: pageContent.contactEmail || 'info@itnexus.org', 
                        url: `mailto:${pageContent.contactEmail || 'info@itnexus.org'}` 
                    },
                    { 
                        label: pageContent.contactPhone || '+92 (300) 123-4567', 
                        url: `tel:${(pageContent.contactPhone || '+92 (300) 123-4567').replace(/[^+\d]/g, '')}` 
                    },
                    { 
                        label: pageContent.contactAddress || 'Regional Office, PK', 
                        url: '/contact' 
                    }
                ]
            };
        }
        return col;
    });

    return (
        <footer className="bg-slate-50 pt-16 pb-12 w-full mt-auto">
            <div className="px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200/60">

                    {/* Brand Info Column */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="flex items-center">
                            <img src={logoUrl} alt="ITNEXUS" className="h-6 object-contain" />
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Empowering enterprise operations with custom React apps, scalable cloud architectures, and premium UI/UX design.
                        </p>
                    </div>

                    {/* Dynamic Footer Stack Columns */}
                    {dynamicCategories.map((col, idx) => (
                        <div key={idx} className="space-y-4">
                            {/* Category Tag Badge */}
                            <div className="inline-block bg-brand-blue/5 text-brand-blue text-xs font-semibold px-3 py-1 rounded-md tracking-wider uppercase">
                                {col.title}
                            </div>

                            {/* Stacked Links */}
                            <div className="flex flex-col space-y-2.5 pt-1">
                                {col.links.map((link, lIdx) => {
                                    const isExternal = link.url.startsWith('mailto:') || link.url.startsWith('tel:') || link.url.startsWith('http');
                                    
                                    // Determine if this link is a contact channel to render Lucide Icons instead of emojis
                                    let IconComponent = null;
                                    let cleanLabel = link.label;

                                    if (link.url.startsWith('mailto:')) {
                                        IconComponent = Mail;
                                        cleanLabel = cleanLabel.replace('📧 ', '');
                                    } else if (link.url.startsWith('tel:')) {
                                        IconComponent = Phone;
                                        cleanLabel = cleanLabel.replace('📞 ', '');
                                    } else if (col.title === 'Contact Info' && (link.url === '/contact' || cleanLabel.includes('Office') || cleanLabel.includes('📍'))) {
                                        IconComponent = MapPin;
                                        cleanLabel = cleanLabel.replace('📍 ', '');
                                    }

                                    const linkContent = (
                                        <span className="flex items-center gap-2">
                                            {IconComponent && <IconComponent className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />}
                                            <span>{cleanLabel}</span>
                                        </span>
                                    );

                                    return isExternal ? (
                                        <a
                                            key={lIdx}
                                            href={link.url}
                                            className="text-sm text-slate-600 hover:text-brand-blue hover:translate-x-1 transition-all duration-200 block"
                                        >
                                            {linkContent}
                                        </a>
                                    ) : (
                                        <Link
                                            key={lIdx}
                                            to={link.url}
                                            className="text-sm text-slate-600 hover:text-brand-blue hover:translate-x-1 transition-all duration-200 block"
                                        >
                                            {linkContent}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <p>© 2026 ITNEXUS. All rights reserved.</p>
                    <div className="flex gap-6 items-center">
                        <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                        <Link to="/admin/login" className="text-[10px] font-bold tracking-wider text-brand-blue uppercase bg-brand-blue/5 hover:bg-brand-blue/10 px-2 py-0.5 rounded transition-all border border-brand-blue/10 opacity-50">Admin Console</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
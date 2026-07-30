import React from 'react';
import { Link } from 'react-router-dom';
import { footerCategories } from '../data/mockdata';
import logoUrl from '../assets/itnexus-mark-reversed-256px.png';

export default function Footer() {

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
                    {footerCategories.map((col, idx) => (
                        <div key={idx} className="space-y-4">
                            {/* Category Tag Badge */}
                            <div className="inline-block bg-brand-blue/5 text-brand-blue text-xs font-semibold px-3 py-1 rounded-md tracking-wider uppercase">
                                {col.title}
                            </div>

                            {/* Stacked Links */}
                            <div className="flex flex-col space-y-2.5 pt-1">
                                {col.links.map((link, lIdx) => (
                                    <a
                                        key={lIdx}
                                        href={link.url}
                                        className="text-sm text-slate-600 hover:text-brand-blue hover:translate-x-1 transition-all duration-200 block"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <p>© 2026 Next Gen Solutions. All rights reserved.</p>
                    <div className="flex gap-6 items-center">
                        <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                        <Link to="/admin/login" className="text-[10px] font-bold tracking-wider text-brand-blue uppercase bg-brand-blue/5 hover:bg-brand-blue/10 px-2 py-0.5 rounded transition-all border border-brand-blue/10">Admin Console</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
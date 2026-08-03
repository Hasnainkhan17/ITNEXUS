import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoUrl from '../assets/itnexus-mark-reversed-256px.png';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <header className=" fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-0 transition-all duration-300">
            <nav
                className={` transition-all duration-500 ease-in-out flex items-center justify-between w-full ${isScrolled
                    ? 'max-w-3xl bg-transparent md:bg-white/85 md:backdrop-blur-md border-none md:border md:border-slate-200/80 shadow-none md:shadow-lg md:shadow-slate-200/50 rounded-full px-6 py-3 mt-4 mx-4'
                    : 'max-w-[1200px] bg-transparent md:bg-white/80 md:backdrop-blur-md border-none md:border-x md:border-b md:border-slate-200/60 px-6 py-3 md:px-8 md:py-4 rounded-full mt-2'
                    }`}
            >
                {/* Brand Logo */}
                <Link to="/" className="flex items-center">
                    <img src={logoUrl} alt="ITNEXUS" className="h-7 object-contain" />
                </Link>

                {/* Navigation Links */}
                <ul className="hidden md:flex items-center gap-8 text-sm font-bold">
                    <li>
                        <Link
                            to="/"
                            className={`transition-colors ${isActive('/') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about"
                            onMouseEnter={() => import('../pages/About')}
                            onTouchStart={() => import('../pages/About')}
                            className={`transition-colors ${isActive('/about') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/services"
                            onMouseEnter={() => import('../pages/Services')}
                            onTouchStart={() => import('../pages/Services')}
                            className={`transition-colors ${isActive('/services') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}
                        >
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/projects"
                            onMouseEnter={() => import('../pages/Projects')}
                            onTouchStart={() => import('../pages/Projects')}
                            className={`transition-colors ${isActive('/projects') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}
                        >
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/blog"
                            onMouseEnter={() => import('../pages/BlogHub')}
                            onTouchStart={() => import('../pages/BlogHub')}
                            className={`transition-colors ${isActive('/blog') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}
                        >
                            Blog
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/team"
                            onMouseEnter={() => import('../pages/Team')}
                            onTouchStart={() => import('../pages/Team')}
                            className={`transition-colors ${isActive('/team') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}
                        >
                            Team
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contact"
                            onMouseEnter={() => import('../pages/Contact')}
                            onTouchStart={() => import('../pages/Contact')}
                            className={`transition-colors ${isActive('/contact') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>

                {/* CTA Button */}
                <Link
                    to="/contact"
                    className="hidden md:inline-block bg-brand-navy hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-slate-200 transition-all hover:scale-105 active:scale-95"
                >
                    Get Started
                </Link>

                {/* Mobile Hamburger Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex md:hidden text-brand-navy focus:outline-none p-2.5 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-full shadow-md hover:bg-white transition-all hover:scale-105 active:scale-95"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="w-[calc(100%-2rem)] max-w-lg mt-2 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl p-6 md:hidden transition-all duration-300 animate-in fade-in slide-in-from-top-5">
                    <ul className="flex flex-col gap-3 text-sm font-bold text-center">
                        <li>
                            <Link to="/" onClick={() => setIsOpen(false)} className={`block py-2 transition-colors ${isActive('/') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={() => setIsOpen(false)} onTouchStart={() => import('../pages/About')} className={`block py-2 transition-colors ${isActive('/about') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/services" onClick={() => setIsOpen(false)} onTouchStart={() => import('../pages/Services')} className={`block py-2 transition-colors ${isActive('/services') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}>
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/projects" onClick={() => setIsOpen(false)} onTouchStart={() => import('../pages/Projects')} className={`block py-2 transition-colors ${isActive('/projects') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}>
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link to="/blog" onClick={() => setIsOpen(false)} onTouchStart={() => import('../pages/BlogHub')} className={`block py-2 transition-colors ${isActive('/blog') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}>
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link to="/team" onClick={() => setIsOpen(false)} onTouchStart={() => import('../pages/Team')} className={`block py-2 transition-colors ${isActive('/team') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}>
                                Team
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={() => setIsOpen(false)} onTouchStart={() => import('../pages/Contact')} className={`block py-2 transition-colors ${isActive('/contact') ? 'text-brand-blue' : 'text-brand-slate hover:text-brand-navy'}`}>
                                Contact
                            </Link>
                        </li>
                        <li className="pt-2 border-t border-slate-100">
                            <Link
                                to="/contact"
                                onClick={() => setIsOpen(false)}
                                className="block bg-brand-navy hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md"
                            >
                                Get Started
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
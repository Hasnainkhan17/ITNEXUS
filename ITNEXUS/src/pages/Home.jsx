import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Palette, Cloud, Smartphone, Briefcase, Users, Phone } from 'lucide-react';
import logoReversed from '../assets/itnexus-logo-horizontal-reversed@2x.png';
import heroBg from '../assets/hero.png';
import { API_BASE_URL } from '../config';
import { resolveAssetUrl } from '../utils/assetLoader';
import LinkedinIcon from '../components/LinkedinIcon';

import useSeo from '../utils/useSeo';

// Map icon strings to Lucide icon components
const iconMap = {
  Code: Code,
  Palette: Palette,
  Cloud: Cloud,
  Smartphone: Smartphone
};

export default function Home() {
  useSeo({
    title: 'Home',
    description: 'ITNEXUS builds custom React apps, scalable cloud architectures, premium UI/UX, and robust systems for next generation businesses.'
  });

  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    // Fetch featured projects
    fetch(`${API_BASE_URL}/projects?featured=true`)
      .then(res => res.json())
      .then(data => setFeaturedProjects(data))
      .catch(err => console.error('Error fetching projects:', err));

    // Fetch active team members
    fetch(`${API_BASE_URL}/team`)
      .then(res => res.json())
      .then(data => setTeam(data.slice(0, 3)))
      .catch(err => console.error('Error fetching team:', err));

    // Fetch active clients
    fetch(`${API_BASE_URL}/clients`)
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error('Error fetching clients:', err));

    // Fetch active services
    fetch(`${API_BASE_URL}/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Error fetching services:', err));

    // Fetch page contents settings
    fetch(`${API_BASE_URL}/page-contents`)
      .then(res => res.json())
      .then(data => setPageContent(data))
      .catch(err => console.error('Error fetching page contents:', err));
  }, []);

  const resolveHeroBg = (imageName) => {
    if (!imageName || imageName === 'hero.png') return heroBg;
    return resolveAssetUrl(imageName);
  };

  // Fade-in animation parameters
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full">
      {/* 1. HERO SECTION WITH FULL BACKGROUND */}
      <section
        id="home"
        className="w-screen min-h-screen md:h-screen  relative left-1/2 right-1/2 -translate-x-1/2 pt-36 pb-20 md:pt-48 md:pb-32 px-6 lg:px-12 border-b border-slate-200/60 overflow-hidden bg-slate-950 flex items-center justify-center "
        style={{
          backgroundImage: `url(${resolveHeroBg(pageContent?.homeHeroBgImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Backdrop overlay for maximum contrast */}
        <div className="absolute inset-0 bg-slate-950/60 z-0" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 pt-10">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-sans"
          >
            {pageContent?.homeHeroHeading || "We Build Dynamic Software for Next Generation Businesses"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto"
          >
            {pageContent?.homeHeroParagraph || "ITNEXUS delivers custom React apps, scalable cloud architectures, premium UI/UX, and robust system engineering to power global digital transformations."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <Link
              to="/services"
              className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-brand-blue/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              Our Services
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-full border border-white/20 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              Contact Us
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 2. ABOUT US OVERVIEW */}
      <section id="about-overview" className="py-24 px-6 lg:px-12 border-b border-slate-200/60 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-cyan font-mono bg-cyan-50 text-cyan-700 px-3 py-1 rounded inline-block">
              About ITNEXUS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy leading-snug">
              {pageContent?.homeAboutHeading || "Delivering high-profile digital experiences with absolute precision engineering."}
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              {pageContent?.homeAboutParagraph || "At ITNEXUS, we bridge the gap between complex software architecture and outstanding user experiences. Our core capabilities span across custom web apps, Cloud infrastructure engineering, and intuitive design system creations. We operate with a mission to empower businesses with high-performance, secure, and scalable solutions that drive measurable success."}
            </p>
            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all duration-200 group text-sm"
              >
                Learn More About Our Team & Values
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative border border-slate-200/60 p-6 rounded-3xl bg-slate-50/50 shadow-inner overflow-hidden">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-3xl font-black text-brand-blue mb-1">
                    {pageContent?.homeStatsCountries || "5+"}
                  </div>
                  <div className="text-xs font-semibold text-brand-slate uppercase tracking-wider">Countries Served</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-3xl font-black text-brand-cyan mb-1">
                    {pageContent?.homeStatsProjects || "50+"}
                  </div>
                  <div className="text-xs font-semibold text-brand-slate uppercase tracking-wider">Projects Shipped</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-2">
                  <div className="text-3xl font-black text-brand-navy mb-1">
                    {pageContent?.homeStatsPrecision || "100%"}
                  </div>
                  <div className="text-xs font-semibold text-brand-slate uppercase tracking-wider">Precision Engineered Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES HIGHLIGHTS */}
      <section id="services-highlights" className="py-24 px-6 lg:px-12 border-b border-slate-200/60 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded inline-block mb-3">
            Our Solutions
          </div>
          <h2 className="text-3xl font-extrabold text-brand-navy">Key IT Services & Offerings</h2>
          <p className="text-brand-slate mt-2">Tailored engineering built to support high-scale operations.</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Code;
            return (
              <motion.div
                key={service._id}
                variants={fadeInUp}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center font-bold text-xl mb-4 border border-brand-blue/5">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy mb-2">{service.title}</h3>
                  <p className="text-brand-slate text-sm leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <Link
                    to="/services"
                    className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1 group"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 4. OUR CLIENTS & PARTNERS */}
      <section id="clients" className="py-16 px-6 lg:px-12 border-b border-slate-200/60 bg-slate-50/30 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-bold tracking-wider text-brand-slate/60 uppercase mb-8 font-mono">
            Trusted by Teams Worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {clients.map((client) => (
              <img
                key={client._id}
                src={resolveAssetUrl(client.logoUrl)}
                alt={client.clientName}
                title={client.clientName}
                className="h-7 object-contain max-w-[120px]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO & FEATURED PROJECTS */}
      <section id="portfolio-featured" className="py-24 px-6 lg:px-12 border-b border-slate-200/60 bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded inline-block mb-3">
              Case Studies
            </div>
            <h2 className="text-3xl font-extrabold text-brand-navy">Featured Projects</h2>
            <p className="text-brand-slate mt-2">A handpicked selection of our top engineering work.</p>
          </div>
          <div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-brand-navy hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-md shadow-brand-navy/10"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <motion.div
              key={project._id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
            >
              <div className="relative overflow-hidden aspect-video bg-slate-100">
                <img
                  src={resolveAssetUrl(project.thumbnailUrl)}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200/50 text-[10px] font-bold font-mono tracking-wider text-brand-blue uppercase px-2.5 py-1 rounded-md">
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
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={`/projects`}
                    className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1 group/btn"
                  >
                    Read Full Case Study
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. OUR TEAM */}
      <section id="team-overview" className="py-24 px-6 lg:px-12 bg-slate-50/30 border-b border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-blue font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded inline-block mb-3">
              Experts
            </div>
            <h2 className="text-3xl font-extrabold text-brand-navy">Meet The Architects</h2>
            <p className="text-brand-slate mt-2">The skilled engineers and designers shaping ITNEXUS.</p>
          </div>
          <div>
            <Link
              to="/team"
              className="inline-flex bg-brand-navy text-white items-center gap-2  hover:bg-brand-navy/90 font-semibold px-6 py-3 rounded-full border border-slate-200 shadow-sm transition-all text-sm"
            >
              Meet Full Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-center flex flex-col justify-between h-full overflow-hidden">
              <div>
                <div className="w-full h-50 bg-slate-100 relative overflow-hidden">
                  <img
                    src={resolveAssetUrl(member.imageUrl)}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 pb-2">
                  <h3 className="text-lg font-bold text-brand-navy mb-1">{member.name}</h3>
                  <p className="text-xs font-semibold text-brand-blue mb-3 tracking-wider uppercase">{member.role}</p>
                  <p className="text-xs text-brand-slate leading-relaxed font-body max-w-xs mx-auto">
                    {member.shortBio}
                  </p>
                </div>
              </div>
              {member.linkedinUrl && (
                <div className="pb-6 pt-2">
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-full bg-slate-50 border border-slate-200 text-brand-slate hover:text-brand-blue transition-colors mx-auto"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  // Home Page Settings
  homeHeroBgImage: { type: String, default: 'hero.png' },
  homeHeroHeading: { type: String, default: 'We Build Dynamic Software for Next Generation Businesses' },
  homeHeroParagraph: { type: String, default: 'ITNEXUS delivers custom React apps, scalable cloud architectures, premium UI/UX, and robust system engineering to power global digital transformations.' },
  
  homeAboutHeading: { type: String, default: 'Delivering high-profile digital experiences with absolute precision engineering.' },
  homeAboutParagraph: { type: String, default: 'At ITNEXUS, we bridge the gap between complex software architecture and outstanding user experiences. Our core capabilities span across custom web apps, Cloud infrastructure engineering, and intuitive design system creations. We operate with a mission to empower businesses with high-performance, secure, and scalable solutions that drive measurable success.' },
  
  homeStatsCountries: { type: String, default: '5+' },
  homeStatsProjects: { type: String, default: '50+' },
  homeStatsPrecision: { type: String, default: '100%' },
  
  // About Page Settings
  aboutHeroHeading: { type: String, default: 'Our Mission & Core Capability' },
  aboutHeroParagraph: { type: String, default: 'ITNEXUS is an elite team of full-stack engineers, cloud architects, and UI/UX designers specialized in building high-throughput systems and dynamic corporate applications.' },
  
  aboutNarrativeHeading: { type: String, default: 'Crafting premium solutions for global digital transformations' },
  aboutNarrativeParagraph1: { type: String, default: 'Founded in 2021, ITNEXUS emerged from a simple observation: mid-to-large scale businesses often struggle with fragmented technologies that stall deployment speeds and compromise data security.' },
  aboutNarrativeParagraph2: { type: String, default: 'Our engineering philosophy is rooted in modularity and performance. By unifying database systems, serverless Cloud architecture, and beautiful responsive interfaces under standard design systems, we help our clients deploy features faster and operate with maximum security.' },
  
  aboutStatsCountries: { type: String, default: '5+' },
  aboutStatsClients: { type: String, default: '50+' },
  aboutStatsTelemetry: { type: String, default: '24/7/365' },
  
  // About Page Core Values List (Fully Dynamic Array with default seeded items)
  aboutValues: {
    type: [
      {
        icon: { type: String, default: 'Compass' },
        title: { type: String, required: true },
        description: { type: String, required: true }
      }
    ],
    default: [
      {
        icon: "Compass",
        title: "Integrity-Driven Engineering",
        description: "We write clean, documented, and secure code built to withstand audits and long-term scaling challenges."
      },
      {
        icon: "Zap",
        title: "Extreme Performance",
        description: "We optimize load times, telemetry pathways, and databases to deliver sub-second interactions everywhere."
      },
      {
        icon: "Shield",
        title: "Zero-Trust Architecture",
        description: "Security is baked into our foundation, protecting user records, database assets, and APIs from day one."
      },
      {
        icon: "Target",
        title: "Business-First Alignment",
        description: "We don't build technology for technology's sake. Every feature we construct serves a business metric."
      }
    ]
  },
  
  aboutVisionStatement: { type: String, default: '"Software engineering is not about typing code, it\'s about solving enterprise challenges with absolute reliability."' },
  
  // Dynamic Contact Info
  contactEmail: { type: String, default: 'info@itnexus.org' },
  contactPhone: { type: String, default: '+92 (300) 123-4567' },
  contactAddress: { type: String, default: 'ITNEXUS HQ, Software Park, PK' }
}, { timestamps: true });

module.exports = mongoose.model('PageContent', pageContentSchema);

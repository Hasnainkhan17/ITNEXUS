const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Models
const User = require('./models/User');
const Project = require('./models/Project');
const Team = require('./models/Team');
const Client = require('./models/Client');
const Inquiry = require('./models/Inquiry');
const Service = require('./models/Service');
const Blog = require('./models/Blog');

const mockProjects = [
  {
    title: "E-Commerce Cloud Architecture",
    slug: "ecommerce-cloud",
    thumbnailUrl: "itnexus-mark-color-512px.png",
    category: "Cloud & Devops",
    shortDescription: "Scale-ready infrastructure setup for massive retail loads.",
    fullDescription: "Detailed Kubernetes cluster orchestration with automated failovers and autoscaling groups designed to handle massive global transaction traffic peaks without latency degradation.",
    timeline: "3 Months",
    technologies: ["AWS", "Kubernetes", "Docker", "Terraform"],
    projectUrl: "https://quantumflow.itnexus.com",
    isFeaturedOnHome: true,
    displayOrder: 1
  },
  {
    title: "Healthcare Telemetry System",
    slug: "healthcare-telemetry",
    thumbnailUrl: "itnexus-mark-color-512px.png",
    category: "Custom Web App",
    shortDescription: "Realtime heart-rate tracking dashboard.",
    fullDescription: "A high-performance HIPAA-compliant telemetry platform built with Node.js and MongoDB to ingest real-time vital statistics from consumer devices and plot diagnostics on a custom dashboard.",
    timeline: "4 Months",
    technologies: ["React", "Node.js", "MongoDB", "WebSockets"],
    projectUrl: "",
    isFeaturedOnHome: true,
    displayOrder: 2
  },
  {
    title: "Fintech Core Gateway Integration",
    slug: "fintech-gateway",
    thumbnailUrl: "itnexus-mark-color-512px.png",
    category: "Custom Web App",
    shortDescription: "PCI-compliant double-entry ledger platform.",
    fullDescription: "A robust financial API integration connecting legacy banking structures with modern secure gateways, implementing OAuth2, dual-key signatures, and immutable transaction ledgers.",
    timeline: "5 Months",
    technologies: ["React", "Express", "Node.js", "OAuth2", "Cryptography"],
    projectUrl: "https://fintech.itnexus.com",
    isFeaturedOnHome: true,
    displayOrder: 3
  },
  {
    title: "Autonomous Drone Control App",
    slug: "drone-control",
    thumbnailUrl: "itnexus-mark-color-512px.png",
    category: "Mobile App",
    shortDescription: "React Native interface for flight telemetry and routing.",
    fullDescription: "Cross-platform mobile application providing drone pilots with low-latency video streaming, autopilot routing, GPS coordinates plotting, and remote logs submission.",
    timeline: "3 Months",
    technologies: ["React Native", "WebRTC", "Node.js", "Redis"],
    projectUrl: "",
    isFeaturedOnHome: true,
    displayOrder: 4
  },
  {
    title: "Corporate CRM Platform",
    slug: "corporate-crm",
    thumbnailUrl: "itnexus-mark-color-512px.png",
    category: "Custom Web App",
    shortDescription: "Lead workflow pipeline integrations.",
    fullDescription: "An internal management portal automating workflow transitions, task assignments, status tracking, and database querying for sales and operations teams.",
    timeline: "2 Months",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    projectUrl: "",
    isFeaturedOnHome: true,
    displayOrder: 5
  },
  {
    title: "IoT Smart Home Mobile App",
    slug: "smarthome-app",
    thumbnailUrl: "itnexus-mark-color-512px.png",
    category: "Mobile App",
    shortDescription: "Low-latency Bluetooth controls dashboard.",
    fullDescription: "A modern React Native app built to control smart lighting, thermometers, and security nodes. Integrates secure local Bluetooth pairing and WebSocket remote overrides.",
    timeline: "4 Months",
    technologies: ["React Native", "Bluetooth LE", "WebSockets"],
    projectUrl: "",
    isFeaturedOnHome: true,
    displayOrder: 6
  },
  {
    title: "AI Logistics Route Optimizer",
    slug: "ai-logistics",
    thumbnailUrl: "itnexus-mark-color-512px.png",
    category: "Cloud & Devops",
    shortDescription: "Real-time dispatch system.",
    fullDescription: "A heavy-lifting pathfinding service integrating OpenStreetMap with custom heuristics to recalculate dispatch schedules and routes dynamically based on real-time traffic updates.",
    timeline: "6 Months",
    technologies: ["Node.js", "Python", "Docker", "AWS Lambda"],
    projectUrl: "",
    isFeaturedOnHome: false,
    displayOrder: 7
  }
];

const mockClients = [
  { clientName: "QuantumLabs", logoUrl: "itnexus-mark-color-512px.png", displayOrder: 1 },
  { clientName: "AeroDynamics", logoUrl: "itnexus-mark-color-512px.png", displayOrder: 2 },
  { clientName: "ApexGlobal", logoUrl: "itnexus-mark-color-512px.png", displayOrder: 3 },
  { clientName: "BioNexus", logoUrl: "itnexus-mark-color-512px.png", displayOrder: 4 }
];

const mockTeam = [
  {
    name: "Sarah Jenkins",
    role: "Principal Cloud Engineer",
    imageUrl: "itnexus-mark-color-512px.png",
    shortBio: "Over 10 years building Kubernetes pipelines for high-traffic apps.", // 66 chars
    fullBio: "Sarah leads our DevOps pipelines. She specializes in AWS Cloud infrastructure, Docker deployments, CI/CD integrations, and robust database backups.",
    linkedinUrl: "https://linkedin.com/in/sarah-jenkins-devops",
    displayOrder: 1,
    isActive: true
  },
  {
    name: "Marcus Chen",
    role: "Lead Systems Architect",
    imageUrl: "itnexus-mark-color-512px.png",
    shortBio: "Specialist in database normalization, secure JWT APIs, and Node.js.", // 69 chars
    fullBio: "Marcus is responsible for system architectures. He coordinates MERN integrations, designs RESTful endpoints, and coordinates data schemas.",
    linkedinUrl: "https://linkedin.com/in/marcus-chen-arch",
    displayOrder: 2,
    isActive: true
  },
  {
    name: "Elena Rostova",
    role: "Director of UX Design",
    imageUrl: "itnexus-mark-color-512px.png",
    shortBio: "Crafting beautiful Figma mockups and fluid Framer Motion details.", // 67 chars
    fullBio: "Elena brings interface wireframes to life. She focuses on clean grids, user telemetry graphs, brand guidelines, and micro-interactions.",
    linkedinUrl: "https://linkedin.com/in/elena-rostova-ux",
    displayOrder: 3,
    isActive: true
  }
];

const mockServices = [
  {
    title: "Custom Web Application",
    description: "Tailored React & cloud solutions engineered for high performance, security, and scalability.",
    icon: "Code",
    displayOrder: 1,
    technologies: ["React", "Vite", "Node.js", "Express", "MongoDB", "Redux", "Tailwind CSS"],
    deliverables: [
      "Single-Page & Server-Side Rendered Hybrid Architectures",
      "High-performance telemetry pipelines with custom dashboards",
      "JWT and OAuth2.0 secure session management systems",
      "RESTful API & GraphQL query service construction"
    ]
  },
  {
    title: "UI/UX & Brand Design",
    description: "Crafting modern, light-aesthetic interfaces and memorable brand experiences that captivate users.",
    icon: "Palette",
    displayOrder: 2,
    technologies: ["Figma", "Tailwind CSS", "Framer Motion", "Adobe CC", "Storybook"],
    deliverables: [
      "Rigorous design system documentation (color palettes, font scales)",
      "Premium micro-interactions & fluid page animations",
      "Full WCAG 2.1 Accessibility compliance auditing",
      "Responsive cross-platform prototypes and wireframes"
    ]
  },
  {
    title: "Cloud & DevOps Architecture",
    description: "Automated deployment pipelines, microservices architecture, and 99.9% uptime infrastructure.",
    icon: "Cloud",
    displayOrder: 3,
    technologies: ["Docker", "AWS", "Nginx", "GitHub Actions", "Redis", "PM2"],
    deliverables: [
      "Automated CI/CD deployment pipelines (actions, hooks)",
      "Microservices cluster containerization and load balancing",
      "Database caching strategies using Redis memory layers",
      "SSL/TLS installations, domain DNS routing, security compliance"
    ]
  },
  {
    title: "Mobile App Development",
    description: "Cross-platform iOS & Android mobile apps built with seamless motion and clean modern design.",
    icon: "Smartphone",
    displayOrder: 4,
    technologies: ["React Native", "Expo", "iOS Swift SDK", "Android SDK"],
    deliverables: [
      "Cross-Platform Mobile App Development",
      "Store Submission Assistance",
      "Offline Database Caching Setup",
      "Dynamic Push Notifications Integration"
    ]
  }
];

const mockBlogs = [
  {
    title: "Scaling Express APIs to 100k Requests per Minute",
    slug: "scaling-express-apis",
    type: "Blog",
    category: "Engineering",
    shortDescription: "A deep dive into Node.js clustering, memory tuning, and Redis caching layers.",
    content: "When developing web applications with Node.js, developers often face bottlenecks under heavy concurrent load. By default, Express runs on a single thread. In this article, we outline key architectural optimizations to scale Node.js Express servers. \n\n### 1. Node.js Clustering\nUsing the built-in `cluster` module or PM2 allows you to spawn worker processes matching the number of CPU cores. This enables load sharing across multiple cores.\n\n### 2. Implementing Redis Cache\nCaching database queries for static resources dramatically reduces the database load. Redis memory caches are ideal for quick reads with a 5-minute TTL.\n\n### 3. Connection Pooling\nEnsure your Mongoose configuration sets appropriate connection pool boundaries: `mongoose.connect(uri, { maxPoolSize: 50 })`.",
    author: "Marcus Chen",
    readTime: "6 min read",
    imageUrl: "itnexus-mark-color-512px.png",
    displayOrder: 1
  },
  {
    title: "Building HIPAA Compliant Telemetry Pipelines",
    slug: "hipaa-compliant-telemetry",
    type: "Case Study",
    category: "Security",
    shortDescription: "How we implemented end-to-end encryption and audit trails for a healthcare telemetry dashboard.",
    content: "Our team was tasked with building a telemetry ingestion pipeline for medical devices. To meet HIPAA regulations, all data transit and storage had to be strictly encrypted, and full access logs kept.\n\n### Architectural Approach\n1. **Data in Transit**: Forced TLS 1.3 encryption on all telemetry API endpoints.\n2. **Data at Rest**: Implemented MongoDB Field Level Encryption (FLE) using AWS KMS managed keys.\n3. **Audit Trails**: Created immutable access ledgers matching AWS CloudTrail structures to log every querying credential and IP address.",
    author: "Sarah Jenkins",
    readTime: "8 min read",
    imageUrl: "itnexus-mark-color-512px.png",
    displayOrder: 2
  },
  {
    title: "Migrating to CSS Grid: Architectural Benefits",
    slug: "migrating-to-css-grid",
    type: "Blog",
    category: "UI/UX Design",
    shortDescription: "Why CSS Grid is superior for layouts compared to flexbox, with real-world refactoring benchmarks.",
    content: "CSS Grid layout provides two-dimensional grid layouts, solving alignment and spacing challenges that Flexbox was never designed for. In this writeup, we demonstrate how refactoring the ITNEXUS grid system to CSS Grid reduced styling codebase weight by 35% while enabling fluid device adjustments.",
    author: "Elena Rostova",
    readTime: "4 min read",
    imageUrl: "itnexus-mark-color-512px.png",
    displayOrder: 3
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/itnexus';
    console.log('Connecting to database for seeding...');
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // Clear existing data
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Team.deleteMany({});
    await Client.deleteMany({});
    await Service.deleteMany({});
    await Blog.deleteMany({});
    console.log('Existing collections cleared.');

    // Seed Admin User
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    console.log(`Seeding Admin User: ${adminUsername}...`);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const newAdmin = new User({
      username: adminUsername,
      password: hashedPassword
    });
    await newAdmin.save();
    console.log('Admin User seeded successfully.');

    // Seed Projects
    console.log('Seeding projects...');
    await Project.insertMany(mockProjects);
    console.log(`${mockProjects.length} Projects seeded successfully.`);

    // Seed Clients
    console.log('Seeding clients...');
    await Client.insertMany(mockClients);
    console.log(`${mockClients.length} Clients seeded successfully.`);

    // Seed Team
    console.log('Seeding team members...');
    await Team.insertMany(mockTeam);
    console.log(`${mockTeam.length} Team profiles seeded successfully.`);

    // Seed Services
    console.log('Seeding services...');
    await Service.insertMany(mockServices);
    console.log(`${mockServices.length} Services seeded successfully.`);

    // Seed Blogs
    console.log('Seeding blogs...');
    await Blog.insertMany(mockBlogs);
    console.log(`${mockBlogs.length} Blogs seeded successfully.`);

    console.log('--- SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();

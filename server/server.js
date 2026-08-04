// Trigger Hostinger Passenger restart: 2026-08-04 17:36
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Compress all responses
const compression = require('compression');
app.use(compression());

// Models for homepage-data combined endpoint
const Project = require('./models/Project');
const Team = require('./models/Team');
const Client = require('./models/Client');
const Service = require('./models/Service');
const PageContent = require('./models/PageContent');

// In-memory cache for homepage combined data
let homepageDataCache = null;
let homepageDataCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Helper to clear homepage cache
app.set('clearHomepageCache', () => {
  homepageDataCache = null;
  homepageDataCacheTime = 0;
});

// Middleware to clear homepage data cache on modifications
app.use((req, res, next) => {
  const isWrite = ['POST', 'PUT', 'DELETE'].includes(req.method);
  const isHomepageDataRelated = [
    '/api/projects',
    '/api/team',
    '/api/clients',
    '/api/services',
    '/api/page-contents'
  ].some(route => req.originalUrl.startsWith(route));

  if (isWrite && isHomepageDataRelated) {
    const clearCache = app.get('clearHomepageCache');
    if (typeof clearCache === 'function') {
      clearCache();
    }
  }
  next();
});

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., same-origin, mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production since frontend is same domain
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes declarations
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/team', require('./routes/team'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/services', require('./routes/services'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/page-contents', require('./routes/pageContents'));

// Combined endpoint for homepage data
app.get('/api/homepage-data', async (req, res) => {
  try {
    const now = Date.now();
    if (homepageDataCache && (now - homepageDataCacheTime < CACHE_TTL)) {
      return res.json(homepageDataCache);
    }

    // Fetch all homepage components in parallel
    const [projects, rawTeam, clients, services, pageContent] = await Promise.all([
      Project.find({ isFeaturedOnHome: true }).sort({ displayOrder: 1, createdAt: -1 }).limit(6),
      Team.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }),
      Client.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }),
      Service.find().sort({ displayOrder: 1, createdAt: 1 }),
      PageContent.findOne().select('homeHeroBgImage homeHeroHeading homeHeroParagraph homeAboutHeading homeAboutParagraph homeStatsCountries homeStatsProjects homeStatsPrecision homeServicesSubheading homeServicesHeading homeProjectsSubheading homeProjectsHeading homeTeamSubheading homeTeamHeading homeClientsSubheading homeClientsHeading homeCtaHeading homeCtaSubheading homeCtaButtonText')
    ]);

    const team = rawTeam.map(member => {
      const obj = member.toObject ? member.toObject() : { ...member };
      if (obj.imageUrl && obj.imageUrl.startsWith('data:')) {
        obj.imageUrl = `/api/team/${obj._id}/image`;
      }
      return obj;
    });

    let finalPageContent = pageContent;
    if (!finalPageContent) {
      finalPageContent = new PageContent({});
      await finalPageContent.save();
    }

    homepageDataCache = {
      projects,
      team,
      clients,
      services,
      pageContent: finalPageContent
    };
    homepageDataCacheTime = now;

    res.json(homepageDataCache);
  } catch (err) {
    console.error('Error fetching homepage combined data:', err.message);
    res.status(500).send('Server Error');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'ITNEXUS API is healthy',
    smtpConfigured: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS),
    emailUser: process.env.EMAIL_USER || 'Not set',
    envLoadedKeys: Object.keys(process.env).filter(k => k.includes('EMAIL') || k.includes('MONGO') || k.includes('JWT'))
  });
});

// Return JSON 404 for unknown /api/* routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Serve the built React frontend in production
const fs = require('fs');

// Check all candidate locations for static build output
const candidatePaths = [
  path.join(__dirname, 'public'),
  path.join(__dirname, '..', 'ITNEXUS', 'dist'),
  path.join(process.cwd(), 'server', 'public'),
  path.join(process.cwd(), 'ITNEXUS', 'dist'),
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'dist'),
];

let frontendBuildPath = candidatePaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || candidatePaths[0];
console.log(`Serving frontend from: ${frontendBuildPath}`);

// Register express.static with static cache controls
app.use(express.static(frontendBuildPath, {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Fallback static serving for other candidate paths if present
candidatePaths.forEach(p => {
  if (p !== frontendBuildPath && fs.existsSync(p)) {
    app.use(express.static(p));
  }
});

// Asset 404 Guard: Return 404 for missing assets instead of serving index.html (prevents MIME type errors)
app.use((req, res, next) => {
  if (req.path.startsWith('/assets/') || req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i)) {
    return res.status(404).send('Asset not found');
  }
  next();
});

// SPA catch-all: any non-API route serves the React app's index.html
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application index.html not found');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

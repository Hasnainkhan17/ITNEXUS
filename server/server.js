// Trigger Hostinger Passenger restart: 2026-07-30
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
    const [projects, team, clients, services, pageContent] = await Promise.all([
      Project.find({ isFeaturedOnHome: true }).sort({ displayOrder: 1, createdAt: -1 }).limit(6),
      Team.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }),
      Client.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }),
      Service.find().sort({ displayOrder: 1, createdAt: 1 }),
      PageContent.findOne()
    ]);

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
const publicPath = path.join(__dirname, 'public');
const fallbackPath = path.join(__dirname, '..', 'ITNEXUS', 'dist');

let frontendBuildPath;
if (fs.existsSync(path.join(publicPath, 'index.html'))) {
  frontendBuildPath = publicPath;
} else {
  frontendBuildPath = fallbackPath;
}
console.log(`Serving frontend from: ${frontendBuildPath}`);

app.use(express.static(frontendBuildPath));

// SPA catch-all: any non-API route serves the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

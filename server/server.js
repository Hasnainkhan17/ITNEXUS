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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ITNEXUS API is healthy' });
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

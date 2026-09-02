require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const corsOptions = require('./config/corsOptions');
const logger = require('./config/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler.middleware');
const { leadLimiter, loginLimiter, generalLimiter } = require('./middleware/rateLimit.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const adminRoutes = require('./routes/admin.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.google-analytics.com', 'https://connect.facebook.net'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://www.google-analytics.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// ─── Sanitization ─────────────────────────────────────────────────────────────
app.use(mongoSanitize());
app.use(xss());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));
}

// ─── General Rate Limiting ────────────────────────────────────────────────────
app.use('/api', generalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;

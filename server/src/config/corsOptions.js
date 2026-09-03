const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.RENDER_EXTERNAL_URL,
  process.env.RENDER_SERVICE_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean);

const normalizeOrigin = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
};

const isOriginAllowed = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  const allowed = new Set(allowedOrigins.map(normalizeOrigin));

  if (allowed.has(normalizedOrigin)) {
    return true;
  }

  try {
    const hostname = new URL(origin).hostname;
    return hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname.endsWith('.onrender.com')
      || hostname.endsWith('.vercel.app')
      || hostname.endsWith('.netlify.app');
  } catch {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;

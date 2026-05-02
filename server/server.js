const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const compression = require('compression');

dotenv.config();
connectDB();

const app = express();

// ✅ Simple in-memory cache
const cache = new Map();

const cacheMiddleware = (duration) => (req, res, next) => {
    // Only GET requests cache karo
    if (req.method !== 'GET') return next();

    const key = req.originalUrl;
    const cached = cache.get(key);

    // Cache hit
    if (cached && Date.now() - cached.timestamp < duration * 1000) {
        console.log(`Cache HIT: ${key}`);
        return res.json(cached.data);
    }

    // Cache miss - store response
    console.log(`Cache MISS: ${key}`);
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        cache.set(key, {
            data,
            timestamp: Date.now()
        });
        return originalJson(data);
    };

    next();
};

app.use(compression());

const corsOptions = {
    origin: [
        'https://corporate-asset-registry.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5000'
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
app.use(express.json());

// ✅ Cache globally available
app.locals.cache = cache;

// ✅ Auth - no cache
app.use('/api/auth', require('./routes/authRoutes'));

// ✅ Cache 60 seconds
app.use('/api/assets',      cacheMiddleware(60), require('./routes/assetRoutes'));
app.use('/api/employees',   cacheMiddleware(60), require('./routes/employeeRoutes'));
app.use('/api/assignments', cacheMiddleware(60), require('./routes/assignmentRoutes'));
app.use('/api/reports',     cacheMiddleware(60), require('./routes/reportRoutes'));

app.get('/', (req, res) => res.send("server is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
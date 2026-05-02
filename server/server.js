const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');   
const cors = require('cors');

dotenv.config();
connectDB();
 
const app = express();

// FIXED CORS
app.use(cors({
  origin: [
    'https://corporate-asset-registry.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle Preflight Requests
app.options('*', cors());

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.get('/', (req, res) => {
    res.send("server is running");
});

app.post('/api/test', async (req, res) => {
    console.log('Test body:', req.body);
    res.json({ received: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
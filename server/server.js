const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');   
const cors = require('cors');

dotenv.config();
connectDB();
 
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes')); // ✅ FIXED
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));


app.get('/', (req, res) => {
    res.send("server is running");
});
// ✅ Temporarily add karo routes se pehle
app.post('/api/test', async (req, res) => {
    console.log('Test body:', req.body);
    res.json({ received: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
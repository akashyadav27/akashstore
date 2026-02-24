const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/database');
require('./models/index');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: '🛒 Welcome to AkashStore API!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log('✅ Database tables synced!');

  app.listen(PORT, () => {
    console.log(`🚀 AkashStore server running on http://localhost:${PORT}`);
  });
};

startServer();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // Logging library
const authRoutes = require('./routes/route');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend during development
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = 5000;

mongoose.connect(MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

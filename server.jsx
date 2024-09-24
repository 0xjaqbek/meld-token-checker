// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./models/User'); // Your Mongoose models

dotenv.config();
const app = express();

// Middleware to handle JSON requests
app.use(express.json());

// API routes (example)
app.post('/api/check-eligibility', async (req, res) => {
  const { userAddress } = req.body;
  // Logic to check eligibility and send a response
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build folder
  app.use(express.static(path.join(__dirname, 'client/build')));

  // The "catchall" handler: for any request that doesn't match API, return the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

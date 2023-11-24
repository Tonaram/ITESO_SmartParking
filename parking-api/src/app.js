const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

// Routes
const parkingStatusRoutes = require('./routes/parkingStatusRoutes');
app.use(parkingStatusRoutes);

module.exports = app;

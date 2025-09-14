const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const db = require('./models');

const authRoutes = require('../routes/authRoutes');
const flightRoutes = require('../routes/flightRoutes');
const aircraftRoutes = require('../routes/aircraftRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const userRoutes = require('../routes/userRoutes');
const analyticsRoutes = require('../routes/analyticsRoutes');
const airportRoutes = require('../routes/airportRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/aircrafts', aircraftRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/airports', airportRoutes);

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('DB connection error:', err));
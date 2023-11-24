const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  status: Number  // 0 = free, 1 = occupied
}, { collection: 'spots' });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

module.exports = ParkingSpot;

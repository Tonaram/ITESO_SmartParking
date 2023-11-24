const mongoose = require('mongoose');

const ParkingLogSchema = new mongoose.Schema({
  status: Number,   // 0 = free, 1 = occupied
  timestamp: { type: Date, default: Date.now }
});

const ParkingLog = mongoose.model('ParkingLog', ParkingLogSchema);

module.exports = ParkingLog;

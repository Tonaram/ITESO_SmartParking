const express = require('express');
const ParkingLog = require('../models/ParkingLog');
const ParkingSpot = require('../models/ParkingSpot');

const router = express.Router();

router.get('/api/parkingstatus', async (req, res) => {
  try {
    const status = await ParkingSpot.findOne();
    res.json({ status: status ? status.status : null });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/totalOccupiedMinutes', async (req, res) => {
  try {
    const date = req.query.date;
    const startOfDay = new Date(date);
    const endOfDay = new Date(new Date(date).setDate(startOfDay.getDate() + 1));

    const logs = await ParkingLog.find({
      timestamp: { $gte: startOfDay, $lt: endOfDay }
    }).sort('timestamp');

    let totalMinutes = 0;
    for (let i = 0; i < logs.length - 1; i++) {
      if (logs[i].status === 1) {
        const diff = (logs[i + 1].timestamp - logs[i].timestamp) / 60000;
        totalMinutes += diff;
      }
    }

    res.json({ minutes: totalMinutes });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/numberOfTimesUsed', async (req, res) => {
  try {
    const date = req.query.date;
    const startOfDay = new Date(date);
    const endOfDay = new Date(new Date(date).setDate(startOfDay.getDate() + 1));

    const logs = await ParkingLog.find({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
      status: 1  // Only counts occupied times
    });

    res.json({ count: logs.length });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

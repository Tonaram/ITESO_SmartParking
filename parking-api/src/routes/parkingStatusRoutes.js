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

// Endpoint to get occupied time chart data
router.get('/api/occupiedTimeChartData', async (req, res) => {
  try {
    const date = req.query.date;
    const startOfDay = new Date(date);
    const endOfDay = new Date(new Date(date).setDate(startOfDay.getDate() + 1));

    const logs = await ParkingLog.find({
      timestamp: { $gte: startOfDay, $lt: endOfDay }
    }).sort('timestamp');

    // Initialize an array with 24 zeros for each hour
    const occupiedMinutesPerHour = Array.from({ length: 24 }, () => 0);

    for (let i = 0; i < logs.length; i++) {
      if (logs[i].status === 1) {
        const start = new Date(logs[i].timestamp);
        let end = (i < logs.length - 1) ? new Date(logs[i + 1].timestamp) : endOfDay;
        
        if (end > endOfDay) end = endOfDay;

        while (start < end) {
          const nextHour = new Date(start).setHours(start.getHours() + 1, 0, 0, 0);
          const endOfHour = new Date(Math.min(nextHour, end));

          const minutes = (endOfHour - start) / 60000;
          occupiedMinutesPerHour[start.getHours()] += minutes;

          start.setTime(nextHour);
        }
      }
    }

    res.json({
      labels: occupiedMinutesPerHour.map((_, i) => `${i}:00`),
      values: occupiedMinutesPerHour
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint to get usage frequency chart data
router.get('/api/usageFrequencyChartData', async (req, res) => {
  try {
    const date = req.query.date;
    const startOfDay = new Date(date);
    const endOfDay = new Date(new Date(date).setDate(startOfDay.getDate() + 1));
    
    const logs = await ParkingLog.find({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
      status: 1 // Only consider times when the spot became occupied
    }).sort('timestamp');

    // Count the number of times the parking spot was used each hour
    const usageCounts = Array.from({ length: 24 }, () => 0); // Initialize an array with 24 zeros
    logs.forEach(log => {
      const hour = log.timestamp.getHours();
      usageCounts[hour]++;
    });

    // Prepare the data for the response
    const chartData = {
      labels: usageCounts.map((_, i) => `${i}:00`), // Create labels for each hour
      values: usageCounts // Number of times used for each hour
    };

    res.json(chartData);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/occupiedTimeWeeklyChartData', async (req, res) => {
  try {
    const date = new Date(req.query.date);
    // Setting to the beginning of the week (assuming Sunday as start of the week)
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const logs = await ParkingLog.find({
      timestamp: { $gte: startOfWeek, $lt: endOfWeek }
    }).sort('timestamp');

    // Initialize an array for each day of the week
    const occupiedMinutesPerDay = Array.from({ length: 7 }, () => 0);

    logs.forEach(log => {
      if (log.status === 1) {
        const start = new Date(log.timestamp);
        let end = (logs[logs.indexOf(log) + 1] && logs[logs.indexOf(log) + 1].status === 0) 
                   ? new Date(logs[logs.indexOf(log) + 1].timestamp) : startOfWeek;

        // Adjust the end time to the end of the week if it exceeds
        if (end > endOfWeek) end = endOfWeek;

        const dayIndex = start.getDay();
        const minutes = (end - start) / 60000;
        occupiedMinutesPerDay[dayIndex] += minutes;
      }
    });

    res.json({
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      values: occupiedMinutesPerDay
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/api/usageFrequencyWeeklyChartData', async (req, res) => {
  try {
    const date = new Date(req.query.date);
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const logs = await ParkingLog.find({
      timestamp: { $gte: startOfWeek, $lt: endOfWeek },
      status: 1 // Only consider times when the spot became occupied
    }).sort('timestamp');

    // Initialize an array for each day of the week
    const usageCountsPerDay = Array.from({ length: 7 }, () => 0);

    logs.forEach(log => {
      const dayIndex = log.timestamp.getDay();
      usageCountsPerDay[dayIndex]++;
    });

    res.json({
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      values: usageCountsPerDay
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

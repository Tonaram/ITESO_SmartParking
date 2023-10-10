// Required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());  // Middleware to parse JSON requests

// MongoDB Connection
const uri = "mongodb+srv://usuario:usuario@cluster0.rktz7rc.mongodb.net/parkingData?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('Error connecting to MongoDB Atlas', err));

// Setting up MQTT client
const client = mqtt.connect('mqtt://test.mosquitto.org');
const TOPIC = 'topico_mqtt';

// Mongoose model for parking spot status
const ParkingSpot = mongoose.model('ParkingSpot', {
  status: Number  // 0 = free, 1 = occupied
}, 'spots');

// Mongoose model for parking spot logs
const ParkingLogSchema = new mongoose.Schema({
  status: Number,   // 0 = free, 1 = occupied
  timestamp: { type: Date, default: Date.now }  // Auto-set current date and time.
});
const ParkingLog = mongoose.model('ParkingLog', ParkingLogSchema);

let lastStatus = null;

// MQTT event handlers
client.on('connect', () => {
  client.subscribe(TOPIC, (err) => {
    if (err) console.log(err);
  });
});

client.on('message', async (topic, message) => {
  if (topic === TOPIC) {
    try {
      const newStatus = parseInt(message.toString());

      // Only update if the status has changed
      if (newStatus !== lastStatus) { 
        lastStatus = newStatus;

        // Update parking spot status
        await ParkingSpot.findOneAndUpdate({}, { status: newStatus }, { upsert: true, new: true });

        // Log the status change
        const log = new ParkingLog({ status: newStatus });
        await log.save();
      }
    } catch (err) {
      console.log(err);
    }
  }
});

// API Endpoints
app.get('/api/parkingstatus', async (req, res) => {
  try {
    const status = await ParkingSpot.findOne();
    res.json({ status: status ? status.status : null });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/totalOccupiedMinutes', async (req, res) => {
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

app.get('/api/numberOfTimesUsed', async (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

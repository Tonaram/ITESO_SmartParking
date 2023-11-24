const mqtt = require('mqtt');
const ParkingSpot = require('../models/ParkingSpot');
const ParkingLog = require('../models/ParkingLog');

const client = mqtt.connect(process.env.MQTT_URL);

let lastStatus = null;
let occupiedCounter = 0;

client.on('connect', () => {
  client.subscribe(process.env.TOPIC, (err) => {
    if (err) console.error(err);
  });
});

client.on('message', async (topic, message) => {
  if (topic === process.env.TOPIC) {
    try {
      const newStatus = parseInt(message.toString());

      if (newStatus === 1) { // If the signal is "occupied"
        occupiedCounter++;
      } else { // If the signal is "free"
        occupiedCounter = 0;
      }

      // Only update if the status has changed and "occupied" signal received 3 times consecutively
      if (newStatus !== lastStatus && (newStatus === 0 || (newStatus === 1 && occupiedCounter >= 3))) {
        lastStatus = newStatus;

        // Reset counter after updating
        if (newStatus === 1 && occupiedCounter >= 3) {
          occupiedCounter = 0;
        }

        // Update parking spot status
        await ParkingSpot.findOneAndUpdate({}, { status: newStatus }, { upsert: true, new: true });

        // Log the status change
        const log = new ParkingLog({ status: newStatus });
        await log.save();
      }
    } catch (err) {
      console.error(err);
    }
  }
});

module.exports = client;

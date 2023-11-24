const app = require('./src/app');
const connectDB = require('./src/db/mongoose');
require('./src/mqtt/mqttClient'); // Initializes MQTT client

connectDB(); // Connect to the database

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

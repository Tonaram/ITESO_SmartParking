# Parking API

Parking API is an Express-based server application that provides endpoints for retrieving parking spot status and related statistics. It integrates with MongoDB for data storage and MQTT for real-time data updates from parking sensors. The project is structured to separate concerns such as database connections, models, routes, and MQTT handling into their respective modules. [Demostration of the API & UI](https://youtu.be/EiegnvespuY?si=eeuxtka-xzhi2wBN)

## Directory Structure

```
parking-api/
│
├─ node_modules/                 # Node.js modules and dependencies
├─ public/                       # Public directory containing UI files
├─ src/                          # Source code for the application
│  ├─ db/                        # Database connection and configurations
│  ├─ models/                    # Mongoose models for MongoDB documents
│  ├─ mqtt/                      # MQTT client setup and event handlers
│  ├─ routes/                    # Express route definitions
│  └─ app.js                     # Express app setup and middleware
├─ .env                          # Environment variables (will hide when deploy)
├─ package.json                  # Contains package info and dependencies list
├─ package-lock.json             # Dependency lock file
├─ README.md                     # Project README
└─ server.js                     # Entry point to the application
```

## Prerequisites

- Node.js
- MongoDB Atlas account (or local MongoDB setup)
- MQTT broker (In this example, we used Mosquitto)

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Tonaram/ITESO_SmartParking
```

2. Navigate to the api directory:
```bash
cd parking-api
```

3. Install the required dependencies:
```bash
npm install
```
4. Create a `.env` file in the root of the project and populate it with your environment-specific variables.

## Usage

To start the server, run:

```bash
npm start
```

For development purposes, you might want to use `nodemon` to automatically restart the server on code changes. It can be started with:

```bash
npm run dev
```

## API Endpoints

- **GET** `/api/parkingstatus`: Retrieves the current parking spot status.
  
- **GET** `/api/totalOccupiedMinutes?date=YYYY-MM-DD`: Retrieves the total occupied minutes of the parking spot for the given date.

- **GET** `/api/numberOfTimesUsed?date=YYYY-MM-DD`: Retrieves the number of times the parking spot was occupied during the given date.

## Dependencies

The project uses the following dependencies:

- `express` - Web server framework
- `mongoose` - ODM for MongoDB
- `body-parser` - Middleware to parse incoming request bodies
- `cors` - Middleware to enable CORS
- `mqtt` - MQTT client library for Node.js
- `dotenv` - Loads environment variables from `.env` file
- `nodemon` - Utility to automatically restart Node.js applications during development

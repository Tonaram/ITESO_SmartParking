# Parking API

Parking API is an Express-based server application that provides endpoints for retrieving parking spot status and related statistics. It integrates with MongoDB for data storage and MQTT for real-time data updates from parking sensors. [Demostration of the API & UI](https://youtu.be/EiegnvespuY?si=eeuxtka-xzhi2wBN)

## Directory Structure

```
parking-api/
│
├─ node_modules/        # Node.js modules and dependencies
│
├─ public/              # Public directory containing UI files
│  ├─ ...               # UI related files go here
│
├─ package.json         # Contains package info and dependencies list
│
└─ server.js            # Main server codebase
```

## Prerequisites

- Node.js
- MongoDB Atlas account (or local MongoDB setup)
- MQTT broker (In this example, we used Mosquitto)

## Installation & Setup

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Navigate to the api directory:
```bash
cd parking-api
```

3. Install the required dependencies:
```bash
npm install
```

## Usage

To start the server, simply run:

```bash
node server.js
```

For development purposes, you might want to use `nodemon` to automatically restart the server on code changes:

```bash
npx nodemon server.js
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
- `nodemon` - Utility to automatically restart Node.js applications during development

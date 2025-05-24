const mongoose = require('mongoose');

// Connection string containing username:password and cluster name where /nasa? is the database name
const MONGO_URL = process.env.MONGO_URL
    || 'mongodb+srv://sahilgupta3030:ckUWu3peHrtSu7eV@nasacluster.5heosdf.mongodb.net/nasa?retryWrites=true&w=majority&appName=NasaCluster';

// When the connection is open from MongoDB...
mongoose.connection.once('open', () => {
    console.log('MongoDB connection is open...');
});

// When the connection is closed from MongoDB due to some error...
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

async function connectToMongo() {
    // Connect to MongoDB...
    await mongoose.connect(MONGO_URL);
}

async function disconnectFromMongo() {
    // Disconnect from MongoDB...
    await mongoose.disconnect();
}

module.exports = {
    connectToMongo,
    disconnectFromMongo,
};
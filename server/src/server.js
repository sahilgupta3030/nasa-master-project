const http = require('http');

const app = require('./app');
const { loadsPlanets } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
const { connectToMongo } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await connectToMongo();
    await loadsPlanets();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    });
}

startServer();

const http = require('http');

const app = require('./app');
const { loadsPlanets } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startServer() {
    await loadsPlanets();

    server.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
    });
}

startServer();



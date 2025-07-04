const request = require('supertest');
const app = require('../../app');
const { connectToMongo, disconnectFromMongo } = require('../../services/mongo');
const { loadsPlanets } = require('../../models/planets.model');

describe('Launch API', () => {
    beforeAll(async () => {
        await connectToMongo();
        await loadsPlanets();
    });

    afterAll(async () => {
        await disconnectFromMongo();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    describe('Test POST /launches', () => {
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC Rocket',
            target: 'Kepler-62 f',
            launchDate: 'September 29, 2030',
        }

        const launchDataExcludingDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC Rocket',
            target: 'Kepler-62 f',
        }

        const LaunchDataInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC Rocket',
            target: 'Kepler-62 f',
            launchDate: 'zoot',
        }

        test('It should respond 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toMatchObject(launchDataExcludingDate);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(requestDate).toBe(responseDate);
        });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataExcludingDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing Required Data',
            });
        });

        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(LaunchDataInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid Launch Date',
            });
        });
    });

});

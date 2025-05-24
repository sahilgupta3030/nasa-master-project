const launchesDatabse = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

// let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27,2030'),
    target: 'Kepler-442 b',
    customers: ['Nasa', 'ZeroToMaster'],
    upcoming: true,
    success: true,
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function launchExistsById(launchId) {
    // return launches.has(launchId);
    return await launchesDatabse.findOne({
        flightNumber: launchId,
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabse
        .findOne({})
        .sort('-flightNumber');

    if (!latestLaunch) {
        return 100;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    // return Array.from(launches.values());
    return await launchesDatabse
        .find({}, { '_id': 0, '__v': 0, });
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if (!planet) {
        throw new Error('Target planet is missing from the database.');
    }

    await launchesDatabse.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero To Mastery', 'Nasa'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             flightNumber: latestFlightNumber,
//             customers: ["Zero To Mastery", "NASA"],
//             upcoming: true,
//             success: true,
//         }));
// }

async function abortLaunchById(launchId) {
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;

    const aborted = await launchesDatabse.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.acknowledged && aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    launchExistsById,
    abortLaunchById,
}

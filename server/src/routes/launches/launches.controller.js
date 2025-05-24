const { getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    launchExistsById,
    abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({ error: 'Missing Required Data' });
    }

    const launchDate = new Date(launch.launchDate);
    if (launchDate.toString() === 'Invalid Date' || isNaN(launchDate)) {
        return res.status(400).json({ error: 'Invalid Launch Date' });
    }

    launch.launchDate = launchDate;

    try {
        // addNewLaunch(launch);
        await scheduleNewLaunch(launch);
        return res.status(201).json(launch);
    } catch (err) {
        return res.status(500).json({
            error: err.message || 'Internal Server Error',
        });
    }
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    //If launch doesn't exists
    // const existLaunch = launchExistsById(launchId);
    const existLaunch = await launchExistsById(launchId);
    if (!existLaunch) {
        return res.status(404).json({
            error: "Launch not found..."
        });
    }

    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
        return res.status(400).json({
            error: "Launch not aborted..."
        });
    }
    return res.status(200).json({
        success: aborted,
        message: "Launch aborted successfully..."
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return (
        planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.36 &&
        planet["koi_insol"] < 1.11 &&
        planet["koi_prad"] < 1.6
    );
}

function loadsPlanets() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', "kepler_data.csv"))
            .pipe(
                parse({
                    comment: "#",
                    columns: true,
                })
            )
            .on("data", async (data) => {
                if (isHabitablePlanet(data)) {
                    // this was pushing to the habitablePlanets array locally..
                    // habitablePlanets.push(data);

                    // this will push to the database as documents..
                    // upsert = update + insert
                    savePlanet(data);
                }
            })
            .on("error", (err) => {
                console.error(err);
                reject(err);
            })
            .on("end", async () => {
                // console.log(`${habitablePlanets.length} habitable planets found...`);
                const totalHabitablePlanets = (await getAllPlanets()).length;
                console.log(`${totalHabitablePlanets} habitable planets found...`);

                resolve();
                console.log("done");
            });
    })
}

async function getAllPlanets() {
    return await planets.find({}, {
        '_id': 0, '__v': 0,
    });
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });
    } catch (err) {
        console.error(`Could not save planet: ${err}`);
        return;
    }
}

module.exports = {
    loadsPlanets,
    getAllPlanets,
}

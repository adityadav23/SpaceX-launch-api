const launches = require('./launches.mongo')

let latestFlightNumber = 100;

const launch ={
    flightNumber: 100,
    mission:'Kepler Exploration X',
    rocket:'Explorer IS1',
    launchDate: new Date('December 27,2030'),
    target:'Kepler-442-b',
    customer:['ZTM','NASA'],
    upcoming:true,
    success:true,
}

saveLaunch(launch)



async function getAllLaunches(){
    return await launches.find({},
        {
            '_id':0,
            '__v':0,
        })
}

async function saveLaunch(launch){
    await launches.updateOne({
        flightNumber: launch.flightNumber   
    },
    launch,
    {
        upsert:true,
    })
}

function existsLaunchWithId(launchId){
    return launches.has(launchId)
}

function addNewLaunch(launch){
    latestFlightNumber++

    launches.set(latestFlightNumber, Object.assign(launch,
        {
            success: true,
            upcoming: true,
            customers:['ZTM', 'NASA'],
            flightNumber: latestFlightNumber,
        })
    )

}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId)
    aborted.success = false
    aborted.upcoming = false
    return aborted
}

module.exports = {getAllLaunches,
                    addNewLaunch,
                existsLaunchWithId,
            abortLaunchById}
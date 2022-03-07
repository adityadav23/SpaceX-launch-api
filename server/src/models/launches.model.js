const axios = require('axios')

const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

//default flight number
const DEFAULT_FLIGHT_NUMBER = 100

const launch ={
    flightNumber: 100,
    mission:'Kepler Exploration X',
    rocket:'Explorer IS1',
    launchDate: new Date('December 27,2030'),
    target:'Kepler-442 b',
    customer:['ZTM','NASA'],
    upcoming:true,
    success:true,
}

// saveLaunch(launch)

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function loadLaunchData(){
    console.log('Downloading launch data...')
    const response = await axios.post(SPACEX_API_URL,{
        query:{},
        options:{
            populate:[
                {
                    path:'rocket',
                    select:{
                        name:1
                    }
                },{
                    path:'payloads',
                    select:{
                        'customers':1
                    }
                }
            ]
        }
    })


    const launchDocs = response.data.docs

    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads']
        //getting customers form payloads
        const customers = payloads.flatMap((payload)=>{
            return payload['customers']
        })

     //extracting required launch data from launchDoc   
        const launch = {
            flightNumber:launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers,
        }

        console.log(`${launch.flightNumber}  ${launch.mission}`)
    }

}


async function getAllLaunches(){
    return await launches.find({},
        {
            '_id':0,
            '__v':0,
        })
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if(!planet){
        throw new Error('No matching planet found')
    }

    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber   
    },
    launch,
    {
        upsert:true,
    })
}

async function getLatestFlightNumber(){
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber')

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

async function scheduleNewLaunch(launch){

    const newFlightNumber = await getLatestFlightNumber() + 1
    
    const newLaunch = Object.assign(launch,{
        success: true,
        upcoming: true,
        customers:['ZTM', 'NASA'],
        flightNumber: newFlightNumber
    })

   await saveLaunch(newLaunch)
}

async function existsLaunchWithId(launchId){
    return await launches.findOne({
        flightNumber: launchId,
    })
}



async function abortLaunchById(launchId){
   const aborted = await launches.updateOne({
       flightNumber:launchId,
   },
   {
       success: false,
       upcoming: false,
   })

   return aborted.modifiedCount === 1
}

module.exports = {getAllLaunches,
                  loadLaunchData,  
                scheduleNewLaunch,
                existsLaunchWithId,
                abortLaunchById}
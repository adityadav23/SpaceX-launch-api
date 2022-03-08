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


const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'


async function populateLaunches(){
    console.log('Downloading launch data...')
    const response = await axios.post(SPACEX_API_URL,{
        query:{},
        options:{
            pagination: false,
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
    
    if(response.status !== 200){
        console.log('Problem downloading launch')
        throw new Error('Launch data downloaded failed!')
    }

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

        //populating launches in mongoDb
        await saveLaunch(launch)
    }
}

async function loadLaunchData(){

    //checking if launch data is already downloaded by checking first document values
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
        })
    
    if(firstLaunch){
        console.log('Launch data  already loaded! ')
    }else{
        await populateLaunches()
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
    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if(!planet){
        throw new Error('No matching planet found')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1
    
    const newLaunch = Object.assign(launch,{
        success: true,
        upcoming: true,
        customers:['ZTM', 'NASA'],
        flightNumber: newFlightNumber
    })

   await saveLaunch(newLaunch)
}

//Generic function to find anything in launches
async function findLaunch(filter){
    return await launches.findOne(filter)
}

async function existsLaunchWithId(launchId){
    await findLaunch({
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
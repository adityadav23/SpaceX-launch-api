const {getAllLaunches,
    scheduleNewLaunch,
        existsLaunchWithId,
        abortLaunchById,
     } = require('../../models/launches.model')



async function httpGetAllLaunches(req,res){
   return res.status(200).json(await getAllLaunches())
}

async function httpAddNewLaunch(req,res){
    const launch = req.body
    //validating if every property is provided
    if(!launch.mission || !launch.rocket || !launch.launchDate || 
        !launch.target ){
            return res.status(400).json({
                error: 'Missing required launch property!!'
            })
        }

    //converting string to Date object
    launch.launchDate = new Date(launch.launchDate)
    //validating launchDate
    if(launch.launchDate.toString()=== 'Invalid Date'){
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }

    await scheduleNewLaunch(launch)
    return  res.status(201).json(launch)

}

async function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id)
    const existsLaunch = await existsLaunchWithId(launchId)
    //if launch doesn't exist
    if(!existsLaunch){
        res.status(400).json({
            error: 'Launch not found!!'
        })
    }
    
    //abort launch
    const aborted = await abortLaunchById(launchId)
    //if not able to abort
    if(!aborted){
        res.status(400).json({
            error: 'Launch not aborted!!'
        })
    }
    return res.status(200).json({
        ok: true
    })

}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}
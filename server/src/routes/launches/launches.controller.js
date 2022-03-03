const {getAllLaunches,
        addNewLaunch,
        existsLaunchWithId,
        abortLaunchById,
     } = require('../../models/launches.model')



async function httpGetAllLaunches(req,res){
   return res.status(200).json(await getAllLaunches())
}

function httpAddNewLaunch(req,res){
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
    addNewLaunch(launch)

    return  res.status(201).json(launch)

}

function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id)
    if(!existsLaunchWithId(launchId)){
        return res.status(404).json({
            error:'Launch not found'
        })
    }
    //abort launch
    const aborted = abortLaunchById(launchId)
    return res.status(200).json(aborted)

}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}
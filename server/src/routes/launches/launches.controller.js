const {getAllLaunches,
        addNewLaunch,
     } = require('../../models/launches.model')



function httpGetAllLaunches(req,res){
   return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req,res){
    const launch = req.body
    //validating if every property is provided
    if(!launch.mission || !launch.rocket || !launch.launchDate || 
        !launch.destination ){
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

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
}
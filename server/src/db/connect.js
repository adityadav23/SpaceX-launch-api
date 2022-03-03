const mongoose = require('mongoose')


function connectDb(url){
    return mongoose.connect(url)

}

async function mongoDisconnect(){
    await mongoose.disconnect()
}

module.exports = {
    connectDb,
    mongoDisconnect,
}
require('dotenv').config()
const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')
const {connectDb} = require('../src/db/connect')
const {loadPlanetsData} = require('./models/planets.model')
const {loadLaunchData} = require('./models/launches.model')

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer(){
    await connectDb(process.env.MONGO_URL)
    await loadPlanetsData()
    await loadLaunchData()

    server.listen(PORT, ()=>{
        console.log(`Server is listening on port ${PORT}`)
    })
}

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready!!')
})

mongoose.connection.on('error',(err)=>{
    console.log(err)
})

startServer()

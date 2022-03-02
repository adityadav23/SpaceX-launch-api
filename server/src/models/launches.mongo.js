const mongoose = require('mongoose')
 const launchSchema = new mongoose.Schema({
     flightNumber:{
         type: Number,
         required:true,
     },
     launchDate: {
         type: Date,
         requried: true,
     },
     mission:{
         type: String,
         required: true,
     },
     rocket:{
         type:String,
         required: true,
     },
     target:{
         type:String,
         required:true,
     },
     customers: [String],
     upcoming:{
         type: String,
         required: true,
     },
     success:{
         type: Boolean,
         default:true,
     }

 })

 module.exports = mongoose.model('Launch', launchSchema)
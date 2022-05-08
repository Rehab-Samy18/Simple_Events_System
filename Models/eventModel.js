const mongoose = require("mongoose");

//Create Schema
let eventSchema = new mongoose.Schema({
    _id : Number,
    title : {type:String,required:true},
    eventDate : Date,
    mainSpeaker : {type:mongoose.Types.ObjectId,ref:"speakers"},
    otherSpeakers : [{type:mongoose.Types.ObjectId,ref:"speakers"}],
    students : [{type:Number,ref:"students"}]
})

//Register
module.exports = mongoose.model("events",eventSchema);
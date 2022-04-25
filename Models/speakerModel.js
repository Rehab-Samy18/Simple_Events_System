const mongoose = require("mongoose");

//Create Schema
let speakerSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : String,
    username : String,
    password : String,
    city : String,
    street : String,
    building : String
})

//Register
module.exports = mongoose.model("speakers",speakerSchema);
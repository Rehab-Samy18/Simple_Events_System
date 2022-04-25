const mongoose = require("mongoose");

//Create Schema
let studentSchema = new mongoose.Schema({
    _id : Number,
    email : String,
    password : String
})

//Register
module.exports = mongoose.model("students",studentSchema);
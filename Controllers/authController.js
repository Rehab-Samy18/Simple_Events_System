const jwt = require("jsonwebtoken");
const Student = require("./../Models/studentModel");
const Speaker = require("./../Models/speakerModel");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs")

module.exports.login = (request,response,next) => {
    const { password } = request.body
    let token;
    if(request.body.email=="rehab.samy18@gmail.com"&&request.body.password=="123")
    {
        token = jwt.sign({
            _id : 1,
            email : request.body.email,
            role : "admin"},
            "myNameIsRehab",
            {expiresIn:"1h"}
        ); 
        response.status(200).json({msg:"Admin Login",token})
    }
    else
    {
        Student.findOne({
            email:request.body.email,
        })
        .then(async data => {
            if(data==null)
            {
                await Speaker.findOne({
                    email:request.body.email
                })
                .then(async data=>{
                    if(data==null)
                    {
                        throw new Error("Speaker Not Found");
                    }
                    else
                    {
                        return bcrypt.compare(password, data.password).then(function(result) {
                            console.log(result)
                            if(!result){
                                throw new Error("Speaker Login Not Successful")
                            }
                            else{
                                token = jwt.sign({
                                    _id : data._id,
                                    email : data.email,
                                    role : "speaker"},
                                    "myNameIsRehab",
                                    {expiresIn:"1h"}
                                    );
                                    response.status(200).json({msg:"Speaker Login",token})
                            }
                        })
                    }
                })
                .catch(error=>{
                    next(error);
                })
            }
            else
            {
                return bcrypt.compare(password, data.password).then(function(result) {
                    console.log(result)
                    if(!result){
                        throw new Error("Student Login Not Successful")
                    }
                    else{
                        token = jwt.sign({
                            _id : data._id,
                            email : data.email,
                            role : "student"},
                            "myNameIsRehab",
                            {expiresIn:"1h"}
                            );
                            response.status(200).json({msg:"Student Login Success",token})
                    }
                })
            }
            })
            .catch(error=>{
                next(error);
            })
    }
}

module.exports.studentRegister = async (request,response) => { 
    const {_id, email, password } = request.body
    if(typeof(_id)!="number"||typeof(email)!="string"||typeof(password)!="string"){
        return response.status(400).json({ message: "There is a problem with datatypes" })
    }
    if (password.length < 6) {
        return response.status(400).json({ message: "Password less than 6 characters" })
    }
    bcrypt.hash(password, 10).then(async (hash) => {
        await Student.create({
        _id,
        email,
        password: hash,
        })
        .then((user) =>
        response.status(200).json({
            message: "Student successfully created",
            user
        })
        )
        .catch((err) => 
            response.status(401).json({
            message: "Student not successful created"
        })
        );
    });
};


module.exports.speakerRegister = async (request,response) => { 
    const {email,username,password,city,street,building} = request.body
    if(typeof(email)!="string"||typeof(username)!="string"||typeof(password)!="string"||typeof(city)!="string"||typeof(street)!="string"||typeof(building)!="string"){
        return response.status(400).json({ message: "There is a problem with datatypes" })
    }
    if (password.length < 6) {
        return response.status(400).json({ message: "Password less than 6 characters" })
    }
    bcrypt.hash(password, 10).then(async (hash) => {
        await Speaker.create({
        _id:new mongoose.Types.ObjectId(),
        email,
        username,
        password: hash,
        city,
        street,
        building
        })
        .then((user) =>
        response.status(200).json({
            message: "Speaker successfully created",
            user
        })
        )
        .catch((err) => 
            response.status(401).json({
            message: "Speaker not successful created"
        })
        );
    });
};
const jwt = require("jsonwebtoken");
const Student = require("./../Models/studentModel");
const Speaker = require("./../Models/speakerModel");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs")
const {validationResult} = require("express-validator");

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
        response.status(200).json({msg:"Admin",token})
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
                        //throw new Error("Speaker Not Found");
                        response.send({msg:"Speaker Not Found"});
                    }
                    else
                    {
                        return bcrypt.compare(password, data.password).then(function(result) {
                            console.log(result)
                            if(!result){
                                //throw new Error("Speaker Login Not Successful")
                                response.send({msg:"Speaker Login Not Successful"});
                            }
                            else{
                                token = jwt.sign({
                                    _id : data._id,
                                    email : data.email,
                                    role : "speaker"},
                                    "myNameIsRehab",
                                    {expiresIn:"1h"}
                                    );
                                    response.status(200).json({msg:"Speaker",token})
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
                        //throw new Error("Student Login Not Successful")
                        response.send({msg:"Student Login Not Successful"});
                    }
                    else{
                        token = jwt.sign({
                            _id : data._id,
                            email : data.email,
                            role : "student"},
                            "myNameIsRehab",
                            {expiresIn:"1h"}
                            );
                            response.status(200).json({msg:"Student",token})
                    }
                })
            }
            })
            // .catch(error=>{
            //     next(error);
            // })
    }
}

module.exports.studentRegister = (request,response,next) => { 
    const { password } = request.body
    let result = validationResult(request);
        if(!result.isEmpty())
        {
            let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
            let error = new Error(message);
            error.status = 422;
            throw error;
        }

    bcrypt.hash(password, 10).then(async (hash) => {
        let student = new Student({
            _id : request.body._id,
            email : request.body.email,
            password : hash
        });
        student.save()
        .then((data)=>{
            response.status(201).json({message:"Student Created",data});
        })
        .catch(error=>next(error))
    });
};


module.exports.speakerRegister = async (request,response) => { 
    const {password} = request.body
    let result = validationResult(request);
            if(!result.isEmpty())
            {
                let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
                let error = new Error(message);
                error.status = 422;
                throw error;
            }
    bcrypt.hash(password, 10).then(async (hash) => {
        let speaker = new Speaker({
            _id : new mongoose.Types.ObjectId(),
            email : request.body.email,
            username : request.body.username,
            password : hash,
            city : request.body.city,
            street : request.body.street,
            building : request.body.building
        });
        speaker.save()
        .then((data)=>{
            response.status(201).json({message:"Speaker Created",data});
        })
        .catch(error=>next(error))
    });
};
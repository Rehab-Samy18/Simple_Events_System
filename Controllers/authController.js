const jwt = require("jsonwebtoken");
const Student = require("./../Models/studentModel");
const Speaker = require("./../Models/speakerModel");
module.exports.login = (request,response,next) => {
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
            password:request.body.password
        })
        .then(async data => {
            if(data==null)
            {
                await Speaker.findOne({
                    email:request.body.email,
                    password:request.body.password
                })
                .then(data=>{
                    if(data==null)
                    throw new Error("Username and Password incorrect");

                    token = jwt.sign({
                        _id : data._id,
                        email : data.email,
                        role : "speaker"},
                        "myNameIsRehab",
                        {expiresIn:"1h"}
                        );
                        response.status(200).json({msg:"Speaker Login",token})
                })
                .catch(error=>{
                    next(error);
                })
            }
            
            token = jwt.sign({
                _id : data._id,
                email : data.email,
                role : "student"},
                "myNameIsRehab",
                {expiresIn:"1h"}
                );
                response.status(200).json({msg:"Student Login",token})
            })
            .catch(error=>{
                next(error);
            })
    }
}


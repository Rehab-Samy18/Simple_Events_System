const { ObjectId } = require("bson");
const {validationResult} = require("express-validator");
const Speaker = require("./../Models/speakerModel")

module.exports.getAllSpeakers = (request,response,next) => {
    console.log(request.role);
    if(request.role == "admin")
    {
        Speaker.find({})
        .then((data)=>{
            response.status(200).json(data);
        })
        .catch(error=>next(error))
    }
    else if(request.role == "speaker"){
        Speaker.find({_id:request._id})
        .then((data)=>{
            response.status(200).json(data);
        })
        .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Display Events As You're not an admin or speaker!")
    }
}

module.exports.getSpeakerById = (request,response,next) => {
    if(request.role=="speaker"||request.role=="admin"){ 
    Speaker.findById({_id:request.params._id})
    .then(data=>{
        if(data == null)
        throw new Error("Speaker Not Exist");

        response.status(200).json(data);
    })
    .catch(error=>next(error))
    }
    else{
        response.send({msg:"You can't display speaker's details as you're not neither an admin nor a speaker!"});
    }
}

module.exports.createSpeaker = (request,response,next) => {
    console.log(request.role);
    if(request.role == "speaker")
    {
            let result = validationResult(request);
            if(!result.isEmpty())
            {
                let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
                let error = new Error(message);
                error.status = 422;
                throw error;
            }
    
            let speaker = new Speaker({
                _id : new ObjectId(),
                email : request.body.email,
                username : request.body.username,
                password : request.body.password,
                city : request.body.city,
                street : request.body.street,
                building : request.body.building
            });
            speaker.save()
            .then((data)=>{
                response.status(201).json({message:"Speaker Created",data});
            })
            .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Create Speakers As You're not a speaker!");
    }
}

module.exports.updateSpeaker = (request,response,next) => {
    console.log(request.role);
    if(request.role=="admin"){
        delete request.body.username;
        delete request.body.password;
        Speaker.updateOne({_id : request.params._id},{
            $set: {
                email:request.body.email,
                username:request.body.username,
                password:request.body.password,
                city:request.body.city,
                street:request.body.street,
                building:request.body.building
            }
        })
        .then((data)=>{
            if(data.matchedCount==0)
            throw new Error("Speaker Not Exist");
            response.status(200).json({message:"Speaker Updated",data});
        })
        .catch(error=>next(error))
    }
    else if(request.role=="speaker"){

        Speaker.updateOne({_id : request.params._id},{
            $set: {
                email:request.body.email,
                username:request.body.username,
                password:request.body.password,
                city:request.body.city,
                street:request.body.street,
                building:request.body.building
            }
        })
        .then((data)=>{
            if(data.matchedCount==0)
            throw new Error("Speaker Not Exist");
            response.status(200).json({message:"Speaker Updated",data});
        })
        .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Update Speakers As You're neither a speaker nor an admin!");
    }
}

module.exports.deleteSpeaker = (request,response,next) => {
    if(request.role=="speaker"||request.role=="admin")
    {
        Speaker.deleteOne({_id:request.params})
        .then(data=>{
            if(data.deletedCount==0)
            throw new Error("Speaker Not Exist");
            response.status(200).json({message:"Speaker Deleted",data});
        })
        .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Delete Speakers As You're neither an admin nor a speaker!");
    }
}

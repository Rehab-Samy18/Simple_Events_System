const {validationResult} = require("express-validator");
const Event = require("./../Models/eventModel")

module.exports.getAllEvents = (request,response,next) => {
    console.log(request.role);
    if(request.role=="admin")
    {
        Event.find({}).populate({path:"students"}).populate({path:"mainSpeaker"}).populate({path:"otherSpeakers"})
        .then((data)=>{
            response.status(200).json(data);
        })
        .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Display Events As You're not an admin")
    }
}

module.exports.getEventById = (request,response,next) => {
    if(request.role=="admin"){
        Event.findById({_id:request.params._id})
        .then(data=>{
            if(data == null)
            throw new Error("Event Not Exist");
            response.status(200).json(data);
        })
        .catch(error=>next(error))
    }
    else{
        response.send({msg:"You can't display event's details as you're not an admin!"});
    }
}

module.exports.createEvent = (request,response,next) => {
    console.log(request.role);
    if(request.role=="admin")
    {
    let result = validationResult(request);
    if(!result.isEmpty())
    {
        let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
        let error = new Error(message);
        error.status = 422;
        throw error;
    }

    let event = new Event({
        _id : request.body._id,
        title : request.body.title,
        eventDate : request.body.eventDate,
        mainSpeaker : request.body.mainSpeaker,
        otherSpeakers : request.body.otherSpeakers,
        students : request.body.students
    });

    for (let index = 0; index < event.otherSpeakers.length; index++) {
        if(event.otherSpeakers[index].toString() === event.mainSpeaker.toString())
        {
            throw new Error("Main Speaker Shouldn't talk again")
        }
    }
    event.save()
    .then((data)=>{
        response.status(201).json({message:"Event Created",data});
    })
    .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Create Events As You're not an admin")
    }
}

module.exports.updateEvent = (request,response,next) => {
    console.log(request.role);
    if(request.role=="admin")
    {
    Event.updateOne({_id : request.params._id},{
        $set: {
            title : request.body.title,
            eventDate : request.body.eventDate,
            mainSpeaker : request.body.mainSpeaker,
            otherSpeakers : request.body.otherSpeakers,
            students : request.body.students
        }
    })
    .then((data)=>{
        if(data.matchedCount==0)
        throw new Error("Event Not Exist");
        
        response.status(200).json({message:"Event Updated",data});
    })
    .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Update Events As You're not an admin")
    }
}

module.exports.deleteEvent = (request,response,next) => {
    console.log(request.role);
    if(request.role=="admin")
    {
    Event.deleteOne({_id:request.params})
    .then(data=>{
        if(data.deletedCount==0)
        throw new Error("Event Not Exist");
        response.status(200).json({message:"Event Deleted",data});
    })
    .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Delete Events As You're not an admin")
    }
}
const {validationResult} = require("express-validator");
const Event = require("./../Models/eventModel")
const Speaker = require("./../Models/speakerModel");
const Student = require("./../Models/studentModel");

module.exports.getAllEvents = (request,response,next) => {
    Event.find({}).populate({path:"students"}).populate({path:"mainSpeaker"}).populate({path:"otherSpeakers"})
    .then((data)=>{
        response.status(200).json({data});
    })
    .catch(error=>next(error))
}

module.exports.getEventById = (request,response,next) => {
    Event.findById({_id:request.params.id})
    .then(data=>{
        if(data == null)
        throw new Error("Event Not Exist");
        response.status(200).json({message:"Event By ID",data});
    })
    .catch(error=>next(error))
}

module.exports.createEvent = (request,response,next) => {
    let result = validationResult(request);
    if(!result.isEmpty())
    {
        let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
        let error = new Error(message);
        error.status = 422;
        throw error;
    }

    let event = new Event({
        _id : request.body.id,
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
    // for (let index = 0; index < event.students.length; index++) {
    //     Student.findOne({_id:event.students[index]})
    //     .then(data=>{
    //         if(data == null)
    //         throw new Error("There is a student not exists");
    //     })
    //     .catch(error=>next(error))
    // }

    event.save()
    .then((data)=>{
        response.status(201).json({message:"Event Created",data});
    })
    .catch(error=>next(error))
}

module.exports.updateEvent = (request,response,next) => {
    Event.updateOne({_id : request.body.id},{
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

module.exports.deleteEvent = (request,response,next) => {
    Event.deleteOne({_id:request.body.id})
    .then(data=>{
        if(data.deletedCount==0)
        throw new Error("Event Not Exist");
        response.status(200).json({message:"Event Deleted",data});
    })
    .catch(error=>next(error))
}
const {validationResult} = require("express-validator");
const Student = require("./../Models/studentModel")

module.exports.getAllStudents = (request,response,next) => {
    Student.find({})
    .then((data)=>{
        response.status(200).json({data});
    })
    .catch(error=>next(error))
}

module.exports.getStudentById = (request,response,next) => {
    Student.findById({_id:request.params.id})
    .then(data=>{
        if(data == null)
        throw new Error("Student Not Exist")
        response.status(200).json({message:"Student By ID",data});
    })
    .catch(error=>next(error))
}

module.exports.createStudent = (request,response,next) => {
        let result = validationResult(request);
        if(!result.isEmpty())
        {
            let message = result.array().reduce((current,error)=>current+error.msg+" "," ");
            let error = new Error(message);
            error.status = 422;
            throw error;
        }

        let student = new Student({
            _id : request.body.id,
            email : request.body.email,
            password : request.body.password
        });
        student.save()
        .then((data)=>{
            response.status(201).json({message:"Student Created",data});
        })
        .catch(error=>next(error))
}

module.exports.updateStudent = (request,response,next) => {
    console.log(request.role);
    if(request.role=="admin"){
        delete request.body.password;
        Student.findOneAndUpdate({_id : request.body.id},request.body)
    }
    else if(request.role=="student"){
    Student.updateOne({_id : request.body.id},{
        $set: {
            email:request.body.email,
            password:request.body.password
        }
    })
    .then((data)=>{
        if(data.matchedCount==0)
        throw new Error("Student Not Exist");
        response.status(200).json({message:"Student Updated",data});
    })
    .catch(error=>next(error))
    }
}

module.exports.deleteStudent = (request,response,next) => {
    Student.deleteOne({_id:request.body.id})
    .then(data=>{
        if(data.deletedCount==0)
        throw new Error("Student Not Exist");
        response.status(200).json({message:"Student Deleted",data});
    })
    .catch(error=>next(error))
}
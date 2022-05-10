const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs")
const Student = require("./../Models/studentModel")

module.exports.getAllStudents = (request,response,next) => {
    console.log(request.role);
    if(request.role == "admin")
    {
        Student.find({})
        .then((data)=>{
            response.status(200).json(data);
        })
        .catch(error=>next(error))
    }
    else if(request.role == "student"){
        Student.find({_id:request._id})
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

module.exports.getStudentById = (request,response,next) => {
    if(request.role=="student"||request.role=="admin"){
    Student.findById({_id:request.params._id})
    .then(data=>{
        if(data == null)
        throw new Error("Student Not Exist")
        response.status(200).json(data);
    })
    .catch(error=>next(error))
}
else{
    response.send({msg:"You can't display student's details as you're not a student!"});
}
}
module.exports.createStudent = (request,response,next) => { //Register
    console.log(request.role);
    if(request.role == "student")
    {
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
    else
    {
        throw new Error("You Can't Create Students As You're not a student!");
    }
}

module.exports.updateStudent = (request,response,next) => {
    const { password } = request.body
    console.log(request.role);
        if(request.role=="admin"){
            delete request.body.password;
            Student.updateOne({_id : request.params._id},{
                $set: {
                    email:request.body.email,
                }
            })
            .then((data)=>{
                if(data.matchedCount==0)
                throw new Error("Student Not Exist");
                response.status(200).json({message:"Student Updated",data});
            })
            .catch(error=>next(error))
        }
        else if(request.role=="student"){
        bcrypt.hash(password, 10).then(async (hash) => {

            Student.updateOne({_id : request.params._id},{
                $set: {
                    email:request.body.email,
                    password:hash
                }
            })
            .then((data)=>{
                if(data.matchedCount==0)
                throw new Error("Student Not Exist");
                response.status(200).json({message:"Student Updated",data});
            })
            .catch(error=>next(error))
        }
        )}
        else
        {
            throw new Error("You Can't Update Students As You're neither a student nor an admin!");
        }
    }
    
module.exports.deleteStudent = (request,response,next) => {
    if(request.role=="student"||request.role=="admin")
    {
        Student.deleteOne({_id:request.params})
        .then(data=>{
            if(data.deletedCount==0)
            throw new Error("Student Not Exist");
            response.status(200).json({message:"Student Deleted",data});
        })
        .catch(error=>next(error))
    }
    else
    {
        throw new Error("You Can't Delete Students As You're neither a student nor an admin!");
    }
}
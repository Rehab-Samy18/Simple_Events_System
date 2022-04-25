const express = require("express");
const {body,params,query} = require("express-validator");
const controller = require("./../Controllers/studentController");
const authMW = require("./../MiddleWares/authMiddleWare");
const Student = require("./../Models/studentModel");
const router = express.Router();

router.use(authMW);
//http methods
router.route("/students")
.get(controller.getAllStudents)
.post([
        body("id").isInt().withMessage("id should be int"),
        body("email").isEmail().withMessage("Email Format is wrong").custom(value =>{
          return Student.findOne({
            'email':value
          }).then(std =>{
            if(std !== null){
              return Promise.reject('Email already in use');
            }
          })
        }),
        body("password").isStrongPassword().withMessage("Password is not strong")
      ]
    ,controller.createStudent)
.put(controller.updateStudent)
.delete(controller.deleteStudent)

router.get("/students/:id",controller.getStudentById);

//Sent it to server
module.exports = router;

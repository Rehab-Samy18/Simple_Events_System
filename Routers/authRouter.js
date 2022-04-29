const express = require('express');
const router = express.Router();
const controller = require("./../Controllers/authController");
const Student = require("./../Models/studentModel");
const Speaker = require("./../Models/speakerModel");
const {body,params,query} = require("express-validator");

router.route("/studentregister")
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
],controller.studentRegister)
router.route("/speakerregister")
.post([
    body("email").isEmail().withMessage("Email Format is wrong").custom(value =>{
        return Speaker.findOne({
          email:value
        }).then(sp =>{
          if(sp !== null){
            return Promise.reject('Email already in use');
          }
        })
      }),
      body("password").isStrongPassword().withMessage("Password is not strong"),
      body("city").isAlphanumeric().withMessage("City should be string"),
      body("street").isAlphanumeric().withMessage("Street should be string"),
      body("building").isAlphanumeric().withMessage("Building should be string"),
],controller.speakerRegister)

router.route("/login").post(controller.login)

//router.post("/speakerregister",controller.speakerRegister)

module.exports = router;
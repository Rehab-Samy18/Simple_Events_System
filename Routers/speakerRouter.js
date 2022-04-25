const express = require("express");
const {body,params,query} = require("express-validator");
const controller = require("./../Controllers/speakerController");
const Speaker = require("./../Models/speakerModel");
const router = express.Router();

//http methods
router.route("/speakers")
.get(controller.getAllSpeakers)
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
      ]
    ,controller.createSpeaker)
.put(controller.updateSpeaker)
.delete(controller.deleteSpeaker)

router.get("/speakers/:id",controller.getSpeakerById);

//Sent it to server
module.exports = router;

const express = require("express");
const {body,params,query} = require("express-validator");
const controller = require("./../Controllers/eventController");
const Student = require("./../Models/studentModel");
const Speaker = require("./../Models/speakerModel");
const router = express.Router();
//http methods
router.route("/events")
.get(controller.getAllEvents)
.post([
        body("_id").isInt().withMessage("id should be int"),
        body("students.*").custom(value=>{
        return Student.findOne({
          _id:value
        })
        .then(data=>{
            if(data == null)
            {
              return Promise.reject('There is a student not exist!');
            }
            console.log(data)
          })
        }),
        body("mainSpeaker").custom(value=>{
          return Speaker.findOne({
            _id:value
          })
          .then(data => {
            if(data == null)
            {
              return Promise.reject('Main Speaker not exists');
            }
          })
        }),
        body("otherSpeakers.*").custom(value=>{
          return Speaker.findOne({
            _id:value
          })
          .then(data => {
            if(data == null)
            {
              return Promise.reject('There is a speaker not exist!');
            }
          })
        }),
      ]
    ,controller.createEvent)
//.put(controller.updateEvent)
//.delete(controller.deleteEvent)

router.get("/events/:_id",controller.getEventById);
router.delete("/events/:_id",controller.deleteEvent);
router.put("/events/:_id",controller.updateEvent);
//Sent it to server
module.exports = router;

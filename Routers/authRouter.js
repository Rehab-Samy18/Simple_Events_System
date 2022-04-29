const express = require('express');
const router = express.Router();
const controller = require("./../Controllers/authController");
const studentsController = require("./../Controllers/studentController");

router.post("/studentregister",controller.studentRegister)
router.post("/speakerregister",controller.speakerRegister)
router.post("/login",controller.login)

module.exports = router;
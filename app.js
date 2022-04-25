//Create Express Server
const express = require("express");     
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
//Require Routers
const studentRouter = require("./Routers/studentRouter")
const speakerRouter = require("./Routers/speakerRouter")
const eventRouter = require("./Routers/eventRouter")
const authRouter = require("./Routers/authRouter")
//Open Server
const server = express(); 

mongoose.connect("mongodb://localhost:27017/SimpleEventsSystem")
.then(() => {
    console.log("Database connected");
    //Chooce Server Port
    server.listen(process.env.PORT||8080,()=>{
        console.log("I'm Listenning......");
    });
})
.catch(error=>console.log("Database connection problem"));


//Logger Middleware
server.use((request,response,next)=>{
    console.log(request.url,request.method);
    next();
});

//Use Body Parser
server.use(cors());
server.use(body_parser.json());
server.use(body_parser.urlencoded({extended:false}));



//Routers
server.use(authRouter);
server.use(studentRouter);
server.use(speakerRouter);
server.use(eventRouter);

//Not Found Middleware
server.use((request,response)=>{
    response.status(404).json({message:"Page is not found"});
});

//Error Middleware
server.use((error,request,response,next)=>{
    response.status(500).json({message:error + " "});  //Development time we have to change it in production time
});


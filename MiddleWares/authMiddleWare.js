const jwt = require("jsonwebtoken");

module.exports = (request,response,next) => {
    let token,decodedToken;
    try{
        token = request.get("Authorization").split(" ")[1];
        decodedToken = jwt.verify(token,"myNameIsRehab");
        console.log(decodedToken);
    }
    catch(error){
        next(new Error("Not Authenticated"));
    }
    request.role = decodedToken.role;
    request._id = decodedToken._id;
    next();
}

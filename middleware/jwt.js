const jwt = require("jsonwebtoken");
// require("dotenv").config; //comment in mongoDB topic

// we can use this jwt middleware to protect routers
// example in employees.js
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.header.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); //check authHeader is null or not if not check startWith Bear 
  // console.log("authHeader: ", authHeader); // Bearer Token
  const token = authHeader.split(" ")[1];
  console.log("token: ", token)
  jwt.verify(
    token, 
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
        if(err) return res.sendStatus(401); //Invalid token
        req.user = decoded.UserInfo.username;
        req.roles = decoded.UserInfo.roles;
        next()
    }
  );
};

module.exports = verifyJWT

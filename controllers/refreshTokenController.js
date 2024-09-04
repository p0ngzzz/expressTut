// back part of JWT topic
// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// }; // normally use database => in this case use file.json as database
const User = require('../model/User')

const jwt = require("jsonwebtoken");
// require("dotenv").config; //comment in mongoDB topic

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  console.log("not have access or refresh token");
  throw new Error(
    "Access token secret or refresh token secret is not defined in environment variables"
  );
}

const handleRefreshToken = async (req, res) => {
  // console.log("request: ", req);
  const cookies = req.cookies;
  // console.log("cookies: ", cookies);
  // check have cookies.jwt
  if (!cookies?.jwt) return res.sendStatus(401);
  // console.log("cookies: ", cookies);
  // console.log("cookies.jwt: ", cookies.jwt)

  // assign refreshToken is cookies.jwt
  const refreshToken = cookies.jwt;
  // const foundUser = usersDB.users.find(
  //   (user) => user.refreshToken === refreshToken
  // ); // use json as DB

  const foundUser = await User.findOne({ refreshToken}).exec(); //find and match from User collection for refreshToken
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      //convert to jwt from payload
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };

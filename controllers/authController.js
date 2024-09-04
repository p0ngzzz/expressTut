// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data}
// } // normally use database => in this case use file.json as database

const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// require("dotenv").config; //comment in mongoDB topic
// const fsPromises = require('fs').promises
// const path = require('path')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; //node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET; //node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('Access token secret or refresh token secret is not defined in environment variables');
}

const handleLogin = async (req, res) => {
    const { username, password } = req.body
    if(!username || !password ) { return res.status(400).json({ 'message': 'username and password are required'})}
    // const foundUser = usersDB.users.find(user => user.username === username) // user === req.body.user
    const foundUser = await User.findOne({ username }).exec();
    if(!foundUser) return res.sendStatus(401) //Unauthorized : case not match username
    const match = await bcrypt.compare(password, foundUser.password)
    console.log("match: ", match)
    if(match) {
        // check roles 
        const roles = Object.values(foundUser.roles)

        // create JWT 
        // expire accessToken is shorter than refreshToken
        const accessToken = jwt.sign( //pass payload to jwt => username, ACCESS_TOKEN_SECRET, expireIn
            // {"username": foundUser.username}, // old payload
            { "UserInfo": {
                "username": foundUser.username,
                "roles": roles // add role 
            }},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'} // 30 seconds
        )
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'} // 1 days
        )

        // saving refreshToken with current user
        // const otherUsers = usersDB.users.filter(user => user.username !== foundUser.username)
        // const currentUser = {...foundUser, refreshToken};
        // usersDB.setUsers([...otherUsers, currentUser])
        // await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users))

        // in mongo DB
        foundUser.refreshToken = refreshToken 
        const result = await foundUser.save()
        console.log("result auth: ", result)
        // sameSite: None for not block frontend when fetch api from backend if domain are not the same with backend
        // res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true,  maxAge: 24*60*60*1000})  // set cookie to httpOnly cause make javascript can not access it
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24*60*60*1000})  // set cookie to httpOnly cause make javascript can not access it
        res.json({ accessToken }); //send accessToken to frontend in json : normally store in database
    }else {
        res.sendStatus(401)
    }
}   

module.exports = { handleLogin }
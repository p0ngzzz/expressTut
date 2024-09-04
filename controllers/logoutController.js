// logout Controller =>erased refreshToken
// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data}
// } // normally use database => in this case use file.json as database
const User = require('../model/User');
const jwt = require('jsonwebtoken');
// const fsPromises = require('fs').promises
// const path = require('path')

const handleLogout = async (req, res) => {
    // on client or frontend also delete the accessToken when click logout button

    const cookies = req.cookies
    // check have cookies.jwt
    if (!cookies?.jwt) return res.status(204); //No Content
    const refreshToken = cookies.jwt
    // Is refreshToken in DB
    // const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken)
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None'}) // clear cookie of jwt
        return res.sendStatus(204) 
    }
    //  if found refreshToken => delete refreshToken in DB
    // in json db
    // const otherUsers = usersDB.users.filter(user => user.refreshToken === foundUser.refreshToken)
    // const currentUser = {...foundUser, refreshToken: ''}
    // usersDB.setUsers([...otherUsers, currentUser])
    // await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users), (err) => {
    //     if (err) throw err;
    // })

    // in mongoDB
    foundUser.refreshToken = ""
    const result = await foundUser.save(); 
    console.log("result logout: ", result)

    res.clearCookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None'}) // secure: true - only serves on https
    res.sendStatus(204); // No content
}   

module.exports = { handleLogout }
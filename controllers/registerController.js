// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function(data) {this.users = data}
// } //  use json for db

// store data in mongoDB
const User = require('../model/User')
const fs = require("fs")
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt") //package for Bcrypt : hash and salt password 

const handlerNewUser = async (req, res) => {
    const { username, password } = req.body
    // check null user, pwd
    if(!username || !password) {
        return res.status(400).json({
            'message': 'username and password is required`'
        })
    }
    // check duplicate username
    // const duplicateUser =  usersDB.users.find(user => user.username === username) // user = req.body.user ( use json for db)
    const duplicateUser = await User.findOne({ username }).exec() //exec() use for handle promise 
    if(duplicateUser) { return res.sendStatus(409)} //conflict //res.sendStatus() is send text for status code 
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10) //10 is mean 10 salt round it will hash 10 round then store in db
        // use mongoDB as database
        // 1st way: to store data in mongoDB
        const result = await User.create({
            "username": username,
            "password": hashedPwd,
        })
        // 2nd way: to store data in mongoDB
        // const newUser = new User({
        //     "username": username,
        //     "password": hashedPwd
        // })
        // const result = newUser.save();

        console.log("result register: ", result)
        // store the new user (json)
        // const  newUser = {
        //     "username": username,
        //     "roles": { "User": 2001 },
        //     "password": hashedPwd
        // }

        // use json for db
        // usersDB.setUsers([...usersDB.users, newUser])
        // if(!fs.existsSync(path.join(__dirname, '..', 'model', 'users.json'))) {
        //     await fsPromises.writeFile(
        //         path.join(__dirname, '..', 'model', 'users.json')
        //     ,  JSON.stringify(userDB.users)
        //     );
        // }else {
        //     await fsPromises.writeFile(
        //         path.join(__dirname, '..', 'model', 'users.json')
        //     ,  JSON.stringify(usersDB.users)
        //     );
        // }
        res.status(201).json({
            'success': `New User ${username} created`
        })
        
    } catch (err) {
        res.status(500).json({
            'message': err.message
        })
    }
}

module.exports = { handlerNewUser }
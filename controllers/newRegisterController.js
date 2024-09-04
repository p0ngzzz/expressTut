const userDB = {
    users: require("../model/new_user.json"), // Ensure this file exists and has an initial array, even if empty
    setUsers: function (users) {
      this.users = users;
    },
  };
  
  const express = require("express");
  const router = express.Router();
  const path = require("path");
  const fs = require("fs");
  const fsPromise = require("fs").promises;
  const bcrypt = require("bcrypt");
  
  const registerUsers = async (req, res) => {
    const { username, password } = req.body; // 2 key username and password
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }
  
    // Ensure userDB.users is an array and check for duplicate users
    if (!Array.isArray(userDB.users)) {
      userDB.users = []; // Initialize as an empty array if not already
    }
  
    const duplicateUsers = userDB.users.find(
      (user) => user.username === username
    );
    
    if (duplicateUsers) {
      console.log("Duplicate Users");
      return res.status(409).json({ message: `Username: ${username} already exists` }); // Change to 409 Conflict for duplicate
    }
  
    try {
      const hashedPwd = await bcrypt.hash(password, 12);
      const newUser = {
        username: username,
        password: hashedPwd,
      };
  
      // Properly add new user to the users array
      const users = [...userDB.users, newUser];
      userDB.setUsers(users);
  
      // Ensure the directory exists and write the updated users array to the file
      const dirPath = path.join(__dirname, '..', 'model');
      const filePath = path.join(dirPath, 'new_user.json');
  
      if (!fs.existsSync(dirPath)) {
        await fsPromise.mkdir(dirPath); // No need for a callback with promises
        await fsPromise.writeFile(filePath, JSON.stringify(userDB.users));

      }
  
      await fsPromise.writeFile(filePath, JSON.stringify(userDB.users));
  
      res.status(201).json({ allUsers: userDB.users }); // Use 201 Created for successful creation
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' }); // Return a 500 status code for errors
    }
  };
  
  module.exports = { registerUsers };
  
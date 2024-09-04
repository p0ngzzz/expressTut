// Routing in Express.js
// now we clean code : clean app.get in file index.js(server.js) to router 
const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {  //http://localhost:3500/subdir/index
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html')) // .. mean back to directory before
})
router.get("/test(.html)?", (req, res) => {  //http://localhost:3500/subdir/test
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'))
})

module.exports = router;



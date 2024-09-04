// Authorization need 2 routes
// - registration route: for a new usr account
// - authorization route: after create account and going to login

const express = require("express");
const router = express.Router();
const path = require("path");
const registerController = require("../../controllers/registerController");

router.post('/', registerController.handlerNewUser)

module.exports = router

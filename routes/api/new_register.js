const express = require('express');
const router = express.Router();

const newRegisterController = require("../../controllers/newRegisterController")

router.post('/', newRegisterController.registerUsers)

module.exports = router

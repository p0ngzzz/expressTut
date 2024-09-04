// employees
const express = require('express');
const router = express.Router();
const path = require("path");

const employees = require('../model/employees.json')
// console.log(employees)

router.route('/')
    .get((req, res) => {
        res.json(employees) //res.json is method for send response back to browser after request
    })
    .post((req, res) => {
        res.json({
            "firstName": req.body.firstName,
            "lastName": req.body.lastName
        })
    })
    .put((req, res) => {
        res.json({
            "firstName": req.body.firstName,
            "lastName": req.body.lastName
        })
    })
    .delete((req, res) => {
        res.json({
            "id": req.body.id
        })
    });

router.route("/:id") //params = id
    .get((req, res) => {
        res.json({
            "id": req.params.id
        })
    })
module.exports = router;
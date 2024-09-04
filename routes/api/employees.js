// set all route api in routes
const express= require('express')
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
// const verifyJWT = require('../../middleware/jwt');
const ROLES_USER = require('../../config/rolesUser');
const verifyRoles = require('../../middleware/verifyRoles')
// now we want post put delete about role Admin, Editor

router.route('/')
    // .get(verifyJWT, employeesController.getAllEmployees)
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_USER.Admin, ROLES_USER.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_USER.Admin, ROLES_USER.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_USER.Admin, ROLES_USER.Editor), employeesController.deleteEmployee)

router.route('/:id')
    .get(employeesController.getEmployee)

module.exports = router


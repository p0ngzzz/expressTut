const express = require('express');
const router = express.Router()
const path = require('path')
const productsController = require('../../controllers/productsController')

router.route('/')
    .get(productsController.getAllProducts)
    .post(productsController.createProducts)
    .put(productsController.updateProducts)
    .delete(productsController.removeProduct)

router.route('/:productID')
    .get(productsController.getProduct)

module.exports = router
const express = require('express');
const router = express.Router()
const path = require('path') 

router.get("^/$|/products(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'product', 'index.html'))
})
router.get("/product(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'product', 'product.html'))
})

module.exports = router

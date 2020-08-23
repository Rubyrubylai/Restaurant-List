const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
    res.redirect('/restaurants')
})

module.exports = router
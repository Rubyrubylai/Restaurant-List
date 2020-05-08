const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', {restaurants: restaurants})
        })
})

module.exports = router
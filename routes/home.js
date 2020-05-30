const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
    Restaurant.find({ userId: req.user._id })
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', { restaurants: restaurants })
        })
})

module.exports = router
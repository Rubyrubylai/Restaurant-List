const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/login', (req, res) => {
    return res.render('login')
})

router.post('/login', (req, res) => {
    return res.redirect('/')
})

router.get('/register', (req, res) => {
    return res.render('register')
})

router.post('register', (req, res) => {

})

router.get('/logout', (req, res) => {
    return res.redirect('/users/login')
})

module.exports = router
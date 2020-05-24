const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
    return res.render('login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',     
        failureRedirect: '/users/login'
    })(req, res, next)
})

router.get('/register', (req, res) => {
    return res.render('register')
})

router.post('register', (req, res) => {

})

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/users/login')
})

module.exports = router
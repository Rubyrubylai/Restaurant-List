const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

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

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []
    User.findOne({ email: email }).then(user => {
        if (user) {
            errors.push({ msg: '此用戶已經存在' })
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })
    } else {
        if (!email || !password || !password2){
            errors.push({ msg: '帳號和密碼欄位為必填' }) 
        }
        if (password !== password2){
            errors.push({ msg: '密碼不一致' })
        }
        if (errors.length > 0){
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })
        } else {
            const newUser = new User({
                name,
                email,
                password,
                password2
            })
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err
                    newUser.password = hash
                    newUser.save()
                        .then(user => {
                            res.redirect('/')
                        })
                        .catch(err => console.log(err))
                })
            })
        }     
        }
    })
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', '你已成功登出')
    res.redirect('/users/login')
})

module.exports = router
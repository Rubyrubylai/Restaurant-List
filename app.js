const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Handlebars = require('handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const { authenticated } = require('./config/auth')


if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
})

app.use(express.static('public'))

app.engine('handlebars', exphbs({ defaultlayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)


app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated() 
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

app.use('/restaurants', authenticated, require('./routes/restaurant'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auth'))
app.use('/', authenticated, require('./routes/home'))

Handlebars.registerHelper('ifEquals', (a, b, options) => {
    if (a===b) {
        return options.fn(this)
    }
    else{
        return options.inverse(this)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Express is listening on ${process.env.PORT}`)
})
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Handlebars = require('handlebars')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
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

function change(){ 
    var num=document.getElementById("rating")
    var location=document.getElementById("show") 
    location.value=num.value
} 

Handlebars.registerHelper('ifEquals', (a, b, options) => {
    if (a===b) {
        return options.fn(this)
    }
    else{
        return options.inverse(this)
    }
})

app.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', {restaurants: restaurants})
        })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
    Restaurant.findById(req.params.restaurant_id)
        .lean()
        .exec((err, restaurant) => {
            if (err) return console.error(err)
            res.render('show', {restaurant: restaurant})
        })
})

app.get('/search', (req, res) => {
    Restaurant.find()
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            const regex = new RegExp(req.query.keyword, 'i')
            restaurants = restaurants.filter(restaurants => restaurants.name.match(regex))
            return res.render('index', {restaurants: restaurants, keyword: req.query.keyword})
        })
})

app.get('/new', (req, res) => {
    res.render('new')
})

app.post('/new', (req, res) => {
    const restaurant = new Restaurant({
        name: req.body.name,
        name_en: req.body.name_en,
        category: req.body.category,
        location: req.body.location,
        google_map: req.body.google_map,
        phone: req.body.phone,
        rating: req.body.rating,
        description: req.body.description,
        image: req.body.image        
    })
    restaurant.save(err => {
        if (err) return console.error(err)
        res.redirect('/')
    })
})

app.get('/edit/:restaurant_id', (req, res) => {
    Restaurant.findById(req.params.restaurant_id)
        .lean()
        .exec((err, restaurant) => {
            console.log(restaurant)
            if (err) console.error(err)
            res.render('edit', {restaurant: restaurant})
        })
})

app.put('/edit/:restaurant_id', (req, res) => {
    Restaurant.findById(req.params.restaurant_id, (err, restaurant) => {
        if (err) console.error(err)
        restaurant.name = req.body.name
        restaurant.name_en = req.body.name_en
        restaurant.category = req.body.category
        restaurant.location = req.body.location
        restaurant.google_map = req.body.google_map
        restaurant.phone = req.body.phone
        restaurant.rating = req.body.rating
        restaurant.description = req.body.description
        restaurant.image = req.body.image  
        restaurant.save(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})

app.delete('/delete/:restaurant_id', (req, res) => {
    Restaurant.findById(req.params.restaurant_id, (err, restaurant) => {
        if (err) return console.error(err) 
        restaurant.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})

app.get('/sort/rating', (req, res) => {
    Restaurant.find()
        .sort({rating: 'asc'})
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', {restaurants: restaurants})
        })
})

app.get('/sort/name', (req, res) => {
    Restaurant.find()
        .sort({name: 'asc'})
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', {restaurants: restaurants})
        })
})

app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})
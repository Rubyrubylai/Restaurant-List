const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

const restaurantList = require('./restaurant.json')

app.use(express.static('public'))

app.engine('handlebars', exphbs({defaultlayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('index', {restaurants: restaurantList.results})
})

app.get('/restaurants/:restaurant_id', (req, res) => {
    const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
    res.render('show', {restaurant: restaurant})
})

app.get('/search', (req, res) => {
    const regex = new RegExp(req.query.keyword, 'i')
    let restaurants = restaurantList.results.filter(restaurant => restaurant.name.match(regex))
    res.render('index', {restaurants: restaurants, keyword: req.query.keyword})
})

app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})
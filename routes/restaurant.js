const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const Favorite = require('../models/favorite') 

router.get('/', (req, res) => {
    Restaurant.find({ userId: req.user._id })
        .lean()
        .exec((err, restaurants) => {
            let favorite = true
            //搜尋餐廳
            if (req.query.keyword) {   
                const regex = new RegExp(req.query.keyword, 'i')
                restaurants = restaurants.filter(restaurant => restaurant.name.match(regex))
            }
            //排序餐廳
            restaurants.sort((a, b) => {
                if (req.query.sort === 'nameA') {
                    return a.name > b.name
                }
                if (req.query.sort === 'nameZ') {
                    return b.name > a.name
                }
                if (req.query.sort === 'rating') {
                    return b.rating > a.rating
                }
                if (req.query.sort === 'category') {
                    return a.category > b.category
                }
            })
            if (err) return console.error(err)
            return res.render('index', { restaurants, favorite })
        })
})

//進入新增餐廳的頁面
router.get('/new', (req, res) => {
    return res.render('new')
})

//新增餐廳
router.post('/new', (req, res) => {
    const { name, name_en, category, location, google_map, phone, rating, description, image } = req.body
    const userId = req.user._id
    if (!name || !name_en || !category || !location || !google_map || !phone || !rating || !description || !image){          
        return res.render('new', {
            //將資料回傳到前端
            restaurant: { name, name_en, category, location, google_map, phone, rating, description, image },
            error_msg: '所有欄位皆為必填'
        })
    } 
    else {
        const restaurant = new Restaurant({
            name,
            name_en,
            category,
            location,
            google_map,
            phone,
            rating,
            description,
            image,
            userId
        })
        restaurant.save(err => {
            if (err) return console.error(err)
            console.log(restaurant)
            const favorite = new Favorite({
                restaurantId: restaurant._id,
                userId,
                isSame: restaurant._id
            })
            favorite.save(err => {
                if (err) return console.error(err)
                return res.redirect('/restaurants')
            })
            
        })
    }      
})


//顯示餐廳詳細資料
router.get('/:restaurant_id', (req, res) => {
    Restaurant.findOne({ _id: req.params.restaurant_id })
        .lean()
        .exec((err, restaurant) => {
            if (err) return console.error(err)
            return res.render('show', { restaurant })
        })
})

//進入編輯餐廳的頁面
router.get('/:restaurant_id/edit', (req, res) => {
    Restaurant.findOne({ _id: req.params.restaurant_id, userId: req.user._id })
        .lean()
        .exec((err, restaurant) => {
            if (err) console.error(err)
            return res.render('edit', { restaurant: restaurant, action: `/restaurants/${req.params.restaurant_id}/edit?_method=PUT` })
        })
})

//編輯餐廳
router.put('/:restaurant_id/edit', (req, res) => {
    const { name, name_en, category, location, google_map, phone, rating, description, image } = req.body
    if (!name || !name_en || !category || !location || !google_map || !phone || !rating || !description || !image){       
        return res.render('edit', {
            restaurant: req.body,
            error_msg: '所有欄位皆為必填'
        })
     } 
    Restaurant.findOne({ _id: req.params.restaurant_id, userId: req.user._id }, (err, restaurant) => {
        if (err) console.error(err)
        const { name, name_en, category, location, google_map, phone, rating, description, image } = req.body
        restaurant.name = name
        restaurant.name_en = name_en
        restaurant.category = category
        restaurant.location = location
        restaurant.google_map = google_map
        restaurant.phone = phone
        restaurant.rating = rating
        restaurant.description = description
        restaurant.image = image  
        restaurant.save(err => {
            if (err) return console.error(err)
            return res.redirect('/restaurants')
        })    
    })
})

//刪除餐廳
router.delete('/:restaurant_id/delete', (req, res) => {
    Restaurant.findOne({ _id: req.params.restaurant_id, userId: req.user._id }, (err, restaurant) => {
        if (err) return console.error(err) 
        restaurant.remove(err => {
            if (err) return console.error(err)
            Favorite.findOne({ isSame: req.params.restaurant_id, userId: req.user._id }, (err, favorite) => {
                if (err) return console.error(err) 
                favorite.remove(err => {
                    if (err) return console.error(err) 
                    return res.redirect('/restaurants')
                })
            })
        })
    })
})

module.exports = router
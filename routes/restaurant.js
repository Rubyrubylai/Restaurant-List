const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const restaurant = require('../models/restaurant')

const sortType = [
    {
        id: 'nameA',
        name: 'name',
        type: 'asc'
    },
    {
        id: 'nameZ',
        name: 'name',
        type: 'desc'
    },
    {
        id: 'rating',
        name: 'rating',
        type: 'asc'
    },
    {
        id: 'category',
        name: 'category',
        type: 'asc'
    }
]

router.get('/', (req, res) => {
    Restaurant.find({ userId: req.user._id })
        .lean()
        .exec((err, restaurants) => {
            //搜尋餐廳
            if (req.query.keyword) {   
                const regex = new RegExp(req.query.keyword, 'i')
                restaurants = restaurants.filter(restaurant => restaurant.name.match(regex))
            }
            //排序餐廳
            if (req.query.sort) {
                const sort = sortType.find(sort => { return sort.id === req.query.sort})
                console.log(typeof(sort.name))
                //restaurants = restaurants.sort({ : sort.type})
            }
            if (err) return console.error(err)
            return res.render('index', { restaurants })
        })
})

//排序餐廳
router.get('/sort', (req, res) => {
    const sort = sortType.find(sort => {return sort.id === req.query.sort})
    Restaurant.find()
        .sort({[`${sort.name}`]: sort.type})
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', { restaurants: restaurants })
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
            return res.redirect('/')
        })
    }      
})


//顯示餐廳詳細資料
router.get('/:restaurant_id', (req, res) => {
    Restaurant.findOne({ _id: req.params.restaurant_id, userId: req.user._id })
        .lean()
        .exec((err, restaurant) => {
            if (err) return console.error(err)
            return res.render('show', { restaurant: restaurant })
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
            return res.redirect('/')
        })    
    })
})

//刪除餐廳
router.delete('/:restaurant_id/delete', (req, res) => {
    Restaurant.findOne({ _id: req.params.restaurant_id, userId: req.user._id }, (err, restaurant) => {
        if (err) return console.error(err) 
        restaurant.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})

module.exports = router
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { authenticated } = require('../config/auth')

//搜尋餐廳
router.get('/search', authenticated, (req, res) => {
    Restaurant.find()
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            const regex = new RegExp(req.query.keyword, 'i')
            restaurants = restaurants.filter(restaurants => restaurants.name.match(regex))
            return res.render('index', {restaurants: restaurants, keyword: req.query.keyword})
        })
})

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

//排序餐廳
router.get('/sort', authenticated, (req, res) => {
    const sort = sortType.find(sort => {return sort.id === req.query.sort})
    Restaurant.find()
        .sort({[`${sort.name}`]: sort.type})
        .lean()
        .exec((err, restaurants) => {
            if (err) return console.error(err)
            return res.render('index', {restaurants: restaurants})
        })
})

//進入新增餐廳的頁面
router.get('/new', authenticated, (req, res) => {
    return res.render('new')
})

//新增餐廳
router.post('/new', authenticated, (req, res) => {
    const {name, name_en, category, location, google_map, phone, rating, description, image} = req.body
    const userId = req.user._id
    let errors = []

    if (!name || !name_en || !category || !location || !google_map || !phone || !rating || !description || !image){
        errors.push({messages: '所有欄位皆為必填'})
    }
    
    if (errors.length > 0){
        res.render('new', {
            errors,
            name,
            name_en,
            category,
            location,
            google_map,
            phone,
            rating,
            description,
            image
        })
    } else {
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
router.get('/:restaurant_id', authenticated, (req, res) => {
    Restaurant.findOne({_id: req.params.restaurant_id, userId: req.user._id})
        .lean()
        .exec((err, restaurant) => {
            if (err) return console.error(err)
            return res.render('show', {restaurant: restaurant})
        })
})

//進入編輯餐廳的頁面
router.get('/:restaurant_id/edit', authenticated, (req, res) => {
    Restaurant.findOne({_id: req.params.restaurant_id, userId: req.user._id})
        .lean()
        .exec((err, restaurant) => {
            if (err) console.error(err)
            return res.render('edit', {restaurant: restaurant})
        })
})

//編輯餐廳
router.put('/:restaurant_id/edit', authenticated, (req, res) => {
    Restaurant.findOne({_id: req.params.restaurant_id, userId: req.user._id}, (err, restaurant) => {
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

//刪除餐廳
router.delete('/:restaurant_id/delete', authenticated, (req, res) => {
    Restaurant.findOne({_id: req.params.restaurant_id, userId: req.user._id}, (err, restaurant) => {
        if (err) return console.error(err) 
        restaurant.remove(err => {
            if (err) return console.error(err)
            return res.redirect('/')
        })
    })
})

module.exports = router